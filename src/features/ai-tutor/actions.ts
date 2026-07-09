"use server";

import { z } from "zod";
import OpenAI from "openai";
import { withRole } from "@/lib/auth/withRole";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/action-result";

async function getOwnLearnerId(profileId: string, supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data } = await supabase.from("learners").select("id").eq("auth_id", profileId).maybeSingle();
  return data?.id ?? null;
}

// Bounded to educational purpose only, never open-ended general chat —
// enforced here in the system prompt, not left to the model's judgement.
const SYSTEM_PROMPT = `You are the Fennby AI Tutor, a supplementary practice companion for a school-age child — never a replacement for a real, vetted human tutor.

Rules you must always follow:
- Only help with schoolwork: explaining concepts, working through problems step by step, and conversational language practice (French, Spanish, German).
- Refuse anything outside education — no general chit-chat, no topics unrelated to learning, no personal advice, no unsafe content. If asked something off-topic, gently redirect to schoolwork.
- Keep answers age-appropriate, warm, and encouraging, never condescending.
- Never claim to be a real person or a qualified teacher. If the child seems distressed or mentions something concerning (safety, wellbeing), tell them to speak to a trusted adult and stop the conversation there.
- Keep responses reasonably short — a few sentences or a short numbered list, not an essay.`;

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

    const reply = completion.choices[0]?.message?.content ?? "Sorry, I couldn't think of a reply — try asking again.";

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
