# STEP-05 — Atomic package scaffold, pack, and installed consumption

**Status:** Activated by the Moderator for planning only, 2026-10-28. Remote-reference/branch evidence and the D-12 before-measurement are accepted. Implementation remains prohibited until the Moderator separately approves the Development Team's exact plan.

**Estimate:** 5 hours. **Dependencies:** approved D-12/domain terms; `v1.0.0` pushed and verified on `origin`; extension branch created from `v1.0.0`; before-measurement recorded under D-12. By Moderator decisions on 2026-10-28, the study-review gates are consolidated as one additional written-guide gate after STEP-09 and are not a dependency for STEP-05 or any later build Step through STEP-09. Written guides live under `study-guides/`; they do not authorize implementation or replace the separate approval of this Step's exact Development Team plan.

## Goal

Create the second Angular library, its level entry points, and the reproducible `npm pack`/file-install path without moving Card or changing runtime behavior.

## Authority and traceability

- Product: S-15, S-16; AC-22, AC-23, package portions of AC-24; MD-1 to MD-3, MD-5, MD-7; A-18.
- Architecture: D-12. Design IDs: none implemented in this Step.
- No Reference Implementation exists (MD-10). AC-20's existing Card behavior contract replaces it.

## Scope and expected files

- `angular.json`, root `package.json` and lockfile; new `projects/atomic/**`; committed archive under the Step-approved artifact directory; package/archive verification scripts and focused tests.
- Empty/public-boundary components may be scaffolded only where needed to prove entry points; no gallery structure view and no Card move.

## Out of scope

Card migration, gallery specimens, tokens/brands/scopes/Design IDs, Button/TextInput/Navigation moves, publishing, live deployment, S-10, S-12, S-19, and `mod-w/design/**`.

## Required implementation

1. Add `@brand-ui/atomic` 1.1.0 as the second Angular CLI library with `atoms`, `molecules`, and `organisms` secondary entry points and D-12 peer/runtime dependencies.
2. Build independently, pack from `dist/atomic`, inspect the archive, commit the reviewed archive, and install it through an exact file dependency. Add a normalized content comparison that detects source/archive drift.
3. Prove a clean checkout can run `npm ci` and resolve the installed package without a path alias, relative source import, registry, or pre-install bootstrap build.
4. Extend `lint:tokens` discovery and its self-test to atomic-package source; extend `check:assets` to package source and archive inventory.

## Verification commands and mapping

```text
node --version                                      # toolchain
npm --version                                       # toolchain
npx ng version                                      # toolchain
npx tsc --version                                   # toolchain
npm ci                                              # AC-23 clean install
npx ng build atomic                                 # AC-22 independent build
npm pack ./dist/atomic --dry-run                    # AC-22 inventory
npm run verify:atomic-archive                       # AC-22, AC-23 reproducibility/install boundary
npm run format:check                                # AC-24
npm run lint:tokens                                 # AC-24 package scan and self-test
npm run check:assets                                # AC-22, AC-24
npm run typecheck:e2e                               # AC-24
npm test                                            # AC-20, AC-24
npm run test:e2e                                    # AC-20, AC-24; exactly three specs
npm run build                                       # AC-23 production build
npm run build:subfolder                             # AC-23, AC-19
git diff --check                                    # scope quality
git status --short                                  # scope evidence
```

Archive review must also show package name/version, peer dependencies, entry points, absence of gallery/MOD-W/secrets/assets, and no registry publish.

## Acceptance checks

- [ ] AC-22 package independently builds and packs with correct manifest and clean inventory.
- [ ] AC-23 clean `npm ci`, installed resolution, production build, and `/brand-ui/` build pass without source alias/import.
- [ ] AC-24 static gates scan the package and the self-test proves an atomic-source violation is caught.
- [ ] AC-20 tests and assertions remain unchanged and passing; runtime Card is not moved.
- [ ] AC-19 static noindex/asset behavior remains true.

## Stop conditions and sequence

Stop for missing pre-Step evidence, an unapproved file/peer/dependency, registry access, non-reproducible archive, source alias, changed existing assertion, or failed gate. Development Team submits an exact plan; Moderator approves it; Team implements and records evidence; Tech Lead reviews; fresh QA runs; Product Owner signs off; Moderator alone accepts. Do not begin STEP-06.

