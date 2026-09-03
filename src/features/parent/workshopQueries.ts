import { createClient } from "@/lib/supabase/server";

export async function getWorkshopSummaryForLearner(learnerId: string) {
  const supabase = await createClient();
  const [{ data: sessions }, { data: homeworkRequests }] = await Promise.all([
    supabase
      .from("workshop_sessions")
      .select("*")
      .eq("learner_id", learnerId)
      .order("started_at", { ascending: false })
      .limit(5),
    supabase
      .from("homework_help_requests")
      .select("*")
      .eq("learner_id", learnerId)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const totalMinutes = (sessions ?? []).reduce((sum, s) => sum + (s.minutes_spent ?? 0), 0);
  return { sessions: sessions ?? [], homeworkRequests: homeworkRequests ?? [], totalMinutes };
}
