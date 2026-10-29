# STEP-09 implementation: commands and gate record

Evidence of the STEP-09 implementation under the Moderator-approved Revision 2 plan (`mod-w/step-09-plan.md`, approval commit `19df07e50013f4098e93e14256557b38247bde9f`). Every result below is real output captured while the command ran. It makes no performance, accessibility or maintainability benefit claim.

Run on `feature/atomic-design`, based on `19df07e` (working tree edits, uncommitted). Node v26.0.0 and npm 11.12.1 through `fnm exec --using=26.0.0` with `npm.cmd` and `NG_CLI_ANALYTICS=false`. The host default (Node 24.13.0, npm 11.6.2) was not used for any gate.

## Carried-forward STEP-08 disposition

`npm run measure:gallery:after` and `npm run check:performance` were **not run**. The STEP-08 TBT result (809.362275 ms against 692.9999999999998 ms) remains an authoritative failed threshold, not a passing check, not attributed to the code. Nothing here reinterprets it. `mod-w/evidence/d-12/before/` and `after/` were verified read-only and are unchanged.

## Phase A: preflight (before any edit)

| Check | Result |
| --- | --- |
| `git status --short` | empty (clean) |
| `git rev-parse HEAD` | `19df07e50013f4098e93e14256557b38247bde9f` |
| `git rev-parse 'v1.0.0^{commit}'` | `bd241525a93afa468d069ca42bc300f62af3bd91` |
| `fnm exec --using=26.0.0 node --version`; `npm.cmd --version` | v26.0.0; 11.12.1 |
| `cd mod-w/evidence/d-12/before && sha256sum -c hashes.sha256` | exit 0; 29 `OK` |
| `cd mod-w/evidence/d-12/after && sha256sum -c hashes.sha256` | exit 0; 23 `OK` |
| sha256 of the sorted `after/` tree file hashes (`find ... \| xargs sha256sum \| sha256sum`) | `e360448ebb89f3952dc0d9b2248bd29f40bc4d87142156cae98ca81888d72688` |
| Re-audit, Card structure view | Unchanged since planning; Tag/Skeleton block/Code well atoms, Media area/Loading skeleton molecules, Card organism; imports only `@brand-ui/atomic/*`. No edit needed. |
| Re-audit, `mod-w/architecture.md` | D-12 and Public API accurate. No edit needed. |
| Stale-string search `git grep -n "four components\|four standalone\|not distributed as a package\|no registry release, versioning" -- . ':!mod-w/evidence' ':!study-guides'` | In-scope hits: `README.md` lines 23 and 74, `projects/ui/README.md` lines 3 and 5, `about-panel.html` line 58 (all addressed by R1 to R3). Other hits were in `mod-w/architecture.md:12` (accurate: `ui` exports four components), `mod-w/product.md`, `mod-w/step-02.md`, `mod-w/step-03.md`, `mod-w/step-09.md`, `mod-w/step-09-plan.md` (historical or governing records; not rewritten). |

## Phase B: implementation

Edited R1 to R8 as specified in sections 5 to 8 of the approved plan. `npx prettier --write projects/ui/README.md` reported `(unchanged)`. A first `format:check` failed (below), after which `npx prettier --write` was applied to `about-panel.html` (R3) only, and gates 5 to 12 were rerun.

## Phase C: gates (in plan order)

| # | Command | Exit | Relevant result |
| --- | --- | ---: | --- |
| 1 | `npm ci` | 0 | Installed from the committed archive; `git diff --stat package-lock.json` afterwards: 2 insertions, 2 deletions (the two root version lines only). |
| 2 | `npm ls @brand-ui/atomic` | 0 | `brand-ui@1.1.0` / `` `-- @brand-ui/atomic@1.1.0 `` (no invalid, missing or extraneous marker). |
| 3 | `npm run verify:atomic-archive` | 0 | Self-test passed (70 archive, 19 consumer, 17 output, 9 sanitizer and 25 tsconfig fixtures). `verify:atomic-archive passed (@brand-ui/atomic@1.1.0; 9 files; archive sha256 59893275deda6cf582ad855fac4845bb86b5fb888780392a787612508e372c79; no drift from rebuilt package).` |
| 4 | `sha256sum -c hashes.sha256` in `d-12/before` and in `d-12/after` | 0, 0 | 29 `OK` and 23 `OK`. Repeated after all edits and gates: both exit 0; `after/` tree hash still `e360448e…2688`. |
| 5 | `npm run format:check` | **1** (first run) | `Code style issues found` in `projects/gallery/src/app/gallery/about-panel/about-panel.html` (line wrapping of the new copy). Corrected with Prettier on that file; failed log retained. |
| 5 | `npm run format:check` (rerun) | 0 | `All matched files use Prettier code style!` |
| 6 | `npm run lint:tokens` | 0 | Self-test passed (88 evasion fixtures detected; 21 clean fixtures accepted; 4 atomic-package discovery fixtures rejected); `lint:tokens passed (51 contract tokens; 4 scopes; components clean)`. |
| 7 | `npm run check:assets` | 0 | `check:assets passed (6 font families with OFL.txt and SOURCE.md; 9 atomic archive files; no restricted assets)`. |
| 8 | `npm run typecheck:e2e` | 0 | `tsc -p e2e/tsconfig.json` clean. |
| 9 | `npm test` | 0 | atomic: 6 files, 15 tests passed; ui: 6 files, 69 tests passed; gallery: 6 files, 77 tests passed. Total 161 tests passed. |
| 10 | `npm run test:e2e` | 0 | `87 passed (2.7m)` in Chromium across exactly three specification files (`e2e/*.spec.ts` count: 3), axe included. |
| 11 | `npm run build` | 0 | `Built @brand-ui/atomic` (and its three entry points), `ui`, and the gallery production bundle; no errors. |
| 12 | `npm run build:subfolder` | 0 | Gallery built with `--base-href /brand-ui/`; no errors. |

Gates 6 to 8 were also run clean before the Prettier fix (exit 0 each); gates 5 to 12 were rerun in full after it, as the plan requires.

## Phase D: documentation-truth searches over `README.md`, `projects/ui/README.md` and `about-panel.html`

- **Atomic Design present:** match counts 3 (root README), 2 (`projects/ui/README.md`), 1 (About panel). Heading order: root README `# brand-ui` (line 1), `## Atomic Design in the Card` (line 7), then `## Brands and their status` (line 32); `projects/ui/README.md` `# ui`, `## Atomic Design in the Card` (line 5), `## Build and install` (line 17), `## Status` (line 23).
- **Level mapping:** `Tag`, `SkeletonBlock`, `CodeWell` appear as atoms and `MediaArea`, `LoadingSkeleton` as molecules (root README level table, `projects/ui/README.md` lines 9 and 10, About lines 64 and 65); `Card` as the organism in all three.
- **Boundary phrases present:** "re-exports that same class" / "re-exports that same Card"; "were not moved"; "two separate implementations"; "separately built and installed" (About and `projects/ui/README.md`; the root README says "separately built Angular package" and "installed from the committed archive").
- **Publish/registry/changelog:** every hit is a negation ("not published", "no registry release", "no changelog", "not fetched from a registry", "nothing ... asks anyone to publish it"); `npm pack` and `npm ci` references are local. No publishing instruction.
- **Production/client-delivery/rollout/official rebrand:** only the existing negated wording, the "Not production, not distributed" heading, "production configuration" and "production mode" (build mode).
- **Benefit words:** the only new-copy hits are the two sentences "makes no claim about performance, accessibility or maintainability"; the other hit is pre-existing text ("accessible name" in the Navigation long-label rule).
- **`http` in `about-panel.html`:** exactly two, `https://github.com/fpmcguire/mod-w` and `https://github.com/fpmcguire/brand-ui.git`.
- **Logo/artwork/photograph words added:** 0.
- **Versions:** 1.1.0 throughout the new text; `1.0.0` appears only in "the accepted 1.0.0 reference".
- **Stale strings** ("not distributed as a package", "no registry release, versioning", "has four components") in the three files: none.
- **Control characters:** none (U+0008 or any other) in any of the eight edited files; the regexes use the literal two-character `\b`.

## Version consistency (plan section 8.6, read-only one-off `node -e`)

`{"root":"1.1.0","ui":"1.1.0","atomic":"1.1.0","lockRoot":"1.1.0","lockRootPkg":"1.1.0","lockAtomic":"1.1.0","rootDep":"file:package-artifacts/brand-ui-atomic-1.1.0.tgz","uiPeer":"^1.1.0"}` (exit 0). The archive `package-artifacts/brand-ui-atomic-1.1.0.tgz` sha256 is `59893275deda6cf582ad855fac4845bb86b5fb888780392a787612508e372c79`, unchanged. `git diff --stat` over `package-artifacts`, `mod-w/evidence/d-12`, `projects/atomic`, `scripts`, `mod-w/architecture.md` and the structure view is empty.

## Final checks

Run after R9 was written, then rerun after this section was appended (identical results both times):

- `git diff --check`: exit 0, no whitespace errors (only the informational "LF will be replaced by CRLF" notices for the edited tracked files).
- `git status --short --untracked-files=all`: exactly nine paths: `M README.md`, `M e2e/keyboard-and-accessibility.spec.ts`, `M package-lock.json`, `M package.json`, `M projects/gallery/src/app/gallery/about-panel/about-panel.html`, `M projects/gallery/src/app/gallery/about-panel/about-panel.spec.ts`, `M projects/ui/README.md`, `M projects/ui/package.json`, `?? mod-w/evidence/step-09/commands.md`.
- `git tag --points-at HEAD`: empty, unchanged (no tag created). `git rev-parse HEAD`: `19df07e50013f4098e93e14256557b38247bde9f`, unchanged (no commit made).
- Nothing was published, tagged, merged, committed or deployed.

## Moderator amendment: source link in the root README (post-gate)

On the Moderator's instruction, the first body mention of "Atomic Design" in `README.md` (R1) now links to `https://atomicdesign.bradfrost.com/` (`**[Atomic Design](https://atomicdesign.bradfrost.com/)**`). The section heading is left as plain text so the `#atomic-design-in-the-card` anchor is unchanged. The About panel was not changed, so its two-link AC-17 safeguards and assertions are unaffected.

Per the Moderator's decision, no gates were rerun for this one-line README edit. A read-only search found no script, unit test or E2E test that reads `README.md`, and the file is outside the `format:check` glob. The gate results above therefore describe the tree as it was before this edit; the only difference since is this README link. After the edit: `git diff --check` exit 0; `git status --short --untracked-files=all` still lists exactly the nine R1 to R9 paths; HEAD is still `19df07e50013f4098e93e14256557b38247bde9f` with no tag.
