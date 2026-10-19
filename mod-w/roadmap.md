# Roadmap

**Project:** brand-ui  
**Date:** 2026-10-18  
**Status:** Approved with Architecture Definition

---

## Summary

The reference spike is delivered in two reviewable Steps, followed by static deployment and a fuller Moderator study review of the projects and UI library. Must scope is protected before Should scope. Could items S-10 to S-12 remain excluded; the Moderator promoted S-13 deployment to a required post-STEP-02 gate on 2026-10-19.

## Steps

| Step | Title | Requirements | Agent | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| STEP-01 | Theme foundation, button, card, and gallery shell | S-1, S-2, part S-3/S-4, S-8, S-9; AC-1 to AC-5, AC-13 to AC-16 | Claude Code | Accepted 2026-10-19 | CodeCraft is first approved cut |
| STEP-02 | Input, navigation, long labels, and final verification | remaining S-3 to S-7, S-9; AC-4 to AC-15 | Claude Code | Authorized 2026-10-19 | Adds Playwright, axe, README, final gates |
| Gate | Static deployment | S-13, AC-19 | Development Team | Required after STEP-02 | No indexing or third-party brand assets |
| Gate | Full project study review | Moderator decision | Moderator | Required after deployment | Covers the workspace projects and UI library |

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

## Coverage check

| Requirement | Step | Status |
| --- | --- | --- |
| S-1, S-2 | STEP-01 | Planned |
| S-3, S-4 | Both | Planned |
| S-5 to S-7 | STEP-02 | Planned |
| S-8 | STEP-01 | Should; first approved cut |
| S-9 | Both | Should |
| S-10 to S-12 | None | Could; excluded |
| S-13, AC-19 | Post-STEP-02 deployment gate | Required by Moderator 2026-10-19 |
| AC-1 to AC-5 | STEP-01; rechecked STEP-02 | Planned |
| AC-6 to AC-12 | STEP-02 | Planned |
| AC-13 to AC-15 | Both | Should |
| AC-16 | Human review | Passed 2026-10-18 |

## Cut order

1. Unstarted Could scope S-10 to S-12 remains excluded; the required S-13 deployment gate is not cuttable without a new Moderator decision.
2. Drop CodeCraft Light and Dark together if Must completion is threatened.
3. Drop gallery Design-ID badges if further reduction is necessary.
4. Any other reduction requires a Product decision.

---

MOD-W v5.0.1
