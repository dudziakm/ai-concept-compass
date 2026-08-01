---
bootstrapped_at: 2026-07-31T20:10:55+02:00
starter_id: 10x-astro-starter
starter_name: 10x Astro Starter (Astro + Supabase + Cloudflare)
project_name: ai-concept-compass
language_family: js
package_manager: npm
cwd_strategy: git-clone
bootstrapper_confidence: first-class
phase_3_status: ok
audit_command: npm audit --json
evidence_quality: reconstructed-from-reflog-and-current-tree
formal_bootstrapper_run: false
---

# Bootstrap Verification — reconstructed

> This file occupies the canonical bootstrap-verification path, but it was
> reconstructed after implementation. The original run was a direct repository
> clone, not a recorded `/10x-bootstrapper` invocation. Historical facts come
> from git reflog/history; dependency findings are a current audit run and are
> labelled accordingly. This distinction prevents a backfill from becoming a
> false chronology.

## Hand-off

No `context/foundation/tech-stack.md` existed at clone time. The current
reconstructed hand-off is copied below for self-contained audit context; it must
not be read as a verbatim pre-clone input.

```yaml
starter_id: 10x-astro-starter
package_manager: npm
project_name: ai-concept-compass
hints:
  language_family: js
  team_size: solo
  deployment_target: cloudflare-pages
  ci_provider: github-actions
  ci_default_flow: manual-promotion
  bootstrapper_confidence: first-class
  path_taken: custom
  quality_override: false
  self_check_answers:
    typed: true
    from_official_starter: true
    conventions: true
    docs_current: true
    can_judge_agent: true
  has_auth: true
  has_payments: false
  has_realtime: false
  has_ai: false
  has_background_jobs: false
```

The starter was chosen for a solo, short-deadline, authenticated TypeScript web
application with hosted relational data. The implemented runtime later resolved
to Cloudflare Workers; `infrastructure.md` owns that concrete decision.

## Pre-scaffold verification

This check was run on 2026-07-31 during reconstruction, not before the clone.

| Signal      | Value                                                               | Severity | Notes                                                                |
| ----------- | ------------------------------------------------------------------- | -------- | -------------------------------------------------------------------- |
| npm package | not run                                                             | n/a      | Registry command is `git clone`; no create-package can be derived.   |
| GitHub repo | `przeprogramowani/10x-astro-starter`, pushed `2026-05-17T10:33:39Z` | fresh    | Public, not archived; checked with read-only `gh api` on 2026-07-31. |

## Scaffold log

**Resolved invocation:** exact shell text unavailable; reflog records
`clone: from https://github.com/przeprogramowani/10x-astro-starter.git`  
**Strategy:** direct git clone into `ai-concept-compass` (deviation from the
bootstrapper's temporary-directory merge strategy)  
**Exit code:** inferred `0` from a complete checkout and clone reflog entry  
**Files moved:** not applicable; direct clone  
**Conflicts (.scaffold siblings):** none observed  
**.gitignore handling:** starter file retained and later edited in repository history  
**.bootstrap-scaffold cleanup:** not applicable  
**Upstream history:** retained; initial repository commits belong to the starter  
**Evidence:** `HEAD@{2026-07-31 20:10:55 +0200}` at `cc0bfeb`, followed by product
commit `d908521` and CI fix `bfcd92b`

The formal bootstrapper would remove the starter's `.git` directory before
merging. This clone kept upstream history and configured `upstream`; that is a
known process deviation, not an application defect.

## Post-scaffold audit

The audit below was run against the current tree on 2026-07-31, after product
implementation and dependency updates. It is not a snapshot of the untouched
starter.

**Tool:** `npm audit --json --omit=dev`  
**Summary:** 0 CRITICAL, 2 HIGH, 1 MODERATE, 1 LOW  
**Direct vs transitive:** 0/1/1/0 direct of total 0/2/1/1

### CRITICAL findings

None.

### HIGH findings

- `astro` (direct), affected through `<=7.0.9`; available automated resolution
  is Astro 7.1.6, a semver-major change outside the MVP.
- `sharp` (transitive), affected below 0.35.0; available automated resolution is
  through the same Astro 7.1.6 major upgrade.

### MODERATE findings

- `@astrojs/cloudflare` (direct), affected through 13.7.0; available resolution
  is adapter 14.1.7, a semver-major change.

### LOW / INFO findings

- `esbuild` (transitive), affected in 0.27.3–0.28.0; available resolution is
  coupled to the Astro major upgrade.

The accepted MVP decision is to record exposure and schedule a dedicated
Astro 7 + adapter 14 upgrade with runtime/E2E tests. No `npm audit fix --force`
was executed.

## Hints recorded but not acted on

| Hint                    | Value                                                                            |
| ----------------------- | -------------------------------------------------------------------------------- |
| bootstrapper_confidence | first-class                                                                      |
| quality_override        | false                                                                            |
| path_taken              | custom                                                                           |
| self_check_answers      | all five `true`                                                                  |
| team_size               | solo                                                                             |
| deployment_target       | cloudflare-pages in registry hand-off; Workers in actual infrastructure decision |
| ci_provider             | github-actions                                                                   |
| ci_default_flow         | manual-promotion                                                                 |
| has_auth                | true                                                                             |
| has_payments            | false                                                                            |
| has_realtime            | false                                                                            |
| has_ai                  | false                                                                            |
| has_background_jobs     | false                                                                            |

## Next steps

- Preserve this provenance note when reviewing evidence; do not describe the
  reconstruction as a historical skill run.
- Complete hosted Supabase/Cloudflare setup and the deploy plan.
- Run hosted two-user RLS and Playwright gates.
- Address the major-version audit findings in a separate change after MVP.
- Decide whether keeping upstream starter history is desired; do not rewrite
  published history merely to imitate a blank-repository chronology.
