import { createClient } from "@/lib/supabase/server";

export async function getMessagesForConversation(conversationId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("ai_tutor_messages")
    .select("*")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });
  return data ?? [];
}

export async function getAiTutorWrapUpQuestions(limit = 6) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("questions")
    .select("id, text, options, correct_answer, explanation, subject_key")
    .eq("status", "published")
    .limit(100);

  return shuffle(data ?? []).slice(0, limit);
}

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

// Parent-visible history — the same RLS that lets a parent read this also
// lets this function stay this simple; there's no extra "is this allowed"
// check needed in application code because the database already enforces it.
export async function getAiTutorHistoryForLearner(learnerId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("ai_tutor_conversations")
    .select("*, ai_tutor_messages(id, role, content, created_at)")
    .eq("learner_id", learnerId)
    .order("started_at", { ascending: false })
    .limit(10);
  return data ?? [];
}
