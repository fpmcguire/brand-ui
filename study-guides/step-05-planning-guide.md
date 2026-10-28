# STEP-05 planning guide

## Status and authority

The Moderator activated STEP-05 for planning only. This file is a proposed Development Team plan
for separate approval. It authorizes no edit, generation, installation, archive creation, staging,
commit, publication, deployment, or implementation. STEP-06 remains inactive.

The plan follows `mod-w/step-05.md`, Product AC-20 and AC-22 through AC-24, Architecture D-12, and
the frozen `v1.0.0` behavior evidence. Atomic extension documents define approved scope and
boundaries; they are not implementation source or a Reference Implementation.

## Exact intended source and configuration changes

Subject to separate Moderator approval, the Development Team would change only:

- `angular.json` — register a second independently buildable Angular library named `atomic`.
- `package.json` — add the exact installed-archive file dependency and
  `verify:atomic-archive`; include atomic in the normal build as required for package verification.
- `package-lock.json` — lock that exact local archive dependency and its resolved package metadata.
- `projects/atomic/package.json` — declare `@brand-ui/atomic` version `1.1.0`, compatible Angular
  peer dependencies actually imported by the scaffold, `tslib` runtime dependency, and
  `sideEffects: false` if the generated output remains side-effect-free.
- `projects/atomic/ng-package.json` — build to `dist/atomic` from the root public API.
- `projects/atomic/tsconfig.lib.json` and `projects/atomic/tsconfig.lib.prod.json` — strict Angular
  library compilation using workspace conventions.
- `projects/atomic/tsconfig.spec.json` — focused unit/static probe configuration if the approved
  scaffold test requires Angular's test builder.
- `projects/atomic/src/public-api.ts` — package-root discoverability boundary only; no Card or
  production component implementation in this Step.
- `projects/atomic/atoms/ng-package.json` and `projects/atomic/atoms/src/public-api.ts` — empty
  public boundary for `@brand-ui/atomic/atoms`.
- `projects/atomic/molecules/ng-package.json` and
  `projects/atomic/molecules/src/public-api.ts` — empty public boundary for
  `@brand-ui/atomic/molecules`.
- `projects/atomic/organisms/ng-package.json` and
  `projects/atomic/organisms/src/public-api.ts` — empty public boundary for
  `@brand-ui/atomic/organisms`.
- `scripts/verify-atomic-archive.mjs` — rebuild/pack into a temporary directory; inspect package
  identity, version, peer/runtime dependencies and entry points; normalize volatile pack metadata;
  compare normalized paths and content hashes with the committed archive; reject forbidden paths,
  secrets, assets, gallery/MOD-W content, and source-path leakage.
- `scripts/lint-tokens.mjs` — add `projects/atomic` component-source discovery without weakening
  existing rules.
- `scripts/lint-tokens.selftest.mjs` — create its atomic violation fixture only in a temporary test
  area and prove package discovery, not merely the shared parser, rejects it.
- `scripts/check-assets.mjs` — scan atomic source and the committed archive inventory; reject
  duplicated fonts/token assets and prohibited third-party assets.
- `package-artifacts/brand-ui-atomic-1.1.0.tgz` — the reviewed archive produced from
  `dist/atomic` by `npm pack`, committed so a clean `npm ci` has no bootstrap build.

`package-artifacts/` is the proposed concrete interpretation of STEP-05's “Step-approved artifact
directory.” Its path is not fixed by the authoritative Step and therefore requires explicit
Moderator approval with this plan.

No other file is intended to change. In particular, STEP-05 will not change `projects/ui/**`,
`projects/gallery/**`, `e2e/**`, any existing Card assertion, `mod-w/design/**`, README/About copy,
tokens, fonts, or deployment configuration.

## Package and dependency operations

1. Confirm Node 26, npm 11, Angular 22.2, and TypeScript 6 versions.
2. Add the atomic library configuration and empty secondary entry-point boundaries.
3. Declare only compatible Angular peers actually imported by the scaffold, expected to be
   `@angular/core` for Angular declarations; add `@angular/common` only if generated source imports
   it. Keep `tslib` as the runtime dependency. Add no router, forms, gallery, `ui`, asset, token, or
   brand dependency.
4. Build `atomic` independently into `dist/atomic`.
5. Run a dry-run pack and inspect the inventory.
6. Pack from `dist/atomic` into a temporary directory, verify it, then place the reviewed archive
   at `package-artifacts/brand-ui-atomic-1.1.0.tgz`.
7. Add the root dependency as the exact file reference
   `file:package-artifacts/brand-ui-atomic-1.1.0.tgz` and regenerate the lockfile.
8. Run the normalized rebuild/pack/archive comparison.
9. Prove a clean checkout can run `npm ci` before any package build and resolves the installed
   archive without a registry lookup, path mapping, source import, or preinstall script.

Nothing will run `npm publish`, change a registry, publish a release, deploy a site, or begin the
Card migration.

## Commands and acceptance mapping

The exact proposed command sequence is:

```text
node --version
npm --version
npx ng version
npx tsc --version
npm ci
npx ng build atomic
npm pack ./dist/atomic --dry-run
npm run verify:atomic-archive
npm run format:check
npm run lint:tokens
npm run check:assets
npm run typecheck:e2e
npm test
npm run test:e2e
npm run build
npm run build:subfolder
git diff --check
git status --short
```

- **AC-22:** independent atomic build; dry-run inventory; verified archive identity/version,
  manifest, peer dependencies, entry points, and forbidden-content absence; no publish command.
- **AC-23:** clean `npm ci`; lockfile resolution from the committed exact file archive; configuration
  inspection for no alias/source import; production and `/brand-ui/` builds.
- **AC-24:** formatting; token scanner plus discovery self-test; asset/source/archive checks;
  e2e typecheck; unit tests; exactly the existing three Playwright specifications.
- **AC-20 recheck:** frozen Card source and assertions remain byte-for-byte unchanged; unit/e2e
  suites pass; `import { Card } from 'ui'` remains untouched because migration is STEP-06.
- **AC-19 recheck:** `/brand-ui/` build passes; static review confirms `robots.txt` noindex behavior
  and absence of prohibited third-party brand assets remain unchanged.

## Stop conditions and approval boundary

Stop immediately for an unlisted file or dependency, a changed existing assertion, a Card/gallery
change, registry access, missing entry point, archive/source drift, forbidden archive content,
source alias/import, non-clean install, fourth Playwright specification, failed gate, publish or
deployment pressure, or any need to enter STEP-06 scope.

The unresolved approval item is the proposed `package-artifacts/` path. The Moderator must approve
the complete file list, dependency set, archive workflow, command sequence, and that directory
before implementation. Approval of this written plan would activate implementation only for
STEP-05; it would not activate STEP-06 or complete any later study-review gate.
