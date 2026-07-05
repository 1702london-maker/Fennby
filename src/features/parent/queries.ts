import { createClient } from "@/lib/supabase/server";

export async function getMyLearners() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("learners")
    .select("*")
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data;
}

export async function getLatestResult(learnerId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("assessment_results")
    .select("*, topic_performance(*)")
    .eq("learner_id", learnerId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data;
}

export async function getMoodTrend(learnerId: string, limit = 5) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("mood_checkins")
    .select("*")
    .eq("learner_id", learnerId)
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data ?? []).reverse();
}

export async function getUpcomingSessions(learnerId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("lesson_sessions")
    .select("*, tutor_profiles(id)")
    .eq("learner_id", learnerId)
    .eq("status", "upcoming")
    .order("scheduled_at", { ascending: true });
  return data ?? [];
}

export async function getRecentMessages(learnerId: string, limit = 3) {
  const supabase = await createClient();
  const { data: thread } = await supabase
    .from("message_threads")
    .select("id")
    .eq("learner_id", learnerId)
    .maybeSingle();

  if (!thread) return [];

  const { data } = await supabase
    .from("messages")
    .select("*")
    .eq("thread_id", thread.id)
    .is("deleted_at", null)
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data ?? []).reverse();
}

export async function getRevisionItems(learnerId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("revision_items")
    .select("*")
    .eq("learner_id", learnerId)
    .neq("status", "done")
    .order("priority", { ascending: true });
  return data ?? [];
}

export async function getLearnerAchievements(learnerId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("learner_achievements")
    .select("*, achievements(*)")
    .eq("learner_id", learnerId)
    .order("awarded_at", { ascending: false });
  return data ?? [];
}

export async function getApprovedTutors() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("tutor_profiles")
    .select("*, profiles(full_name)")
    .eq("status", "approved")
    .order("rating", { ascending: false });
  return data ?? [];
}

export async function getExamHistory(learnerId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("assessment_results")
    .select("*, topic_performance(*)")
    .eq("learner_id", learnerId)
    .order("created_at", { ascending: false });
  return data ?? [];
}
