# AI Concept Compass MVP — Plan Brief

> Full plan: `context/changes/ai-concept-compass-mvp/plan.md`  
> Research: `context/changes/ai-concept-compass-mvp/research.md`

## What & Why

Build a private Polish learning application that compares declared confidence
with self-assessed knowledge and recommends the next exam concept. Deterministic
calibration is the product value; model calls are deliberately absent.

This brief was reconstructed after the implementation commits. It describes the
intended delivery chain and remaining proof honestly, not a fictional pre-code
planning session.

## Starting Point

The official Astro starter was directly cloned on 2026-07-31 and the full MVP
source landed in `d908521`, followed by a CI generated-types fix in `bfcd92b`.
Source-level tests and CI quality exist; hosted services, public deploy and
manual evidence are not complete.

## Desired End State

A new user registers, loads ten concepts, manages the private collection,
completes a calibrated review and sees the next recommendation plus domain
progress. Hosted policy isolation, E2E, public mobile smoke and evidence all pass.

## Key Decisions Made

| Decision       | Choice                                                  | Why                                                  | Source         |
| -------------- | ------------------------------------------------------- | ---------------------------------------------------- | -------------- |
| Product value  | Deterministic calibration                               | Testable and independent of model cost/availability  | PRD            |
| Starter        | Official 10x Astro Starter                              | Typed auth/database/edge baseline for solo sprint    | Stack handoff  |
| Data           | Hosted Supabase with RLS                                | Database-enforced per-user isolation                 | Research       |
| Runtime        | Cloudflare Workers                                      | Existing official adapter/config and low MVP ops     | Infrastructure |
| Review history | Append-only attempts                                    | Preserves learning history and derives current state | Research       |
| Quality        | Risk-based unit + hosted integration + one critical E2E | Cheapest signal at each boundary                     | Test plan      |
| Release        | Manual production promotion                             | Account/secrets remain human-controlled              | Infrastructure |

## Scope

**In scope:**

- Registration, login/logout and protected dashboard.
- Ten authored starter concepts, owner CRUD and cascade history deletion.
- Confidence, self-assessment, mastery, calibration, schedule and priority.
- Recommendation, five-domain progress, empty/loading/error/busy states.
- RLS, schemas, tests, CI, Worker deploy plan and evidence checklist.

**Out of scope:**

- LLM/generation/automatic grading.
- Payments, teams/admin, imports, notifications and gamification.
- Advanced SRS/charts, native/offline and multi-region architecture.
- Major Astro/adapter upgrade during MVP.

## Architecture / Approach

```text
Astro middleware/session → authenticated API routes → owner-scoped service
→ hosted PostgreSQL/RLS → pure scoring → dashboard aggregate → React UI
```

The API filter and RLS policy form defense in depth. `now` is supplied to pure
scoring functions. Reviews append history; dashboard derives the latest state.

## Phases at a Glance

| Phase            | What it delivers                          | Key risk                                   |
| ---------------- | ----------------------------------------- | ------------------------------------------ |
| 1. Contracts     | Honest durable product/technical workflow | Backfill could imply false chronology      |
| 2. Identity/data | Owner isolation and starter source        | Static policy checks are not runtime proof |
| 3. Collection    | Idempotent pack and full private CRUD     | Retry/lifecycle bugs                       |
| 4. Calibration   | Review scoring and recommendation         | Wrong test oracle or ordering              |
| 5. Release       | Blocking gates, public URL and evidence   | Hosted boundary remains untested           |

**Prerequisites:** human Supabase and Cloudflare authentication, confirmed E2E
accounts and repository secret entry for final proof.  
**Estimated effort:** source implementation is present; remaining work is one
hosted-environment/evidence session plus any fixes it reveals.

## Open Risks & Assumptions

- The small-scale assumption and database region are not validated by telemetry.
- Two-user RLS and full E2E have not run against hosted infrastructure.
- Production advisories require a later Astro 7/adapter 14 upgrade.
- Self-assessment terminology needs learner usability validation.

## Success Criteria (Summary)

- First user reaches a recommendation in under five minutes.
- Ordinary accounts cannot cross ownership boundaries.
- Quality + hosted E2E gates, public smoke and evidence all pass.
