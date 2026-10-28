# STEP-06 — Move Card behind the installed atomic package

**Status:** Implementation completed and approved by the Tech Lead for fresh QA. On 2026-10-28, the Moderator approved the Tech Lead implementation review and the Development Team's STEP-06 work and authorized progression to fresh QA. Fresh QA passed and was accepted by the Moderator on 2026-10-28; Product Owner sign-off was recorded in `mod-w/po-signoff-step-06.md`; the Moderator gave final acceptance of STEP-06 on 2026-10-28. STEP-07 is not active and must be activated and separately planned before it begins. The implementation follows the approved Revision 4 plan and bounded source-map/tooling amendment, including the exact producer-test-only `paths` exception, `ui` peer `^1.1.0`, `card-export.spec.ts`, and the single committed equivalence log. **Estimate:** 4 hours.

## Goal

Implement D-12's parts and move Card behind installed `@brand-ui/atomic`, preserving AC-20 exactly and keeping `import { Card } from 'ui'` valid.

## Authority and traceability

- Product: S-14 to S-16; AC-20 to AC-24; MD-4, MD-5, MD-8.
- Design: visual/behavior evidence DS-030 to DS-035; no new gallery specimens yet.
- No Reference Implementation exists (MD-10); unchanged AC-20 Card behavior is the controlling contract.

## Scope and expected files

- `projects/atomic/**` implementations/tests for `Tag`, `SkeletonBlock`, `CodeWell`, `MediaArea`, `LoadingSkeleton`, `Card`.
- `projects/ui/src/public-api.ts`, removal of superseded Card source only after equivalence is proven, `projects/ui/package.json`, root manifest/lock/archive, and package verification scripts.

### Approved Revision 4 implementation amendment

The real Angular 22.2 ng-packagr output adds three secondary-entry FESM source maps and terminal `sourceMappingURL` comments, which violate the approved nine-file, no-source-path archive contract. The Moderator approved this bounded correction after the Development Team stopped at the archive gate:

- Add dedicated `scripts/sanitize-atomic-dist.mjs` as the 39th changed path; the final scope is 24 new, 13 modified and 2 deleted paths. Do not place packaging logic in `scripts/atomic-tsconfig.mjs`.
- The sanitizer must require exactly the three expected secondary-entry maps, remove only their matching terminal comments, delete those maps, reject missing/additional/malformed/nonterminal references, and prove no map or `sourceMappingURL` remains. The manual pack flow and verifier rebuild use the same helper; focused coverage belongs in the already-listed verifier self-test.
- `atomic.architect.test.options.include` may be `["../**/*.spec.ts"]` because the secondary-entry specs are outside `projects/atomic/src`; this remains producer-test-only.
- Card input requiredness and `booleanAttribute` may be proved behaviorally because `reflectComponentType` does not expose them. The contract spec must also assert `description`, `meta`, `tag`, `mediaLabel`, `href`, and `codeSample` default to `undefined`, and `loading` defaults to `false`.

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

