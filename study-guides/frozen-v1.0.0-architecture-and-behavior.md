# Frozen v1.0.0 architecture and behavior

## Purpose and assessment rule

This is a written study guide, not a quiz. Code existence proves implementation evidence; it does
not prove that a reviewer understands the implementation. For each topic, use the self-check to
explain the subject in your own words. Record one of these outcomes only after doing so:

- **Understood:** the explanation covers the boundary, behavior, and reason, and agrees with the
  cited source and tests.
- **Partially understood:** the central idea is correct but an important boundary, exception, or
  verification mechanism is missing.
- **Not yet demonstrated:** no explanation has been recorded, or the explanation depends only on
  saying that the code/tests exist.

Initial status for every topic is **not yet demonstrated**. This guide does not complete the study
gate and does not authorize extension work.

## 1. Workspace boundaries

`projects/ui` is the reusable Angular library. It owns the four public components, theme types,
theme attachment, semantic token CSS, and licensed fonts. Its public boundary is
`projects/ui/src/public-api.ts`; consumers must not reach into `src/lib`.

`projects/gallery` is a separate application and review surface. It imports public symbols from
`ui`, then owns specimen data, forced presentations, token inspection, Design IDs, four-scope
layout, and the About dialog. These review facilities are not library capabilities and therefore
must not be exported by `ui`.

`e2e` owns browser-level Chromium evidence: brand/scopes and contrast, keyboard/accessibility, and
long labels/bevel. `scripts` owns narrow static enforcement for token discipline and restricted
assets/provenance.

The dependency direction is consumer to library: gallery -> `ui`. The library never imports the
gallery, e2e, or gallery specimen machinery. Frozen gallery imports demonstrate the public route
(`projects/gallery/src/app/gallery/gallery-page.component.ts:2` and
`projects/gallery/src/app/gallery/gallery-state.ts:2`). The exported surface is explicit
(`projects/ui/src/public-api.ts:5-13`).

Self-check: explain why moving a specimen, Design ID, forced state, or About dialog into `ui` would
turn review tooling into product API and reverse an approved dependency boundary.

## 2. Theme model

`BrandId` has exactly three values: `artanon`, `mentor`, and `codecraft`. `CodeCraftMode` has
`light` and `dark`. `ThemeSelection` is a discriminated union: ArtAnon and Mentor carry only a
brand, while CodeCraft must carry a mode (`projects/ui/src/lib/theme/brand.types.ts:1-7`). Thus the
system renders three brands through four scopes; CodeCraft Light and Dark are not separate brands.

`ThemeService` owns the normal application selection signal. It normalizes selections and can
apply or remove `data-bui-brand` and `data-bui-mode` on any supplied element
(`theme.service.ts:9-35`). Supplying the application root gives application-root attachment;
supplying another element proves the API is not hard-wired to `document`.

`ThemeScopeDirective` accepts a required `ThemeSelection` and attaches the same attributes to its
own arbitrary host (`theme-scope.directive.ts:9-18`). Multiple directive hosts allow four
simultaneous independent scopes. Tests cover service application/removal and directive hosts
(`theme.spec.ts:55-143`) and the four selectors (`theme.spec.ts:157-194`).

Self-check: explain the difference between owning the selected application state and attaching a
selection to one host subtree. Include why a general cross-brand dark-mode flag would be wrong.

## 3. Token authority

CSS custom properties are the only token-value source. TypeScript may enumerate token names, but
must not duplicate their values (`token-contract.ts:1-5`). Host attributes select a CSS value set;
components use inherited `var(--bui-*)` properties, so switching a brand changes values without
changing component markup.

The gallery token inspector also stores names only. `readTokens()` calls `getComputedStyle()` and
reads each resolved property from a themed element
(`projects/gallery/src/app/gallery/token-inspector.ts:1-4,87-94`). Contrast evidence likewise
operates on rendered/computed colors rather than a TypeScript palette.

`scripts/lint-tokens.mjs` scans component source, validates the complete four-scope contract, and
checks that gallery token names match the library contract. `scripts/token-rules.mjs` rejects
literal colors, fonts, and governed measurements, while `lint-tokens.selftest.mjs` proves the
rules catch known evasions.

Self-check: explain why copying a hex value into TypeScript, a component stylesheet, or gallery
metadata would create a second authority even if it initially matched the CSS.

## 4. Button behavior

Button exposes signal inputs `variant`, `type`, `disabled`, and `loading`, plus the `activated`
output (`button.ts:11-19`). Its template contains a real `<button>` and binds the native type and
disabled property (`button.html:1-7`). Ordinary disabled state is natively disabled and therefore
unfocusable.

Loading is intentionally different. It keeps the native button enabled so existing focus and the
projected label remain. It adds `aria-busy`, displays an assistive-technology-hidden spinner, and
intercepts click activation with both `preventDefault()` and `stopPropagation()`. This suppresses
the output, keyboard-derived clicks, ancestor/host clicks, and native form submission without
removing focus (`button.ts:21-29`; `button.spec.ts:103-184`).

Self-check: explain why implementing loading by setting native `disabled` would violate focus
retention, and why suppressing only the `activated` output would still allow form submission.

## 5. Card behavior

Card has three behavior states. Without `href`, it is static: no link, tab stop, or interactive
marker. With `href`, the title inside the `h3` becomes the single native link. CSS stretches that
one link over the card, preserving one link and one tab stop. Loading sets `aria-busy`, removes the
link and heading content, renders decorative skeletons, and exposes loading status text
(`card.html:1-39`; `card.scss:120-137`). Focus styling is coordinated through `:focus-within`.

The behavior contract is asserted directly: static semantics and absence of a host `title`
attribute (`card.spec.ts:40-57`), exactly one title link/tab stop (`card.spec.ts:72-91`), and busy,
non-interactive loading (`card.spec.ts:94-109`). AC-20 makes these existing assertions and public
inputs the replacement for a Reference Implementation. STEP-05 therefore must not move or change
Card; migration belongs to STEP-06.

Self-check: explain why splitting the title link, stretched-hit-area behavior, or busy ownership
away from Card could accidentally introduce an extra tab stop or change accessible structure.

## 6. TextInput and Navigation

TextInput uses required signal inputs for stable `id` and `label`, a `model()` value for two-way
state, and signal inputs for placeholder, helper, error, disabled, and name
(`text-input.ts:10-22`). Computed IDs connect the native label, helper/error content, and input.
An error replaces helper presentation, drives `aria-invalid`, and becomes the sole
`aria-describedby` target (`text-input.ts:24-35`; `text-input.html:1-27`).

Navigation takes an accessible landmark label, wordmark, and readonly item array
(`navigation.ts:3-25`). Enabled and current destinations are anchors; current adds
`aria-current="page"`. Disabled items are non-focusable text rather than fake disabled anchors
(`navigation.html:1-21`). Long labels remain complete DOM text and therefore complete accessible
names; CSS clamps only the visual paint to two lines. A `title` is optional supplemental text, not
the accessible-name source (`navigation.scss:62-105`).

Self-check: explain why a disabled destination must not remain an anchor and why visual clamping
must not truncate the DOM label.

## 7. Gallery and forced states

Forced specimens are persistent review examples, not real component states. Gallery wrappers use
`data-specimen-state` and gallery CSS to set the same inherited internal variables used by genuine
pseudo-classes. Components therefore expose no preview inputs, gallery services, `.is-*` classes,
or gallery selectors. This keeps the product API honest while allowing repeatable visual review.

Specimen metadata owns stable Design IDs, and the gallery renders the same component structure in
four themed host scopes. Theme changes values, not specimen/component structure.

The About panel is also gallery-owned. It uses native `<dialog>`, one close routine, initial focus
on the close button, Esc/cancel and true-backdrop closing, and restoration to the About trigger.
Its versioned first-visit storage is guarded and falls back to an in-memory once-per-page flag
(`projects/gallery/src/app/gallery/about-panel/about-panel.ts` and
`about-first-visit.ts`). It is not exported from `ui` and carries no Design ID.

Self-check: explain why a forced-hover input would be a misleading library API and why the About
command must not be added to Navigation.

## 8. Accessibility and verification

The implementation prefers native controls and links, visible token-driven focus, real labeling
relationships, `aria-current`, `aria-busy`, and disabled semantics. Computed token-pair contrast is
tested in all four scopes. The browser accessibility suite includes axe and requires no serious or
critical violation.

Verification is layered: Vitest covers units and component contracts; Playwright covers rendered
browser behavior; token and asset scripts enforce static policy; formatting and TypeScript checks
catch source defects; production and `/brand-ui/` builds catch integration and static-subfolder
defects. There are exactly three Playwright specification files because architecture D-08 fixes
the browser responsibilities as: (1) brand/scopes/contrast, (2) keyboard/focus/loading/axe, and
(3) long labels/bevel. New coverage must extend these files rather than create a fourth.

Fonts are self-hosted WOFF2 files. Every family directory contains matching copyright-bearing
`OFL.txt` and provenance-rich `SOURCE.md`. `scripts/check-assets.mjs` verifies those relationships
and prohibits image/design assets and ArtAnon-named non-source assets. ArtAnon logos, artwork,
photography, and other third-party brand assets are prohibited; palette values and a text wordmark
are the allowed representation.

Self-check: explain which defect class each gate catches and why axe does not replace keyboard,
contrast, heading-order, or human review.

## 9. Architecture invariants

Brand switching changes host-selected CSS token values, never component structure. The prototype
is visual evidence only and was explicitly rejected as a Reference Implementation; source code
must follow approved architecture and behavior contracts rather than prototype structure.

CodeCraft bevel is progressive enhancement. The rounded top-right radius is declared first, then
`corner-top-right-shape` enhances it where supported. Unsupported browsers retain the rounded
fallback; the optional bevel cannot defeat a Must requirement when that fallback works.

The Atomic Design extension classifies Button as an atom, TextInput as a molecule, and Navigation
as an organism, but classification is not relocation authority. Button, TextInput, and Navigation
remain in `ui`; only the approved Card decomposition enters `@brand-ui/atomic`. Moving those three
would expand scope and alter established import and ownership boundaries.

Self-check: explain the difference between classifying a component and authorizing its package
move, and why prototype resemblance cannot justify a structural divergence.

## Study assessment record

| Topic | Initial assessment | Evidence basis |
|---|---|---|
| Workspace boundaries | Not yet demonstrated | Public exports and gallery imports inspected |
| Theme model | Not yet demonstrated | Theme types, service, directive, and tests inspected |
| Token authority | Not yet demonstrated | Contract, inspector, token tests, and lint scripts inspected |
| Button behavior | Not yet demonstrated | Component template/class and unit tests inspected |
| Card behavior | Not yet demonstrated | Component template/styles and AC-20 tests inspected |
| TextInput and Navigation | Not yet demonstrated | APIs, templates, styles, and unit tests inspected |
| Gallery and forced states | Not yet demonstrated | Gallery specimens and About implementation inspected |
| Accessibility and verification | Not yet demonstrated | Unit/e2e/static gate organization inspected |
| Architecture invariants | Not yet demonstrated | Frozen source plus approved D-01 through D-12 consulted |

Questions not yet answered are the nine self-check prompts above. Until the Moderator records an
accurate explanation of them, the recommendation is **Further study required**.

This guide does not declare the gate complete. After completing the written self-checks, the
Moderator alone decides whether the study-review gate is complete. If it is explicitly declared
complete, the Tech Lead should record the exact decision and its date; this guide must not edit
that governance record.
