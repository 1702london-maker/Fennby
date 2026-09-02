import { createClient } from "@/lib/supabase/server";

export async function getQuestionsForTopic(topicKey: string, limit = 5) {
  const supabase = await createClient();
  const { data } = await supabase.from("questions").select("*").eq("topic_key", topicKey).eq("status", "published").limit(limit);
  return data ?? [];
}

export async function getWrapUpQuestionsForTopic(topicKey: string, excludedIds: string[], limit = 6) {
  const supabase = await createClient();
  let query = supabase
    .from("questions")
    .select("*")
    .eq("topic_key", topicKey)
    .eq("status", "published")
    .limit(40);

  if (excludedIds.length) {
    query = query.not("id", "in", `(${excludedIds.join(",")})`);
  }

  const { data: topicQuestions } = await query;
  const selected = shuffle(topicQuestions ?? []).slice(0, limit);
  if (selected.length >= limit) return selected;

  const fallbackQuery = supabase.from("questions").select("*").eq("status", "published").limit(80);
  const { data: fallbackQuestions } = await fallbackQuery;
  const seen = new Set([...excludedIds, ...selected.map((q) => q.id)]);
  return [
    ...selected,
    ...shuffle(fallbackQuestions ?? []).filter((q) => !seen.has(q.id)).slice(0, limit - selected.length),
  ];
}

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
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
