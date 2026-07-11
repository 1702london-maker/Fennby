"use server";

import { z } from "zod";
import OpenAI from "openai";
import { withRole } from "@/lib/auth/withRole";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/action-result";
import { containsProfanity, containsSexualContent } from "@/lib/moderation";

async function getOwnLearnerId(profileId: string, supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data } = await supabase.from("learners").select("id").eq("auth_id", profileId).maybeSingle();
  return data?.id ?? null;
}

// Bounded to educational purpose only, never open-ended general chat —
// enforced here in the system prompt, not left to the model's judgement.
const SYSTEM_PROMPT = `You are the Fennby AI Tutor, a warm, patient practice companion for a school-age child — never a replacement for a real, vetted human tutor.

Write exactly the way a kind human tutor would talk out loud to a child: plain, natural sentences, like you're sitting next to them. Never use markdown formatting of any kind — no asterisks, no bullet points, no numbered lists, no headings, no bold or italics. Never use a dash or hyphen to join or interrupt a sentence; write in full, simple sentences instead. If you're listing a few steps, say them as a sentence ("First try this, then check your answer by doing this") rather than a formatted list.

Rules you must always follow:
- Only help with schoolwork: explaining concepts, working through problems step by step, and conversational language practice (French, Spanish, German).
- Refuse anything outside education — no general chit-chat, no topics unrelated to learning, no personal advice, no unsafe content. If asked something off-topic, gently redirect to schoolwork.
- Keep answers age-appropriate, warm, and encouraging, never condescending.
- Never swear or repeat back swear words, even if the child uses one.
- Never claim to be a real person or a qualified teacher. If the child seems distressed or mentions something concerning (safety, wellbeing), tell them to speak to a trusted adult and stop the conversation there.
- Keep responses short and conversational, a few sentences at most, not an essay.`;

// Belt-and-braces cleanup in case the model still slips into markdown or
// dash-heavy phrasing despite the system prompt.
function humanizeReply(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/^#+\s*/gm, "")
    .replace(/^[-•]\s+/gm, "")
    .replace(/\s+[-–—]\s+/g, ", ")
    .replace(/[–—]/g, ",")
    .trim();
}

const CALM_REDIRECT =
  "I can hear that's a strong word, but let's keep our chat friendly so I can help you best. Want to try that question again, or ask me something else about your schoolwork?";

export const startAiTutorConversation = withRole(
  ["child"],
  async (session, subjectKey?: string): Promise<ActionResult<{ conversationId: string }>> => {
    const supabase = await createClient();
    const learnerId = await getOwnLearnerId(session.id, supabase);
    if (!learnerId) return { ok: false, error: "not_found" };

    const { data, error } = await supabase
      .from("ai_tutor_conversations")
      .insert({ learner_id: learnerId, subject_key: subjectKey ?? null })
      .select("id")
      .single();
    if (error || !data) return { ok: false, error: error?.message ?? "start_failed" };
    return { ok: true, data: { conversationId: data.id } };
  }
);

const sendMessageSchema = z.object({
  conversationId: z.string().uuid(),
  content: z.string().min(1).max(2000),
});

// Every message — both the child's and the AI's reply — is written to the
// database before this action returns anything to the client. Parent
// visibility (Part 5.2) is enforced by RLS on ai_tutor_messages, not by
// this function remembering to expose it — it can't be switched off from
// here even by accident.
export const sendAiTutorMessage = withRole(
  ["child"],
  async (session, input: z.infer<typeof sendMessageSchema>): Promise<ActionResult<{ reply: string }>> => {
    const parsed = sendMessageSchema.safeParse(input);
    if (!parsed.success) return { ok: false, error: "validation_failed" };

    const supabase = await createClient();
    const learnerId = await getOwnLearnerId(session.id, supabase);
    if (!learnerId) return { ok: false, error: "not_found" };

    const { data: conversation } = await supabase
      .from("ai_tutor_conversations")
      .select("id, learner_id")
      .eq("id", parsed.data.conversationId)
      .maybeSingle();
    if (!conversation || conversation.learner_id !== learnerId) return { ok: false, error: "forbidden" };

    await supabase.from("ai_tutor_messages").insert({
      conversation_id: parsed.data.conversationId,
      role: "user",
      content: parsed.data.content,
    });

    // Two distinct escalation tiers, not one flat "flagged" bucket. Sexual
    // content from a child is a safeguarding escalation — critical severity,
    // an active alert, and the full triggering message logged verbatim for
    // the DSL — on top of (not instead of) the standard passive visibility
    // every AI Tutor conversation already has for the parent.
    const isSexual = containsSexualContent(parsed.data.content);
    const isProfane = containsProfanity(parsed.data.content);
    if (isSexual || isProfane) {
      const { data: learner } = await supabase
        .from("learners")
        .select("id, parent_id, preferred_name")
        .eq("id", learnerId)
        .maybeSingle();

      await supabase.from("safeguarding_cases").insert({
        title: isSexual
          ? `URGENT: Sexual content flagged — ${learner?.preferred_name ?? "a child"} in AI Tutor`
          : `Language flag: ${learner?.preferred_name ?? "a child"} in AI Tutor`,
        learner_id: learnerId,
        reported_by: "AI Tutor (automatic)",
        concern_type: isSexual ? "sexual_content" : "language",
        priority: isSexual ? "high" : "low",
        severity: isSexual ? "critical" : "medium",
        description: isSexual
          ? `Sexual content was detected automatically in an AI Tutor conversation and requires immediate DSL review. Full triggering message: "${parsed.data.content}"`
          : "Inappropriate language was detected automatically in an AI Tutor conversation. The parent has been notified.",
        status: "open",
      });

      if (learner?.parent_id) {
        await supabase.from("notifications").insert({
          profile_id: learner.parent_id,
          type: isSexual ? "ai_tutor_safeguarding_alert" : "ai_tutor_language_flag",
          payload: { learnerId, learnerName: learner.preferred_name, conversationId: parsed.data.conversationId },
        });
      }

      await supabase.from("ai_tutor_messages").insert({
        conversation_id: parsed.data.conversationId,
        role: "assistant",
        content: CALM_REDIRECT,
      });

      return { ok: true, data: { reply: CALM_REDIRECT } };
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      // Real, honest failure mode rather than a fabricated response — the
      // key genuinely isn't configured in this environment yet.
      return { ok: false, error: "ai_tutor_not_configured" };
    }

    const { data: history } = await supabase
      .from("ai_tutor_messages")
      .select("role, content")
      .eq("conversation_id", parsed.data.conversationId)
      .order("created_at", { ascending: true })
      .limit(20);

    const client = new OpenAI({ apiKey });
    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...(history ?? []).map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
      ],
      max_tokens: 400,
    });

    const reply = humanizeReply(
      completion.choices[0]?.message?.content ?? "Sorry, I couldn't think of a reply, try asking again."
    );

    await supabase.from("ai_tutor_messages").insert({
      conversation_id: parsed.data.conversationId,
      role: "assistant",
      content: reply,
    });

    return { ok: true, data: { reply } };
  }
);

export const endAiTutorConversation = withRole(
  ["child"],
  async (session, conversationId: string): Promise<ActionResult> => {
    const supabase = await createClient();
    const learnerId = await getOwnLearnerId(session.id, supabase);
    if (!learnerId) return { ok: false, error: "not_found" };

    const { error } = await supabase
      .from("ai_tutor_conversations")
      .update({ ended_at: new Date().toISOString() })
      .eq("id", conversationId)
      .eq("learner_id", learnerId);
    if (error) return { ok: false, error: error.message };
    return { ok: true, data: null };
  }
);
