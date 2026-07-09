import { createClient } from "@/lib/supabase/server";

export async function getMyLearnerProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase.from("learners").select("*").eq("auth_id", user.id).maybeSingle();
  return data;
}

export async function getRevisionItemsForLearner(learnerId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("revision_items")
    .select("*")
    .eq("learner_id", learnerId)
    .neq("status", "done");
  return data ?? [];
}

export async function getNextSession(learnerId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("lesson_sessions")
    .select("*")
    .eq("learner_id", learnerId)
    .eq("status", "upcoming")
    .order("scheduled_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  return data;
}

export async function getLatestBadge(learnerId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("learner_achievements")
    .select("*, achievements(*)")
    .eq("learner_id", learnerId)
    .order("awarded_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data;
}

export async function getLatestResultWithTopics(learnerId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("assessment_results")
    .select("*, topic_performance(*), assessment_attempts(accommodations_used)")
    .eq("learner_id", learnerId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data;
}
