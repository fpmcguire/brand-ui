# STEP-07 — Gallery Card structure view

**Status:** Accepted 2026-10-29. Implemented at HEAD `8397fe8` (`feat(gallery): add card structure view`) under the exact Revision 5 plan in `mod-w/step-07-plan.md`, including AC-20 Option A, the caption-visibility rule, the token-derived responsive track rule, the static-check policy with its two-phase PowerShell execution plan, and the DS-035 no-heading correction. Fresh QA and the Product Owner review passed; the Moderator accepted STEP-07 and determined it complete. STEP-08 is not activated and must be activated and separately planned before it begins. **Estimate:** 5 hours.

Product Owner review, 2026-10-29: verdict CHANGES REQUESTED for one bounded Tag fix, with the skeleton-contrast decision and the Could-fix-later items accepted or deferred as recorded in `mod-w/po-signoff-step-07.md`. The Moderator then directed the Tag fix: one declaration, `align-self: flex-start` on `.specimen bui-tag` in `projects/gallery/src/app/gallery/structure/card-structure.component.scss`, applied in the working tree on 2026-10-29 (uncommitted) and verified as recorded in the sign-off file.

The exact gate sequence, scripts, and file bodies are in `mod-w/step-07-plan.md`. Where the command list below differs, that plan controls.

## Goal

Add the gallery-owned structure section in all four scopes using installed package exports and the approved design rows.

## Authority and traceability

- Product: S-17; AC-20, AC-23 to AC-25.
- Design: DS-061 to DS-066; reused DS-030, DS-031, DS-035.
- Architecture: D-05, D-12. No Reference Implementation exists; AC-20 controls Card behavior.

## Scope and expected files

- Gallery specimen data/templates/styles and focused unit tests; additions inside the existing Playwright specs only; package/install files only if archive refresh is mechanically required.

## Out of scope

New/changed Design IDs, tokens, brands/scopes, package boundaries, Card API/behavior, fourth Playwright spec, Button/TextInput/Navigation specimens, S-10/S-12/S-19, imagery, and `mod-w/design/**`.

## Requirements

1. Place the structure section last in every scope panel. Preserve identical slot/order/test-ID structure; sample data alone controls Code well content versus `Not used in this scope`.
2. Show DS-062 Tag, DS-063 Skeleton block, DS-064 Code well, DS-065 Media area, DS-066 Loading skeleton; show Card specimens carrying DS-030, DS-031, DS-035 and required captions.
3. Only DS-031 adds one native title link/tab stop per scope. Isolated skeleton specimens are absent from the accessibility tree. Only DS-035 Card exposes busy/Loading.
4. Group labels are accessible names, not headings. Card titles remain h3. Explicitly test rendered heading order in all four scopes.
5. Use installed atomic entry points; the section shell remains gallery-owned and absent from both library exports.

## Verification commands and mapping

```text
npm ci                                              # AC-23
npm run verify:atomic-archive                       # AC-22, AC-23
npm run format:check                                # AC-24
npm run lint:tokens                                 # AC-24
npm run check:assets                                # AC-24
npm run typecheck:e2e                               # AC-24
npm test                                            # AC-20, AC-24, AC-25
npx playwright test e2e/brand-and-contrast.spec.ts  # AC-25 four scopes/IDs/tokens
npx playwright test e2e/keyboard-and-accessibility.spec.ts # AC-24/25 focus, hidden skeletons, heading order, axe
npx playwright test e2e/long-label-and-bevel.spec.ts # AC-20/24 unchanged third spec
npm run test:e2e                                    # AC-20, AC-24, AC-25; exactly three specs
npm run build                                       # AC-23, AC-25
npm run build:subfolder                             # AC-19, AC-23
git diff --check
git diff -- projects/ui/src/lib/card/card.spec.ts    # AC-20: empty
git status --short
```

## Acceptance checks

- [x] AC-25 all approved specimens/IDs/captions render in all four scopes from installed parts using tokens only. Accepted 2026-10-29.
- [x] AC-20 existing unit and Playwright assertions are unchanged and pass. Accepted 2026-10-29.
- [x] AC-23 no source alias/import enters gallery or `ui`. Accepted 2026-10-29.
- [x] AC-24 axe, explicit four-scope heading-order QA, hidden isolated skeletons, exactly three specs, and all gates pass. Accepted 2026-10-29.
- [x] Structure surface remains gallery-owned and no fourth specification exists. Accepted 2026-10-29.

## Stop conditions and sequence

Stop if an approved design row must change, a new ID/token/API/state/visual is needed, existing assertion needs editing, an extra status/link appears, or a gate fails. Exact Team plan → Moderator approval → implementation → Tech Lead review → fresh QA including visual/keyboard checks → Product Owner sign-off → Moderator acceptance. Do not begin STEP-08.

