# Tech Lead Implementation Review — STEP-06

## Verdict

**APPROVE FOR FRESH QA.** The implementation matches the Moderator-approved Revision 4 plan and bounded source-map/tooling amendment. Static review found no code, scope, API, accessibility, token, package-boundary, provenance, or Reference Implementation defect.

The Tech Lead's independent command sequence stopped at its environment precheck because that shell exposed Node v24.13.0 and npm 11.6.2 rather than the required Node 26.x and npm 11.12.1. The Development Team supplied final-tree Node v26.0.0/npm 11.12.1 command evidence for every approved gate. On 2026-10-28, the Moderator approved this Tech Lead review and the Development Team's STEP-06 work and authorized progression to fresh QA. Fresh QA must independently rerun the exact gates under the required toolchain; Product Owner sign-off and final Moderator acceptance still remain. This is not self-approval by the Development Team and does not activate STEP-07.

## Scope check

- HEAD before the implementation commit was `c52e50a` on `feature/atomic-design`.
- The implementation scope is exactly 39 paths: 24 new, 13 modified, and 2 deleted. The deleted files are `projects/ui/src/lib/card/card.html` and `projects/ui/src/lib/card/card.scss`.
- `.step06-harness/` and the compile-probe folder are absent. The committed evidence log is the single approved harness artifact.
- `projects/ui/src/lib/card/card.spec.ts` and `projects/ui/src/public-api.ts` are byte-unchanged. Exactly three E2E specifications remain; the only E2E edit is the formatted source-path literal in `long-label-and-bevel.spec.ts`.
- No STEP-07 work, gallery structure view, token value, brand structure, existing Design ID, Button/TextInput/Navigation move, publication, or deployment is included.

## Findings

### Must fix before QA

None.

### Should fix

None.

### Could fix later

None.

## Implementation review

- `projects/ui/src/lib/card/card.ts` is exactly `export { Card } from '@brand-ui/atomic/organisms';`. `card-export.spec.ts` proves class identity; there is no wrapper or duplicate Card.
- Card retains the `bui-card` selector, eight signal inputs, required title, optional-input defaults, loading boolean transform, h3 title, one native title link/tab stop, host-title suppression, `aria-busy`, one Loading span, and loading/non-interactive behavior.
- `Tag`, `SkeletonBlock`, `CodeWell`, `MediaArea`, and `LoadingSkeleton` match D-12 ownership. They use semantic tokens, add no focus target, role, live region, or busy state, and use neither explicit standalone/OnPush nor `HostBinding`/`HostListener`. Only `SkeletonBlock` and `LoadingSkeleton` hosts own `aria-hidden`.
- The archive has the approved nine files, no maps/CSS/assets, SHA-256 `59893275deda6cf582ad855fac4845bb86b5fb888780392a787612508e372c79`, and lock integrity `sha512-2dbAP1Wqjnb3fQHt0O8h9ay5ikBVioujwmLxPshotXfM/IQzLd06nbbVGyjT5yUsA5mC/R4Frl67SrHaE6yVXQ==`. Atomic peers on `@angular/core` `^22.2.0`; `ui` peers on `@brand-ui/atomic` `^1.1.0`.
- `sanitize-atomic-dist.mjs` is the shared manual/verifier helper, strictly requires the three expected maps and matching terminal references, rejects malformed inventory/reference cases before mutation, removes only the approved material, and proves no map/reference remains. Its nine fixtures pass in the reported verifier run.
- `atomic-tsconfig.mjs` structurally parses JSONC, resolves relative `extends`, evaluates effective `paths`/`baseUrl`, rejects key shadowing and forbidden targets, enforces the exact producer-test exception, rejects inheritance from it, and has the approved N1–N14 plus positive fixtures. The installed-consumer verifier was strengthened, not loosened.
- `card.contract.spec.ts` checks all input names, title requiredness by behavior, defaults for description, meta, tag, mediaLabel, href, codeSample and loading, and the loading transform by behavior.

## Disclosed deviation rulings

1. **D1 — accepted.** `--_stretch-0: ''` avoids a false drive-letter match while `.link::after` retains computed empty content. The verifier was not loosened; final equivalence is zero-difference.
2. **D2 — accepted.** `min-width`/`min-height` are excluded because relocation changes their computed-value context from flex-item `auto` to `0px`. Used rectangles at all widths, including 200px, and loading rest dimensions preserve the behavioral check.
3. **D3 — accepted.** The evidence log identifies the final archive hash and records final control, normal, and deliberate-mutation runs after D1.
4. **D4 — accepted.** `atomic.architect.test.options.include: ["../**/*.spec.ts"]` is the exact approved producer-test configuration.

## Acceptance and Design-ID evidence mapping

| Check | Evidence | Disposition |
|---|---|---|
| AC-20 | Empty unchanged-test/public-API diffs; Card 7/7 reported pass; contract/export identity specs; installed compile probe; 648-record zero-difference equivalence; path-only E2E edit | Sufficient for QA |
| AC-21 | D-12 atom/molecule/organism contracts, exports, ownership, semantics, and retained Card behavior | Sufficient for QA |
| AC-22 | Independent atomic build/pack report; nine-file archive; peer/inventory/security checks; sanitizer; normalized no-drift result | Sufficient for QA |
| AC-23 | Exact producer-test exception; structural verifier; file-installed dependency; consumer scans, builds, and compile probes | Sufficient for QA |
| AC-24 | Reported format, token, asset, typecheck, unit, exactly-three-spec E2E/axe, and production-build gates | Fresh QA must confirm |
| DS-030 | Static style, geometry, accessibility, real theme/font, and four-scope equivalence | Sufficient |
| DS-031 | One native title link/tab stop and stretched-hit equivalence in four scopes | Sufficient |
| DS-032 | Forced-state and real-hover records | Sufficient |
| DS-033 | Forced-state and real-focus records, including focus-ring behavior | Sufficient |
| DS-034 | Forced-state and real-active records | Sufficient |
| DS-035 | Loading semantics, 32 rest, 128 normal-motion, 64 reduced-motion, and pulse-keyframe checks | Sufficient |

The evidence vector is `576 + 16 + 12 + 12 + 4 + 12 + 16 = 648`; old-vs-old and old-vs-installed-new each report zero differences. The deliberate 1px mutation reports 36 differences. The log records 82 sentinel checks, seven `@font-face` rules, repository-relative real theme inputs, and explicitly identifies the seven kind labels as implementation labels rather than recovered Revision 2 wording.

## Reference Implementation compliance

No Reference Implementation exists for the Atomic Design extension. The prototype remains rejected and was neither copied nor treated as technical authority. AC-20's unchanged Card contract and approved D-12 boundaries control STEP-06. No prototype, `mod-w/design/`, token-value, or Design-ID change is present.

## Next action

Fresh QA must independently run the complete STEP-06 gate set under Node 26.x/npm 11.12.1 and review the final commit. If QA passes, request Product Owner sign-off, then final Moderator acceptance. STEP-07 remains blocked until that sequence completes.

---

MOD-W v5.0.1
