# State Management & Rendering Strategy

## Decision table

| Concern | Default choice | Why |
|---|---|---|
| Dashboard pages (parent/tutor/school/admin overview) | **React Server Component**, data fetched in `features/*/queries.ts` | No client bundle cost for read-only aggregate views; RLS runs server-side with the real session; first paint has real data, no loading spinner for the common case |
| Forms (registration, lesson notes, messages, revision status) | **Server Actions** | Mutation + revalidation in one round trip, no separate API route to maintain, works without JS as a progressive-enhancement baseline |
| Mock exam in-progress screen (question navigation, timer, autosave) | **Client Component** | Needs local ephemeral state (current question index, countdown) that must not round-trip to the server on every keystroke |
| Chat / message thread | **Client Component + Supabase Realtime** | Needs live updates without polling |
| Notification bell | **Client Component + Supabase Realtime**, initial count via RSC | Avoids a loading flash for the badge count, then goes live |
| Admin tables (users, questions, tutors) | **RSC shell + Client Component for filters/pagination** | Filtering/sorting is a client interaction; the underlying data fetch on filter change is a Server Action returning fresh rows, not client-side filtering of an unbounded dataset |

## React Server Components

- Every dashboard route's `page.tsx` is an `async` Server Component calling
  `features/<domain>/queries.ts` directly (which wraps a Supabase server
  client bound to the request's cookies, so RLS applies exactly as it would
  for that user).
- No dashboard page fetches through a `/api/*` route it also owns — that
  would be a needless network hop. `/api/*` exists for webhooks, uploads,
  and anything a non-browser caller needs.

## Server Actions

- Every mutation (`createLearner`, `sendMessage`, `submitLessonNote`,
  `startAttempt`, `saveAnswer`, `approveTutor`, …) is a Server Action in the
  owning feature's `actions.ts`, wrapped in `withRole()` (see
  `02-auth-architecture.md §4`).
- Actions call `revalidatePath()`/`revalidateTag()` for the specific data
  they changed — tagged with the domain + id (`revalidateTag('learner:'+id)`),
  not a blanket `revalidatePath('/')`, so a message send doesn't invalidate
  the entire app's cache.

## Caching

- **Static/public marketing pages:** full static generation (`export const
  dynamic = 'force-static'` where content genuinely doesn't depend on
  session — home, trust, pricing, vocational, summer-camps).
- **Dashboard data:** `fetch`/query results tagged with `unstable_cache` +
  `revalidateTag`, keyed per-entity (`learner:{id}`, `school:{id}:cohorts`).
  Default TTL 60s as a safety net even without an explicit invalidation,
  so a missed revalidate call self-heals within a minute rather than
  serving stale data indefinitely.
- **Reporting aggregates** (§07 analytics): cached more aggressively (15
  min) because they're derived from materialised views that themselves
  refresh on a schedule — no point caching tighter than the source refreshes.
- Nothing safeguarding-relevant is ever cached beyond the request (cases,
  message-review queue) — always `no-store`.

## Streaming & Suspense

- Parent dashboard: shell renders immediately (child switcher, nav); each
  card (revision plan, achievements, message preview, mood trend) is its
  own `<Suspense>` boundary with a skeleton fallback, so one slow query
  (e.g. mood trend aggregation) never blocks the rest of the page.
- Admin reporting exports: the export itself is never streamed inline —
  it's a background job (§06) polled via `GET /reports/exports/:id`; the
  *page* showing "generating your report" uses Suspense + polling, not a
  long-held request.

## Optimistic updates

Used only for low-stakes, easily-reversible UI state:
- Mood check-in selection, revision-item status toggle, message
  read-receipts, "mark notification read."
- **Never** used for: assessment submission, lesson note submission,
  safeguarding concern reporting, tutor approval — these always wait for
  server confirmation before the UI reflects success, because a rollback
  on these would be confusing or (for safeguarding) actively harmful if a
  user believed a report had gone through when it hadn't.

## Realtime (Supabase Realtime / Postgres CDC)

- **Message threads:** client subscribes to `postgres_changes` on
  `messages` filtered `thread_id=eq.{id}`, scoped by the same RLS that
  governs the REST read — Realtime respects RLS, so no separate
  authorization layer is needed here.
- **Notifications:** subscribe to `notifications` filtered
  `profile_id=eq.{auth.uid()}`.
- **Safeguarding case updates:** DSL dashboard subscribes to
  `safeguarding_cases` changes for `status='open'` — new urgent cases
  appear without a refresh.
- **Not used** for assessment attempts (autosave is request/response, not
  realtime — there's only ever one writer, the learner, so there's nothing
  to synchronise) or for reporting aggregates (those are pull-based on a
  schedule, not push).

## Client-side global state

Deliberately minimal. No Redux/Zustand global store. Client state is:
- **URL state** (search params) for filters/pagination — shareable,
  back-button-correct, no extra library.
- **Local component state** for form drafts, in-progress exam UI.
- **React Context** used exactly once, for `RoleProvider`
  (dev-preview role switcher today; in production this becomes a thin
  context seeded from the server session for role-aware nav highlighting
  only — it is never the source of truth for permissions, which always
  come from the server/RLS).
