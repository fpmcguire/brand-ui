## Product Owner Sign-off — STEP-05

**Date:** 2026-10-28
**Placement:** Recorded here at the Moderator's direction. `step-05.md`, `review.md`, `qa.md`, `architecture.md` and `product.md` are unchanged. This sign-off is input to the Moderator's final gate; it is not Step acceptance. The Product Owner does not accept the Step. The Moderator alone accepts it, and STEP-06 remains blocked.

**Evidence basis:** Product Owner inspection of `git diff 0481987..3f719fb` (22 files, +1534/-12), the committed archive manifest, the verifier's peer logic in `scripts/verify-atomic-archive.mjs`, and the QA record (`mod-w/qa.md`, Pass with notes). The Product Owner did not re-run the 17 gate commands. Gate results below rest on the QA record, which the Moderator accepted as the QA review on 2026-10-28.

### Verdict

Accepted with notes

The verdict is conditional on the Moderator's ruling on N1. The AC-22 peer clause is not met as written. It is met in product intent only if the Moderator accepts the D-12 reading or amends the AC-22 wording (see N1). If neither happens, AC-22 is not met and the verdict becomes Rejected for that clause.

### Acceptance check review

- **AC-22 package builds and packs: met, with one clause open (N1).**
  - Build and pack: met. QA ran `npx ng build atomic`, `npm pack ./dist/atomic --dry-run` and `verify:atomic-archive` with exit 0. The archive is 9 files, 470 B, SHA-256 `6fb1f6c6…d620`, and rebuilds with no drift.
  - Inventory: met. The product diff adds no gallery code, MOD-W file, secret, font, image or token stylesheet. The archive holds only `package.json`, four empty `fesm2022/*.mjs` files and four `types/*.d.ts` files.
  - Manifest identity: met. Name `@brand-ui/atomic`, version `1.1.0`, and exports `.`, `./atoms`, `./molecules`, `./organisms`.
  - Nothing published: met. No publish script, no `publishConfig`, and the verifier contacts no registry.
  - Peer clause: **not met as literal text.** The manifest has no `peerDependencies`. AC-22 says "its manifest declares its peer dependencies". D-12 says the package declares the Angular 22 packages "it imports" as peers. See N1.

- **AC-23 consumed as installed: met (QA evidence; Product Owner did not re-run).**
  - The root `package.json` pins `"@brand-ui/atomic": "file:package-artifacts/brand-ui-atomic-1.1.0.tgz"`. The lockfile carries the same file reference and the matching integrity. No registry entry exists for `@brand-ui`.
  - QA ran `npm ci --offline` in a copy holding only the manifest, lockfile and archive. Exit 0 with no `--ignore-scripts`. The four entry points resolved to `node_modules/@brand-ui/atomic/fesm2022/…`.
  - No `paths` entry exists in any `tsconfig*.json`. `angular.json` ui and gallery do not reference atomic. The verifier's consumer scan found no import of atomic source or output in `projects/ui`, `projects/gallery` or `e2e`.
  - Production and `/brand-ui/` builds: QA reports exit 0 (`npm run build`, `npm run build:subfolder`).
  - Limits: the offline install used the local npm cache, and QA did not test a cold cache. See the Notes.

- **AC-24 static gates scan the package and the self-test proves it: met (QA evidence).**
  - `lint:tokens` discovery was extended to `projects/atomic`. The self-test has four atomic-package violation fixtures (stylesheet literal, inline style, template style, brand name), and all four are rejected. QA reports one clean fixture accepted.
  - `check:assets` scans atomic source and the archive. Product diff reviewed: the scanner adds a brand-name rule (`THIRD_PARTY_BRAND`), which is a tightening, not a loosening.
  - `format:check`, `typecheck:e2e`, `npm test` (68 ui, 64 gallery), and `npm run test:e2e` (70 tests, exactly three spec files) all exit 0 per QA.
  - The diff touches no existing spec or `e2e/**` file, so no existing assertion changed.

- **AC-20 Card behavior preserved: met.**
  - The diff contains no change under `projects/ui` or `projects/gallery`, and no `*.spec.ts` or `e2e/**` file. The Card has not moved and no structure view exists. The existing 68 ui and 64 gallery unit tests and the three Playwright specifications pass unchanged per QA.
  - Product Owner verified the diff stat only. The `projects/ui` and `projects/gallery` diff is empty.

- **AC-19 static noindex and asset behavior: met (QA evidence).**
  - QA's `npm run build:subfolder` output shows `<base href="/brand-ui/">` and `<meta name="robots" content="noindex, nofollow">`. `check:assets` reports no restricted assets.
  - The diff adds no gallery file, no static asset and no remote resource. The `build` script now starts with `ng build atomic`, which does not change the gallery output.
  - The STEP-04 O-1 judgment (page-level `noindex` is the AC-19 control) stands unchanged.

### Notes

**N1 — AC-22 peer dependencies in an import-free scaffold (Moderator ruling required).**

- **The facts.** The scaffold imports nothing. Its entry points are `export {};`. The archive declares no `peerDependencies`. The verifier fails a peer that is declared but not imported, and fails an import of an undeclared Angular package.
- **The texts.** S-15 says the package "declares what it needs from its consumer". D-12 says it declares "compatible Angular 22 packages it imports, including `@angular/core`, as peer dependencies". AC-22 says "its manifest declares its peer dependencies" with no qualifier.
- **Product intent.** S-15's purpose is that a consumer installs the package and knows what it must provide. A package that imports no Angular code needs nothing from its consumer, so the empty-peer scaffold satisfies S-15's intent. AC-22's literal sentence is broader than that intent. Only the Moderator can decide which reading governs.
- **Self-enforcement.** The gap cannot persist silently. The first Step that adds Angular imports to the atomic output (STEP-06 or later) will fail `verify:atomic-archive` until `@angular/core` is declared as a peer. The verifier already requires that.
- **Recommendation (Option A, preferred):** Accept N1 as met for STEP-05. Have the Moderator record a one-line AC-22 clarification, for example "the manifest declares as peers the Angular packages its emitted output imports; at STEP-05 that set is empty and the verifier enforces both directions", with a reference to D-12. The amendment is a wording change to a product criterion, so the Moderator must make it. The Product Owner does not edit `product.md`.
- **Option B (stricter):** Declare `@angular/core` (`^22.2.0`) as a peer now. This needs a verifier change, because the verifier rejects declared-but-not-imported peers, and a manifest change the approved plan does not list. It is not recommended for a scaffold with no imports.
- **If the Moderator chooses neither:** AC-22's peer clause is not met, and the verdict becomes Rejected for that clause. The fix is Option B, applied through a new plan.

**Scope, forbidden-change and wording checks (all verified against the diff).**

- No Card move: no change under `projects/ui` or `projects/gallery`. Met.
- No gallery structure view: no gallery file changed. Met.
- No token, brand, scope or Design-ID change: no CSS, token or Design-ID file changed. Met.
- No `mod-w/design` change: the diff for `mod-w/design` is empty. Met.
- No deployment or publish: no publish script, no `publishConfig`, no deploy file. Met.
- No source alias or relative package-source import: met (AC-23 above).
- Reference-spike and unofficial-concept wording: unchanged, because no gallery or About file changed. Met.
- No production or client-delivery claim: no new claim appears in the diff. The only "production" strings are the `angular.json` build configuration name and the `ng-packagr` `production` config. Met.
- Only the allowed files changed: `angular.json`, `package.json`, the lockfile, `projects/atomic/**`, the archive, and the `scripts/*` gates and verifiers. Met.

**Observations (no effect on acceptance).**

- **O-a — no publish guard on the atomic manifest.** `projects/atomic/package.json` and the archive manifest carry no `"private": true` and no `publishConfig`. The root package is `private`. Nothing in STEP-05 publishes, and the verifier never contacts a registry. A `"private": true` guard in the atomic source manifest would be a cheap defence before the package ever leaves the repository. This is a recommendation for the Moderator and the Tech Lead. It is not a STEP-05 requirement, and adding it would change the reviewed archive.
- **O-b — empty entry points.** The four entry points export no symbol. QA confirmed that all four resolve and import without error. This matches the Step's "empty/public-boundary components only where needed". STEP-05 proves the boundary, not any component.
- **O-c — 0640 has no committed fixture.** QA verified the accept/reject boundary across all 512 modes with its own probe, not with a committed fixture. This does not affect acceptance, because the archive itself is clean.
- **O-d — install scripts ran.** QA ran `npm ci` without `--ignore-scripts`. The package has no install hooks, and the verifier rejects `preinstall`, `install`, `postinstall`, `prepare` and `prepublish`. Third-party install scripts were not audited.

**Limits of this validation and of QA's evidence (not verified by the Product Owner).**

- **Windows 10 only.** QA ran on Windows 10 with Node 26.0.0 and npm 11.12.1. Linux and macOS were not tested. The tar and gzip normalization is checked against this npm version only.
- **Local npm cache.** `npm ci --offline` succeeded because this machine's cache already holds the registry packages. A cold cache was not tested.
- **Empty entry points.** Resolution is proven. No symbol exports are exercised, so no runtime behavior of the package is proven at STEP-05.
- **Gate commands not re-run by the Product Owner.** The gate results above come from the QA record. The Product Owner verified the diff, the manifests, the verifier's peer logic and the forbidden-path diffs directly.
- **No assistive-technology testing.** Not applicable to a scaffold with no rendered output, as QA states.

**Recommendation to the Moderator.**

1. Rule on N1. Preferred: Option A, a recorded AC-22 clarification that the peer set is the set its output imports.
2. Decide whether O-a (a `"private": true` guard on the atomic manifest) is wanted before the first publish-adjacent Step. It is not required for STEP-05.
3. Make the final Step acceptance decision. The Product Owner does not accept STEP-05. STEP-06 remains blocked until the Moderator accepts this Step.

## Moderator disposition

**Date:** 2026-10-28. The Moderator accepted this Product Owner review as input to the final gate. This is acceptance of the review only, not Step acceptance. N1 (AC-22 peer dependencies in an import-free scaffold) has no recorded ruling and remains open. The Moderator's final Step acceptance is still required, and STEP-06 remains blocked.
