"use server";

import { z } from "zod";
import { withRole } from "@/lib/auth/withRole";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/action-result";

const submitCurriculumSchema = z.object({
  subjectKey: z.string().min(1),
  title: z.string().min(1),
  content: z.string().min(1),
});
export type SubmitCurriculumInput = z.infer<typeof submitCurriculumSchema>;

// Part 5.2/5.3: submitted → under_review → approved / changes_requested,
// a genuine stored state, same principle as tutor onboarding.
export const submitCurriculum = withRole(
  ["tutor"],
  async (session, input: SubmitCurriculumInput): Promise<ActionResult> => {
    const parsed = submitCurriculumSchema.safeParse(input);
    if (!parsed.success) return { ok: false, error: "validation_failed" };

    const supabase = await createClient();
    const { error } = await supabase.from("curricula").insert({
      tutor_id: session.id,
      subject_key: parsed.data.subjectKey,
      title: parsed.data.title,
      content: parsed.data.content,
      status: "submitted",
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true, data: null };
  }
);

export async function getMyCurricula() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];
  const { data } = await supabase.from("curricula").select("*").eq("tutor_id", user.id).order("created_at", { ascending: false });
  return data ?? [];
}

export async function getAllCurricula() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("curricula")
    .select("*, tutor:tutor_profiles!tutor_id(profiles(full_name))")
    .order("created_at", { ascending: false });
  return data ?? [];
}

const reviewSchema = z.object({
  curriculumId: z.string().uuid(),
  status: z.enum(["under_review", "approved", "changes_requested"]),
  reviewerNotes: z.string().optional(),
});

export const reviewCurriculum = withRole(
  ["admin"],
  async (session, input: z.infer<typeof reviewSchema>): Promise<ActionResult> => {
    const parsed = reviewSchema.safeParse(input);
    if (!parsed.success) return { ok: false, error: "validation_failed" };

    const supabase = await createClient();
    const { error } = await supabase
      .from("curricula")
      .update({
        status: parsed.data.status,
        reviewer_notes: parsed.data.reviewerNotes,
        reviewed_by: session.id,
        reviewed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", parsed.data.curriculumId);
    if (error) return { ok: false, error: error.message };
    return { ok: true, data: null };
  }
);
