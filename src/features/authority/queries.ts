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
