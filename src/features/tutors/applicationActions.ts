"use server";

import { z } from "zod";
import { withRole } from "@/lib/auth/withRole";
import { getSessionProfile } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/action-result";
import type { Database } from "@/types/database";

type TutorApplicationRow = Database["public"]["Tables"]["tutor_applications"]["Row"];

const submitApplicationSchema = z.object({
  experienceYears: z.coerce.number().int().min(0),
  subjects: z.string().min(1, "List at least one subject"),
  dbsReference: z.string().min(1, "Enter your DBS certificate or reference number"),
  sendExperience: z.array(z.string()).default([]),
});
export type SubmitTutorApplicationInput = z.infer<typeof submitApplicationSchema>;

// Called right after signUp()+login() on the /apply-tutor form, once a
// real tutor-role session exists. One application per account — calling
// this again just returns the existing application rather than erroring,
// so a page refresh mid-flow doesn't create duplicates.
export const submitTutorApplication = withRole(
  ["tutor"],
  async (session, input: SubmitTutorApplicationInput): Promise<ActionResult<{ applicationId: string }>> => {
    const parsed = submitApplicationSchema.safeParse(input);
    if (!parsed.success) {
      return { ok: false, error: "validation_failed", fields: parsed.error.flatten().fieldErrors };
    }
    const supabase = await createClient();

    const { data: existing } = await supabase
      .from("tutor_applications")
      .select("id")
      .eq("profile_id", session.id)
      .maybeSingle();
    if (existing) return { ok: true, data: { applicationId: existing.id } };

    const { data: created, error } = await supabase
      .from("tutor_applications")
      .insert({
        profile_id: session.id,
        subjects: parsed.data.subjects.split(",").map((s) => s.trim()).filter(Boolean),
        experience_years: parsed.data.experienceYears,
        qualifications: `DBS reference: ${parsed.data.dbsReference}`,
        send_experience: parsed.data.sendExperience,
        status: "under_review",
      })
      .select("id")
      .single();

    if (error || !created) return { ok: false, error: error?.message ?? "submit_failed" };
    return { ok: true, data: { applicationId: created.id } };
  }
);

// Used by the confirmation and agreement pages to check real status,
// rather than assuming the agreement is reachable immediately after
// submission.
export async function getMyTutorApplication(): Promise<TutorApplicationRow | null> {
  const session = await getSessionProfile();
  if (!session || session.role !== "tutor") return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("tutor_applications")
    .select("*")
    .eq("profile_id", session.id)
    .maybeSingle();
  return data;
}

const signAgreementSchema = z.object({
  fullName: z.string().min(1),
});

// Only succeeds once an application has actually been reviewed and
// approved — this is the real gate the build spec asks for, not just a
// UI-level "preview" link.
export const signTutorAgreement = withRole(
  ["tutor"],
  async (session, input: z.infer<typeof signAgreementSchema>): Promise<ActionResult> => {
    const parsed = signAgreementSchema.safeParse(input);
    if (!parsed.success) return { ok: false, error: "validation_failed" };

    const supabase = await createClient();
    const { data: application } = await supabase
      .from("tutor_applications")
      .select("id, status")
      .eq("profile_id", session.id)
      .maybeSingle();

    if (!application || application.status !== "approved") {
      return { ok: false, error: "not_approved_yet" };
    }

    const { error } = await supabase
      .from("tutor_applications")
      .update({ agreement_signed_at: new Date().toISOString(), status: "training_pending" })
      .eq("id", application.id);
    if (error) return { ok: false, error: error.message };

    await supabase
      .from("tutor_profiles")
      .update({ status: "training_pending" })
      .eq("id", session.id);

    return { ok: true, data: null };
  }
);
