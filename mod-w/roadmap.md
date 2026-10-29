# Roadmap

**Project:** brand-ui  
**Date:** 2026-10-29
**Status:** STEP-08 accepted under the bounded threshold-breach amendment; STEP-09 Revision 2 approved and active for implementation; written study-review gate required after STEP-09

---

## Summary

The accepted v1.0.0 spike is followed by a Moderator-initiated Atomic Design extension. The Moderator accepted origin's annotated `v1.0.0` dereference to `bd241525a93afa468d069ca42bc300f62af3bd91`, the `feature/atomic-design` descent from that frozen reference, and the D-12 before-measurement. Five small Steps then scaffold the package, move Card without behavior change, add the structure view, enforce measurement/gates, and reconcile v1.1.0 documentation. By Moderator decisions on 2026-10-28, all study-review gates are consolidated as one additional final gate after STEP-09 and use written guides under `study-guides/` rather than an interactive quiz. The gate remains required before any release, publish, or deployment decision. S-10, S-12, and S-19 remain excluded.

## Steps

| Step    | Title                                                  | Requirements                                                   | Agent            | Status                                 | Notes                                           |
| ------- | ------------------------------------------------------ | -------------------------------------------------------------- | ---------------- | -------------------------------------- | ----------------------------------------------- |
| STEP-01 | Theme foundation, button, card, and gallery shell      | S-1, S-2, part S-3/S-4, S-8, S-9; AC-1 to AC-5, AC-13 to AC-16 | Claude Code      | Accepted 2026-10-19                    | CodeCraft is first approved cut                 |
| STEP-02 | Input, navigation, long labels, and final verification | remaining S-3 to S-7, S-9; AC-4 to AC-15                       | Claude Code      | Accepted 2026-10-19                    | Playwright, axe, README, final gates complete   |
| STEP-03 | Gallery About panel                                    | S-11, AC-17; recheck AC-4, AC-8, AC-9, AC-12                   | Claude Code      | Accepted 2026-10-19                    | About panel with source-repository link         |
| STEP-04 | Static subfolder deployment                            | S-13, AC-19                                                    | Development Team | Accepted 2026-10-19                   | `/brand-ui/`; no indexing or third-party assets |
| Gate | Remote reference and branch | MD-9, A-16 | Moderator | Accepted 2026-10-28 | Origin tag dereferences to `bd241525`; extension branch descends from it |
| Gate | Before measurement | S-18, AC-26, A-19; D-12 | Moderator/Development Team | Accepted 2026-10-28 | Frozen v1.0.0, five-run baseline before code |
| STEP-05 | Atomic package scaffold, pack, and installed consumption | S-15, S-16; AC-22 to AC-24 | Development Team | Accepted 2026-10-28 | Tech Lead, fresh QA, Product Owner, and Moderator reviews complete |
| STEP-06 | Move Card behind installed atomic package | S-14 to S-16; AC-20 to AC-24 | Development Team | Accepted 2026-10-28 | Tech Lead, fresh QA, Product Owner, and Moderator reviews complete; 39 paths at `6cfef8a` |
| STEP-07 | Gallery Card structure view | S-17; AC-20, AC-23 to AC-25 | Development Team | Accepted 2026-10-29 | Implemented at `8397fe8` under Revision 5 plan; Tech Lead, fresh QA, Product Owner, and Moderator reviews complete; Tag-stretch fix applied 2026-10-29 (uncommitted, one declaration in `card-structure.component.scss`) and verified; Product Owner sign-off in `mod-w/po-signoff-step-07.md` |
| STEP-08 | Regression measurement and hardened gates | S-18; AC-22 to AC-26 | Development Team | Accepted 2026-10-29 | Implemented at `62dac02`; Tech Lead, fresh QA, Product Owner, and Moderator reviews complete; authoritative TBT breach retained as a failed threshold under the bounded amendment |
| STEP-09 | v1.1.0 documentation and release-candidate truth | AC-12, AC-17, AC-20 to AC-27; Atomic Design documentation-priority amendment | Development Team | Active; Revision 2 approved 2026-10-29 | Exactly nine implementation paths; 5.25h; no publish/deploy; frozen STEP-08 evidence preserved |
| Gate | Consolidated written full-project study review | Moderator decisions of 2026-10-19 and 2026-10-28 | Moderator | Required after STEP-09 | Written guides in `study-guides/`; Moderator explains the workspace and library in their own words before deciding completion |

## STEP-01

**Goal:** Establish the token/theme model and a reviewable vertical slice through button and card.

**Outputs:** semantic tokens; optional CodeCraft Should set; self-hosted fonts with evidence; theme service/directive; button; card; lazy gallery shell, switcher, four-scope view, computed swatches, relevant states/Design IDs; unit/static checks.

**Design IDs:** DS-001 to DS-015, DS-030 to DS-035, DS-060 foundation.

## Moderator sequencing decision

On 2026-10-19, the Moderator moved the study break until after STEP-02 completion and static deployment and authorized STEP-02 to proceed. The later gate is a fuller study review of the workspace projects and UI library, including the original theme attachment, CSS-token authority, signal/native-button behavior, and loading-suppression topics. STEP-02 acceptance and deployment evidence are prerequisites for that review.

On 2026-10-28, the Moderator rescheduled all study-review gates as one additional final step after STEP-09. The review remains mandatory and retains its full scope, but it is not a prerequisite for work through STEP-09. It must be completed before any release, publish, or deployment decision. The Moderator accepted STEP-05 after Tech Lead review, fresh QA, and Product Owner sign-off, then approved the STEP-06 Revision 4 Tech Lead review, all four recorded recommendations, and the exact Development Team Revision 4 plan for implementation.

Also on 2026-10-28, the Moderator replaced the interactive study-quiz format with written study guides stored under `study-guides/`. Each guide supplies the explanation, source/test evidence, self-check prompts, a topic assessment, unanswered questions, further-study subjects, and a gate-readiness recommendation. The Moderator must still explain the implementation in their own words, but that demonstration does not block planning, implementation, review, QA, sign-off, or acceptance from proceeding through STEP-09. It applies only at the separate consolidated post-STEP-09 gate before a release, publish, or deployment decision. Creating or reading a guide, or observing that code exists, does not complete the gate; the Moderator alone records the completion decision.

## STEP-02

**Goal:** Complete Must scope and prove it through browser, accessibility, contrast, asset, and build gates.

**Outputs:** text input; navigation; remaining gallery states; long-label specimens; contrast verification; exactly three Chromium Playwright specifications including axe; final static/build gates; AC-12 README.

**AC-12 documentation check:** Replace the root Angular CLI boilerplate with the approved project README. Remove or replace `projects/ui/README.md` publishing boilerplate with a short non-publishing library note or a pointer to the root README; this spike must not instruct readers to publish the package to npm.

**Design IDs:** DS-020 to DS-025, DS-040 to DS-051, DS-060, plus completion checks for earlier IDs.

## STEP-03

**Goal:** Add the gallery-owned S-11 About panel and top-bar trigger without changing the `ui` public API, token contract, existing Design IDs, or three-brand/four-scope structure.

**Outputs:** native modal dialog; first-visit persistence with safe page-lifetime fallback; library `Button` trigger; seven required content sections including distinct methodology and source-repository sections; README/header consistency; focused unit coverage; AC-17 and amendment browser checks integrated into the existing three Playwright specifications; full existing gates.

**Design traceability:** No `DS-nnn` exists for S-11 and none may be invented. STEP-03 traces the panel through explicit AC-17 sub-checks. The gallery shows no Design-ID label for the panel.

## Coverage check

| Requirement    | Step                         | Status                                                              |
| -------------- | ---------------------------- | ------------------------------------------------------------------- |
| S-1, S-2       | STEP-01                      | Planned                                                             |
| S-3, S-4       | Both                         | Planned                                                             |
| S-5 to S-7     | STEP-02                      | Planned                                                             |
| S-8            | STEP-01                      | Should; first approved cut                                          |
| S-9            | Both                         | Should                                                              |
| S-10           | None                         | Could; excluded                                                     |
| S-11, AC-17    | STEP-03                      | Wanted scope; Step and bounded design authority approved 2026-10-19 |
| S-12           | None                         | Could; excluded                                                     |
| S-13, AC-19    | Post-STEP-03 deployment gate | Required by Moderator 2026-10-19; sequenced after wanted S-11       |
| AC-1 to AC-5   | STEP-01; rechecked STEP-02   | Planned                                                             |
| AC-6 to AC-12  | STEP-02                      | Planned                                                             |
| AC-13 to AC-15 | Both                         | Should                                                              |
| AC-16          | Human review                 | Passed 2026-10-18                                                   |
| S-14, AC-20, AC-21 | D-12 gate; STEP-06; rechecked STEP-07–09 | D-12/domain and STEP-06 Revision 4 approved; implementation pending |
| S-15, S-16, AC-22, AC-23 | STEP-05; completed by STEP-06; rechecked STEP-07–09 | STEP-05 accepted; STEP-06 refresh pending |
| AC-24 | STEP-05 then every extension Step | STEP-05 accepted; recheck pending in each later Step |
| S-17, AC-25 | STEP-07; rechecked STEP-08–09 | Draft; DS-061–066 and reused DS-030/031/035 |
| S-18, AC-26 | Pre-Step baseline and STEP-08; rechecked STEP-09 | Draft |
| AC-27 | STEP-09 | Draft |
| S-19 | None | Excluded by MD-4 |

## Atomic extension order and size

The estimated implementation effort is 21 hours over 4–5 working days, within A-14's 19–23 hour range. STEP-05 isolates workspace/package/bootstrap risk before runtime movement. STEP-06 makes the behavior-preserving move independently reviewable. STEP-07 adds the new review surface only after installed parts are stable. STEP-08 keeps measurement and gate mechanics separate from visual work. STEP-09 changes documentation only after the final architecture and measurements are factual. A-15 review, fresh QA, Product Owner sign-off, and Moderator acceptance occur after every Step.

| Step | Estimate | Dependency | First Design IDs | AC coverage |
| --- | ---: | --- | --- | --- |
| STEP-05 | 5h | Remote-reference/branch and before-measurement gates | None | AC-20, AC-22, AC-23, AC-24; recheck AC-19 |
| STEP-06 | 4h | STEP-05 accepted | DS-030–035 behavior evidence | AC-20–24 |
| STEP-07 | 5h | STEP-06 accepted | DS-061–066; reused DS-030/031/035 | AC-20, AC-23–25 |
| STEP-08 | 4h | STEP-07 accepted and valid before run | Regression coverage only | AC-20, AC-22–26 |
| STEP-09 | 3h | STEP-08 accepted | Documentation links all extension IDs | AC-12, AC-17, AC-20–27 |

## Extension Design-ID first-Step links

| Design ID | First extension Step |
| --- | --- |
| DS-061 to DS-066 | STEP-07 |
| DS-030, DS-031, DS-035 structure-view reuse | STEP-07 |

## AC-20 to AC-27 plan matrix

| AC | Authoritative check Step(s) |
| --- | --- |
| AC-20 | STEP-06 unchanged `card.spec.ts`, API/import compile probe, full unit/E2E; rechecked STEP-07–09 |
| AC-21 | Moderator-approved D-12/domain gate before STEP-05; implementation conformity STEP-06 |
| AC-22 | STEP-05 independent build/pack/manifest/inventory; refreshed STEP-06; rechecked STEP-08–09 |
| AC-23 | STEP-05 clean `npm ci` and installed builds; checked every later Step |
| AC-24 | STEP-05 atomic scan/self-test and asset archive coverage; complete gates every Step; structure axe/heading checks STEP-07 |
| AC-25 | STEP-07 four-scope specimens/IDs/tokens/unit/E2E in exactly three specs; rechecked STEP-08–09 |
| AC-26 | frozen before run before STEP-05; after run and threshold STEP-08; final check STEP-09 |
| AC-27 | STEP-09 README/library note/Public API/About audit, version truth, and final gates |

## Atomic extension approval record

- **2026-10-28 — D-12 and domain terms:** approved by the Moderator.
- **2026-10-28 — STEP-05 through STEP-09 plan:** approved by the Moderator.
- **2026-10-28 — `CLAUDE.md` and `AGENTS.md` extension changes:** approved by the Moderator and applied.
- **2026-10-28 — D-12 before measurement:** Tech Lead Pass accepted by the Moderator; corrected baseline records 2559.6461 ms median LCP, 0.035028 median CLS, 630 ms median TBT, and 89,050 bytes gzip-level-9 startup JS plus combined CSS. The accepted slow-host warning remains a STEP-08 comparison caveat.
- **2026-10-28 — remote reference and branch:** the Moderator accepted evidence that origin's annotated `v1.0.0` tag dereferences to `bd241525a93afa468d069ca42bc300f62af3bd91` and `feature/atomic-design` descends from that frozen reference.
- **2026-10-28 — STEP-05 activation:** activated for planning only. The exact Development Team implementation and verification plan requires separate Moderator approval before any implementation operation.
- **2026-10-28 — STEP-05 acceptance:** accepted by the Moderator as complete after Tech Lead review, fresh QA, and Product Owner sign-off.
- **2026-10-28 — STEP-06 Revision 4 approval:** the Moderator approved the Tech Lead re-review, the exact Development Team plan, and all four recommendations: the exact producer-test-only `paths` exception, `ui` peer `^1.1.0`, `card-export.spec.ts`, and the single committed equivalence log. Implementation is authorized; this is not Step acceptance.
- **2026-10-28 — STEP-06 source-map/tooling amendment:** after the Development Team stopped on ng-packagr's unavoidable secondary-entry source maps, the Moderator approved a strict shared dist sanitizer as the 39th path, the atomic test include needed for secondary-entry specs, and behavioral Card requiredness/transform evidence with complete optional-default assertions. The nine-file, no-source-path archive contract remains unchanged.
- **2026-10-28 — STEP-07 Revision 5 approval:** the Moderator approved the Tech Lead's Revision 5 review and the exact Development Team plan recorded in `mod-w/step-07-plan.md`, including AC-20 Option A (two selector-only edits), the caption-visibility rule, the token-derived responsive track rule, the static-check policy with its two-phase PowerShell execution plan, and the DS-035 no-heading correction. STEP-07 is active and implementation is authorized under that exact plan; this is not Step acceptance.
- **2026-10-29 — STEP-07 acceptance:** accepted by the Moderator after Tech Lead review, fresh QA, and Product Owner sign-off; tagged `step-07-complete`.
- **2026-10-29 — STEP-08 Revision 2 approval:** the Moderator activated STEP-08 and approved the Development Team's exact Revision 2 plan recorded in `mod-w/step-08-plan.md`, which adopts the Tech Lead's PASS WITH CONDITIONS plan review (full-precision thresholds, Node 26.0.0/npm 11.12.1 parity, the named after-evidence set, owned server and port checks, the Phase A gate audit, and the AC-power caveat) and the three open-decision recommendations (`scripts/d12/tooling/`, host drift recorded without invalidation, labelled copy of the extractor). Implementation is authorized; this is not Step acceptance. A threshold breach stops the Step for a Moderator decision. STEP-09 stays blocked.
- **2026-10-29 — STEP-08 bounded breach amendment:** the Moderator accepted the authoritative five-run after measurement with its TBT breach, prohibited a replacement measurement or another `check:performance` run, ratified direct use of the hash-verified frozen server, temporary tooling installation, and the integrated tooling helper, and authorized only evidence completion and the remaining gates. The breach remains a failed threshold result and is not attributed to the code.
- **2026-10-29 — STEP-08 Tech Lead review:** the Moderator accepted the completed Development Team work for Tech Lead review, then accepted the Tech Lead PASS under the bounded amendment and released STEP-08 to fresh QA. This is not STEP-08 acceptance; fresh QA, Product Owner sign-off, and final Moderator acceptance remain required. STEP-09 stays blocked.
- **2026-10-29 — STEP-08 fresh QA and Moderator disposition:** fresh QA returned PASS WITH NOTES under the bounded amendment (`mod-w/qa.md`), with the TBT breach retained as an authoritative failed threshold (809.362275 ms against 692.9999999999998 ms) and not attributed to the code. The Moderator accepted the QA review, confirmed the `mod-w/qa.md` overwrite, and directed the clean STEP-08 workspace to be committed for Product Owner review. No Product Owner sign-off exists yet; final Moderator acceptance is held until `mod-w/po-signoff-step-08.md` is recorded. This is not STEP-08 acceptance. STEP-09 stays blocked.
- **2026-10-29 — STEP-08 acceptance:** the Product Owner returned Accepted with notes in `mod-w/po-signoff-step-08.md`, explicitly accepting the authoritative TBT breach as recorded under the Moderator's bounded amendment without treating it as a passing threshold, attributing it to the code, or claiming a performance benefit. The Moderator accepted the Product Owner sign-off and accepted STEP-08 as complete after Tech Lead review and fresh QA. The completion commit is tagged `step-08-complete`. STEP-09 was not activated.
- **2026-10-29 — STEP-09 Atomic Design documentation-priority amendment:** stakeholders and the Moderator identified the UI Card's Atomic Design implementation as a significant project feature and required it to be explained and ranked highly across canonical user-facing and developer-facing product documentation, including the About panel, root README and `projects/ui/README.md`. The bounded amendment and acceptance checks are recorded in `mod-w/step-09.md`. This records scope only: STEP-09 is not activated, and implementation still requires a Development Team exact plan and separate Moderator approval.
- **2026-10-29 — STEP-09 planning activation:** the Moderator activated STEP-09 for planning only. The Development Team may inspect the repository and submit `mod-w/step-09-plan.md`; implementation remains unauthorized until Tech Lead review and separate Moderator approval of that exact plan.
- **2026-10-29 — STEP-09 Revision 2 approval:** after the Tech Lead PASS, the Moderator approved the exact Development Team Revision 2 plan in `mod-w/step-09-plan.md`, all O-1 through O-6 dispositions including the recorded O-1 assertion-change reason, and the 5.25-hour estimate. Implementation is authorized for exactly R1 to R9 under that plan and its stop conditions. This is not STEP-09 acceptance or release authority; `measure:gallery:after` and `check:performance` remain prohibited.
- **2026-10-28 — study-review sequencing:** the Moderator rescheduled all study-review gates as one additional final gate after STEP-09 and before any release, publish, or deployment decision. The gate remains pending and was not declared complete.
- **2026-10-28 — study-review format:** the Moderator replaced interactive quizzes with written guides under `study-guides/`. The own-words demonstration and Moderator-only completion decision remain required.
- **2026-10-28 — study-review sequencing clarification:** the Moderator determined that the own-words demonstration does not block work through STEP-09; it remains part of the later consolidated gate before release, publish, or deployment.
- **Limit:** STEP-06, STEP-07, and STEP-08 are accepted. STEP-09 has separate approval of its exact Revision 2 plan and is active for implementation only within its nine-path scope. Tech Lead implementation review, fresh QA, Product Owner sign-off, and Moderator acceptance remain required; release, publish and deployment decisions remain separate.

## Cut order

1. S-10 and S-12 remain excluded.
2. STEP-03 implements only the promoted S-11 scope and must be accepted before the required S-13 deployment gate; neither may be silently cut or merged.
3. S-13 remains required and is not cuttable without a new Moderator decision.
4. The earlier CodeCraft and Design-ID shortcuts remain historical Product allowances; the accepted STEP-01/STEP-02 implementation is not reopened by STEP-03.
5. Any other reduction requires a Product decision.

## STEP-03 Moderator approval

On 2026-10-19, the Moderator approved STEP-03 as written, its bounded design authority, D-11, and sequencing S-11 before the required S-13 deployment gate. This approval allows the Development Team to inspect the baseline and submit its exact file/command plan. It does not approve implementation; the Team must stop for separate Moderator approval of that plan.

On 2026-10-19, after the initial implementation and Tech Lead review, the Moderator and Product Owner directed a distinct About-panel section linking to `https://github.com/fpmcguire/brand-ui.git`. Product v0.5 reconciles section 5.2 and AC-17 with that decision. The amendment is confined to About content and focused evidence; it changes no library API, token, asset, Design ID, route, or deployment scope. The Development Team must submit an exact amendment plan for separate Moderator approval, and the Tech Lead must perform a focused re-review before STEP-03 can be accepted.

On 2026-10-19, the Moderator accepted STEP-03, including the source-repository amendment (AC-17.7). The acceptance is the Moderator's decision on the Tech Lead Pass and the recorded QA evidence: the six-section QA baseline in git history at `d49e703` and the STEP-04 QA run, which re-ran every gate on the implemented seven-section panel. A separate STEP-03 QA delta report was not written. The Step is tagged `step-03-complete` at `d49e703`.

## STEP-04 Moderator activation

On 2026-10-19, the Moderator activated S-13 as STEP-04 and directed a subfolder build for `/brand-ui/`. Activation authorizes planning only. The Development Team must submit its exact implementation and verification plan and receive separate Moderator approval before editing implementation or deployment configuration.

On 2026-10-19, the Moderator approved the Development Team plan. The Team implemented the three allowed files and the Moderator deployed the `/brand-ui/` build to `https://www.frank-mcguire.com/brand-ui/`. The Tech Lead independently verified the implementation, gates, local subfolder behavior, and live deployment. After the Moderator removed the publicly exposed upload archive, the focused remote re-check passed. The Moderator approved the Tech Lead review on 2026-10-19 and released STEP-04 to QA. QA independently re-ran every gate and verified the local `/brand-ui/` run and the live deployment, recorded Pass with notes in `mod-w/qa.md`, and the Moderator approved the QA review on 2026-10-19. The Product Owner then validated acceptance and signed off "Accepted with notes" in `mod-w/po-signoff-step-04.md`: the page-level `noindex, nofollow` meta is the effective AC-19 control, the `/brand-ui/robots.txt` copy is non-effective defense-in-depth, and O-1 to O-4 do not affect acceptance.

On 2026-10-19, the Moderator approved the Product Owner's review and accepted STEP-04. The Step is tagged `step-04-complete` at `f205dc3`. Notes O-1 to O-4 are recorded and open as host or tooling matters outside this Step: a root `robots.txt` (host-wide policy; if added, weigh that it would stop crawlers reading the page-level `noindex`), an HTTP-to-HTTPS redirect, and a Node-version pin. Each needs separate Moderator authorization. The full project study review was next until the Moderator's 2026-10-28 decision rescheduled all study-review gates as one additional final gate after STEP-09.

---

MOD-W v5.0.1
