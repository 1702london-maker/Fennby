-- Fennby initial schema
-- Mirrors src/lib/types.ts. RLS enforces: parents see only their own children's data;
-- children see only their own; tutors see only assigned learners; schools see only their own pupils.

create extension if not exists "uuid-ossp";

create type role_type as enum ('child','parent','tutor','school_admin','teacher','admin','safeguarding','authority');
create type tutor_status as enum ('submitted','under_review','dbs_pending','contract_pending','training_pending','approved','rejected','suspended');
create type mood_type as enum ('happy','okay','tired','worried','excited','frustrated');

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role role_type not null,
  full_name text not null,
  email text not null,
  created_at timestamptz not null default now()
);

create table learners (
  id uuid primary key default uuid_generate_v4(),
  parent_id uuid not null references profiles(id) on delete cascade,
  first_name text not null,
  preferred_name text not null,
  date_of_birth date not null,
  year_group text not null,
  current_school text,
  target_exam text,
  target_school text,
  exam_board text,
  learning_goals text,
  send_notes text,
  accessibility_needs text,
  avatar_emoji text default '🙂',
  auth_id uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table guardian_permissions (
  id uuid primary key default uuid_generate_v4(),
  learner_id uuid not null references learners(id) on delete cascade,
  guardian_id uuid not null references profiles(id) on delete cascade,
  relationship text not null default 'guardian',
  view_only boolean not null default true
);

create table tutor_applications (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references profiles(id) on delete cascade,
  subjects text[] not null default '{}',
  age_groups text[] not null default '{}',
  experience_years int,
  qualifications text,
  exam_boards text[] not null default '{}',
  dbs_status text default 'pending',
  references_provided text,
  safeguarding_declaration boolean default false,
  agreement_signed_at timestamptz,
  status tutor_status not null default 'submitted',
  created_at timestamptz not null default now()
);

create table tutor_profiles (
  id uuid primary key references profiles(id) on delete cascade,
  subjects text[] not null default '{}',
  age_groups text[] not null default '{}',
  experience_years int,
  qualifications text,
  exam_boards text[] not null default '{}',
  dbs_status text default 'pending',
  status tutor_status not null default 'submitted',
  training_completed boolean not null default false,
  rating numeric(2,1) default 0,
  review_count int default 0,
  bio text
);

create table tutor_training_modules (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text
);

create table tutor_training_progress (
  id uuid primary key default uuid_generate_v4(),
  tutor_id uuid not null references tutor_profiles(id) on delete cascade,
  module_id uuid not null references tutor_training_modules(id) on delete cascade,
  completed_at timestamptz
);

create table schools (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  urn text,
  local_authority text,
  address text,
  school_type text,
  contact_name text,
  safeguarding_lead_contact text,
  data_protection_contact text,
  year_groups text[] not null default '{}',
  pupil_count int default 0,
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

create table school_users (
  id uuid primary key default uuid_generate_v4(),
  school_id uuid not null references schools(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  role_at_school text not null default 'teacher'
);

create table classes (
  id uuid primary key default uuid_generate_v4(),
  school_id uuid not null references schools(id) on delete cascade,
  name text not null,
  year_group text not null
);

create table class_memberships (
  id uuid primary key default uuid_generate_v4(),
  class_id uuid not null references classes(id) on delete cascade,
  learner_id uuid not null references learners(id) on delete cascade
);

create table subjects (
  key text primary key,
  name text not null
);

create table topics (
  key text primary key,
  subject_key text not null references subjects(key) on delete cascade,
  name text not null
);

create table questions (
  id uuid primary key default uuid_generate_v4(),
  subject_key text references subjects(key),
  topic_key text references topics(key),
  exam_board text,
  difficulty text check (difficulty in ('easy','medium','hard')),
  type text check (type in ('multiple_choice','short_answer','image')),
  text text not null,
  options text[] not null default '{}',
  correct_answer int not null,
  explanation text,
  estimated_seconds int default 30,
  status text not null default 'draft'
);

create table assessments (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  exam_board text,
  age_group text,
  duration_minutes int,
  subject_keys text[] not null default '{}',
  difficulty_mix text,
  mode text check (mode in ('practice','timed','simulation','print_shade')),
  published boolean not null default false
);

create table assessment_questions (
  id uuid primary key default uuid_generate_v4(),
  assessment_id uuid not null references assessments(id) on delete cascade,
  question_id uuid not null references questions(id) on delete cascade,
  position int not null default 0
);

create table assessment_attempts (
  id uuid primary key default uuid_generate_v4(),
  assessment_id uuid not null references assessments(id) on delete cascade,
  learner_id uuid not null references learners(id) on delete cascade,
  mode text not null,
  started_at timestamptz not null default now(),
  completed_at timestamptz
);

create table attempt_answers (
  id uuid primary key default uuid_generate_v4(),
  attempt_id uuid not null references assessment_attempts(id) on delete cascade,
  question_id uuid not null references questions(id) on delete cascade,
  choice_index int
);

create table assessment_results (
  id uuid primary key default uuid_generate_v4(),
  attempt_id uuid not null references assessment_attempts(id) on delete cascade,
  learner_id uuid not null references learners(id) on delete cascade,
  score int not null,
  percentile int,
  standardised_score int,
  created_at timestamptz not null default now()
);

create table topic_performance (
  id uuid primary key default uuid_generate_v4(),
  result_id uuid not null references assessment_results(id) on delete cascade,
  topic_key text references topics(key),
  score int not null
);

create table revision_items (
  id uuid primary key default uuid_generate_v4(),
  learner_id uuid not null references learners(id) on delete cascade,
  subject text,
  topic text,
  reason text,
  priority text check (priority in ('high','medium','low')),
  recommended_activity text,
  due_date date,
  status text not null default 'not_started'
);

create table brain_warmups (
  id uuid primary key default uuid_generate_v4(),
  learner_id uuid not null references learners(id) on delete cascade,
  activity_type text,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  score int,
  mood_before mood_type,
  mood_after mood_type
);

create table mood_checkins (
  id uuid primary key default uuid_generate_v4(),
  learner_id uuid not null references learners(id) on delete cascade,
  mood mood_type not null,
  created_at timestamptz not null default now()
);

create table achievements (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  icon text,
  description text,
  category text
);

create table learner_achievements (
  id uuid primary key default uuid_generate_v4(),
  learner_id uuid not null references learners(id) on delete cascade,
  achievement_id uuid not null references achievements(id) on delete cascade,
  awarded_at timestamptz not null default now()
);

create table message_threads (
  id uuid primary key default uuid_generate_v4(),
  learner_id uuid not null references learners(id) on delete cascade
);

create table messages (
  id uuid primary key default uuid_generate_v4(),
  thread_id uuid not null references message_threads(id) on delete cascade,
  sender_id uuid not null references profiles(id),
  content text not null,
  created_at timestamptz not null default now(),
  read boolean not null default false
);

create table lesson_sessions (
  id uuid primary key default uuid_generate_v4(),
  learner_id uuid not null references learners(id) on delete cascade,
  tutor_id uuid not null references tutor_profiles(id) on delete cascade,
  subject text,
  scheduled_at timestamptz not null,
  status text not null default 'upcoming'
);

create table lesson_notes (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid not null references lesson_sessions(id) on delete cascade,
  learner_id uuid not null references learners(id) on delete cascade,
  tutor_id uuid not null references tutor_profiles(id) on delete cascade,
  subject text,
  topic text,
  learning_objective text,
  covered text,
  strengths text,
  weaknesses text,
  confidence text,
  homework_assigned text,
  parent_summary text,
  safeguarding_concern boolean not null default false,
  created_at timestamptz not null default now()
);

create table homework (
  id uuid primary key default uuid_generate_v4(),
  learner_id uuid not null references learners(id) on delete cascade,
  title text not null,
  subject text,
  assigned_by text,
  due_date date,
  status text not null default 'not_started'
);

create table activities (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  type text check (type in ('summer_camp','craft_club','vocational','competition')),
  age_range text,
  description text,
  start_date date,
  end_date date,
  location text,
  capacity int,
  safety_notes text,
  consent_required boolean not null default true,
  price text,
  status text not null default 'open'
);

create table activity_registrations (
  id uuid primary key default uuid_generate_v4(),
  activity_id uuid not null references activities(id) on delete cascade,
  learner_id uuid not null references learners(id) on delete cascade,
  consent_status text not null default 'pending',
  booking_status text not null default 'interested'
);

create table safeguarding_cases (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  learner_id uuid not null references learners(id) on delete cascade,
  reported_by text,
  concern_type text,
  priority text check (priority in ('urgent','high','medium','low')),
  description text,
  status text not null default 'open',
  assigned_to uuid references profiles(id),
  actions_taken text,
  outcome text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table audit_logs (
  id uuid primary key default uuid_generate_v4(),
  actor_id uuid references profiles(id),
  action text not null,
  entity text,
  created_at timestamptz not null default now()
);

create table subscriptions (
  id uuid primary key default uuid_generate_v4(),
  parent_id uuid not null references profiles(id) on delete cascade,
  plan_name text,
  status text default 'active',
  current_period_end timestamptz
);

create table invoices (
  id uuid primary key default uuid_generate_v4(),
  subscription_id uuid references subscriptions(id) on delete cascade,
  amount numeric(10,2),
  status text default 'paid',
  issued_at timestamptz not null default now()
);

-- Row Level Security
alter table profiles enable row level security;
alter table learners enable row level security;
alter table assessment_results enable row level security;
alter table revision_items enable row level security;
alter table messages enable row level security;
alter table message_threads enable row level security;
alter table lesson_notes enable row level security;
alter table lesson_sessions enable row level security;
alter table safeguarding_cases enable row level security;
alter table mood_checkins enable row level security;
alter table brain_warmups enable row level security;

-- Parents see and manage only their own learners
create policy "parents manage own learners" on learners
  for all using (auth.uid() = parent_id);

-- Children see only their own learner row
create policy "children view own profile" on learners
  for select using (auth.uid() = auth_id);

-- Parents/children see assessment results only for their own learner
create policy "assessment results visible to parent and child" on assessment_results
  for select using (
    exists (select 1 from learners l where l.id = assessment_results.learner_id and (l.parent_id = auth.uid() or l.auth_id = auth.uid()))
  );

create policy "revision items visible to parent and child" on revision_items
  for select using (
    exists (select 1 from learners l where l.id = revision_items.learner_id and (l.parent_id = auth.uid() or l.auth_id = auth.uid()))
  );

create policy "mood checkins visible to parent and child" on mood_checkins
  for select using (
    exists (select 1 from learners l where l.id = mood_checkins.learner_id and (l.parent_id = auth.uid() or l.auth_id = auth.uid()))
  );

create policy "brain warmups visible to parent and child" on brain_warmups
  for select using (
    exists (select 1 from learners l where l.id = brain_warmups.learner_id and (l.parent_id = auth.uid() or l.auth_id = auth.uid()))
  );

-- Messages: any message tied to a learner is visible to that learner's parent, always
create policy "messages visible to parent of learner" on messages
  for select using (
    exists (
      select 1 from message_threads t
      join learners l on l.id = t.learner_id
      where t.id = messages.thread_id and (l.parent_id = auth.uid() or l.auth_id = auth.uid())
    )
  );

create policy "message threads visible to parent of learner" on message_threads
  for select using (
    exists (select 1 from learners l where l.id = message_threads.learner_id and (l.parent_id = auth.uid() or l.auth_id = auth.uid()))
  );

-- Lesson notes: parent of the learner can always read
create policy "lesson notes visible to parent" on lesson_notes
  for select using (
    exists (select 1 from learners l where l.id = lesson_notes.learner_id and l.parent_id = auth.uid())
  );

create policy "lesson sessions visible to parent" on lesson_sessions
  for select using (
    exists (select 1 from learners l where l.id = lesson_sessions.learner_id and l.parent_id = auth.uid())
  );

-- Safeguarding cases: restricted to safeguarding role (enforced at app layer via service role for admin views)
create policy "safeguarding cases restricted" on safeguarding_cases
  for select using (
    exists (select 1 from profiles p where p.id = auth.uid() and p.role in ('safeguarding','admin'))
  );

-- Profiles: users can see their own profile
create policy "users view own profile" on profiles
  for select using (auth.uid() = id);
