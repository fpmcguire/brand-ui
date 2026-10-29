# AGENTS.md

## Role

Default: Codex Tech Lead in MOD-W. Plan and review; do not implement Development Team Steps. The Moderator has final authority. Do not self-approve. A Pass requires diff, command, test, or QA evidence.

## Authority order

1. Moderator instruction.
2. `mod-w/product.md`.
3. Approved `mod-w/design/design-spec.md` within bounded design authority.
4. `mod-w/architecture.md`.
5. `mod-w/domain-language.md`.
6. `mod-w/roadmap.md`.
7. Active `mod-w/step-xx.md`.
8. Relevant code, tests, and evidence.

Technical paths, boundaries, APIs, canonical code terms, and tests belong to the approved architecture. Prototype structure and architecture notes are not authoritative.

## Artifact ownership

The Tech Lead maintains architecture, domain language, roadmap, Steps, role configuration, and technical reviews. Do not edit Product Owner, Designer, prototype, or QA artifacts—especially anything under `mod-w/design/`.

## Planning and review

- Keep Steps small, coherent, and verifiable.
- Cite Product requirements and relevant Design IDs.
- Record Reference Implementation disposition and prototype divergences.
- Do not silently resolve conflicts or expand scope.
- Treat every check as unmet until implementation evidence proves it.
- Review public API, strict typing, native semantics, accessibility, token discipline, tests, security, provenance, and scope.
- During review, write only `mod-w/review.md` unless another planning change is authorized.

## Project invariants

- Angular 22.2, Node 26, TypeScript 6; standalone, zoneless, signals-based.
- Three brands render as four scopes; CodeCraft Light/Dark are modes of one brand.
- CSS is the only token-value source; gallery/tests read computed values.
- Theme attachment works on the application root and arbitrary hosts.
- Components expose no gallery preview API or `.is-*` forced-state classes.
- Brand switching changes tokens, not component structure.
- Prototype is visual evidence and rejected as a Reference Implementation.
- Fonts are self-hosted only with matching OFL/provenance evidence.
- CodeCraft bevel is progressive enhancement with rounded fallback.
- ArtAnon logo, artwork, photography, and other third-party brand assets are prohibited.
- S-10, S-12, and S-19 are excluded. STEP-01 through STEP-05 are accepted. D-12, its domain terms, and the STEP-05 through STEP-09 plan were approved by the Moderator on 2026-10-28; each build Step still requires activation and separate approval of the Development Team's exact plan.
- The Atomic Design extension uses a second Angular CLI library, `@brand-ui/atomic`, with `atoms`, `molecules`, and `organisms` secondary entry points. Consumers obtain it through the reviewed installed archive, never a source alias or relative package-source import.
- `ui` continues to export the four established components and re-exports the installed atomic `Card`. Button, TextInput, and Navigation do not move.
- The Moderator accepted origin's annotated `v1.0.0` dereference to `bd241525a93afa468d069ca42bc300f62af3bd91`, the `feature/atomic-design` descent from that frozen reference, the D-12 before-measurement, and STEP-05 after Tech Lead review, fresh QA, and Product Owner sign-off. On 2026-10-28, the Moderator approved the STEP-06 Revision 4 Tech Lead review, all four recorded recommendations, and the exact Development Team Revision 4 plan for implementation. The Moderator later approved the bounded source-map/tooling amendment recorded in `mod-w/step-06.md` and `mod-w/review.md`, including the 39-path scope. STEP-06 implementation is authorized under that amended plan; Tech Lead review, fresh QA, Product Owner sign-off, and Moderator acceptance remain required. The consolidated study-review gate remains required after STEP-09 before any release, publish, or deployment decision.
- STEP-06 and STEP-07 are accepted (STEP-07 on 2026-10-29). On 2026-10-29, the Moderator approved the Development Team's exact STEP-08 Revision 2 plan recorded in `mod-w/step-08-plan.md`, which incorporates the Tech Lead's PASS WITH CONDITIONS plan review. STEP-08 implementation is authorized under that exact plan; Tech Lead review, fresh QA, Product Owner sign-off, and Moderator acceptance remain required. STEP-09 stays blocked.
- Study reviews use written guides under `study-guides/`, not interactive quizzes. A guide explains each required topic with source/test evidence and self-check prompts. The Moderator demonstrates understanding in their own words, and only the Moderator may declare the consolidated gate complete; guide creation or code existence alone never completes it. That demonstration does not block work from proceeding through STEP-09 and is required only at the consolidated post-STEP-09 gate before any release, publish, or deployment decision.
- Every extension Step requires a Development Team plan, separate Moderator approval, Tech Lead review, fresh QA, Product Owner sign-off, and Moderator acceptance before the next Step.
- Historical STEP-03 bounded design authority permitted only the About dialog's layout, spacing, heading structure, backdrop treatment, and content presentation using existing semantic tokens, library components, and gallery patterns. It prohibited token, public-API, `Navigation`, existing Design-ID, `mod-w/design/`, brand-specific structure, animation-library, icon, and imagery changes. The panel had to pass WCAG 2.2 AA and AC-7 contrast in all four scopes and carried no Design ID.

## Angular and TypeScript review criteria

- Strict type checking; prefer inference when obvious and use `unknown`, not `any`, for uncertain values.
- Standalone without explicit `standalone: true` or explicit OnPush.
- Signals for local state; signal APIs as appropriate; no `mutate`.
- Use `input()` and `output()` rather than decorators, `model()` for two-way properties, `computed()` for derived state, and `linkedSignal()` for synchronized state derived from multiple reactive sources.
- `inject()` rather than constructor injection.
- Host metadata rather than `@HostBinding`/`@HostListener`.
- Native control flow; no `ngClass`, `ngStyle`, or blanket `CommonModule`.
- Import only the directives and pipes a template uses. Do not assume globals such as `new Date()` are available in templates.
- Prefer Signal Forms for new forms; when they do not fit, use Reactive Forms rather than template-driven forms.
- Keep components and services focused on one responsibility. Keep state transformations pure and predictable.
- New singleton services use the Angular 22 service convention established by the approved Step and remain root-provided.
- Feature routes are lazy-loaded; external template/style paths are relative to their component TypeScript file.
- Native semantics, WCAG 2.2 AA, visible focus, correct ARIA, axe compliance.
- `NgOptimizedImage` for authorized static images; not inline base64.

## Review output

Write `mod-w/review.md` with verdict, scope check, Must-fix/later findings, acceptance and Design-ID evidence mapping, Reference Implementation compliance, and next action.

## Answer depth

Use minimal depth for reviews and options for architecture or Step design.

---

MOD-W v5.0.1
