# brand-ui

`brand-ui` is a **reference spike**: a small multi-brand UI library for Angular, plus a gallery app that shows it. It exists to model how a digital agency serves several unrelated clients from one shared component base, with each brand's identity applied through design tokens.

It is **not production software**. It makes no production, client-delivery, official-rebrand or rollout claim, and it is not retroactively approved by being merged or documented.

## Atomic Design in the Card

The `Card` is the project's worked example of **[Atomic Design](https://atomicdesign.bradfrost.com/)**, a way of organizing a user interface from small parts into larger compositions. Small, independent parts are called atoms. Atoms combine into molecules. Atoms and molecules combine into an organism: a distinct section of an interface that owns its behaviour.

In `brand-ui` the `Card` is built that way:

| Level    | Part              | What it does in the Card                                                                                          |
| -------- | ----------------- | ----------------------------------------------------------------------------------------------------------------- |
| Atom     | `Tag`             | The accent-coloured text pill.                                                                                    |
| Atom     | `SkeletonBlock`   | One decorative placeholder shape.                                                                                 |
| Atom     | `CodeWell`        | A bordered `pre`/`code` surface for code text that the consumer supplies.                                         |
| Molecule | `MediaArea`       | The 4:3 media surface, with an optional label and an optional `Tag`.                                              |
| Molecule | `LoadingSkeleton` | Four `SkeletonBlock`s arranged as the loading placeholder.                                                        |
| Organism | `Card`            | The existing `bui-card`: it composes the parts and owns its inputs, title heading, single link and loading state. |

Where the parts come from:

- They are delivered by a separately built Angular package, `@brand-ui/atomic` (source in `projects/atomic`), through three entry points: `@brand-ui/atomic/atoms`, `@brand-ui/atomic/molecules` and `@brand-ui/atomic/organisms`.
- That package is built on its own, packed into a local archive with `npm pack`, and installed from the committed archive `package-artifacts/brand-ui-atomic-1.1.0.tgz` as a file dependency. It is not published to npm or any other registry.
- `ui` imports `Card` from `@brand-ui/atomic/organisms` and re-exports that same class. `import { Card } from 'ui'` is unchanged, and `Card` does not exist as two separate implementations.
- `Button`, `TextInput` and `Navigation` remain established `ui` components. They were not moved, and `ui` still exports exactly four components.
- The gallery's **Card structure** view, the last block in every scope panel, shows the atoms, molecules and organism in all four scopes, importing the parts from the installed `@brand-ui/atomic` entry points. It is gallery-owned and is not part of either library's API.

This section describes how the `Card` is organised. It makes no claim about performance, accessibility or maintainability.

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

`projects/ui` is the library. Its public entry point exports four standalone, signal-based components: `Button`, `TextInput`, `Card` and `Navigation`, plus `ThemeService` and `ThemeScopeDirective` for choosing and attaching a brand. `Button`, `TextInput` and `Navigation` are defined in `ui`. `Card` is the organism from the installed `@brand-ui/atomic` package, re-exported by `ui` (see [Atomic Design in the Card](#atomic-design-in-the-card)). The atomic parts themselves are public through `@brand-ui/atomic`, not through `ui`. `projects/gallery` is the review application; it imports the four components through `ui`, and the Card structure view imports the atomic parts through the installed `@brand-ui/atomic` entry points.

The gallery is a separate review application, not part of the library. It imports the library only through `ui`'s public entry point, as an outside consumer would, and the library does not depend on it. The brand scope switcher, the persistent hover, focus and active specimens, the token read-outs, the contrast evidence and the Design IDs are gallery-owned review features, not library API.

## Setup

Requires Node 26 and npm 11. The project uses Angular 22.2 and TypeScript 6.

```bash
npm ci
npx playwright install chromium   # once, for the browser tests
```

## The atomic package: build, pack and install

`@brand-ui/atomic` is a second Angular library in this workspace (`projects/atomic`, version 1.1.0). It is consumed as an installed package, never from its source.

- **Install.** `npm ci` installs it from the committed archive, declared as `file:package-artifacts/brand-ui-atomic-1.1.0.tgz`. No build is needed first and the archive is not fetched from a registry.
- **Build.** `npm run build` builds `atomic` (to `dist/atomic`), then `ui`, then `gallery`. `ui` and the gallery resolve the atomic parts from the installed package, with no TypeScript path alias and no relative import into `projects/atomic`.
- **Pack.** The committed archive is a reviewed local artefact. Refreshing it is a deliberate maintainer action: build `atomic`, run `node scripts/sanitize-atomic-dist.mjs` (which removes source maps), run `npm pack ./dist/atomic` into a temporary folder, review the nine-file inventory, then replace the committed archive and the lockfile entry together.
- **Verify.** `npm run verify:atomic-archive` rebuilds the package into a temporary folder and checks the committed archive for identity, version, entry points, file inventory and drift from source.
- **Status.** The package is not published. There is no registry release, and nothing in this repository asks anyone to publish it.

## Using the gallery

```bash
npm start
```

Open <http://localhost:4200/>. The gallery has no backend and needs no code changes to review any state.

- **Brand scope switcher** (top): ArtAnon Shop, IT English Mentor, CodeCraft Academy Light, CodeCraft Academy Dark, or **All brands** to see the four scopes stacked. Switching restyles every component without a reload.
- **Design IDs** checkbox: shows the `DS-nnn` identifier beside each token group and component state.
- Each panel shows its **tokens** (read from the computed style), then **Button**, **Text input**, **Card**, **Navigation bar**, **Long label**, **Contrast evidence** and **Card structure**.
- **About** panel: opens automatically the first time a browser visits the gallery (once per page load if storage is unavailable) and reopens from the **About** button in the top bar.
- Hover, focus and active states are shown persistently so no interaction is needed. These are gallery-owned presentation; the real `:hover`, `:focus-visible` and `:active` styles behave the same and can be tried by hand.

## Commands

| Command                 | What it does                                                                    |
| ----------------------- | ------------------------------------------------------------------------------- |
| `npm start`             | Serves the gallery for development.                                             |
| `npm run build`         | Builds the atomic package, then the `ui` library, then the gallery (production configuration). |
| `npm test`              | Runs the Vitest unit tests for the atomic package, the library and the gallery. |
| `npm run test:e2e`      | Runs the three Chromium Playwright specifications, including the axe scan.      |
| `npm run typecheck:e2e` | Type-checks the browser tests.                                                  |
| `npm run format:check`  | Checks formatting with Prettier.                                                |
| `npm run lint:tokens`   | Checks that components use tokens only and that every brand fills the contract. |
| `npm run check:assets`  | Checks font licences and provenance and the absence of restricted assets.       |
| `npm run verify:atomic-archive` | Rebuilds the atomic package and checks the committed archive and its installed-consumption boundary. |

`npm run test:e2e` builds the gallery in production mode, serves it locally and tests it in Chromium only.

## Long-label rule

- **Button:** the label wraps, is balanced where the browser supports it, hyphenates at syllable breaks for English, splits a word only when it cannot fit on a line of its own, and the button grows taller. It never truncates and never exceeds its container.
- **Navigation item:** the full text stays in the page as the link's accessible name and is repeated as a tooltip. The label is clamped visually to two lines with an ellipsis, and an item is never wider than `16rem`. At narrow widths the bar wraps onto further rows; there is no collapsed menu.

The gallery shows both cases at 180px, 280px, 360px and full width in every scope.

## Not production, not distributed

This repository is a study and reference artefact. Neither `ui` nor `@brand-ui/atomic` is published: there is no registry release and no changelog. The workspace carries version 1.1.0 as an additive extension of the accepted 1.0.0 reference; that number labels the reference state and is not a delivery. Nothing here is a delivered client rollout.

The accepted shortcuts for this spike are listed in the [Product shortcuts list](mod-w/product.md#7-shortcuts-list).

## How this was built

Built with MOD-W v5.0.1, a role-separated workflow in which a Moderator (human-in-the-loop) approves each step and plan and a Tech Lead reviews each step before QA.
Implementation was done by Claude Code acting as the Development Team.

The governing documents are in [`mod-w/`](mod-w/); the method is at [github.com/fpmcguire/mod-w](https://github.com/fpmcguire/mod-w).
