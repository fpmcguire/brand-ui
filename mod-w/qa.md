# QA — STEP-06

**Date:** 2026-10-28
**Tester independence:** Fresh QA session. I ran every gate below myself and used no Development Team or Tech Lead result as evidence. I read `mod-w/review.md` and `mod-w/step-06.md` only to learn the claims and the D1–D4 rulings under test. I changed no implementation, Product, Design, Architecture, Step, review or study-guide file. I did not commit, publish, deploy, self-approve or start STEP-07.
**Original clean-start baseline:** `60b195c`
**Amended baseline (parent):** `c52e50a`
**Tested commit:** `6cfef8a6f931453345160aaf6f6cafbc688b891a` (`feat(atomic): move Card behind installed package`), branch `feature/atomic-design`
**Starting workspace:** `git status --short` was empty before testing and empty after the last gate. Build output is git-ignored. The only change afterwards is this file.

## Verdict

**PASS.**

All 16 gate commands exit 0 with every expected count. I found no Must-fix or Should-fix defect and no scope violation. Two Could-fix observations and one environment note are below. None of them blocks sign-off.

**STEP-06 may proceed to Product Owner sign-off.** QA does not accept STEP-06. Product Owner sign-off and final Moderator acceptance remain required. STEP-07 stays blocked and I did not begin it.

## Environment and commit identity

The default shell exposed Node v24.13.0 and npm 11.6.2, which fails the precondition. Node v26.0.0 and npm 11.12.1 are installed under fnm, the toolchain the previous QA used. Every command below ran through `fnm exec --using=26.0.0 -- cmd.exe /d /s /c "<command>"` with `MSYS_NO_PATHCONV=1`. I did not treat the environment as Blocked, because the required toolchain was available and used.

| Item | Observed |
| --- | --- |
| Node (fnm 26.0.0) | v26.0.0 |
| npm | 11.12.1 |
| `git rev-parse HEAD` | `6cfef8a6f931453345160aaf6f6cafbc688b891a` |
| `git status --short` at start | empty (clean) |

## Commands, exit codes and observed results

| # | Command | Exit | Observed |
| --- | --- | --- | --- |
| 1 | `node --version` | 0 | v26.0.0 |
| 2 | `npm --version` | 0 | 11.12.1 |
| 3 | `git rev-parse HEAD` | 0 | `6cfef8a…891a` |
| 4 | `git status --short` | 0 | empty |
| 5 | `npm ci` | 0 on the second attempt | See the environment note. The first attempt failed with `EBUSY: resource busy or locked, rmdir …\node_modules\sass-embedded-win32-x64\dart-sass\src`. No sass or node process was holding the path. I changed nothing and retried the identical command once. It exited 0 and the working tree stayed clean. |
| 6 | `npx ng build atomic` | 0 | Built. |
| 7 | `npm run verify:atomic-archive` | 0 | Self-test: **70 archive, 19 consumer, 17 output, 9 sanitizer and 25 tsconfig fixtures**. Verifier: `@brand-ui/atomic@1.1.0; 9 files; archive sha256 59893275deda6cf582ad855fac4845bb86b5fb888780392a787612508e372c79; no drift from rebuilt package`. |
| 8 | `npx ng build ui` | 0 | Built. |
| 9 | `npm run format:check` | 0 | All matched files use Prettier code style. |
| 10 | `npm run lint:tokens` | 0 | Self-test: 88 evasion fixtures detected, 21 clean accepted, 4 atomic-package discovery fixtures rejected. Run: 51 contract tokens, 4 scopes, components clean. |
| 11 | `npm run check:assets` | 0 | 6 font families with OFL.txt and SOURCE.md; 9 atomic archive files; no restricted assets. |
| 12 | `npm run typecheck:e2e` | 0 | No diagnostics. |
| 13 | `npm test` | 0 | Atomic **6 files / 15 tests**; UI **6 files / 69 tests**; Gallery **5 files / 64 tests**. All passed. |
| 14 | `npm run test:e2e` | 0 | **70 passed** (1.7 m), Chromium. |
| 15 | `npm run build` | 0 | Production bundle generated. |
| 16 | `npm run build:subfolder` | 0 | `/brand-ui/` bundle generated. |
| 17 | `git diff --check c52e50a..6cfef8a` | 0 | No output (no whitespace errors, no CRLF warnings). |
| 18 | `git ls-files "e2e/*.spec.ts"` | 0 | Exactly three: `brand-and-contrast.spec.ts`, `keyboard-and-accessibility.spec.ts`, `long-label-and-bevel.spec.ts`. |
| 19 | `git status --short` | 0 | empty (clean) |

Archive sha256 recomputed with `sha256sum` on the committed file: `59893275deda6cf582ad855fac4845bb86b5fb888780392a787612508e372c79`, identical to the expected value and to the verifier's rebuild.

## Findings

### Must-fix

None.

### Should-fix

None.

### Could-fix

- **C1 — The manual pack flow has no discoverable entry point.** `scripts/sanitize-atomic-dist.mjs:5` documents `node scripts/sanitize-atomic-dist.mjs [dist/atomic]`. No `package.json` script or doc I searched (`README.md`, `docs`, `mod-w/docs`) describes the build → sanitize → pack sequence. The verifier does call the helper (`scripts/verify-atomic-archive.mjs:21,61`), so correctness is covered. Only the manual procedure's discoverability is affected. This is documentation, not behavior, and I recommend no action in STEP-06.
- **C2 — `npm ci` reports 3 vulnerabilities (1 low, 1 moderate, 1 high).** I did not triage them. They are outside STEP-06 scope and no STEP-06 gate depends on them. They may deserve a note at the consolidated release decision.

### Environment note (not a defect)

**E1 — One transient `EBUSY` during `npm ci`.** The first run failed on a Windows file lock. The identical retry passed. I believe this is a local indexer or antivirus lock and not a repository fault, but I cannot prove the cause. All later gates ran on the clean reinstall. Nothing in the implementation can cause it.

## Acceptance-criteria and Design-ID evidence

| Criterion | Evidence | Result |
| --- | --- | --- |
| **AC-20** Behavior preserved | `git diff 60b195c..6cfef8a` and `c52e50a..6cfef8a` are empty for `projects/ui/src/lib/card/card.spec.ts` and `projects/ui/src/public-api.ts`. `card.spec.ts` has 7 `it(` cases, and all UI tests pass (6 files / 69 tests). `projects/ui/src/lib/card/card.ts:1` is exactly `export { Card } from '@brand-ui/atomic/organisms';`. `card-export.spec.ts:5-7` asserts `expect(Card).toBe(Installed)` (class identity, no wrapper or copy). `projects/atomic/organisms/src/card/card.ts`: selector `bui-card`; the eight inputs `title` (required `string`), `description`, `meta`, `tag`, `mediaLabel`, `href`, `codeSample` (each optional `string`, default `undefined`) and `loading` (default `false`, `booleanAttribute`); host `[attr.title]: null`. `card.html`: `<article>` with `[attr.aria-busy]` set only while loading; `<h3 class="title">` holding the only `<a class="link">`, rendered only when `interactive()` (`!loading && !!href`); a single `<span class="visually-hidden">Loading</span>`. Loading drops the link. `card.contract.spec.ts` proves requiredness, defaults and the transform by behavior, as the amendment allows. The three Playwright specs pass without assertion edits (70/70). | Pass |
| **AC-21** Decomposition matches D-12 | `Tag` (atom): `template: '<ng-content />'`, no inputs. `SkeletonBlock` (atom): empty template, host `aria-hidden: 'true'`, pulse disabled under `prefers-reduced-motion`. `CodeWell` (atom): `<pre class="code"><code><ng-content /></code></pre>`. `MediaArea` (molecule): optional `label` and `tag`, composes `Tag`. `LoadingSkeleton` (molecule): host `aria-hidden: 'true'`, four `SkeletonBlock` instances, no text and no busy state. `Card` (organism): composes `CodeWell`, `LoadingSkeleton` and `MediaArea` and owns the title, link, state, `aria-busy` and `Loading`. Only `SkeletonBlock` and `LoadingSkeleton` hosts carry `aria-hidden`. No part adds a focus target, role, live region or busy state. A grep for `standalone`, `OnPush`, `HostBinding`, `HostListener`, `ngClass`, `ngStyle`, `CommonModule` and `any` over non-spec atomic TypeScript returns nothing. A grep for hex, `rgb` and `hsl` literals in atomic SCSS returns nothing, so no token values are duplicated. No part has a forced-state API or `.is-*` class. | Pass |
| **AC-22** Package builds, packs, declares peers | `ng build atomic` passes. The verifier rebuilds and finds no drift from the committed archive. The archive has exactly nine files: `package.json`, four `fesm2022/*.mjs`, four `types/*.d.ts`. Its manifest peers on `@angular/core ^22.2.0`, with runtime dependency `tslib`. `projects/ui/package.json` peers on `@brand-ui/atomic ^1.1.0`. A scan of the extracted archive finds no `sourceMappingURL`, `.map`, `projects/atomic`, drive path, user path, ArtAnon string, secret pattern, `.scss`, `.css` or `data:image`. `check:assets` passes against the 9 archive files. Nothing is published. | Pass |
| **AC-23** Consumed as installed | Root `package.json:30` and the lock pin `@brand-ui/atomic` to `file:package-artifacts/brand-ui-atomic-1.1.0.tgz`. The only `paths` blocks are the pre-existing root `ui` alias (`tsconfig.json:17`) and the exact exempt `projects/atomic/tsconfig.spec.json:8` (three producer-spec mappings). `angular.json` adds only the atomic `test` target with `include: ["../**/*.spec.ts"]`. No `projects/atomic`, `../atomic` or `dist/atomic` import exists in `projects/ui`, `projects/gallery` or `tsconfig*.json`. The sole textual reference outside the package is the E2E file-read path literal at `e2e/long-label-and-bevel.spec.ts:323`, which is a `readFileSync` path and not an import. The structural verifier in `scripts/atomic-tsconfig.mjs` and its 25 tsconfig fixtures cover JSONC, `extends` resolution, inherited effective values, target inspection, key shadowing (N1/N2/N5e), exemption structure (N6–N9), exempt content copied elsewhere (N10), exemption-inheritance rejection (N11) and missing `extends` (N14a). `ng build ui`, `npm run build` and `npm run build:subfolder` all pass against the installed archive. | Pass |
| **AC-24** Existing gates hold | `format:check`, `lint:tokens` (including 4 atomic-discovery fixtures and the 88/21 self-test), `check:assets`, `typecheck:e2e`, unit tests, 70 Playwright tests (including axe), and both production builds exit 0. Exactly three E2E specs remain. The only E2E change is `e2e/long-label-and-bevel.spec.ts:322-325`, a formatted path literal changing `projects/ui/src/lib/card/card.scss` to `projects/atomic/organisms/src/card/card.scss`. No assertion changed. | Pass |
| **DS-030** Static card | Unchanged Card template and styles, relocated by rename (`R053`, `R060`). The evidence log records 576 computed-style slots, 16 geometry-at-width, 12 accessibility and 12 tab-stop records at zero differences across four scopes. Specs pass 70/70. | Pass |
| **DS-031** Interactive card | One native title link and one tab stop (`tab-stop-sequence` 12, `stretched-hit-test` 4, zero differences). Keyboard and axe specs pass. | Pass |
| **DS-032** Hover | Hover records (part of the 12 `interaction` checks, 0 failed). No forced-state API exists in the source. | Pass |
| **DS-033** Focus | Focus records (12 `interaction` checks, 0 failed). `keyboard-and-accessibility.spec.ts` passes in the 70/70 run. | Pass |
| **DS-034** Active | Active records (12 `interaction` checks, 0 failed). | Pass |
| **DS-035** Loading | `aria-busy` and a single `Loading` span are Card-owned. `LoadingSkeleton` and `SkeletonBlock` are `aria-hidden`. The evidence log records `loading-semantics` 12 and `pulse-keyframes` 16 at zero differences, plus 32 rest, 128 normal-motion and 64 reduced-motion checks with 0 failed. | Pass |

The harness that produced the equivalence log is deleted from the tree by design, so I could not re-execute it. I verified the log's internal consistency and the claims that depend on committed sources, and relied on the independently re-run gates for behavior.

## Sanitizer review (`scripts/sanitize-atomic-dist.mjs`)

| Requirement | Evidence |
| --- | --- |
| Shared by manual and verifier flows | Imported at `scripts/verify-atomic-archive.mjs:21` and called at `:61`. It is also a CLI entry (`sanitize-atomic-dist.mjs:5,92-102`) and is imported by the self-test. |
| Requires exactly the three expected maps | `:38-42` report each missing expected map and each unexpected `.map`. |
| Requires terminal matching references | `:46-62` require exactly one `sourceMappingURL` per bundle, as the terminal line, naming the bundle's own map. |
| Rejects each bad case | Eight rejecting fixtures: missing map, additional map, missing reference, duplicate reference, non-terminal reference, malformed reference, reference to another map, reference in another file. Each fails for the right reason, and one clean case passes. That makes the 9 sanitizer fixtures observed in the verifier run. |
| Atomic failure | All problems are collected and thrown before any write (`:64-70`). The files are only mutated afterwards. |
| Proves nothing remains | Post-mutation scan at `:78-87` throws if any `.map` or `sourceMappingURL` text is left. The fixture checks that unrelated files are untouched. |

## Archive, installed-consumption, accessibility and scope rulings

- **Archive:** Pass. The identity, file inventory, peer declarations and content scan are all as expected and match the rebuilt sanitized output. Lock integrity is recorded as `sha512-2dbAP1Wqjnb3fQHt0O8h9ay5ikBVioujwmLxPshotXfM/IQzLd06nbbVGyjT5yUsA5mC/R4Frl67SrHaE6yVXQ==` in the evidence log and is consistent with the clean `npm ci`. The package.json lock entry was not otherwise re-derived.
- **Installed consumption:** Pass. `ui` resolves `@brand-ui/atomic` from `node_modules` (a file-installed tarball). The one `paths` exemption is exactly the producer's spec config, and the verifier rejects a copy of it or inheritance from it.
- **Accessibility:** Pass. The axe, keyboard and contrast specs pass (70/70). The DOM semantics are the AC-20 semantics. The parts add no focus target, role, live region or busy state, and `aria-hidden` appears only on the two decorative hosts.
- **Scope:** Pass. `git diff --name-status c52e50a..6cfef8a` lists 38 entries. Counting the two git renames as a delete plus an add, the implementation is **24 new, 13 modified, 2 deleted = 39 paths**, matching the approved amendment. The deleted files are `card.html` and `card.scss` under `projects/ui/src/lib/card/`. The two further paths are the MOD-W records `mod-w/review.md` and `mod-w/step-06.md`, which I treated separately. `git diff 60b195c..6cfef8a` shows no change under `projects/gallery`, `mod-w/design`, `mod-w/product.md`, `mod-w/architecture.md`, `mod-w/domain-language.md`, the theme/token files, or the Button, TextInput and Navigation sources. No gallery structure view, token value, Design ID, publication or deployment is present, and no STEP-07 work.

## Evidence-log audit (`mod-w/evidence/step-06/equivalence.txt`)

| Claim | Observed in log |
| --- | --- |
| 648 ordered records | `576 + 16 + 12 + 12 + 4 + 12 + 16 = 648` in all three runs; each category's count equals its expectation. |
| Control and normal runs have zero differences | Control `TOTAL differences: 0`. Normal `TOTAL differences: 0`. The two result JSON hashes are identical (`01f863b3…4ca12`), as expected for equivalent runs. |
| Deliberate 1px mutation is caught | Mutate run `TOTAL differences: 36` (20 computed-style plus 16 geometry); the other categories stay at 0. |
| Loading checks | 32 rest, 128 normal-motion, 64 reduced-motion, 0 failed in every run. |
| Fonts and sentinels | `built bundle @font-face rules: old 7, new 7 (required 7)`; `sentinel: 82 checks, 0 failed`. |
| Repository-relative paths only | Every path in the log is repository-relative. I found no drive letters or user paths. |
| Archive identity | The log's sha256 matches the committed archive and my recomputation. |
| Card sources identical across baselines | The log states that `card.ts` is the same at both baselines. The recorded `60b195c` hashes are consistent with the renamed files (`R053`/`R060`, which are renames and not rewrites). |
| Unchanged files | `card.spec.ts` and `public-api.ts` hashes equal their baselines in the log and match my empty diffs. |

## Deviation rulings (`mod-w/review.md`) in the built result

| Deviation | QA ruling |
| --- | --- |
| **D1** `--_stretch-0: ''` avoids a false drive-letter match while `.link::after` keeps computed empty content | **Acceptable.** The built result shows zero stretched-hit differences (`stretched-hit-test` 4, 0 differences). The verifier was strengthened elsewhere, not loosened. |
| **D2** `min-width`/`min-height` excluded from the computed-style list | **Acceptable.** The log explains why they differ (flex-item `auto` against `0px` after relocation). Used rectangles at 200, 280, 360 and 480px (geometry 16, 0 differences), the loading rest checks and the 36-difference mutation test show layout differences are still detected. |
| **D3** The log identifies the final archive hash and records final runs after D1 | **Acceptable.** The hash matches the committed archive and my recomputation. |
| **D4** `atomic.architect.test.options.include: ["../**/*.spec.ts"]` | **Acceptable.** `angular.json` shows exactly this producer-test-only setting, and the atomic suite runs 6 files / 15 tests. |

## Statement

STEP-06 passes fresh QA at commit `6cfef8a`. All gates, counts and inspections match the stated expectations. There are no Must-fix or Should-fix findings. **STEP-06 may proceed to Product Owner sign-off.** Final Moderator acceptance is still required, and STEP-07 remains blocked until the sequence completes.

## Moderator disposition of this QA review

**Date:** 2026-10-28
**Recorded at the Moderator's direction.** The Moderator accepted this QA review of STEP-06 (verdict **Pass**, commit `6cfef8a`) and directed it to be recorded here. No QA finding, evidence or ruling above was changed.

- **What this records:** the Moderator accepted the QA review as sufficient evidence for the QA gate. It is not acceptance of STEP-06.
- **Next gate:** Product Owner validation, recorded in `mod-w/po-signoff-step-06.md` (Product A-21). The Product Owner's sign-off is input to the Moderator's final gate and is not Step acceptance.
- **Still required:** Product Owner sign-off, then final Moderator acceptance of STEP-06.
- **STEP-07:** remains blocked and was not begun.

---

MOD-W v5.0.1
