# brand-ui

`brand-ui` is a **reference spike**: a small multi-brand UI library for Angular, plus a gallery app that shows it. It exists to model how a digital agency serves several unrelated clients from one shared component base, with each brand's identity applied through design tokens.

It is **not production software**. It makes no production, client-delivery, official-rebrand or rollout claim, and it is not retroactively approved by being merged or documented.

## Brands and their status

| Brand             | Status                                                                                                                                                                                                                                                                                                          |
| ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ArtAnon Shop      | A real business owned by a third party. This is an **unofficial concept exploration** of turning its existing identity into tokens. It is not an official rebrand, and no affiliation or delivery claim is made. The repository holds palette values and a text wordmark only: no logo, artwork or photography. |
| IT English Mentor | A new brand for the Moderator's own freelance venture. Its visual direction may later become real.                                                                                                                                                                                                              |
| CodeCraft Academy | A placeholder name for open-source tech and code examples.                                                                                                                                                                                                                                                      |

No other third-party logos, trademarks or client material are used. Sample content is neutral and labelled as sample.

## Three brands, four scopes

All brands share one component set and one set of semantic `--bui-*` token names; only the token values differ. CodeCraft Academy is **one brand with two styling modes**, Light and Dark, so the gallery shows **three brands across four scopes**: ArtAnon Shop, IT English Mentor, CodeCraft Academy Light and CodeCraft Academy Dark. Switching brand changes tokens, never component structure.

## Components

`projects/ui` is the library. Its public entry point exports four standalone, signal-based components: `Button`, `TextInput`, `Card` and `Navigation`, plus `ThemeService` and `ThemeScopeDirective` for choosing and attaching a brand. `projects/gallery` is the review application; it imports the library only through `ui`.

## Setup

Requires Node 26 and npm 11. The project uses Angular 22.2 and TypeScript 6.

```bash
npm ci
npx playwright install chromium   # once, for the browser tests
```

## Using the gallery

```bash
npm start
```

Open <http://localhost:4200/>. The gallery has no backend and needs no code changes to review any state.

- **Brand scope switcher** (top): ArtAnon Shop, IT English Mentor, CodeCraft Academy Light, CodeCraft Academy Dark, or **All brands** to see the four scopes stacked. Switching restyles every component without a reload.
- **Design IDs** checkbox: shows the `DS-nnn` identifier beside each token group and component state.
- Each panel shows its **tokens** (read from the computed style), then **Button**, **Text input**, **Card**, **Navigation bar**, **Long label** and **Contrast evidence**.
- Hover, focus and active states are shown persistently so no interaction is needed. These are gallery-owned presentation; the real `:hover`, `:focus-visible` and `:active` styles behave the same and can be tried by hand.

## Commands

| Command                 | What it does                                                                    |
| ----------------------- | ------------------------------------------------------------------------------- |
| `npm start`             | Serves the gallery for development.                                             |
| `npm run build`         | Builds the library, then the gallery (production configuration).                |
| `npm test`              | Runs the Vitest unit tests for the library and the gallery.                     |
| `npm run test:e2e`      | Runs the three Chromium Playwright specifications, including the axe scan.      |
| `npm run typecheck:e2e` | Type-checks the browser tests.                                                  |
| `npm run format:check`  | Checks formatting with Prettier.                                                |
| `npm run lint:tokens`   | Checks that components use tokens only and that every brand fills the contract. |
| `npm run check:assets`  | Checks font licences and provenance and the absence of restricted assets.       |

`npm run test:e2e` builds the gallery in production mode, serves it locally and tests it in Chromium only.

## Long-label rule

- **Button:** the label wraps, is balanced where the browser supports it, hyphenates at syllable breaks for English, splits a word only when it cannot fit on a line of its own, and the button grows taller. It never truncates and never exceeds its container.
- **Navigation item:** the full text stays in the page as the link's accessible name and is repeated as a tooltip. The label is clamped visually to two lines with an ellipsis, and an item is never wider than `16rem`. At narrow widths the bar wraps onto further rows; there is no collapsed menu.

The gallery shows both cases at 180px, 280px, 360px and full width in every scope.

## Not production, not distributed

This repository is a study and reference artefact. The library is not distributed as a package: there is no registry release, versioning or changelog. Nothing here is a delivered client rollout.

The accepted shortcuts for this spike are listed in the [Product shortcuts list](mod-w/product.md#7-shortcuts-list).

## How this was built

Built with MOD-W v5.0.1, a role-separated workflow in which a Moderator approves each step and plan and a Tech Lead reviews each step before QA.
Implementation was done by Claude Code acting as the Development Team.
The governing documents are in [`mod-w/`](mod-w/); the method is at [github.com/fpmcguire/mod-w](https://github.com/fpmcguire/mod-w).
