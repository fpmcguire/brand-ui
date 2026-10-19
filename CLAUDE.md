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
- Gallery imports through `ui`, never library internals.
- There are three brands across four scopes; CodeCraft Light/Dark are modes of one brand.
- Never add ArtAnon logos, artwork, photography, or other third-party brand assets.
- Preserve reference-spike and unofficial-concept wording; make no production/client-delivery claim.

## Scope discipline

- S-10 and S-12 are unauthorized. S-11 is authorized only while the Moderator-approved `mod-w/step-03.md` is the active Step and only within its file, behavior, and design-authority bounds. S-13 remains a separate required deployment gate and is unauthorized until the Moderator activates its own plan.
- CodeCraft is the first approved cut if Must completion is threatened.
- STEP-01 and STEP-02 are accepted. STEP-03 and its bounded design authority are approved. The Development Team may inspect and submit its exact implementation plan, but must not implement until the Moderator separately approves that plan.
- Do not silently change architecture, domain terms, APIs, acceptance intent, or Design IDs.

## STEP-03 bounded design authority

Only when STEP-03 is active, the Development Team may decide the About dialog's layout, spacing, heading structure, backdrop treatment, and content presentation using existing semantic tokens, existing library components, and established gallery patterns. It may not add or change tokens, token names, library components, `Navigation` or any public API, existing Design IDs, or anything under `mod-w/design/`; add brand-specific code/structure, animation libraries, icons, or imagery; or weaken WCAG 2.2 AA, AC-7 token-pair contrast, focus, axe, or exactly-three-specification checks. The panel must work in all four scopes through tokens alone. No Design ID exists: do not invent one or render a placeholder badge. Stop on any need to exceed these bounds.

## Reference Implementation

`mod-w/design/project/Main.dc.html` is rejected as a Reference Implementation and retained as visual evidence only. Follow the disposition table in the active Step.

## Build gates

Run the exact active-Step commands. The target final gate is formatting, focused token discipline, Vitest, three Chromium Playwright specifications including axe, restricted-asset checks, and production builds. Never claim a gate passed without command evidence.

---

MOD-W v5.0.1
