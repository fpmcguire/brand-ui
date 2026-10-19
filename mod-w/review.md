# Review: STEP-01

**Project:** brand-ui
**Step:** STEP-01 - Theme foundation, button, card, and gallery shell
**Reviewer:** Tech Lead (Codex)
**Review Date:** 2026-10-19
**Development Team Interface:** Claude Code

---

## Tech Lead Re-review - STEP-01

### Verdict

Rework required

### Scope check

- The two implementation defects from the prior review are corrected: loading now takes precedence over disabled, and the loading media skeleton no longer declares a radius.
- No text input, navigation, README, Playwright test, contrast automation, S-10 to S-13, card heading-level, or `playwright.config.ts` rework was found. `git status --short -- mod-w/design` is empty.
- The gallery still describes three brands across four scopes; CodeCraft Light/Dark remain modes of one brand. Earlier deviation rulings for font subsets, filenames, extra tokens, hidden loading text, and `--bui-state-*` are untouched.
- The working tree still contains the full uncommitted STEP-01 implementation, so Git cannot independently date every untracked file to the rework session. The focused source comparison against the prior review found no rework beyond the stated button, card, token-lint, self-test, and package-script areas. The modified `projects/ui/ng-package.json` remains part of the earlier STEP-01 work.
- The prototype remains rejected as a Reference Implementation; no prototype or prohibited asset change was found.

### Quality gate evidence

Required shell selected Node `v26.0.0` and npm `11.12.1`.

- `npm run format:check` - passed: `All matched files use Prettier code style!`
- `npm run lint:tokens` - passed: `lint:tokens self-test passed (19 evasion fixtures detected; 4 clean fixtures accepted).` then `lint:tokens passed (51 contract tokens; 4 scopes; components clean).`
- `npm run check:assets` - passed: `6 font families with OFL.txt and SOURCE.md; no restricted assets`.
- `npm test` - passed: UI `3` files / `42` tests; gallery `2` files / `10` tests.
- `npm run build` - passed: `ui` package and gallery production build; lazy `gallery-page-component` chunk emitted.
- `git status --short -- mod-w/design` - empty.

The initial sandboxed command could not initialize fnm, remained on Node `v24.13.0`, and could not spawn the asset check or Angular gates. It is superseded by the successful required-shell Node 26 rerun above.

### Findings

#### Must fix now

1. The strengthened token gate still does not scan external component templates for literal `style="..."` attributes. `lint-tokens.mjs` walks `.html` files but supplies style text only for `.scss`/`.css` files and `styles:` metadata in `.ts`; HTML therefore receives an empty style list. A component template can still introduce `style="border-radius: 0"`, `style="padding: 4px"`, a shorthand, `calc()`, or a `var()` fallback while `lint:tokens` reports components clean. D-01 and acceptance check 9 apply to component styles regardless of which Angular style surface contains them. Add template-style extraction plus failing and clean fixtures without broadening this into a general lint platform.

#### Could fix later

1. The fixed card `h3` is correct for the present component contract but produces an `h3` beneath the gallery's `h3` Card section heading. Revisit heading ownership before general reuse; changing the public API requires an approved architecture decision (D-04, DS-030 to DS-035).
2. Unit tests establish DOM semantics but do not prove real-browser Enter/Space synthesis, double-submit resistance, genuine pseudo-class/forced-state computed equality, visible focus, bevel support, contrast, or absence of external requests. These remain the explicitly deferred STEP-02 Chromium gates, not STEP-01 failures (D-03, D-07, D-08).
3. `playwright.config.ts` still enables Firefox and WebKit although D-08 specifies Chromium only. Resolve when STEP-02 is activated; do not begin that Step until the Moderator ends the study break.

### Acceptance check mapping

- Check 1: met - token test and `lint:tokens` prove ArtAnon and Mentor each declare the same complete 51-name contract (AC-1; DS-001 to DS-003).
- Check 2: met - CodeCraft shared CSS contains non-color values once; Light/Dark files contain the complete color-only subset; four scopes resolve (AC-13).
- Check 3: met - gallery unit tests prove immediate selection changes and All brands renders three brands across four simultaneous scopes (AC-2/AC-5).
- Check 4: met - swatches call `getComputedStyle`; gallery data contains names only, and tests prove rereading after selection changes.
- Check 5: met - standalone signal components are exported only through `ui` and the gallery imports them through that entry point (AC-4).
- Check 6: met on re-review - loading takes precedence over disabled. The combined state is natively enabled, focusable, labeled, and `aria-busy="true"`; focused tests prove suppression of `activated`, host click propagation, submit behavior, and a keyboard-derived click. Disabled-only remains natively disabled and inert, and loading completion restores native disabled state (DS-015).
- Check 7: met - static/loading cards have no focusable link; interactive cards have exactly one stretched native title link and one tab stop (DS-030 to DS-035).
- Check 8: met - forced specimens remain gallery-owned inherited variables; no preview input, `.is-*` component class, gallery selector, decorator API, or public forced-state export was added (D-03).
- Check 9: not met - the card literal is removed and the current component sources are clean, but literal token values can still evade the required gate through a component template `style` attribute (AC-3/AC-14; D-01).
- Check 10: met for STEP-01 boundary - native semantics, focus styles, 44px control token, and reduced-motion rules exist; final real-browser keyboard, focus, and contrast automation remains STEP-02.
- Check 11: met - six used normal font families have matching copyright-bearing OFL and SOURCE provenance; restricted asset check passes and no prohibited ArtAnon asset exists (AC-12).
- Check 12: met - focused theme/button/card and gallery tests pass, and both builds pass (AC-9/AC-11).
- Check 13: met - approved palettes, typography, and CodeCraft structural distinction remain intact; AC-16 is preserved, not re-approved.

### Design ID mapping

- DS-001: met - complete computed color-token group across four scopes.
- DS-002: met - complete typography tokens and six self-hosted licensed families.
- DS-003: met - complete spacing/radius/elevation contract; CodeCraft shared structural values.
- DS-004: met - five-option `aria-pressed` switcher with one active selection.
- DS-005: met - lazy gallery shell, Design-ID visibility control, and accurate reference-spike/unofficial-concept status wording.
- DS-010: met - primary and secondary default buttons.
- DS-011: met - gallery-owned hover specimen maps to the same internal properties as `:hover`.
- DS-012: met - gallery-owned active specimen maps to the same internal properties as `:active`.
- DS-013: met at STEP-01 boundary - focus specimen and `:focus-visible` use the focus token; browser contrast evidence remains STEP-02.
- DS-014: met - native disabled state is presented and suppresses activation.
- DS-015: met on re-review - loading, including `disabled=true` plus `loading=true`, retains label and focus, announces busy, and suppresses activation and submission without `aria-disabled`.
- DS-030: met - static card is non-interactive.
- DS-031: met - interactive card has one stretched native title link and one tab stop.
- DS-032: met - interactive hover specimen uses gallery-owned variables.
- DS-033: met at STEP-01 boundary - card uses `:focus-within` and the forced specimen shares its outline property; genuine-browser evidence remains STEP-02.
- DS-034: met - interactive active specimen uses gallery-owned variables.
- DS-035: met on re-review - the loading skeleton remains non-interactive, `aria-busy`, reduced-motion aware, and square in the media block. Removing the redundant zero radius introduces no token and preserves appearance; only title/line placeholders use `--bui-radius-control`.
- DS-060 foundation: met - gallery displays computed token values; final usage-pair ratios and automated contrast gate remain STEP-02.

### Allowlist ruling

Accepted. `margin: 0` is narrowly documented as a user-agent margin reset for headings, paragraphs, and `pre`; `inset: 0` is narrowly documented as stretched-link geometry. The allowlist is property/value-specific, retains no zero allowance for radius or elevation, and includes the existing visually-hidden structural dimensions only. The self-test distinguishes these allowances from governed spacing, radius, and shadow failures. This satisfies D-01 once every component styling surface is actually scanned.

### Process-deviation ruling

The Development Team bypassed CLAUDE.md's plan-approval stop and implemented directly from the rework prompt. That is a process nonconformance and should be recorded for Moderator follow-up, but it does not require source rollback or an additional product change: the rework prompt was narrowly bounded, the resulting changes stayed within that technical scope, and the Tech Lead has not self-approved them. Future rework must stop for the required plan approval unless the Moderator explicitly waives that stop.

### Deviation rulings carried forward

- Google Fonts CSS API `latin` WOFF2 files: accepted. They are unaltered Google-served upstream-distribution binaries, the omitted unicode ranges match the English-only gallery, and each SOURCE records URL/version/range and no transformation. Work Sans and Hanken Grotesk variable files cover only used weights. This satisfies D-09's preference and its prohibition on local subsetting/alteration.
- `button.ts` / `card.ts` versus `.component.*`: accepted under the planned-layout allowance for minor filename consolidation. Gallery `.component.*` naming is also acceptable.
- Additional tokens (`weight`, UI letter spacing, line height, border/focus widths, control height): accepted as technical semantic tokens needed to keep components value-free and meet D-01/D-04/D-07; they are filled identically by contract and do not alter approved brand structure.
- Hidden loading-card `Loading` text: accepted as accessibility status content consistent with DS-035 and `aria-busy`; it does not add an interactive element.
- `--bui-state-*` fallbacks: accepted as D-03's internal inherited contract. They are absent from the public entry point and real pseudo-classes resolve through the same internal properties.

### Reference Implementation compliance

Compliant. The rejected prototype was used only as visual evidence; no prototype runtime, duplicated token object, forced-state class, remote font request, or prohibited asset appears in the implementation.

### Recommended next action

Development Team adds narrow external-template `style`-attribute coverage to the token gate and its self-test, reruns the five STEP-01 gates under Node 26, and returns for a focused Tech Lead re-review. The Moderator should separately note the plan-approval process deviation. Do not begin STEP-02; it remains blocked until the Moderator explicitly ends the study break.

---

## Moderator Final Gate Notes

> Moderator completes this after QA and Product Owner validation.

- **Status:** Pending
- **Moderator:**
- **Date:**
- **Conditions:**

---

MOD-W v5.0.1


---

## Tech Lead Focused Re-review - STEP-01 - 2026-10-19

### Verdict

Rework required

### Scope check

- The requested external-template path is present: `.html` files pass through `templateStyles(text)`, and every extracted value then reaches the existing `checkStyleText(css)` loop. The prior defect was addressed directly rather than moved to another component surface.
- The `ALLOWED_LITERALS`, literal detectors, governed-property rules, and `checkStyleText` behavior remain consistent with the previously reviewed rule set. No radius or elevation zero was allowlisted. Because `scripts/` is untracked as one working-tree area, Git has no prior blob from which to prove a byte-for-byte rework delta; direct source inspection found only the new extractor/export, `.html` routing, and fixtures described by the Development Team.
- The working tree still contains the earlier uncommitted STEP-01 implementation. Focused inspection found no rework-session change to components, templates, public APIs, token values, the 51-name contract, gallery behavior, button/card implementation or tests, `playwright.config.ts`, or dependencies. `package.json` retains the earlier STEP-01 script changes and has no newly added dependency. `git status --short -- mod-w/design` is empty.
- The approved written-plan stop was observed before this re-re-work. The prior process deviation was not repeated.
- The rejected prototype remains visual evidence only; no Reference Implementation status or prohibited asset decision changed.

### Quality gate evidence

The required PowerShell/fnm sequence selected Node `v26.0.0`.

- `npm run format:check` - passed: `All matched files use Prettier code style!`
- `npm run lint:tokens` - passed on the checked-in working tree: `42 evasion fixtures detected; 12 clean fixtures accepted`, then `51 contract tokens; 4 scopes; components clean`.
- `npm run check:assets` - passed: `6 font families with OFL.txt and SOURCE.md; no restricted assets`.
- `npm test` - passed: UI `3` files / `42` tests; gallery `2` files / `10` tests.
- `npm run build` - passed: the `ui` package and production gallery built; lazy `gallery-page-component` chunk emitted.
- `git status --short -- mod-w/design` - empty.

The new fixture set covers governed spacing/radius/elevation zero, shorthands, lengths, `calc()` literals, `var()` fallbacks, colors, multiline and minified attributes, and both quote forms. Its clean cases cover token-only declarations, the documented `margin: 0` / `inset: 0` allowances, non-governed properties, and templates without style attributes.

### Findings

#### Must fix now

1. A valid literal quoted external-template attribute can still evade acceptance check 9: `style="border-radius: .0"`. `templateStyles` extracts `border-radius: .0`, but `checkStyleText` returns no message because `ZERO` only recognizes a zero beginning with `0`. An end-to-end scratch file at `projects/ui/src/lib/button/zz-tech-lead-probe.html` containing that attribute let `npm run lint:tokens` exit `0` and report `components clean`; the scratch file was removed immediately afterward. `style="border-radius: 0e0"`, another valid CSS zero spelling, also produced no message in a direct probe. Extend the zero detector and add focused failing fixtures without broadening this into a general lint platform.

#### Could fix later

1. HTML character references can conceal values from the raw-text checker, for example `style="border-radius: &#48;"` and `style="color: &num;fff"`. These passed a direct probe. They are substantially less plausible in authored component templates than `.0`; track this parser limitation rather than requiring an HTML parser in STEP-01.
2. Inline `template:` strings remain unscanned. This limitation is accepted for STEP-01 under the Moderator-approved plan: the only non-spec occurrence is the gallery root `<router-outlet />`, while library button/card components use external templates. Track it before a scanned library component adopts inline template styling.
3. The documented exclusions for literal style bindings, `[ngStyle]`, unquoted values, interpolation, and an attribute without preceding whitespace remain accepted limitations for this narrow gate. No current scanned component uses them to introduce governed literals.

### Acceptance and Design-ID status

- Acceptance check 9 remains **not met**. External quoted style attributes now enter the checker, but valid `.0` and exponent zero literals still evade the gate (AC-3/AC-14; D-01).
- No other acceptance-check status changes. The 51-token/four-scope contract, component behavior, assets, tests, and builds remain as mapped in the prior re-review.
- No Design-ID status changes. The focused rework affects enforcement evidence, not the implemented DS-001 to DS-060 surfaces.

### Reference Implementation compliance

Compliant. The prototype remains rejected as a Reference Implementation, and this rework introduces no prototype runtime, duplicated token source, gallery preview API, forced-state component class, remote asset, or prohibited ArtAnon asset.

### Recommended next action

Development Team closes the `.0` and exponent-zero gap with narrow rule and fixture changes, reruns all STEP-01 gates under Node 26, and returns for another focused Tech Lead review. Do not begin STEP-02; after STEP-01 approval it still proceeds to QA and then the Moderator's explicit decision on the study break.

---

MOD-W v5.0.1

---

## Tech Lead Focused Re-review - STEP-01 - 2026-10-19 (`.0` / exponent-zero rework)

### Verdict

Rework required

### Scope check

- The approved rework is narrow: `ZERO` is the stated new expression; `ALLOWED_LITERALS`, governed-property rules, template extraction, and scanner structure are unchanged. The self-test adds 14 failing and 3 clean cases and is Prettier-formatted.
- Focused status/diff inspection found no rework-session change to components, templates, public APIs, token values, the 51-name contract, gallery behavior, button/card implementation or tests, `package.json`, dependencies, `playwright.config.ts`, or `mod-w/design/`. Because `scripts/` and much of STEP-01 remain untracked, Git cannot independently prove a byte-for-byte delta inside those files; source inspection and the prior review baseline support the bounded scope.
- `margin: +0` is intentionally flagged and is accepted. The allowlist permits only the exact string `0` for `margin` and `inset`; no repository use of `margin: +0` was found. Radius and elevation retain no zero allowance.
- The scanner remains a narrow raw-text rule, not a general lint platform or HTML parser. Previously accepted extraction limitations are unchanged.

### Quality gate evidence

The required PowerShell/fnm sequence selected Node `v26.0.0`.

- `npm run format:check` - passed: `All matched files use Prettier code style!`
- `npm run lint:tokens` - passed on the checked-in working tree: `56 evasion fixtures detected; 15 clean fixtures accepted`, then `51 contract tokens; 4 scopes; components clean`.
- `npm run check:assets` - passed: `6 font families with OFL.txt and SOURCE.md; no restricted assets`.
- `npm test` - passed: UI `3` files / `42` tests; gallery `2` files / `10` tests.
- `npm run build` - passed: `ui` package and production gallery; lazy `gallery-page-component` chunk emitted.
- `git status --short -- mod-w/design` - empty.

Direct ZERO probes matched `.0`, `.00`, `0e0`, `0E0`, `0e-0`, `0.0e0`, `+0`, `+.0`, and `00`. They did not match `10`, `1.05`, `100%`, `0px`, `0em`, `0.5`, `--bui-space-0`, or `var(--bui-space-10)`. The separate existing `LENGTH` rule correctly continues to reject `0px` and `0em` when used in governed properties.

An old-rule/new-rule harness proved all 14 added failing fixtures were missed by the prior ZERO expression and detected by the new rule. Coverage includes both quote styles, uppercase and signed exponents, `calc()`, `var()` fallback, elevation, and non-allowlisted `margin: .0`. The three clean additions preserve exact `margin: 0; inset: 0` allowances and non-governed zero spellings.

Independent external-template probes under Node 26 both exited `1` with the expected findings:

- `style="border-radius: .0"` - `literal .0 in "border-radius: .0" (use a token)`
- `style="border-radius: 0e0"` - `literal 0e0 in "border-radius: 0e0" (use a token)`

The scratch file was deleted; `Test-Path` returned `False`, and the normal token gate subsequently passed.

### Findings

#### Must fix now

1. `border-radius: 0e0px` still evades both `ZERO` and `LENGTH`. This is a valid CSS dimension: [CSS Values and Units](https://www.w3.org/TR/css-values-3/#numbers) defines a number as permitting scientific notation and a dimension as a number immediately followed by a unit. It is therefore a hard-coded governed radius value, not merely HTML-parser obfuscation. Leaving it undetected contradicts AC-3/D-01 and the purpose of acceptance check 9. Extend the existing length detector narrowly for exponent-form supported units and add failing/clean boundary fixtures; do not broaden the scanner beyond its approved role.

#### Could fix later

1. Continue tracking the already accepted raw-text limitations: inline Angular `template:` strings, style bindings, unquoted/interpolated attributes, attributes without preceding whitespace, and HTML character references. They are unchanged by this rework and do not replace the Must-fix valid CSS dimension above.

### Acceptance and Design-ID status

- Acceptance check 9 remains **not met**. The requested `.0` and unitless exponent-zero spellings are now enforced across governed spacing, radius, and elevation properties, and the allowlist boundary is correct, but valid exponent-form zero dimensions can still evade `lint:tokens` (AC-3/AC-14; D-01).
- No other acceptance-check status changes. The passing contract, asset, unit-test, and build evidence remains as mapped in the preceding review.
- No Design-ID status changes. This enforcement-only rework does not alter DS-001 to DS-060 implementation surfaces.

### Reference Implementation compliance

Compliant. The prototype remains rejected as a Reference Implementation; this rework introduces no prototype runtime, copied token source, gallery preview API, forced-state component class, remote asset, or prohibited ArtAnon asset.

### Recommended next action

Development Team adds narrow exponent-form length detection and fixtures, reruns the STEP-01 gates under Node 26, and returns for focused Tech Lead review. Do not begin STEP-02; it remains blocked until the Moderator explicitly ends the study break.

---

MOD-W v5.0.1

---

## Tech Lead Focused Re-review - STEP-01 - 2026-10-19 (exponent-dimension rework)

### Verdict

**Pass for the focused rework; Moderator acceptance remains required.** The `0e0px` gap is closed, and acceptance check 9 is now met at the STEP-01 boundary.

### Scope check

- The approved implementation surface is limited to `scripts/token-rules.mjs` and `scripts/lint-tokens.selftest.mjs`. `scripts/` is untracked, so Git cannot prove its internal before/after delta; current-source inspection confirms the claimed `LENGTH` rule and two-line comment, with `ZERO`, `ALLOWED_LITERALS`, `GOVERNED`, `templateStyles`, `inlineStyles`, and `checkStyleText` unchanged from the reviewed forms.
- Current Git status contains the pre-existing STEP-01 implementation work, but no `mod-w/design/` change. No evidence attributes a component, template, public API, token-contract, gallery, dependency, `package.json`, or `playwright.config.ts` change to this focused rework.
- The temporary card-template probes were deleted; `Test-Path` returned `False` before the clean gate.

### Evidence

- Required PowerShell/fnm sequence selected Node `v26.0.0` and npm `11.12.1`.
- Direct `LENGTH` probes matched all requested exponent, case, sign, legacy length, `calc()`, and `var()` cases and rejected all requested number, percentage, token-name, time, and unitless controls. `+0e-0em` is enforced as `0e-0em`; the required boundary `-0e+0vw` matches as the whole literal.
- Exact allowlisting still accepts `margin: -1px; width: 1px; height: 1px`; `width: 1e0px` and `margin: -1e0px` remain findings. ZERO/LENGTH probes produced no duplicate report, Node 26 supports the lookbehind, and no problematic backtracking was found.
- The reconstructed old `LENGTH` missed 30 of 31 new failing fixtures. Its sole hit was the documented boundary fixture `-0e+0vw`, detected only as trailing `0vw`; the new rule matches it whole. Thus the evidence separates 30 newly closed evasions from one boundary case.
- End-to-end external-template probes for `border-radius: 0e0px` and `border-radius: 0E0REM` each exited nonzero with the expected literal-length finding.
- `npm run format:check`: pass.
- `npm run lint:tokens`: pass - 87 evasion fixtures detected, 20 clean fixtures accepted, 51 contract tokens, four scopes, components clean.
- `npm run check:assets`: pass - six font families with provenance; no restricted assets.
- `npm test`: pass - UI 3 files / 42 tests; gallery 2 files / 10 tests.
- `npm run build`: pass - UI library and gallery.
- `git diff --check` was clean for tracked changes before staging; the later cached check reports only pre-existing trailing spaces inside the newly tracked upstream OFL license texts. `git status --short -- mod-w/design`: empty.

### Findings

#### Must fix now

None.

#### Could fix later

1. The accepted raw-text limitations remain: inline `template:` strings, style bindings, unquoted or interpolated attributes, attributes without preceding whitespace, and HTML character references.
2. `LENGTH` intentionally governs only `px`, `rem`, `em`, `vw`, `vh`, and `ch`; other CSS units remain outside this focused rule. Neither limitation is essential to STEP-01 acceptance check 9 as bounded by D-01 and the approved rework.

### Acceptance and Design-ID status

- Acceptance check 9: **met** for valid exponent-form and ASCII case-variant dimensions in the governed units (AC-3/AC-14; D-01).
- DS-001 to DS-003 and DS-060: unchanged. This enforcement-only rework does not alter their implementation surfaces.

### Reference Implementation compliance

Compliant. The prototype remains rejected as a Reference Implementation; this rework introduces no prototype runtime, copied token source, gallery preview API, forced-state component class, remote asset, or prohibited ArtAnon asset.

### Recommended next action

Moderator reviews this Pass and decides STEP-01 acceptance. Do not begin or authorize STEP-02; it remains blocked until the Moderator explicitly ends the study break.

---

MOD-W v5.0.1

---

## Moderator Decision - STEP-01 - 2026-10-19

The Moderator approves the Tech Lead and Development Team work for STEP-01. STEP-01 is accepted. The mandatory Moderator study break is now the active gate; this decision does not authorize STEP-02.

---

MOD-W v5.0.1

---

## Moderator Sequencing Decision - 2026-10-19

The Moderator supersedes the earlier between-Step study-break sequence and approves the corresponding updates to `AGENTS.md`, `mod-w/roadmap.md`, and `mod-w/architecture.md`. STEP-02 is authorized to proceed. After STEP-02 is completed and accepted, the application must pass the S-13/AC-19 static-deployment gate; the Moderator will then conduct a fuller study review of the workspace projects and UI library. S-10 to S-12 remain excluded.

---

MOD-W v5.0.1
