"use server";

import { createClient } from "@/lib/supabase/server";
import { withRole } from "@/lib/auth/withRole";
import { createLearnerSchema, type CreateLearnerInput } from "@/features/learners/schema";
import type { ActionResult } from "@/lib/action-result";

export const createLearner = withRole(
  ["parent"],
  async (session, input: CreateLearnerInput): Promise<ActionResult<{ learnerId: string }>> => {
    const parsed = createLearnerSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, error: "validation_failed", fields: parsed.error.flatten().fieldErrors };
    }
    const { consent: _consent, ...rest } = parsed.data;
    void _consent;

    const supabase = await createClient();
    const { data, error } = await supabase
      .from("learners")
      .insert({
        parent_id: session.id,
        first_name: rest.firstName,
        preferred_name: rest.preferredName,
        date_of_birth: rest.dateOfBirth,
        year_group: rest.yearGroup,
        current_school: rest.currentSchool,
        target_exam: rest.targetExam,
        target_school: rest.targetSchool,
        exam_board: rest.examBoard,
        learning_goals: rest.learningGoals,
        send_notes: rest.sendNotes,
        accessibility_needs: rest.accessibilityNeeds,
      })
      .select("id")
      .single();

    if (error || !data) return { ok: false, error: error?.message ?? "internal" };
    return { ok: true, data: { learnerId: data.id } };
  }
);
