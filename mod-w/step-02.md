# STEP-02 — Input, navigation, long labels, and final verification

**Status:** Approved by the Moderator, 2026-10-19; Development Team implementation awaits separate plan approval

**Date:** 2026-10-19

**Assigned Development Team:** Claude Code, after Moderator approval of this Step and of the Team's exact file/command plan

---

## Goal

Complete the bounded implementation spike by adding the text input and navigation components, completing the gallery's approved states and long-label evidence, and proving the full four-component system through static, unit, Chromium browser, accessibility, asset, format, token, and build gates.

This Step does not deploy the gallery. Acceptance hands the accepted application to the separate required S-13/AC-19 static-deployment gate.

## Authority and traceability

This Step implements the remaining roadmap scope under the following approved authority:

- Product: remaining S-3 and S-4; S-5 to S-7; remaining S-9; AC-4 to AC-15 as applicable. AC-16 already passed human review and must be preserved. S-10 to S-12 remain excluded. S-13/AC-19 is a separate required post-STEP-02 gate.
- Architecture: D-01 CSS token authority; D-02 host attachment; D-03 gallery-owned forced states; D-04 narrow signal APIs and native semantics; D-05 theme-independent structure; D-06 Chromium long-label assertions; D-07 accessibility and computed-token contrast; D-08 layered verification with exactly three Playwright specifications; D-09 documentation/asset controls; D-10 progressive bevel.
- Domain language: three brands across four gallery scopes; CodeCraft Light/Dark are styling modes of one brand; loading and disabled remain distinct; full DOM text supplies the accessible name; the prototype is visual evidence, not a Reference Implementation.
- Sequence: STEP-01 is accepted. The Moderator authorized STEP-02 on 2026-10-19 and moved the fuller project/UI-library study review until after STEP-02 acceptance and static deployment.

## Design IDs

| Design IDs | Required STEP-02 evidence |
| --- | --- |
| DS-020 to DS-025 | Text input default/empty, hover, genuine focus, filled, error, and disabled states |
| DS-040 to DS-045 | Navigation default/working sample, hover, current, genuine focus, disabled, and narrow-width wrapping |
| DS-050 | Button long label wraps and grows without truncation or container overflow |
| DS-051 | Navigation long label clamps visually to two lines at no more than `16rem`, while retaining the full accessible name and supplemental tooltip |
| DS-060 | Explicit component usage-pair evidence and automated contrast results read from computed CSS values in all four scopes |
| DS-001 to DS-015 and DS-030 to DS-035 | Preserve accepted STEP-01 behavior; complete genuine-browser focus, loading-suppression, native-semantics, contrast, and progressive-bevel evidence where required |

## Required invariants

- Angular 22.2, Node 26, TypeScript 6, strict type checking, standalone components, zoneless change detection, signals-based APIs, and native Angular control flow remain in force.
- Use `input()`, `output()`, and `model()` as appropriate; use `computed()` or `linkedSignal()` only for genuine derived/synchronized state. Do not use decorators, `mutate`, `ngClass`, `ngStyle`, blanket `CommonModule`, explicit `standalone: true`, or explicit OnPush.
- Use `inject()` rather than constructor injection and host metadata rather than `@HostBinding`/`@HostListener` if either is needed.
- CSS custom properties remain the only token-value source. Gallery and browser tests must read computed values; no TypeScript, specimen, or test object may duplicate brand token values.
- Brand switching changes tokens, not component structure. Theme attachment must continue to work on the application root and arbitrary hosts.
- Components expose no gallery preview API, gallery selector, or `.is-*` forced-state class. Forced specimens remain gallery-owned inherited-variable overrides.
- Component styling contains no hard-coded brand colors, font families, spacing, radius, or elevation values outside the accepted narrow static-check allowlist.
- Components use native semantics and meet WCAG 2.2 AA, including visible focus, correct names/descriptions/ARIA, at least 44px control height, and reduced-motion handling.
- ArtAnon logo, artwork, photography, and all other third-party brand assets remain prohibited. Fonts remain self-hosted with matching OFL and provenance evidence.
- CodeCraft's bevel remains progressive enhancement: rounded top-right fallback is declared before `corner-top-right-shape`; lack of bevel support cannot fail a Must requirement when the fallback works.
- The gallery consumes library components only through `ui`'s public entry point. The library must not depend on Angular Router.

## Scope

1. Implement and publicly export the D-04 text input API: required stable `id` and `label`, `model()` value, placeholder, helper text, error text, disabled, and name. The component owns label/description IDs; error presentation replaces helper presentation, supplies icon plus text, and drives `aria-invalid`.
2. Implement and publicly export the D-04 navigation API: accessible label, wordmark, and readonly items with stable ID, label, URL, optional current, disabled, and supplemental title. Enabled/current items are native anchors, current uses `aria-current="page"`, and disabled items are non-focusable text rather than fake links.
3. Add focused unit coverage for input and navigation behavior and preserve focused tests for theme, button, card, and gallery behavior.
4. Complete gallery specimens and metadata for DS-020 to DS-025 and DS-040 to DS-051 in every rendered scope. A reviewer can see all approved states without editing code. Design-ID visibility continues to be gallery-owned.
5. Implement the approved long-label behavior exactly: button wraps, balances progressively, hyphenates where supported for English, breaks only when needed, grows, and never truncates; navigation preserves full DOM text, clamps visually to two lines with ellipsis, has a maximum width of `16rem`, and exposes the full text as accessible name plus tooltip. Exercise 180px, 280px, 360px, and full-width containers in all four scopes.
6. Complete DS-060 with a documented explicit semantic usage-pair list for combinations the components actually use. Automated ratios must be calculated from computed rendered values in each of the four scopes, including protection of the approved Mentor 4.62:1 boundary. Apply 4.5:1 for normal text, 3:1 for large text, and 3:1 for non-text UI/focus contrast; disabled text is exempt.
7. Replace the root Angular CLI boilerplate README with the meaningful AC-12 project README: describe the reference spike; state each brand's status from Product section 1.1, including that ArtAnon is an unofficial concept; state three brands/four scopes; document setup, gallery use, commands, long-label rule, and non-production/non-publishing status; link the Product shortcuts list; make no production, client-delivery, official-rebrand, or rollout claim.
8. Remove or replace `projects/ui/README.md` npm-publishing boilerplate with a short non-publishing note or root-README pointer. It must not instruct readers to publish the package.
9. Correct the TypeScript 6 TS5011 editor diagnostic by adding exactly `"rootDir": "./src"` under `compilerOptions` in both `projects/ui/tsconfig.lib.json` and `projects/ui/tsconfig.spec.json`. Build and unit-test evidence must prove the correction did not break either compilation surface.
10. Replace the generated Playwright example with exactly three local-gallery Playwright specification files matching D-08. Configure Playwright for Chromium only and configure its local gallery web server. No Firefox, WebKit, branded-browser, mobile-device matrix, or external-site test remains.
11. Add automated axe coverage to the keyboard/accessibility specification. One scan of the representative complete gallery surface must report no serious or critical violations. Axe is test-only and must not enter runtime or public library code.
12. Run the complete final gates and return evidence mapped to every acceptance check and Design ID in this Step.

## Exactly three Chromium Playwright specifications

The `e2e/` directory must contain exactly these three `*.spec.ts` files (minor helper modules may be proposed, but may not be additional specifications):

1. `e2e/brand-and-contrast.spec.ts`: brand switching without reload; computed restyling; three brands across four simultaneous scopes; explicit computed-value text, non-text, and focus usage-pair contrast assertions.
2. `e2e/keyboard-and-accessibility.spec.ts`: keyboard order and activation; genuine `:focus-visible` evidence for button, input, card, and navigation; input labeling/error semantics; card and navigation native semantics; disabled behavior; loading button focus retention plus pointer/keyboard/form-submission suppression; and the axe serious/critical scan.
3. `e2e/long-label-and-bevel.spec.ts`: DS-050/DS-051 at 180px, 280px, 360px, and full width in all four scopes; no unintended horizontal overflow or clipping; required growth/clamp behavior; full accessible names/tooltips; CSS bevel capability and computed bevel in pinned Chromium, while preserving static evidence of the rounded fallback.

Assertions must test user-visible/native behavior and computed presentation, not private Angular implementation details. Forced gallery specimens do not substitute for genuine focus or keyboard evidence.

## Allowed files

The Development Team's proposed plan may name only the following implementation surfaces unless it stops and obtains a Step amendment from the Moderator:

- `projects/ui/src/lib/text-input/**` (new)
- `projects/ui/src/lib/navigation/**` (new)
- `projects/ui/src/public-api.ts`
- `projects/ui/tsconfig.lib.json`
- `projects/ui/tsconfig.spec.json`
- `projects/ui/README.md`
- `projects/gallery/src/app/gallery/gallery-page.component.ts`
- `projects/gallery/src/app/gallery/gallery-page.component.html`
- `projects/gallery/src/app/gallery/gallery-page.component.scss`
- `projects/gallery/src/app/gallery/gallery-page.component.spec.ts`
- `projects/gallery/src/app/gallery/gallery-state.ts`
- `projects/gallery/src/app/gallery/specimens/**`
- `projects/gallery/src/app/gallery/token-inspector.ts` only if required to expose computed usage-pair evidence without duplicating values
- `projects/gallery/src/styles.scss` only for gallery-owned layout/forced-state presentation required by approved Design IDs
- `e2e/**`, limited to the three specification files above and narrowly scoped non-spec helper modules/fixtures
- `playwright.config.ts`
- `package.json` and `package-lock.json`, limited to axe test integration and scripts/configuration required by this Step
- `README.md`

Existing button, card, theme/token, font, app bootstrap, routing, Angular workspace, and static-script files are verification inputs, not edit targets. If a failing acceptance check proves one of those files must change, stop and request a Moderator-approved amendment before editing it.

## Prohibited scope

- Any edit under `mod-w/design/`, Product Owner artifacts, QA artifacts, or prototype files.
- Any implementation or configuration of S-13/AC-19 deployment; hosting-provider files, deployment workflows, base-href changes, and no-index delivery belong to the next gate.
- S-10 alert/teaser/hero, S-11 About panel, and S-12 CMS page.
- Changes to approved token values, brand identity, component structure by brand, or the three-brand/four-scope model.
- New public preview/testing APIs, `.is-*` component state classes, copied token-value maps, imports from library internals, or imports from `mod-w/design`.
- Publishing, npm publication instructions, versioning, changelog, SSR, backend/API, Storybook, Nx, routing expansion, internationalization, general dark mode, visual-regression infrastructure, cross-browser/device matrices, animation libraries, icon libraries, or unrelated refactoring.
- Remote fonts, inline base64 assets, unauthorized images, or third-party brand material.
- Editing `mod-w/review.md`; the Tech Lead owns the later review.

## Reference Implementation and prototype divergences

**Prototype location:** `mod-w/design/project/Main.dc.html`

**Disposition:** Rejected as a Reference Implementation; retained only as visual evidence. No production or test source may import, copy, execute, or derive architecture from it.

Required divergences remain those approved in architecture:

- Fresh Angular 22.2 standalone, zoneless, signals-based, strictly typed implementation instead of the canvas runtime/scripts.
- One `codecraft` brand with Light/Dark styling modes rather than two brands; shared non-color structure rather than duplicated token objects.
- Computed CSS values rather than token values copied into script data.
- Gallery-owned inherited forced-state variables rather than `.is-*` component classes or public preview inputs.
- Native input/anchor/text semantics; disabled navigation is non-link text; `:focus-within` is used for interactive card focus.
- Self-hosted licensed fonts rather than Google Fonts requests.
- Generic component APIs and theme-invariant structure rather than brand-inferred markup.
- Progressive CodeCraft bevel with rounded fallback rather than assuming universal `corner-shape` support.

## Ordered Development Team procedure

1. **Stop for plan approval.** Before changing any file, inspect the accepted baseline and send the Moderator an exact proposed file list, dependency change, three-spec test outline, commands, and any intended deviation/shortcut. Wait for explicit Moderator approval. Authorization of this Step is not approval of that implementation plan.
2. Record `node --version`, `npm --version`, `npx ng version`, the installed TypeScript version, and relevant dependency versions. Stop on mismatch with Node 26, Angular 22.2, or TypeScript 6 rather than silently upgrading/downgrading.
3. Add `rootDir` to both UI tsconfigs and establish green UI build/test evidence before or with component work.
4. Implement text input and navigation with narrow signal APIs, native semantics, token-only styles, public exports, and focused unit tests.
5. Complete gallery states, Design-ID metadata, computed usage-pair evidence, and long-label specimens without adding library preview APIs or changing structure by theme.
6. Replace both README boilerplates with the bounded AC-12 documentation.
7. Remove the generated external Playwright example; configure Chromium/local web server; add exactly the three specified browser files and axe test-only integration.
8. Run focused unit/browser checks while developing, then run every final verification command below under Node 26.
9. Inspect the final diff and status for scope, restricted assets, prototype/design changes, dependency placement, public API, strict typing, and exactly three specifications. Return a requirement/Design-ID evidence matrix plus command outputs.
10. Stop for independent Tech Lead review and Moderator acceptance. Do not start deployment, QA artifact edits, the fuller study review, or any further implementation.

## Verification commands

The Development Team must propose the exact invocation details in its pre-implementation plan. At minimum, final evidence must include these repository gates under Node 26:

```text
node --version
npm --version
npx ng version
npx tsc --version
npm run format:check
npm run lint:tokens
npm run check:assets
npm test
npm run test:e2e
npm run build
git diff --check
git status --short
git status --short -- mod-w/design
```

The final report must also show read-only evidence that:

- `e2e/` contains exactly three `*.spec.ts` files and Playwright declares only Chromium.
- the root README contains the required AC-12 status/shortcut/non-production wording and neither README contains npm-publishing instructions or claims of official delivery/rollout;
- both UI tsconfigs contain `"rootDir": "./src"`;
- input/navigation are exported from `projects/ui/src/public-api.ts` and gallery imports them from `ui`;
- no prohibited ArtAnon or third-party brand asset exists, and `mod-w/design/` is unchanged;
- component sources remain free of brand selectors/names, gallery selectors, `.is-*` forced states, and literal governed token values;
- axe reports no serious or critical violations and all computed usage-pair ratios meet their applicable thresholds.

If a command needs a narrow script adjustment outside the allowed files, stop and request an amendment; do not weaken, skip, or silently replace a gate.

## Acceptance checks

- [ ] Text input and navigation are standalone, strictly typed, signal-based components with the exact D-04 public behavior; they are exported from `ui` and consumed through that entry point (S-3; AC-4; DS-020 to DS-025; DS-040 to DS-045).
- [ ] Input label, helper/error replacement, `aria-invalid`, model updates, and disabled behavior are covered by unit and Chromium evidence; error uses icon plus text (AC-5/AC-6; DS-020 to DS-025).
- [ ] Navigation has a named native `nav`, enabled/current anchors, `aria-current="page"`, non-link/non-focusable disabled items, full accessible names, and narrow wrapping without a collapsed menu (AC-5/AC-6; DS-040 to DS-045).
- [ ] Gallery presents every approved component, state, scope, and remaining Design ID without source edits; existing accepted states remain intact (S-4/S-9; AC-5/AC-15).
- [ ] Button and navigation long-label cases satisfy their documented rules in every scope at all required widths, with no unintended overflow/clipping and with full accessible names (S-5; AC-10; DS-050/DS-051).
- [ ] Explicit usage-pair contrast tests read computed values in all four scopes and pass 4.5:1 normal text, 3:1 large text, and 3:1 non-text/focus thresholds; the Mentor 4.62:1 boundary remains passing (S-6; AC-7; DS-013/DS-022/DS-033/DS-043/DS-060).
- [ ] Keyboard-only operation, genuine visible focus, correct tab order/activation, button loading suppression, input semantics, single-link card behavior, and navigation semantics pass in Chromium (AC-6/AC-9).
- [ ] Automated axe coverage runs against the representative gallery and reports no serious or critical violations (AC-8).
- [ ] Exactly three local Chromium Playwright specification files cover the three D-08 groups; no other browser/device project or external-site scaffold remains (S-7; AC-9).
- [ ] Vitest covers the theme service/directive and all four components; all unit tests pass (AC-9).
- [ ] Root README fully replaces CLI boilerplate and satisfies AC-12; the UI README contains no publishing instructions.
- [ ] `rootDir` is exactly `./src` in both required UI tsconfigs, and UI tests plus both library/gallery builds pass without the TS5011 correction causing regressions (AC-11).
- [ ] Token/static checks prove CSS-only value authority, identical resolved contract, theme-only switching, no component brand values/names, and no public forced-state mechanism (AC-1 to AC-3, AC-13/AC-14; D-01/D-03/D-05).
- [ ] Asset checks prove matching font OFL/provenance and absence of ArtAnon logo/artwork/photography or other unauthorized third-party assets (AC-12; D-09).
- [ ] CodeCraft remains one brand/two modes across four scopes, and Chromium plus static evidence proves progressive bevel with rounded fallback (AC-13; D-10).
- [ ] Formatting, token, asset, unit, browser, accessibility, build, and diff gates all pass under the required toolchain (AC-11).
- [ ] AC-16's accepted thumbnail distinction is preserved; no new human-brand-direction claim is made.
- [ ] Final diff is confined to the approved file list; S-10 to S-12 and deployment are absent.

Every checkbox remains unmet until the Development Team supplies diff, command, test, or browser/QA evidence and independent review accepts it.

## Stop conditions

Stop without implementing further and report to the Moderator if any of the following occurs:

- the exact Development Team file/command plan has not been explicitly approved;
- authority documents conflict, an allowed-file boundary must expand, token/design values must change, or implementation would require editing Product, Designer, prototype, QA, or accepted STEP-01 surfaces;
- Node/Angular/TypeScript versions do not match the approved stack, or dependency resolution requires an unapproved upgrade;
- native semantics, strict typing, CSS-only token authority, accessibility thresholds, exactly-three-spec limit, or Chromium-only configuration cannot be met within scope;
- a prohibited asset, licensing/provenance gap, serious/critical axe violation, contrast failure, TS5011/build/test failure, or unexplained baseline regression is found;
- Must completion would require cutting scope. CodeCraft remains the first approved coherent cut only if the Moderator explicitly invokes the Product shortcut; never drop one CodeCraft mode alone;
- any final gate fails or evidence is incomplete. Do not weaken an assertion, exclude a surface, update a snapshot, or broaden an allowlist merely to obtain green output;
- deployment work would begin. STEP-02 must instead hand off to the separate S-13/AC-19 gate after Tech Lead review and Moderator acceptance.

## Handoff after acceptance

The only next implementation activity after STEP-02 acceptance is the separately planned and approved S-13/AC-19 static-deployment gate: static hosting, indexing disabled, and no third-party brand asset. STEP-02 provides a green production build and verification evidence but adds no deployment files or provider configuration. After deployment passes, the Moderator conducts the fuller project and UI-library study review required by the 2026-10-19 sequencing decision.

## Approval record

- **Moderator decision:** STEP-02 proposal approved on 2026-10-19.
- **Effect:** The Development Team may inspect the accepted baseline and submit the exact file/command plan required by ordered procedure item 1.
- **Implementation gate:** No implementation begins until the Moderator separately approves that Development Team plan.

---

MOD-W v5.0.1
