import { createClient } from "@/lib/supabase/server";

export async function getMyTutorProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from("tutor_profiles").select("*").eq("id", user.id).maybeSingle();
  return data;
}

export async function getMyStudents(tutorId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("lesson_sessions")
    .select("learner_id, learners(*)")
    .eq("tutor_id", tutorId);

  const seen = new Map<string, NonNullable<NonNullable<typeof data>[number]["learners"]>>();
  for (const row of data ?? []) {
    if (row.learners && !seen.has(row.learner_id)) seen.set(row.learner_id, row.learners);
  }
  return Array.from(seen.values());
}

export async function getStudentDetail(tutorId: string, learnerId: string) {
  const supabase = await createClient();
  const { data: learner } = await supabase.from("learners").select("*").eq("id", learnerId).maybeSingle();
  if (!learner) return null;

  const hasAssignment = await supabase
    .from("lesson_sessions")
    .select("id", { count: "exact", head: true })
    .eq("tutor_id", tutorId)
    .eq("learner_id", learnerId);
  if (!hasAssignment.count) return null;

  const [results, revision, notes] = await Promise.all([
    supabase.from("assessment_results").select("*, topic_performance(*)").eq("learner_id", learnerId).order("created_at", { ascending: false }),
    supabase.from("revision_items").select("*").eq("learner_id", learnerId).neq("status", "done"),
    supabase.from("lesson_notes").select("*").eq("learner_id", learnerId).order("created_at", { ascending: false }),
  ]);

  return {
    learner,
    results: results.data ?? [],
    revision: revision.data ?? [],
    notes: notes.data ?? [],
  };
}

export async function getMySchedule(tutorId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("lesson_sessions")
    .select("*, learners(preferred_name, avatar_emoji)")
    .eq("tutor_id", tutorId)
    .order("scheduled_at", { ascending: true });

  const now = Date.now();
  const upcoming = (data ?? []).filter((s) => s.status === "upcoming" && new Date(s.scheduled_at).getTime() >= now);
  const completed = (data ?? []).filter((s) => s.status === "completed");
  const cancelled = (data ?? []).filter((s) => s.status === "cancelled");
  return { upcoming, completed, cancelled };
}

export async function getMyRecentNotes(tutorId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("lesson_notes")
    .select("*, learners(preferred_name)")
    .eq("tutor_id", tutorId)
    .order("created_at", { ascending: false })
    .limit(10);
  return data ?? [];
}

export async function getMyTrainingProgress(tutorId: string) {
  const supabase = await createClient();
  const [modules, progress] = await Promise.all([
    supabase.from("tutor_training_modules").select("*").order("sort_order", { ascending: true }),
    supabase.from("tutor_training_progress").select("*").eq("tutor_id", tutorId),
  ]);
  const completedIds = new Set((progress.data ?? []).map((p) => p.module_id));
  return (modules.data ?? []).map((m) => ({ ...m, completed: completedIds.has(m.id) }));
}
