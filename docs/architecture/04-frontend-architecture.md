# Frontend Architecture

## 1. Folder structure

```
src/
  app/                          # routes only — no business logic lives here
    (public)/                   # marketing/public route group
      page.tsx
      trust/page.tsx
      ...
    (auth)/
      login/page.tsx
      register/...
    (child)/child/...           # route groups per role for layout isolation
    (parent)/parent/...
    (tutor)/tutor/...
    (school)/school/...
    (admin)/admin/...
    (safeguarding)/safeguarding/...
    (authority)/authority/...
    api/                        # Route Handlers only (webhooks, uploads, cron)
      stripe/webhook/route.ts
      exports/[id]/route.ts
      ...
  components/
    ui/                         # pure presentational: Button, Card, ProgressRing...
                                 # zero data-fetching, zero business logic, storybook-able
    domain/                     # composed, data-shaped components: LearnerCard,
                                 # SafeguardingAlertCard — take typed props, still no fetching
  features/                     # <-- business logic lives here, one folder per domain
    learners/
      actions.ts                # Server Actions ("use server")
      queries.ts                # server-only data-fetch functions (RSC-callable)
      schema.ts                 # Zod input/output schemas
      types.ts                  # domain TypeScript types (mirrors DB row shape)
      hooks/                    # client hooks wrapping the above for Client Components
    assessments/
      actions.ts
      queries.ts
      schema.ts
      types.ts
      engine/                   # pure functions: shuffle, marking, mastery calc
                                 # (framework-agnostic, unit-testable without Next.js)
      hooks/
    messaging/
    tutors/
    schools/
    safeguarding/
    revision/
    ai/
  lib/
    supabase/
      client.ts                 # browser client
      server.ts                 # server client (cookies-bound)
      admin.ts                  # service-role client — imported ONLY in
                                 # features/*/actions.ts that need Admin API
                                 # (never imported in a Client Component file,
                                 # enforced by an eslint `no-restricted-imports` rule)
    auth/
      withRole.ts
      session.ts
    jobs/                       # background job definitions (see 06)
    validation/                 # shared cross-domain Zod primitives
    utils/                      # generic helpers, no domain knowledge
  types/
    database.ts                 # generated from Supabase (supabase gen types)
    domain.ts                   # hand-written domain types that compose the generated ones
```

**Rule enforced by ESLint boundaries plugin, not just convention:**
- `app/**` may import from `features/**`, `components/**`, `lib/**` — never the reverse.
- `components/ui/**` may not import from `features/**` (keeps it framework/data agnostic).
- `features/**/actions.ts` is the only place allowed to import `lib/supabase/admin.ts`.
- `features/*/engine/**` (assessment marking, shuffling, mastery calc) may not import
  anything from `app/**` or React — these are pure TS modules, unit-tested directly,
  because they encode the rules that must never silently drift between a form
  and a background job that both need to "mark a question."

## 2. Why this separation

The prototype build (current `src/app/*` + `src/lib/mock-data.ts`) mixed
presentation, data, and page routing in one file per page. That's correct
for a UI-only preview; it is **not** how the production app is organised.
Once real data is wired, a page component's job is: fetch (via
`features/*/queries.ts`), pass typed props to `components/domain/*`, done.
No page file should contain a Supabase query directly — that's what makes
the codebase reviewable by a team larger than one person, and what makes
the RLS/permission model in `02-auth-architecture.md` actually auditable
(you can grep `features/**/queries.ts` for every read path instead of
searching the whole `app/` tree).

## 3. Team ownership boundaries

- `features/assessments/engine/**` — owned by whoever is responsible for
  the assessment engine correctness (marking logic bugs are a trust
  issue, not just a bug).
- `features/safeguarding/**` and any file touching `safeguarding_cases`/
  `audit_logs` — changes require a second reviewer, enforced via
  CODEOWNERS, regardless of team size.
- `components/ui/**` — the only place that may reference brand tokens
  directly; `components/domain/**` composes `ui` components and must not
  hardcode colour/spacing values.
