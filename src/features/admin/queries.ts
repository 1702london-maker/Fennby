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

export async function getOperationalMetrics() {
  const supabase = await createClient();
  const [
    paidPurchases,
    unpaidPurchases,
    openSafeguarding,
    urgentSafeguarding,
    homeworkQueue,
    activeCradle,
    recordedCradle,
  ] = await Promise.all([
    supabase.from("mock_exam_purchases").select("amount").not("paid_at", "is", null),
    supabase.from("mock_exam_purchases").select("id", { count: "exact", head: true }).is("paid_at", null),
    supabase.from("safeguarding_cases").select("id", { count: "exact", head: true }).eq("status", "open"),
    supabase.from("safeguarding_cases").select("id", { count: "exact", head: true }).eq("status", "open").in("severity", ["critical", "high"]),
    supabase.from("homework_help_requests").select("id", { count: "exact", head: true }).in("status", ["processing", "needs_review"]),
    supabase.from("cradle_sessions").select("id", { count: "exact", head: true }).is("ended_at", null),
    supabase.from("cradle_sessions").select("id", { count: "exact", head: true }).eq("recording_status", "recorded"),
  ]);

  const mockExamRevenue = (paidPurchases.data ?? []).reduce((sum, purchase) => sum + Number(purchase.amount ?? 0), 0);

  return {
    mockExamRevenue,
    unpaidCheckouts: unpaidPurchases.count ?? 0,
    openSafeguarding: openSafeguarding.count ?? 0,
    urgentSafeguarding: urgentSafeguarding.count ?? 0,
    homeworkQueue: homeworkQueue.count ?? 0,
    activeCradle: activeCradle.count ?? 0,
    recordedCradle: recordedCradle.count ?? 0,
    integrations: {
      aiTutor: Boolean(process.env.OPENAI_API_KEY),
      stripe: Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET),
      cradleVideo: Boolean(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_API_KEY_SID && process.env.TWILIO_API_KEY_SECRET),
    },
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
    .select("*, profiles!tutor_applications_profile_id_fkey(full_name, email), tutor_profiles(examiner_verified)")
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
