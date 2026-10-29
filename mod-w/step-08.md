# STEP-08 — Regression measurement and hardened extension gates

**Status:** Accepted 2026-10-29. Implemented at `62dac02` (`feat(d12): automate regression measurement and threshold check`) under the approved Revision 2 plan and the Moderator's bounded threshold-breach amendment. The Tech Lead returned PASS, fresh QA returned PASS WITH NOTES, the Product Owner returned Accepted with notes in `mod-w/po-signoff-step-08.md`, and the Moderator accepted the sign-off and determined STEP-08 complete. The TBT breach (809.362275 ms against 692.9999999999998 ms) remains an authoritative failed threshold, not a passing check, is not attributed to the code, and supports no performance-benefit claim. STEP-09 is not activated. **Estimate:** 4 hours. **Additional dependency:** valid pre-Step before-measurement.

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

- [x] AC-26 before/after results are comparable, complete, and make no benefit claim. Accepted 2026-10-29 with the recorded host and power-state caveats.
- [x] AC-26 automated threshold passes or the Step stops for Moderator decision. The check stopped with the authoritative TBT breach; the Moderator's bounded amendment accepted the recorded breach without converting it to a pass.
- [x] AC-22/23 archive and installed consumption checks pass cleanly. Accepted 2026-10-29.
- [x] AC-24 package self-test, assets, contrast, axe, exactly three specs, format, units, and builds pass. Accepted 2026-10-29.
- [x] AC-20 and AC-25 behavior/structure coverage remains green without assertion weakening. Accepted 2026-10-29.

## Stop conditions and sequence

The STEP-08 sequence is complete through final Moderator acceptance. Do not rerun the measurement or `check:performance` without new authority. Do not begin STEP-09 until the Moderator separately activates it and approves the Development Team's exact plan.

