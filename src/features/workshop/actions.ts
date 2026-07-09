"use server";

import { z } from "zod";
import { withRole } from "@/lib/auth/withRole";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/action-result";

async function getOwnLearnerId(profileId: string, supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data } = await supabase.from("learners").select("id").eq("auth_id", profileId).maybeSingle();
  return data?.id ?? null;
}

const startSchema = z.object({
  subjectKey: z.string().optional(),
  topicKey: z.string().optional(),
});

export const startWorkshopSession = withRole(
  ["child"],
  async (session, input: z.infer<typeof startSchema>): Promise<ActionResult<{ sessionId: string }>> => {
    const parsed = startSchema.safeParse(input);
    if (!parsed.success) return { ok: false, error: "validation_failed" };

    const supabase = await createClient();
    const learnerId = await getOwnLearnerId(session.id, supabase);
    if (!learnerId) return { ok: false, error: "not_found" };

    const { data, error } = await supabase
      .from("workshop_sessions")
      .insert({ learner_id: learnerId, subject_key: parsed.data.subjectKey ?? null, topic_key: parsed.data.topicKey ?? null })
      .select("id")
      .single();
    if (error || !data) return { ok: false, error: error?.message ?? "start_failed" };
    return { ok: true, data: { sessionId: data.id } };
  }
);

export const endWorkshopSession = withRole(
  ["child"],
  async (session, sessionId: string): Promise<ActionResult> => {
    const supabase = await createClient();
    const learnerId = await getOwnLearnerId(session.id, supabase);
    if (!learnerId) return { ok: false, error: "not_found" };

    const { data: existing } = await supabase
      .from("workshop_sessions")
      .select("started_at")
      .eq("id", sessionId)
      .eq("learner_id", learnerId)
      .maybeSingle();
    if (!existing) return { ok: false, error: "not_found" };

    const minutes = Math.max(1, Math.round((Date.now() - new Date(existing.started_at).getTime()) / 60000));
    const { error } = await supabase
      .from("workshop_sessions")
      .update({ ended_at: new Date().toISOString(), minutes_spent: minutes })
      .eq("id", sessionId);
    if (error) return { ok: false, error: error.message };
    return { ok: true, data: null };
  }
);

const reteachSchema = z.object({
  topicKey: z.string(),
  questionId: z.string().uuid().optional(),
  approachUsed: z.enum(["worked_example", "visual_approach", "different_analogy", "step_by_step"]),
});

// Adaptive re-teaching: logged every time, so a parent or tutor can see not
// just what a child got wrong, but what re-teaching approach was tried.
export const logReteach = withRole(
  ["child"],
  async (session, input: z.infer<typeof reteachSchema>): Promise<ActionResult> => {
    const parsed = reteachSchema.safeParse(input);
    if (!parsed.success) return { ok: false, error: "validation_failed" };

    const supabase = await createClient();
    const learnerId = await getOwnLearnerId(session.id, supabase);
    if (!learnerId) return { ok: false, error: "not_found" };

    const { error } = await supabase.from("workshop_reteach_log").insert({
      learner_id: learnerId,
      topic_key: parsed.data.topicKey,
      question_id: parsed.data.questionId ?? null,
      approach_used: parsed.data.approachUsed,
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true, data: null };
  }
);

// Homework help via photo upload — reuses the same PhotoUploadFlow
// interaction as print-and-shade mock exams (Part 4.3), just a different
// destination table.
export const submitHomeworkHelp = withRole(
  ["child"],
  async (session): Promise<ActionResult<{ requestId: string }>> => {
    const supabase = await createClient();
    const learnerId = await getOwnLearnerId(session.id, supabase);
    if (!learnerId) return { ok: false, error: "not_found" };

    const { data, error } = await supabase
      .from("homework_help_requests")
      .insert({ learner_id: learnerId, status: "processing" })
      .select("id")
      .single();
    if (error || !data) return { ok: false, error: error?.message ?? "submit_failed" };
    return { ok: true, data: { requestId: data.id } };
  }
);
