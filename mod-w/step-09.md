# STEP-09 — v1.1.0 documentation and release-candidate truth

**Status:** Active for implementation. On 2026-10-29 the Tech Lead passed Revision 2 and the Moderator approved the exact `mod-w/step-09-plan.md` Revision 2, its O-1 through O-6 dispositions, and its revised 5.25-hour estimate. Implementation is authorized only for R1 to R9 under that plan and its stop conditions. This is not STEP-09 acceptance or release authority. **Estimate:** 5.25 hours.

## Goal

Make version and documentation truthful for the completed extension, present the Card's Atomic Design implementation as a major project feature in user-facing and developer-facing documentation, and run the final release-candidate gates without publishing or deploying.

## Authority and traceability

- Product: MD-5, MD-7; AC-12, AC-17, AC-20 to AC-27; Moderator's 2026-10-29 Atomic Design documentation-priority amendment.
- Design IDs: document DS-061 to DS-066 and reused DS-030/031/035; no design change.
- No Reference Implementation exists; AC-20 remains the controlling behavior contract.

## Scope and expected files

- Root and package manifests/lock/archive version consistency; root README; `projects/ui/README.md`; the existing About panel's content and focused tests; architecture Public API wording only if evidence reveals an inaccuracy; final evidence records.

## Out of scope

Publishing, changelog, live `/brand-ui/` redeployment, features, tokens, APIs, Design IDs, design files, S-10/S-12/S-19, or performance/accessibility/maintainability benefit claims.

## Requirements

1. Version the additive release and atomic archive consistently as 1.1.0.
2. Treat the Card's Atomic Design implementation as a major project feature, not a footnote. Explain the Atomic Design idea in plain language and map this implementation accurately: `Tag`, `SkeletonBlock`, and `CodeWell` are atoms; `MediaArea` and `LoadingSkeleton` are molecules; `Card` is the organism; the parts are delivered by the separately built, installed `@brand-ui/atomic` package; `ui` re-exports the installed `Card`; Button, TextInput, and Navigation remain established `ui` components and were not moved.
3. Rank that explanation highly and consistently in every canonical user-facing and developer-facing product-documentation surface in STEP-09 scope:
   - Root `README.md`: a dedicated Atomic Design section immediately after the opening project/non-production introduction and before the brand and setup reference material.
   - `projects/ui/README.md`: a dedicated Atomic Design section immediately after the opening library summary, before build/install guidance.
   - About panel: lead the existing third section, “The ui library”, with the plain-language Atomic Design explanation and concrete Card mapping. Preserve the approved seven-section structure; do not add an eighth section or another external link.
   - Gallery Card structure view and `mod-w/architecture.md`: audit for terminology and factual consistency. They already expose the three Atomic Design levels and D-12 respectively; change them only if the audit finds an inaccurate or materially incomplete statement.
   Historical process records, evidence, generated logs, font provenance files, design artifacts, templates, and study guides are not product-documentation surfaces and are not rewritten for emphasis.
4. README explains build, pack, committed file installation, entry points, non-published status, four established `ui` components, atomic parts, and gallery relationship without publication instructions. The three primary surfaces use the same meaning but may adapt depth for their audiences.
5. Audit root README, library note, architecture Public API, About, and Card structure-view statements about “four components” and Atomic Design. Preserve the distinction between the four established `ui` components and the public atomic parts without implying that Card exists twice or that all four components moved.
6. Preserve AC-12/17 brand status, seven About content points, external-link safeguards, reference-spike/non-production meaning, and the prohibition on performance, accessibility, or maintainability benefit claims.
7. Do not publish, tag, merge, or deploy without a later Moderator instruction.

## Verification commands and mapping

```text
npm ci                                              # AC-23
npm run verify:atomic-archive                       # AC-22, AC-23, AC-27
sha256sum -c hashes.sha256                          # AC-26, run inside each frozen before/after evidence directory
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

Do not rerun `measure:gallery:after` or `check:performance`. STEP-09 verifies the frozen before/after manifests and carries forward the accepted STEP-08 threshold disposition: TBT is an authoritative breach, not a passing check.

Review must search for missing or low-prominence Atomic Design explanation, inaccurate level or package-boundary wording, false “four components” implications, publishing instructions, production/delivery claims, registry references, and inconsistent versions.

## Acceptance checks

- [ ] The Atomic Design explanation is prominent in the root README, `projects/ui/README.md`, and the existing About panel section, and accurately maps the three levels, installed package boundary, `ui` Card re-export, and components that did not move.
- [ ] The Card structure view and architecture Public API/D-12 wording are audited for consistency; no canonical user-facing or developer-facing product-documentation surface leaves Atomic Design unexplained or treats it as incidental.
- [ ] AC-27 all four documentation surfaces are truthful and README explains non-published build/install use.
- [ ] AC-12 and AC-17 claims, brand status, external-link safeguards, and no-production wording remain intact.
- [ ] AC-20 to AC-26 evidence remains consistent with its accepted disposition. The STEP-08 TBT threshold remains an authoritative breach, not a passing check, and is not rerun or recharacterized.
- [ ] Version/archive manifests consistently state 1.1.0.
- [ ] Nothing is published, tagged, merged, or deployed.

## Stop conditions and sequence

After STEP-09 acceptance, the separate consolidated study review uses written guides under
`study-guides/`, requires the Moderator's own-words demonstration, and remains pending until the
Moderator explicitly decides it is complete. Completing STEP-09 does not complete that gate.

Stop for Product meaning beyond this recorded emphasis amendment, new external link, change to the About panel's seven-section structure, feature/API/decomposition change, release/publish/deploy need, inaccurate statement needing wider authority, or failed gate. Exact Team plan → Moderator approval → implementation → Tech Lead review → fresh QA → Product Owner sign-off validating the documentation amendment and AC-20–27 coverage → Moderator acceptance. Release actions remain separate Moderator decisions.

