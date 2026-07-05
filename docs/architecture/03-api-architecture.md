# API Architecture

## Conventions (apply to every endpoint below unless stated otherwise)

- **Transport:** Next.js Route Handlers under `src/app/api/**/route.ts` for anything
  called from outside a React render (webhooks, file uploads, cron triggers,
  third-party callbacks) and **Server Actions** (`"use server"`) for everything
  invoked from a form/UI interaction — see `04-frontend-architecture.md` for
  the rule of when to use which. The tables below describe the *contract*;
  whether it's physically a Route Handler or a Server Action is an
  implementation detail noted only where it matters (webhooks always are
  Route Handlers; mutations from forms are always Server Actions).
- **Auth:** every endpoint requires a valid Supabase session unless marked
  **Public**. "Permissions" states the role check *in addition to* RLS —
  remember RLS is the real boundary (see `02-auth-architecture.md §4`); the
  permission check here exists for a clean 403 instead of an empty result.
- **Validation:** every input is parsed through a Zod schema colocated in
  `src/lib/validation/<domain>.ts` before touching the DB. Invalid input
  never reaches a query.
- **Standard error shape:** `{ error: { code: string, message: string, fields?: Record<string,string[]> } }`.
  Standard codes reused everywhere: `unauthenticated` (401), `forbidden`
  (403), `not_found` (404), `validation_failed` (422), `conflict` (409),
  `rate_limited` (429), `internal` (500).
- **Pagination:** any list endpoint accepts `?cursor=&limit=` (default 20,
  max 100), returns `{ data, nextCursor }`. Cursor is the last row's
  `(created_at, id)` tuple, base64-encoded — not `OFFSET`, so pagination
  stays O(1) as tables grow (see `15-performance-review.md`).

---

## 1. Authentication (`/api/auth/*`)

### `POST /api/auth/signup`
- **Purpose:** create a parent, tutor, or school-admin account.
- **Input:** `{ email, password, fullName, intendedRole: 'parent'|'tutor'|'school_admin' }`
- **Output:** `{ userId }` (session cookie set)
- **Auth:** Public
- **Permissions:** none (intendedRole is validated against an allow-list; `admin`/`safeguarding`/`authority`/`government` are rejected here — 403 `forbidden`)
- **Validation:** email format, password ≥ 12 chars, fullName non-empty
- **Errors:** `conflict` (email exists), `validation_failed`
- **DB ops:** `auth.users` insert (Supabase Admin), trigger inserts `profiles`

### `POST /api/auth/login`
- **Purpose:** adult sign-in
- **Input:** `{ email, password }` → **Output:** session cookie
- **Auth:** Public · **Permissions:** none
- **Validation:** rate-limited 5/min/IP
- **Errors:** `unauthenticated` (invalid creds — generic message, no user enumeration), `rate_limited`
- **DB ops:** none direct (GoTrue); audit log via webhook

### `POST /api/auth/child-login`
- **Purpose:** child sign-in via username+PIN
- **Input:** `{ learnerUsername, pin }` → **Output:** session cookie (20 min expiry)
- **Auth:** Public · **Permissions:** none
- **Validation:** stricter rate limit (5/15min/IP+username, see `02-auth-architecture.md §7`)
- **Errors:** `unauthenticated`, `rate_limited`
- **DB ops:** none direct; audit log

### `POST /api/auth/child-login/create` (Server Action)
- **Purpose:** parent provisions a login for their child
- **Input:** `{ learnerId, username, pin }`
- **Auth:** session required · **Permissions:** `role=parent` AND `learners.parent_id = auth.uid()`
- **Validation:** PIN 6 digits, username unique
- **Errors:** `forbidden`, `conflict` (username taken)
- **DB ops:** Supabase Admin create user → update `learners.auth_id` → insert `profiles(role='child')`; audit log

### `POST /api/auth/logout`, `POST /api/auth/password-reset`, `POST /api/auth/password-reset/confirm`
- Standard GoTrue-backed flows, Public, rate-limited, audit-logged. No app-specific DB writes beyond the audit trigger.

---

## 2. Learners (`/api/learners/*`)

### `POST /learners` (Server Action `createLearner`)
- **Purpose:** create a child profile
- **Input:** full learner form (first/preferred name, DOB, year group, target exam/school, SEND notes, accessibility, consent boolean)
- **Auth:** required · **Permissions:** `role=parent`
- **Validation:** DOB implies age 4–19; consent must be `true` or reject
- **Errors:** `validation_failed`
- **DB ops:** insert `learners(parent_id=auth.uid())`

### `GET /learners` 
- **Purpose:** list the caller's learners (parent) or the one learner (child)
- **Auth:** required · **Permissions:** RLS-scoped, no extra check needed
- **DB ops:** `select * from learners` (RLS filters automatically)

### `GET /learners/:id`, `PATCH /learners/:id` (Server Action `updateLearner`)
- **Permissions:** `parent_id = auth.uid()` (RLS); PATCH additionally denies changing `parent_id`/`auth_id` from the client schema entirely (those fields aren't in the Zod input type)
- **Errors:** `not_found` (RLS makes "not yours" indistinguishable from "doesn't exist" — this is intentional, avoids leaking existence)

### `POST /learners/:id/archive`
- **Purpose:** soft-remove a learner (e.g. family leaves the platform) while preserving safeguarding history
- **Permissions:** `role=parent`, owner
- **DB ops:** `update learners set status='archived'`; does **not** delete — see cascade summary in schema doc

---

## 3. Parents (`/api/parents/*`)

### `GET /parents/me/dashboard-summary`
- **Purpose:** single aggregate call powering the parent overview page (avoids N waterfall requests)
- **Output:** `{ learners: [{ learner, latestResult, nextSession, unreadMessages }] }`
- **Permissions:** `role=parent`
- **DB ops:** one query joining `learners` → lateral `assessment_results` (latest) → lateral `lesson_sessions` (next upcoming) → `messages` unread count; see `07-analytics-architecture.md` for why this is a materialised/cached read, not 4 client-side fetches

### `POST /parents/me/guardians` (invite a co-parent/grandparent)
- **Input:** `{ learnerId, guardianEmail, canMessage: boolean }`
- **Permissions:** `role=parent`, owner of `learnerId`
- **DB ops:** invite via GoTrue (if new) → insert `guardian_permissions`

### `GET /parents/me/billing`, `POST /parents/me/billing/change-plan`
- See §15 Subscriptions.

---

## 4. Tutors (`/api/tutors/*`)

### `POST /tutors/apply` (Public)
- **Input:** full application form → **Output:** `{ applicationId }`
- **Validation:** required fields per `tutor_applications` NOT NULL set; DBS field format
- **DB ops:** insert `tutor_applications(status='submitted')`

### `GET /tutors` (browse, parent-facing)
- **Output:** list of `tutor_profiles where status='approved'`
- **Permissions:** any authenticated parent · **DB ops:** RLS + `status='approved'` filter (double-enforced: policy *and* WHERE clause)

### `GET /tutors/:id/students`, `GET /tutors/:id/students/:learnerId`
- **Permissions:** `role=tutor`, and a `lesson_sessions` row must exist linking this tutor to this learner (RLS join)
- **Errors:** `not_found` if no assignment exists (again, indistinguishable from non-existence by design)

### `POST /tutors/:id/students/:learnerId/lesson-notes` (Server Action `submitLessonNote`)
- **Input:** full lesson note fields + `safeguardingConcern: boolean`
- **Permissions:** `role=tutor`, must own an active `lesson_sessions` row for this pair
- **Validation:** `parentSummary` required non-empty (product invariant)
- **DB ops:** insert `lesson_notes`; if `safeguardingConcern`, additionally insert `safeguarding_cases(status='open', priority='medium')` and enqueue a notification job to the DSL (§06)
- **Errors:** `forbidden` (no active session), `validation_failed`

### `GET /tutors/me/schedule`, `POST /tutors/me/schedule/:sessionId/reschedule-request`
- Standard scoped CRUD per the pattern above.

### Admin-only tutor lifecycle: `POST /admin/tutors/:id/approve|reject|suspend`
- See §12 Admin.

---

## 5. Schools (`/api/schools/*`)

### `POST /schools/register` (Public)
- **Input:** school registration form → **Output:** `{ schoolId }` (pending)
- **DB ops:** insert `schools(approved=false)`, `profiles(role='school_admin')`, `school_users`

### `GET /schools/:id/cohorts`, `GET /schools/:id/cohorts/:classId`
- **Permissions:** `role in (school_admin, teacher)` AND `school_users` row for this school
- **DB ops:** `classes` join `class_memberships` join aggregated `topic_mastery`/`assessment_results` per learner (never raw learner PII beyond what the role is scoped to — see anonymisation note in §12 for LA/government variants)

### `POST /schools/:id/assignments` (Server Action `createAssignment`)
- **Input:** `{ type: 'homework'|'quiz'|'mock'|'reading'|'revision', title, targetType: 'learner'|'class'|'year_group', targetId }`
- **Permissions:** `role in (school_admin, teacher)`, scoped to own school
- **DB ops:** insert `homework` rows (fan-out to each learner in the target — done in a single `insert ... select` from `class_memberships`, not N inserts from the app)

### `GET /schools/:id/reports/:reportType`
- `reportType ∈ {cohort_progress, pupil_premium, send_progress, homework_completion, assessment_readiness, intervention_impact}`
- **Permissions:** `role in (school_admin, teacher)`
- **DB ops:** reads from pre-aggregated reporting views (§07), never raw tables — report generation must not do N+1 queries across a whole school

---

## 6. Assessments (`/api/assessments/*`)

### `GET /assessments?examBoard=&subject=&mode=`
- **Purpose:** browse published assessments · **Permissions:** any authenticated user
- **DB ops:** filtered `select` on `assessments where published=true`

### `POST /assessments/:id/attempts` (Server Action `startAttempt`)
- **Purpose:** begin an attempt
- **Permissions:** `role=child`, or `role=parent` acting on behalf of a linked learner in hybrid/print modes
- **Validation:** if `assessment.mode` requires a brain warm-up first (product rule), reject with `forbidden` + `code: 'warmup_required'` unless a `brain_warmups` row exists for this learner within the last 30 minutes
- **DB ops:** insert `assessment_attempts(shuffle_seed = random deterministic seed)`; the shuffle order is *computed*, not stored as a second copy of question order — see `09-assessment-engine.md`

### `PATCH /assessments/attempts/:id/answers/:questionId` (autosave, Server Action `saveAnswer`)
- **Input:** `{ response: jsonb, timeSpentSeconds }`
- **Permissions:** owner learner only, `attempt.status='in_progress'`
- **DB ops:** `upsert attempt_answers` — idempotent, called on every question transition, not just at submit, so a dropped connection never loses progress (offline-tolerant requirement)

### `POST /assessments/attempts/:id/submit`
- **Permissions:** owner learner
- **Validation:** attempt must be `in_progress`
- **DB ops:** transaction: mark `attempts.status='submitted'`, trigger marking job (§06 background jobs) for any `manual_review`/`ai_marked` questions, synchronously mark `exact_match`/`set_match`/`coordinate_match` questions, insert `assessment_results` + `topic_performance`, enqueue `recalculate_topic_mastery` job, enqueue `generate_revision_items` job
- **Errors:** `conflict` if already submitted

### `POST /assessments/attempts/:id/upload-print-shade` (Route Handler — file upload)
- **Input:** multipart image upload
- **Permissions:** owner learner/parent
- **DB ops:** upload to Supabase Storage → insert `assessment_attempts.uploaded_image_url` → enqueue OCR marking job → webhook callback updates `ocr_confidence_score` and answers once processed
- **Errors:** `validation_failed` (file type/size), `internal` (OCR provider failure — job retries with backoff, does not fail the request)

### `GET /assessments/attempts/:id/results`
- **Permissions:** owner learner/parent, or assigned tutor/teacher
- **DB ops:** join `assessment_results` + `topic_performance`

---

## 7. Question Bank (`/api/questions/*`) — admin-authoring surface

### `GET /questions`, `POST /questions`, `PATCH /questions/:id`, `POST /questions/:id/publish`
- **Permissions:** `role=admin` (question authoring is not exposed to tutors/teachers in v1)
- **Validation:** `content`/`correct_answer` shape validated against the Zod schema registered for `question_type.key` (a lookup table in code mirroring `question_types`, see `09-assessment-engine.md`)
- **DB ops:** standard CRUD on `questions`; `publish` transitions `status: draft→review→published` with a required `status='review'` intermediate before `published` (no direct draft→published)

### `GET /question-types`
- **Purpose:** frontend queries this to know which renderer/marker to use for a given question — this is *how* new question types onboard without a frontend redeploy for the data layer (the renderer component itself still needs shipping, but the wiring is data-driven)
- **Permissions:** any authenticated user

---

## 8. Revision (`/api/revision/*`)

### `GET /learners/:id/revision-items`
- **Permissions:** owner parent/child, or assigned tutor/teacher
- **DB ops:** `select * from revision_items where learner_id=:id and status != 'done' order by priority`

### `PATCH /revision-items/:id` (mark in_progress/done/skipped)
- **Permissions:** owner parent/child, or the tutor who generated it
- **DB ops:** update status; if `done`, no automatic mastery bump — mastery only moves via real assessment/practice attempts (prevents gaming the dashboard)

### `POST /revision-items` (tutor/teacher manual override)
- **Permissions:** `role in (tutor, teacher)`, must have an active assignment to the learner
- **DB ops:** insert with `generated_by = 'tutor'|'teacher'`

System-generated revision items are never created via this API — they're
written by the `generate_revision_items` background job (§06), which is the
only writer for `generated_by='system'` rows.

---

## 9. Messaging (`/api/messages/*`)

See `08-messaging-architecture.md` for the full data model. Endpoint summary:

### `POST /threads` — created implicitly on first message to a learner context, not a separate user action
### `GET /threads?learnerId=` — list threads for a learner (parent sees all; tutor sees only their own)
### `GET /threads/:id/messages` — paginated, cursor-based
### `POST /threads/:id/messages` (Server Action `sendMessage`)
- **Permissions:** caller must be a `thread_participants` row for this thread
- **Validation:** content non-empty, ≤ 4000 chars; run through the language-monitoring check (§08) synchronously for high-risk keyword classes, asynchronously (job) for the full model-based classifier
- **DB ops:** insert `messages`; if flagged, also insert into a safeguarding review queue (`messages.flagged=true` is itself the queue — `/safeguarding/message-review` just filters on it)
- **Realtime:** broadcast via Supabase Realtime channel `thread:{id}` (see `05-state-management.md`)

### `POST /messages/:id/read` — upsert `message_read_receipts`
### `POST /messages/:id/attachments` (Route Handler, file upload) — virus-scan job (§06) flips `scanned_status`

---

## 10. Achievements (`/api/achievements/*`)

### `GET /learners/:id/achievements` — earned + all-available (for locked-state UI)
### Achievements are **never** awarded via a client-callable endpoint — always
by a background job or DB trigger reacting to a qualifying event (streak
count, score threshold). This prevents a compromised client from
self-awarding badges.

---

## 11. Activities (`/api/activities/*`)

### `GET /activities?type=`, `POST /activities/:id/register` (Server Action)
- **Input:** `{ learnerId }` → creates `activity_registrations(consent_status='pending')`
- **Permissions:** `role=parent`, owner of learnerId
- **DB ops:** capacity check (`count(*) < activities.capacity`) inside the same transaction as the insert to avoid overbooking races; if full, `conflict` + auto-transition `activities.status='full'`

---

## 12. Safeguarding (`/api/safeguarding/*`)

### `POST /safeguarding/report-concern` (Public-to-authenticated-users — the one endpoint reachable from *every* role's UI)
- **Input:** `{ learnerId?, description, concernType }`
- **Permissions:** any authenticated role
- **DB ops:** insert `safeguarding_cases(priority='medium', status='open', reported_by=auth.uid())`; enqueue immediate notification job to all `role='safeguarding'` profiles (not a batch job — this one is synchronous-priority, see `06-background-jobs.md`)

### `GET /safeguarding/cases`, `GET /safeguarding/cases/:id`, `PATCH /safeguarding/cases/:id`
- **Permissions:** `role in (safeguarding, admin)` only — RLS-enforced, not just route-guarded
- **DB ops:** standard CRUD; every PATCH captured by the `write_audit_log` trigger automatically

### `GET /safeguarding/message-review?flagged=true`
- **Permissions:** `role=safeguarding` · **DB ops:** `select * from messages where flagged=true and deleted_at is null`

---

## 13. Admin (`/api/admin/*`)

### `GET /admin/dashboard-stats` — aggregate counts (cached 60s, see `07-analytics-architecture.md`)
### `GET /admin/users`, `PATCH /admin/users/:id/suspend`, `PATCH /admin/users/:id/role`
- **Permissions:** `role=admin` only
- **DB ops:** role changes always insert into `role_grants`/update `profiles.role` **and** write an explicit audit_logs row (not just relying on the generic trigger, since `profiles` isn't in the audited-table list by default — role changes are added explicitly because they're security-sensitive)

### `POST /admin/tutors/:id/approve`
- **DB ops:** transaction: update `tutor_applications.status='approved'` → materialise/update `tutor_profiles` → notification job to tutor
### `POST /admin/tutors/:id/reject`, `POST /admin/tutors/:id/suspend`
- Same pattern; `suspend` additionally cascades a check that cancels future `lesson_sessions` (status→'cancelled') for that tutor — done in the same transaction, not a follow-up job, because leaving stale "upcoming" sessions for a suspended tutor is a safeguarding gap.

### `POST /admin/schools/:id/approve` — flips `schools.approved`
### `GET /admin/questions`, `/admin/assessments`, `/admin/content` — see §7
### `GET /admin/safeguarding` — redirects to the dedicated safeguarding domain (§12); Admin does not get a parallel case-management UI, to avoid two systems of record

---

## 14. Reporting (`/api/reports/*`)

### `GET /reports/:type/export?format=pdf|csv`
- `type ∈ {pupil_premium, send_progress, cohort_progress, learning_passport, regional_impact}`
- **Permissions:** varies by type (school_admin/teacher for school reports, parent for learning_passport, authority for regional_impact)
- **DB ops:** reads from the relevant reporting view; **generation is async** — this endpoint enqueues an export job and returns `{ exportId }`; a second `GET /reports/exports/:id` polls status and returns a signed Storage URL when ready (exports are never generated synchronously in the request — see `06-background-jobs.md`)

---

## 15. Subscriptions (`/api/billing/*`)

### `GET /billing/me`, `POST /billing/change-plan`, `POST /billing/webhook` (Stripe, Route Handler, Public but signature-verified)
- **Permissions:** `role=parent` for the first two; webhook verifies Stripe signature instead of a user session
- **DB ops:** webhook is the only writer to `subscriptions`/`invoices.status` — the app never marks an invoice paid client-side, only Stripe's webhook does, idempotently keyed on `stripe_invoice_id`

---

## 16. Notifications (`/api/notifications/*`)

### `GET /notifications?unread=true`, `POST /notifications/:id/read`, `POST /notifications/read-all`
- **Permissions:** owner (`profile_id = auth.uid()`)
- Notifications are written only by background jobs/triggers (§06), never directly by another user's request — you cannot "send a notification" as an arbitrary API call, which closes off a spam vector.

---

## 17. AI (`/api/ai/*`)

All AI endpoints are thin proxies into the domain-specific AI services
described in `12-ai-architecture.md` — this section defines the *contract*,
not the model logic.

### `POST /ai/parent-briefing/:learnerId` (called by the weekly job, not by users directly)
### `GET /ai/parent-briefing/:learnerId/latest` — user-facing read of the last generated briefing
### `POST /ai/tutor-lesson-briefing/:learnerId` — on-demand, called when a tutor opens a student profile before a session
- **Permissions:** assigned tutor only
- **Rate limit:** 1 per learner per hour (avoid runaway LLM cost from repeated clicking)
- **DB ops:** reads `topic_mastery` + recent `lesson_notes` + `assessment_results`; writes nothing back automatically — output is ephemeral unless the tutor explicitly saves it into a `lesson_notes` draft

### `POST /ai/mark-answer` (internal, called by the marking job for `ai_marked` question types)
- Not user-callable directly; invoked only from the background job runner with a service-role key.

All `/ai/*` endpoints are **additionally** rate-limited per-profile (not just
per-IP) because the cost driver is model tokens, not requests.
