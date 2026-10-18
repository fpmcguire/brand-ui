# Architecture Notes - brand-ui

**Date:** 2026-10-18
**Author:** Designer + Prototyper (Claude Design)
**Status:** Advisory - input to Tech Lead Architecture Definition. **Not authoritative.**

---

> This document records observations from the Prototype Ceremony for the Tech Lead's consideration during Architecture Definition.
>
> It is **advisory**, not constraint. Confidence describes the prototyper's certainty in an observation; it is not architectural authority. The Tech Lead may accept, modify, or reject any possible implication. Material divergences should be recorded in `architecture.md` section "Decisions That Diverge From Prototype" with rationale.

**Important limit for every observation below:** the prototype is plain HTML and CSS custom properties, not Angular, and the Designer did not open it in a browser or run an accessibility scan. Confidence is capped accordingly. Contrast figures are computed, not measured on screen.

---

## 1. Streaming / Performance observations

- none observed. No load, large-data or timing test was run. One cost is noted in OBS-007 (font families).

---

## 2. Component composition patterns that worked

### OBS-001 - Tokens as CSS custom properties scoped by a brand attribute

| Field | Notes |
| --- | --- |
| Observation | One block of custom properties per brand, selected by `[data-brand="..."]`. Component styles only reference `var(--bu-...)`. Each gallery panel carries its own `data-brand`, so "All brands" shows four panels (three brands, one in Light and Dark modes) on one page at once. |
| Evidence | `Main.dc.html`, helmet `<style>`: four brand blocks with identical token names; the component rules below them contain no literal color, font family, radius or elevation. |
| Prototype location | `mod-w/design/project/Main.dc.html`, token blocks and "LIBRARY COMPONENT STYLES" |
| Reproduction conditions | Authoring only; not rendered by the Designer |
| Confidence | Medium |
| Possible architectural implication | Brand scope may need to attach to a host element, not only the document root, if the gallery is to show several brands side by side. Component styles can stay brand-agnostic. |

### OBS-002 - Interactive card as one stretched link

| Field | Notes |
| --- | --- |
| Observation | The card has one real link on its title; a pseudo-element stretches its hit area over the card. This gives one tab stop and a link name equal to the title, and avoids wrapping block content in an anchor. |
| Evidence | `.bu-card__link::after` and `.bu-card--interactive:has(.bu-card__link:focus-visible)` rules |
| Prototype location | `Main.dc.html`, Card section |
| Reproduction conditions | Authoring only |
| Confidence | Medium (`:has()` focus styling not tested in a browser) |
| Possible architectural implication | The card's public API may need a "link" concept (href or router link) distinct from a plain static card. |

### OBS-003 - Long-label handling is CSS-only

| Field | Notes |
| --- | --- |
| Observation | Button: `hyphens:auto` (needs a `lang` on the page or an ancestor) with `overflow-wrap:break-word` as the last resort (`anywhere` was tried first and let the balancer split words such as "collectio / n") and `text-wrap:balance`; the button grows. Navigation item: two-line clamp then ellipsis. Full text remains in the DOM, so the accessible name needs no extra attribute; a `title` repeats it for pointer users. |
| Evidence | `.bu-btn`, `.bu-nav__label`; gallery "Long label" section, widths 180, 280, 360 and full |
| Prototype location | `Main.dc.html`, Long label section |
| Reproduction conditions | Authoring only; wrap result not visually checked |
| Confidence | Low to Medium |
| Possible architectural implication | The rule can be documented as CSS in each component with no input needed. Line-clamp relies on `-webkit-box`; check browser support in the Playwright long-label test. |

---

## 3. State management patterns that worked

### OBS-004 - Gallery state is two values

| Field | Notes |
| --- | --- |
| Observation | The gallery needs only the selected brand (one of four panels, or "all") and a Design-IDs flag. Everything else is derived. |
| Evidence | `renderVals()` builds the panel list from the brand value; a click handler per brand button sets it. |
| Prototype location | `Main.dc.html`, script block |
| Reproduction conditions | Authoring only |
| Confidence | Medium |
| Possible architectural implication | Two signals in the gallery are enough. Whether the library's theme service also owns the "all brands" case (several scopes at once) or only the single active brand is a Tech Lead decision. |

### OBS-005 - Showing every state without interaction needs a forced-state mechanism

| Field | Notes |
| --- | --- |
| Observation | To show hover, active and focus side by side (AC-5), the prototype adds `.is-hover`, `.is-active` and `.is-focus` classes that duplicate each pseudo-class rule. |
| Evidence | Selector pairs such as `.bu-btn--primary:hover:not(:disabled), .bu-btn--primary.is-hover` |
| Prototype location | `Main.dc.html`, component styles |
| Reproduction conditions | Authoring only |
| Confidence | High that a mechanism is needed; Low on the best form |
| Possible architectural implication | The real components should not ship gallery-only classes. Options: a gallery-only host attribute, a shared stylesheet loaded only by the gallery, or Playwright-driven real states. This choice affects AC-3 and AC-9. |

---

## 4. Integration shapes surfaced during prototyping

### OBS-006 - Token values are written twice in the prototype

| Field | Notes |
| --- | --- |
| Observation | Hex values live in the CSS token blocks and again in a script object that feeds the gallery's swatch labels and contrast list. They can drift apart. |
| Evidence | Brand data in the script block versus brand blocks in the helmet; the contrast ratios were computed by a separate script from the same values. |
| Prototype location | `Main.dc.html` |
| Reproduction conditions | Authoring only |
| Confidence | High |
| Possible architectural implication | A single source of truth for tokens. The gallery and the AC-7 contrast test should read the same tokens as the components (for example from computed styles or from one token file) rather than keep copies. |

### OBS-007 - Six font families across three brands

| Field | Notes |
| --- | --- |
| Observation | The prototype loads Instrument Serif, Work Sans, Hanken Grotesk, IBM Plex Mono, Sora and Spectral from one Google Fonts request. Spectral is used only by CodeCraft Academy (Light and Dark). |
| Evidence | Link in the helmet |
| Prototype location | `Main.dc.html` |
| Reproduction conditions | Not measured |
| Confidence | Low |
| Possible architectural implication | Decide between self-hosting and a hosted request, and whether each brand loads only its own fonts. The shortcut list says open-license fonts only; licenses are an open question in the spec. |

### OBS-008 - Contrast constraints shaped the tokens

| Field | Notes |
| --- | --- |
| Observation | The portfolio teal (#63CDDC) is 1.86:1 on white and cannot be used for text, borders or focus. A darker teal is the primary. Amber works only as a fill with dark text (9.31:1) or not at all on white. Each "on" color is its own token. |
| Evidence | Computed ratios, 20 pairs per brand, all passing; closest to the limit: Mentor secondary text on hover tint 4.62:1, Mentor input border on background 3.76:1. |
| Prototype location | Gallery > Contrast evidence |
| Reproduction conditions | WCAG 2.2 relative-luminance formula applied to the token hex values |
| Confidence | High for the arithmetic; not verified on screen |
| Possible architectural implication | The AC-7 test needs an explicit list of token pairs (the 20 pairs in the prototype are a starting point). Per-brand ratios depend on which pairs the components actually use, so the list must follow component code. |

### OBS-009 - A mode of a brand can reuse the same token names

| Field | Notes |
| --- | --- |
| Observation | CodeCraft Academy Light and Dark are two `[data-brand]` blocks with the same 51 token names. Only colors differ between them; type, space and shape tokens are identical. |
| Evidence | `[data-brand="codecraft-light"]` and `[data-brand="codecraft-dark"]` in `Main.dc.html` |
| Prototype location | `Main.dc.html`, helmet `<style>` |
| Reproduction conditions | Authoring only; not rendered by the Designer |
| Confidence | Medium |
| Possible architectural implication | The library may model a mode as a second value set under one brand (shared non-color tokens) instead of a full second brand. The prototype duplicates every token; the choice is the Tech Lead's. |

### OBS-010 - Per-corner radius and shape are token-driven

| Field | Notes |
| --- | --- |
| Observation | The top-right corner has its own radius tokens (`--bu-radius-tr-control`, `-card`, `-panel`) and the card has a shape token (`--bu-corner-shape-card`, `round` or `bevel`). Brands that do not use them set the radius equal to their normal radius and the shape to `round`, so one rule serves all brands. CodeCraft Academy sets the button to 0 (flat) and the card to a 16px bevel. |
| Evidence | `.bu-btn`, `.bu-card`, `.g-panel` rules and the `--bu-radius-tr-*` and `--bu-corner-shape-card` tokens |
| Prototype location | `Main.dc.html` |
| Reproduction conditions | Authoring only; focus-outline and overflow behavior at the bevelled card corner not visually checked |
| Confidence | Low |
| Possible architectural implication | The library may expose a per-corner concept. `corner-shape` is a new CSS feature; the Tech Lead may require a documented fallback (rounded corner of the same size) and a browser-support decision for the Playwright runs. |

---

## 5. Failed approaches

- none observed in a running prototype, because nothing was run. Two constructions were avoided on suspicion and not tested: a data table with a repeating row element (HTML parsers can move unknown elements out of a table body) and per-item `style` attribute bindings for swatches. The prototype uses a div-based list and static swatch markup instead. Confidence: Low.

---

## 6. Open questions for the Tech Lead

- Where do token values live (one file per brand, any format) and how do the gallery and the contrast test read them without copies (OBS-006, OBS-008)?
- Does the theme service set the brand on the document root only, or on any host element so that several brands can show at once (OBS-001, OBS-004)?
- How does the gallery force hover, active and focus states without shipping gallery-only styles in the components (OBS-005)?
- Which component API carries the card's link and the button's loading state (OBS-002, DS-015)?
- Self-host or request fonts, and how many families per brand (OBS-007)?
- Does the narrow navigation need a collapsed menu in a later step? The design wraps items and has no menu.
- The prototype is a `.dc.html` page that needs the Design canvas runtime to render. Should the Tech Lead's Reference Implementation disposition treat it as a visual reference only?

---

MOD-W v5.0.1
