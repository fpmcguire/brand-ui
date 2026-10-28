# STEP-08 — Regression measurement and hardened extension gates

**Status:** Step plan approved by the Moderator, 2026-10-28; blocked by STEP-07 acceptance and separate approval of the Development Team's exact plan. **Estimate:** 4 hours. **Additional dependency:** valid pre-Step before-measurement.

## Goal

Automate D-12's production measurement comparison, record the after run, and make the extension's package/static gates final.

## Authority and traceability

- Product: S-18; AC-22 to AC-26; A-19.
- Design IDs: DS-061 to DS-066 and reused DS-030/031/035 are regression coverage only.
- No Reference Implementation exists; AC-20 remains the behavior baseline.

## Scope and expected files

- Pinned measurement tooling/config/scripts, before/after evidence records, package/token/asset verification hardening, root scripts and lockfile; test edits only for gate implementation.

## Out of scope

UI/API/token/design changes, threshold relaxation, performance claims, feature work, docs release, publishing, or live deployment.

## Requirements

1. Validate before evidence identifies `bd24152`/`v1.0.0`, exact environment, five cold runs, medians, and raw/gzip initial JS/CSS.
2. Run after under identical D-12 conditions and store raw results plus summary.
3. Add a deterministic check for D-12 thresholds: LCP `max(10%,150ms)`, TBT `max(10%,50ms)`, CLS `+0.02` and hard `0.10`, compressed initial JS+CSS `max(5%,10KiB)`.
4. A breach fails and is reported; do not change the baseline or threshold.

## Verification commands and mapping

```text
npm ci                                              # AC-23
npm run build:subfolder                             # AC-19, AC-23, AC-26 artifact
npm run measure:gallery:after                       # AC-26 five-run after evidence
npm run check:performance                           # AC-26 threshold
npm run verify:atomic-archive                       # AC-22, AC-23
npm run format:check                                # AC-24
npm run lint:tokens                                 # AC-24
npm run check:assets                                # AC-24
npm run typecheck:e2e                               # AC-24
npm test                                            # AC-20, AC-24
npm run test:e2e                                    # AC-20, AC-24, AC-25
npm run build                                       # AC-23
git diff --check
git status --short
```

## Acceptance checks

- [ ] AC-26 before/after results are comparable, complete, and make no benefit claim.
- [ ] AC-26 automated threshold passes or the Step stops for Moderator decision.
- [ ] AC-22/23 archive and installed consumption checks pass cleanly.
- [ ] AC-24 package self-test, assets, contrast, axe, exactly three specs, format, units, and builds pass.
- [ ] AC-20 and AC-25 behavior/structure coverage remains green without assertion weakening.

## Stop conditions and sequence

Stop for missing/contaminated baseline, different conditions, flaky/unpinned measurement, any threshold breach, assertion weakening, or failed gate. Exact Team plan → Moderator approval → implementation/evidence → Tech Lead review → fresh QA → Product Owner sign-off → Moderator acceptance. Do not begin STEP-09.

