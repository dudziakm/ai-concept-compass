# AI Concept Compass MVP — Implementation Plan

> **Chronology:** reconstructed on 2026-07-31 after the product code landed in
> `d908521` and the CI ordering fix landed in `bfcd92b`. Completed progress rows
> point to those commits or to evidence gathered during this backfill. The plan
> does not pretend it governed the historical implementation.

## Overview

Deliver the first usable Polish learning flow for calibrated review: a private
account loads ten authored exam concepts, manages them, records confidence plus
self-assessed outcome, and receives a deterministic next-topic recommendation.
Complete delivery includes hosted database/auth, public Worker URL and retained
manual/E2E evidence, not source files alone.

## Current State Analysis

At revision `bfcd92b`, the source tree contains the requested auth, migration,
RLS, starter pack, CRUD, review scoring, dashboard, unit/contract tests, E2E spec
and CI. The repository began as a direct clone of the official starter at
2026-07-31T20:10:55+02:00 and preserved upstream history. Initial foundation
documents were thin and no change lifecycle artifacts existed; this folder
backfills them honestly.

Hosted Supabase migration, two-user policy execution, E2E credentials, public
Cloudflare deployment, browser/mobile smoke and screenshots are not proven.

## Desired End State

- The PRD, stack, infrastructure, roadmap, test strategy and this change form a
  traceable decision chain.
- A new user reaches a private dashboard, safely loads ten concepts, completes a
  review and receives a persisted recommendation.
- Ownership is enforced independently by the data boundary and proven with two
  ordinary accounts.
- Local/shared gates are green; hosted E2E is a required release check.
- A public URL, immutable revision, CI/deploy runs and screenshots form the final
  evidence package.

## What We're NOT Doing

- LLM calls, generated content or automatic answer grading.
- Payments, teams, roles, admin UI, import, notifications or gamification.
- Advanced SRS, charts, native/offline application or multi-region architecture.
- Astro 7 / adapter 14 upgrade inside this change.
- Fabricating historical interviews, bootstrap runs, hosted tests or deploys.

## Implementation Approach

Use vertical phases ordered by user outcome. Establish identity plus persistence
invariants before mutable learning data; deliver starter/CRUD; isolate the pure
scoring oracle; connect review and dashboard; then prove the exact cross-layer
flow in a hosted environment. Keep computed review history append-only and pass
`now` into domain functions. Maintain defense in depth: user-scoped service
queries plus database ownership policies.

## Critical Implementation Details

### Authorization boundary

Application filters provide predictable 404 behavior but are not the security
proof. Every user table must have enabled ownership policy, and review insert
must verify both attempt owner and concept owner. Hosted tests use ordinary
sessions, never an administrative database key.

### Deterministic review ordering

The latest attempt is the most recent `reviewed_at`. Recommendation order is due
first, priority descending, oldest attempt next. Unreviewed concepts are due with
priority 100. Time is supplied by callers so tests never depend on wall clock.

### Deployment/data rollback separation

Worker rollback does not roll back database migrations. Keep post-initial changes
additive and rehearse forward-fix/backout decisions separately from application
revision rollback.

## Phase 1: Product contracts and verified starter baseline

Create the durable discovery/decision chain and establish exactly how the
repository started, without rewriting code or history.

### Changes Required

#### Foundation contract

- **Files:** `context/foundation/shape-notes.md`, `prd.md`, `tech-stack.md`,
  `infrastructure.md`, `roadmap.md`, `test-plan.md`.
- **Intent:** make product, stack, infrastructure, sequencing and quality
  decisions inspectable outside chat.
- **Contract:** PRD has canonical greenfield frontmatter and ten ordered sections;
  stack handoff has the full starter schema; reconstructions carry provenance.

#### Context skeleton and bootstrap evidence

- **Files:** `context/{changes,archive,foundation}/README.md`,
  `context/changes/bootstrap-verification/verification.md`.
- **Intent:** satisfy the universal 10xWorkflow layout and preserve the observed
  clone/audit history.
- **Contract:** canonical READMEs; bootstrap log distinguishes reflog evidence,
  current audit and deviations from a formal pre-code bootstrapper run.

### Success Criteria

#### Automated Verification

- All required context directories and workflow artifacts exist.
- PRD headings/frontmatter, tech-stack keys and single `## Progress` contract
  pass read-only structural validation.
- Git reflog and current remotes support every scaffold-history claim.

#### Manual Verification

- Product owner accepts the reconstructed product decisions and chronology.

---

## Phase 2: Identity, data model and starter content

Deliver private ownership and the initial learning material as one safe vertical
enabler for all later user actions.

### Changes Required

#### Auth and ownership

- **Files:** `src/lib/supabase.ts`, `src/middleware.ts`, auth API/pages,
  `src/lib/api-context.ts`.
- **Intent:** establish a user identity for every protected page and API call.
- **Contract:** guest is redirected from dashboard and receives 401 from private
  APIs; authenticated user context flows through request cookies.

#### Database migration

- **File:** `supabase/migrations/20260731190000_ai_concept_compass.sql`.
- **Intent:** persist templates, concepts and append-only attempts with lifecycle
  and ownership invariants.
- **Contract:** three RLS-enabled tables, owner policies, review ownership check,
  unique owner/template pair, cascade history deletion and ten authored seeds.

#### Input and database contracts

- **Files:** `src/lib/schemas.ts`, `src/types.ts`,
  `tests/migration-contract.test.ts`, `src/lib/schemas.test.ts`.
- **Intent:** reject invalid writes and retain fast regression checks for the
  migration contract.
- **Contract:** confidence/outcome/content boundaries and stable domain enums.

### Success Criteria

#### Automated Verification

- Schema and migration contract tests pass.
- Migration statically contains RLS, cascade, uniqueness and ten templates.
- Hosted two-user suite denies cross-account select, update, delete and attempt
  insert while preserving same-owner operations.

#### Manual Verification

- Human links a hosted project, applies the migration and reviews the security
  advisor without exposing secrets.
- Confirmed test accounts can sign in and remain isolated.

---

## Phase 3: Private starter pack and concept lifecycle

Give the learner useful initial material and the complete private item lifecycle.

### Changes Required

#### Service and endpoints

- **Files:** `src/lib/services/concept-service.ts`,
  `src/pages/api/concepts/`, `src/pages/api/starter-pack.ts`.
- **Intent:** expose owner-scoped list/get/create/update/delete and idempotent
  starter loading behind the common API boundary.
- **Contract:** API/status shapes in `specs/api.md`; all mutable queries include
  owner; non-owned IDs return 404.

#### Concept UI

- **Files:** `src/components/dashboard/ConceptDashboard.tsx`,
  `ConceptForm.tsx`, `src/pages/dashboard.astro`.
- **Intent:** let the learner start from an empty state, load the pack and manage
  concepts without navigating raw API operations.
- **Contract:** loading/empty/error/busy states and add/edit/delete interactions
  from `specs/ui.md`.

### Success Criteria

#### Automated Verification

- Build/type/lint gates cover the CRUD and starter integration.
- Repeated starter invocation preserves one copy per user in hosted integration.
- Delete removes the concept and dependent attempts in hosted integration.

#### Manual Verification

- User loads exactly ten items, edits one, adds one and deletes one on desktop and
  360 px mobile.
- Error and busy states remain understandable without console failures.

---

## Phase 4: Calibrated review and recommendation dashboard

Deliver the non-trivial learning rule and connect it to the visible next-topic
outcome.

### Changes Required

#### Pure scoring engine

- **Files:** `src/lib/scoring.ts`, `src/lib/scoring.test.ts`.
- **Intent:** centralize formulas and ordering in deterministic functions.
- **Contract:** 0/50/100 outcomes; confidence scale; 60/40 mastery; non-negative
  overconfidence; 1/3/7/14-day schedule; capped priority; due/priority/age sort.

#### Review persistence and dashboard aggregate

- **Files:** `src/lib/services/concept-service.ts`, review/dashboard API routes.
- **Intent:** persist computed attempts and derive recommendation plus five-domain
  progress from current user history.
- **Contract:** append attempt after owner check; recalculate overdue points at
  supplied current time; return `DashboardData`.

#### Review and dashboard UI

- **Files:** `ReviewPanel.tsx`, `ConceptDashboard.tsx`.
- **Intent:** enforce the product sequence confidence → answer reveal → outcome
  and refresh the visible recommendation.
- **Contract:** labels and states in `specs/ui.md`.

### Success Criteria

#### Automated Verification

- Scoring tests cover every outcome, mastery history, overconfidence, two correct
  answers, overdue cap, clamp and ranking with protected thresholds.
- Critical Playwright scenario passes against configured hosted auth/database.

#### Manual Verification

- Learner can explain the confidence/self-assessment sequence without coaching.
- Recommendation and domain progress update visibly after review.

---

## Phase 5: Shared gates, production deployment and evidence

Turn implemented source into an auditable, publicly usable MVP.

### Changes Required

#### CI and E2E gate

- **Files:** `.github/workflows/ci.yml`, `playwright.config.ts`, `e2e/`.
- **Intent:** prevent merge when static/unit/build or critical hosted flow fails.
- **Contract:** minimal permissions, quality before E2E, required four secrets,
  failure artifacts and no secret exposure to untrusted forks.

#### Worker deployment

- **Files:** `astro.config.mjs`, `wrangler.jsonc`,
  `context/deployment/deploy-plan.md`.
- **Intent:** deploy the exact green revision with controlled secrets and a
  documented rollback/evidence trail.
- **Contract:** public URL maps to revision; auth redirect is configured; rollback
  remains separate from schema rollback.

### Success Criteria

#### Automated Verification

- CI quality job passes lint, typecheck, coverage and production build.
- Production dependency audit has no critical finding and every deferred major
  fix has an explicit risk decision.
- CI hosted E2E passes against the configured test account.

#### Manual Verification

- Public URL completes signup/login → pack → edit → review → recommendation →
  delete with no console errors.
- Mobile/keyboard smoke and two-account isolation pass.
- Repository, CI, deploy, URL and screenshot evidence are retained before form
  submission.

## Testing Strategy

### Unit Tests

- Treat PRD formulas as the oracle for scoring expected values.
- Cover boundary/invalid values in Zod schemas.
- Protect time handling through explicit `now` values.

### Integration Tests

- Use two ordinary hosted users for policy proof; never bypass RLS.
- Assert both HTTP response and database side effect for CRUD, pack and review.
- Exercise duplicate starter calls and parent-delete cascade.

### End-to-End Tests

- One critical Chromium flow keeps auth, routing, API and database real.
- Authenticate in the setup project, create unique state and clean in `finally`.
- Use semantic locators and observable waits only.

### Manual Testing Steps

1. Verify public auth and redirect behavior in a fresh browser profile.
2. Complete the entire learning flow at desktop and 360 px.
3. Repeat critical actions using keyboard only.
4. Verify two accounts cannot see each other's content.
5. Capture URL, revision, CI/deploy runs and screenshots.

## Performance Considerations

MVP targets at most 100 concepts per user and a 2-second dashboard result. The
current dashboard reads all owner concepts and attempts, acceptable only under
that assumption. Record Supabase region and measure hosted p95 before optimizing;
if history grows materially, fetch latest attempts in SQL rather than in-memory
deduplication.

## Migration Notes

This is the first product migration. Apply to a dedicated hosted project before
public launch. After real data exists, avoid destructive rollback: use additive
changes, backup/export where appropriate and forward fixes. A previous Worker
revision may expect a newer schema, so deploy order must be reviewed for every
future database change.

## References

- PRD: `context/foundation/prd.md`
- Roadmap: `context/foundation/roadmap.md`
- Test plan: `context/foundation/test-plan.md`
- Infrastructure: `context/foundation/infrastructure.md`
- Research: `context/changes/ai-concept-compass-mvp/research.md`
- API spec: `context/changes/ai-concept-compass-mvp/specs/api.md`
- Database spec: `context/changes/ai-concept-compass-mvp/specs/database.md`
- UI spec: `context/changes/ai-concept-compass-mvp/specs/ui.md`
- Source implementation: `d908521`
- CI ordering fix: `bfcd92b`

## Progress

> Convention: `- [ ]` pending, `- [x]` done. Append ` — <commit sha>` when a step lands. Do not rename step titles.

### Phase 1: Product contracts and verified starter baseline

#### Automated

- [x] 1.1 All required context directories and workflow artifacts exist
- [x] 1.2 PRD, stack handoff and plan structures pass read-only validation
- [x] 1.3 Git evidence supports the recorded starter history

#### Manual

- [ ] 1.4 Product owner accepts reconstructed decisions and chronology

### Phase 2: Identity, data model and starter content

#### Automated

- [x] 2.1 Schema and migration contract tests pass — d908521
- [x] 2.2 Static migration contract contains RLS, lifecycle and ten templates — d908521
- [ ] 2.3 Hosted two-user RLS deny matrix passes

#### Manual

- [ ] 2.4 Human applies migration and reviews hosted security advisor
- [ ] 2.5 Confirmed hosted accounts sign in and remain isolated

### Phase 3: Private starter pack and concept lifecycle

#### Automated

- [x] 3.1 Build, type, lint and route-contract gates cover CRUD and starter integration
- [ ] 3.2 Repeated hosted starter load preserves one copy per user
- [ ] 3.3 Hosted delete removes concept and dependent attempts

#### Manual

- [ ] 3.4 Desktop and mobile starter plus CRUD flow passes
- [ ] 3.5 Busy and error states pass without console failures

### Phase 4: Calibrated review and recommendation dashboard

#### Automated

- [x] 4.1 Scoring suite covers formulas, timing and ranking thresholds — d908521
- [ ] 4.2 Critical Playwright scenario passes against hosted services

#### Manual

- [ ] 4.3 Learner understands confidence and self-assessment sequence
- [ ] 4.4 Recommendation and domain progress update visibly after review

### Phase 5: Shared gates, production deployment and evidence

#### Automated

- [x] 5.1 CI quality job passes lint, typecheck, coverage and build — bfcd92b
- [x] 5.2 Dependency audit has no critical finding and deferred majors are recorded
- [ ] 5.3 CI hosted E2E job passes

#### Manual

- [ ] 5.4 Public full-flow smoke passes without console errors
- [ ] 5.5 Mobile, keyboard and two-account isolation smoke passes
- [ ] 5.6 Final URL, revision, runs and screenshots are retained
