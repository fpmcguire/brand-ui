# QA — STEP-05

**Date:** 2026-10-28
**Tester independence:** Fresh QA session. I ran every command below myself and did not use Development Team or Tech Lead results as evidence. I read `mod-w/review.md` only to see how the Tech Lead treated peer dependencies. I changed no implementation, Product Owner, Tech Lead, prototype, design, architecture, roadmap, Step or study-guide file.
**Baseline (pre-implementation):** `0481987`
**Tested implementation:** `3f719fb` (Development Team)
**Tested HEAD:** `43c469b` (Tech Lead review and Moderator QA authorization; changes only `mod-w/review.md` and `mod-w/step-05.md`)
**Environment:** Windows 10, Git Bash, driven through `fnm exec --using=26.0.0 -- cmd.exe /d /s /c` with `MSYS_NO_PATHCONV=1`. Node v26.0.0, npm 11.12.1, TypeScript 6.0.3, Angular 22.2.x, ng-packagr 22.2.4.
**Starting workspace:** `git status --short` was empty before testing and after the build and test gates (build output is git-ignored).

## Summary

**Pass with notes.**

All 15 verification commands exit 0, the clean offline install succeeds, and I found no scope violation or regression. Two items need a Moderator ruling before acceptance (see Defects and observations):

- **N1:** the archive manifest declares no `peerDependencies`.
- **N2:** the entry points are empty `export {}` modules.

I did not round either up to an unqualified Pass.

**QA does not accept STEP-05.** Product Owner sign-off and final Moderator acceptance remain required. STEP-06 remains blocked and was not begun.

## Scope and diff audit

I inspected `git diff 0481987..3f719fb` (22 files, +1534/−12) and `git diff --name-status 3f719fb..43c469b` (two `mod-w` documents).

| Check | Result | Evidence |
| --- | --- | --- |
| No Card move | Pass | No file under `projects/ui` or `projects/gallery` changed; `projects/atomic/**/public-api.ts` contain only `export {};`. |
| No token, brand or Design-ID change | Pass | No CSS or token files changed. `check:assets` and `lint:tokens` found no token or font declarations in atomic source. |
| No gallery structure view, deployment or publish | Pass | No gallery file changed. No publish script was added. The only new script is `verify:atomic-archive`. |
| No source alias or relative atomic-source consumption | Pass | No `tsconfig*.json` has a `paths` entry. `angular.json` ui and gallery projects do not reference atomic. The verifier's consumer scan (every source file under `projects/ui`, `projects/gallery`, `e2e`) found no import of atomic source or output. |
| No `mod-w/design` change | Pass | Not in either diff. |
| Existing tests untouched | Pass | No `*.spec.ts` or `e2e/**` file appears in the diff, so no existing assertion was edited. |
| Expected files only | Pass | Matches the STEP-05 scope list: `angular.json`, `package.json`, lockfile, `projects/atomic/**`, the archive, and the verify/lint/assets scripts. |
| `@brand-ui/atomic` is 1.1.0 with root, atoms, molecules, organisms | Pass | Source `projects/atomic/package.json` and the archive manifest both say 1.1.0. The manifest `exports` has `.`, `./atoms`, `./molecules`, `./organisms` and `./package.json` only. |
| Approved peer and runtime dependencies | **Partial, see N1** | The runtime dependency is exactly `tslib ^2.3.0`. The manifest has no `peerDependencies`. |
| Committed archive is the installed dependency | Pass | `package.json` and the lockfile both give `file:package-artifacts/brand-ui-atomic-1.1.0.tgz`. The lockfile integrity matches the archive (verifier). The clean install resolved from the archive (below). |

## Commands and exit codes

All commands ran with Node 26.0.0 through `fnm exec`, from the repository root unless noted. Logs are in the session scratchpad `logs/` directory.

| # | Command | Exit | Relevant output |
| --- | --- | --- | --- |
| 1 | `node --version` | 0 | v26.0.0 |
| 2 | `npm --version` | 0 | 11.12.1 |
| 3 | `npx ng version` | 0 | Angular 22.2.x, ng-packagr 22.2.4, typescript 6.0.3, vitest 5.0.5 |
| 4 | `npx tsc --version` | 0 | Version 6.0.3 |
| 5 | `npx ng build atomic` | 0 | Built to `dist/atomic` in about 1.2 s |
| 6 | `npm pack ./dist/atomic --dry-run` | 0 | `@brand-ui/atomic@1.1.0`, 9 files, package size 470 B, unpacked 890 B, no registry contact |
| 7 | `npm run verify:atomic-archive` | 0 | Self-test: 70 archive, 19 consumer and 17 output fixtures passed. Verifier: 9 files, sha256 `6fb1f6c6…d620`, no drift |
| 8 | `npm run format:check` | 0 | All matched files use Prettier code style |
| 9 | `npm run lint:tokens` | 0 | Self-test: 88 evasion fixtures detected, 21 clean accepted, 4 atomic-package discovery fixtures rejected. Main scan: 51 contract tokens, 4 scopes |
| 10 | `npm run check:assets` | 0 | 6 font families, 9 atomic archive files, no restricted assets |
| 11 | `npm run typecheck:e2e` | 0 | No errors |
| 12 | `npm test` | 0 | ui: 5 files, 68 tests passed. gallery: 5 files, 64 tests passed (132 total) |
| 13 | `npm run test:e2e` | 0 | 70 passed, 0 failed, 3 spec files |
| 14 | `npm run build` | 0 | atomic, ui and gallery built |
| 15 | `npm run build:subfolder` | 0 | `dist/gallery/browser/index.html` has `<base href="/brand-ui/">` and `<meta name="robots" content="noindex, nofollow">` |
| 16 | `git diff --check` | 0 | No whitespace errors |
| 17 | `git status --short` after the gates | empty | Workspace unchanged |

Clean offline install (my own test, outside the repository, in `<scratchpad>\clean`):

- I copied `package.json`, `package-lock.json` and `package-artifacts/brand-ui-atomic-1.1.0.tgz` to the same relative paths. `cmp` confirmed all three are byte-identical to the repository copies.
- `node_modules` was absent before the test.
- `npm ci --offline` (no `--ignore-scripts`) exited 0: added 321 packages, 0 vulnerabilities, about 3 minutes.
- `node_modules/@brand-ui/atomic` holds `package.json`, `fesm2022/` (4 files) and `types/`. Its `package.json` is byte-identical to the archive's.
- The lockfile entry resolves to `file:package-artifacts/brand-ui-atomic-1.1.0.tgz` with the same sha512 integrity. There are no `registry.npmjs.org/@brand-ui` entries.
- With `import.meta.resolve` from the clean directory, `@brand-ui/atomic`, `/atoms`, `/molecules` and `/organisms` each resolved to `node_modules/@brand-ui/atomic/fesm2022/…` and imported without error (each has zero exports).
- No source alias, relative package-source import or pre-install bootstrap build was involved. The clean directory contains no `projects`, `dist` or `tsconfig`.

## Archive and mode-transform findings

- **Inventory (item 4):** `tar -tvzf` shows exactly 9 entries: `package/package.json`, 4 `fesm2022/*.mjs` (0 bytes each) and 4 `types/*.d.ts` (9 bytes each). Mtime is 1985-10-26 and owner is 0/0. I found no gallery, MOD-W, source-map, secret, font, image, token stylesheet or ArtAnon content. `check:assets` and the verifier also scan for these.
- **Size and hash (item 5):** 470 B. SHA-256 `6fb1f6c60f53171bc3475d14421963f4465f96db214ab204b8c9d318c017d620` (`sha256sum`), matching the required value.
- **Drift:** the verifier rebuilds `atomic` and repacks. It compares path and content hashes after normalizing volatile metadata, and found no drift. Byte-for-byte tarball equality is not asserted. The comparison is normalized by design.
- **Parser strictness (item 6):** I reviewed `scripts/atomic-archive.mjs` and the 70 archive fixtures in `scripts/verify-atomic-archive.selftest.mjs`. The fixtures cover each of these, and each rejected case asserts its own reason regex:
  - gzip header fields, trailer/deflate boundary, second member and trailing bytes;
  - every tar header field (checksum, magic, version, uid/gid, device numbers, linkname, uname/gname, header tail, NUL-clean name/prefix);
  - entry padding, truncation, missing or short terminator, payload after the terminator;
  - PAX: global headers, unsupported fields, duplicates, record-length lies, carrier name/prefix/owner, path shadowing, absolute and parent paths;
  - duplicate and case-folded effective paths, and symlink and GNU long-name types.
  The import-boundary fixtures cover 15 consumer forms and 12 output forms, plus the clean cases. I found no bypass.
- **`TAR_MODES` (item 7):** `scripts/atomic-archive.mjs:40` is `new Set(Array.from({ length: 0o1000 }, (_, mode) => (mode | 0o600) & ~0o022))`. I recomputed the image independently:
  - It has 32 modes.
  - Every mode has owner 6 or 7 and group and other each 0, 1, 4 or 5 (0 violations).
  - I generated a checksum-valid one-file archive for every mode 0000–0777 and fed it to `parseArchive`. Accept/reject agreed with the formula for all 512 modes (0 mismatches).

  | Mode | Result |
  | --- | --- |
  | 0600, 0755, 0640 | accepted |
  | 0664, 0666, 0775, 0777, 0400, 0444, 0660 | rejected with `tar header mode NNN is not approved` |

  0640 is accepted because the formula legitimately emits it. No fixture exercises 0640, so this was verified by my probe only (see O3).
- **Correction fixtures (item 8):** the four mode fixtures are 0600 and 0755 (accepted) and 0664 and 0400 (rejected). Each builds the header by mutation, then recomputes the checksum when the header is sealed (`mutated()` → `entry()` → `header()` seals after `overrides.mutate`). The 0664 and 0400 cases assert `/tar header mode 664 is not approved/` and `/tar header mode 400 is not approved/`. These are exact literal messages with no alternation or wildcard. A mismatched reason is reported as a failure by the harness (`rejected for the wrong reason`).
- **Actual npm-format positive fixture (item 9):** present, labelled "npm pack header format (gzip XFL 2/OS 255, padded octal fields, space-NUL terminators)". It builds an npm-style gzip header and ustar header with a space-NUL checksum, and passes.

## Acceptance-check evidence

| Check | Result | Evidence |
| --- | --- | --- |
| **AC-22** package independently builds and packs, manifest correct, inventory clean, nothing published | **Pass with notes** | Commands 5–7, 10. Build and pack succeed; 9-file inventory is clean; name and version are correct; entry-point exports are correct; no scripts or install hooks; nothing was published. **N1:** the manifest declares no peers. |
| **AC-23** clean `npm ci`, installed resolution, production and `/brand-ui/` builds, no alias or import | **Pass** | Clean offline install (exit 0) and installed resolution (above); commands 14–15; no `paths`, no consumer import, and ui/gallery do not reference atomic in `angular.json`. |
| **AC-24** static gates scan the package; self-test catches an atomic-source violation | **Pass** | `lint:tokens` self-test spawns the real scanner against a temporary atomic root: 4 violation fixtures (stylesheet literal, inline style, template style, brand name) are rejected and 1 clean fixture is accepted. `check:assets` scans atomic source and the archive. `format:check`, `typecheck:e2e`, unit tests and e2e all pass. |
| **AC-20** Card behavior and tests unchanged | **Pass** | No `projects/ui`, `projects/gallery` or spec change in the diff. 68 ui and 64 gallery tests pass. |
| **AC-19** static noindex and asset behavior | **Pass** | Subfolder build serves `<base href="/brand-ui/">` and `noindex, nofollow`. `check:assets` reports no restricted assets. |

## Regression and accessibility findings

- **Unit tests:** 68 (ui) and 64 (gallery) pass. No spec file was edited, so the AC-20 assertions are unchanged.
- **Playwright:** exactly three spec files (`brand-and-contrast`, `keyboard-and-accessibility`, `long-label-and-bevel`), 70 tests, all pass, including the About panel, DS-045/050/051 and the bevel fallback in four scopes.
- **Accessibility and axe:** the existing axe coverage lives in `keyboard-and-accessibility.spec.ts` (13 references) and passes unchanged. This Step adds no UI, so there is nothing new to test. I did no manual or assistive-technology testing, because it is not applicable to a scaffold with no rendered output.
- **Token discipline:** `lint:tokens` passes in all 4 scopes (51 contract tokens).
- **Static subfolder behavior:** confirmed from the built `index.html` (see command 15).
- **Regression found:** none.

## Defects, observations and known limitations

No defect found.

- **N1 (needs a Moderator ruling): no `peerDependencies` in the archive manifest.** AC-22 says the manifest "declares its peer dependencies", and STEP-05 says "D-12 peer/runtime dependencies". D-12 (`architecture.md` line 285) says the package "declares compatible Angular 22 packages it imports, including `@angular/core`, as peer dependencies". The scaffold imports nothing: the entry points are `export {};`. `scripts/verify-atomic-archive.mjs` deliberately fails a peer that is declared but not imported, and rejects an import of an undeclared Angular package. So the omission is consistent with D-12's "it imports" wording and with the verifier. A literal reading of AC-22 and item 2 of this QA brief is not demonstrable from the committed archive. I cannot decide this, so I record the peer clause as partially met. The Moderator should rule whether "declares its peer dependencies" is satisfied by the empty-peer scaffold, or must be revisited in the first Step that adds Angular imports (STEP-06 or later). The verifier would catch a missing peer then.
- **N2 (observation): entry points export nothing.** Resolution and import of all four entry points was proven, but none has a symbol. This is the Step's "empty/public-boundary components only where needed" and fits the Step.
- **O3 (observation): 0640 is not a fixture.** The accept/reject boundary was verified across all 512 modes by my own probe, not by a committed fixture. The committed fixtures cover 0600, 0755, 0664, 0400 and the wrong-reason guard.
- **O4 (limitation): offline install used the local npm cache.** `npm ci --offline` succeeded, so no registry was contacted. It depends on this machine's cache already holding the 320 registry packages. I did not test a cold cache.
- **O5 (limitation): install scripts ran** (no `--ignore-scripts`) and the install completed. I did not audit third-party install scripts.
- **O6 (limitation): single platform.** All of this ran on Windows 10 with Node 26.0.0 and npm 11.12.1. I did not test Linux or macOS, so the tar and gzip normalization (npm's header format) is verified only against this npm version.
- **O7: scratch files.** My probe scripts and the clean-install directory are in the session scratchpad, outside the repository. They are not committed.

## Final recommendation to the Moderator

Fresh QA finds STEP-05 behaving as specified: package, archive, installed boundary, scanners and preservation of existing behavior are all evidenced by independently run commands.

**Recommend:** proceed to Product Owner review, and rule on N1 (peer dependencies in an import-free scaffold) before final acceptance. If you read AC-22 literally, N1 is a Must-fix before acceptance.

QA does not accept STEP-05. Product Owner sign-off and final Moderator acceptance remain required, and STEP-06 remains blocked. I have not committed anything.

## Moderator disposition

**Date:** 2026-10-28. The Moderator accepted this QA review as the STEP-05 QA record. This is acceptance of the QA report only, not Step acceptance. Observation N1 (no `peerDependencies` in an import-free scaffold) remains open for the Product Owner and the Moderator's final gate. Product Owner sign-off and final Moderator acceptance remain required, and STEP-06 remains blocked.
