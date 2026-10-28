# STEP-06 — Move Card behind the installed atomic package

**Status:** Step plan approved by the Moderator, 2026-10-28; blocked by STEP-05 acceptance and separate approval of the Development Team's exact plan. **Estimate:** 4 hours.

## Goal

Implement D-12's parts and move Card behind installed `@brand-ui/atomic`, preserving AC-20 exactly and keeping `import { Card } from 'ui'` valid.

## Authority and traceability

- Product: S-14 to S-16; AC-20 to AC-24; MD-4, MD-5, MD-8.
- Design: visual/behavior evidence DS-030 to DS-035; no new gallery specimens yet.
- No Reference Implementation exists (MD-10); unchanged AC-20 Card behavior is the controlling contract.

## Scope and expected files

- `projects/atomic/**` implementations/tests for `Tag`, `SkeletonBlock`, `CodeWell`, `MediaArea`, `LoadingSkeleton`, `Card`.
- `projects/ui/src/public-api.ts`, removal of superseded Card source only after equivalence is proven, `projects/ui/package.json`, root manifest/lock/archive, and package verification scripts.

## Out of scope

Gallery structure view, DS-061 to DS-066, token values, brands/scopes, Button/TextInput/Navigation moves, existing assertion edits, docs/version release, publishing, and deployment.

## Requirements

1. Preserve `bui-card` selector and every input name, type, requiredness, default, and `loading` transform.
2. Preserve h3 title, static/interactive/loading DOM semantics, only link/tab stop, host-title suppression, `aria-busy`, and reduced motion.
3. Parts own only the D-12 boundaries. Isolated skeleton parts are decorative; Card alone owns loading status.
4. `ui` re-exports the installed organism class; no wrapper, duplicate Card class, source alias, or relative package-source import.

## Verification commands and mapping

```text
npm ci                                              # AC-23
npx ng build atomic                                 # AC-22
npm run verify:atomic-archive                       # AC-22, AC-23
npx ng build ui                                     # AC-20, AC-23
npm run format:check                                # AC-24
npm run lint:tokens                                 # AC-24, AC-3
npm run check:assets                                # AC-24
npm run typecheck:e2e                               # AC-24
npm test                                            # AC-20, AC-24
npm run test:e2e                                    # AC-20, AC-24
npm run build                                       # AC-20, AC-23
npm run build:subfolder                             # AC-23, AC-19
git diff --check
git diff -- projects/ui/src/lib/card/card.spec.ts    # AC-20: empty
git status --short
```

Compile probes must prove `import { Card } from 'ui'` and imports from all three atomic secondary entry points. Configuration review must prove installed-package resolution.

## Acceptance checks

- [ ] AC-20 existing Card assertions are byte-unchanged and pass; public inputs and import remain compatible.
- [ ] AC-21 implementation matches approved D-12 and domain language.
- [ ] AC-22 repacked archive contains the implemented parts and correct peer dependencies.
- [ ] AC-23 `ui` and builds resolve the installed archive only.
- [ ] AC-24 token, asset, unit, exactly-three-spec E2E, axe, format, and build gates pass.

## Stop conditions and sequence

Stop for any DOM/API/selector/assertion/token/Design-ID change, duplicate or wrapped Card, source import, new focus target/status, or failed gate. Exact Team plan → Moderator approval → implementation evidence → Tech Lead review → fresh QA → Product Owner sign-off → Moderator acceptance. Do not begin STEP-07.

