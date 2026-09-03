import { createClient } from "@/lib/supabase/server";

// Regional dashboard aggregates — anonymised at school/cohort level, no
// individual pupil data ever surfaced to this role.
export async function getRegionalStats() {
  const supabase = await createClient();

  const [{ count: schoolCount }, { count: classCount }, { data: results }] = await Promise.all([
    supabase.from("schools").select("*", { count: "exact", head: true }).eq("approved", true),
    supabase.from("classes").select("*", { count: "exact", head: true }),
    supabase.from("assessment_results").select("score"),
  ]);

  const avgProgress = results?.length
    ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length)
    : 0;

  return {
    schoolCount: schoolCount ?? 0,
    classCount: classCount ?? 0,
    avgProgress,
  };
}

export async function getRegionalImpactReport() {
  const supabase = await createClient();
  const [schools, learners, results, revisionItems, safeguardingCases] = await Promise.all([
    supabase.from("schools").select("id", { count: "exact", head: true }).eq("approved", true),
    supabase.from("learners").select("id, send_notes, accessibility_needs"),
    supabase.from("assessment_results").select("score"),
    supabase.from("revision_items").select("status, priority"),
    supabase.from("safeguarding_cases").select("id", { count: "exact", head: true }).eq("status", "open"),
  ]);

  const scored = results.data ?? [];
  const avgScore = scored.length ? Math.round(scored.reduce((sum, row) => sum + Number(row.score ?? 0), 0) / scored.length) : 0;
  const sendLearners = (learners.data ?? []).filter((learner) => learner.send_notes || learner.accessibility_needs);
  const openInterventions = (revisionItems.data ?? []).filter((item) => item.status !== "done");
  const highPriorityInterventions = openInterventions.filter((item) => item.priority === "high");

  return {
    approvedSchools: schools.count ?? 0,
    learners: learners.data?.length ?? 0,
    sendLearners: sendLearners.length,
    completedAssessments: scored.length,
    averageScore: avgScore,
    openInterventions: openInterventions.length,
    highPriorityInterventions: highPriorityInterventions.length,
    openSafeguardingCases: safeguardingCases.count ?? 0,
  };
}
