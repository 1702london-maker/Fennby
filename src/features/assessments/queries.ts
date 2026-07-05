import { createClient } from "@/lib/supabase/server";

export async function getPublishedAssessment() {
  const supabase = await createClient();
  const { data: assessment } = await supabase
    .from("assessments")
    .select("*")
    .eq("published", true)
    .limit(1)
    .maybeSingle();

  if (!assessment) return null;

  const { data: assessmentQuestions } = await supabase
    .from("assessment_questions")
    .select("position, questions(*)")
    .eq("assessment_id", assessment.id)
    .order("position", { ascending: true });

  const questions = (assessmentQuestions ?? [])
    .map((aq) => aq.questions)
    .filter((q): q is NonNullable<typeof q> => q !== null);

  return { assessment, questions };
}
