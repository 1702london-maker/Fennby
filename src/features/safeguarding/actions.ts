"use server";

import { z } from "zod";
import { getSessionProfile } from "@/lib/auth/session";
import { withRole } from "@/lib/auth/withRole";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/action-result";

const reportConcernSchema = z.object({
  learnerId: z.string().uuid().optional(),
  concernType: z.string().min(1),
  description: z.string().min(1),
});
export type ReportConcernInput = z.infer<typeof reportConcernSchema>;

// Reachable from every logged-in screen, by any role — this is the one
// safeguarding endpoint that is intentionally NOT role-restricted.
export async function reportConcern(input: ReportConcernInput): Promise<ActionResult> {
  const session = await getSessionProfile();
  if (!session) return { ok: false, error: "unauthenticated" };

  const parsed = reportConcernSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "validation_failed" };

  if (!parsed.data.learnerId) {
    return { ok: false, error: "validation_failed", fields: { learnerId: ["A learner must be specified"] } };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("safeguarding_cases").insert({
    title: `Concern reported by ${session.fullName}`,
    learner_id: parsed.data.learnerId,
    reported_by: session.fullName,
    concern_type: parsed.data.concernType,
    priority: "medium",
    description: parsed.data.description,
    status: "open",
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true, data: null };
}

const updateCaseSchema = z.object({
  caseId: z.string().uuid(),
  status: z.enum(["open", "investigating", "resolved"]).optional(),
  actionsTaken: z.string().optional(),
  outcome: z.string().optional(),
});
export type UpdateCaseInput = z.infer<typeof updateCaseSchema>;

export const updateCase = withRole(
  ["safeguarding", "admin"],
  async (_session, input: UpdateCaseInput): Promise<ActionResult> => {
    const parsed = updateCaseSchema.safeParse(input);
    if (!parsed.success) return { ok: false, error: "validation_failed" };

    const supabase = await createClient();
    const { error } = await supabase
      .from("safeguarding_cases")
      .update({
        status: parsed.data.status,
        actions_taken: parsed.data.actionsTaken,
        outcome: parsed.data.outcome,
      })
      .eq("id", parsed.data.caseId);

    if (error) return { ok: false, error: error.message };
    return { ok: true, data: null };
  }
);
