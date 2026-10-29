## Product Owner Sign-off — STEP-07

**Date:** 2026-10-29
**Commit reviewed:** `8397fe8` (`feat(gallery): add card structure view`), branch `feature/atomic-design`, plus one uncommitted change: the DS-062 Tag fix in `projects/gallery/src/app/gallery/structure/card-structure.component.scss`.
**Placement:** Input to the Moderator's final gate, per Product A-21. The Product Owner does not accept the Step; the Moderator alone accepts it. The Moderator accepted STEP-07 on 2026-10-29 and directed the Tag fix. STEP-08 is not active and was not started.

**Evidence basis:** Product Owner inspection of the structure view in all four scopes at 1280px and 400px, with Design IDs on and off, using a production build served on a spare port; DOM measurements (Tag width, heading order, group labels, `aria-busy` count, link count) in each scope; token-value contrast calculation for the isolated skeleton blocks; an 800px overflow check; and the code in `card-structure.component.{html,ts,scss}`, `structure-specimens.ts`, and `gallery-page.component.{html,ts}`. Gates were run on the working tree after the Tag fix (see Verification below).

### Verdict

**Accepted with notes.** The original Product Owner verdict was CHANGES REQUESTED for one bounded Tag fix. The fix has been applied and verified, so that condition is met. The remaining items were accepted or deferred as recorded below.

### Decisions

- **Skeleton contrast (QA Should-fix 1): accepted for this spike.** Computed ratios of the isolated skeleton blocks against their ground are 1.18 (ArtAnon Shop), 1.11 (IT English Mentor), 1.13 (CodeCraft Academy Light) and 1.05 (CodeCraft Academy Dark), falling to about 1.03 to 1.08 during the pulse. The blocks are decorative, hidden from assistive technology, and captioned. The same token drives the existing DS-035 card. A fix needs a token change, which is outside STEP-07 authority, so no change is requested here. Consequence to note: the DS-063 and DS-066 specimens are close to invisible in CodeCraft Academy Dark. A token fix, if wanted, needs its own Moderator-authorized step.
- **Tag stretch (QA Should-fix 2): fixed.** The DS-062 row says "The pill alone, reading 'Sample'". The figure's flex column stretched the Tag host to the full column width (270px in ArtAnon Shop, 280px in the other three scopes). Fix: one declaration, `align-self: flex-start`, on `.specimen bui-tag`, with a comment naming DS-062. It adds no token, no visual outside the approved row, and no change to structure, order, IDs or test IDs.
- **Could-fix-later items: acknowledged and deferred.**
  - Page-level horizontal overflow at 800px (document width 852px). The only element past the viewport is the existing `gallery-contrast-result` span. Nothing inside the structure section overflows. This commit does not touch the contrast-evidence files, so the overflow predates STEP-07. Defer.
  - Staggered card tops in a row when captions differ in length. Nothing overlaps. Defer.
  - "Loading" as a visually-hidden span rather than `role="status"`. Matches the existing Card and the spec wording. Accept.

### Product checks

- **Four scopes, desktop and 400px:** the section reads as one coherent, reviewable part of the product in ArtAnon Shop, IT English Mentor, CodeCraft Academy Light and Dark. Only P1 to P3 differ between scopes: the palette, the sample content and the code well. At 400px it is one column with no internal overflow.
- **Structure (DOM, all four scopes):** three labelled groups (Atoms, Molecules, Organism); eight figures; h3 for the section heading and for the DS-030 and DS-031 titles; no heading on DS-035; one link (DS-031); one `aria-busy` element (DS-035).
- **Captions:** with Design IDs on, the parts that compose each Card are readable, and the "Built from" lines match the design-spec rows DS-030, DS-031, DS-035, DS-065 and DS-066. With Design IDs off, the composition is still explained and the part names (Card, static / interactive default / loading) still carry the state. Only the "Shows the state of" line is removed.
- **Code well:** "Not used in this scope" in ArtAnon Shop and IT English Mentor is the approved sample-data rule, not a defect.
- **Third-party assets and wording:** the commit adds no image, logo or artwork files. The section uses only the existing "Sample" placeholder content. The header's "reference spike" and "unofficial concept exploration" wording is unchanged. No production, delivery or rollout claim is added.

### Verification after the Tag fix

Run on the working tree (commit `8397fe8` plus the one-declaration change) by the Product Owner, under Node 26.0.0 with npm 11.12.1, on Windows 10:

- `prettier --check` on the changed stylesheet: pass.
- `npm run lint:tokens`: pass (self-test: 88 evasion fixtures detected, 21 clean fixtures accepted, 4 atomic-discovery fixtures rejected; 51 contract tokens, 4 scopes, components clean).
- `npm run check:assets`: exit 0.
- `npm run typecheck:e2e`: exit 0.
- `ng test gallery --no-watch`: 76 passed.
- `npm run test:e2e`: 87 passed, 0 failed, 0 flaky, 0 skipped (three specs, axe included).
- Rendered check after the fix: the DS-062 Tag measures 70px to 75px wide in each scope, down from 270px to 280px, and reads as a pill beside the other specimens.

Not run by the Product Owner: the atomic and `ui` unit suites, `npm run build`, `npm run build:subfolder`, `npm run format:check` over the full tree, `verify:atomic-archive`, and a fresh QA pass of the Tag fix. The Tag change is confined to one gallery stylesheet, and the gates above cover it. Those gates are not claimed here as run.

### Limits

- Evidence is Windows 10 with Node 26.0.0 and npm 11.12.1 only. A cross-platform claim would need separate evidence.
- The skeleton contrast figures are computed from token values and the 0.45 pulse floor, not sampled from pixels.

This sign-off is input to the Moderator's final gate. It does not change the Moderator's acceptance of STEP-07 and does not activate STEP-08.

---

MOD-W v5.0.1
