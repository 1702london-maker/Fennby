import { createClient } from "@/lib/supabase/server";

export async function getMySchool() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: schoolUser } = await supabase
    .from("school_users")
    .select("school_id, role_at_school, schools(*)")
    .eq("profile_id", user.id)
    .maybeSingle();

  if (!schoolUser?.schools) return null;
  return { ...schoolUser.schools, roleAtSchool: schoolUser.role_at_school };
}

export async function getClasses(schoolId: string) {
  const supabase = await createClient();
  const { data: classes } = await supabase.from("classes").select("*").eq("school_id", schoolId);
  if (!classes?.length) return [];

  const classIds = classes.map((c) => c.id);
  const { data: memberships } = await supabase
    .from("class_memberships")
    .select("class_id, learner_id")
    .in("class_id", classIds);

  return classes.map((c) => ({
    ...c,
    pupilCount: (memberships ?? []).filter((m) => m.class_id === c.id).length,
  }));
}

export async function getPupilsForSchool(schoolId: string) {
  const supabase = await createClient();
  const { data: links } = await supabase
    .from("school_child_links")
    .select("learner_id, relationship, learners(*)")
    .eq("school_id", schoolId)
    .eq("relationship", "enrolled");

  const learnerIds = (links ?? []).map((l) => l.learner_id);
  if (!learnerIds.length) return [];

  const { data: results } = await supabase
    .from("assessment_results")
    .select("learner_id, score, created_at")
    .in("learner_id", learnerIds)
    .order("created_at", { ascending: false });

  const latestByLearner = new Map<string, number>();
  for (const r of results ?? []) {
    if (!latestByLearner.has(r.learner_id)) latestByLearner.set(r.learner_id, r.score);
  }

  return (links ?? [])
    .filter((l) => l.learners)
    .map((l) => ({
      learner: l.learners!,
      latestScore: latestByLearner.get(l.learner_id) ?? null,
    }));
}

export async function getHomeworkForSchool(learnerIds: string[]) {
  if (!learnerIds.length) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("homework")
    .select("*, learners(preferred_name)")
    .in("learner_id", learnerIds)
    .order("due_date", { ascending: true });
  return data ?? [];
}

export async function getInterventionsForSchool(learnerIds: string[]) {
  if (!learnerIds.length) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("revision_items")
    .select("*, learners(preferred_name)")
    .in("learner_id", learnerIds)
    .eq("priority", "high")
    .neq("status", "done");
  return data ?? [];
}
