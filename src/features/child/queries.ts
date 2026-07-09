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

export async function getSubjectsWithTopics() {
  const supabase = await createClient();
  const [{ data: subjects }, { data: topics }] = await Promise.all([
    supabase.from("subjects").select("*"),
    supabase.from("topics").select("*"),
  ]);
  return {
    subjects: subjects ?? [],
    topics: topics ?? [],
  };
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

// Activities open for booking, of the given type(s), each annotated with
// this learner's own registration status if one exists.
export async function getActivitiesForLearner(learnerId: string, types: string[]) {
  const supabase = await createClient();
  const [{ data: activities }, { data: registrations }] = await Promise.all([
    supabase.from("activities").select("*").in("type", types).eq("status", "open"),
    supabase.from("activity_registrations").select("*").eq("learner_id", learnerId),
  ]);

  const regsByActivity = new Map((registrations ?? []).map((r) => [r.activity_id, r]));
  return (activities ?? []).map((a) => ({ ...a, myRegistration: regsByActivity.get(a.id) ?? null }));
}
