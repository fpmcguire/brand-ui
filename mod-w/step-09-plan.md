# STEP-09 Implementation Plan — Revision 2 (approved)

**Status:** Approved by the Moderator on 2026-10-29 after the Tech Lead PASS recorded in `mod-w/review.md`. The Moderator approved this exact Revision 2 plan, O-1 through O-6 with the Tech Lead's recorded dispositions and O-1 reason, and the 5.25-hour estimate. STEP-09 implementation is authorized for exactly R1 to R9 under this plan and its stop conditions. This is plan approval, not STEP-09 acceptance, release authority, or permission to publish, tag, merge or deploy.

**Revision 2 changes.** (1) Scope fixed at exactly nine expected paths; the conditional-path model and maximum are removed (§4). (2) About paragraph 2 says "re-exports that same Card"; the `install` assertion is an exact occurrence count (§5.3, §7). (3) The three embedded backspace characters in the no-claims/no-publish regexes are replaced with literal `\b` (§7). (4) Evidence is created from retained real output in a defined order (§10). (5) `npm ls @brand-ui/atomic` is a scheduled, recorded gate (§8, §10, §12).

## 1. Scope and requirements

Make version and documentation truthful for the completed extension, and make the Card's Atomic Design implementation a prominent, consistent, accurate explanation in the root `README.md`, `projects/ui/README.md`, and the existing About panel section "The ui library". Audit the Card structure view and `mod-w/architecture.md`. Version the additive release 1.1.0 consistently. Run the final gates without publishing or deploying.

Traces to MD-5, MD-7; AC-12, AC-17, AC-20 to AC-27; the Moderator's 2026-10-29 documentation-priority amendment. Design IDs: DS-061 to DS-066 and reused DS-030/031/035 are documented, not changed. No Reference Implementation exists (see §14). No feature, API, token, Design ID, `mod-w/design/**`, performance, S-10/S-12/S-19, publishing or deployment work.

## 2. Baseline observed during planning

| Item | Observed |
|---|---|
| Branch | `feature/atomic-design`, one commit ahead of `origin/feature/atomic-design` (unpushed) |
| HEAD | `4c2d3ef` "docs(mod-w): activate step-09 planning" |
| Tags | `step-08-complete` is HEAD's parent (`cae14a4`); `git describe` = `step-08-complete-1-g4c2d3ef`. `v1.0.0^{}` = `bd241525a93afa468d069ca42bc300f62af3bd91`, 29 commits behind HEAD. |
| Working tree | **Clean** at planning start (see note). `mod-w/step-09-plan.md` is the only path this planning turn adds. |
| Host toolchain | Default shell reports Node v24.13.0 and npm 11.6.2. This is not the project toolchain. All implementation commands run under Node 26.0.0 and npm 11.12.1 (§9). |

**Note on the dirty-path premise.** The planning instruction described `AGENTS.md`, `CLAUDE.md`, `mod-w/roadmap.md` and `mod-w/step-09.md` as uncommitted. They are not: `git status` is clean and `git show --stat HEAD` shows exactly those four paths in commit `4c2d3ef`. The plan is based on the working tree, which equals HEAD, so the content is the same. Nothing to preserve beyond leaving those files unedited. Flagged for the Tech Lead in case a different state was intended.

**Version facts (material to scope).**

| Location | Current | Target |
|---|---|---|
| `projects/atomic/package.json` | 1.1.0 | 1.1.0, unchanged |
| `package-artifacts/brand-ui-atomic-1.1.0.tgz` | 1.1.0; sha256 `59893275deda6cf582ad855fac4845bb86b5fb888780392a787612508e372c79` (recorded in `mod-w/qa.md`) | unchanged |
| `package-lock.json` `node_modules/@brand-ui/atomic` | 1.1.0, `file:package-artifacts/brand-ui-atomic-1.1.0.tgz`, integrity `sha512-2dbAP1Wq…` | unchanged |
| `projects/ui/package.json` | `0.0.1`; peer `@brand-ui/atomic ^1.1.0` | `1.1.0` (see O-2) |
| root `package.json` | `1.0.0` | `1.1.0` |
| `package-lock.json` root entry (`version` at line 3 and `packages[""].version` at line 9) | `1.0.0` | `1.1.0` |

The atomic package, archive and its lock entry already say 1.1.0 and STEP-09 changes no `projects/atomic` source (only an active extension Step may, and this Step has no reason to). Therefore **no archive content change and no integrity change is expected**. "Archive rebuild" in this plan means the verifier's existing rebuild-and-compare, which packs into a temporary directory and proves the committed archive has not drifted. Any difference is a stop condition, not something to fix by repacking.

## 3. Audit findings that shape the plan

1. **README "Components" and "Not production, not distributed" are now partly stale.** The Components paragraph calls `Card` one of four components without saying it is the installed organism; the last section says the library has no "versioning", which 1.1.0 contradicts; the Commands table says `npm run build` builds "the library, then the gallery" (it builds `atomic`, `ui`, then `gallery`) and omits `verify:atomic-archive`; `npm test` also runs the atomic tests. `projects/ui/README.md` repeats the four-components sentence and says the library "is not distributed as a package", with no mention of the atomic dependency.
2. **Panel-section lists omit the Card structure view.** The root README "Using the gallery" bullet and the About "Using the gallery → Panel sections" bullet both list the panel as ending at "Contrast evidence", but `gallery-page.component.html:285` renders `<gal-card-structure>` last in every scope panel. This is a factual gap under AC-27. The plan appends "and Card structure" to both bullets (O-3).
3. **The About test forbids the word "install".** `about-panel.spec.ts` line 380 asserts `not.toMatch(/install|tutorial|npm |ng add/i)`. The required wording ("separately built and installed `@brand-ui/atomic` package") contains "installed". This existing assertion cannot stay verbatim (O-1; §7).
4. **The atomic package root exports nothing.** `projects/atomic/src/public-api.ts` is `export {}`. D-12 says the root *may* re-export. Documentation must therefore say parts are imported from the three entry points, and never imply `import { Card } from '@brand-ui/atomic'`.
5. **Card structure view audit: no change.** `structure-specimens.ts` and `card-structure.component.html` label Atoms (Tag, Skeleton block, Code well), Molecules (Media area, Loading skeleton) and the Card organism, with "Built from" lines that match D-12, and import only from `@brand-ui/atomic/*`. The component's JSDoc says it is gallery-owned and never exported. No inaccurate or materially incomplete statement was found.
6. **`mod-w/architecture.md` audit: no change.** D-12 and Public API match the code: four established components, `Card` re-exported from `@brand-ui/atomic/organisms`, parts public through the package's entry points, Button/TextInput/Navigation unmoved, nothing published. "Public through `@brand-ui/atomic` and its entry points" is slightly loose given finding 4 but is not inaccurate, because it names the entry points. Recorded as audited, no change.

## 4. Files

**Required: 9 paths (3 created-or-edited documentation, 2 test, 3 manifest, 1 evidence).**

| # | Path | Action | Change |
|---|---|---|---|
| R1 | `README.md` | Edit | Insert dedicated Atomic Design section after the opening paragraphs; correct Components, add the atomic build/pack/install section, correct Using-the-gallery bullet, Commands table and the last-but-one section (§5.1). |
| R2 | `projects/ui/README.md` | Edit | Keep the opening summary (adjusted for accuracy), insert dedicated Atomic Design section, then build/install guidance (§5.2). |
| R3 | `projects/gallery/src/app/gallery/about-panel/about-panel.html` | Edit | Lead "The ui library" with the Atomic Design explanation; append "and Card structure" to the Panel-sections bullet (§5.3). No new section, heading change or link. |
| R4 | `projects/gallery/src/app/gallery/about-panel/about-panel.spec.ts` | Edit | One new `it`, one extended no-claims assertion, one narrowed existing assertion (§7). |
| R5 | `e2e/keyboard-and-accessibility.spec.ts` | Edit | Add assertions inside the existing first-visit About test; no existing assertion edited (§7). No fourth specification. |
| R6 | `package.json` | Edit | `"version": "1.0.0"` to `"1.1.0"`. Nothing else. |
| R7 | `package-lock.json` | Edit | Root `version` (line 3) and `packages[""].version` (line 9) to `1.1.0`. Nothing else; the atomic entry and its integrity do not change. |
| R8 | `projects/ui/package.json` | Edit | `"version": "0.0.1"` to `"1.1.0"` (subject to O-2). Peer dependency unchanged. |
| R9 | `mod-w/evidence/step-09/commands.md` | Create | Created or finalized after the gates and searches have run (§10 Phase E), from their retained real output: command, exit code and relevant output for every gate and audit search; the carried-forward STEP-08 disposition; no benefit claim. |

**Audited, no change (not in scope).** The Card structure view (`projects/gallery/src/app/gallery/structure/**` and `projects/gallery/src/app/gallery/specimens/structure-specimens.ts`) and `mod-w/architecture.md` were audited during planning against D-12 and the code and need no change (§3 items 5 and 6). Revision 2 does **not** authorize an edit to any of them, conditional or otherwise. If any later audit (Phase A step 4 or Phase D) finds an inaccurate or materially incomplete statement that would require touching one of those paths, that is a stop condition: the Development Team stops, reports, and waits for separate Tech Lead review and Moderator approval of an amended plan.

**Counts.** Implementation scope is exactly **9 expected paths**: R1 to R9, of which 1 is created (R9) and 8 are edited. There are no conditional paths and no maximum above 9. This planning turn adds one path: `mod-w/step-09-plan.md`.

**Not touched:** every other tracked path, including `AGENTS.md`, `CLAUDE.md`, `mod-w/roadmap.md`, `mod-w/step-09.md`, `mod-w/review.md`, `mod-w/qa.md`, `mod-w/po-signoff-*`, `mod-w/design/**`, `mod-w/domain-language.md`, the Card structure view and `mod-w/architecture.md` (audited, no change), `projects/atomic/**`, `package-artifacts/**`, `scripts/**`, `angular.json`, `mod-w/evidence/d-12/**` (before and after frozen), `study-guides/**`, other e2e files. The formal status, review, QA, sign-off and roadmap records are written by their owners, not by the Development Team.

## 5. Exact documentation copy

Spelling and register follow the existing READMEs (British "artefact"; English in the app). Code spans use backticks in Markdown. The wording below is final unless the Tech Lead amends it; the three surfaces share one meaning and differ only in depth.

### 5.1 Root `README.md`

**Placement.** The new section goes immediately after the intro paragraph that ends "…not retroactively approved by being merged or documented." and before `## Brands and their status`.

```markdown
## Atomic Design in the Card

The `Card` is the project's worked example of **Atomic Design**, a way of organizing a user interface from small parts into larger compositions. Small, independent parts are called atoms. Atoms combine into molecules. Atoms and molecules combine into an organism: a distinct section of an interface that owns its behaviour.

In `brand-ui` the `Card` is built that way:

| Level    | Part              | What it does in the Card                                                                         |
| -------- | ----------------- | ------------------------------------------------------------------------------------------------ |
| Atom     | `Tag`             | The accent-coloured text pill.                                                                   |
| Atom     | `SkeletonBlock`   | One decorative placeholder shape.                                                                |
| Atom     | `CodeWell`        | A bordered `pre`/`code` surface for code text that the consumer supplies.                        |
| Molecule | `MediaArea`       | The 4:3 media surface, with an optional label and an optional `Tag`.                             |
| Molecule | `LoadingSkeleton` | Four `SkeletonBlock`s arranged as the loading placeholder.                                       |
| Organism | `Card`            | The existing `bui-card`: it composes the parts and owns its inputs, title heading, single link and loading state. |

Where the parts come from:

- They are delivered by a separately built Angular package, `@brand-ui/atomic` (source in `projects/atomic`), through three entry points: `@brand-ui/atomic/atoms`, `@brand-ui/atomic/molecules` and `@brand-ui/atomic/organisms`.
- That package is built on its own, packed into a local archive with `npm pack`, and installed from the committed archive `package-artifacts/brand-ui-atomic-1.1.0.tgz` as a file dependency. It is not published to npm or any other registry.
- `ui` imports `Card` from `@brand-ui/atomic/organisms` and re-exports that same class. `import { Card } from 'ui'` is unchanged, and `Card` does not exist as two separate implementations.
- `Button`, `TextInput` and `Navigation` remain established `ui` components. They were not moved, and `ui` still exports exactly four components.
- The gallery's **Card structure** view, the last block in every scope panel, shows the atoms, molecules and organism in all four scopes, importing the parts from the installed `@brand-ui/atomic` entry points. It is gallery-owned and is not part of either library's API.

This section describes how the `Card` is organised. It makes no claim about performance, accessibility or maintainability.
```

Prettier's table alignment is applied by the formatter at implementation time if the file is formatted; the root README is outside the `format:check` glob, so the long last-row cell is acceptable and the table is kept readable by wrapping nothing.

**Other root README edits (exact).**

1. `## Components` first paragraph becomes:

```markdown
`projects/ui` is the library. Its public entry point exports four standalone, signal-based components: `Button`, `TextInput`, `Card` and `Navigation`, plus `ThemeService` and `ThemeScopeDirective` for choosing and attaching a brand. `Button`, `TextInput` and `Navigation` are defined in `ui`. `Card` is the organism from the installed `@brand-ui/atomic` package, re-exported by `ui` (see [Atomic Design in the Card](#atomic-design-in-the-card)). The atomic parts themselves are public through `@brand-ui/atomic`, not through `ui`. `projects/gallery` is the review application; it imports the four components through `ui`, and the Card structure view imports the atomic parts through the installed `@brand-ui/atomic` entry points.
```

The second Components paragraph (gallery is separate; gallery-owned features) is unchanged.

2. New section after `## Setup` and before `## Using the gallery`:

```markdown
## The atomic package: build, pack and install

`@brand-ui/atomic` is a second Angular library in this workspace (`projects/atomic`, version 1.1.0). It is consumed as an installed package, never from its source.

- **Install.** `npm ci` installs it from the committed archive, declared as `file:package-artifacts/brand-ui-atomic-1.1.0.tgz`. No build is needed first and the archive is not fetched from a registry.
- **Build.** `npm run build` builds `atomic` (to `dist/atomic`), then `ui`, then `gallery`. `ui` and the gallery resolve the atomic parts from the installed package, with no TypeScript path alias and no relative import into `projects/atomic`.
- **Pack.** The committed archive is a reviewed local artefact. Refreshing it is a deliberate maintainer action: build `atomic`, run `node scripts/sanitize-atomic-dist.mjs` (which removes source maps), run `npm pack ./dist/atomic` into a temporary folder, review the nine-file inventory, then replace the committed archive and the lockfile entry together.
- **Verify.** `npm run verify:atomic-archive` rebuilds the package into a temporary folder and checks the committed archive for identity, version, entry points, file inventory and drift from source.
- **Status.** The package is not published. There is no registry release, and nothing in this repository asks anyone to publish it.
```

3. In `## Using the gallery`, the Panel bullet ends "…then **Button**, **Text input**, **Card**, **Navigation bar**, **Long label**, **Contrast evidence** and **Card structure**."

4. Commands table: `npm run build` row becomes "Builds the atomic package, then the `ui` library, then the gallery (production configuration)."; `npm test` row becomes "Runs the Vitest unit tests for the atomic package, the library and the gallery."; one row is added after `npm run check:assets`: `npm run verify:atomic-archive` | "Rebuilds the atomic package and checks the committed archive and its installed-consumption boundary."

5. `## Not production, not distributed` first paragraph is kept; the second paragraph becomes:

```markdown
This repository is a study and reference artefact. Neither `ui` nor `@brand-ui/atomic` is published: there is no registry release and no changelog. The workspace carries version 1.1.0 as an additive extension of the accepted 1.0.0 reference; that number labels the reference state and is not a delivery. Nothing here is a delivered client rollout.
```

The heading, the shortcuts link and the whole "How this was built" section are unchanged. The intro, "Brands and their status" table and "Three brands, four scopes" sections are unchanged (AC-12).

### 5.2 `projects/ui/README.md`

Final file structure: title, opening summary, new section, build/install guidance, status. The file is inside the `format:check` glob; it is formatted with Prettier once (`npx prettier --write projects/ui/README.md`, in scope), then checked.

```markdown
# ui

This is the `ui` library of the `brand-ui` reference spike: four standalone Angular components (`Button`, `TextInput`, `Card`, `Navigation`) and a small theme facility (`ThemeService`, `ThemeScopeDirective`) driven by `--bui-*` CSS custom properties.

## Atomic Design in the Card

The `Card` is built with **Atomic Design**, a way of organizing a user interface from small parts into larger compositions: atoms combine into molecules, and atoms and molecules combine into an organism, a distinct section that owns its behaviour.

- **Atoms:** `Tag`, `SkeletonBlock` and `CodeWell`.
- **Molecules:** `MediaArea` and `LoadingSkeleton`.
- **Organism:** `Card`, the existing `bui-card`. It composes the atoms and molecules and keeps its inputs, title heading, single link and loading state.

These parts come from the separately built and installed `@brand-ui/atomic` package, imported from its `@brand-ui/atomic/atoms`, `@brand-ui/atomic/molecules` and `@brand-ui/atomic/organisms` entry points. `ui` imports `Card` from `@brand-ui/atomic/organisms` and re-exports that same class from its public entry point, so `import { Card } from 'ui'` is unchanged and `Card` does not exist as two separate implementations.

`ui` still exports four components. `Button`, `TextInput` and `Navigation` are established `ui` components defined here and were not moved. The atomic parts are public through `@brand-ui/atomic`, not through `ui`. This describes how the `Card` is organised and makes no claim about performance, accessibility or maintainability.

## Build and install

`ui` declares `@brand-ui/atomic` (`^1.1.0`) as a peer dependency. In this workspace the root `package.json` installs it from the committed archive `package-artifacts/brand-ui-atomic-1.1.0.tgz` as a file dependency, so `npm ci` provides it without a prior build and without a registry.

`npm run build` from the repository root builds `atomic`, then `ui`, then `gallery`. The package is built on its own and packed with `npm pack`; how the archive is built, packed and verified is described in the [root README](../../README.md#the-atomic-package-build-pack-and-install). Test and usage instructions are there too.

## Status

It is a study artefact. Neither `ui` nor `@brand-ui/atomic` is published, and there is no registry release process. The workspace is versioned 1.1.0 as an additive extension of the accepted 1.0.0 reference; that number is not a delivery.
```

### 5.3 About panel, "The ui library" (`about-panel.html`)

The `<h3 id="gal-about-library">The ui library</h3>` and `aria-labelledby` are unchanged. The section keeps its place third. The four paragraphs in the new order are below; paragraphs 1 and 2 are new, paragraph 3 is the existing first paragraph with two sentences added and one clause adjusted, paragraph 4 is the existing token paragraph, unchanged. No list, link, icon, image or Design ID is added.

1. "The Card in the ui library is built with Atomic Design, a way of organizing an interface from small parts into larger compositions. Small parts called atoms combine into molecules, and atoms and molecules combine into an organism, a distinct section of an interface that owns its behavior."
2. "Here, Tag, SkeletonBlock and CodeWell are atoms. MediaArea and LoadingSkeleton are molecules. Card is the organism that composes them. These parts come from the separately built and installed `<code>@brand-ui/atomic</code>` package, which is built and packed locally and is not published, and ui re-exports that same Card, so there is one Card, not two separate implementations. The Card structure view in each scope shows the atoms, molecules and organism."
3. "The ui public entry point exports four components: Button, TextInput, Card and Navigation. Button, TextInput and Navigation are established ui components and were not moved. It also has ThemeService, which owns the selected theme, and ThemeScopeDirective, which attaches a theme to one part of a page."
4. (unchanged) "Every brand fills the same set of semantic token names (`--bui-*`), and the components hold no brand values. Switching brand changes tokens only, never component structure."

Prettier will place line breaks; the test normalizes whitespace. In "Using the gallery", the Panel-sections `<li>` becomes: "each scope shows its tokens read from the computed style, then Button, Text input, Card, Navigation bar, Long label, Contrast evidence and Card structure."

The About copy uses US spelling ("behavior", "organizing") as the existing panel does; the READMEs use "behaviour" as the root README does elsewhere ("artefact"). The meaning is the same on all three surfaces; AC-17's "match in meaning" requirement is met by shared terms and mapping, not identical sentences.

## 6. Distinguishing the four established components from the atomic parts

Every surface uses the same device: `ui` **exports four components**, one of which (`Card`) is the installed organism re-exported from `@brand-ui/atomic`; the other three are defined in `ui` and **were not moved**; the atomic parts are **public through `@brand-ui/atomic` entry points, not through `ui`**. Words banned in the new copy: "five components", "seven components", "moved Card into ui", "two Cards", any statement that all four components are atomic parts, any claim that `ui` contains the atoms. The root README uses a level table for the parts and a separate sentence for the unmoved components; `projects/ui/README.md` uses a bullet map and a separate paragraph; the About panel uses paragraph 2 for the parts and paragraph 3 for the four components.

## 7. Test changes

All new assertions are added to existing files. Existing assertions are not weakened except the one narrowing in item 3, which needs explicit approval (O-1).

**`about-panel.spec.ts` (R4), `content` describe:**

1. **New `it`: "explains the Card's Atomic Design implementation in the ui library section (AC-17.3, AC-27)".** Scopes to `section[aria-labelledby="gal-about-library"]`. Asserts: its `h3` is still "The ui library"; it has four `p` elements and no `a`, `img`, `svg` or list; its first paragraph contains "Atomic Design", "small parts into larger compositions", "atoms", "molecules" and "organism"; the second contains "Tag, SkeletonBlock and CodeWell are atoms", "MediaArea and LoadingSkeleton are molecules", "Card is the organism", "separately built and installed", `@brand-ui/atomic` (via its `code` element), "not published", "re-exports that same Card" and "one Card, not two separate implementations"; the third contains "four components: Button, TextInput, Card and Navigation" and "Button, TextInput and Navigation are established ui components and were not moved"; and the Atomic Design paragraph precedes the ThemeService paragraph (index order). It also asserts that the Panel-sections bullet ends "Contrast evidence and Card structure".
2. **Extend "shows no Design ID badge or placeholder, and nothing prohibited"** with `expect(content).not.toMatch(/\b(?:faster|smaller|improv\w*|performance|maintainab\w*|benefit\w*|production-ready)\b/i)` and `expect(content).not.toMatch(/npm publish|publish (?:the|it|this)\b/i)`. In the implementation these are written with the literal two-character regex word boundary `\b` (backslash, letter b), never the backspace control character.
3. **Narrow the existing `not.toMatch(/install|tutorial|npm |ng add/i)`** (line 380). It becomes `not.toMatch(/install(?:ation)? (?:instructions|steps|guide)|npm (?:i|ci|install|pack|run)\b|ng add|tutorial/i)`, which keeps the prohibition on installation instructions, steps, guides, commands and tutorials and extends it to command forms. It is paired with an exact occurrence assertion proving that "separately built and installed" is the dialog's sole permitted use of `install`:

   ```ts
   const installWords = content.match(/install\w*/gi) ?? [];
   expect(installWords).toEqual(['installed']);
   expect(content.match(/separately built and installed/g)).toHaveLength(1);
   expect(content.replace('separately built and installed', '')).not.toMatch(/install/i);
   ```

   The first line fails on any second occurrence or any other form ("install", "installation", "installing"); the second fails if the phrase is missing or duplicated; the third proves the single occurrence is inside the phrase. With the Revision 2 copy ("re-exports that same Card") the dialog contains exactly one such word. Reason: the guard's intent (AC-17: About gives no installation tutorial) is preserved, while the truthful installed-package statement the amendment requires would otherwise fail it. **The Moderator approved this existing-assertion edit and recorded reason as O-1 on 2026-10-29.** The previously documented fallback was not selected and is not authorized for implementation.

Existing seven-section order, exactly-seven `section` count, two-link, `[href]`/`[target]` counts, headings and AC-17.1 to 17.7 assertions are all unchanged and must still pass. Existing AC-17.3 strings are all still present in the new copy.

**`keyboard-and-accessibility.spec.ts` (R5), first-visit About test (after the `getByRole('heading', { level: 3 })` text array):** add

```ts
const library = dialog.locator('section[aria-labelledby="gal-about-library"]');
await expect(library).toContainText('Atomic Design');
await expect(library).toContainText('Tag, SkeletonBlock and CodeWell are atoms');
await expect(library).toContainText('MediaArea and LoadingSkeleton are molecules');
await expect(library).toContainText('Card is the organism');
await expect(library.locator('a')).toHaveCount(0);
```

This exercises the production bundle. The seven-heading array and the exactly-two-links assertions remain untouched. The open-About axe scan in all four scopes and the About token-pair contrast test already cover the longer text with no change. No other e2e file changes; the brand/contrast and long-label specs and the exactly-three-specification rule are unaffected.

**Existing coverage that guards documentation truth and needs no change:** `card-structure.component.spec.ts` (levels, "Built from" lines, headings), `card.spec.ts`/`card-export.spec.ts` (AC-20), `verify-atomic-archive` (version 1.1.0, file dependency, lock integrity, no alias), `lint:tokens`, `check:assets`. No README unit test exists; README truth is checked by the review searches in §10 plus human review, with no new test file.

## 8. Version, manifest, lockfile and archive changes (exact)

1. `package.json`: `"version": "1.1.0"`.
2. `package-lock.json`: root `"version"` and `packages[""].version` set to `1.1.0`. Applied by editing those two lines, then proven with `npm ci` (which fails on a mismatched lockfile), the read-only `npm ls @brand-ui/atomic` (Phase C gate 2, expected installed 1.1.0), and `verify:atomic-archive` (lock version, resolved path and integrity). If `npm` rewrites anything else in the lockfile, stop.
3. `projects/ui/package.json`: `"version": "1.1.0"` (O-2). `ui` has no lock entry because workspace libraries are not in the lockfile; its `dist/ui/package.json` takes the version at build time.
4. Installed-file dependency: `"@brand-ui/atomic": "file:package-artifacts/brand-ui-atomic-1.1.0.tgz"` stays byte-identical in `package.json` and the lock root entry; the lock `node_modules/@brand-ui/atomic` entry (version 1.1.0, resolved, integrity) is untouched.
5. Archive: `package-artifacts/brand-ui-atomic-1.1.0.tgz` is untouched; `git diff --stat package-artifacts` is empty and its sha256 equals `59893275…`. `npm run verify:atomic-archive` (self-test then verifier) rebuilds `atomic` into a temporary directory, sanitizes and packs, and compares normalized content with the committed archive: expected "passed (@brand-ui/atomic@1.1.0; 9 files; … no drift from rebuilt package)".
6. Cross-check (read-only, retained and recorded in R9 in Phase E): a one-off `node -e` that reads root, `ui`, `atomic` manifests, lock root and lock atomic entry and prints all six versions; expected all `1.1.0`. No script is added or edited.
7. A `grep` for `1\.0\.0` and `0\.0\.1` across tracked non-historical files must show only historical records, evidence, tag references and third-party lock entries.

## 9. Environment and execution rules

Every command runs under `fnm exec --using=26.0.0` with `npm.cmd` and `NG_CLI_ANALYTICS=false`, as STEP-08 did. First check: `node --version` = `v26.0.0` and `npm --version` = `11.12.1`; stop on mismatch. The host default (24.13.0 / 11.6.2) is never used for a gate.

## 10. Verification phases

### Phase A — preflight, no edits
1. `git status --short` empty; `git rev-parse HEAD` equals the commit recording plan approval; `git rev-parse v1.0.0^{commit}` = `bd241525…`.
2. Node 26.0.0 and npm 11.12.1 check (§9).
3. Frozen evidence, read-only: `cd mod-w/evidence/d-12/before && sha256sum -c hashes.sha256` (29 entries) and `cd mod-w/evidence/d-12/after && sha256sum -c hashes.sha256` (23 entries); expected every line `OK`. Record the hashes of the `after/` tree contents; they must be identical at the end.
4. Factual re-audit of the Card structure view and `architecture.md` against §3 items 5 and 6. A discovered gap is a stop condition (§4): no edit to those paths is authorized by this plan.
5. Confirm no other source of the strings being replaced: `git grep -n "four components\|four standalone\|not distributed as a package\|no registry release, versioning" -- . ':!mod-w/evidence' ':!study-guides'` and list every hit, so nothing stale is missed. Hits in `mod-w/` historical records are not rewritten.

### Phase B — implement R1 to R8 (after approval only)
Make edits R1 to R8, then `npx prettier --write projects/ui/README.md` (R2 only). R9 is not created in this phase.

### Phase C — gates, in this order
Every command's exact command line, exit code and relevant output is retained as it runs (copied into the scratchpad or session log, not into the repository). Nothing is written to R9 from memory or from expected values.

| # | Command | Expected | Maps to |
|---|---|---|---|
| 1 | `npm ci` | exits 0; lockfile unchanged afterwards (`git diff --stat package-lock.json` shows only the R7 two lines) | AC-23 |
| 2 | `npm ls @brand-ui/atomic` (read-only) | exits 0; shows `@brand-ui/atomic@1.1.0` installed under `brand-ui@1.1.0`, with no `invalid`, `missing` or `extraneous` marker | AC-22, AC-23, MD-5 |
| 3 | `npm run verify:atomic-archive` | self-test passed; verifier passed; 1.1.0; 9 files; no drift; sha256 `59893275…` | AC-22, AC-23, AC-27 |
| 4 | `cd mod-w/evidence/d-12/before && sha256sum -c hashes.sha256`; `cd mod-w/evidence/d-12/after && sha256sum -c hashes.sha256` | 29 and 23 `OK`; zero changes | AC-26 |
| 5 | `npm run format:check` | exits 0 | AC-24, AC-27 |
| 6 | `npm run lint:tokens` | self-test and scan pass | AC-24 |
| 7 | `npm run check:assets` | passes; no restricted assets; archive inventory unchanged | AC-12, AC-24 |
| 8 | `npm run typecheck:e2e` | exits 0 | AC-24 |
| 9 | `npm test` | atomic, ui and gallery all pass including the new About assertions; no existing assertion fails | AC-20, AC-24, AC-27 |
| 10 | `npm run test:e2e` | the three specifications pass, axe included, no fourth spec | AC-17, AC-20, AC-24, AC-25, AC-27 |
| 11 | `npm run build` | atomic, ui and gallery production builds pass | AC-23, AC-27 |
| 12 | `npm run build:subfolder` | `/brand-ui/` build passes | AC-19, AC-23 |

Because `lint:tokens`, `typecheck:e2e`, `check:assets` and `format:check` should be unaffected by Markdown/text edits, any failure is a defect to correct and rerun, not to waive. Gates 5 to 12 are rerun in full after any fix.

### Phase D — documentation-truth review searches (read-only; output retained, recorded in R9 in Phase E)
Each must return the stated result over `README.md`, `projects/ui/README.md` and `about-panel.html`, with the bullets in §5 as the allowed context:
- `Atomic Design`: present in all three; in each README it is a `##` heading placed immediately after the intro/summary (check heading order with `grep -n '^#' README.md projects/ui/README.md`).
- Level mapping: `Tag`, `SkeletonBlock`, `CodeWell` appear only as atoms; `MediaArea`, `LoadingSkeleton` only as molecules; `Card` as the organism.
- `@brand-ui/atomic`, "re-export", "not moved"/"were not moved", "one Card"/"two separate": present as specified.
- `npm publish`, `publish `, `registry`, `npmjs`, "changelog": the only hits are negations ("not published", "no registry release", "no changelog").
- `production` / `client-delivery` / `rollout` / `official rebrand`: only existing negated wording.
- `benefit|faster|smaller|improv|performance|accessib|maintainab`: new-copy hits are only the single sentence "makes no claim about performance, accessibility or maintainability"; nothing else.
- `http` in `about-panel.html`: exactly the two existing URLs.
- ArtAnon logo/asset words: none added.
- Versions: `1\.1\.0` consistent; no `1\.0\.0` outside the "accepted 1.0.0 reference" sentences and the `v1.0.0` tag context.

### Phase E — evidence and final scope checks
1. Create `mod-w/evidence/step-09/commands.md` from the retained real output of Phase A, Phase C and Phase D (command, exit code, relevant output, plus the STEP-08 disposition statement in §11). The file may instead be started earlier and appended progressively as each command completes, but only with real output already in hand; either way it must be finalized, with every gate and search recorded and no placeholder, before step 2.
2. Run the final `git diff --check` (expected: no output) and `git status --short` (expected: exactly the nine §4 paths, R9 shown as new/untracked). These are the last commands, so the scope check includes the finalized evidence file. `git tag --points-at HEAD` is recorded unchanged. If R9 is edited afterwards, step 2 is repeated.

## 11. Preservation of accepted behavior and safeguards

- **AC-12:** the root README intro, brand status table, "Three brands, four scopes", shortcuts link and "Not production" meaning are unchanged or only strengthened; no production, client-delivery or rollout claim; `check:assets` rechecks asset absence.
- **AC-17:** seven sections in the same order with the same ids; the `ui library` heading unchanged; the five other sections' text unchanged except the one Panel-sections bullet; exactly two external links with unchanged attributes; the new About text has no link; no Design ID. All AC-17.1 to 17.7 unit and e2e assertions remain, with the single narrowing in O-1.
- **Reference-spike/non-production:** unchanged; reinforced in the status paragraphs.
- **Brand status wording:** untouched.
- **Existing links:** the MOD-W link, the repository link, the Product shortcuts link and the new in-document anchors only.
- **STEP-08 disposition:** `check:performance` and `measure:gallery:after` are **not run** and no plan step calls them; the `d-12/after/` tree is read-only (hash-verified before and after); nothing in the new documentation or R9 recharacterizes the result. R9 repeats only the accepted wording: the STEP-08 TBT result is an authoritative threshold breach, not a passing check, not attributed to the code, and no performance, accessibility or maintainability benefit is claimed.
- **Package boundary:** `projects/atomic` and the archive are unchanged, no alias or relative import is introduced, and nothing is published.

## 12. Acceptance-criterion mapping

| Criterion | Evidence |
|---|---|
| AC-12 | R1 intro and brand sections intact; Phase D searches; `check:assets` |
| AC-17 | R3/R4/R5 and the full unit and e2e About assertions |
| AC-20 | `npm test` (unchanged `card.spec.ts`), `npm run test:e2e`; no Card or behavior file touched |
| AC-21 | Documentation matches D-12 (§3 item 6); no change |
| AC-22 | Gates 2 and 3: installed 1.1.0 package; independent rebuild, inventory, manifest, no drift |
| AC-23 | Gates 1, 2, 3, 11, 12 |
| AC-24 | Gates 5 to 10 |
| AC-25 | Structure view audited (§3 item 5); existing unit and e2e coverage passes |
| AC-26 | Gate 4 only; accepted STEP-08 disposition carried forward, not rerun |
| AC-27 | R1 to R4 against the Phase D searches; version and archive consistency (§8); README build/pack/install guidance without publishing instructions |
| MD-5, MD-7 | 1.1.0 additive; `import { Card } from 'ui'` unchanged; nothing published |

## 13. Step acceptance checks, planned evidence

- Atomic Design explanation prominent in root README, `projects/ui/README.md`, and the About "The ui library" section: R1 to R4, Phase D.
- Card structure view and Public API/D-12 audited: §3 items 5 and 6, repeated in Phase A and recorded in R9.
- AC-27: R1 to R4 plus §8.
- AC-12 and AC-17: §11.
- AC-20 to AC-26 consistent with accepted disposition: §11, gates 4 and 9 to 12.
- Version/archive manifests consistently 1.1.0: §8.
- Nothing published, tagged, merged or deployed: no such command appears in this plan; R9 records `git tag --points-at HEAD` is unchanged.

## 14. Reference Implementation disposition

None exists. `mod-w/design/project/Main.dc.html` remains rejected visual evidence and is not read or edited. AC-20's unchanged Card behavior contract controls. No design file, token or Design ID changes.

## 15. Revised effort estimate

Step estimate was 3 hours. The amendment adds three authored documentation surfaces with exact copy, one new unit assertion group, an e2e addition, an extra README section and stale-statement corrections, plus the full final gate sweep under Node 26 (`npm ci`, `test:e2e` and two builds are the long runs).

| Work | Hours |
|---|---:|
| Phase A preflight, frozen-manifest checks, re-audit | 0.5 |
| Root README and `projects/ui/README.md` | 1.25 |
| About copy and panel edit | 0.5 |
| Unit and e2e assertions | 0.75 |
| Version, manifest and lockfile edits | 0.25 |
| Gates, fix-and-rerun margin | 1.5 |
| Phase D searches and R9 evidence | 0.5 |
| **Total** | **5.25** |

Revised estimate: **5.25 hours** (about 5 to 6), which is 2.25 hours over the original 3-hour allocation. The Moderator should record that as a roadmap-estimate change; the Development Team does not edit the roadmap.

## 16. Risks

1. **Existing assertion narrowing (O-1).** The "install" guard conflicts with the required wording. Mitigated by the approved narrowing, exact occurrence checks, and recorded Moderator reason; the fallback is not authorized.
2. **Long About copy.** Longer content may change scroll behavior in the dialog or the open-About axe/contrast tests. Mitigated by using existing paragraph styles and by running `test:e2e` before concluding; no layout or token change is allowed.
3. **Lockfile churn.** `npm` may rewrite more than two lines. Treated as a stop condition.
4. **Gate duration and host drift.** Gates need Node 26.0.0 under `fnm`. A host without it blocks the Step.
5. **README wording drifting from About wording.** Mitigated by the shared device in §6 and the Phase D searches.
6. **Over-claiming.** The word list in §6 and Phase D searches guard against benefit and production claims.
7. **`ui` version bump (O-2)** could be read as publishing intent; the status paragraphs state explicitly that it is not.

## 17. Resolved decisions

On 2026-10-29 the Moderator approved the exact Revision 2 plan and resolved O-1 through O-6 with the Tech Lead's recommendations below. O-1 includes the recorded reason required for the existing assertion edit.

| # | Decision | Approved disposition |
|---|---|---|
| O-1 | Narrow the existing About-spec guard `not.toMatch(/install\|tutorial\|npm \|ng add/i)` so the required phrase "separately built and installed" is permitted (existing-assertion edit). | Approved as corrected in §7 item 3, including the exact occurrence assertions and "re-exports that same Card". Recorded reason: Product prohibits installation steps, commands, guides and tutorials, not the truthful installed-package statement required by STEP-09. The fallback is not selected. |
| O-2 | Bump `projects/ui/package.json` from `0.0.1` to `1.1.0` ("consistently 1.1.0"). | Approved; `ui` is not packed or published, and its peer range `^1.1.0` is unaffected. |
| O-3 | Append "Card structure" to the Panel-sections bullet in the About panel and root README (a factual gap outside the "third section" instruction, within AC-27). | Approved; it is one phrase per surface. |
| O-4 | Dirty-tree premise: the four planning files are already committed in `4c2d3ef`. | Resolved: committed `4c2d3ef` is the confirmed baseline, verified by the Tech Lead; the Development Team leaves those paths untouched. |
| O-5 | Add a durable version-consistency check to `verify-atomic-archive.mjs` (which also needs a selftest edit). | Resolved as declined for STEP-09: no durable script; the recorded one-off read-only `node -e` check in §8.6 stands, keeping the path count at 9. |
| O-6 | `mod-w/evidence/step-09/commands.md` as the evidence location (new directory beside `d-12` and `step-06`). | Approved with the creation/finalization order in §10 Phase E. |

## 18. Stop conditions

Stop, report, and wait for the Moderator on: Node or npm mismatch; any frozen evidence manifest failing or any `d-12` file changing; a stale or unexpected baseline (HEAD not the approval commit, `v1.0.0` mismatch, dirty tree at start); archive drift, a changed archive hash, or a lockfile change beyond the two version lines; any need to edit `projects/atomic`, `scripts/**`, the Card, the structure view, a token, an API, `mod-w/design/**` or `angular.json`; an audit finding that would require editing the Card structure view or `mod-w/architecture.md` (neither is authorized by this plan); a new external link, an eighth About section or a change to the seven-section structure; any assertion beyond O-1 needing weakening; any wording that would need a performance, accessibility or maintainability claim, a production or delivery claim, or a publishing instruction; any release, publish, tag, merge or deploy need; a failed gate; any tracked or unignored path outside §4. A TBT figure is never rerun or reinterpreted.

After a clean run, stop for Tech Lead review. Do not self-approve and do not begin QA, the study-review gate, or any release action. Commits happen only when the Moderator asks.

MOD-W v5.0.1
