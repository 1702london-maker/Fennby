"use server";

import { withRole } from "@/lib/auth/withRole";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/action-result";
import type { Database } from "@/types/database";

type TutorStatus = Database["public"]["Enums"]["tutor_status"];

export const setTutorApplicationStatus = withRole(
  ["admin"],
  async (session, applicationId: string, status: TutorStatus): Promise<ActionResult> => {
    const supabase = await createClient();

    const { data: application, error: appError } = await supabase
      .from("tutor_applications")
      .update({ status, reviewed_by: session.id })
      .eq("id", applicationId)
      .select("*")
      .single();

    if (appError || !application) return { ok: false, error: appError?.message ?? "not_found" };

    if (status === "approved") {
      const { error: upsertError } = await supabase.from("tutor_profiles").upsert(
        {
          id: application.profile_id,
          application_id: application.id,
          subjects: application.subjects,
          age_groups: application.age_groups,
          experience_years: application.experience_years,
          qualifications: application.qualifications,
          exam_boards: application.exam_boards,
          dbs_status: application.dbs_status,
          send_experience: application.send_experience,
          status: "approved",
        },
        { onConflict: "id" }
      );
      if (upsertError) return { ok: false, error: upsertError.message };
    } else if (status === "suspended") {
      // Cancel future sessions for a suspended tutor — closing a safeguarding gap,
      // not left as a follow-up job.
      await supabase
        .from("lesson_sessions")
        .update({ status: "cancelled" })
        .eq("tutor_id", application.profile_id)
        .eq("status", "upcoming");
      await supabase.from("tutor_profiles").update({ status: "suspended" }).eq("id", application.profile_id);
    } else {
      await supabase.from("tutor_profiles").update({ status }).eq("id", application.profile_id);
    }

    return { ok: true, data: null };
  }
);

// Part 7: verified examiner history is a distinct, deliberate admin action,
// separate from general approval, so a tutor's own claim never gets shown
// with verified weight just because their application was approved.
export const verifyExaminerHistory = withRole(
  ["admin"],
  async (session, tutorProfileId: string, boards: string[]): Promise<ActionResult> => {
    const supabase = await createClient();
    const { error } = await supabase
      .from("tutor_profiles")
      .update({
        examiner_verified: true,
        examiner_boards_verified: boards,
        examiner_verified_at: new Date().toISOString(),
      })
      .eq("id", tutorProfileId);
    if (error) return { ok: false, error: error.message };

    await supabase.from("audit_logs").insert({
      actor_id: session.id,
      action: "examiner_history_verified",
      entity: "tutor_profiles",
      entity_id: tutorProfileId,
      diff: { boards },
    });

    return { ok: true, data: null };
  }
);

export const approveSchool = withRole(["admin"], async (session, schoolId: string): Promise<ActionResult> => {
  void session;
  const supabase = await createClient();
  const { error } = await supabase.from("schools").update({ approved: true }).eq("id", schoolId);
  if (error) return { ok: false, error: error.message };
  return { ok: true, data: null };
});

export const suspendUser = withRole(["admin"], async (session, userId: string): Promise<ActionResult> => {
  const supabase = await createClient();
  const { error } = await supabase.from("profiles").update({ status: "suspended" }).eq("id", userId);
  if (error) return { ok: false, error: error.message };
  await supabase.from("audit_logs").insert({
    actor_id: session.id,
    action: "suspend_user",
    entity: "profiles",
    entity_id: userId,
  });
  return { ok: true, data: null };
});
