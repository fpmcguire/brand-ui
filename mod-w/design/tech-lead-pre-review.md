# Tech Lead Feasibility Pre-review

**Status:** Approved with concerns

**Reviewer:** Codex, Tech Lead

**Date:** 2026-10-18

This review is advisory. It does not transfer architecture authority and is not the Architecture Handoff. The Design-canvas prototype is visual evidence only, not a Reference Implementation.

## Feasibility concerns

1. **Note - product.md section 3; review item 1.** Resolved by the Moderator: Angular 22.2 is the target, matching the approved product and workspace. Signals do not impede the token model.
2. **Should-fix - AC-1, AC-2, AC-3; OBS-001/004.** Document-root-only scope cannot render several brands together. Suggested resolution: make tokens attachable to any host element; use the application root for a normal single-brand consumer and panel hosts in the gallery. Components inherit identical custom-property names and remain brand-agnostic.
3. **Note - design-spec.md 1.6; OBS-009.** Resolved by the Moderator: retain three brands and model CodeCraft Light and Dark as two styling modes/value sets of one brand. Shared non-color values should not be duplicated. The gallery may expose two flattened CodeCraft selections/scopes, producing four visible scopes without creating a fourth client identity. Final type names and composition belong to Architecture Definition.
4. **Should-fix - AC-5; DS-011/012/013, DS-021/022, DS-032/033/034, DS-041/043; OBS-005.** Persistent forced pseudo-states cannot rely on user interaction alone. Suggested resolution: structure component state styling through inherited internal CSS state variables; gallery-only host rules set those variables for specimens, while real pseudo-classes set the same variables. Do not add gallery classes or public preview inputs to library components. Verify equivalence in tests.
5. **Note - DS-003/DS-030 to DS-035; OBS-010.** Per-corner radius tokens are buildable. `corner-top-right-shape: bevel` is supported in Chromium 139+, while unsupported engines retain the specified rounded top-right radius. The Moderator approved progressive enhancement with a rounded fallback. Pin a Playwright Chromium version that supports it and assert `CSS.supports(...)`; do not make the Should-priority bevel a Must gate. See [MDN compatibility](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/corner-top-right-shape).
6. **Should-fix - DS-050/051; OBS-003.** The long-label rules are feasible but need behavioral tests. Ensure an English `lang` ancestor for `hyphens:auto`; treat `text-wrap: balance` as progressive enhancement; test 180/280/360 px overflow and two-line clamping in the pinned Chromium. The Moderator confirmed that `title` is optional supplemental text; the full DOM text remains the accessible name.
7. **Note - DS-002; OBS-007.** Resolved by the Moderator: self-host the six open-license font families for this demo. Confirm the licences, include only used files/weights, and record attribution/licence files. Exact packaging remains deferred to Architecture Definition.
8. **Should-fix - AC-7; DS-001/060; OBS-006/008.** Token values and contrast pairs must not be copied into gallery data. Suggested resolution: keep brand CSS token declarations as the value source; have the gallery read computed custom properties, and have the contrast test read the same computed values against one explicit semantic-pair list.
9. **Should-fix - DS-015, DS-031, DS-040 to DS-044; OBS-002.** Public APIs need explicit semantics. Suggested resolution: card is static unless given one link target and accessible title; button loading remains focusable, sets `aria-busy`, and suppresses activation; navigation items carry label, destination, current and disabled state, with disabled items non-activating. Exact API/type names and router integration are deferred to Architecture Definition.
10. **Should-fix - design-spec.md 4.1; prototype Gallery v18.** "All brands" says three panels, but the approved Light/Dark presentation and prototype render four scopes. The Moderator approved retaining three brands. Suggested resolution: clarify that "All brands" shows them across four panels/scopes because CodeCraft has two styling modes.

No requested behavior is inherently unbuildable. The Angular-version and brand-model questions are resolved. The remaining panel-count wording does not block implementation; it should be clarified as three brands across four gallery scopes.

## Architecture questions

Answers and deferrals correspond to `architecture-notes.md` section 6.

- **Token source:** Answered - brand CSS declarations are authoritative values; gallery and AC-7 read computed values. File layout is deferred.
- **Scope attachment:** Answered - host-capable scope is required; root is only the normal single-brand attachment point.
- **Forced states:** Answered in principle - gallery host overrides shared internal state variables; exact CSS structure is deferred.
- **Card/button/nav APIs:** Behavioral contract answered above; exact signal inputs, types and router boundary are deferred.
- **Fonts:** Answered - the Moderator approved self-hosting; packaging and load strategy are deferred.
- **Narrow navigation:** Answered - wrapping is feasible and matches the approved spike; a collapsed menu is out of scope.
- **Prototype disposition:** Answered - visual reference only, not a Reference Implementation.
- **Production paths, canonical domain terms and intended divergences:** Deferred to Architecture Definition. Any divergence belongs in `architecture.md` under "Decisions That Diverge From Prototype".

## Requested Designer changes

1. Clarify the "All brands" panel count in design-spec.md 4.1: three brands, four rendered scopes/panels when both CodeCraft modes are visible.
2. Clarify DS-051 wording per the Moderator ruling: `title` is optional supplemental disclosure, not the sole tooltip/accessibility mechanism; the full DOM text remains the accessible name.

## Moderator responses

- Angular 22.2 confirmed.
- Three brands approved: CodeCraft Academy is one brand with Light and Dark styling modes, producing four gallery scopes in total.
- Self-hosted fonts approved for the demo, subject to open-licence verification.
- Optional supplemental `title` confirmed for DS-051.
- Progressive CodeCraft bevel with rounded fallback approved.

No visual redesign is requested.
