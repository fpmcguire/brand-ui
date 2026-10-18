# product.md - brand-ui

**Status:** APPROVED by the Moderator, 2026-10-18 (v0.3, CodeCraft styling-mode clarification; v0.2 was the one-day rescope of v0.1)
**Date:** 2026-10-18
**Role:** Product Owner (Definition), Claude chat session
**Workflow:** MOD-W v5.0.1
**Project type:** Branch-isolated exploratory build (reference implementation, not production)

---

## 1. Purpose

`brand-ui` is a small multi-brand shared UI library for Angular, plus a gallery app that shows it.

It has two purposes:

1. **Domain learning.** Model how a digital agency works: several unrelated clients, one shared component base, brand identity applied through design tokens.
2. **Workflow evidence.** Test how MOD-W governs a reusable UI system, in particular the idea that such a system needs a living review surface (MW-OBS-022) and the branch-isolated exploratory build idea (MW-OBS-023). Both observations remain `NOT_YET_TESTED`; this project is one small data point, not a conclusion.

### 1.1 Framing

- The output is a **reference implementation**. It does not go into production and is not retroactively approved by merging or documenting it.
- Brand status, stated plainly:
  - **ArtAnon Shop** is a real business owned by a third party (the Moderator's family). This project is an unofficial **concept exploration** of turning its existing identity into tokens. It is not an official rebrand, and no affiliation or delivery claim is made. Its logo is used only as a design input and is never committed to this repository; the repo holds palette values and a text wordmark only (see A-8).
  - **IT English Mentor** is a new brand for the Moderator's own freelance venture. Its visual direction may later become real.
  - **CodeCraft Academy** is a placeholder name for open-source tech and code examples, in the spirit of the Moderator's published Angular design-pattern examples.
- No other third-party logos, trademarks or client material are used.
- Nothing here claims to be a delivered client rollout.

### 1.2 Time box: one working day

The Moderator wants the whole project finished in one working day, leaving time to study the code afterwards. Scope below is cut to fit. Smaller code is also easier to study and defend.

Expected shape (the Tech Lead owns the final decomposition):

| Step | Content |
|---|---|
| Step 1 | Tokens for the Must brands, theme service, button and card, gallery shell with brand switcher |
| Moderator study break | The Moderator reads the theme service and button until able to explain and rewrite them |
| Step 2 | Text input, navigation bar, long-label case, automated accessibility scan, Playwright tests, README |

**Cut order if time runs short** (first to drop first): the Could items, then CodeCraft Academy, then Design IDs in the gallery.

---

## 2. Target users

| User | What they need |
|---|---|
| **Library consumers** (developers building a client site) | Import components, pick a brand, get correct styling without touching component internals. |
| **Designers** | See every component, brand and state side by side, and confirm it matches `design-spec.md`. |
| **Reviewers** (Moderator, Tech Lead, QA) | Verify behavior, accessibility and token discipline from one surface without reading code. |

---

## 3. Constraints (given)

These come from the Moderator and are not open for the Product Owner to change. The Tech Lead owns everything below this level.

- Angular 22.x (22.2 at workspace creation), Node 26.0.0, TypeScript 6.0.x (versions to be verified at the start of every Dev Team session).
- Angular CLI workspace with a **library project** and a **gallery app**. Nx is not used; it is a documented later option only.
- Zoneless, standalone components, signals-based APIs, modern control flow.
- Brand values are delivered as CSS custom properties and switch at runtime.
- Public repository `brand-ui`. MOD-W documents live in `mod-w/`; the design documents and the prototype live in `mod-w/design/`.
- One working day end to end.

---

## 4. Brands

Three brands (see 1.1 for their status), deliberately different on tone, color, type, shape and density. ArtAnon Shop mirrors the common agency case of a client with an existing identity that must be translated into tokens; IT English Mentor is a brand created from scratch. Detailed direction belongs to `design-spec.md`.

| Brand | Industry | Direction (from Moderator) | Priority |
|---|---|---|---|
| ArtAnon Shop | Online art and print shop (real business, third party) | Modern, artistic, minimalistic; palette taken from the supplied logo | Must |
| IT English Mentor | Freelance English mentoring for IT professionals (Moderator's venture) | Professional, educational, clean | Must |
| CodeCraft Academy | Open-source tech and code examples (placeholder) | Tech-savvy, innovative, vibrant; one brand with Light and Dark styling modes | Should |

All brands share the same component set and the same semantic token names. Only token values differ. CodeCraft Academy remains one brand: its Light and Dark styling modes use the same token names, typography, spacing and shape, with mode-specific color values. The gallery therefore represents three brands through four rendered scopes: ArtAnon Shop, IT English Mentor, CodeCraft Academy Light and CodeCraft Academy Dark. If a brand needs a different structure, that is a documented component variant, not a one-off.

---

## 5. Scope

Priority uses MoSCoW: **M**ust, **S**hould, **C**ould.

| # | Item | Priority |
|---|---|---|
| S-1 | Design tokens for ArtAnon Shop and IT English Mentor: color (including semantic colors), type, spacing, radius, elevation | M |
| S-2 | Runtime brand switching via a signal-based theme service | M |
| S-3 | Four components: button, text input (with error state), card, navigation bar | M |
| S-4 | Gallery app showing every component in every brand and state, with a brand switcher | M |
| S-5 | The long-label case: a very long label on button and navigation bar in every brand (see A-4) | M |
| S-6 | Accessibility checks: contrast, focus, keyboard, labels; one automated scan | M |
| S-7 | Vitest unit tests; three Playwright tests (brand switch, keyboard operation, long label) | M |
| S-8 | CodeCraft Academy tokens with Light and Dark styling-mode value sets, so the gallery shows three brands across four rendered scopes | S |
| S-9 | Design IDs from `design-spec.md` shown in the gallery next to each component state | S |
| S-10 | Two further components: alert, teaser or hero | C |
| S-11 | About panel in the gallery app only, following the About modal pattern of the Moderator's agv-fleet-management-sim project: opens on the first visit only (remembered per browser; if storage is unavailable it opens once per page load), reopens from the top bar, closes by button, backdrop or Esc. Built from library components. | C |
| S-12 | One gallery page rendered from mock headless-CMS style JSON | C |
| S-13 | Static deployment of the gallery (no indexing, no third-party brand asset) | C |

### 5.1 Non-goals

- Production use, publishing to npm, versioning or a changelog.
- Server-side rendering, routing beyond the gallery, internationalization.
- A real CMS, backend or API.
- Storybook. A custom gallery is used; a Storybook comparison is a possible follow-up.
- Nx or any monorepo tooling.
- Visual regression testing, cross-browser matrices, real-device testing.
- A general dark-mode feature across all brands. Dark appearance exists only where a brand needs it.
- Animation libraries, icon libraries beyond what the components need, form frameworks.
- Third-party brand names, logos, photography or copyrighted artwork. The ArtAnon Shop logo is never committed; ArtAnon appears as a text wordmark and palette values only.
- Any claim that this is delivered brand work for ArtAnon Shop, or an official rebrand of any real business.
- Fabricated testimonials, prices, course claims or contact details under a real brand name. Sample content is neutral and labeled as sample.
- Any claim that this project validates MW-OBS-022 or MW-OBS-023.

---

## 6. Acceptance criteria

Each criterion is checkable. QA records pass, fail or not verified, with evidence.

| ID | Criterion | Priority |
|---|---|---|
| AC-1 | ArtAnon Shop and IT English Mentor fill the same set of semantic token names. No brand-specific token names exist. | M |
| AC-2 | Switching brand in the gallery restyles every component without a page reload. | M |
| AC-3 | Component styles contain no hard-coded colors, font families or values for space, radius or elevation. Everything comes from tokens. Verified by automated search plus QA review. | M |
| AC-4 | Each of the four components is standalone with a signal-based API, exported from the library's public entry point, and imported by the gallery the way an outside consumer would. | M |
| AC-5 | The gallery shows every component, brand and state combination in `design-spec.md`. A reviewer can see all states of a component without editing code. | M |
| AC-6 | All interactive components work by keyboard only. A visible focus indicator meets 3:1 contrast in every brand. | M |
| AC-7 | Text contrast is at least 4.5:1 (3:1 for large text) and non-text UI contrast at least 3:1 for every token pair the components use, in every brand. Checked by a test. | M |
| AC-8 | An automated accessibility scan of the gallery reports no serious or critical violations. | M |
| AC-9 | Unit tests cover the theme service and each component. Three Playwright tests cover brand switching, keyboard operation and the long-label case. | M |
| AC-10 | The long-label case renders correctly on button and navigation bar in every brand, and the rule (wrap, truncate with a full-text accessible name, or grow) is documented. | M |
| AC-11 | The build gate (build command and test command, defined by the Tech Lead) passes. | M |
| AC-12 | The README states that this is a reference spike, states the status of each brand as in 1.1 (including that the ArtAnon work is an unofficial concept), links the shortcuts list, and makes no production, client-delivery or rollout claim. The repository, including `mod-w/design/project/`, contains no ArtAnon logo or other third-party brand asset file; ArtAnon appears as a text wordmark and palette values only. Verified by file search and review. | M |
| AC-13 | CodeCraft Academy Light and Dark fill the same semantic token names as one brand with two styling-mode value sets; the gallery shows all three brands across four rendered scopes. | S |
| AC-14 | Adding or changing a brand touches only brand token files, not component code. Confirmed by review. | S |
| AC-15 | Each component state in the gallery carries the Design ID from `design-spec.md`. | S |
| AC-16 | With names and logos covered, a reviewer can tell the brands shown apart at thumbnail size. | S |
| AC-17 | The About panel states the project's intent, the status of each brand as in 1.1, and how to use the gallery. It is a dialog with an accessible name, opens and closes by keyboard (Esc and a close button), keeps focus inside while open and returns focus to its trigger on close. It opens automatically on the first visit only. Its statements match the README. | C |
| AC-18 | The CMS page renders from mock JSON using library components only. | C |
| AC-19 | If deployed, the gallery is served as a static site with indexing disabled and contains no third-party brand asset. | C |

---

## 7. Shortcuts list

Shortcuts accepted in advance. Anything taken beyond this list is recorded by the Dev Team in its step report.

- Placeholder text, images and mock JSON content.
- Chromium only for Playwright; no other browsers or devices.
- Open-license fonts only.
- A narrow public API: only what the four components need.
- Alert, teaser or hero, About panel, CMS page and deployment are not built unless the Must items are accepted with time to spare.
- CodeCraft Academy, including both Light and Dark styling modes, may be dropped without a product change.
- No npm publishing, versioning or changelog.
- No RTL or general dark mode.
- Documentation limited to the MOD-W documents and a short README.
- Gallery styling kept minimal; it is a review surface, not a product.

---

## 8. Assumptions

| ID | Assumption | Status |
|---|---|---|
| A-1 | Four components are enough to exercise the token model and the long-label case. Alert and teaser or hero are optional extras. | Decided |
| A-2 | The work happens on a spike branch and reaches the default branch only after the end-of-spike decision. The Tech Lead may refine the Git workflow. | Open |
| A-3 | WCAG 2.2 level AA is the accessibility target. | Decided |
| A-4 | The awkward case is a very long label on button and navigation, to test wrapping and truncation in every brand. | Decided |
| A-5 | The Prototype Ceremony runs, owned by Claude Design. It produces `mod-w/design/design-spec.md`, `mod-w/design/architecture-notes.md`, `mod-w/design/prototype-README.md` and the prototype in `mod-w/design/project/`. | Decided |
| A-6 | Product Definition used Claude chat only, without the Perplexity and Gemini cross-checks MOD-W lists as defaults. Recorded as a deviation. | Decided |
| A-7 | There is no external deadline. The Moderator's own time box is one working day, and the Could items and CodeCraft Academy are what gets cut first. | Decided |
| A-8 | The ArtAnon logo is never committed to the repo, including `mod-w/design/project/`. Only palette values and a text wordmark are. The logo is used only as an input in the Designer session. | Decided |
| A-9 | Styling of the Moderator's portfolio site and of any example site is not a source for any brand. IT English Mentor relates to the portfolio only through shared body type and an echo of its teal and amber colors. CodeCraft Academy takes only the content type (open-source code examples) from the Angular design-patterns example, not its layout or styling. | Decided |
| A-10 | The repository is public. Because no third-party brand asset is committed (A-8), nothing in it needs separate asset licensing. Any brand asset added later goes in one folder with its own all-rights-reserved notice, outside the code license. | Decided |
| A-11 | Codex Tech Lead review runs after each step, but QA runs once, after Step 2, not after every step. Recorded as a deviation from MOD-W to fit the time box. | Decided |
| A-12 | Between Step 1 and Step 2 the Moderator studies the theme service and the button in depth. The code stays small enough to be fully understood by one person. | Decided |

---

## 9. Roles and cross-validation

| Role | Agent | Output |
|---|---|---|
| Moderator | Human | Approvals, final gate |
| Product Owner | Claude chat | This document |
| Designer + Prototyper | Claude Design | `mod-w/design/design-spec.md`, `mod-w/design/project/` (with `prototype-README.md`), `mod-w/design/architecture-notes.md` |
| Tech Lead | Codex, separate session | `architecture.md`, `roadmap.md`, `step-xx.md`, `domain-language.md`, `CLAUDE.md`, `AGENTS.md`, review |
| Development Team | Claude Code | Implementation of the approved step |
| QA | Fresh Claude Code session | `qa.md` (once, after Step 2; see A-11) |

No agent plans and implements, or implements and reviews. Each session carries one role.

---

## 10. End-of-spike decision

The Moderator decides at the end, using the four outcomes from MW-OBS-023:

| Outcome | When it fits |
|---|---|
| **STOP** | Must criteria are not reachable at reasonable cost, or the gallery costs more than it reveals. Keep the evidence record, discard the code. |
| **REVISE** | The approach is sound but a specific part (token model, component API, gallery design) needs rework before more is built. |
| **PROCEED** | All Must criteria pass and the evidence below is positive. The code remains a Reference Implementation; production use needs the normal MOD-W gates re-executed. |
| **TRIAL** | The result is inconclusive; repeat the approach on a different project before deciding. |

### 10.1 Evidence kept for MW-OBS-022 and MW-OBS-023

An evidence log is kept outside the public repo and shaped like a MOD-W observation (observation, evidence, contradicting evidence, limits). It records:

- Which defects the gallery and automated checks revealed that the written documents did not.
- Whether Design IDs in the gallery made review faster or clearer.
- What the gallery cost to build and maintain relative to the library.
- Whether the shared-library decision was made explicitly in `architecture.md`, not by accident.
- What MOD-W caught or missed: review findings, rejected shortcuts, corrected plans.
- What the one-day time box and the QA-once deviation (A-11) cost or saved.
- Limits: one small project, one Moderator, no real client engagement (ArtAnon Shop is a concept exploration, not delivered work).

---

## 11. Out of scope for this document

Technical structure, file layout, tooling choices, test tooling and build commands belong to the Tech Lead. Visual and interaction detail belongs to `design-spec.md`.
