# Authentication & Authorization Architecture

## 1. Identity provider

Supabase Auth (GoTrue) is the single identity provider for every human account —
parents, tutors, teachers, school admins, platform admin, safeguarding leads,
authority viewers, and (future) government users. **Children are the one
exception**: see §3.

Supabase issues a JWT containing `sub` (auth user id) and custom claims. We add
one custom claim via a Postgres function hooked into the JWT (`auth.jwt()`
customisation): `role` — copied from `profiles.role` at token mint time. RLS
policies read `auth.uid()` (always) and, where a fast role check is cheaper
than a join, `auth.jwt() ->> 'role'`.

```
Sign-up/Sign-in → GoTrue issues JWT → Postgres session sets auth.uid()
→ every query runs under RLS as that uid → app never manually filters by role
```

## 2. Per-role flows

### Parent
1. Email+password or magic link sign-up → `auth.users` row created.
2. On first sign-in, a Postgres trigger (`handle_new_user`) inserts a
   `profiles` row with `role = 'parent'` if one doesn't already exist
   (idempotent — also used by the tutor/school flows below).
3. Parent completes the child-profile form (`register/parent` flow) →
   `learners` row inserted with `parent_id = auth.uid()`. No `auth_id` yet.
4. Parent dashboard is immediately usable; the learner has no login of
   their own until step 5.
5. Parent can generate a **child login** at any time (§3).

### Child
Children get restricted credentials, not a parallel account system:
1. Parent action "Create child login" calls a **Server Action** (never
   directly exposed to the child) that:
   a. Creates an `auth.users` row via the Supabase Admin API using a
      username-style synthetic email (`{learner_id}@child.fennby.internal`)
      and a PIN the parent sets.
   b. Sets `learners.auth_id` to the new user's id.
   c. Inserts a `profiles` row with `role = 'child'`.
2. Child signs in with username + PIN on a dedicated `/child-login` screen
   (rate-limited harder than adult login — see §7).
3. Every RLS policy for child-readable tables checks
   `learners.auth_id = auth.uid()`, scoping the child strictly to their own
   learner row and everything that references it. A child JWT can **never**
   satisfy a `parent_id = auth.uid()` check — the two columns are disjoint by
   construction (a child's auth id is never also a parent's).
4. Children cannot self-register, cannot change their own credentials, and
   cannot delete their account — only the parent (or admin, for
   safeguarding reasons) can, via a Server Action that audits the action.

### Tutor
1. Public `/apply-tutor` sign-up creates `auth.users` + `profiles(role='tutor')`
   + a `tutor_applications` row (`status = 'submitted'`).
2. Applicant can log in immediately but is routed to an **application status
   page**, not the tutor dashboard, until `tutor_profiles.status = 'approved'`.
3. Admin approval workflow moves `tutor_applications.status` through the
   pipeline (§ tutor_status enum) via Admin API endpoints (§03). On
   `approved`, a trigger materialises a `tutor_profiles` row (copying
   relevant fields) — the tutor never edits `tutor_applications` again.
4. `tutor_profiles.training_completed_at` is set only when every
   `tutor_training_modules(required=true)` row has a matching
   `tutor_training_progress.completed_at`. Enforced by a Postgres function
   called after each training-progress insert; the dashboard link to "My
   Students" is hidden client-side *and* blocked server-side (the
   `lesson_sessions` insert trigger in `01-database-schema.sql` is the real
   enforcement — the UI hiding is just UX, not the security boundary).

### Teacher / School Admin
1. School registers via `/register/school` → `schools` row
   (`approved = false`) + the registering user gets `profiles(role='school_admin')`
   + a `school_users` row.
2. Until `schools.approved = true`, all school-scoped endpoints 403 with a
   clear "pending approval" error — enforced by RLS on `school_users` join
   through `schools.approved`.
3. Once approved, the school admin invites teachers (email invite → GoTrue
   invite link → `profiles(role='teacher')` + `school_users` row on accept).
4. A teacher's data access is always scoped through `school_users.school_id`
   → `classes.school_id` → `class_memberships.learner_id`. A teacher never
   has a direct FK to a learner; the join chain *is* the permission boundary.

### Platform Admin
- Never self-service. Created by an existing admin via a Server Action that
  requires the *caller* to already hold `role = 'admin'`, calls the Supabase
  Admin API to create the user, and inserts `profiles(role='admin')`. No
  public route exists for this.

### Safeguarding Lead
- Same invite-only pattern as Admin. `profiles(role='safeguarding')`.
  Distinguished from Admin because a DSL should NOT have platform-wide user
  management or billing access — RLS/permission tables treat them as
  separate roles even though both can see safeguarding_cases.

### Local Authority Viewer
- Invited by Admin, scoped to one or more local authorities via
  `role_grants(grant_role='authority', scope_type='school', scope_id=...)`
  rows (one per school in their LA) rather than a single LA string column —
  this lets an LA viewer's access be extended/revoked per-school without a
  schema change, and lets a future multi-LA authority user exist cleanly.
- Every query an authority user runs goes through **anonymising views**
  (`authority_school_progress_v`, never the base tables), so there is no
  code path where an authority JWT can reach a `learners` row directly.

### Future Government users
- Modelled today as `role = 'government'` in the enum (already present) with
  zero routes wired. When needed: same invite pattern as Authority, same
  anonymising-view constraint, additional requirement of aggregation across
  ≥ *k* schools before a metric is exposed (k-anonymity threshold configured
  in the view, not the application layer, so it can't be bypassed by a
  future frontend change).

## 3. Session & token model

- Supabase JWT, 1 hour expiry, silent refresh via refresh token (httpOnly
  cookie, `sb-access-token`/`sb-refresh-token`, set by `@supabase/ssr`).
- Child sessions use a **shorter** 20-minute expiry and do not persist a
  long-lived refresh token in shared/school devices — configured via a
  separate GoTrue "child" auth flow config (Supabase supports per-flow
  session settings via Auth Hooks).
- All Server Actions and Route Handlers re-derive the user from the request
  cookie via `createServerClient` — **never** trust a role/id passed in the
  request body.

## 4. Permission middleware

Two layers, deliberately redundant:

1. **Route-level guard** (`middleware.ts` + a `withRole()` helper wrapping
   Server Actions/Route Handlers): fast-fails with 403 before touching the
   DB if `profiles.role` (read once per request, cached in the request
   context) doesn't match the route's declared allowed roles. This exists
   for good error messages and to avoid needless DB round-trips — **it is
   not the security boundary**.
2. **RLS** (the actual boundary): every table's policies are written so that
   even if the route guard were deleted entirely, a malicious or buggy
   client could not read/write another user's rows. This is verified by an
   automated test suite that runs the full API surface as each role against
   fixtures for *every other* role's data and asserts zero leakage (see
   `13-security-review.md §Testing`).

```ts
// lib/auth/withRole.ts (shape, not full implementation)
export function withRole(allowed: Role[], handler: ActionHandler) {
  return async (...args) => {
    const { role } = await getSessionProfile(); // one cached lookup
    if (!allowed.includes(role)) throw new ForbiddenError();
    return handler(...args);
  };
}
```

## 5. Row-Level Security strategy

- Every table with a learner-scoping column has RLS **enabled by default**
  (Supabase project-level default, confirmed in `01-database-schema.sql`).
- Policy pattern used everywhere (kept mechanically consistent so a reviewer
  can audit all policies the same way):

```sql
create policy "<role> <verb> <table>" on <table>
  for <select|all> using (
    exists (
      select 1 from learners l
      where l.id = <table>.learner_id
        and (l.parent_id = auth.uid() or l.auth_id = auth.uid())
    )
  );
```

- Tutor/teacher/school policies join through the *assignment* tables
  (`lesson_sessions`, `class_memberships`, `school_child_links`) rather than
  a direct learner FK, so revoking an assignment immediately revokes access
  with no extra code.
- Safeguarding/admin policies check `profiles.role in ('safeguarding','admin')`
  directly — these two roles are the only ones allowed a "see everything in
  this domain" policy, and only for safeguarding-relevant tables.
- **No policy ever trusts a client-supplied role.** `auth.uid()` only; role is
  always re-derived server-side from `profiles`.

## 6. Row-Level Security — negative-space testing

Every migration that adds a table with a `learner_id`/`profile_id` column
must ship with a corresponding pgTAP test asserting:
- The owning parent/child can `select`.
- A *different* parent/child (fixture B) cannot `select` (0 rows, not an
  error — RLS fails closed).
- An unapproved tutor cannot `select` even with a matching subject.

This is CI-gated: a migration without a matching negative test fails the
`db:test` pipeline step (see `14-deployment-architecture.md`).

## 7. Abuse prevention on auth itself

- Adult login: Supabase built-in rate limiting + Cloudflare Turnstile on
  the sign-in form after 3 failed attempts.
- Child login (username+PIN — inherently lower entropy): a stricter
  server-side limiter (5 attempts / 15 min / IP+username pair) via a
  Redis-backed rate limiter in the Route Handler, independent of Supabase's
  own limiting, because PIN space is small enough that Supabase's default
  thresholds are not sufficient on their own.
- All auth events (`sign_in`, `sign_out`, `password_reset`,
  `child_login_created`, `role_changed`) are written to `audit_logs` via a
  GoTrue webhook → Route Handler → insert, not a client-side call.
