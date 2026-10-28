# Tech Lead Plan Re-review — STEP-06 Revision 3

## Verdict

**REVISE.** Revision 3 closes the four revision-2 Must-fix findings in substance, but the reconstructed exact plan has four approval-blocking gaps below. This is Tech Lead advice only—not Moderator approval, STEP-06 activation, acceptance, or permission to implement.

## Scope check

- The proposed six-part D-12 decomposition, installed Card re-export, archive refresh, atomic unit target, one Playwright source-path repair, and package peers remain within STEP-06 (`mod-w/step-06.md:15-29`; `mod-w/architecture.md:238-247,277-291`).
- No gallery specimen, Design ID, token value, brand/scope branch, forced-state API, fourth E2E specification, or Button/TextInput/Navigation move is proposed.
- The four Moderator items remain explicitly undecided, with recommendations: the producer-test-only `paths` exception, `ui` peer `^1.1.0`, `card-export.spec.ts`, and committed equivalence log.
- Revision 3 correctly keeps the one-line `projects/ui/src/lib/card/card.ts` re-export, an empty `projects/ui/src/public-api.ts` diff, and exactly three E2E specifications (`mod-w/architecture.md:287-289,299,311-315`).

## Findings

### Must fix before approval

1. **Make the nested equivalence workspace load the real CSS by resolvable paths.** Section 5.1 puts the harness `angular.json` under `.step06-harness/`, but section 5.2 gives the root-workspace literals `projects/ui/src/lib/theme/tokens/index.css` and `projects/ui/src/lib/theme/typography.css`. Angular resolves style entries from the harness workspace root, so those literals point under `.step06-harness/projects/...`, not to the repository sources. Change both app configurations to paths that resolve from the nested workspace to the exact two real files, keep their order equivalent to `angular.json:78-81`, and canonicalize/log their repository-relative names and hashes. Do not copy the CSS into the harness.

2. **Restore the exact loading-media presentation contract accepted in revision 2.** The current loading media node is both `.media` and `.skeleton` (`projects/ui/src/lib/card/card.html:6-12`), so it receives the complete media rule set—box sizing, 4:3 ratio, flex properties, padding, colors and small type—plus the pulse (`projects/ui/src/lib/card/card.scss:54-65,134-138`). Revision 3 only promises a “media-sized” `SkeletonBlock`, omits `media` from `LoadingSkeleton`'s retained classes, and says sizing classes sit on block hosts. That is weaker than the exact host/layout/retained-class contract previously accepted and cannot by itself preserve the planned computed-style comparison. Specify the first `SkeletonBlock` host and `LoadingSkeleton` SCSS precisely enough to retain the old `.media.skeleton` computed presentation and geometry, including the `media` class if the path-only E2E and equivalence role contract rely on it. Keep the four-block arrangement and Card-only busy/loading semantics required by D-12 (`mod-w/architecture.md:241,244-247,271`).

3. **Close the remaining structural `paths` bypass.** Revision 3 correctly gives the exempt spec config exactly three literal keys and one literal source target each, and correctly replaces the current regex at `scripts/verify-atomic-archive.mjs:204-217`. However, section 6.3 rejects non-exempt targets resolving into `projects/atomic` or `dist/atomic`, but does not reject a differently named alias whose target resolves into `node_modules/@brand-ui/atomic`. D-12 prohibits TypeScript path mappings for atomic consumption, including installed-package indirection (`mod-w/architecture.md:287-291`). Add `node_modules/@brand-ui/atomic` to the target-based rejection for every non-exempt config and add a negative using a non-`@brand-ui` key, so rejection proves target inspection rather than key inspection. The exact producer-test exception remains acceptable after this correction.

4. **Correct the expected-file count.** Section 7 says “the other 24 changed paths,” but its explicit lists contain 38 final changed paths when the evidence log is authorized: 23 new, 13 modified, and 2 deleted; without the log, 37. Replace the stale count with the correct conditional total or omit the count and make the enumerated list authoritative. Preserve the single-file `mod-w/evidence/step-06/equivalence.txt` exception, relative-path-only/no-secret rules, and the pre-existing `mod-w/review.md` baseline exception. STEP-06 requires an exact, reviewable scope (`mod-w/step-06.md:15-22,61-63`).

### Could fix later

- Clarify section 5.3's statement that CodeCraft Light and Dark “differ in the colour tokens.” Their color sets differ, but `--bui-color-accent` is intentionally identical at `#d4b483` (`projects/ui/src/lib/theme/tokens/codecraft-light.css:15`; `projects/ui/src/lib/theme/tokens/codecraft-dark.css:15`). The sentinel table itself is correct.
- Record the seven labels for `576 + 16 + 12 + 12 + 4 + 12 + 16` from the Moderator's revision-2 copy if available. The arithmetic and seven comparison kinds remain intact, but the exact earlier labels cannot be recovered from the repository.

## Revision-2 Must-fix disposition

1. **Card count — closed.** `card.spec.ts` has seven tests: four static, two interactive, and one loading (`projects/ui/src/lib/card/card.spec.ts:40-108`). Revision 3 consistently requires 7/7, an empty diff, and every assertion. It explicitly protects `.skeleton` count greater than zero (`card.spec.ts:106`) and exact `pre code` text (`card.spec.ts:66-70`). No “9 of 9” remains in revision 3.
2. **Real themes/fonts — closed subject to Must-fix 1.** The specified order matches the gallery (`angular.json:78-81`); all listed hex, RGB, rem, radius and corner-shape sentinels match the token CSS; the four surface-sunken values are pairwise distinct. `typography.css` contains exactly the seven listed `@font-face` rules (`projects/ui/src/lib/theme/typography.css:2-56`), and the plan triggers loads before awaiting `document.fonts.ready`. The 648 arithmetic, 32/128 and 16/64 figures, old-vs-old run, and 1px mutation run are preserved.
3. **Producer-test `paths` exception — mostly closed; Must-fix 3 remains.** The proposed literal config has exactly the three required mappings, no `baseUrl`, and only the root `extends`; replacing `compilerOptions.paths` drops the root `ui` mapping (`tsconfig.json:17-19`). Structural parsing, exact-file validation, inheritance rejection, and the requested negative families are otherwise specified. Consumer evidence remains installed-archive-only.
4. **Host and descendant semantics — closed.** Each of `Tag`, `SkeletonBlock`, `CodeWell`, `MediaArea`, and `LoadingSkeleton` is checked on its custom-element host and all descendants. `aria-hidden="true"` is limited to the two decorative component hosts and nested `SkeletonBlock` hosts; forbidden role, live/busy state, link and focus attributes are checked elsewhere. This matches D-12 (`mod-w/architecture.md:240-247`).

Nothing else accepted in revision 2 was weakened except the loading-media contract identified above. The plan preserves the Card API/semantics, toolchain gate, path-only Playwright edit and hash checks, one-line Card re-export, unchanged public API, and exactly-three-spec gate.

## Acceptance and Design-ID evidence mapping

| Check | Plan result | Implementation evidence still required |
|---|---|---|
| AC-20 | **Revise loading/equivalence details** | Empty `card.spec.ts` diff; 7/7 existing tests with every assertion; Card contract/export specs; valid 648-record equivalence; path-only E2E diff; installed `Card` compile probe |
| AC-21 | **Direction conforms to D-12** | Five focused part specs and Card contract; exact selectors, APIs, projection, host/descendant semantics, ownership, retained layout/classes |
| AC-22 | **Direction acceptable** | Node 26/npm 11.12.1 before/after; deterministic builds/packs; implemented nine-file archive; correct peers; inventory and no-drift verification |
| AC-23 | **Revise verifier rule** | Exact producer-test-only exception; all other alias forms rejected; clean `npm ci`; installed-archive harness and compile probes; no consumer source resolution |
| AC-24 | **Direction acceptable** | Atomic/UI/gallery unit results; token/assets/format/typecheck gates; exactly three Playwright specs with axe; production and subfolder builds |
| DS-030 — static | **Revise harness path** | Old/new static computed style, geometry and accessibility equivalence in all four real token/font scopes |
| DS-031 — interactive default | **Revise harness path** | Default interactive equivalence, one native title link/tab stop, stretched hit test in all four scopes |
| DS-032 — hover | **Revise harness path** | Real-hover computed style, geometry, hit-test and accessibility records in all four scopes |
| DS-033 — focus | **Revise harness path** | Real focus and visible Card focus-ring equivalence in all four scopes |
| DS-034 — active | **Revise harness path** | Real active-state equivalence in all four scopes |
| DS-035 — loading | **Revise loading contract and harness path** | Four-block geometry/style equivalence; 32 rest records, 128 normal-motion and 64 reduced-motion block checks; Card-only `aria-busy` and Loading text |

## Reference Implementation compliance

The prototype remains rejected as a Reference Implementation. Existing AC-20 Card behavior and approved D-12 boundaries control STEP-06 (`mod-w/step-06.md:9-13`; `mod-w/architecture.md:309`). Revision 3 proposes no prototype, `mod-w/design/`, token-value, or Design-ID change.

## Not verifiable from the repository

- The proposed components, specs, config, structural verifier, refreshed archive, lock integrity, and equivalence harness do not yet exist.
- No test, build, pack, install, lockfile, or implementation command was run for this plan review; future pass counts, Chromium/font behavior, archive determinism, clean installation, and gate results remain unproved.
- The exact revision-2 plan and its seven arithmetic-term labels were not supplied in the repository; only the prior review is available.
- Prettier's treatment of the projected `pre`/`code` template, Angular keyframe naming, and planned `reflectComponentType`/jsdom behavior require implementation evidence.
- Local Node/npm versions were not checked in this planning-only review.

## Next action

The Development Team should issue a narrow revision fixing the harness CSS paths, exact loading-media contract, remaining target-based alias rejection, and expected-file count. The Moderator must still activate STEP-06, resolve the conflicting status text in `CLAUDE.md`, `AGENTS.md`, `mod-w/roadmap.md`, and `mod-w/step-06.md`, decide the four open items, and separately approve the exact revised plan before any implementation.
