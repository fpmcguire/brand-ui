# CLAUDE.md

## Role

Default: Development Team using Claude Code. Implement only the active Moderator-approved Step in MOD-W. The Moderator has final authority; Codex reviews before QA.

## Sources of truth

1. Moderator instructions.
2. `mod-w/product.md`.
3. Approved `mod-w/design/design-spec.md` within bounded design authority.
4. `mod-w/architecture.md`.
5. `mod-w/domain-language.md`.
6. Active `mod-w/step-xx.md`.
7. Existing source and tests.

The prototype and `architecture-notes.md` are evidence only. Never import/copy implementation from, or edit, `mod-w/design/`.

## Required process

1. Wait for the Moderator to identify and activate the Step.
2. Restate scope, requirements, Design IDs, checks, and expected files.
3. Inspect relevant files and versions.
4. Propose a short plan and stop for Moderator approval before writing.
5. Make the smallest in-scope implementation.
6. Run every Step gate until clean.
7. Report evidence against each check and Design ID.
8. Stop for Codex Tech Lead review; do not self-approve.

## Project rules

- Angular 22.2, Node 26, TypeScript 6; standalone, zoneless, signals-based.
- Do not set `standalone: true` or explicit `ChangeDetectionStrategy.OnPush`.
- Use `input()`, `output()`, `model()`, `computed()`, and `linkedSignal()` as appropriate; never signal `mutate`.
- Use `inject()`, not constructor injection.
- Use native control flow and narrow imports; no `CommonModule`, `ngClass`, `ngStyle`, `@HostBinding`, or `@HostListener`.
- Prefer inline templates only for genuinely small components. External paths are relative to component TypeScript.
- Use strict types; do not use `any` where `unknown` is correct.
- Meet WCAG 2.2 AA and all active-Step accessibility checks.
- Components consume semantic tokens only. Brand switching never selects component structure.
- Gallery imports the four established components through `ui`. During an approved Atomic Design extension Step, structure specimens import approved parts through installed `@brand-ui/atomic` secondary entry points, never workspace source, a TypeScript alias, or a relative package-source path.
- There are three brands across four scopes; CodeCraft Light/Dark are modes of one brand.
- Never add ArtAnon logos, artwork, photography, or other third-party brand assets.
- Preserve reference-spike and unofficial-concept wording; make no production/client-delivery claim.

## Scope discipline

- S-10, S-12, and S-19 are unauthorized. STEP-01 through STEP-05 are accepted. D-12, its domain terms, and the STEP-05 through STEP-09 plan were approved by the Moderator on 2026-10-28. No extension implementation begins until the Moderator activates the individual Step and separately approves the Development Team's exact plan.
- The Moderator accepted origin's annotated `v1.0.0` dereference to `bd241525a93afa468d069ca42bc300f62af3bd91`, the `feature/atomic-design` descent from that frozen reference, the D-12 before-measurement, and STEP-05 after Tech Lead review, fresh QA, and Product Owner sign-off. On 2026-10-28, the Moderator approved the STEP-06 Revision 4 Tech Lead review, all four recorded recommendations, and the exact Development Team Revision 4 plan for implementation. The Moderator later approved the bounded source-map/tooling amendment recorded in `mod-w/step-06.md` and `mod-w/review.md`, including the 39-path scope. The Development Team may implement STEP-06 only as amended, must stop on its recorded stop conditions, and must then stop for Tech Lead review. The consolidated study-review gate remains required after STEP-09 before any release, publish, or deployment decision.
- STEP-06 is accepted. On 2026-10-28, the Moderator approved the Tech Lead's STEP-07 Revision 5 review and the exact Development Team Revision 5 plan recorded in `mod-w/step-07-plan.md`, including AC-20 Option A, the caption-visibility rule, the token-derived responsive track rule, the static-check policy with its two-phase PowerShell execution plan, and the DS-035 no-heading correction. The Development Team may implement STEP-07 only as approved: exactly the ten paths in that plan, Phase A preflight before any edit and Phase B verification after, stopping on its recorded stop conditions and then stopping for Tech Lead review. Do not begin STEP-08.
- Study reviews are written guides under `study-guides/`, not interactive quizzes. Treat them as explanatory evidence and self-check material, not implementation authority or proof that the gate is complete. The Moderator must explain the covered subjects in their own words and alone decides gate completion. That demonstration is not a prerequisite for work through STEP-09; it applies at the separate consolidated post-STEP-09 gate before any release, publish, or deployment decision.
- Only the active extension Step may change `projects/atomic` or its reviewed `npm pack` archive. The package is installed from that file archive and is never published.
- CodeCraft is the first approved cut if Must completion is threatened.
- STEP-01 and STEP-02 are accepted. STEP-03 and its bounded design authority are approved. The Development Team may inspect and submit its exact implementation plan, but must not implement until the Moderator separately approves that plan.
- Do not silently change architecture, domain terms, APIs, acceptance intent, or Design IDs.

## Historical STEP-03 bounded design authority

Only when STEP-03 is active, the Development Team may decide the About dialog's layout, spacing, heading structure, backdrop treatment, and content presentation using existing semantic tokens, existing library components, and established gallery patterns. It may not add or change tokens, token names, library components, `Navigation` or any public API, existing Design IDs, or anything under `mod-w/design/`; add brand-specific code/structure, animation libraries, icons, or imagery; or weaken WCAG 2.2 AA, AC-7 token-pair contrast, focus, axe, or exactly-three-specification checks. The panel must work in all four scopes through tokens alone. No Design ID exists: do not invent one or render a placeholder badge. Stop on any need to exceed these bounds.

## Reference Implementation

`mod-w/design/project/Main.dc.html` is rejected as a Reference Implementation and retained as visual evidence only. Follow the disposition table in the active Step.

No Reference Implementation exists for the Atomic Design extension. The unchanged Card behavior contract in AC-20 takes its place.

## Build gates

Run the exact active-Step commands. The target final gate is formatting, focused token discipline, Vitest, three Chromium Playwright specifications including axe, restricted-asset checks, and production builds. Never claim a gate passed without command evidence.

---

MOD-W v5.0.1
