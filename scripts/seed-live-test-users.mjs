import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const parentEmail = process.env.FENNBY_TEST_PARENT_EMAIL ?? "1702london@gmail.com";
const tutorEmail = process.env.FENNBY_TEST_TUTOR_EMAIL ?? "reshapednrevamped@gmail.com";
const adultPassword = process.env.FENNBY_TEST_PASSWORD;
const childUsername = process.env.FENNBY_TEST_CHILD_USERNAME ?? "fennby-test-kid";
const childPin = process.env.FENNBY_TEST_CHILD_PIN ?? "123456";
const childEmail = `${childUsername.toLowerCase()}@child.fennby.internal`;

if (!supabaseUrl || !serviceRoleKey || !adultPassword) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, or FENNBY_TEST_PASSWORD.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function findUserByEmail(email) {
  let page = 1;
  while (true) {
    const response = await fetch(`${supabaseUrl}/auth/v1/admin/users?page=${page}&per_page=1000`, {
      headers: {
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Auth user list failed: ${response.status} ${await response.text()}`);
    }

    const data = await response.json();
    const users = data.users ?? [];
    const user = users.find((candidate) => candidate.email?.toLowerCase() === email.toLowerCase());
    if (user) return user;
    if (users.length < 1000) return null;
    page += 1;
  }
}

async function upsertAuthUser({ email, password, fullName, role }) {
  const existing = await findUserByEmail(email);
  const endpoint = existing
    ? `${supabaseUrl}/auth/v1/admin/users/${existing.id}`
    : `${supabaseUrl}/auth/v1/admin/users`;
  const response = await fetch(endpoint, {
    method: existing ? "PUT" : "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName, role },
    }),
  });

  if (!response.ok) {
    throw new Error(`Auth user upsert failed for ${email}: ${response.status} ${await response.text()}`);
  }

  return response.json();
}

async function main() {
  const parent = await upsertAuthUser({
    email: parentEmail,
    password: adultPassword,
    fullName: "Fennby Live Test Parent",
    role: "parent",
  });
  const tutor = await upsertAuthUser({
    email: tutorEmail,
    password: adultPassword,
    fullName: "Fennby Live Test Tutor",
    role: "tutor",
  });
  const child = await upsertAuthUser({
    email: childEmail,
    password: childPin,
    fullName: "Fennby Test Kid",
    role: "child",
  });

  await supabase.from("profiles").upsert([
    {
      id: parent.id,
      role: "parent",
      full_name: "Fennby Live Test Parent",
      email: parentEmail,
      status: "active",
      subscription_status: "active",
      updated_at: new Date().toISOString(),
    },
    {
      id: tutor.id,
      role: "tutor",
      full_name: "Fennby Live Test Tutor",
      email: tutorEmail,
      status: "active",
      subscription_status: "active",
      updated_at: new Date().toISOString(),
    },
  ]);

  const { data: learnerRows, error: learnerReadError } = await supabase
    .from("learners")
    .select("id")
    .eq("parent_id", parent.id)
    .eq("preferred_name", "Fennby");
  if (learnerReadError) throw learnerReadError;

  let learnerId = learnerRows?.[0]?.id;
  if (learnerId) {
    const { error } = await supabase
      .from("learners")
      .update({
        auth_id: child.id,
        first_name: "Fennby",
        preferred_name: "Fennby",
        date_of_birth: "2016-06-15",
        year_group: "Year 5",
        current_school: "Live QA Home",
        target_exam: "11+ Grammar Entrance",
        target_school: "Trafford Grammar",
        exam_board: "GL Assessment",
        learning_goals: "Live QA for Cradle, Workshop, AI Tutor, and mock flows.",
        avatar_emoji: "F",
      })
      .eq("id", learnerId);
    if (error) throw error;
  } else {
    const { data, error } = await supabase
      .from("learners")
      .insert({
        parent_id: parent.id,
        auth_id: child.id,
        first_name: "Fennby",
        preferred_name: "Fennby",
        date_of_birth: "2016-06-15",
        year_group: "Year 5",
        current_school: "Live QA Home",
        target_exam: "11+ Grammar Entrance",
        target_school: "Trafford Grammar",
        exam_board: "GL Assessment",
        learning_goals: "Live QA for Cradle, Workshop, AI Tutor, and mock flows.",
        avatar_emoji: "F",
      })
      .select("id")
      .single();
    if (error || !data) throw error ?? new Error("Learner insert failed");
    learnerId = data.id;
  }

  const applicationPayload = {
    profile_id: tutor.id,
    subjects: ["Maths", "English", "Verbal Reasoning", "Non-Verbal Reasoning"],
    age_groups: ["Year 4", "Year 5", "Year 6"],
    experience_years: 7,
    qualifications: "Live QA approved tutor profile for Fennby launch testing.",
    exam_boards: ["GL Assessment", "CEM", "FSCE"],
    dbs_status: "verified",
    references_provided: "Verified for live QA.",
    safeguarding_declaration: true,
    agreement_signed_at: new Date().toISOString(),
    status: "approved",
    onboarding_state: "verified",
  };
  const { data: existingApplications, error: applicationReadError } = await supabase
    .from("tutor_applications")
    .select("id")
    .eq("profile_id", tutor.id);
  if (applicationReadError) throw applicationReadError;

  let applicationId = existingApplications?.[0]?.id;
  if (applicationId) {
    const { error } = await supabase.from("tutor_applications").update(applicationPayload).eq("id", applicationId);
    if (error) throw error;
  } else {
    const { data, error } = await supabase
      .from("tutor_applications")
      .insert(applicationPayload)
      .select("id")
      .single();
    if (error || !data) throw error ?? new Error("Tutor application insert failed");
    applicationId = data.id;
  }

  const { error: tutorProfileError } = await supabase.from("tutor_profiles").upsert({
    id: tutor.id,
    application_id: applicationId,
    subjects: ["Maths", "English", "Verbal Reasoning", "Non-Verbal Reasoning"],
    age_groups: ["Year 4", "Year 5", "Year 6"],
    experience_years: 7,
    qualifications: "Live QA approved tutor profile for Fennby launch testing.",
    exam_boards: ["GL Assessment", "CEM", "FSCE"],
    dbs_status: "verified",
    status: "approved",
    training_completed: true,
    rating: 5,
    review_count: 1,
    bio: "Approved live QA tutor account for final Cradle, lesson, and messaging checks.",
    examiner_verified: true,
    send_experience: ["Dyslexia", "ADHD"],
  });
  if (tutorProfileError) throw tutorProfileError;

  const scheduledAt = new Date(Date.now() + 1000 * 60 * 30).toISOString();
  const { data: existingLessons, error: lessonReadError } = await supabase
    .from("lesson_sessions")
    .select("id")
    .eq("learner_id", learnerId)
    .eq("tutor_id", tutor.id)
    .eq("status", "upcoming");
  if (lessonReadError) throw lessonReadError;

  let lessonSessionId = existingLessons?.[0]?.id;
  if (lessonSessionId) {
    const { error } = await supabase
      .from("lesson_sessions")
      .update({ subject: "Live Cradle QA", scheduled_at: scheduledAt })
      .eq("id", lessonSessionId);
    if (error) throw error;
  } else {
    const { data, error } = await supabase
      .from("lesson_sessions")
      .insert({
        learner_id: learnerId,
        tutor_id: tutor.id,
        subject: "Live Cradle QA",
        scheduled_at: scheduledAt,
        status: "upcoming",
      })
      .select("id")
      .single();
    if (error || !data) throw error ?? new Error("Lesson insert failed");
    lessonSessionId = data.id;
  }

  const { data: existingCradle, error: cradleReadError } = await supabase
    .from("cradle_sessions")
    .select("id")
    .eq("lesson_session_id", lessonSessionId)
    .is("ended_at", null);
  if (cradleReadError) throw cradleReadError;

  let cradleSessionId = existingCradle?.[0]?.id;
  if (!cradleSessionId) {
    const { data, error } = await supabase
      .from("cradle_sessions")
      .insert({
        lesson_session_id: lessonSessionId,
        session_type: "academic",
        host_id: tutor.id,
        video_provider: "twilio",
        video_room_sid: `cradle-live-qa-${lessonSessionId}`,
        peer_anonymity_enabled: false,
        recording_status: "not_recording",
      })
      .select("id")
      .single();
    if (error || !data) throw error ?? new Error("Cradle insert failed");
    cradleSessionId = data.id;
  }

  const participants = [
    { session_id: cradleSessionId, profile_id: tutor.id, learner_id: null, role_in_session: "host" },
    { session_id: cradleSessionId, profile_id: parent.id, learner_id: null, role_in_session: "participant" },
    { session_id: cradleSessionId, profile_id: null, learner_id: learnerId, role_in_session: "participant" },
  ];
  for (const participant of participants) {
    let query = supabase.from("cradle_participants").select("id").eq("session_id", participant.session_id);
    query = participant.profile_id
      ? query.eq("profile_id", participant.profile_id)
      : query.is("profile_id", null);
    query = participant.learner_id
      ? query.eq("learner_id", participant.learner_id)
      : query.is("learner_id", null);
    const { data: existingParticipants, error: participantReadError } = await query;
    if (participantReadError) throw participantReadError;
    if (existingParticipants?.[0]?.id) {
      const { error } = await supabase
        .from("cradle_participants")
        .update({ role_in_session: participant.role_in_session })
        .eq("id", existingParticipants[0].id);
      if (error) throw error;
    } else {
      const { error } = await supabase.from("cradle_participants").insert(participant);
      if (error) throw error;
    }
  }

  console.log(`Parent ready: ${parentEmail}`);
  console.log(`Tutor ready: ${tutorEmail}`);
  console.log(`Child ready: ${childUsername} / ${childPin}`);
  console.log(`Lesson session: ${lessonSessionId}`);
  console.log(`Cradle session: ${cradleSessionId}`);
  console.log(`Cradle URL: ${process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.fennby.co.uk"}/cradle/${cradleSessionId}`);
}

main().catch((error) => {
  console.error("Live test user seed failed:");
  console.error(JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
  process.exit(1);
});
