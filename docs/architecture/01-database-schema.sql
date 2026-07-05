-- ============================================================================
-- FENNBY — PRODUCTION DATABASE SCHEMA (v1)
-- PostgreSQL 15+ / Supabase
-- Statements below are ordered so the file is directly executable top-to-bottom.
--
-- Design principles:
--   1. Every FK is indexed (Postgres does not auto-index FK columns).
--   2. Every row that can be safeguarding-relevant is auditable via trigger,
--      not via application discipline.
--   3. High-write, high-growth tables (assessment_attempts, attempt_answers,
--      messages, audit_logs, notifications) are designed for RANGE
--      partitioning by created_at from day one, even though we don't
--      partition until volume requires it (see 15-performance-review.md).
--   4. Enums are used for closed, rarely-changing vocabularies. Open/growing
--      vocabularies (subjects, topics, exam boards, question types) are
--      *tables*, never enums — enums require a migration to extend, tables
--      don't. This is what makes "unlimited subjects/topics/exam boards"
--      actually true rather than aspirational.
--   5. Soft delete (`deleted_at timestamptz`) is used on user-generated
--      content that safeguarding/audit may need after "deletion" (messages,
--      lesson_notes, safeguarding_cases). Hard delete (FK cascade) is used
--      for genuinely dependent rows (attempt_answers when an attempt is
--      purged under a data-retention job).
-- ============================================================================

create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";
create extension if not exists "pg_trgm";      -- fuzzy search (question text, user search)
create extension if not exists "btree_gin";    -- composite GIN indexes

-- ============================================================================
-- SECTION 1: IDENTITY & ROLES
-- ============================================================================

create type role_type as enum (
  'child','parent','tutor','teacher','school_admin',
  'admin','safeguarding','authority','government'
);

-- profiles: 1:1 with auth.users. Never store role-specific data here —
-- that lives in learners / tutor_profiles / school_users. profiles is the
-- identity anchor every other table's ownership check joins through.
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role role_type not null,
  full_name text not null,
  email text not null unique,
  phone text,
  status text not null default 'active' check (status in ('active','suspended','deleted')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_profiles_role on profiles(role);
create index idx_profiles_status on profiles(status) where status <> 'active';

-- Role inheritance: modelled as explicit secondary grants, not a hierarchy,
-- because Fennby's roles don't nest cleanly (a school_admin is not "above"
-- a teacher at another school). A profile's *primary* role drives their
-- default dashboard; `role_grants` allows a profile to hold scoped
-- secondary capabilities without a second auth identity.
create table role_grants (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references profiles(id) on delete cascade,
  grant_role role_type not null,
  scope_type text not null check (scope_type in ('school','class','global')),
  scope_id uuid,
  granted_by uuid references profiles(id),
  granted_at timestamptz not null default now(),
  revoked_at timestamptz
);
create index idx_role_grants_profile on role_grants(profile_id) where revoked_at is null;
create unique index uq_role_grants_active on role_grants(profile_id, grant_role, scope_type, coalesce(scope_id, '00000000-0000-0000-0000-000000000000'))
  where revoked_at is null;

-- ============================================================================
-- SECTION 2: SCHOOLS / CLASSES
-- ============================================================================

create table schools (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  urn text unique,
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
create index idx_schools_la on schools(local_authority);
create index idx_schools_approved on schools(approved) where approved = false;

create table school_users (
  id uuid primary key default uuid_generate_v4(),
  school_id uuid not null references schools(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  role_at_school text not null default 'teacher',
  created_at timestamptz not null default now(),
  unique (school_id, profile_id)
);
create index idx_school_users_profile on school_users(profile_id);

create table classes (
  id uuid primary key default uuid_generate_v4(),
  school_id uuid not null references schools(id) on delete cascade,
  name text not null,
  year_group text not null,
  created_at timestamptz not null default now()
);
create index idx_classes_school on classes(school_id);

-- ============================================================================
-- SECTION 3: CURRICULUM (open vocabularies — tables, not enums, by design)
-- ============================================================================

create table exam_boards (
  id uuid primary key default uuid_generate_v4(),
  code text not null unique,   -- 'GL','CEM','ISEB','CSSE'
  name text not null
);

create table subjects (
  id uuid primary key default uuid_generate_v4(),
  key text not null unique,
  name text not null,
  sort_order int not null default 0
);

create table topics (
  id uuid primary key default uuid_generate_v4(),
  subject_id uuid not null references subjects(id) on delete cascade,
  key text not null,
  name text not null,
  parent_topic_id uuid references topics(id) on delete set null, -- supports sub-topics
  sort_order int not null default 0,
  unique (subject_id, key)
);
create index idx_topics_subject on topics(subject_id);
create index idx_topics_parent on topics(parent_topic_id);

-- ============================================================================
-- SECTION 4: LEARNERS (single source of truth — see 11-learner-profile.md)
-- ============================================================================

create table learners (
  id uuid primary key default uuid_generate_v4(),
  parent_id uuid not null references profiles(id) on delete cascade,
  auth_id uuid unique references auth.users(id) on delete set null, -- null until child account created
  first_name text not null,
  preferred_name text not null,
  date_of_birth date not null,
  year_group text not null,
  current_school_id uuid references schools(id) on delete set null,
  target_exam text,
  target_school text,
  exam_board_id uuid references exam_boards(id),
  learning_goals text,
  send_notes text,
  accessibility_needs text,
  avatar_emoji text not null default '🙂',
  status text not null default 'active' check (status in ('active','archived')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_learners_parent on learners(parent_id);
create index idx_learners_auth on learners(auth_id);
create index idx_learners_school on learners(current_school_id);

create table class_memberships (
  id uuid primary key default uuid_generate_v4(),
  class_id uuid not null references classes(id) on delete cascade,
  learner_id uuid not null references learners(id) on delete cascade,
  unique (class_id, learner_id)
);
create index idx_class_mem_learner on class_memberships(learner_id);

-- school_child_links: distinguishes "enrolled" (data flows to school) from
-- "prospective" (school target only, no data sharing) — required so a
-- learner's target_school (aspirational) never implies a real school gets
-- their data.
create table school_child_links (
  id uuid primary key default uuid_generate_v4(),
  school_id uuid not null references schools(id) on delete cascade,
  learner_id uuid not null references learners(id) on delete cascade,
  relationship text not null check (relationship in ('enrolled','prospective')),
  unique (school_id, learner_id)
);
create index idx_school_child_learner on school_child_links(learner_id);

-- Guardian access: co-parents / grandparents with view-only access.
create table guardian_permissions (
  id uuid primary key default uuid_generate_v4(),
  learner_id uuid not null references learners(id) on delete cascade,
  guardian_id uuid not null references profiles(id) on delete cascade,
  relationship text not null default 'guardian',
  can_message boolean not null default false, -- view-only by default per spec
  created_at timestamptz not null default now(),
  unique (learner_id, guardian_id)
);
create index idx_guardian_perm_guardian on guardian_permissions(guardian_id);

-- ============================================================================
-- SECTION 5: TUTORS
-- ============================================================================

create type tutor_status as enum (
  'submitted','under_review','dbs_pending','contract_pending',
  'training_pending','approved','rejected','suspended'
);

create table tutor_applications (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references profiles(id) on delete cascade,
  subjects uuid[] not null default '{}',
  age_groups text[] not null default '{}',
  experience_years int check (experience_years >= 0),
  qualifications text,
  exam_boards uuid[] not null default '{}',
  dbs_status text not null default 'pending',
  dbs_certificate_ref text,
  dbs_expiry date,
  references_provided text,
  safeguarding_declaration boolean not null default false,
  agreement_document_url text,
  agreement_signed_at timestamptz,
  status tutor_status not null default 'submitted',
  reviewed_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_tutor_app_profile on tutor_applications(profile_id);
create index idx_tutor_app_status on tutor_applications(status) where status not in ('approved','rejected');

create table tutor_profiles (
  id uuid primary key references profiles(id) on delete cascade,
  application_id uuid references tutor_applications(id),
  subjects uuid[] not null default '{}',
  age_groups text[] not null default '{}',
  experience_years int,
  qualifications text,
  exam_boards uuid[] not null default '{}',
  dbs_status text not null default 'pending',
  dbs_expiry date,
  status tutor_status not null default 'submitted',
  training_completed_at timestamptz,
  rating numeric(2,1) default 0 check (rating between 0 and 5),
  review_count int not null default 0,
  bio text,
  updated_at timestamptz not null default now()
);

create table tutor_training_modules (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text,
  required boolean not null default true,
  sort_order int not null default 0
);

create table tutor_training_progress (
  id uuid primary key default uuid_generate_v4(),
  tutor_id uuid not null references tutor_profiles(id) on delete cascade,
  module_id uuid not null references tutor_training_modules(id) on delete cascade,
  completed_at timestamptz,
  unique (tutor_id, module_id)
);
create index idx_training_progress_tutor on tutor_training_progress(tutor_id);

-- ============================================================================
-- SECTION 6: QUESTION ENGINE (see 09-assessment-engine.md for rationale)
-- ============================================================================

-- question_type is a TABLE not an enum: new interaction types (drag-drop,
-- hotspot, drawing, audio, video, AI-marked) can be added by inserting a row
-- and shipping a new frontend renderer + marker, with zero schema migration.
create table question_types (
  id uuid primary key default uuid_generate_v4(),
  key text not null unique,          -- 'multiple_choice','multi_select','drag_drop',
                                      -- 'ordering','image_hotspot','drawing',
                                      -- 'short_answer','ai_marked','audio','video','maths_input'
  label text not null,
  renderer_component text not null,  -- frontend component key, e.g. 'MultipleChoiceRenderer'
  marker_strategy text not null
    check (marker_strategy in ('exact_match','set_match','coordinate_match','ai_marked','manual_review'))
);

create table questions (
  id uuid primary key default uuid_generate_v4(),
  subject_id uuid references subjects(id),
  topic_id uuid references topics(id),
  exam_board_id uuid references exam_boards(id),
  question_type_id uuid not null references question_types(id),
  difficulty text not null check (difficulty in ('easy','medium','hard')),
  prompt text not null,
  -- Polymorphic content: shape validated in application (Zod schema keyed by
  -- question_type.key), not by Postgres, because the shape genuinely differs
  -- per type. This is the correct use of JSONB: heterogeneous, versioned,
  -- app-validated payloads — not a substitute for real columns on the parts
  -- that are the same for every question (subject/topic/board/difficulty).
  content jsonb not null,            -- { options: [...] } | { zones: [...] } | { rubric: '...' } etc.
  correct_answer jsonb not null,     -- shape matches content
  explanation text,
  estimated_seconds int not null default 30,
  media_url text,                    -- image/audio/video prompt asset
  status text not null default 'draft' check (status in ('draft','review','published','retired')),
  created_by uuid references profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_questions_topic on questions(topic_id);
create index idx_questions_subject_board_diff on questions(subject_id, exam_board_id, difficulty);
create index idx_questions_status on questions(status) where status = 'published';
create index idx_questions_content_gin on questions using gin (content jsonb_path_ops);
create index idx_questions_prompt_trgm on questions using gin (prompt gin_trgm_ops);

create table assessments (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  exam_board_id uuid references exam_boards(id),
  age_group text,
  duration_minutes int,
  subject_ids uuid[] not null default '{}',
  difficulty_mix text,
  mode text not null check (mode in ('practice','timed','simulation','print_shade')),
  shuffle_seed_strategy text not null default 'per_attempt',
  published boolean not null default false,
  created_at timestamptz not null default now()
);

create table assessment_questions (
  id uuid primary key default uuid_generate_v4(),
  assessment_id uuid not null references assessments(id) on delete cascade,
  question_id uuid not null references questions(id) on delete restrict, -- never silently drop a used question
  position int not null default 0,
  unique (assessment_id, question_id)
);
create index idx_assessment_questions_assessment on assessment_questions(assessment_id);

-- ---- High-growth tables below: candidates for monthly RANGE partitioning
-- ---- on started_at/created_at once volume warrants it (see perf doc).

create table assessment_attempts (
  id uuid primary key default uuid_generate_v4(),
  assessment_id uuid not null references assessments(id) on delete restrict,
  learner_id uuid not null references learners(id) on delete cascade,
  mode text not null,
  shuffle_seed bigint not null,       -- deterministic per-attempt shuffle, reproducible for audit
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  status text not null default 'in_progress' check (status in ('in_progress','submitted','abandoned')),
  uploaded_image_url text,            -- hybrid print-and-shade mode
  ocr_confidence_score numeric(3,2)
);
create index idx_attempts_learner on assessment_attempts(learner_id, started_at desc);
create index idx_attempts_assessment on assessment_attempts(assessment_id);
create index idx_attempts_in_progress on assessment_attempts(learner_id) where status = 'in_progress';

create table attempt_answers (
  id uuid primary key default uuid_generate_v4(),
  attempt_id uuid not null references assessment_attempts(id) on delete cascade,
  question_id uuid not null references questions(id) on delete restrict,
  response jsonb not null,            -- shape matches question content type
  is_correct boolean,                 -- null until marked (ai_marked/manual_review may lag)
  marked_at timestamptz,
  time_spent_seconds int,
  unique (attempt_id, question_id)
);
create index idx_attempt_answers_attempt on attempt_answers(attempt_id);
create index idx_attempt_answers_unmarked on attempt_answers(question_id) where is_correct is null;

create table assessment_results (
  id uuid primary key default uuid_generate_v4(),
  attempt_id uuid not null unique references assessment_attempts(id) on delete cascade,
  learner_id uuid not null references learners(id) on delete cascade,
  score int not null check (score between 0 and 100),
  percentile int,
  standardised_score int,
  created_at timestamptz not null default now()
);
create index idx_results_learner on assessment_results(learner_id, created_at desc);

create table topic_performance (
  id uuid primary key default uuid_generate_v4(),
  result_id uuid not null references assessment_results(id) on delete cascade,
  topic_id uuid not null references topics(id),
  score int not null check (score between 0 and 100),
  question_count int not null default 0
);
create index idx_topic_perf_result on topic_performance(result_id);
create index idx_topic_perf_topic on topic_performance(topic_id);

-- ============================================================================
-- SECTION 7: REVISION / MASTERY (see 10-revision-engine.md)
-- ============================================================================

-- topic_mastery: the ONE place per-topic mastery lives. Everything else
-- (revision_items, dashboards, AI briefings) reads this table rather than
-- recomputing from raw attempts each time — see 07-analytics-architecture.md.
create table topic_mastery (
  id uuid primary key default uuid_generate_v4(),
  learner_id uuid not null references learners(id) on delete cascade,
  topic_id uuid not null references topics(id) on delete cascade,
  mastery_score numeric(5,2) not null default 0, -- 0-100, decayed exponential moving average
  confidence numeric(3,2) not null default 0,    -- 0-1, based on sample size + recency
  attempts_count int not null default 0,
  last_attempt_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (learner_id, topic_id)
);
create index idx_topic_mastery_learner on topic_mastery(learner_id);
create index idx_topic_mastery_weak on topic_mastery(learner_id, mastery_score) where mastery_score < 60;

create table revision_items (
  id uuid primary key default uuid_generate_v4(),
  learner_id uuid not null references learners(id) on delete cascade,
  topic_id uuid not null references topics(id),
  reason text,
  priority text not null check (priority in ('high','medium','low')),
  recommended_activity text,
  due_date date,
  status text not null default 'not_started' check (status in ('not_started','in_progress','done','skipped')),
  generated_by text not null default 'system' check (generated_by in ('system','tutor','teacher')),
  created_at timestamptz not null default now()
);
create index idx_revision_learner_status on revision_items(learner_id, status);

create table brain_warmups (
  id uuid primary key default uuid_generate_v4(),
  learner_id uuid not null references learners(id) on delete cascade,
  activity_type text,
  started_at timestamptz not null default now(),
  completed_at timestamptz,
  score int,
  mood_before text,
  mood_after text
);
create index idx_warmups_learner on brain_warmups(learner_id, started_at desc);

create table mood_checkins (
  id uuid primary key default uuid_generate_v4(),
  learner_id uuid not null references learners(id) on delete cascade,
  mood text not null check (mood in ('happy','okay','tired','worried','excited','frustrated')),
  created_at timestamptz not null default now()
);
create index idx_mood_learner on mood_checkins(learner_id, created_at desc);

-- ============================================================================
-- SECTION 8: ACHIEVEMENTS / ACTIVITIES
-- ============================================================================

create table achievements (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  icon text,
  description text,
  category text not null check (category in ('academic','effort','consistency','brain_training','craft','competition'))
);

create table learner_achievements (
  id uuid primary key default uuid_generate_v4(),
  learner_id uuid not null references learners(id) on delete cascade,
  achievement_id uuid not null references achievements(id) on delete cascade,
  awarded_at timestamptz not null default now(),
  unique (learner_id, achievement_id)
);
create index idx_learner_ach_learner on learner_achievements(learner_id);

create table activities (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  type text not null check (type in ('summer_camp','craft_club','vocational','competition')),
  age_range text,
  description text,
  start_date date,
  end_date date,
  location text,
  capacity int,
  safety_notes text,
  consent_required boolean not null default true,
  price text,
  status text not null default 'open' check (status in ('open','full','closed'))
);

create table activity_registrations (
  id uuid primary key default uuid_generate_v4(),
  activity_id uuid not null references activities(id) on delete cascade,
  learner_id uuid not null references learners(id) on delete cascade,
  consent_status text not null default 'pending' check (consent_status in ('pending','given')),
  booking_status text not null default 'interested' check (booking_status in ('interested','booked','cancelled')),
  unique (activity_id, learner_id)
);
create index idx_activity_reg_learner on activity_registrations(learner_id);

-- ============================================================================
-- SECTION 9: SESSIONS / LESSON NOTES / HOMEWORK
-- ============================================================================

create table lesson_sessions (
  id uuid primary key default uuid_generate_v4(),
  learner_id uuid not null references learners(id) on delete cascade,
  tutor_id uuid not null references tutor_profiles(id) on delete restrict,
  subject_id uuid references subjects(id),
  scheduled_at timestamptz not null,
  status text not null default 'upcoming' check (status in ('upcoming','completed','cancelled')),
  video_room_id text, -- external video provider room reference
  created_at timestamptz not null default now()
);
create index idx_sessions_learner on lesson_sessions(learner_id, scheduled_at desc);
create index idx_sessions_tutor on lesson_sessions(tutor_id, scheduled_at desc);

-- HARD CONSTRAINT (product invariant #2): a tutor must be status='approved'
-- AND training_completed_at not null before any lesson_sessions row
-- referencing them can be inserted. Enforced with a trigger because it
-- requires a cross-table lookup a CHECK constraint cannot express.
create or replace function enforce_tutor_approved_before_assignment()
returns trigger language plpgsql as $$
declare
  v_status tutor_status;
  v_trained timestamptz;
begin
  select status, training_completed_at into v_status, v_trained
  from tutor_profiles where id = new.tutor_id;

  if v_status is distinct from 'approved' or v_trained is null then
    raise exception 'Tutor % is not approved/trained; cannot assign a lesson session', new.tutor_id
      using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

create trigger trg_enforce_tutor_approved
  before insert on lesson_sessions
  for each row execute function enforce_tutor_approved_before_assignment();

create table lesson_notes (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid not null references lesson_sessions(id) on delete cascade,
  learner_id uuid not null references learners(id) on delete cascade,
  tutor_id uuid not null references tutor_profiles(id) on delete restrict,
  topic_id uuid references topics(id),
  learning_objective text,
  covered text,
  strengths text,
  weaknesses text,
  confidence text check (confidence in ('low','medium','high')),
  homework_assigned text,
  parent_summary text not null, -- never nullable: this is the parent-visible contract
  safeguarding_concern boolean not null default false,
  deleted_at timestamptz,
  created_at timestamptz not null default now()
);
create index idx_lesson_notes_learner on lesson_notes(learner_id, created_at desc);
create index idx_lesson_notes_flagged on lesson_notes(learner_id) where safeguarding_concern = true;

create table homework (
  id uuid primary key default uuid_generate_v4(),
  learner_id uuid not null references learners(id) on delete cascade,
  title text not null,
  subject_id uuid references subjects(id),
  assigned_by uuid references profiles(id),
  due_date date,
  status text not null default 'not_started' check (status in ('not_started','submitted','marked'))
);
create index idx_homework_learner on homework(learner_id);

-- ============================================================================
-- SECTION 10: MESSAGING (see 08-messaging-architecture.md)
-- ============================================================================

create table message_threads (
  id uuid primary key default uuid_generate_v4(),
  learner_id uuid not null references learners(id) on delete cascade, -- NEVER nullable: no threads without a learner context
  subject text,
  created_at timestamptz not null default now(),
  archived_at timestamptz
);
create index idx_threads_learner on message_threads(learner_id);

create table thread_participants (
  id uuid primary key default uuid_generate_v4(),
  thread_id uuid not null references message_threads(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  role_in_thread text not null, -- 'tutor' | 'parent' | 'child' | 'school' | 'safeguarding'
  unique (thread_id, profile_id)
);
create index idx_thread_participants_profile on thread_participants(profile_id);

create table messages (
  id uuid primary key default uuid_generate_v4(),
  thread_id uuid not null references message_threads(id) on delete cascade,
  sender_id uuid not null references profiles(id),
  content text not null,
  channel text not null default 'in_app' check (channel in ('in_app','whatsapp_bridge','email_bridge')),
  flagged boolean not null default false,       -- automated language monitoring
  flagged_reason text,
  deleted_at timestamptz,                       -- soft delete: safeguarding may need it after "deletion"
  created_at timestamptz not null default now()
);
create index idx_messages_thread on messages(thread_id, created_at);
create index idx_messages_flagged on messages(flagged) where flagged = true;

create table message_read_receipts (
  message_id uuid not null references messages(id) on delete cascade,
  profile_id uuid not null references profiles(id) on delete cascade,
  read_at timestamptz not null default now(),
  primary key (message_id, profile_id)
);

create table message_attachments (
  id uuid primary key default uuid_generate_v4(),
  message_id uuid not null references messages(id) on delete cascade,
  storage_path text not null,
  mime_type text not null,
  size_bytes int,
  scanned_status text not null default 'pending' check (scanned_status in ('pending','clean','flagged'))
);
create index idx_attachments_message on message_attachments(message_id);

-- ============================================================================
-- SECTION 11: SAFEGUARDING / AUDIT
-- ============================================================================

create table safeguarding_cases (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  learner_id uuid not null references learners(id) on delete cascade,
  reported_by uuid references profiles(id),
  concern_type text,
  priority text not null check (priority in ('urgent','high','medium','low')),
  description text,
  status text not null default 'open' check (status in ('open','investigating','resolved')),
  assigned_to uuid references profiles(id),
  actions_taken text,
  outcome text,
  deleted_at timestamptz, -- cases are never hard-deleted; retention job anonymises instead
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index idx_cases_learner on safeguarding_cases(learner_id);
create index idx_cases_open on safeguarding_cases(status) where status <> 'resolved';
create index idx_cases_assigned on safeguarding_cases(assigned_to);

-- audit_logs: append-only, populated by triggers on safeguarding-relevant
-- tables (messages, lesson_notes, safeguarding_cases, tutor_profiles.status,
-- learners deletion). Never written to directly by application code for
-- these tables — the trigger is the only writer, so it cannot be forgotten.
create table audit_logs (
  id uuid primary key default uuid_generate_v4(),
  actor_id uuid references profiles(id),
  action text not null,          -- 'insert' | 'update' | 'delete' | 'status_change'
  entity_table text not null,
  entity_id uuid not null,
  diff jsonb,                    -- old/new values for update
  created_at timestamptz not null default now()
);
create index idx_audit_entity on audit_logs(entity_table, entity_id);
create index idx_audit_actor on audit_logs(actor_id, created_at desc);

create or replace function write_audit_log() returns trigger language plpgsql as $$
begin
  insert into audit_logs (actor_id, action, entity_table, entity_id, diff)
  values (
    coalesce(nullif(current_setting('request.jwt.claim.sub', true), '')::uuid, null),
    lower(tg_op),
    tg_table_name,
    coalesce(new.id, old.id),
    case when tg_op = 'UPDATE' then jsonb_build_object('old', to_jsonb(old), 'new', to_jsonb(new))
         when tg_op = 'DELETE' then jsonb_build_object('old', to_jsonb(old))
         else jsonb_build_object('new', to_jsonb(new)) end
  );
  return coalesce(new, old);
end;
$$;

create trigger trg_audit_messages after insert or update or delete on messages
  for each row execute function write_audit_log();
create trigger trg_audit_lesson_notes after insert or update or delete on lesson_notes
  for each row execute function write_audit_log();
create trigger trg_audit_safeguarding_cases after insert or update or delete on safeguarding_cases
  for each row execute function write_audit_log();
create trigger trg_audit_tutor_status after update of status on tutor_profiles
  for each row execute function write_audit_log();
create trigger trg_audit_learners_delete before delete on learners
  for each row execute function write_audit_log();

-- ============================================================================
-- SECTION 12: BILLING (placeholder shape, real fields once Stripe is wired)
-- ============================================================================

create table subscriptions (
  id uuid primary key default uuid_generate_v4(),
  parent_id uuid not null references profiles(id) on delete cascade,
  stripe_subscription_id text unique,
  plan_name text,
  status text not null default 'active' check (status in ('active','past_due','cancelled')),
  current_period_end timestamptz
);
create index idx_subs_parent on subscriptions(parent_id);

create table invoices (
  id uuid primary key default uuid_generate_v4(),
  subscription_id uuid references subscriptions(id) on delete cascade,
  stripe_invoice_id text unique,
  amount numeric(10,2) not null,
  status text not null default 'paid' check (status in ('paid','open','void')),
  issued_at timestamptz not null default now()
);
create index idx_invoices_subscription on invoices(subscription_id);

-- ============================================================================
-- SECTION 13: NOTIFICATIONS (see 06-background-jobs.md)
-- ============================================================================

create table notifications (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references profiles(id) on delete cascade,
  type text not null, -- 'lesson_note_added','message_received','tutor_approved', etc.
  payload jsonb not null default '{}',
  read_at timestamptz,
  created_at timestamptz not null default now()
);
create index idx_notifications_profile_unread on notifications(profile_id) where read_at is null;

-- ============================================================================
-- SECTION 14: updated_at MAINTENANCE (generic trigger, applied per table)
-- ============================================================================

create or replace function set_updated_at() returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_updated_at_profiles before update on profiles for each row execute function set_updated_at();
create trigger trg_updated_at_learners before update on learners for each row execute function set_updated_at();
create trigger trg_updated_at_tutor_profiles before update on tutor_profiles for each row execute function set_updated_at();
create trigger trg_updated_at_questions before update on questions for each row execute function set_updated_at();
create trigger trg_updated_at_safeguarding before update on safeguarding_cases for each row execute function set_updated_at();

-- ============================================================================
-- CASCADE BEHAVIOUR SUMMARY
-- ============================================================================
-- ON DELETE CASCADE : child row has no meaning without parent
--   (learners→profiles, attempt_answers→attempt, messages→thread, etc.)
-- ON DELETE RESTRICT : parent must not be removable while referenced
--   (questions referenced by assessment_questions/attempt_answers;
--    tutor_profiles referenced by lesson_sessions/lesson_notes — a tutor
--    is suspended, never deleted, while history exists)
-- ON DELETE SET NULL : reference is informational, safe to orphan
--   (learners.current_school_id, topics.parent_topic_id)
-- Soft delete (deleted_at) : used where safeguarding/audit needs the row to
--   keep existing after a user-facing "delete" (messages, lesson_notes,
--   safeguarding_cases). RLS policies filter deleted_at is null for normal
--   reads; safeguarding/admin roles can see through it.
