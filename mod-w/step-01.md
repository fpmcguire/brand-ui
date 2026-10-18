# STEP-01 — Theme foundation, button, card, and gallery shell

**Status:** Planned; requires Moderator activation before implementation

---

## Goal

Create the smallest reviewable vertical slice: semantic tokens, host-scoped runtime theming, self-hosted typography, button and card components, and a lazy gallery demonstrating approved states across available scopes.

## Related requirements

- S-1, S-2, button/card portions of S-3 and S-4, applicable S-6/S-7, S-8, S-9.
- AC-1 to AC-7 and AC-9/AC-11/AC-12 as applicable to Step 1.
- AC-13 to AC-15 as Should scope. AC-16 has passed; preserve the approved directions.

## Related Design IDs

| Design IDs | Intent |
| --- | --- |
| DS-001 to DS-003 | Identical semantic token contract |
| DS-004 to DS-005 | Switcher, minimal gallery, status, Design-ID badges |
| DS-010 to DS-015 | Button variants and states |
| DS-030 to DS-035 | Static, interactive, and loading card states |
| DS-060 | Computed token evidence foundation; final automated gate is STEP-02 |

## Assigned Development Team interface

- [x] Claude Code
- [ ] Claude Design

## Scope

1. Confirm Angular, Node, TypeScript, and package-manager versions.
2. Add theme types, `ThemeService`, and `ThemeScopeDirective` per D-01/D-02.
3. Add the token-name contract and CSS values without duplicating values in TypeScript or gallery data.
4. Acquire only approved font styles/weights, with family-specific `OFL.txt` and `SOURCE.md`.
5. Implement and export button and card per D-04.
6. Replace the generated gallery placeholder with a lazy page containing the switcher, one/four panels, computed swatches, approved specimens, gallery-owned forced states, and relevant Design IDs.
7. Add focused unit tests and Step-level token/asset checks.

## Out of scope

- Text input, navigation, final long-label specimens, and final Playwright/axe/contrast gates.
- README completion and all Could items S-10 to S-13.
- Storybook, SSR, publishing, general dark mode, and edits under `mod-w/design/`.

## Inputs

- `mod-w/product.md`
- `mod-w/design/design-spec.md`
- `mod-w/architecture.md`
- `mod-w/domain-language.md`
- Prototype inventory/source as visual evidence only
- Existing Angular workspace

## Expected file areas

- `projects/ui/src/lib/theme/**`
- `projects/ui/src/lib/button/**`
- `projects/ui/src/lib/card/**`
- `projects/ui/src/public-api.ts`
- `projects/gallery/src/app/**`
- `projects/gallery/src/styles.scss`
- `package.json` and `scripts/**` only as required by approved Step gates

## Reference Implementation

**Location:** `mod-w/design/project/Main.dc.html`  
**Disposition:** Reject as a Reference Implementation. Implement from scratch; use it only as visual evidence.

| Assumption type | Details |
| --- | --- |
| Accepted behavior | Semantic properties, host-scoped panels, stretched card link, approved states |
| Modified implications | Brand/mode model, shared CodeCraft values, `:focus-within`, computed swatches, forced variables, self-hosted fonts |
| Rejected structures | Canvas runtime, inline scripts, duplicated token objects, `.is-*` component classes, Google Fonts request |
| Mandatory divergence | Angular 22.2 standalone zoneless signals, strict types, native semantics, tests, public-entry consumption, no prototype import/copy |

## Acceptance checks

- [ ] ArtAnon and Mentor resolve the identical complete contract (AC-1; DS-001 to DS-003).
- [ ] If included, CodeCraft Light/Dark are modes of one brand, share non-color values, and produce four gallery scopes (AC-13).
- [ ] Switching restyles every Step 1 component without reload; All brands shows four scopes when CodeCraft is included (AC-2/AC-5).
- [ ] Swatches read computed properties and have no copied token-value object.
- [ ] Button/card are standalone signal components, exported from `ui`, and consumed through that entry point (AC-4).
- [ ] Loading button remains focusable, labeled, `aria-busy`, and suppresses all activation (DS-015).
- [ ] Interactive card has one native link/tab stop; static/loading cards are non-interactive (DS-030 to DS-035).
- [ ] Forced specimens use gallery-owned variables, not public preview APIs or `.is-*` classes.
- [ ] Component styles contain no brand-specific names or literal brand values (AC-3/AC-14).
- [ ] Applicable focus, keyboard, and contrast checks pass.
- [ ] Used fonts have matching OFL and provenance; prohibited assets are absent (AC-12).
- [ ] Unit tests cover theme facilities, button, and card; Step build/tests pass (AC-9/AC-11).
- [ ] AC-16’s approved distinction is preserved.

## Cut rule

If Must scope is at risk, stop CodeCraft as one coherent cut before reducing ArtAnon, Mentor, theme, button, card, or tests. Record the shortcut; do not ship only one CodeCraft mode.

## Plan

1. Inspect versions/scaffold and propose exact files and commands for Moderator approval.
2. Implement token/theme/font foundations with tests.
3. Implement button/card semantics with tests and exports.
4. Build the lazy gallery, computed swatches, switcher, and forced specimens.
5. Run gates and report evidence for every check.
6. Stop for Tech Lead review, then the mandatory Moderator study break.

## Change notes

| Date | Change | Reason |
| --- | --- | --- |
| 2026-10-18 | Initial Step authored | Approved Architecture Definition |

---

MOD-W v5.0.1
