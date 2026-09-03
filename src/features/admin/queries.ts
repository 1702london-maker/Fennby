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

export async function getAdminReportSummaries() {
  const supabase = await createClient();
  const [results, revisionItems, homework, assessments, openSittings, schools, learners, tutorApplications] = await Promise.all([
    supabase.from("assessment_results").select("score, created_at"),
    supabase.from("revision_items").select("status, priority"),
    supabase.from("homework_help_requests").select("status"),
    supabase.from("assessments").select("id", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("mock_exam_sittings").select("id", { count: "exact", head: true }).eq("status", "open"),
    supabase.from("schools").select("approved"),
    supabase.from("learners").select("id, send_notes, accessibility_needs, created_at"),
    supabase.from("tutor_applications").select("status"),
  ]);

  const scores = results.data ?? [];
  const averageScore = scores.length
    ? Math.round(scores.reduce((sum, result) => sum + Number(result.score ?? 0), 0) / scores.length)
    : 0;
  const activeRevisionItems = (revisionItems.data ?? []).filter((item) => item.status !== "done");
  const highPriorityRevisionItems = activeRevisionItems.filter((item) => item.priority === "high");
  const sendLearners = (learners.data ?? []).filter((learner) => learner.send_notes || learner.accessibility_needs);

  return [
    {
      title: "Assessment readiness",
      value: `${assessments.count ?? 0} published`,
      detail: `${openSittings.count ?? 0} open simulation sitting${openSittings.count === 1 ? "" : "s"} and ${scores.length} completed result${scores.length === 1 ? "" : "s"}.`,
    },
    {
      title: "Cohort progress",
      value: scores.length ? `${averageScore}% average` : "No results yet",
      detail: scores.length ? "Average score across all recorded assessment results." : "No assessment result records are available yet.",
    },
    {
      title: "Intervention impact",
      value: `${highPriorityRevisionItems.length} high priority`,
      detail: `${activeRevisionItems.length} active revision item${activeRevisionItems.length === 1 ? "" : "s"} not yet marked done.`,
    },
    {
      title: "Homework completion",
      value: `${homework.data?.length ?? 0} submitted`,
      detail: `${(homework.data ?? []).filter((item) => item.status === "processing").length} homework help request${(homework.data ?? []).filter((item) => item.status === "processing").length === 1 ? "" : "s"} currently processing.`,
    },
    {
      title: "SEND progress",
      value: `${sendLearners.length} learner${sendLearners.length === 1 ? "" : "s"}`,
      detail: "Learners with SEND notes or accessibility needs recorded.",
    },
    {
      title: "Provider readiness",
      value: `${(tutorApplications.data ?? []).filter((item) => item.status === "approved").length} approved tutors`,
      detail: `${(schools.data ?? []).filter((school) => school.approved).length} approved school${(schools.data ?? []).filter((school) => school.approved).length === 1 ? "" : "s"} on the platform.`,
    },
  ];
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
