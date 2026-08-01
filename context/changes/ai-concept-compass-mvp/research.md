---
date: 2026-07-31T22:45:00+02:00
researcher: Codex
git_commit: bfcd92bf33bdbd45478c8819d9965ae23caed047
branch: master
repository: ai-concept-compass
topic: "How does the implemented MVP realize the PRD across auth, data, API, scoring, UI and tests?"
tags: [research, codebase, auth, supabase, scoring, astro, playwright]
status: complete
last_updated: 2026-07-31
last_updated_by: Codex
evidence_quality: reconstructed-post-implementation
---

# Research: AI Concept Compass MVP implementation

**Date:** 2026-07-31T22:45:00+02:00  
**Researcher:** Codex  
**Git Commit:** `bfcd92bf33bdbd45478c8819d9965ae23caed047`  
**Branch:** `master`  
**Repository:** `ai-concept-compass`

> This is fresh codebase research performed while backfilling the change folder.
> It does not assert that research preceded the code. Evidence comes from the
> referenced revision; product intent comes from `context/foundation/prd.md`.

## Research Question

How does the implemented MVP realize the PRD across identity and ownership,
content lifecycle, calibrated review, recommendation, UI state and quality
gates, and what remains unproven?

## Summary

The implementation is a server-rendered Astro application with a React dashboard
island. Middleware establishes an authenticated user; every API route constructs
a service with the user's cookie-backed database client. The service adds an
explicit `user_id` filter even though the database independently enforces
ownership policies. One migration defines the complete data contract, including
ten templates, idempotency and review lifecycle.

The non-CRUD value lives in a pure scoring module: outcome and confidence are
normalized, mastery is exponentially smoothed, overconfidence is non-negative,
and the next recommendation uses due state, priority and oldest attempt. The UI
drives all four concept CRUD operations plus review and refreshes the aggregate
dashboard after mutations.

Automated evidence is strongest for scoring, request schemas and static migration
contracts. A browser test crosses UI/API/database, but neither it nor a two-user
RLS runtime suite has been proven against configured hosted services in the
available environment. Public deployment is also unproven.

## Detailed Findings

### Identity and request boundary

- Middleware resolves the session on every request and protects `/dashboard`
  ([`src/middleware.ts:4-24`](https://github.com/dudziakm/ai-concept-compass/blob/bfcd92b/src/middleware.ts#L4-L24)).
- The shared API context rejects unauthenticated calls with 401 and constructs a
  user-scoped service from request cookies
  ([`src/lib/api-context.ts:6-20`](https://github.com/dudziakm/ai-concept-compass/blob/bfcd92b/src/lib/api-context.ts#L6-L20)).
- JSON parsing uses Zod and a stable `{ error: { code, message, details? } }`
  envelope
  ([`src/lib/api.ts:3-30`](https://github.com/dudziakm/ai-concept-compass/blob/bfcd92b/src/lib/api.ts#L3-L30)).

**Insight:** authentication and authorization are distinct. Middleware provides
identity and route UX; service filters plus database policy provide ownership.

### Persistence and ownership

- The migration defines templates, user concepts and immutable review attempts,
  with bounds for domains, confidence and computed scores
  ([`migration:1-59`](https://github.com/dudziakm/ai-concept-compass/blob/bfcd92b/supabase/migrations/20260731190000_ai_concept_compass.sql#L1-L59)).
- Row-level policies allow global template reads but scope every mutable user
  operation to the authenticated owner
  ([`migration:61-107`](https://github.com/dudziakm/ai-concept-compass/blob/bfcd92b/supabase/migrations/20260731190000_ai_concept_compass.sql#L61-L107)).
- `(user_id, template_id)` prevents duplicate starter copies, and concept deletion
  cascades review attempts.
- Ten deterministic UUIDs seed authored AIF-C01 v1.1 templates from one official
  source
  ([`migration:109-219`](https://github.com/dudziakm/ai-concept-compass/blob/bfcd92b/supabase/migrations/20260731190000_ai_concept_compass.sql#L109-L219)).

**Risk:** the migration contract test proves expected SQL text exists; only a
hosted two-user test proves policies execute as intended.

### Service and API lifecycle

- Concept list/get/create/update/delete add explicit ownership predicates
  ([`concept-service.ts:11-83`](https://github.com/dudziakm/ai-concept-compass/blob/bfcd92b/src/lib/services/concept-service.ts#L11-L83)).
- Review creation first verifies concept ownership, reads the most recent attempt,
  passes a caller-provided time to scoring and persists the full result
  ([`concept-service.ts:85-117`](https://github.com/dudziakm/ai-concept-compass/blob/bfcd92b/src/lib/services/concept-service.ts#L85-L117)).
- Starter loading uses an upsert with conflict-ignore and then returns the current
  collection
  ([`concept-service.ts:119-146`](https://github.com/dudziakm/ai-concept-compass/blob/bfcd92b/src/lib/services/concept-service.ts#L119-L146)).
- Dashboard aggregation fetches concepts and attempts, selects the latest attempt
  per concept, recalculates overdue priority at the requested `now` and computes
  five domain averages
  ([`concept-service.ts:148-200`](https://github.com/dudziakm/ai-concept-compass/blob/bfcd92b/src/lib/services/concept-service.ts#L148-L200)).

Detailed request/response contracts are recorded in `specs/api.md`.

### Scoring and recommendation

- Outcomes map to 0/50/100 and confidence 1–5 maps to 0–100
  ([`scoring.ts:5-17`](https://github.com/dudziakm/ai-concept-compass/blob/bfcd92b/src/lib/scoring.ts#L5-L17)).
- Mastery, overconfidence, intervals and capped priority match the supplied
  formulas
  ([`scoring.ts:19-51`](https://github.com/dudziakm/ai-concept-compass/blob/bfcd92b/src/lib/scoring.ts#L19-L51)).
- Recommendation sorts due concepts first, then descending current priority, then
  oldest attempt; unreviewed items use time zero
  ([`scoring.ts:54-64`](https://github.com/dudziakm/ai-concept-compass/blob/bfcd92b/src/lib/scoring.ts#L54-L64)).

**Edge-case finding:** unreviewed items are treated as due with priority 100 in
the dashboard; tie-breaking makes them older than any reviewed item. This agrees
with the plan's “brak historii = priority 100” rule.

### UI and cross-layer state

- The dashboard centralizes request handling and refreshes server aggregates after
  starter load, save, delete and review
  ([`ConceptDashboard.tsx:12-109`](https://github.com/dudziakm/ai-concept-compass/blob/bfcd92b/src/components/dashboard/ConceptDashboard.tsx#L12-L109)).
- Loading, empty, error and busy states are explicit, and the UI exposes the
  recommendation, collection and domain progress rather than a raw CRUD table.
- Review is staged: select confidence, reveal the answer pattern, then choose the
  self-assessed outcome. Detailed UI contracts are in `specs/ui.md`.

### Tests and shared gates

- Unit tests cover scoring branches and input boundaries; V8 thresholds protect
  scoring and schema modules.
- The migration contract checks RLS declarations, ownership policy names,
  cascade/idempotency and the ten-template seed.
- The critical E2E uses semantic locators, waits on network/state, persists an
  edit and review, asserts aggregate mastery, and cleans data in `finally`
  ([`e2e/concept-review.spec.ts:5-52`](https://github.com/dudziakm/ai-concept-compass/blob/bfcd92b/e2e/concept-review.spec.ts#L5-L52)).
- CI runs lint, typecheck, coverage and build before E2E, with minimal repository
  permission
  ([`.github/workflows/ci.yml:9-63`](https://github.com/dudziakm/ai-concept-compass/blob/bfcd92b/.github/workflows/ci.yml#L9-L63)).

## Code References

- `src/types.ts` — domain types and dashboard DTO.
- `src/lib/schemas.ts` — write-boundary schemas.
- `src/lib/scoring.ts` — pure deterministic domain rules.
- `src/lib/services/concept-service.ts` — ownership-aware orchestration.
- `src/pages/api/` — HTTP transport and status mapping.
- `supabase/migrations/20260731190000_ai_concept_compass.sql` — data, RLS and seed source of truth.
- `src/components/dashboard/` — interactive learning UI.
- `src/lib/scoring.test.ts` and `src/lib/schemas.test.ts` — unit evidence.
- `tests/migration-contract.test.ts` — static database-contract evidence.
- `e2e/concept-review.spec.ts` — critical cross-layer scenario.

## Architecture Insights

1. **Defense in depth:** API ownership predicates give clear 404 semantics while
   database policy remains the security boundary.
2. **Pure domain seam:** all time-sensitive calculations accept `now`, making the
   business oracle independent of wall-clock state.
3. **Append-only attempts:** reviews create immutable history; dashboard derives
   current state rather than mutating a concept summary.
4. **Server-first with one island:** auth and protected routing stay server-side;
   the dashboard island owns interactive state and API refresh.
5. **No model dependency:** “AI” is product subject matter, not an application
   runtime integration.

## Historical Context

- Git reflog records a clone from
  `https://github.com/przeprogramowani/10x-astro-starter.git` at
  `2026-07-31T20:10:55+02:00`; the upstream history remains in this repository.
- `d908521` introduced the application code and thin context documents in one
  large MVP commit.
- `bfcd92b` added `astro sync` before CI lint, documenting a generated-types
  ordering requirement.
- Earlier `context/changes/redesign` and `refinement` entries belong to the
  upstream starter history and were removed from tracking before this product;
  they are not evidence of AI Concept Compass discovery.

## Related Research

- `context/foundation/infrastructure.md` — current platform comparison and risk register.
- `context/foundation/test-plan.md` — risk-to-layer strategy.
- `context/changes/bootstrap-verification/verification.md` — reconstructed scaffold evidence.

## Open Questions

1. Can two ordinary users execute the complete RLS deny matrix against the hosted
   migration?
2. Does the hosted critical E2E pass with confirmed email, redirect URLs and
   production-equivalent secrets?
3. What are public URL, Supabase region and measured dashboard p95?
4. Does a real learner understand when to choose partial vs correct?
