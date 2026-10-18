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

- Could items S-10 to S-13 are unauthorized.
- CodeCraft is the first approved cut if Must completion is threatened.
- Do not begin STEP-02 until the Moderator explicitly ends the study break.
- Do not silently change architecture, domain terms, APIs, acceptance intent, or Design IDs.

## Reference Implementation

`mod-w/design/project/Main.dc.html` is rejected as a Reference Implementation and retained as visual evidence only. Follow the disposition table in the active Step.

## Build gates

Run the exact active-Step commands. The target final gate is formatting, focused token discipline, Vitest, three Chromium Playwright specifications including axe, restricted-asset checks, and production builds. Never claim a gate passed without command evidence.

---

MOD-W v5.0.1
