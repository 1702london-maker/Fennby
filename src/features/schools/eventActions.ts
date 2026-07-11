"use server";

import { withRole } from "@/lib/auth/withRole";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/action-result";

// Part 6.1: one general inter-school event entity supporting every event
// type Fennby runs between schools, not a quiz-only data model.
export async function getInterSchoolEvents() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("inter_school_events")
    .select("*, inter_school_event_registrations(school_id)")
    .order("event_date", { ascending: true });
  return data ?? [];
}

export const registerSchoolForEvent = withRole(
  ["school_admin", "teacher"],
  async (session, eventId: string): Promise<ActionResult> => {
    const supabase = await createClient();
    const { data: schoolUser } = await supabase
      .from("school_users")
      .select("school_id")
      .eq("profile_id", session.id)
      .maybeSingle();
    if (!schoolUser) return { ok: false, error: "not_school_linked" };

    const { error } = await supabase.from("inter_school_event_registrations").insert({
      event_id: eventId,
      school_id: schoolUser.school_id,
      registered_by: session.id,
    });
    if (error) return { ok: false, error: error.message };
    return { ok: true, data: null };
  }
);
