# Architecture

**Project:** brand-ui  
**Date:** 2026-10-19
**Tech Lead:** Codex  
**Status:** Approved by the Moderator, 2026-10-18; D-11 amendment approved 2026-10-19; D-12 approved 2026-10-28

---

## Overview

`brand-ui` is a one-working-day Angular reference spike with one shared component library and one gallery application. The library exposes four standalone, signal-based components and a small host-scoped theme facility. The gallery is a lazy-loaded review surface that renders three brands through four simultaneous scopes: ArtAnon Shop, IT English Mentor, CodeCraft Academy Light, and CodeCraft Academy Dark.

CSS custom properties are the authoritative token values. Components inherit the same semantic contract and contain no brand values. The gallery and contrast tests read resolved custom properties rather than copying values into TypeScript.

The Design-canvas prototype is visual evidence only. It is neither Angular architecture nor a Reference Implementation.

## Requirement to Architecture Mapping

| Requirement            | Architecture decision                                                   |
| ---------------------- | ----------------------------------------------------------------------- |
| S-1, AC-1, AC-3, AC-14 | D-01 semantic CSS token contract and token-only component styling       |
| S-2, AC-2              | D-02 root theme service plus host theme scopes                          |
| S-3, AC-4              | D-04 narrow standalone component APIs                                   |
| S-4, AC-5              | D-03 gallery-owned forced specimens and four simultaneous scopes        |
| S-5, AC-10             | D-06 CSS long-label rules verified in Chromium                          |
| S-6, AC-6 to AC-8      | D-07 accessibility and computed-token contrast gates                    |
| S-7, AC-9, AC-11       | D-08 Vitest, three Playwright specifications, static checks, and builds |
| S-8, AC-13             | D-01 one CodeCraft brand with shared structure and two color modes      |
| S-9, AC-15             | Gallery specimen metadata carries Design IDs                            |
| AC-12                  | D-09 asset, provenance, and documentation controls                      |
| AC-16                  | Human review passed on 2026-10-18                                       |
| S-11, AC-17            | D-11 gallery-owned native About dialog and first-visit lifecycle        |
| S-14, AC-20, AC-21     | D-12 behavior-preserving Card decomposition                             |
| S-15, S-16, AC-22–24   | D-12 packed atomic-package boundary and installed consumption           |
| S-17, AC-25            | D-12 gallery-owned structure view                                       |
| S-18, AC-26            | D-12 reproducible before/after measurement gate                         |

## Technology Stack

| Layer         | Technology                      | Version               | Rationale                                     |
| ------------- | ------------------------------- | --------------------- | --------------------------------------------- |
| Runtime       | Node.js                         | 26.x                  | Product constraint                            |
| Framework     | Angular                         | 22.2.x                | Standalone, zoneless, signals-based workspace |
| Language      | TypeScript                      | 6.0.x, strict         | Product constraint and maintainability        |
| Styling       | SCSS plus CSS custom properties | Workspace toolchain   | Runtime token inheritance                     |
| Unit tests    | Vitest via Angular builder      | 5.x                   | Existing workspace runner                     |
| Browser tests | Playwright, Chromium only       | Pinned when installed | Approved shortcut                             |
| Accessibility | axe integrated into Playwright  | Pinned when installed | AC-8 scan                                     |
| Packaging     | ng-packagr                      | 22.2.x                | Existing library builder                      |

Exact installed versions must be checked at the start of each Development Team session. New dependencies are added only when their Step requires them.

## Current Architecture (Authoritative)

### Projects and boundaries

- `projects/ui` owns theme types, token CSS, font assets, theme attachment, and four reusable components.
- `projects/gallery` consumes `ui` through its public entry point. It owns specimen data, forced-state presentation, token inspection, Design IDs, and review-surface layout.
- `e2e` owns Chromium behavior, axe, contrast, and long-label verification.
- `scripts` owns focused token-discipline and prohibited-asset checks.
- `mod-w/design` is frozen evidence and must not be imported, copied, generated into, or edited.

The gallery has one lazy-loaded page. No backend, SSR, CMS, Storybook, publishing, or general dark-mode facility exists.

### Planned file layout

```text
projects/ui/src/lib/
  theme/
    brand.types.ts
    theme.service.ts
    theme-scope.directive.ts
    token-contract.ts
    tokens/{index,artanon,mentor,codecraft,codecraft-light,codecraft-dark}.css
    typography.css
    fonts/<family>/{used .woff2 files,OFL.txt,SOURCE.md}
  button/
  text-input/
  card/
  navigation/
projects/gallery/src/app/gallery/
  gallery-page.component.*
  gallery-state.ts
  token-inspector.ts
  specimens/
e2e/
scripts/
```

Minor filename consolidation is allowed when it preserves these boundaries and the public API.

### Data flow

1. A `ThemeSelection` identifies a brand and, for CodeCraft, a styling mode.
2. `ThemeService` or `ThemeScopeDirective` writes `data-bui-brand` and optional `data-bui-mode` to a host.
3. Host selectors resolve semantic CSS custom properties.
4. Components inherit those properties and render brand-agnostic native semantics.
5. The gallery reads the same host's computed properties for swatches and contrast evidence.
6. Tests inspect rendered hosts, native behavior, and the same computed values.

## Architectural Decisions

### D-01 — CSS is the authoritative token-value source

**Status:** Active  
**Related requirements:** S-1, S-8, AC-1, AC-3, AC-7, AC-13, AC-14; DS-001 to DS-003, DS-060

Use one identical `--bui-*` semantic token contract. ArtAnon and Mentor provide complete sets. CodeCraft stores shared typography, spacing, shape, and structural values once; Light and Dark provide color values only. A TypeScript token-name list may validate and inspect values but must not duplicate values.

Host selectors are:

```text
<section data-bui-brand="artanon">
<section data-bui-brand="mentor">
<section data-bui-brand="codecraft" data-bui-mode="light">
<section data-bui-brand="codecraft" data-bui-mode="dark">
```

### D-02 — Separate application selection from host attachment

**Status:** Active  
**Related requirements:** S-2, S-4, AC-2, AC-5; DS-004, DS-005

Canonical types:

```ts
type BrandId = 'artanon' | 'mentor' | 'codecraft';
type CodeCraftMode = 'light' | 'dark';
type ThemeSelection =
  { brand: 'artanon' } | { brand: 'mentor' } | { brand: 'codecraft'; mode: CodeCraftMode };
```

`ThemeService` owns the normal application-wide selection signal, validates selections, and applies attributes to a supplied element. `ThemeScopeDirective` accepts one selection and applies it to its own host, allowing independent simultaneous panels. The gallery, not the library service, owns `selectedScope`, `all`, and Design-ID visibility.

### D-03 — Forced states are gallery-owned

**Status:** Active  
**Related requirements:** AC-3, AC-5, AC-9; DS-011 to DS-013, DS-021 to DS-022, DS-032 to DS-034, DS-041, DS-043

Real pseudo-classes and component presentation consume internal inherited state variables. Gallery wrappers such as `data-specimen-state="hover"` set those same variables from gallery CSS. Library components must not expose preview inputs, `.is-*` classes, gallery services, or gallery selectors. Tests compare forced and real presentation where automation can reliably establish the real state.

### D-04 — Components expose narrow signal APIs and native semantics

**Status:** Active  
**Related requirements:** S-3, AC-4, AC-6; DS-010 to DS-045

- **Button:** `variant`, `type`, `disabled`, and `loading` inputs plus `activated` output. Loading retains label and focus, sets `aria-busy`, and suppresses click, keyboard activation, and native form submission.
- **Text input:** required stable `id` and `label`, `model()` value, placeholder, helper text, error text, disabled, and name. It owns label and description IDs; error replaces helper presentation and drives `aria-invalid`.
- **Card:** title, description, meta, tag, media label, optional `href`, optional code sample, and loading. Without `href` it is static; with `href` it has one stretched native title link and one tab stop. `:focus-within` styles focus. Loading is non-interactive and `aria-busy`.
- **Navigation:** accessible label, wordmark, and readonly items containing stable ID, label, URL, optional current, disabled, and supplemental title. Enabled/current items are anchors; current uses `aria-current="page"`; disabled items are non-focusable text, not fake links.

The library does not depend on Angular Router. A future router adapter is outside this spike.

### D-05 — Gallery data cannot change component structure by theme

**Status:** Active  
**Related requirements:** AC-14; DS-030 to DS-035

Brand switching changes tokens only. Optional card code content is an explicit generic component capability supplied by gallery specimen data, not behavior inferred from the active brand.

### D-06 — Long labels are CSS behavior with Chromium assertions

**Status:** Active  
**Related requirements:** S-5, AC-10; DS-050, DS-051

Buttons wrap and grow using `hyphens:auto`, `overflow-wrap:break-word`, and progressive `text-wrap:balance`; they never truncate. Navigation labels preserve full DOM text but visually clamp to two lines at a maximum width of `16rem`. `title` is optional supplemental text only. The document or scope has `lang="en"`.

Playwright covers all four scopes at 180, 280, 360, and full width, checking overflow, clipping, growth/clamp behavior, and accessible names.

### D-07 — Accessibility and contrast are gates

**Status:** Active  
**Related requirements:** S-6, AC-6 to AC-8; DS-013, DS-022, DS-024, DS-033, DS-040 to DS-044, DS-060

Use native elements, WCAG 2.2 AA contrast thresholds, at least 44px control height, visible focus, error icon plus text, and reduced-motion handling. An explicit semantic usage-pair list documents component token combinations; contrast calculations read computed values from every scope. The approved Mentor 4.62:1 pair remains a passing boundary that tests must protect. Brand focus tokens remain authoritative unless an approved design change replaces them.

One axe scan must report no serious or critical violations. AC-16 passed human thumbnail review on 2026-10-18.

### D-08 — Verification is layered and limited to the spike

**Status:** Active  
**Related requirements:** S-7, AC-9, AC-11

Vitest covers the theme facilities and every component. Exactly three Playwright specifications cover: (1) brand switching, four scopes, and contrast; (2) keyboard behavior, genuine focus, loading suppression, and axe; (3) long labels and the progressive bevel. Focused static scripts check token discipline and restricted assets. Intended final gate:

```text
npm run format:check
npm run lint:tokens
npm test
npm run test:e2e
npm run build
```

Do not introduce a general lint platform solely for this spike.

### D-09 — Fonts and third-party material require provenance

**Status:** Active  
**Related requirements:** AC-12; DS-002

Instrument Serif, Work Sans, Hanken Grotesk, IBM Plex Mono, Sora, and Spectral are verified as SIL OFL 1.1 families. Self-host normal styles and only used weights as WOFF2. Each family directory carries its matching copyright-bearing `OFL.txt` and a `SOURCE.md` recording upstream URL, version or commit, source filename, and any transformation. Prefer upstream WOFF2; do not subset or alter binaries in this spike.

No ArtAnon logo, artwork, photography, or other third-party brand asset may enter the repository. ArtAnon is represented by palette values and a text wordmark only.

### D-10 — CodeCraft bevel is progressive enhancement

**Status:** Active  
**Related requirements:** S-8, AC-13; DS-003, DS-030 to DS-035

Declare the top-right radius before `corner-top-right-shape`. Unsupported browsers retain the rounded 16px corner. Pinned Chromium asserts support and the computed bevel. Static review protects the fallback. The Should-priority bevel cannot fail a Must gate when the rounded fallback works.

### D-11 — The About panel is a gallery-owned native modal

**Status:** Active; approved by the Moderator with STEP-03 on 2026-10-19
**Related requirements:** S-11, AC-17; rechecks AC-4, AC-8, AC-9, AC-12

Implement the About panel as a gallery-only component backed by native `<dialog>` and opened with `showModal()`. Native modal behavior supplies the top layer and baseline focus containment. The component explicitly places initial focus on its close button, handles the native `cancel` event as the Esc close path, and treats only a pointer interaction outside the dialog rectangle as a backdrop close. Every close path uses one close routine and restores focus to the top-bar About trigger, including after the automatic first-visit opening.

The trigger is the existing library `Button` styled by the gallery as a top-bar item. It retains the accessible name `About`. Do not extend `Navigation`: a dialog command is neither a destination, a current page, nor a disabled navigation item.

First-visit state uses a versioned gallery-owned `localStorage` key. All storage reads and writes are guarded with `try/catch`. If storage is unavailable, an in-memory page-lifetime flag ensures automatic opening occurs at most once during that page load; a reload may open it again. Storage failure must not prevent manual reopening or closing.

The dialog consumes `ui` only through its public entry point and may use the existing `Button` and `ThemeScopeDirective`. It is never exported by `ui`; the library never depends on it. It follows the active single-scope theme; while All brands is displayed, it follows the retained active theme selection. No brand-specific markup or branching is permitted.

The About content may contain exactly two external links: the approved MOD-W methodology link and the Moderator-approved public `brand-ui` source-repository link at `https://github.com/fpmcguire/brand-ui.git`. Both open in a new tab, use `rel="noopener noreferrer"`, and announce the new-tab behavior in their accessible names. The repository link appears in its own short content section and introduces no new token, component, icon, image, or library API.

No approved Design ID covers S-11. Trace implementation and review through the AC-17 sub-checks in STEP-03, do not invent a `DS-nnn`, and render no Design-ID badge or “no Design ID” placeholder for the panel.

### D-12 — Card decomposition and installed atomic package

**Status:** Active; approved by the Moderator on 2026-10-28

**Related requirements:** S-14 to S-18; AC-20 to AC-27; MD-1 to MD-10; DS-030, DS-031, DS-035 and DS-061 to DS-066

Use the Designer's medium slicing, option B, with these technical boundaries:

| Public component | Level | Ownership |
| --- | --- | --- |
| `Tag` | Atom | Accent/on-accent pill and projected text; no independent state. |
| `SkeletonBlock` | Atom | One decorative placeholder shape and reduced-motion-aware pulse; no loading status or busy state. |
| `CodeWell` | Atom | `pre`/`code` semantics, wrapping, and token-only bordered surface for consumer-supplied code text; no brand knowledge. |
| `MediaArea` | Molecule | The 4:3 sunken surface, optional media label, and optional `Tag`; no state or interaction. |
| `LoadingSkeleton` | Molecule | The card-specific arrangement of four `SkeletonBlock` instances; decorative, with no loading status or busy state. |
| `Card` | Organism | Existing `bui-card` selector and complete public input contract; shell, body layout, h3 title, optional description and meta line, composition, the only stretched native link and tab stop, state decisions, `aria-busy`, and the single screen-reader `Loading` status. |

`Card` remains the only owner of card state. The parts do not accept card state, `href`, title-heading level, accessible loading text, or brand/scope inputs, and they create no links, tab stops, live regions, busy states, or forced-state APIs. The existing Card title is confirmed in source as an `h3`; the refactor preserves it and every existing `card.spec.ts` assertion unchanged.

#### Classification disposition

- Card as organism: **RATIFIED** — it is the stateful composition boundary and owns the complete single-link contract.
- Media area as molecule: **RATIFIED** — it composes a surface, optional label, and Tag as one state-free unit.
- Tag as atom: **RATIFIED** — it is one indivisible token-styled label.
- Skeleton block as atom: **RATIFIED** — it is the repeated smallest placeholder shape; pulse is presentation, not state.
- Code well as atom: **RATIFIED** — it is one semantic and visual unit with consumer-supplied content.
- Loading skeleton as molecule: **RATIFIED** — its four-block arrangement is meaningful while Card retains loading semantics.
- Button as atom: **RATIFIED** — its spinner is internal presentation, not another composition boundary.
- TextInput as molecule: **RATIFIED** — it composes label, field, and mutually exclusive helper/error presentation.
- Navigation as organism: **MODIFIED** from molecule — the named landmark, wordmark, and navigation-item collection form a distinct page section with collection-level behavior. MD-4 authorizes classification only, so no code or API moves.

#### Reasoned not-split list

- **Shell — RATIFIED:** Card's state-bearing host surface, not a content-bearing component.
- **Title — MODIFIED rationale:** stays Card-owned to preserve the h3, only native link, stretched hit area, and one-tab-stop invariant together.
- **Description — RATIFIED:** optional paragraph content with no behavior or composition boundary.
- **Meta line — RATIFIED:** optional text content; separators belong to supplied content.
- **Media label — RATIFIED:** internal text whose meaning depends on `MediaArea`.
- **Media placeholder surface — RATIFIED:** `MediaArea`'s host surface and aspect ratio, with no independent semantics.
- **Hover raise, focus ring, active styling — RATIFIED:** Card states, not parts.
- **Stretched link hit area — RATIFIED:** coordinated Card shell/title-link behavior.
- **`Loading` text and busy state — RATIFIED:** Card semantics; `LoadingSkeleton` remains decorative.
- **Text group and Card footer — RATIFIED:** grouping wrappers without independent responsibility.
- **Button spinner — ADDED:** Button-owned loading presentation; S-19 is excluded.
- **TextInput field, label, helper, and error — ADDED:** remain one molecule; MD-4 authorizes classification only.
- **Navigation item and wordmark — ADDED:** remain Navigation-owned; MD-4 authorizes no decomposition or move.

#### Package architecture and installed consumption

Add a second Angular CLI library at `projects/atomic`, built separately as `@brand-ui/atomic` version `1.1.0`, with canonical secondary entry points:

- `@brand-ui/atomic/atoms`: `Tag`, `SkeletonBlock`, `CodeWell`;
- `@brand-ui/atomic/molecules`: `MediaArea`, `LoadingSkeleton`;
- `@brand-ui/atomic/organisms`: `Card`.

The package root may re-export those symbols for discoverability. It declares compatible Angular 22 packages it imports, including `@angular/core`, as peer dependencies and keeps `tslib` as a runtime dependency where emitted output requires it. It has no gallery, `ui`, router, forms, asset, token-value, or brand dependency.

`ui` imports `Card` from the installed `@brand-ui/atomic/organisms` entry point and re-exports that same symbol from its existing public entry point. Existing `import { Card } from 'ui'` therefore continues to compile and refers to the same component class. `ui` declares its package relationship to `@brand-ui/atomic`; it does not copy or wrap Card. Button, TextInput, Navigation, themes, and tokens remain in `ui`.

The gallery imports structure specimens from installed atomic entry points. Neither it nor `ui` may use a TypeScript path mapping, workspace-source alias, or relative import into `projects/atomic`. The package builds to `dist/atomic`; `npm pack` creates `brand-ui-atomic-1.1.0.tgz`; nothing is published. Archive inspection must exclude gallery code, secrets, third-party brand assets, MOD-W files, and source-path disclosure.

Commit the reviewed archive in a dedicated repository package-artifact directory and reference that exact file from the root manifest so clean `npm ci` can resolve it before Angular tooling is installed. This adds generated output and source/archive drift risk. Counter it by rebuilding and packing from approved source, inspecting normalized archive contents, and comparing normalized content checksums with the committed archive. Building first was rejected because it creates a bootstrap installation path outside the normal locked `npm ci`.

#### Gallery, gates, and QA impact

The gallery-owned structure view consumes only installed package exports, appears last in every scope panel, and follows DS-061 to DS-066 unchanged. Organism specimens reuse DS-030, DS-031, and DS-035. D-05 already supports the Code well: optional code is generic consumer-supplied sample data and is never inferred by Card or the package from the active theme. CodeCraft scopes supply code; ArtAnon and Mentor show `Not used in this scope`.

Only the DS-031 specimen is focusable, with one title link and one tab stop. Isolated `SkeletonBlock` and `LoadingSkeleton` specimens are hidden from assistive technology. Only DS-035 Card specimens expose `aria-busy` and `Loading`. New tests target the structure section explicitly; existing Card-section and Playwright assertions remain unchanged. If the extra DS-031 link or DS-035 Card makes an existing assertion semantically incorrect, stop for a Moderator-recorded decision.

The existing brand/contrast Playwright specification covers presence, Design IDs, installed-part rendering, and all four scopes. The existing keyboard/axe specification covers the extra interactive Card, loading semantics, hidden skeletons, rendered heading order in all four scopes, and complete-gallery axe. The long-label specification remains third. No fourth specification is added.

`lint:tokens` scans both libraries. Its self-test must prove that the package scan, not only the shared parser, rejects a prohibited literal in atomic-package source. `check:assets` scans package source, the packed manifest, and archive file list; the atomic package duplicates no fonts or token values. `format:check`, unit tests, computed contrast, complete-gallery axe, and exactly three Playwright specification files remain gates. QA explicitly checks rendered heading order in all four scopes because AC-8 does not cover axe's moderate `heading-order` rule.

#### Measurement conditions and regression threshold

Take the before measurement from clean `v1.0.0` before extension source changes and the after measurement from the accepted candidate under identical conditions: production `/brand-ui/` build served locally over HTTP; pinned project Chromium on the same machine; Lighthouse mobile emulation with standard simulated mobile throttling; cold cache and fresh browser context per run; five runs; median LCP, CLS, and Total Blocking Time; and raw plus gzip-compressed initial JavaScript and CSS totals.

Fail the measurement check when after exceeds before by more than the greater of 10% or 150 ms for LCP, the greater of 10% or 50 ms for Total Blocking Time, or 0.02 for CLS. CLS must also remain at or below 0.10. Initial compressed JavaScript plus CSS must not grow by more than the greater of 5% or 10 KiB. Report a breach to the Moderator; do not weaken thresholds. Measurements are evidence only and make no improvement claim.

The extension is additive version `1.1.0`. README, the `ui` library note, this document's Public API section, and About wording distinguish the four established `ui` components from the installed atomic parts without implying publication or production use. No Reference Implementation exists for this extension; AC-20's existing Card behavior contract takes its place.

## Public API

`projects/ui/src/public-api.ts` continues to export the four established components and their public input types; its `Card` export re-exports the same `Card` class obtained from installed `@brand-ui/atomic/organisms`. It also exports `BrandId`, `CodeCraftMode`, `ThemeSelection`, `ThemeService`, and `ThemeScopeDirective`.

Atomic parts are public through `@brand-ui/atomic` and its `atoms`, `molecules`, and `organisms` secondary entry points. Gallery state, specimen metadata, Design IDs, forced-state mechanisms, and the structure-view shell are not exported by either library.

## Testing Strategy

### Unit tests

- Theme selection normalization, root attachment, removal, and multiple independent scope hosts.
- Complete resolved token contract for four scopes; shared CodeCraft non-color values resolve identically.
- Button activation, disabled/loading suppression, form type, ARIA, and focus retention.
- Input model updates, labeling, descriptions, error replacement, and disabled behavior.
- Static/interactive/loading card semantics and single-link behavior.
- Navigation enabled/current/disabled semantics and full accessible names.

### Browser tests

1. Brand switching without reload, computed restyling, four simultaneous scopes, and computed-value contrast.
2. Keyboard order and activation, focus visibility, loading suppression, card/navigation semantics, About-dialog behavior, and axe against the complete gallery after the dialog is dismissed.
3. Long-label widths in all scopes, full accessible names, overflow/clamp assertions, and bevel capability.

### Static and review checks

- Component styles contain no literal brand colors, font families, spacing, radius, or elevation values. A documented allowlist covers structural constants such as percentages, line heights, and aspect ratios.
- Font licence and provenance files are present.
- Restricted brand assets are absent.
- Components are exported and the gallery imports from `ui`, not library internals.
- The root README replaces Angular CLI boilerplate, matches AC-12, and makes no production or client-delivery claim. Project-level boilerplate must not contradict the spike's non-goals: remove or replace `projects/ui/README.md` npm-publishing instructions with a non-publishing note or a pointer to the root README.
- The README and About panel share the approved product facts. Review maps both surfaces to Product section 5.2, AC-17, and the recorded Moderator amendments; tests assert stable headings/key statements and both external-link contracts rather than duplicating the full prose in a second source file.

## Decisions That Diverge From Prototype

| Prototype implication                                   | Architecture decision                            | Rationale                         |
| ------------------------------------------------------- | ------------------------------------------------ | --------------------------------- |
| `codecraft-light` and `codecraft-dark` flat identities  | `codecraft` brand plus `light`/`dark` mode       | Preserve three-brand domain model |
| Every CodeCraft token duplicated                        | Shared non-color base plus mode color files      | Prevent drift                     |
| `.is-hover`, `.is-active`, `.is-focus` in component CSS | Gallery-owned inherited state-variable overrides | No gallery API leakage            |
| `:has()` for card focus                                 | `:focus-within`                                  | Simpler semantic fit              |
| CSS values duplicated in script data                    | Gallery and tests read computed CSS              | One value source                  |
| Google Fonts request                                    | Self-hosted licensed assets                      | Deterministic, approved packaging |
| Disabled navigation anchor                              | Non-link text in the list                        | Truthful disabled semantics       |
| Card structure inferred from brand                      | Optional generic card content API                | Switching changes tokens only     |
| Canvas template and scripts                             | Fresh Angular implementation                     | Prototype is visual evidence only |

## Reference Implementation Disposition

**Location:** `mod-w/design/project/Main.dc.html`  
**Disposition:** Reject as a Reference Implementation; retain as visual evidence.

No production source may import from `mod-w/design`.

## Constraints and Open Product Wording

- The original one-working-day sequence and between-Step study break were superseded by the Moderator on 2026-10-19. On 2026-10-28, the Moderator rescheduled all study-review gates as one additional final gate after STEP-09 and before any release, publish, or deployment decision; the review is no longer a STEP-05 prerequisite.
- S-10 and S-12 are excluded. S-11 is wanted and planned as STEP-03. S-13 static deployment remains required after STEP-03 acceptance.
- CodeCraft is the first approved cut if Must completion is threatened.
- “All brands shows three panels” is a wording defect: it means three brands across four panels/scopes.
- Approved sample tags and bracketed placeholders remain neutral sample content. Do not invent testimonials, prices, course claims, or contact details.

## Change Log

| Date       | Change                                      | Reason                                                                           |
| ---------- | ------------------------------------------- | -------------------------------------------------------------------------------- |
| 2026-10-18 | Initial architecture approved               | Architecture Handoff and Definition                                              |
| 2026-10-19 | D-11 native About-dialog lifecycle approved | Moderator approved the STEP-03 bounded authority and S-11-before-S-13 sequencing |
| 2026-10-19 | D-11 repository-link content amendment | Moderator and Product Owner required a distinct About section linking to the public `brand-ui` GitHub repository; no API, token, asset, or behavior expansion |
| 2026-10-28 | D-12 atomic decomposition and package boundary | Moderator approved the Tech Lead decomposition and domain terms after the approved design proposal |
| 2026-10-28 | Study-review gate sequencing | Moderator consolidated all study-review gates as one additional final gate after STEP-09; the gate remains required before release, publish, or deployment |

---

MOD-W v5.0.1
