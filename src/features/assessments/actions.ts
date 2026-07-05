"use server";

import { z } from "zod";
import { withRole } from "@/lib/auth/withRole";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/action-result";

const submitAssessmentSchema = z.object({
  assessmentId: z.string().uuid(),
  mode: z.enum(["practice", "timed", "simulation", "print_shade"]),
  answers: z.array(z.object({ questionId: z.string().uuid(), choiceIndex: z.number().int() })),
});
export type SubmitAssessmentInput = z.infer<typeof submitAssessmentSchema>;

async function getOwnLearnerId(profileId: string, supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data } = await supabase.from("learners").select("id").eq("auth_id", profileId).maybeSingle();
  return data?.id ?? null;
}

export const submitAssessmentAttempt = withRole(
  ["child"],
  async (session, input: SubmitAssessmentInput): Promise<ActionResult<{ score: number }>> => {
    const parsed = submitAssessmentSchema.safeParse(input);
    if (!parsed.success) return { ok: false, error: "validation_failed" };

    const supabase = await createClient();
    const learnerId = await getOwnLearnerId(session.id, supabase);
    if (!learnerId) return { ok: false, error: "not_found" };

    // Product rule: a brain warm-up must have been completed recently before a mock starts.
    const { data: recentWarmup } = await supabase
      .from("brain_warmups")
      .select("id")
      .eq("learner_id", learnerId)
      .not("completed_at", "is", null)
      .gte("completed_at", new Date(Date.now() - 1000 * 60 * 60).toISOString())
      .limit(1)
      .maybeSingle();

    if (!recentWarmup) {
      return { ok: false, error: "warmup_required" };
    }

    const { data: attempt, error: attemptError } = await supabase
      .from("assessment_attempts")
      .insert({
        assessment_id: parsed.data.assessmentId,
        learner_id: learnerId,
        mode: parsed.data.mode,
        completed_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (attemptError || !attempt) return { ok: false, error: attemptError?.message ?? "internal" };

    const questionIds = parsed.data.answers.map((a) => a.questionId);
    const { data: questions } = await supabase
      .from("questions")
      .select("id, correct_answer, topic_key")
      .in("id", questionIds);

    const questionMap = new Map((questions ?? []).map((q) => [q.id, q]));

    const { error: answersError } = await supabase.from("attempt_answers").insert(
      parsed.data.answers.map((a) => ({
        attempt_id: attempt.id,
        question_id: a.questionId,
        choice_index: a.choiceIndex,
      }))
    );
    if (answersError) return { ok: false, error: answersError.message };

    const correctCount = parsed.data.answers.filter(
      (a) => questionMap.get(a.questionId)?.correct_answer === a.choiceIndex
    ).length;
    const score = Math.round((correctCount / parsed.data.answers.length) * 100);

    const { data: result, error: resultError } = await supabase
      .from("assessment_results")
      .insert({ attempt_id: attempt.id, learner_id: learnerId, score })
      .select("id")
      .single();
    if (resultError || !result) return { ok: false, error: resultError?.message ?? "internal" };

    // Topic breakdown: group by topic_key.
    const byTopic = new Map<string, { correct: number; total: number }>();
    for (const a of parsed.data.answers) {
      const q = questionMap.get(a.questionId);
      if (!q?.topic_key) continue;
      const entry = byTopic.get(q.topic_key) ?? { correct: 0, total: 0 };
      entry.total += 1;
      if (q.correct_answer === a.choiceIndex) entry.correct += 1;
      byTopic.set(q.topic_key, entry);
    }

    if (byTopic.size) {
      await supabase.from("topic_performance").insert(
        Array.from(byTopic.entries()).map(([topicKey, { correct, total }]) => ({
          result_id: result.id,
          topic_key: topicKey,
          score: Math.round((correct / total) * 100),
        }))
      );
    }

    // Weakest topic becomes a revision item — the simplest real version of
    // "weak topics become revision" without a full mastery-decay model yet.
    const weakest = Array.from(byTopic.entries()).sort(
      (a, b) => a[1].correct / a[1].total - b[1].correct / b[1].total
    )[0];
    if (weakest && weakest[1].correct / weakest[1].total < 0.75) {
      await supabase.from("revision_items").insert({
        learner_id: learnerId,
        topic: weakest[0],
        subject: "Verbal Reasoning",
        reason: `Lowest topic score (${Math.round((weakest[1].correct / weakest[1].total) * 100)}%) on the most recent mock.`,
        priority: "high",
        recommended_activity: `Focused practice on ${weakest[0]}`,
        status: "not_started",
      });
    }

    return { ok: true, data: { score } };
  }
);
