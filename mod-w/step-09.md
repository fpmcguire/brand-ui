# STEP-09 — v1.1.0 documentation and release-candidate truth

**Status:** Step plan approved by the Moderator, 2026-10-28; blocked by STEP-08 acceptance and separate approval of the Development Team's exact plan. **Estimate:** 3 hours.

## Goal

Make version and documentation truthful for the completed extension and run the final release-candidate gates without publishing or deploying.

## Authority and traceability

- Product: MD-5, MD-7; AC-12, AC-17, AC-20 to AC-27.
- Design IDs: document DS-061 to DS-066 and reused DS-030/031/035; no design change.
- No Reference Implementation exists; AC-20 remains the controlling behavior contract.

## Scope and expected files

- Root and package manifests/lock/archive version consistency; root README; `projects/ui/README.md`; approved wording corrections to About only if required; architecture Public API wording only if evidence reveals an inaccuracy; final evidence records.

## Out of scope

Publishing, changelog, live `/brand-ui/` redeployment, features, tokens, APIs, Design IDs, design files, S-10/S-12/S-19, or performance/accessibility/maintainability benefit claims.

## Requirements

1. Version the additive release and atomic archive consistently as 1.1.0.
2. README explains build, pack, committed file installation, entry points, non-published status, four established `ui` components, atomic parts, and gallery relationship without publication instructions.
3. Audit root README, library note, architecture Public API, and About “four components” statements. Change only inaccurate wording through this approved scope while preserving AC-12/17 meaning and links.
4. Do not publish, tag, merge, or deploy without a later Moderator instruction.

## Verification commands and mapping

```text
npm ci                                              # AC-23
npm run verify:atomic-archive                       # AC-22, AC-23, AC-27
npm run check:performance                           # AC-26
npm run format:check                                # AC-24, AC-27
npm run lint:tokens                                 # AC-24
npm run check:assets                                # AC-12, AC-24
npm run typecheck:e2e                               # AC-24
npm test                                            # AC-20, AC-24, AC-27
npm run test:e2e                                    # AC-17, AC-20, AC-24, AC-25, AC-27
npm run build                                       # AC-23, AC-27
npm run build:subfolder                             # AC-19, AC-23
git diff --check
git status --short
```

Review must search for publishing instructions, false “four components” implications, production/delivery claims, registry references, and inconsistent versions.

## Acceptance checks

- [ ] AC-27 all four documentation surfaces are truthful and README explains non-published build/install use.
- [ ] AC-12 and AC-17 claims, brand status, external-link safeguards, and no-production wording remain intact.
- [ ] AC-20 to AC-26 final evidence remains passing.
- [ ] Version/archive manifests consistently state 1.1.0.
- [ ] Nothing is published, tagged, merged, or deployed.

## Stop conditions and sequence

Stop for Product meaning change, new external link, release/publish/deploy need, inaccurate statement needing wider authority, or failed gate. Exact Team plan → Moderator approval → implementation → Tech Lead review → fresh QA → Product Owner sign-off validating AC-20–27 coverage → Moderator acceptance. Release actions remain separate Moderator decisions.

