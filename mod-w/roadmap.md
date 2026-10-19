# Roadmap

**Project:** brand-ui  
**Date:** 2026-10-19
**Status:** STEP-03 repository-link amendment directed; Development Team amendment plan pending

---

## Summary

The accepted two-Step component-library spike is followed by a small, separately reviewable S-11 About-panel Step, static deployment, and a fuller Moderator study review of the projects and UI library. S-10 and S-12 remain excluded. The Moderator promoted S-11 to wanted scope and S-13 deployment to a required gate on 2026-10-19.

## Steps

| Step    | Title                                                  | Requirements                                                   | Agent            | Status                                 | Notes                                           |
| ------- | ------------------------------------------------------ | -------------------------------------------------------------- | ---------------- | -------------------------------------- | ----------------------------------------------- |
| STEP-01 | Theme foundation, button, card, and gallery shell      | S-1, S-2, part S-3/S-4, S-8, S-9; AC-1 to AC-5, AC-13 to AC-16 | Claude Code      | Accepted 2026-10-19                    | CodeCraft is first approved cut                 |
| STEP-02 | Input, navigation, long labels, and final verification | remaining S-3 to S-7, S-9; AC-4 to AC-15                       | Claude Code      | Accepted 2026-10-19                    | Playwright, axe, README, final gates complete   |
| STEP-03 | Gallery About panel                                    | S-11, AC-17; recheck AC-4, AC-8, AC-9, AC-12                   | Claude Code      | Tech Lead Pass; Moderator approved review | QA delta/acceptance remains separate          |
| STEP-04 | Static subfolder deployment                            | S-13, AC-19                                                    | Development Team | Active; implementation plan pending    | `/brand-ui/`; no indexing or third-party assets |
| Gate    | Full project study review                              | Moderator decision                                             | Moderator        | Required after deployment              | Covers the workspace projects and UI library    |

## STEP-01

**Goal:** Establish the token/theme model and a reviewable vertical slice through button and card.

**Outputs:** semantic tokens; optional CodeCraft Should set; self-hosted fonts with evidence; theme service/directive; button; card; lazy gallery shell, switcher, four-scope view, computed swatches, relevant states/Design IDs; unit/static checks.

**Design IDs:** DS-001 to DS-015, DS-030 to DS-035, DS-060 foundation.

## Moderator sequencing decision

On 2026-10-19, the Moderator moved the study break until after STEP-02 completion and static deployment and authorized STEP-02 to proceed. The later gate is a fuller study review of the workspace projects and UI library, including the original theme attachment, CSS-token authority, signal/native-button behavior, and loading-suppression topics. STEP-02 acceptance and deployment evidence are prerequisites for that review.

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

## Cut order

1. S-10 and S-12 remain excluded.
2. STEP-03 implements only the promoted S-11 scope and must be accepted before the required S-13 deployment gate; neither may be silently cut or merged.
3. S-13 remains required and is not cuttable without a new Moderator decision.
4. The earlier CodeCraft and Design-ID shortcuts remain historical Product allowances; the accepted STEP-01/STEP-02 implementation is not reopened by STEP-03.
5. Any other reduction requires a Product decision.

## STEP-03 Moderator approval

On 2026-10-19, the Moderator approved STEP-03 as written, its bounded design authority, D-11, and sequencing S-11 before the required S-13 deployment gate. This approval allows the Development Team to inspect the baseline and submit its exact file/command plan. It does not approve implementation; the Team must stop for separate Moderator approval of that plan.

On 2026-10-19, after the initial implementation and Tech Lead review, the Moderator and Product Owner directed a distinct About-panel section linking to `https://github.com/fpmcguire/brand-ui.git`. Product v0.5 reconciles section 5.2 and AC-17 with that decision. The amendment is confined to About content and focused evidence; it changes no library API, token, asset, Design ID, route, or deployment scope. The Development Team must submit an exact amendment plan for separate Moderator approval, and the Tech Lead must perform a focused re-review before STEP-03 can be accepted.

## STEP-04 Moderator activation

On 2026-10-19, the Moderator activated S-13 as STEP-04 and directed a subfolder build for `/brand-ui/`. Activation authorizes planning only. The Development Team must submit its exact implementation and verification plan and receive separate Moderator approval before editing implementation or deployment configuration.

---

MOD-W v5.0.1
