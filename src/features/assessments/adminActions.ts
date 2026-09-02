"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { withRole } from "@/lib/auth/withRole";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ActionResult } from "@/lib/action-result";

const markPrintShadeSchema = z.object({
  attemptId: z.string().uuid(),
  score: z.coerce.number().int().min(0).max(100),
  notes: z.string().max(1000).optional(),
});

export type PrintShadeMarkingItem = {
  id: string;
  learnerName: string;
  assessmentTitle: string;
  uploadedImageUrl: string;
  signedUrl: string | null;
  startedAt: string;
  markingStatus: string;
};

export async function getPrintShadeMarkingQueue(): Promise<PrintShadeMarkingItem[]> {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("assessment_attempts")
    .select("id, uploaded_image_url, started_at, marking_status, learners(preferred_name), assessments(title)")
    .eq("mode", "print_shade")
    .in("marking_status", ["pending", "processing", "needs_review"])
    .order("started_at", { ascending: true });

  const rows = data ?? [];
  const signedUrls = await Promise.all(
    rows.map(async (row) => {
      if (!row.uploaded_image_url) return null;
      const { data: signed } = await supabase.storage
        .from("learner-submissions")
        .createSignedUrl(row.uploaded_image_url, 60 * 30);
      return signed?.signedUrl ?? null;
    }),
  );

  return rows.map((row, index) => ({
    id: row.id,
    learnerName: row.learners?.preferred_name ?? "Learner",
    assessmentTitle: row.assessments?.title ?? "Mock exam",
    uploadedImageUrl: row.uploaded_image_url ?? "",
    signedUrl: signedUrls[index],
    startedAt: row.started_at,
    markingStatus: row.marking_status,
  }));
}

export const markPrintShadeAttempt = withRole(
  ["admin"],
  async (_session, input: z.input<typeof markPrintShadeSchema>): Promise<ActionResult> => {
    const parsed = markPrintShadeSchema.safeParse(input);
    if (!parsed.success) return { ok: false, error: "validation_failed" };

    const supabase = createAdminClient();
    const { data: attempt, error: attemptError } = await supabase
      .from("assessment_attempts")
      .select("id, learner_id")
      .eq("id", parsed.data.attemptId)
      .eq("mode", "print_shade")
      .maybeSingle();

    if (attemptError || !attempt) return { ok: false, error: attemptError?.message ?? "not_found" };

    const { data: existingResult } = await supabase
      .from("assessment_results")
      .select("id")
      .eq("attempt_id", attempt.id)
      .maybeSingle();

    const resultPayload = {
      attempt_id: attempt.id,
      learner_id: attempt.learner_id,
      score: parsed.data.score,
    };
    const { error: resultError } = existingResult
      ? await supabase.from("assessment_results").update(resultPayload).eq("id", existingResult.id)
      : await supabase.from("assessment_results").insert(resultPayload);

    if (resultError) return { ok: false, error: resultError.message };

    const { error: updateError } = await supabase
      .from("assessment_attempts")
      .update({
        completed_at: new Date().toISOString(),
        marking_status: "marked",
        marking_notes: parsed.data.notes || null,
      })
      .eq("id", attempt.id);

    if (updateError) return { ok: false, error: updateError.message };

    revalidatePath("/admin/mock-exams");
    revalidatePath("/child/mock-exams/results");
    revalidatePath("/parent");
    return { ok: true, data: null };
  },
);
