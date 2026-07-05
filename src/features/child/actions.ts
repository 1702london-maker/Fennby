"use server";

import { withRole } from "@/lib/auth/withRole";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/action-result";
import type { Database } from "@/types/database";

type MoodType = Database["public"]["Enums"]["mood_type"];

async function getOwnLearnerId(profileId: string): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("learners").select("id").eq("auth_id", profileId).maybeSingle();
  return data?.id ?? null;
}

export const submitMoodCheckin = withRole(["child"], async (session, mood: MoodType): Promise<ActionResult> => {
  const learnerId = await getOwnLearnerId(session.id);
  if (!learnerId) return { ok: false, error: "not_found" };

  const supabase = await createClient();
  const { error } = await supabase.from("mood_checkins").insert({ learner_id: learnerId, mood });
  if (error) return { ok: false, error: error.message };
  return { ok: true, data: null };
});

export const completeBrainWarmup = withRole(["child"], async (session): Promise<ActionResult> => {
  const learnerId = await getOwnLearnerId(session.id);
  if (!learnerId) return { ok: false, error: "not_found" };

  const supabase = await createClient();
  const { error } = await supabase.from("brain_warmups").insert({
    learner_id: learnerId,
    activity_type: "pattern_recognition",
    completed_at: new Date().toISOString(),
  });
  if (error) return { ok: false, error: error.message };
  return { ok: true, data: null };
});
