# Roadmap

**Project:** brand-ui  
**Date:** 2026-10-18  
**Status:** Approved with Architecture Definition

---

## Summary

The one-day reference spike is delivered in two reviewable Steps separated by a mandatory Moderator study break. Must scope is protected before Should scope. Could items S-10 to S-13 are excluded.

## Steps

| Step | Title | Requirements | Agent | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| STEP-01 | Theme foundation, button, card, and gallery shell | S-1, S-2, part S-3/S-4, S-8, S-9; AC-1 to AC-5, AC-13 to AC-16 | Claude Code | Accepted 2026-10-19 | CodeCraft is first approved cut |
| Gate | Moderator study break | Product 1.2 | Moderator | Active | Step 2 cannot begin until explicitly ended |
| STEP-02 | Input, navigation, long labels, and final verification | remaining S-3 to S-7, S-9; AC-4 to AC-15 | Claude Code | Planned | Adds Playwright, axe, README, final gates |

## STEP-01

**Goal:** Establish the token/theme model and a reviewable vertical slice through button and card.

**Outputs:** semantic tokens; optional CodeCraft Should set; self-hosted fonts with evidence; theme service/directive; button; card; lazy gallery shell, switcher, four-scope view, computed swatches, relevant states/Design IDs; unit/static checks.

**Design IDs:** DS-001 to DS-015, DS-030 to DS-035, DS-060 foundation.

## Mandatory Moderator study break

The Moderator studies the theme service/directive and button until able to explain root versus host attachment, CSS as the only token-value source, signal-to-native-button behavior, and loading activation suppression, and can reproduce the core patterns without the prototype. The Moderator must explicitly authorize STEP-02.

## STEP-02

**Goal:** Complete Must scope and prove it through browser, accessibility, contrast, asset, and build gates.

**Outputs:** text input; navigation; remaining gallery states; long-label specimens; contrast verification; exactly three Chromium Playwright specifications including axe; final static/build gates; AC-12 README.

**Design IDs:** DS-020 to DS-025, DS-040 to DS-051, DS-060, plus completion checks for earlier IDs.

## Coverage check

| Requirement | Step | Status |
| --- | --- | --- |
| S-1, S-2 | STEP-01 | Planned |
| S-3, S-4 | Both | Planned |
| S-5 to S-7 | STEP-02 | Planned |
| S-8 | STEP-01 | Should; first approved cut |
| S-9 | Both | Should |
| S-10 to S-13 | None | Could; excluded |
| AC-1 to AC-5 | STEP-01; rechecked STEP-02 | Planned |
| AC-6 to AC-12 | STEP-02 | Planned |
| AC-13 to AC-15 | Both | Should |
| AC-16 | Human review | Passed 2026-10-18 |

## Cut order

1. Unstarted Could scope remains excluded.
2. Drop CodeCraft Light and Dark together if Must completion is threatened.
3. Drop gallery Design-ID badges if further reduction is necessary.
4. Any other reduction requires a Product decision.

---

MOD-W v5.0.1
