## Product Owner Sign-off — STEP-06

**Date:** 2026-10-28
**Commit validated:** `6cfef8a` (`feat(atomic): move Card behind installed package`), branch `feature/atomic-design`. Baseline for the move: `c52e50a`; original clean-start baseline `60b195c`.
**Placement:** Input to the Moderator's final gate, per Product A-21. This is not Step acceptance. The Product Owner does not accept the Step; the Moderator alone accepts it. STEP-07 is not active and was not started.

**Evidence basis:** Product Owner inspection of `git diff c52e50a..6cfef8a` and `git diff 60b195c..6cfef8a` (scope, unchanged-file and forbidden-path checks); the Card, part, export and manifest sources (`projects/atomic/**`, `projects/ui/src/lib/card/card.ts`, `card-export.spec.ts`, `projects/ui/package.json`); the e2e diff; the first 80 lines of `scripts/verify-atomic-archive.mjs` and the first 40 of `scripts/sanitize-atomic-dist.mjs`; `mod-w/step-06.md`, `mod-w/review.md`, `mod-w/qa.md` (Pass, with the Moderator's disposition), `mod-w/evidence/step-06/equivalence.txt`, `product.md` (S-14 to S-16, MD-4, MD-5, MD-8, MD-10, AC-20 to AC-24, A-13 to A-21), `architecture.md` D-12, `domain-language.md`, and `mod-w/po-signoff-step-05.md`. The Product Owner also extracted the committed archive (`package-artifacts/brand-ui-atomic-1.1.0.tgz`) into scratch and inspected its manifest, file list and imports. The Product Owner did **not** re-run any gate command, the equivalence harness (deleted by design), or `npm audit`. Gate results below come from the QA record, which the Moderator accepted on 2026-10-28.

### Verdict

**Accepted with notes.**

No criterion is unmet. AC-22's peer clause, the open point from STEP-05 (N1), is now met as written. The notes are record confirmations and carry-forward items, not defects in STEP-06.

### Acceptance check review

- **AC-20 Behavior preserved: met.**
  - Verified: `card.spec.ts` has the same SHA-256 (`61c60833…2b2`) at `60b195c` and `6cfef8a`. `public-api.ts` has no diff at either baseline. `projects/ui/src/lib/card/card.ts:1` is `export { Card } from '@brand-ui/atomic/organisms';`. `card-export.spec.ts:5-6` asserts `expect(Card).toBe(Installed)`, so there is no wrapper or copy.
  - Verified in source: selector `bui-card` and the eight inputs, with `title` required and `loading` using `booleanAttribute` (`projects/atomic/organisms/src/card/card.ts:14-23`). Host `[attr.title]: null` suppresses the tooltip (`card.ts:11`). `card.html:6-8` renders the loading state with the `Loading` span. `card.html:14` is the single `<a class="link">`, inside the `h3` (`card.html:12`). `aria-busy` is at `card.html:4`.
  - Taken from QA and the equivalence log: all Card tests pass (7 cases in `card.spec.ts`; 69 UI tests). The log has 648 records with zero differences in the control and normal runs. The deliberate 1px mutation produces 36 differences, so the comparison is capable of failing.
  - Product intent: met. The DOM is now composed of parts, but the accessibility snapshots, tab-stop sequence and computed-style slots match the old Card.
  - Notes: see N2 (the one e2e edit) and N6 (the equivalence harness is not in the repo).

- **AC-21 Decomposition matches D-12 and domain language: met.**
  - Names, levels and ownership match the D-12 table (`architecture.md:238-247`) and the atomic classification in `domain-language.md`. `Tag`, `SkeletonBlock` and `CodeWell` are atoms in `projects/atomic/atoms/src`. `MediaArea` and `LoadingSkeleton` are molecules in `projects/atomic/molecules/src`. `Card` is the organism in `projects/atomic/organisms/src`.
  - Only Card owns state. Its `interactive` computed and its `loading` input are the only state (`card.ts:23,25`). `MediaArea` takes only `label` and `tag` (`media-area.ts:19-20`), which D-12 allows. `LoadingSkeleton` and `CodeWell` take no inputs. No part has an `href`, a role, a live region, a busy state or a forced-state API.
  - `aria-hidden="true"` appears only on the decorative hosts: `SkeletonBlock` (`skeleton-block.ts:8`) and `LoadingSkeleton` (`loading-skeleton.ts:20`). The `Loading` text and `aria-busy` stay Card-owned.
  - Taken from QA: no standalone, OnPush, HostBinding, HostListener or `any` in the atomic TypeScript; no colour literals in atomic SCSS.

- **AC-22 Package builds, packs, declares peers, nothing published: met.**
  - Verified in the extracted archive: exactly nine files (`package/package.json`, four `fesm2022/*.mjs`, four `types/*.d.ts`). Name `@brand-ui/atomic`, version `1.1.0`. `peerDependencies` declares `@angular/core` `^22.2.0`. The only runtime dependency is `tslib`.
  - Verified in the bundles: the FESM files import `@angular/core` (six imports) and the atomic secondary entry points (`@brand-ui/atomic/atoms`, `/molecules`). They import no `@angular/common`, no `ui`, no router or forms package.
  - Verified: `grep` for `artanon`, `gallery` and `sourceMappingURL` over the extracted archive returns nothing. No `.map` file is present.
  - **Peer clause (N1): now met.** The package imports exactly one Angular package, `@angular/core`, and declares exactly that one as a peer. The clause holds on the literal reading ("declares its peer dependencies") and on the Option A reading the Moderator approved on 2026-10-28. STEP-06 added the declaration (`git diff c52e50a..6cfef8a -- projects/atomic/package.json`).
  - Taken from QA: `npx ng build atomic` and `verify:atomic-archive` exit 0 with no drift, and the sanitizer self-tests pass. The Product Owner did not re-run these.
  - Nothing published: the atomic manifest has no `publishConfig`, and no publish script was seen. `private` is absent (see O-a below). The verifier contacts no registry, per QA.

- **AC-23 Consumed as installed: met.**
  - Taken from QA and consistent with the root manifest reviewed at STEP-05: `@brand-ui/atomic` is pinned to `file:package-artifacts/brand-ui-atomic-1.1.0.tgz`, with the matching lock integrity.
  - `ui` imports the package by specifier, not by path: `projects/ui/src/lib/card/card.ts:1`. The root `tsconfig.json` keeps only its pre-existing `ui` alias (QA).
  - `angular.json` adds only the atomic `test` target (verified in the diff).
  - The one `paths` block that targets atomic source is `projects/atomic/tsconfig.spec.json:8-12`. It is consistent with AC-23's intent; see N3.
  - The e2e change (`e2e/long-label-and-bevel.spec.ts:322-325`) reads a file by path. It is not an import of package source. See N2.

- **AC-24 Existing gates still hold: met (QA evidence).**
  - The e2e diff (`git diff c52e50a..6cfef8a -- e2e/`) changes only one `readFileSync` path literal, from `projects/ui/src/lib/card/card.scss` to `projects/atomic/organisms/src/card/card.scss`. No assertion changed. `git ls-files e2e/*.spec.ts` shows exactly three specifications (QA).
  - The `ui` test count moved from 68 to 69 with the one new export-identity spec, which is consistent.
  - Taken from QA: `format:check`, `lint:tokens` (88 evasion fixtures and 4 atomic-discovery fixtures), `check:assets`, `typecheck:e2e`, unit tests (atomic 15, UI 69, gallery 64), 70 Playwright tests with axe, and both production builds all exit 0.

### Product-view checks

- **Unofficial-concept and reference-spike wording: preserved.** `git diff 60b195c..6cfef8a` has no change to `README.md`, `product.md`, `architecture.md`, `domain-language.md`, `projects/gallery` or `mod-w/design`. The About panel is in `projects/gallery`, which is unchanged. Nothing in the diff adds a production, delivery or rollout claim (QA's review agrees).
- **Scope discipline: no violation.** `git diff --stat 60b195c..6cfef8a` over `projects/gallery`, `projects/ui/src/lib/theme`, the Button, TextInput and Navigation sources, `mod-w/design`, `product.md`, `architecture.md` and `domain-language.md` returns 0 lines. No gallery structure view, token value, existing Design ID, Button/TextInput/Navigation move, publish or STEP-07 work is present. The 39-path count matches the approved amendment (24 new, 13 modified, 2 deleted).
- **Working tree:** `git status` shows `M mod-w/qa.md`. That is the Moderator's disposition paragraph, not part of `6cfef8a`. This sign-off does not change it.

### Criterion-to-check coverage (A-21)

Each of AC-20 to AC-24 is covered by a STEP-06 check: AC-20 by the unchanged-test and equivalence checks, AC-21 by the D-12 contracts and ownership checks, AC-22 by the build, pack and verifier checks, AC-23 by the consumption and configuration checks, and AC-24 by the existing gate set. Each is listed in `step-06.md` under "Verification commands and mapping" and "Acceptance checks". AC-25 and AC-26 belong to later Steps and are not in scope here.

### Notes and open questions

Ranked by whether they need a Moderator ruling. None is a STEP-06 defect.

**Moderator record confirmations (no code change required)**

- **N1 — AC-22 wording still shows the original text.** The Moderator's N1 ruling (`mod-w/po-signoff-step-05.md`, "N1 ruling", 2026-10-28) approved Option A. The clarification is recorded there, but `product.md:198` still has the original sentence, and the ruling says `product.md` is unchanged pending confirmation. For STEP-06 the clause is met either way (see AC-22 above), so this is only about the record. The Moderator should confirm the wording. The Product Owner does not edit `product.md`.
- **N2 — AC-20 "without assertion edits" and the e2e path literal.** The one e2e edit changes the file path that an existing assertion reads (`e2e/long-label-and-bevel.spec.ts:322-325`). The assertion itself is unchanged. The change falls inside the approved 39-path scope, so it is authorized. AC-20 asks for a "Moderator-recorded reason" for any existing-assertion edit. The Moderator should record that a path literal that follows a relocated file is not an assertion edit.
- **N3 — AC-23 and the producer-test `paths` exception (`projects/atomic/tsconfig.spec.json:8-12`).** AC-23 forbids path aliases and relative imports that reach package source "from the gallery or from `ui`". The exception is inside atomic's own producer specs, so the literal wording is met. The intent is also met: consumers never compile against source. The residual risk is that atomic's unit tests run against source, not the archive. That risk is covered by `verify:atomic-archive`, which rebuilds the package and reports no drift from the committed archive (QA), and by the consumer compile probes. The verifier also rejects consumers inheriting the exception (QA, N11). The Moderator should record this reading, which the Revision 4 plan already approved as D4.

**Carry-forward items (for the Tech Lead and STEP-09; not blocking)**

- **N4 — Manual pack flow is undocumented (QA C1).** QA is right that the build → sanitize → pack sequence is not discoverable. Product impact is real but deferred: AC-27 (STEP-09) requires the README to explain how the package is built and installed. `step-09.md:26` says "build, pack" and does not name the sanitizer step. If the README omits the sanitizer, AC-27 is not met. Recommend the Moderator direct that the STEP-09 README include the exact sequence.
- **N5 — Product effect of the `ui` peer.** `projects/ui/package.json:4-6` now requires `@brand-ui/atomic` `^1.1.0`. A consumer of `ui` must also have the archive installed. This is consistent with S-15, S-16 and MD-7, since nothing is published. STEP-09's README should say so.
- **N6 — The equivalence harness is not in the repo (by design).** AC-20's "behavior preserved" proof rests on `mod-w/evidence/step-06/equivalence.txt`. The harness was deleted before the final status check and never committed. The log is internally consistent (QA audit), and the plan named the log as the single approved artifact. A reviewer cannot re-run the comparison, so the Moderator should know that this evidence is a record, not a reproducible test.
- **N7 — `tslib` is declared but not used by the output.** `projects/atomic/package.json` declares `tslib` as a runtime dependency. None of the four FESM bundles imports it. D-12 (`architecture.md:285`) keeps `tslib` "where emitted output requires it". The declaration predates STEP-06 (it is in the `c52e50a` manifest), so this is an open question from STEP-05 that STEP-06 did not change. Harmless to consumers, but the Tech Lead should justify or drop it at the next manifest change. Dropping it changes the archive, so it needs its own step.
- **N8 — QA C2: `npm ci` reports 3 vulnerabilities (1 low, 1 moderate, 1 high).** I did not triage them. The archive's only runtime dependency is `tslib`, so these are not in the shipped package as far as the archive shows. They are dev-toolchain exposure and do not affect STEP-06's product criteria. They must be triaged before the consolidated release decision.
- **O-a (still open from STEP-05): no publish guard.** `projects/atomic/package.json` has no `"private": true` and no `publishConfig`. Adding `private` would change the reviewed archive, so it needs its own step. Decide before the first publish-adjacent Step.

**No product impact**

- **E1 — One transient Windows `EBUSY` during `npm ci` (QA).** The identical retry passed, and the implementation cannot cause it. No product consequence.
- **Limits.** QA ran on Windows 10 with Node 26.0.0 and npm 11.12.1 only. The archive's tar and gzip normalization is checked against that npm version. This does not change STEP-06's product verdict, but a cross-platform claim would need separate evidence.

### Readiness

**STEP-06 is ready for final Moderator acceptance.** There is no unmet acceptance criterion, no scope violation and no open product defect. The Moderator should record N1 to N3 and decide whether N4 is a STEP-09 requirement. None of these needs a code change.

This sign-off is input to the Moderator's final gate. It does not accept STEP-06, and it does not activate STEP-07.

## Moderator disposition

**Date:** 2026-10-28. The Moderator accepted this Product Owner review as input to the final gate. This is acceptance of the review only, not Step acceptance.

## Final Moderator approval

**Date:** 2026-10-28. The Moderator gave final approval of STEP-06 at commit `6cfef8a`, on the basis of the Tech Lead review, the fresh QA Pass and this Product Owner sign-off. The approval is the Moderator's; the Product Owner did not accept the Step. Notes N1 to N3 are for the Moderator's record and were not restated here, and N4 (the STEP-09 README must name the sanitizer pack sequence) carries forward to STEP-09. STEP-07 is not active and remains blocked until the Moderator activates it and separately approves the Development Team's exact plan.

---

MOD-W v5.0.1
