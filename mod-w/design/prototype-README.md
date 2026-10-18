# Prototype - brand-ui

**Status:** Research artifact. **Non-authoritative.**

---

This folder contains a clickable prototype produced by the **Designer + Prototyper** role (Claude Design) during the Project Kickoff Prototype Ceremony.

brand-ui is a reference spike, not production work. ArtAnon Shop is a real business owned by a third party; the ArtAnon material here is an unofficial concept exploration with no affiliation or delivery claim. IT English Mentor is a new brand for the Moderator's venture. CodeCraft Academy is a placeholder name. This folder contains no ArtAnon logo, artwork or other third-party brand asset; ArtAnon appears as a text wordmark and palette values only.

## What this is

A working demonstration that the design works under realistic conditions. It shows every component, brand and state in `design-spec.md` scope on one gallery page, with a live brand switcher, as evidence the design is buildable.

The page needs the Design canvas runtime (`support.js`, loaded by the canvas) to render. Opened outside that canvas, `Main.dc.html` is source only.

## Prototype Inventory

### Screens or routes included

| Screen / route | Design IDs | Notes |
| -------------- | ---------- | ----- |
| `Main.dc.html`, gallery page (one page, no routes) | DS-001 to DS-005, DS-010 to DS-015, DS-020 to DS-025, DS-030 to DS-035, DS-040 to DS-045, DS-050, DS-051, DS-060 | Brand switcher shows one brand or all four panels. Design IDs checkbox shows or hides the ID badges. |

### States demonstrated

- Empty: input default (DS-020). Card empty is not designed.
- Loading: button (DS-015), card skeleton (DS-035).
- Error: input (DS-024).
- Disabled: button (DS-014), input (DS-025), navigation item (DS-044).
- Hover / focus / active: shown by forced-state classes on every component that has them; real pseudo-classes also work.

### Simulated integrations

| Integration | Simulation approach | Files |
| ----------- | ------------------- | ----- |
| Fonts | One Google Fonts request in the page head | `Main.dc.html` |
| Links | Navigation and card links point to the panel heading on the same page | `Main.dc.html` |

### Prototype-only controls

- Brand switcher (ArtAnon Shop, IT English Mentor, CodeCraft Academy Light, CodeCraft Academy Dark, All brands). Light and Dark are two modes of one brand; "All brands" shows all four panels.
- "Design IDs" checkbox.
- Forced-state classes `is-hover`, `is-active`, `is-focus`.
- Contrast evidence list (computed by a separate script from the token values, then written into the page).
- Gallery header and chrome styles (not part of the library design).

### Known limitations

- Not Angular. Plain HTML, CSS custom properties and the canvas template syntax.
- Not opened in a browser by the Designer and not run through an accessibility scan. Contrast ratios are computed, not measured on screen.
- Token hex values are written twice (CSS and the gallery's script data).
- No `data-testid` attributes are present; the convention is in `design-spec.md`.
- Brand choice is not remembered between visits.
- Image areas are labelled placeholders; no artwork is shown.
- Narrow navigation wraps; there is no collapsed menu.
- Single viewport-driven layout; no cross-browser or device checks.

### Explicitly out-of-scope behavior

- Alert, teaser or hero, About panel, mock CMS page, deployment (S-10 to S-13).
- Routing, i18n, general dark mode, server rendering.
- Anything from the ArtAnon logo or sample paintings beyond palette direction.

### Architecturally relevant files

| File | Why it matters |
| --- | --- |
| `mod-w/design/project/Main.dc.html` | Token blocks per brand, component styles that use tokens only, gallery structure and Design IDs |
| `mod-w/design/project/canvas.json` | Canvas layout record for the single artboard; not relevant to the library |

## What this is NOT

- **Not production code.** Do not import from this folder into `src/`.
- **Not architecturally canonical.** Patterns here are research output. The authoritative architecture lives in `mod-w/architecture.md`, authored by the Tech Lead.
- **Not a Reference Implementation by default.** A Reference Implementation status is granted only when the Tech Lead explicitly disposes of a specific prototype component in a `step-xx.md` section "Reference Implementation" block.

## How this folder is used downstream

1. The Tech Lead (Codex) inspects this folder during Architecture Definition as one of the kickoff inputs.
2. The Tech Lead must inspect the complete prototype inventory, run or view every in-scope flow, read all files listed as architecturally relevant, and sample supporting files as needed.
3. The Tech Lead may reference specific files here in `step-xx.md` as a Reference Implementation with one of three dispositions: `Adopt as-is`, `Adopt with modifications`, or `Reject`.
4. The Development Team reads dispositions in `step-xx.md` and proceeds accordingly. The Dev Team reads prototype files only when the approved Step names them as relevant.

## Lifecycle

- **Created:** During the Prototype Ceremony.
- **Frozen:** At the Architecture Handoff. Once `architecture.md` is approved, this folder is read-only except for explicitly approved backfill notes.
- **Retained:** For the life of the project, as historical context.

---

MOD-W v5.0.1
