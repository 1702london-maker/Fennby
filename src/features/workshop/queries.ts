import { createClient } from "@/lib/supabase/server";

export async function getQuestionsForTopic(topicKey: string, limit = 5) {
  const supabase = await createClient();
  const { data } = await supabase.from("questions").select("*").eq("topic_key", topicKey).eq("status", "published").limit(limit);
  return data ?? [];
}

export async function getWorkshopHistoryForLearner(learnerId: string) {
  const supabase = await createClient();
  const [{ data: sessions }, { data: reteach }, { data: homework }] = await Promise.all([
    supabase.from("workshop_sessions").select("*").eq("learner_id", learnerId).order("started_at", { ascending: false }).limit(10),
    supabase.from("workshop_reteach_log").select("*").eq("learner_id", learnerId).order("created_at", { ascending: false }).limit(10),
    supabase.from("homework_help_requests").select("*").eq("learner_id", learnerId).order("created_at", { ascending: false }).limit(10),
  ]);
  return {
    sessions: sessions ?? [],
    reteachLog: reteach ?? [],
    homeworkRequests: homework ?? [],
  };
}
