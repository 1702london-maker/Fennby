"use server";

import { z } from "zod";
import { withRole } from "@/lib/auth/withRole";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/action-result";

const lessonNoteSchema = z.object({
  sessionId: z.string().uuid(),
  learnerId: z.string().uuid(),
  topic: z.string().optional(),
  learningObjective: z.string().optional(),
  covered: z.string().optional(),
  strengths: z.string().optional(),
  weaknesses: z.string().optional(),
  confidence: z.enum(["low", "medium", "high"]).optional(),
  homeworkAssigned: z.string().optional(),
  parentSummary: z.string().min(1, "A parent-facing summary is required"),
  safeguardingConcern: z.boolean().default(false),
});
export type LessonNoteInput = z.infer<typeof lessonNoteSchema>;

export const submitLessonNote = withRole(
  ["tutor"],
  async (session, input: LessonNoteInput): Promise<ActionResult> => {
    const parsed = lessonNoteSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, error: "validation_failed", fields: parsed.error.flatten().fieldErrors };
    }
    const supabase = await createClient();

    // Ownership check: the session must belong to this tutor.
    const { data: lessonSession } = await supabase
      .from("lesson_sessions")
      .select("id, tutor_id, subject, learner_id")
      .eq("id", parsed.data.sessionId)
      .maybeSingle();

    if (!lessonSession || lessonSession.tutor_id !== session.id) {
      return { ok: false, error: "forbidden" };
    }

    const { error } = await supabase.from("lesson_notes").insert({
      session_id: parsed.data.sessionId,
      learner_id: parsed.data.learnerId,
      tutor_id: session.id,
      topic: parsed.data.topic,
      learning_objective: parsed.data.learningObjective,
      covered: parsed.data.covered,
      strengths: parsed.data.strengths,
      weaknesses: parsed.data.weaknesses,
      confidence: parsed.data.confidence,
      homework_assigned: parsed.data.homeworkAssigned,
      parent_summary: parsed.data.parentSummary,
      safeguarding_concern: parsed.data.safeguardingConcern,
    });

    if (error) return { ok: false, error: error.message };

    if (parsed.data.safeguardingConcern) {
      await supabase.from("safeguarding_cases").insert({
        title: `Concern raised during session with ${parsed.data.learnerId}`,
        learner_id: parsed.data.learnerId,
        reported_by: session.fullName,
        concern_type: "Tutor-raised session concern",
        priority: "medium",
        description: parsed.data.covered ?? "",
        status: "open",
      });
    }

    return { ok: true, data: null };
  }
);

export const markTrainingModuleComplete = withRole(
  ["tutor"],
  async (session, moduleId: string): Promise<ActionResult> => {
    const supabase = await createClient();
    const { error } = await supabase
      .from("tutor_training_progress")
      .upsert(
        { tutor_id: session.id, module_id: moduleId, completed_at: new Date().toISOString() },
        { onConflict: "tutor_id,module_id" }
      );
    if (error) return { ok: false, error: error.message };
    return { ok: true, data: null };
  }
);
