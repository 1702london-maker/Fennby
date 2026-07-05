# Fennby — Engineering Architecture

**Status:** Foundational. This document set is the permanent engineering reference for Fennby.
No further feature/page development should contradict what's defined here without a deliberate,
documented architecture change (add an ADR — see `99-adrs.md`).

**Design targets**
- 10-year horizon, millions of MAU, tens of millions of rows in hot tables (assessment_attempts,
  attempt_answers, messages) within 3–5 years at scale.
- Multi-tenant by school/local-authority, single Supabase Postgres instance per environment
  (dev / staging / production), sharding only considered if a single primary can no longer serve
  write load (see `16-performance-review.md`).
- Every table designed so RLS is the *only* access-control boundary the client ever needs — the
  frontend never special-cases roles when reading data; the row either exists in the query result
  or it doesn't.

**Document index**
| File | Covers |
|---|---|
| `01-database-schema.sql` | Full DDL: tables, enums, FKs, indexes, constraints, cascade rules |
| `02-auth-architecture.md` | Auth flows per role, session model, permission middleware, RLS strategy |
| `03-api-architecture.md` | Every API endpoint: method, input, output, auth, validation, errors |
| `04-frontend-architecture.md` | Folder structure, layering, team conventions |
| `05-state-management.md` | RSC vs Client, Server Actions, caching, streaming, realtime |
| `06-background-jobs.md` | Job queue design, every scheduled/triggered job |
| `07-analytics-architecture.md` | Data flow: assessment → analytics → revision → reports → AI |
| `08-messaging-architecture.md` | Conversation schema, permissions, moderation, safeguarding visibility |
| `09-assessment-engine.md` | Assessment/question engine extensibility |
| `10-revision-engine.md` | Recommendation algorithm, mastery model |
| `11-learner-profile.md` | Single-source-of-truth learner data model |
| `12-ai-architecture.md` | AI service boundaries |
| `13-security-review.md` | AuthN/AuthZ/RLS/encryption/rate-limiting/abuse prevention |
| `14-deployment-architecture.md` | Environments, CI/CD, monitoring, backups |
| `15-performance-review.md` | Bottlenecks and mitigations, indexing/partitioning plan |

**Non-negotiable product invariants** (carried over from the brief, encoded as constraints
where possible rather than left to application discipline):
1. A parent can always read every row that references their linked learner — enforced by RLS,
   not by API-layer filtering.
2. A tutor cannot be assigned a learner (`lesson_sessions` insert) unless
   `tutor_profiles.status = 'approved'` — enforced by a DB trigger/constraint, not just app logic.
3. Any message row with a `learner_id` is readable by that learner's parent(s) — enforced by RLS
   policy, independent of who the sender/recipient is.
4. Every mutation to a safeguarding-relevant table is captured in `audit_logs` via trigger, not by
   remembering to call a logging function in every code path.
