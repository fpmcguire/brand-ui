# Tech Lead Review — D-12 Before Measurement

## Verdict

**Pass.** The revised D-12 before-measurement satisfies S-18, AC-26, A-19, and the approved D-12 conditions. The prior size-baseline finding is resolved: the startup-loaded gallery route chunk is included, and the raw and gzip totals are computed from production-build files. This verdict is advice to the Moderator; it is not self-approval, Moderator acceptance, STEP-05 activation, or approval of a Development Team STEP-05 plan.

**Moderator disposition:** Accepted on 2026-10-28. The Moderator authorized the conventional commit of this review and the accepted D-12 before-measurement evidence. STEP-05 remains inactive.

## Scope check

- The evidence remains unstaged and uncommitted under `mod-w/evidence/d-12/before/`.
- The focused revision changed only `scripts/extract.mjs`, `summary.json`, `summary.md`, `commands.md`, and `hashes.sha256`, and added `logs/frozen-rebuild-for-size-baseline.log`.
- Application code, tests, dependencies, lockfiles, planning artifacts, and `mod-w/design/**` were not changed.
- The current branch remains `feature/atomic-design` at `55fbf3b82d9f6de9060fac7cd77e52b18af0479f`; frozen reference `bd241525a93afa468d069ca42bc300f62af3bd91` remains an ancestor.
- STEP-05 remains inactive. This review covers only the D-12 before-measurement evidence.

## Findings

### Must fix now

None.

### Could fix later

- The accepted slow-host warning and large timing variance remain material caveats for STEP-08. The after run must retain the same machine, Balanced power plan, Chrome/Lighthouse versions, throttling, and cold-run procedure; environment drift must stop the comparison and be reported.
- The generated method sentence in `summary.json` and `summary.md` lacks a space before “The identical script”. This is editorial only and does not affect the recorded method or calculations.

## Acceptance and Design-ID evidence mapping

| Requirement / decision | Result | Evidence |
|---|---|---|
| S-18, AC-26, A-19 — frozen before run | **Met** | `env.json`, `commands.md`, `logs/main-before.txt`, and the rebuild log identify frozen `v1.0.0` / `bd24152`, the production `/brand-ui/` build, Node 26.0.0, and npm 11.12.1. |
| D-12 — five cold mobile runs under fixed conditions | **Met with accepted caveat** | Five unchanged Lighthouse 13.5.0 reports use the approved mobile emulation, simulated throttling, cold storage/profile procedure, pinned Chrome, and one configuration hash. Each contains only the Moderator-accepted slow-CPU warning. |
| D-12 — median LCP, CLS, and TBT | **Met** | Raw reports reproduce medians of 2559.6461 ms LCP, 0.035028 CLS, and 630 ms TBT. The reports were not rerun or modified. |
| D-12 — raw and gzip startup JS/CSS totals | **Met** | All five raw Lighthouse reports contain the identical four-resource startup set. The corrected baseline includes `chunk-RK6W3FLA.js` and totals 297,506 raw bytes and 89,050 gzip-level-9 bytes for external JS plus combined CSS. |
| Size method reusable for STEP-08 | **Met** | `extract.mjs` unions same-origin Script/Stylesheet requests with index references, de-duplicates by built path, rejects inconsistent/unresolved/mismatched sets, sizes production files rather than transfers, and compares totals independently of hashed filenames. |
| Evidence integrity | **Met** | All 29 manifest entries match, cover every evidence file except `hashes.sha256` itself, and are unique. Summary arithmetic reconciles exactly; extractor syntax validation passed. |
| Design IDs | **Not applicable** | This evidence-only gate implements no visual design and changes no DS-030/031/035 or DS-061–066 surface. |

## Reference Implementation compliance

The prototype remains rejected as a Reference Implementation and was not used as implementation authority. No prototype or `mod-w/design/**` artifact changed. D-12 and the existing Card behavior contract remain authoritative.

## Next action

The frozen-v1.0.0 full-project study review remains the next recorded gate. STEP-05 must remain inactive until the Moderator completes that gate, confirms all pre-Step gates, activates STEP-05, and separately approves the Development Team's exact STEP-05 implementation and verification plan.
