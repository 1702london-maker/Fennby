"use server";

import { withRole } from "@/lib/auth/withRole";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/action-result";
import type { Database } from "@/types/database";

type MoodType = Database["public"]["Enums"]["mood_type"];
type WarmupAnswerInput = {
  questionId: string;
  subjectKey: string;
  topicKey: string;
  choiceIndex: number;
  correctAnswer: number;
  isCorrect: boolean;
};

async function getOwnLearnerId(profileId: string): Promise<string | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("learners").select("id").eq("auth_id", profileId).maybeSingle();
  return data?.id ?? null;
}

export const submitMoodCheckin = withRole(["child"], async (session, mood: MoodType): Promise<ActionResult> => {
  const learnerId = await getOwnLearnerId(session.id);
  if (!learnerId) return { ok: false, error: "not_found" };

  const supabase = await createClient();
  const { error } = await supabase.from("mood_checkins").insert({ learner_id: learnerId, mood });
  if (error) return { ok: false, error: error.message };
  return { ok: true, data: null };
});

export const completeBrainWarmup = withRole(
  ["child"],
  async (
    session,
    result?: { score?: number; total?: number; answers?: WarmupAnswerInput[] },
  ): Promise<ActionResult> => {
  const learnerId = await getOwnLearnerId(session.id);
  if (!learnerId) return { ok: false, error: "not_found" };

  const supabase = await createClient();
  const total = Math.max(1, result?.total ?? 1);
  const score = Math.max(0, Math.min(total, result?.score ?? 0));
  const { data: warmup, error } = await supabase
    .from("brain_warmups")
    .insert({
      learner_id: learnerId,
      activity_type: "mixed_question_bank",
      completed_at: new Date().toISOString(),
      score: Math.round((score / total) * 100),
    })
    .select("id")
    .single();
  if (error) return { ok: false, error: error.message };

  const answers = (result?.answers ?? []).filter((answer) => !answer.questionId.startsWith("fallback-"));
  if (warmup && answers.length) {
    const { error: answersError } = await supabase.from("brain_warmup_answers").insert(
      answers.map((answer) => ({
        warmup_id: warmup.id,
        learner_id: learnerId,
        question_id: answer.questionId,
        subject_key: answer.subjectKey,
        topic_key: answer.topicKey,
        choice_index: answer.choiceIndex,
        correct_answer: answer.correctAnswer,
        is_correct: answer.isCorrect,
      })),
    );
    if (answersError) return { ok: false, error: answersError.message };
  }

  return { ok: true, data: null };
});
