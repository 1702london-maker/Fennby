import { createClient } from "@/lib/supabase/server";

export async function getDashboardStats() {
  const supabase = await createClient();
  const [learners, parents, tutors, schools, pendingTutors, pendingSchools, messages, cases] = await Promise.all([
    supabase.from("learners").select("id", { count: "exact", head: true }),
    supabase.from("profiles").select("id", { count: "exact", head: true }).eq("role", "parent"),
    supabase.from("tutor_profiles").select("id", { count: "exact", head: true }),
    supabase.from("schools").select("id", { count: "exact", head: true }),
    supabase.from("tutor_profiles").select("id", { count: "exact", head: true }).not("status", "in", "(approved,rejected)"),
    supabase.from("schools").select("id", { count: "exact", head: true }).eq("approved", false),
    supabase.from("messages").select("id", { count: "exact", head: true }),
    supabase.from("safeguarding_cases").select("id", { count: "exact", head: true }),
  ]);

  return {
    learners: learners.count ?? 0,
    parents: parents.count ?? 0,
    tutors: tutors.count ?? 0,
    schools: schools.count ?? 0,
    pendingTutors: pendingTutors.count ?? 0,
    pendingSchools: pendingSchools.count ?? 0,
    messages: messages.count ?? 0,
    cases: cases.count ?? 0,
  };
}

export async function getAllUsers() {
  const supabase = await createClient();
  const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
  return data ?? [];
}

export async function getAllTutorApplications() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("tutor_applications")
    .select("*, profiles!tutor_applications_profile_id_fkey(full_name, email)")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getAllSchools() {
  const supabase = await createClient();
  const { data } = await supabase.from("schools").select("*").order("created_at", { ascending: false });
  return data ?? [];
}

export async function getAllLearners() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("learners")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getAllQuestions() {
  const supabase = await createClient();
  const { data } = await supabase.from("questions").select("*").order("id");
  return data ?? [];
}

export async function getAllAssessments() {
  const supabase = await createClient();
  const { data } = await supabase.from("assessments").select("*");
  return data ?? [];
}
