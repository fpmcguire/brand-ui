# Tech Lead Plan Re-review — STEP-06 Revision 4

## Verdict

**APPROVE FOR MODERATOR CONSIDERATION.** Revision 4 closes all four Revision 3 Must-fix findings without weakening the accepted plan. This is Tech Lead advice only—not Moderator approval, STEP-06 implementation activation, acceptance, or permission to implement.

## Scope check

- The six D-12 parts, installed Card re-export, archive refresh, atomic test target, path-only Playwright repair, and package peers remain within STEP-06 (`mod-w/step-06.md:15-29`; `mod-w/architecture.md:238-247,277-291`).
- No gallery specimen, Design ID, token value, brand/scope branch, forced-state API, fourth E2E specification, or Button/TextInput/Navigation move is proposed (`mod-w/step-06.md:20-29`; `mod-w/architecture.md:297-301`).
- The plan preserves seven unchanged Card tests, the one-line installed re-export, an empty `projects/ui/src/public-api.ts` diff, and exactly three E2E specifications (`projects/ui/src/lib/card/card.spec.ts:40-108`; `projects/ui/src/public-api.ts:5-13`; `mod-w/architecture.md:287-289,299`).
- Leaving the atomic primary entry point as `export {}` is acceptable. D-12 says the root **may** re-export symbols and identifies the three secondary entry points as canonical; `ui` consumes `organisms` (`mod-w/architecture.md:279-289`). No additional Moderator decision is required for that deferral. The implementation must still prove all three secondary exports.
- The exact producer-test mapping is consistent with D-12 and AC-23: ng-packagr owns the secondary entry points, while only the producer unit-test config maps their source APIs. Gallery, `ui`, E2E, and the harness remain installed-archive consumers (`mod-w/architecture.md:279-289`; `mod-w/product.md:199`; `projects/atomic/atoms/ng-package.json:1-5`; `projects/atomic/molecules/ng-package.json:1-5`; `projects/atomic/organisms/ng-package.json:1-5`).

## Findings

### Must fix before approval

None.

### Could fix later

None.

## Revision 3 Must-fix disposition

1. **Harness CSS paths — closed.** From `.step06-harness/`, both `../projects/ui/...` entries resolve to the repository's real token index and typography sheet. Their order matches the gallery's first two style entries (`angular.json:78-81`). Canonical repository-relative names, forward slashes, byte hashes, identical app arrays, loaded CSS/font sentinels, and the no-copy/stop rule are explicit.
2. **LoadingSkeleton contract — closed.** The first `SkeletonBlock` host retains `media skeleton`; its split SCSS preserves the old cascade's display, box sizing, aspect ratio, flex declarations, padding, background, color, small type, pulse, reduced motion, and square media surface (`projects/ui/src/lib/card/card.scss:54-65,134-159,171-184`). The four `.skeleton` hosts satisfy the unchanged nonzero assertion (`projects/ui/src/lib/card/card.spec.ts:94-107`). `aria-busy` and `Loading` remain Card-owned, while decorative `aria-hidden` is limited to the approved hosts (`projects/ui/src/lib/card/card.html:6-13`; `mod-w/architecture.md:241,244-247,271`).
3. **Structural `paths` verification — closed.** Every non-exempt target is inspected for `projects/atomic`, `dist/atomic`, and `node_modules/@brand-ui/atomic`; N5 uses a non-`@brand-ui` key and requires a target-specific failure. JSONC parsing, inherited effective values, `baseUrl`, `extends`, templates, cycles, case-insensitive normalization, the exact three-key producer exception, and positive/negative self-tests are specified. This replaces the current regex gap (`scripts/verify-atomic-archive.mjs:204-217`) while retaining the installed-consumer scan (`scripts/verify-atomic-archive.mjs:218-234`).
4. **Expected-file count — closed.** The authoritative lists total 38 paths with the evidence log: 23 new, 13 modified, and 2 deleted; without the log, 37. The single-file evidence exception retains repository-relative forward-slash paths, hashes, and no absolute path, username, environment, or secret content.

The CodeCraft clarification and loading sentinels are correct: Light and Dark have different color sets but the same `--bui-color-accent: #d4b483`; all four surface-sunken/text-muted values match source, and CodeCraft's shared `space-3`/small-size values resolve to 12px/13px (`projects/ui/src/lib/theme/tokens/artanon.css:5-7,31,38`; `projects/ui/src/lib/theme/tokens/mentor.css:5-7,31,38`; `projects/ui/src/lib/theme/tokens/codecraft.css:12,19`; `projects/ui/src/lib/theme/tokens/codecraft-light.css:5-7,15`; `projects/ui/src/lib/theme/tokens/codecraft-dark.css:5-7,15`).

## Acceptance and Design-ID evidence mapping

| Check | Plan disposition | Implementation evidence still required |
|---|---|---|
| AC-20 | Approved direction | Empty `card.spec.ts` diff; 7/7 pass; Card contract/export specs; valid 648-record equivalence; path-only E2E diff; installed `Card` compile probe (`mod-w/product.md:196`) |
| AC-21 | Approved direction | Five part specs and Card contract proving D-12 selectors, APIs, ownership, semantics, layout, and retained classes (`mod-w/architecture.md:238-247`) |
| AC-22 | Approved direction | Node 26/npm 11.12.1 gates; independent build/pack; nine-file archive; peers, inventory, and normalized no-drift evidence (`mod-w/product.md:198`) |
| AC-23 | Approved direction | Exact producer-only exception; structural verifier self-tests; clean install; installed-archive harness/builds/probes; no consumer source resolution (`mod-w/product.md:199`) |
| AC-24 | Approved direction | Token/assets/format/typecheck/unit/E2E/axe/build gates; exactly three Playwright specifications (`mod-w/product.md:200`) |
| DS-030 — static | Approved evidence plan | Old/new computed style, geometry, accessibility, and real-theme/font equivalence in four scopes (`mod-w/design/design-spec.md:256-261,456`) |
| DS-031 — interactive default | Approved evidence plan | One native title link/tab stop and stretched hit-test equivalence in four scopes (`mod-w/design/design-spec.md:257-261,457`) |
| DS-032 — hover | Approved evidence plan | Real-hover style, geometry, accessibility, and hit-test records (`mod-w/design/design-spec.md:258-261,458`) |
| DS-033 — focus | Approved evidence plan | Real focus and visible Card focus-ring equivalence (`mod-w/design/design-spec.md:258-261,459`) |
| DS-034 — active | Approved evidence plan | Real active-state equivalence (`mod-w/design/design-spec.md:258-261,460`) |
| DS-035 — loading | Approved evidence plan | Four-block presentation/geometry, 32 rest records, 128 normal-motion and 64 reduced-motion checks, and Card-only loading semantics (`mod-w/design/design-spec.md:258-261,278,461`) |

## Reference Implementation compliance

The prototype remains rejected as a Reference Implementation. Existing AC-20 Card behavior and approved D-12 boundaries control STEP-06 (`mod-w/step-06.md:9-13`; `mod-w/architecture.md:309`). Revision 4 proposes no prototype, `mod-w/design/`, token-value, or Design-ID change.

## Not verifiable from the repository

- Revision 3's full plan and Revision 2's original seven comparison-term labels are absent; unchanged details were checked against the Revision 3 review and cited sources, but the Moderator should retain the requested plan-to-plan diff.
- The proposed components, specs, atomic test config, structural verifier, refreshed archive/lock, and equivalence harness do not yet exist.
- No build, test, pack, install, lockfile, or implementation command was run for this planning review. Future pass counts, builder acceptance of parent-relative styles, Chromium/font behavior, Angular-scoped keyframes, projected `pre`/`code` formatting, reflection under jsdom, archive determinism, and clean installation remain unproved.
- Local Node/npm versions were not checked; Revision 4 correctly makes any implementation-time mismatch a stop condition.

## Next action

The Moderator should decide the four still-undecided items and then separately approve or reject this exact Revision 4. The Tech Lead recommendations remain **Approve** for the exact producer-test-only `paths` exception, `ui` peer `^1.1.0`, `card-export.spec.ts`, and the single committed equivalence log. Only after those decisions and exact-plan approval may implementation begin; STEP-07 remains blocked until STEP-06 receives implementation evidence, Tech Lead review, fresh QA, Product Owner sign-off, and Moderator acceptance (`mod-w/step-06.md:61-63`).
