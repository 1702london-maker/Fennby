import { createClient } from "@/lib/supabase/server";
import { emergencyWarmupFallback } from "@/lib/warmup-fallback";

export type WarmupQuestion = {
  id: string;
  subjectKey: string;
  topicKey: string;
  question: string;
  options: string[];
  correctAnswer: number;
};

type TopicWithQuestionCount = {
  key: string;
  name: string;
  subject_key: string;
  questionCount: number;
};

const WARMUP_SIZE = 10;
const WARMUP_POOL_READ_LIMIT = 1250;
const RECENT_WARMUP_HISTORY_LIMIT = 300;
const WARMUP_BANK = "Fennby Warm-Up V2";

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

function normalizeWarmupStem(question: WarmupQuestion) {
  return question.question
    .replace(/^Warm-up\s+[\w -]+\s+\d+:\s*/i, "")
    .replace(/\b\d+\b/g, "#")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function hasUniqueOptions(question: Pick<WarmupQuestion, "options">) {
  return new Set(question.options.map((option) => option.trim().toLowerCase())).size === question.options.length;
}

function removeNearDuplicateWarmups(questions: WarmupQuestion[]) {
  const seen = new Set<string>();
  const unique: WarmupQuestion[] = [];

  for (const question of shuffle(questions)) {
    const stem = normalizeWarmupStem(question);
    if (seen.has(stem)) continue;
    seen.add(stem);
    unique.push(question);
  }

  return unique;
}

function balanceWarmupPool(questions: WarmupQuestion[]) {
  const bySubject = new Map<string, WarmupQuestion[]>();
  for (const question of shuffle(questions)) {
    const subject = question.subjectKey || "general";
    bySubject.set(subject, [...(bySubject.get(subject) ?? []), question]);
  }

  const selected: WarmupQuestion[] = [];
  while (selected.length < WARMUP_SIZE && bySubject.size) {
    for (const [subject, subjectQuestions] of Array.from(bySubject.entries())) {
      const next = subjectQuestions.shift();
      if (next) selected.push(next);
      if (!subjectQuestions.length) bySubject.delete(subject);
      if (selected.length >= WARMUP_SIZE) break;
    }
  }

  return selected;
}

export async function getMyLearnerProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase.from("learners").select("*").eq("auth_id", user.id).maybeSingle();
  return data;
}

export async function getBrainWarmupQuestions(learnerId: string): Promise<WarmupQuestion[]> {
  const supabase = await createClient();
  const [{ data: preferredData }, { data: fallbackData }, { data: recentAnswers }] = await Promise.all([
    supabase
      .from("questions")
      .select("id, subject_key, topic_key, text, options, correct_answer")
      .eq("status", "published")
      .eq("type", "multiple_choice")
      .eq("exam_board", WARMUP_BANK)
      .limit(WARMUP_POOL_READ_LIMIT),
    supabase
      .from("questions")
      .select("id, subject_key, topic_key, text, options, correct_answer")
      .eq("status", "published")
      .eq("type", "multiple_choice")
      .limit(WARMUP_POOL_READ_LIMIT),
    supabase
      .from("brain_warmup_answers")
      .select("question_id")
      .eq("learner_id", learnerId)
      .not("question_id", "is", null)
      .order("answered_at", { ascending: false })
      .limit(RECENT_WARMUP_HISTORY_LIMIT),
  ]);

  const recentlySeen = new Set((recentAnswers ?? []).map((answer) => answer.question_id).filter(Boolean));
  const sourceQuestions = preferredData?.length ? preferredData : fallbackData ?? [];
  const questions = sourceQuestions
    .filter((q) => q.options.length >= 2 && hasUniqueOptions(q))
    .map((q) => ({
      id: q.id,
      subjectKey: q.subject_key ?? "general",
      topicKey: q.topic_key ?? "general",
      question: q.text,
      options: q.options,
      correctAnswer: q.correct_answer,
    }));
  const unseenQuestions = removeNearDuplicateWarmups(questions.filter((q) => !recentlySeen.has(q.id)));
  const uniqueQuestions = removeNearDuplicateWarmups(questions);

  if (unseenQuestions.length >= WARMUP_SIZE) return balanceWarmupPool(unseenQuestions);
  if (uniqueQuestions.length >= WARMUP_SIZE) return balanceWarmupPool(uniqueQuestions);

  return emergencyWarmupFallback.map((q) => ({
    id: q.id,
    subjectKey: "general",
    topicKey: "brain-training",
    question: q.question,
    options: q.options,
    correctAnswer: q.answer,
  }));
}

export async function getRevisionItemsForLearner(learnerId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("revision_items")
    .select("*")
    .eq("learner_id", learnerId)
    .neq("status", "done");
  return data ?? [];
}

export async function getSubjectsWithTopics() {
  const supabase = await createClient();
  const [{ data: subjects }, { data: topics }] = await Promise.all([
    supabase.from("subjects").select("*"),
    supabase.from("topics").select("*"),
  ]);
  return {
    subjects: subjects ?? [],
    topics: topics ?? [],
  };
}

export async function getSubjectsWithAvailableTopics() {
  const supabase = await createClient();
  const [{ data: subjects }, { data: topics }, { data: questions }] = await Promise.all([
    supabase.from("subjects").select("*"),
    supabase.from("topics").select("*"),
    supabase.from("questions").select("topic_key").eq("status", "published"),
  ]);

  const counts = new Map<string, number>();
  for (const question of questions ?? []) {
    if (question.topic_key) counts.set(question.topic_key, (counts.get(question.topic_key) ?? 0) + 1);
  }

  const availableTopics: TopicWithQuestionCount[] = (topics ?? [])
    .map((topic) => ({
      ...topic,
      questionCount: counts.get(topic.key) ?? 0,
    }))
    .filter((topic) => topic.questionCount > 0)
    .sort((a, b) => a.name.localeCompare(b.name));

  return {
    subjects: subjects ?? [],
    topics: availableTopics,
  };
}

export async function getNextSession(learnerId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("lesson_sessions")
    .select("*")
    .eq("learner_id", learnerId)
    .eq("status", "upcoming")
    .order("scheduled_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  return data;
}

export async function getLatestBadge(learnerId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("learner_achievements")
    .select("*, achievements(*)")
    .eq("learner_id", learnerId)
    .order("awarded_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data;
}

export async function getLatestResultWithTopics(learnerId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("assessment_results")
    .select("*, topic_performance(*), assessment_attempts(accommodations_used, source_type, mode)")
    .eq("learner_id", learnerId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data;
}

// Activities open for booking, of the given type(s), each annotated with
// this learner's own registration status if one exists.
export async function getActivitiesForLearner(learnerId: string, types: string[]) {
  const supabase = await createClient();
  const [{ data: activities }, { data: registrations }] = await Promise.all([
    supabase.from("activities").select("*").in("type", types).eq("status", "open"),
    supabase.from("activity_registrations").select("*").eq("learner_id", learnerId),
  ]);

  const regsByActivity = new Map((registrations ?? []).map((r) => [r.activity_id, r]));
  return (activities ?? []).map((a) => ({ ...a, myRegistration: regsByActivity.get(a.id) ?? null }));
}
