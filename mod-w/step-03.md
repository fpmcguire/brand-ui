# STEP-03 — Gallery About panel

**Status:** Approved by the Moderator, 2026-10-19; Development Team implementation awaits separate plan approval

**Date:** 2026-10-19

**Assigned Development Team:** Claude Code, only after the Moderator approves this Step and separately approves the Team's exact file/command plan

---

## Goal

Implement the promoted S-11 About panel as a small, gallery-owned, accessible modal that explains the project, brands, `ui` library, gallery/library boundary, and gallery use. Preserve the accepted library public API, token system, three-brand/four-scope model, full-gallery accessibility evidence, and exactly three Playwright specifications.

This Step does not deploy the gallery. Acceptance hands the completed gallery to the separate required S-13/AC-19 static-deployment gate.

## Authority and traceability

- Product: S-11 and AC-17; recheck AC-4 public-entry-point consumption, AC-8 complete-gallery axe coverage, AC-9 unit/browser evidence, and AC-12 truthful documentation. Product section 5.2 controls the five content points, behavior, prohibited content, top-bar trigger, and first-visit test constraint.
- Architecture: D-01 token authority, D-02 theme attachment, D-04 narrow library APIs/native semantics, D-05 theme-independent structure, D-07 accessibility/contrast, D-08 layered verification with exactly three Playwright specifications, D-09 documentation/asset controls, and D-11 native About-dialog lifecycle.
- Domain language: About panel, About trigger, first visit, reference spike, three brands across four gallery scopes, and styling mode.
- Sequence: STEP-01 and STEP-02 are accepted. S-10 and S-12 remain excluded. S-13 deployment and the later study review remain pending and out of scope.

## Design traceability and bounded authority

`design-spec.md` records S-11 as “Not designed” and defines no Design ID for it. The Moderator's approval of this Step grants only this bounded design authority:

- The Development Team may decide the dialog's layout, spacing, heading structure, backdrop treatment, and content presentation using only existing semantic tokens, existing library components, and established gallery patterns.
- It may not add or change tokens or token names; library components; `Navigation` or any other public API; existing Design IDs; or any file under `mod-w/design/`.
- It may not add brand-specific code or structure. The panel must work in all four scopes through tokens alone and follow the active theme selection, including the retained active selection while All brands is displayed.
- It may not add animation libraries, icons, imagery, remote assets, or inline base64 assets.
- Every token pair the panel paints must meet AC-7 in all four scopes. The panel must pass the accessibility, focus, keyboard, and axe checks below.
- S-11 is traced by the AC-17 sub-checks in this Step. The panel carries no Design ID. Do not invent one and do not display either a badge or “no Design ID” placeholder for it.

Any need to exceed these bounds is a stop condition requiring a Moderator decision and, where Product acceptance intent changes, Product Owner action.

## Required behavior

1. Add an `About` item to the gallery top bar using the library `Button`, styled by gallery CSS as a bar item. Its accessible name remains `About`. Do not use or change `Navigation` for this command.
2. Implement a gallery-owned `AboutPanel` using native `<dialog>` and `showModal()`. It is not exported from `ui`; it imports any library control or theme directive only from the `ui` public entry point.
3. Give the dialog an accessible name from its visible heading. On open, focus its close button. Native modal behavior provides the focus boundary; tests must prove Tab and Shift+Tab do not escape while it is open.
4. Route close-button, Esc/native `cancel`, and backdrop dismissal through one close operation. Backdrop dismissal occurs only for a pointer interaction outside the dialog rectangle, not for a click on dialog content or padding. Restore focus to the top-bar About trigger on every close path, including the automatic first-visit opening.
5. Automatically open once when the versioned gallery-owned seen key is absent and record the seen value when that automatic opening is initiated, not when the user closes it. Guard every `localStorage` read/write with `try/catch`. When storage is unavailable, use an in-memory flag so automatic opening occurs once per page load; manual reopen/close continues to work. A later page load may auto-open again in that fallback case.
6. Present five short, plain-language sections matching Product section 5.2 and README wording:
   - this is a reference spike, not production, with the two learning/evidence purposes and no delivery, rollout, production, or official-rebrand claim;
   - exact status of ArtAnon Shop, IT English Mentor, and CodeCraft Academy, including three brands across four scopes and Light/Dark as CodeCraft modes;
   - the four-component `ui` library plus `ThemeService` and `ThemeScopeDirective`, one semantic token-name contract, no component brand values, and token-only switching;
   - the gallery as a separate public-entry-point consumer, with the switcher, forced-state specimens, token read-outs, contrast evidence, and Design IDs gallery-owned and no library dependency on the gallery;
   - how to use the scope switcher/All brands, Design IDs checkbox, panel sections, and About trigger.
7. Exclude tutorials, installation steps, marketing claims, ArtAnon or other third-party assets, and any statement that this project validates MW-OBS-022 or MW-OBS-023.
8. Add a concise README paragraph explaining the gallery/library relationship and identifying its review-only features as gallery-owned, plus one sentence explaining automatic first-visit opening and top-bar reopening. Keep the panel and README aligned by explicit AC-17 review mapping and focused assertions for stable headings/key statements; do not create a second TypeScript source of prose.
9. Update the gallery header kicker/status only as needed to remove stale `STEP-02` wording and remain consistent with the README/About panel. Do not turn the status line into a second full About panel.

## Exactly three Chromium Playwright specifications

Do not add, rename, merge, or remove a Playwright specification. Extend the accepted three files:

1. `e2e/brand-and-contrast.spec.ts`: seed the versioned seen key before navigation so the modal cannot obstruct existing full-gallery brand/scope/contrast coverage. Recheck every new token usage pair in all four scopes.
2. `e2e/keyboard-and-accessibility.spec.ts`: cover first-visit auto-open with a clean storage context; accessible dialog name; initial focus; Tab/Shift+Tab containment; close button, Esc, and outside-rectangle backdrop close; focus return to About; manual reopen; and persistence after reload. Use a pre-navigation script that makes the relevant `Storage` reads/writes throw to prove the fallback opens once during that page load, remains manually operable, and auto-opens again only after a reload. Dismiss or seed the panel before running the existing axe scan against the complete gallery; the scan must still report no serious or critical violations. Also run a focused axe scan while the dialog is open.
3. `e2e/long-label-and-bevel.spec.ts`: seed the seen key before navigation so all accepted width, overflow, accessible-name, and bevel checks continue unobstructed.

Existing helpers may gain a typed helper for seeding the versioned key. Tests assert user-visible/native behavior, not Angular internals. AC-17 joins these existing specifications; no fourth specification is allowed.

## Vitest coverage

- First-visit decision when the key is absent/present.
- Successful seen-key write and guarded read/write failure behavior.
- Once-per-page-load fallback after storage failure and continued manual reopen.
- Native dialog open/close coordination, accessible-name wiring, close-button behavior, `cancel` handling, outside-rectangle backdrop discrimination, and focus restoration.
- Five content headings/key statements and absence of a Design-ID badge/placeholder.
- Existing GalleryState, header, component, and library tests remain passing. Do not replace browser-only focus-containment evidence with DOM-emulator assertions.

## Allowed files

The Development Team plan may name only these implementation surfaces unless it stops for a Moderator-approved Step amendment:

- `projects/gallery/src/app/gallery/about-panel/**` (new component, state/storage helper, styles, and focused tests)
- `projects/gallery/src/app/gallery/gallery-page.component.ts`
- `projects/gallery/src/app/gallery/gallery-page.component.html`
- `projects/gallery/src/app/gallery/gallery-page.component.scss`
- `projects/gallery/src/app/gallery/gallery-page.component.spec.ts`
- `projects/gallery/src/app/gallery/gallery-state.ts` and its existing test only if needed to expose the active `ThemeSelection` without duplicating theme state
- `e2e/brand-and-contrast.spec.ts`
- `e2e/keyboard-and-accessibility.spec.ts`
- `e2e/long-label-and-bevel.spec.ts`
- `e2e/helpers/gallery.ts`
- `README.md`

No dependency, `package.json`, lockfile, workspace, route, token, library, or public-API change is planned. If one becomes necessary, stop.

## Prohibited scope

- Editing `mod-w/product.md`, `mod-w/design/**`, QA artifacts, prototype files, or `mod-w/review.md`.
- Editing `projects/ui/**`, token values/names, the 51-name contract, any library component/API, `Navigation`, existing Design IDs, or component structure by brand.
- S-10, S-12, S-13/deployment, hosting configuration, indexing changes, or the later study review.
- New routes, pages, tutorials, install instructions, marketing content, backend/API, SSR, Storybook, general dark mode, internationalization, animation/icon libraries, images, visual-regression infrastructure, or unrelated refactoring.
- ArtAnon logos, artwork, photography, other third-party brand assets, remote fonts/assets, and inline base64.
- Reducing or bypassing full-gallery axe coverage, contrast assertions, existing Playwright behavior, or the exactly-three-specification constraint.

## Reference Implementation

**Location:** `mod-w/design/project/Main.dc.html`

**Disposition:** Reject as a Reference Implementation. The prototype remains visual evidence only and does not contain an approved S-11 design. Implement from Product section 5.2, D-11, and this Step without importing, copying, executing, or deriving architecture from prototype code.

## Ordered Development Team procedure

1. Stop before edits and submit an exact file/command plan to the Moderator. It must identify the storage key, component/helper boundaries, native-dialog event/focus flow, README/header copy changes, allocation of AC-17 across the existing three browser specs, unit tests, and every final gate. Wait for explicit approval.
2. Record `node --version`, `npm --version`, `npx ng version`, and `npx tsc --version`. Stop on mismatch with Node 26, Angular 22.2, or TypeScript 6.
3. Implement the narrow storage/state helper and focused Vitest coverage, then the gallery-owned dialog and top-bar library-button trigger.
4. Add the five bounded content sections, theme attachment, token-only styles, accessible name, native modal focus behavior, close paths, and deterministic focus restoration.
5. Reconcile README and gallery header wording without changing Product meaning or adding prohibited claims.
6. Extend only the existing unit tests and three Playwright specifications as allocated above. Preserve all accepted coverage.
7. Run every final verification command and inspect scope, public imports, tokens, assets, design directory, spec count, and documentation/content parity.
8. Return command output plus an S-11/AC-17 sub-check evidence matrix. Stop for independent Tech Lead review and Moderator acceptance. Do not deploy.

## Verification commands

Final evidence must include these exact repository gates under Node 26:

```text
node --version
npm --version
npx ng version
npx tsc --version
npm run format:check
npm run lint:tokens
npm run check:assets
npm run typecheck:e2e
npm test
npm run test:e2e
npm run build
git diff --check
git status --short
git status --short -- mod-w/design
```

The final report must also show read-only evidence that:

- `e2e/` still contains exactly three `*.spec.ts` files and Playwright still declares Chromium only;
- the About panel and gallery import `Button`, `ThemeScopeDirective`, and any other library symbol only from `ui`; `projects/ui/src/public-api.ts` is unchanged and no About symbol is exported;
- token files, token names/values, existing Design IDs, library source, dependencies, routes, `mod-w/product.md`, and `mod-w/design/` are unchanged;
- the panel contains no Design-ID badge/placeholder and no brand-specific conditional structure;
- every new semantic token usage pair passes AC-7 in all four scopes;
- README, gallery header, and the five panel content sections contain consistent reference-spike, brand-status, library-boundary, and gallery-use claims;
- full-gallery and open-dialog axe scans report no serious or critical violations;
- no restricted asset or prohibited claim entered the repository.

## Acceptance checks

- [ ] **AC-17.1 Project:** The panel truthfully states reference-spike status, both purposes, and all prohibited production/delivery/rollout/official-rebrand claims; wording matches README.
- [ ] **AC-17.2 Brands:** It gives the three statuses from Product section 1.1 and says three brands across four scopes with CodeCraft Light/Dark as modes of one brand.
- [ ] **AC-17.3 Library:** It names the four components, `ThemeService`, `ThemeScopeDirective`, common semantic token names, absent component brand values, and token-only switching.
- [ ] **AC-17.4 Boundary:** It says the gallery is separate, imports through `ui`'s public entry point, owns the switcher/forced states/token read-outs/contrast/Design IDs, and is not a library dependency (AC-4).
- [ ] **AC-17.5 Use:** It explains the switcher and All brands, Design IDs checkbox, panel sections, and top-bar About reopening.
- [ ] The panel is gallery-owned, absent from `ui` exports, consumes library symbols only through `ui`, and changes no library API or `Navigation`.
- [ ] The library `Button` top-bar trigger is named `About`; native `<dialog>` has a visible accessible name, opens modally, initially focuses Close, contains keyboard focus, and restores focus to About after every close path.
- [ ] Close button, Esc/native `cancel`, and outside-rectangle backdrop dismissal work; interaction inside the dialog does not backdrop-close it.
- [ ] Automatic opening occurs only when the versioned seen key is absent; storage reads/writes are guarded; unavailable storage opens at most once per page load and does not break manual use.
- [ ] The panel follows all four scope selections through existing tokens only, has no brand-specific structure, and every painted token pair passes AC-7.
- [ ] No Design ID is invented or displayed for S-11; review evidence maps the AC-17 sub-checks instead.
- [ ] README and header are consistent with the panel and Product; prohibited panel content and claims are absent (AC-12).
- [ ] Exactly three Chromium Playwright specifications remain. First-visit setup does not obstruct existing brand, contrast, keyboard, long-label, bevel, or full-gallery axe coverage (AC-8/AC-9).
- [ ] Focused Vitest and Chromium checks cover the required state, storage, dialog, content, keyboard, persistence, and focus-restoration behavior; all existing tests remain passing.
- [ ] Formatting, token, asset, E2E typecheck, unit, browser, accessibility, build, diff, and scope gates all pass under the approved toolchain.
- [ ] Final diff stays inside the allowed implementation list and contains no S-10, S-12, deployment, design-artifact, Product, QA, library, dependency, route, token, asset, or unrelated change.

Every checkbox remains unmet until the Development Team supplies diff, command, test, or browser evidence and independent review accepts it.

## Stop conditions

Stop and report to the Moderator if:

- this Step or the Development Team's exact plan lacks explicit Moderator approval;
- the bounded design authority is insufficient, a Design ID seems necessary, Product/README meaning conflicts, or any acceptance wording would need amendment;
- implementation requires a file outside the allowed list, a new dependency, a route/workspace/public-API/library/token/Design-ID change, or any edit under `mod-w/design/`;
- native `<dialog>` cannot meet the required focus, Esc, backdrop, accessible-name, or focus-restoration behavior in pinned Chromium;
- first-visit behavior cannot be tested without weakening complete-gallery coverage or adding a fourth Playwright specification;
- storage failure breaks manual operation or causes more than one automatic open per page load;
- any new token pair fails AC-7, axe reports a serious/critical violation, a prohibited asset/claim appears, or any accepted STEP-01/STEP-02 behavior regresses;
- any final gate fails or evidence is incomplete. Do not weaken assertions, exclude surfaces, broaden allowlists, or add snapshots merely to obtain green output;
- deployment, S-10, S-12, QA editing, or the later study review would begin.

## Approval record

- **Moderator decision:** Approved on 2026-10-19.
- **Approved authority:** STEP-03 and its bounded design authority as written, including D-11.
- **Approved sequence:** S-11 completes before the required S-13 deployment gate.
- **Effect:** The Development Team may inspect the accepted baseline and submit the exact implementation plan required by procedure item 1.
- **Implementation gate:** No source or test implementation begins until the Moderator separately approves that Team plan.

---

MOD-W v5.0.1
