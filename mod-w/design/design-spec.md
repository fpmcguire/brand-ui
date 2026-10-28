# Design Spec - brand-ui

**Date:** 2026-10-18
**Designer:** Claude Design (Designer + Prototyper role)
**Authored in:** CLAUDE_DESIGN
**Prototype:** `mod-w/design/project/` (`Main.dc.html`, `canvas.json`)
**Depth:** options for brand identities (Section 1), minimal everywhere else. Brand options chosen by the Moderator: A1, M1, C1; CodeCraft Academy was then reworked on request into a light and dark pair built from C3 (see 1.6), replacing C1.
**Revision 2026-10-27 (Atomic Design extension, product.md v0.6):** authored in Claude chatbot, Designer + Prototyper role, text-only per MD-10. Adds a classification line in 3.2, 3.3.1 to 3.3.4, 3.6, one pointer line in 4.1, 4.2, DS-061 to DS-066 (Proposed; the organism specimens carry the existing DS-030, DS-031 and DS-035), six domain-language proposals and Section 10.1 to 10.2. Depth for this revision: options for the classification (3.3.3), minimal everywhere else. Nothing earlier in this spec is changed: DS-001 to DS-060, tokens, brand values and gallery scopes are as approved. No prototype or canvas change. Every classification is advisory.

---

## Authority Boundary

After Product Owner and Moderator approval, this spec is authoritative for user-facing visual behavior, interaction intent, screen composition, component states and variants, accessibility expectations, and approved user-facing terminology and content presentation.

It is not independently authoritative for production file paths, service or module boundaries, framework or library choices, canonical domain types, internal implementation names, test implementation strategy, or technical component decomposition. Those decisions remain under Tech Lead authority in `architecture.md`, `domain-language.md`, and `step-xx.md`.

The prototype is evidence for this spec, not an authoritative production source.

---

## Approval Record

### Product Owner review

- **Status:** Approved (stated by Frank McGuire in the Designer session). Covers Gallery version 18.
- **Reviewer:** Frank McGuire (Product Owner)
- **Date:** 2026-10-18
- **Conditions or findings:** none stated.

### Tech Lead feasibility pre-review

- **Status:** Pending
- **Reviewer:**
- **Date:**
- **Feasibility concerns:**
- **Architecture questions:** see `architecture-notes.md` section 6.

### Moderator gate

- **Status:** Approved (stated by the Moderator in the Designer session). Covers the Designer's work through Gallery version 18: the Moderator confirmed the changes after version 16 (button label hyphenation and `break-word`, found while reviewing the thumbnails) and viewed the rendered long-label fix on 2026-10-18.
- **Moderator:** Frank McGuire
- **Date:** 2026-10-18
- **Conditions:** none stated. The open questions in Section 10 remain open, including the AC-16 thumbnail check, font licenses and the unrendered-prototype caveat. Product Owner approval was stated afterwards (see above). The Moderator and Product Owner roles are both held by Frank McGuire. The Tech Lead pre-review is still pending and is advisory.

### Atomic Design extension revision (2026-10-27)

- **Status:** Approved by the Moderator on 2026-10-28, after Product Owner review with conditions
- **Covers:** the classification line in 3.2, 3.3.1 to 3.3.4, 3.6, the pointer line in 4.1, 4.2, DS-061 to DS-066 in Section 6, the three notes under the Section 6 table, the six proposals added in Section 7, and Section 10.1 to 10.2. The approvals above cover the earlier revision (Gallery version 18) only and do not cover this one.
- **Product Owner review (2026-10-28):** Approve with conditions. Conditions 1 to 8 were text changes, applied by the Moderator; condition 1 was reworded to "any move is S-19, which is excluded (MD-4)" because the Product Owner's wording contradicted MD-4. Conditions A to C are carried to the Tech Lead as Step inputs: confirm `architecture.md` D-05 against 4.2, confirm the card title renders at h3, and add a QA check on rendered heading order in all four scopes (not covered by AC-8).
- **Moderator approval:** 2026-10-28, by Frank McGuire, as Moderator (AC-21 a).
- **Source:** product.md v0.6 (approved 2026-10-27): S-14, S-17, AC-21(a), AC-25, A-20, MD-4, MD-8, MD-10.
- **Designer:** Claude chatbot, Designer + Prototyper role, text-only.
- **Review order:** Product Owner reviews first, then the Moderator approves (A-21). The Moderator approves this document (AC-21 a) before the Tech Lead records the decomposition in `architecture.md` and `domain-language.md` (AC-21 b), and both before the first build Step.
- **Tech Lead feasibility pre-review:** Pending, advisory. Concerns are listed separately in 10.2.
- **Moderator input recorded 2026-10-27:** answers to the four design questions in 10.1 (option B as advisory input, caption for the code well outside CodeCraft Academy, section at the end of each panel, interactive card kept). This is input to the review, not approval.
- **Moderator decisions on proposals recorded 2026-10-27:** the organism specimens in 4.2 carry the existing Design IDs DS-030, DS-031 and DS-035 with the caption "Shows the state of DS-0xx" and no proposed ID of their own (Product Owner reading of AC-25); the code well follows gallery specimen data (the Moderator cites `architecture.md` D-05, which the Designer has not seen); the heading-level, accessible-name, classification-note and feasibility-note changes are applied. Nothing is approved.
- **Authority:** all classifications and the DS-061 to DS-066 rows are proposals. They become authoritative only after the Tech Lead ratifies, modifies or rejects each one (MD-8) and the Moderator approves.

Product Owner and Moderator approval are required before this spec becomes authoritative within its boundary. Tech Lead pre-review is advisory and does not transfer architecture authority. Approval of this spec does not make the prototype authoritative.

---

## DESIGN.md Policy

No separate `DESIGN.md` exists for this project. Brand token values are therefore recorded once, in Section 1 below. If a `DESIGN.md` is added later, move the catalogues there and reference it from here.

---

## Design Principles

- Clear
- Consistent
- Minimal
- Accessible

Project-specific: every brand fills the same semantic token names; only values differ (AC-1). A brand needing different structure is a documented variant, not a one-off.

---

## 1. Visual Identity

Brand status (from product.md 1.1): **ArtAnon Shop** is a real third-party business and this is an unofficial concept exploration with no affiliation or delivery claim; its logo and artwork are design inputs only and are not reproduced. Repository assets are palette values and a text wordmark. **IT English Mentor** is the Moderator's own new brand. **CodeCraft Academy** is a placeholder name.

### 1.0 Brand options considered (Moderator chose the recommended option for each brand)

| Brand | Option | Direction | Main trade-off |
|---|---|---|---|
| ArtAnon Shop | **A1 Gallery wall (chosen)** | Warm off-white ground, serif display, sharp corners, no shadows, airy spacing; logo blue as the only accent | Quiet; relies on the artwork for energy |
| | A2 Studio dark | Logo's dark umber as ground, ochre/orange accent | Closest to the logo plate, but dark ground competes with dark artwork |
| | A3 Resin glaze | Light, translucent layers, ochre/rose/teal glaze palette from the sample paintings | More expressive, but tints from sample work may clash with other artwork |
| IT English Mentor | **M1 Clean desk (chosen)** | Cool white, deep teal primary, amber as highlight only, soft elevation | Safe and professional, less distinctive |
| | M2 Textbook | Warm paper, navy ink, teal links, amber marker highlight, serif headings | More character, closer in feel to ArtAnon A1 |
| CodeCraft Academy | C1 Night terminal (first choice, superseded) | Dark navy, lime primary, cyan secondary, monospace display, compact | Lime was judged dated by the Moderator; replaced by C3 Dark below |
| | C2 Bright lab | Light ground, violet and lime, 2px borders, hard offset shadows | Distinct, but two of three brands would then be light |
| | **C3 Workshop ledger (current; shown as CodeCraft Academy Light and CodeCraft Academy Dark)** | Parchment ground, dark brown ink, rust-red primary, tan accent, hairline rules, serif display over mono labels, flat buttons, a notched top-right corner on cards and a rounded one on panels, no shadows. Ground, text and button colors are the ones sampled from a screenshot of the suggested site; type, shape and structure are original | Calm and editorial. The light mode is warm like ArtAnon Shop, so it relies on the rounded top-right corner, rust red and mono labels; one more font family (Spectral). The dark mode uses the same hues and shape on a warm dark-brown ground (allowed: product.md 5.1, only where a brand needs it) |

Reason for the chosen set: warm and sharp (ArtAnon), cool and rounded (Mentor), parchment, rust and a notched card corner (CodeCraft Light) or dark brown with terracotta (CodeCraft Dark) are separable at thumbnail size (AC-16, design intent; not yet verified by a reviewer).

CodeCraft Academy is shown as two modes of one brand: **CodeCraft Academy Light** (C3 Workshop ledger, the former "v2") and **CodeCraft Academy Dark**. The Dark mode shares the hue family (rust to terracotta, tan accent), fonts, spacing, hairline borders and the flat buttons and notched card corner with the Light mode and changes only the ground and the lightness of the colors. The first direction, C1 Night terminal (navy ground, lime and cyan), is no longer in the gallery because the Moderator judged the lime dated. deeppattern.ai was used as a suggestion for tone and color direction. At the Moderator's request, the Light mode's ground, text and button colors are the values sampled from a screenshot of the site: cream ground #F3EBDB, dark brown text #3B2E1E, rust-red button #A5372A, hairline #CBC1B2. The site's muted brown (#7A6A52) fails text contrast on the sunken ground (3.92:1) and on the page ground (4.42:1), so the Light mode uses a slightly darker muted brown (#6B5B45). Its logo, illustrations, copy, fonts and layout are not reproduced, and the type, shape, spacing and remaining colors are original.

Inputs: IT English Mentor takes only the portfolio's body typeface (Hanken Grotesk) and an echo of its teal (#63CDDC) and amber (#F5B14C), per product.md A-9. The raw teal fails contrast on light grounds (1.86:1 on white), so the primary is a darkened teal and the raw teal is not used.

### 1.1 Color Palette

Semantic token names are shared. Prefix in code is a Tech Lead decision; the prototype uses `--bu-color-*`.

| Token | ArtAnon Shop | IT English Mentor | CodeCraft Academy Light | CodeCraft Academy Dark | Role |
|---|---|---|---|---|---|
| bg | #FDFBF7 | #F5F9FA | #F3EBDB | #1C1611 | Page ground |
| surface | #FFFFFF | #FFFFFF | #FBF7EE | #271F18 | Card, input, nav |
| surface-sunken | #EFE8DB | #E6EEF1 | #E8DECA | #15100C | Image placeholder, skeleton |
| text | #2B2420 | #14232B | #3B2E1E | #F3EBDB | Body text |
| text-muted | #665A50 | #46606B | #6B5B45 | #B8AB94 | Helper and meta text |
| border | #DCD3C4 | #D3E0E5 | #CBC1B2 | #40362B | Decorative borders |
| border-strong | #857868 | #668491 | #8C7C64 | #8F8068 | Input boundary (3:1 required) |
| primary | #1E5FA0 | #0E7490 | #A5372A | #E2705A | Primary action, links, indicators |
| on-primary | #FFFFFF | #FFFFFF | #FBF7EE | #1C1611 | Text on primary |
| primary-hover | #174D85 | #0B5F77 | #8C2D22 | #EE8570 | Primary hover |
| primary-active | #103A66 | #084A5D | #73241B | #CF5F4A | Primary active |
| primary-tint | #E6EDF5 | #E1F1F5 | #EBDCCB | #3A241D | Secondary hover, nav hover |
| accent | #E0A93B | #F5B14C | #D4B483 | #D4B483 | Card tag fill |
| on-accent | #2B2420 | #1A1A1F | #3B2E1E | #1C1611 | Text on accent |
| focus | #1E5FA0 | #0E7490 | #3B2E1E | #F3EBDB | Focus ring |
| danger | #B3261E | #B42318 | #8C1D2C | #F2929B | Error text and border |
| disabled-bg | #ECE6DA | #E9EEF0 | #E6DDCB | #2A231B | Disabled fill |
| disabled-text | #8F8578 | #8196A0 | #9A8C76 | #7A6D5A | Disabled text (exempt from contrast) |

All text pairs the components use are at least 4.5:1 and all non-text pairs at least 3:1 in every brand and mode (20 pairs each, listed under DS-060 in the gallery). Smallest margins: Dark primary button label on its active shade 4.60:1; Mentor secondary text on hover tint 4.62:1 and Dark primary text on its tint 4.62:1; Mentor input border on background 3.76:1.

### 1.2 Typography

All families are open-license Google Fonts (shortcut list: open-license fonts only). License confirmation is an open question.

| Role | ArtAnon Shop | IT English Mentor | CodeCraft Academy (Light and Dark) |
|---|---|---|---|
| Display | Instrument Serif 400 | Hanken Grotesk 700 | Spectral 500 |
| Body | Work Sans 400, 16px | Hanken Grotesk 400, 16px | Sora 400, 15px |
| UI (buttons, labels, nav) | Work Sans 500, 16px, +0.02em | Hanken Grotesk 600, 16px | IBM Plex Mono 500, 14px, +0.02em |
| Mono (code samples) | system monospace, unused in the gallery | system monospace, unused in the gallery | IBM Plex Mono 400, 13px |
| Small | 14px | 14px | 13px |
| Title (card title, nav brand) | 28px | 20px | 22px |

Line height 1.3 for UI text and 1.15 for titles. No uppercase transform in any brand.

### 1.3 Spacing & Layout System

| Token | ArtAnon Shop (airy) | IT English Mentor (regular) | CodeCraft Academy (Light and Dark) |
|---|---|---|---|
| space-1 | 4 | 4 | 4 |
| space-2 | 8 | 8 | 8 |
| space-3 | 16 | 12 | 12 |
| space-4 | 24 | 16 | 16 |
| space-5 | 32 | 24 | 24 |
| space-6 | 48 | 32 | 40 |

Minimum control height is 44px in every brand. Button horizontal padding is space-5.

### 1.4 Borders, Radius & Elevation

| Token | ArtAnon Shop | IT English Mentor | CodeCraft Academy (Light and Dark) |
|---|---|---|---|
| radius-control | 2px | 8px | 0px |
| radius-card | 2px | 12px | 0px |
| radius-round | 9999px | 9999px | 9999px |
| radius-tr-control (top-right only) | 2px | 8px | 0px |
| radius-tr-card (top-right only) | 2px | 12px | 16px |
| radius-tr-panel (top-right only) | 0px | 0px | 32px |
| corner-shape-card (top-right) | round | round | bevel |
| border width | 1px | 1px | 1px |
| indicator width | 3px | 3px | 2px |
| focus ring width / offset | 2px / 2px | 3px / 2px | 2px / 2px |
| elevation-card | none | 0 1px 2px / 0 2px 8px, low alpha | none |
| elevation-raised | none (border darkens instead) | 0 2px 4px / 0 8px 24px | none |

The top-right radius and card-shape tokens exist in every brand. In ArtAnon Shop and IT English Mentor the radius equals the normal radius and the shape is `round`, so those brands look as before. CodeCraft Academy keeps square corners everywhere except two top-right corners: the card's is notched (cut diagonally, 16px, `corner-shape: bevel`) and the gallery panel's is rounded (32px). Buttons are flat. Browsers without CSS `corner-shape` show the card corner rounded at the same 16px.

### 1.5 Tone & Personality

- **ArtAnon Shop:** modern, artistic, minimal. The ground stays quiet so artwork of any palette leads. Serif display, sharp corners, no shadow.
- **IT English Mentor:** professional, educational, clean. Cool and rounded, soft depth, amber only as a highlight.
- **CodeCraft Academy:** craftsman and tech-savvy, calm and text-led. Serif display over mono labels, rust action color, flat buttons, notched cards. Light mode on parchment; dark mode on warm dark brown with terracotta.

### 1.6 CodeCraft Academy Light and Dark (C3 Workshop ledger)

Same semantic token names as every other brand; only values differ. Light and Dark are modes of one brand: they share the type, spacing, shape, border widths and the hue family, and differ in ground and in the lightness of the colors.

| Token | Light | Dark |
|---|---|---|
| bg | #F3EBDB | #1C1611 |
| surface | #FBF7EE | #271F18 |
| surface-sunken | #E8DECA | #15100C |
| text | #3B2E1E | #F3EBDB |
| text-muted | #6B5B45 | #B8AB94 |
| border | #CBC1B2 | #40362B |
| border-strong | #8C7C64 | #8F8068 |
| primary | #A5372A | #E2705A |
| on-primary | #FBF7EE | #1C1611 |
| primary-hover | #8C2D22 | #EE8570 |
| primary-active | #73241B | #CF5F4A |
| primary-tint | #EBDCCB | #3A241D |
| accent | #D4B483 | #D4B483 |
| on-accent | #3B2E1E | #1C1611 |
| focus | #3B2E1E | #F3EBDB |
| danger | #8C1D2C | #F2929B |
| disabled-bg | #E6DDCB | #2A231B |
| disabled-text | #9A8C76 | #7A6D5A |

- **Type:** display Spectral 500 (22px titles), body Sora 400 (15px), UI and code IBM Plex Mono 500 and 400 (14px and 13px), UI letter-spacing +0.02em.
- **Space:** 4, 8, 12, 16, 24, 40.
- **Shape:** square corners everywhere except the top-right corner of cards, which is notched (16px bevel), and of the gallery panel, which is rounded (32px). Buttons are flat: no radius and no notch. Inputs and navigation stay square; 1px hairline borders; 2px indicator and focus ring (2px offset); no elevation, so interactive hover changes the border only.
- **Tone:** calm, text-led, craftsman. Light: parchment ground, brown ink, rust red for action, tan for tags, dark brown focus ring. Dark: warm dark-brown ground, cream text, terracotta action, tan tags, cream focus ring. Mono is kept for labels and code samples.
- **Dark mode choices:** primary is a lighter terracotta (#E2705A) so it reads on the dark ground. Hover is lighter (#EE8570) and active is a deeper shade (#CF5F4A); the button label is the dark ground color in every state. The danger color is a light rose (#F2929B) so errors stay distinct from the terracotta action.
- **Contrast:** all 20 token pairs pass in both modes. Light: lowest text margin is secondary-button text on its hover tint at 4.92:1; lowest non-text margin is the input border on background at 3.42:1. Dark: lowest text margins are the primary button label on its active shade at 4.60:1 and primary text on its tint at 4.62:1; lowest non-text margin is the input border on surface at 4.21:1.
- **Distinction:** the Light mode is warm like ArtAnon Shop, so it relies on rust red against blue, the notched card corner, mono labels and the serif display for separation. ArtAnon Shop's ground was also lightened (#FAF6EE to #FDFBF7) to widen the gap. Not yet checked by a reviewer (AC-16).
- **Error versus action:** in both modes the danger color is close in hue to primary; errors are identified by icon and message text, never by color alone.
- **Scope note:** general dark mode (a theme switch for every brand) stays out of scope. The Dark mode here is a visual variant of one brand, selected like any other brand.
- All Design IDs DS-001 to DS-060 apply to both modes in the gallery.

---

## 2. Accessibility Baseline

- WCAG 2.2 level AA (product.md A-3).
- Text contrast at least 4.5:1 (3:1 for large text); non-text UI contrast at least 3:1 for every token pair the components use, in every brand (AC-7).
- Keyboard-only operation for every interactive component; visible focus indicator at least 3:1 against what it sits on, in every brand (AC-6).
- Real elements: `button`, `a href`, `input` with `label`, `nav` with an accessible name. Error state uses `aria-invalid` and `aria-describedby`, and shows an icon and text, never color alone.
- Loading: `aria-busy="true"` on the button or card; the button stays focusable.
- Touch and click targets at least 44px high.
- Animation (spinner, skeleton pulse) is disabled under `prefers-reduced-motion`.
- Disabled controls are exempt from contrast requirements but remain legible.

---

## 3. Component Library

States use the Product vocabulary: default, hover, active, focus, disabled, loading, empty, error. A state that does not apply is listed as not applicable with the reason. The `data-testid` convention follows the template: `{{feature}}-{{component}}-{{element}}-{{modifier?}}`, for example `gallery-button-primary-hover`.

### 3.1 Button

- **Purpose:** triggers an action.
- **States:** default (DS-010), hover (DS-011), active (DS-012), focus (DS-013), disabled (DS-014), loading (DS-015). Empty and error: not applicable.
- **Variants:** primary (filled), secondary (outlined, transparent fill).
- **Behavior:** loading keeps the label, adds a spinner before it, keeps focus, and ignores activation. Long label: see DS-050.
- **data-testid:** `gallery-button-{variant}-{state}`

### 3.2 Text input

- **Purpose:** single-line text entry with a label, helper text and an error message.
- **States:** default/empty (DS-020), hover (DS-021), focus (DS-022), filled (DS-023), error (DS-024), disabled (DS-025). Active and loading: not applicable.
- **Variants:** none in this spike.
- **Behavior:** the label is always visible above the field; placeholder is a hint, not the label. Error replaces helper text with an icon and message. Focus draws a ring in the focus token.
- **data-testid:** `gallery-input-{element}-{state}` (element: field, label, help, error)
- **Atomic classification (advisory):** molecule, see 3.6. The `gallery-input-` prefix above and the word "Input" in the names of DS-020 to DS-025 are names, not a level. No existing name changes.

### 3.3 Card

- **Purpose:** groups an image area, title, text and meta line.
- **States:** static (DS-030); interactive default (DS-031), hover (DS-032), focus (DS-033), active (DS-034); loading skeleton (DS-035). Disabled, empty and error: not applicable in this spike.
- **Variants:** static, interactive.
- **Behavior:** an interactive card has one link on its title whose hit area stretches over the whole card, so the card is one tab stop. Hover raises the card (border darkens; shadow where the brand has one). The image area shows a labelled placeholder and a "Sample" tag in the accent color. The meta line carries brand-specific placeholder fields; for ArtAnon Shop it reads SKU, size and price ([SKU], [SIZE], [PRICE]) so every artwork card shows its SKU. CodeCraft Academy cards also show a short code sample in the mono type token, in a bordered well on the page-ground color (text 16.03:1 on it, the existing text/bg pair); the sample wraps and never scrolls.
- **data-testid:** `gallery-card-{element}-{state}`

#### 3.3.1 Visual parts (Atomic Design revision)

The card's visible parts, named in design language. These are not component names; the Tech Lead decides the technical decomposition (MD-8). The states, variants and Design IDs above are unchanged.

| Part | What a reviewer sees | Shown by | Own state beyond the card's |
|---|---|---|---|
| Shell | Bordered, rounded, elevated surface (CodeCraft Academy: notched top-right corner). Interactive cards raise on hover and show the focus ring around the whole card | DS-030 to DS-035 | None. Hover, focus and active are the card's states, drawn on the shell |
| Media area | A 4:3 sunken block holding a labelled placeholder, never a real image. It holds the media label and the Tag | DS-030 to DS-034 | None |
| Media label | Optional short text at the top of the media area | DS-030 to DS-034 | None |
| Tag | Accent-colored pill at the bottom of the media area, reading "Sample" in the spec's sample content | DS-030 to DS-034 | None |
| Title | Display-type heading, level 3. On an interactive card it carries the card's single link, whose hit area covers the whole card | DS-030 to DS-034 (link on DS-031 to DS-034 only) | None. Its focus is drawn as the card's focus ring (DS-033) |
| Description | Optional paragraph | DS-030 to DS-034 wherever the sample content supplies it | None |
| Code well | Optional bordered monospace block on the page-ground color. The consumer supplies the content; the part itself does not change with the active scope | DS-030 to DS-034 in the CodeCraft Academy scopes | None |
| Meta line | Optional muted small line of placeholder fields (ArtAnon Shop: [SKU] · [SIZE] · [PRICE]) | DS-030 to DS-034 wherever supplied | None |
| Loading skeleton | A media-sized block, a title bar at 60% width and two text lines at 100% and 40%. Non-interactive, no link | DS-035 | The pulse, which stops under reduced motion (Section 2). The screen-reader text "Loading" and the busy state belong to the loading card, not to this part |

Hover raise, focus ring and active styling are not parts. They are states of the shell and title, specified in DS-032 to DS-034.

#### 3.3.2 Classification (proposed, advisory)

Levels follow Atomic Design (Brad Frost, https://atomicdesign.bradfrost.com/): an atom is a basic building block, a molecule is a small group of atoms that works as one unit, and an organism is a distinct section built from molecules and atoms. The table shows the recommended slicing, option B in 3.3.3. It is advisory until the Tech Lead ratifies it and the Moderator approves it (MD-8, AC-21).

"Stays part of its parent?" asks whether the part is used anywhere in this spec outside its parent. None is, so the answer is Yes throughout; the note names the strongest case for reuse.

| Part | Proposed level | Reason | Independent behavior or states? | Stays part of its parent? |
|---|---|---|---|---|
| Card (whole) | Organism | Composes one molecule (media area), atoms and plain text parts into a distinct section. It owns the only link, the one tab stop and every card state | Yes: link, tab stop, hover, focus, active, loading (DS-030 to DS-035) | It has no parent here. Other libraries often call a card a molecule; organism is used because it composes a molecule and owns interactive behavior |
| Media area | Molecule | Combines the sunken 4:3 surface, the optional media label and the Tag into one unit | No | Yes. Only the card uses it. A future teaser or hero (S-10, out of scope) could reuse it, which is the reason to keep it a unit |
| Tag | Atom | One pill with one text and the accent and on-accent pair; it cannot be broken down further | No | Yes, inside the media area. Reuse is plausible but not specified |
| Skeleton block | Atom | One sunken-surface block with the pulse. It is the smallest placeholder shape and is used four times in the loading card | The pulse only. It is an animation, not a component state, and stops under reduced motion | Yes, inside the loading skeleton |
| Code well | Atom | One bordered monospace block with consumer-supplied content and one token set | No | Yes, inside the card. Weakest atom candidate: only CodeCraft Academy cards show it. It is kept because it is the one part whose content comes from the consumer |
| Loading skeleton | Molecule | Four skeleton blocks arranged to mirror the card: media, title bar, two text lines | No. The "Loading" text, the busy state and the absence of a link belong to the loading card | Yes. Weakest molecule candidate: it exists only for the card's loading state |

#### 3.3.3 Classification options (options depth)

Three ways to slice the card. All three keep the card an organism and keep the behavior contract of AC-20: no second link and no second tab stop.

| | A. Coarse | B. Medium (recommended) | C. Fine |
|---|---|---|---|
| Atoms | Tag | Tag, Skeleton block, Code well | Tag, Media label, Skeleton block, Title, Description, Code well, Meta line |
| Molecules | Media area | Media area, Loading skeleton | Media area, Text group (title and description), Card footer (code well and meta line), Loading skeleton |
| Organism | Card | Card | Card |
| Easier to review in the gallery | All three levels exist with the fewest specimens. A reviewer sees what an atom, a molecule and an organism are | Each reusable visual unit on its own, and where it is reused: Tag inside the media area, Skeleton block four times inside the loading skeleton, the consumer-supplied Code well | A complete inventory of every visible element |
| Over-decomposition risk | Low. The cost is the opposite: the four skeleton shapes and the code well stay unnamed inside the card | Low to medium. The loading skeleton exists for one state only, and the Code well appears in one scope | High. Media label, Description and Meta line are single styled text elements. Text group and Card footer exist only to group. A Title as its own part invites a second link or tab stop, which AC-20 forbids |
| If the Tech Lead chooses it | DS-063, DS-064 and DS-066 are withdrawn, not renumbered | DS-061 to DS-066 stand as proposed | The Designer re-cuts the rows; new IDs continue after DS-066 |

**Recommendation: B.** A leaves the repeated skeleton shapes and the consumer-supplied code well unexplained. C turns styled text into parts. B stops where each part is repeated or reused (Tag, Skeleton block), composed of smaller parts (Media area, Loading skeleton), or distinct in token pair or content source (Tag, Code well). A single styled text element that meets none of these stays unsplit.

#### 3.3.4 Not-split list (advisory)

What should not become its own part, so the Tech Lead and Moderator can see where this design stops.

| Item | Reason it is not split |
|---|---|
| Shell (border, radius, elevation, notched top-right corner) | It is the organism's own surface, styled by tokens. A separate part would have nothing inside it |
| Title | The stretched link depends on the card surface. A separate part invites a second link or tab stop (AC-20). It is a heading with one link, not a reusable unit |
| Description | A styled paragraph with no behavior and no composition |
| Meta line | A styled small line of text. The separators are content, not parts |
| Media label | A single styled text element inside the media area |
| Placeholder surface of the media area | The sunken 4:3 block is the surface of the media area molecule and has no use of its own |
| Hover raise, focus ring, active styling | States of the shell and title (DS-032 to DS-034), not parts |
| Stretched link hit area | Behavior of the title and the shell together, not a visual part |
| "Loading" screen-reader text and busy state | Behavior of the loading card (Section 2), not part of the loading skeleton |
| Text group and Card footer (option C groupings) | They exist only to group other parts |

### 3.4 Navigation bar

- **Purpose:** primary site navigation with a wordmark and a list of links.
- **States (per item):** default (DS-040), hover (DS-041), current page (DS-042), focus (DS-043), disabled (DS-044). Narrow width layout (DS-045).
- **Variants:** none in this spike.
- **Behavior:** the current page is marked with `aria-current="page"` and a 3px indicator in the primary color. At narrow widths the bar wraps onto further rows; there is no collapsed menu. Long label: see DS-051.
- **data-testid:** `gallery-nav-{element}-{state}`

### 3.5 Long-label rule (S-5, AC-10)

- **Button (DS-050):** the label wraps, balanced, and the button grows in height; it never truncates and never exceeds its container. Words are hyphenated at syllable breaks where the browser has hyphenation for the page language (English); a word is split only when it cannot fit on a line of its own.
- **Navigation item (DS-051):** the label wraps to two lines, then truncates with an ellipsis. The full text stays in the page as the link's accessible name and is repeated as a tooltip. Items are at most 16rem wide.
- Test labels per brand are in the gallery under "Long label", at full width, 280px, 180px and 360px.

### 3.6 Atomic classification of Button, text input and navigation bar (proposed, advisory)

Classified now; any move is S-19, which is excluded (MD-4), so nothing moves here and no behavior, state or Design ID changes. The Tech Lead decides; the Moderator approves.

| Component | Proposed level | Reasoning |
|---|---|---|
| Button | Atom | One native control with a label and, while loading, a spinner. It composes no other library component, and its states (DS-010 to DS-015) belong to it alone. The spinner is part of the Button, not a separate part |
| Text input | Molecule | See below |
| Navigation bar | Molecule (organism is defensible; medium confidence) | Composes a wordmark and a group of navigation items under one landmark. It contains no molecule of its own and has no search, actions or further sections, so molecule is the closer fit. If it later gains those, organism fits. A navigation item on its own would be an atom, but its states depend on the bar (current page, long-label clamp), so no separate part is proposed |

**Text input is a molecule, not an atom.** In Atomic Design terms the bare field is the atom. This component bundles a label, the field, help text and an error message, and a label paired with a field is the textbook form-field molecule. The error message replaces the help text inside the same unit, which supports treating it as one molecule rather than separate parts.

What this means for the vocabulary:

- Say "text input (molecule)" and not "input atom". In everyday speech "input" suggests the atom.
- The names field, label, help and error in the 3.2 `data-testid` convention are the molecule's internal elements. They are not proposed as separate parts, because the text input is not decomposed in this extension (MD-4; S-19 excluded).
- The three level names mean the same thing wherever they are used. A later decision on S-19 would apply this vocabulary, not change it.

---

## 4. Screen Layouts

### 4.1 Gallery (single page)

- **Header (sticky):** title, brand switcher (ArtAnon Shop, IT English Mentor, CodeCraft Academy Light, CodeCraft Academy Dark, All brands), "Design IDs" checkbox (DS-004), and a status note (DS-005).
- **Body:** one panel per brand shown (one panel, or three in "All brands"). Each panel is painted with that brand's ground and tokens and contains, in order: Tokens (color, type, space/radius/elevation), Button, Text input, Card, Navigation bar, Long label, Contrast evidence.
- **Card structure (Atomic Design revision, proposed):** one added section at the end of each panel, after Contrast evidence, so existing sections keep their positions (Moderator decision, 2026-10-27). See 4.2.
- **State grids:** each component shows its states side by side in a wrapping grid; each state has a caption and, when Design IDs are on, its Design ID badge.
- **Responsive:** grids wrap to one column on a phone; below 640px the panels lose side padding and the contrast list stacks. The header wraps.
- **Empty, loading, error:** not applicable to the gallery itself.

### 4.2 Card structure view (Atomic Design revision, proposed; S-17, AC-25)

- **Ownership:** gallery-owned presentation, not library API. The view itself adds no token, no component of its own and no card state, and changes no existing Design ID. It reuses the existing state-grid pattern, caption style and Design ID badges (S-9). It is specified for the recommended option B (3.3.3); if the Tech Lead ratifies a different slicing, the specimens change as 3.3.3 describes.
- **What a reviewer sees:** a section titled "Card structure" with three labelled groups in this order: Atoms, Molecules, Organism. Each part is shown on its own, and each caption gives the part name and its level. Molecule and organism captions add "Built from:" with the parts and their levels, so a reviewer can follow how parts compose into the card.

| Group | Specimen | Design ID | Shows | Caption "Built from" |
|---|---|---|---|---|
| Atoms | Tag | DS-062 | The pill alone, reading "Sample" | none |
| Atoms | Skeleton block | DS-063 | One block with the pulse | none |
| Atoms | Code well | DS-064 | The well with the card's sample code text, where the scope's sample data supplies one (today the CodeCraft Academy scopes) | none |
| Molecules | Media area | DS-065 | The sunken 4:3 surface with its label and Tag, as in the card | Tag (atom), media label text |
| Molecules | Loading skeleton | DS-066 | Four skeleton blocks in the loading-card arrangement | Skeleton block, four times (atom) |
| Organism | Card, static | DS-030 (existing) | The static card. Caption: "Shows the state of DS-030" | Media area (molecule), title, description, meta line, code well (atom, where the sample data supplies one) |
| Organism | Card, interactive default | DS-031 (existing) | The interactive card. Caption: "Shows the state of DS-031" | Same parts as the static card |
| Organism | Card, loading | DS-035 (existing) | The loading card. Caption: "Shows the state of DS-035" | Loading skeleton (molecule) |

- **Section shell (DS-061):** the "Card structure" heading, the three group labels and the caption pattern. When Design IDs are on, its badge sits beside the heading.
- **Design IDs of the organism specimens:** each carries the existing Design ID of the state it shows (DS-030 static, DS-031 interactive default, DS-035 loading) and the caption "Shows the state of DS-0xx". No new ID is proposed for them. The state's definition, and any change to it, stays with the existing ID; the Card section and this section are two appearances of the same state.
- **Placement and scopes:** inside each scope's panel, as the last section, after Contrast evidence (Moderator decision, 2026-10-27). With a single scope selected the section appears once. In "All brands" it appears once in each of the four stacked panels, painted with that scope's tokens. Structure never changes between scopes; only token values do. The brand scope switcher, the Design IDs checkbox and the no-reload switching of 4.1 and Section 5 apply unchanged.
- **Code well and sample data:** the optional code sample in a card comes from the sample content supplied for each scope, not from which brand is active (Tech Lead to confirm against `architecture.md` D-05). Where a scope's sample card supplies a code sample (today the CodeCraft Academy scopes), the DS-064 specimen shows the well. Where it does not (today ArtAnon Shop and IT English Mentor), the slot shows the one-line caption "Not used in this scope", which keeps the DS-064 badge. The sections, groups, specimen slots, order, Design IDs and test IDs are identical in every scope; only the content of this one slot follows the sample data, and no component structure depends on the active scope. This adds no new visual and no new token pair (Moderator decision, 2026-10-27; see 10.1).
- **States shown:** only existing states, as in the table: static, interactive default and loading for the organism, the single default appearance for every other part. Hover, focus and active are not repeated here; they stay in the Card section (DS-032 to DS-034), and each organism caption points there. No part has a state of its own (3.3.1) except the Skeleton block's pulse.
- **Responsive:** the groups wrap to one column on a phone, as in 4.1. Specimens never exceed their container, and below 640px the panel padding follows 4.1.
- **Accessibility and reading order:**
  - Reading order and tab order follow the document order: Atoms, Molecules, Organism, each from small to large, left to right and then top to bottom. The section is the last in the panel, after Contrast evidence.
  - The three group labels are labelled groups with the group name as accessible name, not headings. The card title stays at level 3 inside the organism specimens, so the section does not disturb heading order.
  - The level is stated in caption text, never by color alone.
  - The only focusable specimen is the interactive card specimen (shows DS-031): one native link on its title and one tab stop, as in DS-031, with the focus ring of DS-033. Static and loading specimens, and every atom and molecule specimen, have no link and no tab stop.
  - The isolated Skeleton block and Loading skeleton specimens (DS-063, DS-066) are decorative shapes and are hidden from assistive technology; their captions name them. Only the loading card specimen (shows DS-035) exposes the busy state and the "Loading" text, as in DS-035. This is design intent, not verified. That specimen is a second loading card in the panel, so each scope has two loading cards, one in the Card section and one here. That is the card's own behavior shown twice; the isolated specimens add no further "Loading" status.
  - Captions use the existing state-caption style and text pairs, the Tag uses the accent and on-accent pair, and no new token pair is introduced (AC-7).
  - The pulse stops under reduced motion in DS-063, DS-066 and the loading card specimen (Section 2).
  - Heading level: the "Card structure" heading is at the same level as the other component section headings (Button, Text input, Card and the rest). The card titles in the organism specimens are level 3, as in the Card section, so this section adds no heading-level skip that the Card section does not already have. This spec does not fix the absolute levels of the existing headings; this is parity with them.
  - Accessible names: the section is named by its heading, as the other sections are. The three groups are each named by their group name (Atoms, Molecules, Organism). Each specimen is associated with its caption. The interactive card's link is named by the card title, as in DS-031. In "All brands" the group names repeat once per scope panel, as section names already do.
- **data-testid:** `gallery-structure-{part}-{state}`, one scope per panel as for the other sections. Parts: section, tag, skeleton-block, code-well, media-area, loading-skeleton, card. States use the existing names (default, loading, static, interactive-default).

| Design ID | data-testid |
|---|---|
| DS-061 | `gallery-structure-section-default`; group containers use `gallery-structure-group-{level}` (atoms, molecules, organism), a container extension with no state |
| DS-062 | `gallery-structure-tag-default` |
| DS-063 | `gallery-structure-skeleton-block-loading` |
| DS-064 | `gallery-structure-code-well-default` |
| DS-065 | `gallery-structure-media-area-default` |
| DS-066 | `gallery-structure-loading-skeleton-loading` |
| DS-030 (specimen in this view) | `gallery-structure-card-static` |
| DS-031 (specimen in this view) | `gallery-structure-card-interactive-default` |
| DS-035 (specimen in this view) | `gallery-structure-card-loading` |

- **Not in this view:** Button, text input and navigation bar specimens. By Moderator direction in this session they are classified in the text only (3.6). Also excluded: new states, real images and any new library component.

---

## 5. Interaction Patterns

- **Brand switch:** buttons with `aria-pressed`. Activation restyles every component immediately, with no reload (AC-2). The initial brand is ArtAnon Shop. Remembering the choice across visits is not designed.
- **Hover / focus / active:** shown in the gallery by forced-state classes so a reviewer sees them without interacting; the real pseudo-classes behave the same.
- **Keyboard:** Tab and Shift+Tab move through buttons, inputs, card links and nav links in reading order. Enter activates links and buttons; Space activates buttons. Focus is always visible.
- **Transitions:** none beyond the loading spinner and skeleton pulse (both off under reduced motion).

---

## 6. Design Traceability

Product requirement IDs are the S- (scope) and AC- (acceptance criteria) IDs from product.md; it has no R- numbers. Prototype evidence is a section of `mod-w/design/project/Main.dc.html`.

| Design ID | Design element | Product requirement | Prototype evidence | First implementation Step | Notes |
| --------- | -------------- | ------------------- | ------------------ | ------------------------- | ----- |
| DS-001 | Color tokens, three brands | S-1, S-8, AC-1, AC-13, AC-14 | Gallery > Tokens > Color | TBD | |
| DS-002 | Type tokens | S-1, S-8, AC-1 | Gallery > Tokens > Type | TBD | Font licenses open |
| DS-003 | Space, radius, elevation tokens | S-1, S-8, AC-1 | Gallery > Tokens > Space, radius, elevation | TBD | |
| DS-004 | Brand switcher | S-2, S-4, AC-2 | Gallery header | TBD | |
| DS-005 | Gallery shell, Design ID display, status note | S-4, S-9, AC-5, AC-15, AC-12 | Gallery header and panels | TBD | |
| DS-010 | Button default | S-3, AC-4, AC-5 | Gallery > Button | TBD | Primary and secondary |
| DS-011 | Button hover | S-3, AC-5 | Gallery > Button | TBD | |
| DS-012 | Button active | S-3, AC-5 | Gallery > Button | TBD | |
| DS-013 | Button focus | S-3, S-6, AC-6 | Gallery > Button | TBD | Ring 3:1 in all brands |
| DS-014 | Button disabled | S-3, AC-5 | Gallery > Button | TBD | |
| DS-015 | Button loading | S-3, AC-5 | Gallery > Button | TBD | |
| DS-020 | Input default | S-3, AC-4, AC-5 | Gallery > Text input | TBD | |
| DS-021 | Input hover | S-3, AC-5 | Gallery > Text input | TBD | |
| DS-022 | Input focus | S-3, S-6, AC-6 | Gallery > Text input | TBD | |
| DS-023 | Input filled | S-3, AC-5 | Gallery > Text input | TBD | |
| DS-024 | Input error | S-3, S-6, AC-5 | Gallery > Text input | TBD | Icon plus text |
| DS-025 | Input disabled | S-3, AC-5 | Gallery > Text input | TBD | |
| DS-030 | Card static | S-3, AC-4, AC-5 | Gallery > Card | TBD | |
| DS-031 | Card interactive default | S-3, AC-5, AC-6 | Gallery > Card | TBD | |
| DS-032 | Card interactive hover | S-3, AC-5 | Gallery > Card | TBD | |
| DS-033 | Card interactive focus | S-3, S-6, AC-6 | Gallery > Card | TBD | |
| DS-034 | Card interactive active | S-3, AC-5 | Gallery > Card | TBD | |
| DS-035 | Card loading skeleton | S-3, AC-5 | Gallery > Card | TBD | |
| DS-040 | Nav item default; working sample | S-3, AC-4, AC-5, AC-6 | Gallery > Navigation bar | TBD | |
| DS-041 | Nav item hover | S-3, AC-5 | Gallery > Navigation bar | TBD | |
| DS-042 | Nav item current page | S-3, AC-5 | Gallery > Navigation bar | TBD | |
| DS-043 | Nav item focus | S-3, S-6, AC-6 | Gallery > Navigation bar | TBD | |
| DS-044 | Nav item disabled | S-3, AC-5 | Gallery > Navigation bar | TBD | |
| DS-045 | Nav narrow-width layout | S-3, AC-5 | Gallery > Navigation bar | TBD | Wraps; no collapsed menu |
| DS-050 | Button long-label rule | S-5, AC-10 | Gallery > Long label | TBD | Wrap and grow |
| DS-051 | Nav long-label rule | S-5, AC-10 | Gallery > Long label | TBD | Two lines then ellipsis |
| DS-060 | Contrast evidence per brand | S-6, AC-7 | Gallery > Contrast evidence | TBD | Computed ratios; real check is a test |
| DS-061 | Card structure section: heading, group labels, caption pattern | S-17, AC-25 | None (text-only session, MD-10) | TBD | Proposed. Gallery-owned; see 4.2 |
| DS-062 | Structure view: Tag specimen (atom) | S-17, AC-25 | None (text-only session, MD-10) | TBD | Proposed |
| DS-063 | Structure view: Skeleton block specimen (atom) | S-17, AC-25 | None (text-only session, MD-10) | TBD | Proposed. Decorative; pulse off under reduced motion |
| DS-064 | Structure view: Code well specimen (atom) | S-17, AC-25 | None (text-only session, MD-10) | TBD | Proposed. CodeCraft Academy scopes; caption only elsewhere (10.1) |
| DS-065 | Structure view: Media area specimen (molecule) | S-17, AC-25 | None (text-only session, MD-10) | TBD | Proposed |
| DS-066 | Structure view: Loading skeleton specimen (molecule) | S-17, AC-25 | None (text-only session, MD-10) | TBD | Proposed. Decorative; weakest molecule candidate (3.3.2) |

DS-061 to DS-066 are Proposed until the Tech Lead ratifies the decomposition and the Moderator approves them. They add no state. Withdrawn IDs are not renumbered or reused.

The organism specimens in 4.2 are further appearances of DS-030, DS-031 and DS-035 and carry those IDs, with the caption "Shows the state of DS-0xx". They also serve S-17 and AC-25. The rows above are unchanged and no new ID is proposed for them.

DS-020 to DS-025 name states of the text input, which is classified as a molecule (3.6). Their names are unchanged, and "Input" in them implies no level.

Not designed (cut or Could): S-10 alert and teaser/hero, S-11 About panel, S-12 CMS page, S-13 deployment.

---

## 7. Domain Language Proposals

| Proposed term | Form (type / value / both) | Definition | Rationale | First appearance |
| ------------- | -------------------------- | ---------- | --------- | ---------------- |
| Brand | both | One of the visual identities (ArtAnon Shop, IT English Mentor, CodeCraft Academy in its Light and Dark modes) that the shared components can be switched between | Used in every Product requirement | product.md 4 |
| Semantic token | type | A named design value (for example `primary`) that every brand fills with its own value | AC-1 depends on shared names | This spec, 1.1 |
| On-color token | type | A semantic token for the text or icon color placed on a fill, such as `on-primary` | Keeps contrast pairs explicit | This spec, 1.1 |
| Long-label case | value | The test of a very long label on button and navigation item in every brand | S-5, A-4 | product.md S-5 |
| Design ID | type | Stable ID (`DS-nnn`) for a designed element or state | MOD-W traceability, S-9 | This spec, 6 |
| Forced state | type | A gallery-only way to show hover, active or focus without interaction | The gallery must show all states (AC-5) | Prototype |
| Atom | value | The lowest classification level: a basic building block that cannot usefully be broken down further, such as the Tag. One of three levels, as used for this project | Gives S-14 and S-17 a shared, closed vocabulary (Brad Frost, Atomic Design) | This spec, 3.3.2 |
| Molecule | value | The middle level: a small group of atoms that works as one unit, such as the media area. The text input is classified here (3.6) | Same as Atom | This spec, 3.3.2 |
| Organism | value | The top level: a distinct section built from molecules and atoms that owns its own behavior. The card is classified here | Same as Atom | This spec, 3.3.2 |
| Visual part | type | A named, visible piece of a component described in design language. It is not a component name and implies no technical decomposition | Keeps the Designer's proposals separate from the Tech Lead's component names (MD-8) | This spec, 3.3.1 |
| Structure view | type | The gallery-owned section that shows a component's atoms, molecules and organism with their Design IDs. Not library API | S-17 and AC-25 need one name for the surface | This spec, 4.2 |
| Not-split list | type | The advisory list of items that should not become their own part, each with a reason | S-14 and MD-8 require it | This spec, 3.3.4 |

---

## 8. Scope Rules

- Only define components required for current or near-term Steps
- Do not design beyond approved PRODUCT scope
- Each in-scope screen, major component, and significant interaction must have a Design ID and Product requirement mapping
- When `roadmap.md` exists, connect Design IDs to the first implementation Step

---

## 9. UI Scope Rules

- Only implement UI elements in current `step-xx.md`
- Future states must not be implemented early
- Design supports incremental delivery

---

## 10. Open Questions

| Question | Owner | Status |
| -------- | ----- | ------ |
| The prototype was never opened in a browser or run through an accessibility scan by the Designer; contrast ratios are computed from the token values, not measured on screen. Can the Moderator or Tech Lead confirm the rendering? | Moderator | Open |
| Confirm the license terms of Instrument Serif, Work Sans, Hanken Grotesk, IBM Plex Mono, Sora and Spectral for a public repository and gallery use. | Moderator | Open |
| The gallery uses six font families in total (Spectral added for CodeCraft Academy). Is that acceptable for the gallery's load cost, or should one be dropped? | Tech Lead | Open |
| CodeCraft Academy Light is warm like ArtAnon Shop in ground color. Is the difference (rust red against blue, the notched card corner, mono labels, serif display) enough for the thumbnail test AC-16, or should the Light mode move away from cream? | Moderator | Open |
| CodeCraft Academy is now a Light and Dark pair of one brand (C3). Should the library treat the Dark mode as a second brand scope (as in the prototype) or as a mode of the same brand? That choice decides whether tokens are one set with two value sets or two full sets. | Tech Lead | Open |
| Mentor secondary-button text on its hover tint is 4.62:1, close to the 4.5:1 limit. Accept, or darken the tint? | Product Owner | Open |
| Narrow navigation wraps instead of collapsing to a menu. Accept for this spike? | Product Owner | Open |
| Focus ring uses the primary color in ArtAnon Shop and IT English Mentor. Accept, or give the ring its own color? | Moderator | Open |
| The "Sample" card tag and bracketed placeholders ([PRICE], [SIZE], etc.) are intentional sample content. Confirm wording. | Product Owner | Open |

### 10.1 Atomic Design revision: design questions (2026-10-27)

| Question | Owner | Status |
| -------- | ----- | ------ |
| Recommended option B includes the loading skeleton as a molecule, the weakest candidate (3.3.2). Accept option B, or prefer the coarser option A or the finer option C (3.3.3)? The Tech Lead decides the decomposition; this is the Moderator's view of the design. | Moderator | Answered by the Moderator 2026-10-27: option B accepted as advisory input; the Tech Lead decides the real decomposition |
| Code well in the ArtAnon Shop and IT English Mentor scopes: show the caption "Not used in this scope" (recommended, no new visual), or render the well there with the system monospace type, which would be its first visible use in those scopes? | Moderator | Answered by the Moderator 2026-10-27: keep the caption; no new visible element in those scopes |
| Place the Card structure section directly after Card (proposed, next to what it explains) or at the end of each panel after Contrast evidence? | Product Owner | Answered by the Moderator 2026-10-27: end of each panel, after Contrast evidence, to shift existing sections least |
| Show the interactive card in the organism row (shows DS-031, adds one tab stop per scope) or only the static and loading cards? | Moderator | Answered by the Moderator 2026-10-27: keep the interactive card, so the one-link, one-tab-stop contract is shown surviving the split |

### 10.2 Atomic Design revision: feasibility concerns for the Tech Lead (advisory, not decisions)

| Concern | Owner | Status |
| ------- | ----- | ------ |
| Advisory feasibility note for the Tech Lead only: a part can be shown in the structure view only if the gallery obtains it the way any outside consumer does (S-16). If a classified part is not available that way, its specimen would need new public surface. | Tech Lead | Open |
| The section adds one tab stop per scope (the interactive card specimen, DS-031) at the end of each panel, after Contrast evidence; existing sections keep their positions. The keyboard specification, the accessibility scan and any position-dependent assertions must still pass without edits (AC-20, AC-24). | Tech Lead | Open |
| The isolated skeleton specimens (DS-063, DS-066) should be hidden from assistive technology so no second "Loading" or busy state is exposed. How is a technical decision. | Tech Lead | Open |
| If the Tech Lead chooses option A or C, the affected rows are withdrawn or re-cut as described in 3.3.3 (option A withdraws DS-063, DS-064 and DS-066). | Tech Lead | Open |
| Each scope panel gains a second loading card (DS-035 specimen, a second "Loading" status and busy state) and a second card link with the same accessible name (DS-031 specimen). Existing assertions that select or count loading cards, "Loading" text or card links must pass without edits (AC-20, AC-24). | Tech Lead | Open |
| Navigation bar is proposed as a molecule at medium confidence and Button as an atom; the Tech Lead decides each (MD-4). No move happens (S-19 excluded). | Tech Lead | Open |

---

MOD-W v5.0.1
