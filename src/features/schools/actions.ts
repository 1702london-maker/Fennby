"use server";

import { z } from "zod";
import { withRole } from "@/lib/auth/withRole";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/action-result";

const createAssignmentSchema = z.object({
  title: z.string().min(1),
  type: z.enum(["homework", "quiz", "mock", "reading", "revision"]),
  targetType: z.enum(["learner", "class", "year_group"]),
  targetId: z.string().min(1),
  dueDate: z.string().optional(),
});
export type CreateAssignmentInput = z.infer<typeof createAssignmentSchema>;

export const createAssignment = withRole(
  ["school_admin", "teacher"],
  async (session, input: CreateAssignmentInput): Promise<ActionResult> => {
    const parsed = createAssignmentSchema.safeParse(input);
    if (!parsed.success) return { ok: false, error: "validation_failed" };

    const supabase = await createClient();
    let learnerIds: string[] = [];

    if (parsed.data.targetType === "learner") {
      learnerIds = [parsed.data.targetId];
    } else if (parsed.data.targetType === "class") {
      const { data } = await supabase
        .from("class_memberships")
        .select("learner_id")
        .eq("class_id", parsed.data.targetId);
      learnerIds = (data ?? []).map((m) => m.learner_id);
    }

    if (!learnerIds.length) return { ok: false, error: "not_found" };

    const { error } = await supabase.from("homework").insert(
      learnerIds.map((learnerId) => ({
        learner_id: learnerId,
        title: parsed.data.title,
        subject: parsed.data.type,
        assigned_by: session.fullName,
        due_date: parsed.data.dueDate || null,
      }))
    );

    if (error) return { ok: false, error: error.message };
    return { ok: true, data: null };
  }
);
