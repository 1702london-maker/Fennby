import { createClient } from "@/lib/supabase/server";

export async function getThreadsForTutor(tutorId: string) {
  const supabase = await createClient();
  // Threads are per-learner; a tutor can see threads for learners they're assigned to.
  const { data: sessions } = await supabase.from("lesson_sessions").select("learner_id").eq("tutor_id", tutorId);
  const learnerIds = Array.from(new Set((sessions ?? []).map((s) => s.learner_id)));
  if (!learnerIds.length) return [];

  const { data } = await supabase
    .from("message_threads")
    .select("*, learners(preferred_name, avatar_emoji)")
    .in("learner_id", learnerIds);
  return data ?? [];
}

export async function getThreadForLearner(learnerId: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("message_threads").select("*").eq("learner_id", learnerId).maybeSingle();
  return data;
}

export async function getOrCreateThreadForLearner(learnerId: string) {
  const supabase = await createClient();
  const existing = await getThreadForLearner(learnerId);
  if (existing) return existing;

  const { data, error } = await supabase.from("message_threads").insert({ learner_id: learnerId }).select("*").single();
  if (error) throw error;
  return data;
}

export async function getMessages(threadId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("messages")
    .select("*, profiles(full_name, role)")
    .eq("thread_id", threadId)
    .is("deleted_at", null)
    .order("created_at", { ascending: true });
  return data ?? [];
}
