# STEP-07 Implementation Plan — Revision 5 (approved)

**Status:** Approved by the Moderator on 2026-10-28. The Moderator approved the Tech Lead's Revision 5 review, the exact Development Team Revision 5 plan recorded in this file, and the five decisions it contains (AC-20 Option A, the caption-visibility rule, the token-derived responsive track rule, the static-check policy with its two-phase PowerShell execution plan, and the DS-035 no-heading correction). STEP-07 is active and implementation is authorized under this exact plan only. This is plan approval, not STEP-07 acceptance: Tech Lead implementation review, fresh QA, Product Owner sign-off and Moderator acceptance remain required. Do not begin STEP-08.

**Provenance.** This file records the plan the Tech Lead reviewed in `mod-w/review.md`. The source, template, SCSS and test bodies are the Revision 3 text, extracted byte-for-byte from the Revision 3 source, with exactly three K3 test changes applied (§5.3). The two scripts in Appendix A are byte-identical to the hashed text. If this file and a Moderator instruction conflict, the Moderator instruction controls.

## Approval conditions (Tech Lead documentation clarifications)

These two clarifications were recorded as non-blocking by the Tech Lead. They change no command, scope, test or acceptance mapping:

1. **Phase B labels.** The Phase B script validates PowerShell and repository state in its prelude, then checks toolchain versions (`B1`), then checks HEAD equality (`B0`). The gate table in §8 lists them in that order.
2. **Literal hash comparisons.** Immediately before each script invocation, the implementation evidence must show the literal `Get-FileHash` command and its comparison with the recorded hash (§7). A mismatch is a stop condition.

## 1. Scope and requirements

The gallery adds a gallery-owned "Card structure" section as the last child of each scope panel. It contains the DS-061 section, three labelled groups (Atoms, Molecules, Organism), and eight specimen figures: DS-062, DS-063, DS-064, DS-065, DS-066, and the DS-030, DS-031 and DS-035 organism appearances. Together those make nine Design-ID-bearing surfaces. There are eight figures.

Boundaries: no atomic source, archive, manifest, lockfile, ui, token, Design-ID, brand/scope, mod-w/** or mod-w/design/** change. No fourth Playwright specification.

## 2. Files

Counts: 5 created, 5 edited, 10 total. The two temporary PowerShell scripts in §7 are outside the repository and are not implementation paths.

**Created**

| # | Path | Purpose |
|---|---|---|
| C1 | projects/gallery/src/app/gallery/specimens/structure-specimens.ts | Pure data for groups, specimens, captions and test IDs. No imports. |
| C2 | projects/gallery/src/app/gallery/structure/card-structure.component.ts | Gallery-owned gal-card-structure shell. Installed imports only. |
| C3 | projects/gallery/src/app/gallery/structure/card-structure.component.html | Exact markup, below. |
| C4 | projects/gallery/src/app/gallery/structure/card-structure.component.scss | Token-only styles, below. |
| C5 | projects/gallery/src/app/gallery/structure/card-structure.component.spec.ts | Vitest, §5.1. |

**Edited**

| # | Path | Change |
|---|---|---|
| E1 | projects/gallery/src/app/gallery/gallery-page.component.html | Insert `<gal-card-structure [scopeId]="scope.id" [showDesignIds]="state.showDesignIds()" />` after the Contrast evidence section, inside each panel. |
| E2 | projects/gallery/src/app/gallery/gallery-page.component.ts | Import CardStructure from ./structure/card-structure.component and add it to imports after Card. |
| E3 | projects/gallery/src/app/gallery/gallery-page.component.spec.ts | Two selector edits (§9) and one new placement it (§5.1). |
| E4 | e2e/brand-and-contrast.spec.ts | New describe('Card structure view') with B1–B3. |
| E5 | e2e/keyboard-and-accessibility.spec.ts | New describe('Card structure view') with K1–K5. |

Not changed: specimens/specimens.ts, gallery-state.ts, e2e/helpers/gallery.ts, the About panel, projects/atomic/**, package-artifacts/**, package.json, package-lock.json, tsconfig.json, angular.json, projects/ui/**, mod-w/**, scripts/**.

### C1: structure-specimens.ts

```ts
export type StructureBody =
  | 'tag'
  | 'skeleton-block'
  | 'code-well'
  | 'media-area'
  | 'loading-skeleton'
  | 'card';
export type StructureLevel = 'atom' | 'molecule' | 'organism';

export interface StructureSpecimen {
  readonly designId: string;
  readonly testId: string;
  /** The part name shown as the first caption line, before the level. */
  readonly part: string;
  readonly level: StructureLevel;
  readonly body: StructureBody;
  /** The "Built from:" caption. Absent on atoms. */
  readonly builtFrom?: string;
  /** Organisms only: the "Shows the state of DS-0xx" caption, shown while Design IDs are on. */
  readonly showsState: boolean;
  /** Card only: the title is the single native link (DS-031). */
  readonly linked?: boolean;
  /** Card only: the card is in its loading state (DS-035). */
  readonly loading?: boolean;
}

export interface StructureGroup {
  readonly id: 'atoms' | 'molecules' | 'organism';
  readonly label: string;
  readonly specimens: readonly StructureSpecimen[];
}

export const STRUCTURE_GROUPS: readonly StructureGroup[] = [
  {
    id: 'atoms',
    label: 'Atoms',
    specimens: [
      {
        designId: 'DS-062',
        testId: 'gallery-structure-tag-default',
        part: 'Tag',
        level: 'atom',
        body: 'tag',
        showsState: false,
      },
      {
        designId: 'DS-063',
        testId: 'gallery-structure-skeleton-block-loading',
        part: 'Skeleton block',
        level: 'atom',
        body: 'skeleton-block',
        showsState: false,
      },
      {
        designId: 'DS-064',
        testId: 'gallery-structure-code-well-default',
        part: 'Code well',
        level: 'atom',
        body: 'code-well',
        showsState: false,
      },
    ],
  },
  {
    id: 'molecules',
    label: 'Molecules',
    specimens: [
      {
        designId: 'DS-065',
        testId: 'gallery-structure-media-area-default',
        part: 'Media area',
        level: 'molecule',
        body: 'media-area',
        builtFrom: 'Tag (atom), media label text',
        showsState: false,
      },
      {
        designId: 'DS-066',
        testId: 'gallery-structure-loading-skeleton-loading',
        part: 'Loading skeleton',
        level: 'molecule',
        body: 'loading-skeleton',
        builtFrom: 'Skeleton block, four times (atom)',
        showsState: false,
      },
    ],
  },
  {
    id: 'organism',
    label: 'Organism',
    specimens: [
      {
        designId: 'DS-030',
        testId: 'gallery-structure-card-static',
        part: 'Card, static',
        level: 'organism',
        body: 'card',
        builtFrom:
          'Media area (molecule), title, description, meta line, code well (atom, where the sample data supplies one)',
        showsState: true,
        linked: false,
        loading: false,
      },
      {
        designId: 'DS-031',
        testId: 'gallery-structure-card-interactive-default',
        part: 'Card, interactive default',
        level: 'organism',
        body: 'card',
        builtFrom: 'Same parts as the static card',
        showsState: true,
        linked: true,
        loading: false,
      },
      {
        designId: 'DS-035',
        testId: 'gallery-structure-card-loading',
        part: 'Card, loading',
        level: 'organism',
        body: 'card',
        builtFrom: 'Loading skeleton (molecule)',
        showsState: true,
        linked: false,
        loading: true,
      },
    ],
  },
];
```

### C2: card-structure.component.ts

```ts
import { Component, computed, input } from '@angular/core';
import { CodeWell, SkeletonBlock, Tag } from '@brand-ui/atomic/atoms';
import { LoadingSkeleton, MediaArea } from '@brand-ui/atomic/molecules';
import { Card } from '@brand-ui/atomic/organisms';
import { GalleryScopeId } from '../gallery-state';
import { CARD_CONTENT } from '../specimens/specimens';
import { STRUCTURE_GROUPS } from '../specimens/structure-specimens';

/**
 * The gallery-owned Card structure view (S-17, DS-061 to DS-066). It composes installed atomic parts
 * and the Card organism. It is never exported by `ui` or by the atomic package.
 */
@Component({
  selector: 'gal-card-structure',
  imports: [Card, CodeWell, LoadingSkeleton, MediaArea, SkeletonBlock, Tag],
  templateUrl: './card-structure.component.html',
  styleUrl: './card-structure.component.scss',
})
export class CardStructure {
  readonly scopeId = input.required<GalleryScopeId>();
  readonly showDesignIds = input.required<boolean>();

  protected readonly groups = STRUCTURE_GROUPS;
  protected readonly content = computed(() => CARD_CONTENT[this.scopeId()]);

  /** Sample links go nowhere: keep the review surface on the page, as the gallery page does. */
  protected keepOnPage(event: Event): void {
    if (event.target instanceof Element && event.target.closest('a')) {
      event.preventDefault();
    }
  }
}
```

### C3: card-structure.component.html

```html
<section
  class="block"
  data-testid="gallery-structure-section-default"
  [attr.aria-labelledby]="scopeId() + '-structure'"
>
  <h3 class="block-title" [id]="scopeId() + '-structure'">
    Card structure
    @if (showDesignIds()) {
      <span class="id">DS-061</span>
    }
  </h3>

  @for (group of groups; track group.id) {
    <div
      class="group"
      role="group"
      [attr.aria-labelledby]="scopeId() + '-structure-' + group.id"
      [attr.data-testid]="'gallery-structure-group-' + group.id"
    >
      <p class="group-label" [id]="scopeId() + '-structure-' + group.id">{{ group.label }}</p>
      <div class="grid">
        @for (specimen of group.specimens; track specimen.designId) {
          <figure
            class="specimen"
            [attr.data-testid]="specimen.testId"
            [attr.data-structure-part]="specimen.body"
            (click)="keepOnPage($event)"
          >
            <figcaption class="caption">
              <span class="line">
                <span class="label">{{ specimen.part }} · {{ specimen.level }}</span>
                @if (showDesignIds()) {
                  <span class="id">{{ specimen.designId }}</span>
                }
              </span>
              @if (specimen.builtFrom; as builtFrom) {
                <span class="line built">Built from: {{ builtFrom }}</span>
              }
              @if (specimen.showsState && showDesignIds()) {
                <span class="line state">Shows the state of {{ specimen.designId }}</span>
              }
            </figcaption>

            @switch (specimen.body) {
              @case ('tag') {
                <bui-tag>{{ content().tag }}</bui-tag>
              }
              @case ('skeleton-block') {
                <div class="arrangement">
                  <bui-skeleton-block />
                </div>
              }
              @case ('code-well') {
                <div class="code-slot" data-code-slot>
                  @if (content().codeSample; as code) {
                    <bui-code-well>{{ code }}</bui-code-well>
                  } @else {
                    <p class="not-used">Not used in this scope</p>
                  }
                </div>
              }
              @case ('media-area') {
                <bui-media-area [label]="content().mediaLabel" [tag]="content().tag" />
              }
              @case ('loading-skeleton') {
                <bui-loading-skeleton />
              }
              @case ('card') {
                <bui-card
                  [title]="content().title"
                  [description]="content().description"
                  [meta]="content().meta"
                  [tag]="content().tag"
                  [mediaLabel]="content().mediaLabel"
                  [codeSample]="content().codeSample"
                  [href]="specimen.linked ? '#sample' : undefined"
                  [loading]="specimen.loading === true"
                />
              }
            }
          </figure>
        }
      </div>
    </div>
  }
</section>
```

### C4: card-structure.component.scss

```scss
// Tokens only. Every value is a var(--bui-*) reference, a keyword on the static-check allowlist,
// 0, or 100%. This component-scoped sheet carries its own copies of the block, caption and badge
// rules. It has no media query: the grid collapses to one column by its track minimum.
:host {
  display: block;
  min-width: 0;
}

.block {
  display: flex;
  flex-direction: column;
  gap: var(--bui-space-3);
  margin-top: var(--bui-space-5);
  padding-top: var(--bui-space-4);
  border-top: var(--bui-border-width) solid var(--bui-color-border);
}

.block-title {
  margin: 0;
  font-family: var(--bui-font-display);
  font-size: var(--bui-size-title);
  font-weight: var(--bui-weight-display);
  line-height: var(--bui-line-height-title);
}

.group {
  display: flex;
  flex-direction: column;
  gap: var(--bui-space-2);
  min-width: 0;
}

.group-label {
  margin: 0;
  font-family: var(--bui-font-ui);
  font-size: var(--bui-size-ui);
  font-weight: var(--bui-weight-ui);
  letter-spacing: var(--bui-letter-spacing-ui);
}

// Track minimum: six control heights, identical in every brand. A container narrower than two
// tracks plus the gap takes one column. min(100%, …) keeps a single track inside a narrower container.
.grid {
  display: grid;
  grid-template-columns: repeat(
    auto-fill,
    minmax(min(100%, calc(var(--bui-control-height) * 6)), 1fr)
  );
  gap: var(--bui-space-4);
  align-items: start;
}

// Figures carry the browser's default margin; reset it so each specimen stays in its column.
.specimen {
  display: flex;
  flex-direction: column;
  gap: var(--bui-space-2);
  min-width: 0;
  margin: 0;
  padding: 0;
}

.caption,
.not-used {
  margin: 0;
  color: var(--bui-color-text-muted);
  font-size: var(--bui-size-small);
}

.line {
  display: block;
}

.id {
  display: inline-block;
  padding: 0 var(--bui-space-1);
  border: var(--bui-border-width) solid currentColor;
  font-size: var(--bui-size-small);
}

// DS-063: the atom has no size of its own. The arrangement gives it the full specimen width, the
// token height of a title bar, and the control radius. The block is decorative and has no text.
.arrangement {
  min-width: 0;
}

.arrangement bui-skeleton-block {
  display: block;
  box-sizing: border-box;
  width: 100%;
  height: var(--bui-space-5);
  border-radius: var(--bui-radius-control);
}

.code-slot {
  min-width: 0;
}
```

Track arithmetic (400px viewport). The main padding is 0 2rem (32px each side). The panel padding is var(--bui-space-5) (24px or 32px). The section content width is therefore 272–288px. One track is 6 × 44px = 264px. Two tracks plus the 16px gap need 544px, so the grid produces one column. The Team must confirm this in the browser (K4), not only by arithmetic.

## 3. Design decisions

| Topic | Decision | Reason |
|---|---|---|
| Imports | Atoms, molecules and organisms from installed entry points; no alias or relative path | AC-23; D-12 |
| Ownership | Gallery-owned CardStructure; page only places it | S-17 |
| Inputs | scopeId drives IDs and sample data; showDesignIds is an input | Isolated tests |
| Track width | minmax(min(100%, calc(var(--bui-control-height) * 6)), 1fr) | No width token; a token change is out of scope. Derived from a brand-invariant token (44px in all brands). |
| Responsive | No media query | Keeps the stylesheet literal-free |
| Figure margin | margin: 0 | Browser default would break containment |
| DS-063 | .arrangement supplies width, height and radius | The atom owns no size |
| DS-066 and DS-035 | Geometry from the installed molecule | LoadingSkeleton owns its arrangement |
| Hidden skeletons | Atoms' own aria-hidden="true" host | Confirmed in source; tested |
| Groups | div role="group" named by a p | Groups are not headings |
| Captions | .label and .built always visible; .state follows Design-ID visibility | Moderator decision 2 |
| Code slot | data-code-slot; bui-code-well or p.not-used | D-05: sample data, not theme |
| Click guard | Local five-line guard | Keeps page logic unchanged |
| Selectors | No data-specimen on any structure element | Keeps existing selectors valid (§9) |

## 4. Structure and heading contract

### 4.1 Authorized cross-scope differences (P1–P3)

- **P1, DS-064 slot.** CodeCraft scopes render bui-code-well inside [data-code-slot]. ArtAnon and IT English Mentor render p.not-used.
- **P2, optional organism Code wells.** CodeCraft scopes render a bui-code-well inside the DS-030 and DS-031 article. ArtAnon and Mentor do not. DS-035 never renders one.
- **P3, consumer text.** Text and attribute values from CARD_CONTENT: titles, descriptions, meta, tag, media label, and ID values carrying the scope prefix.

Nothing else may differ: element tags, attribute names, data-testid values and their order, group order, figure order, caption structure, heading levels.

### 4.2 Normalization (normalizeStructure, evaluated in the page)

1. Clone the section root.
2. Replace the children of each [data-code-slot] with one empty x-code-slot element.
3. Remove every remaining bui-code-well (the Card wells, P2).
4. Describe the clone: tag name plus sorted attribute names, excluding _ng*, ng-*, data-testid, id, for, aria-labelledby, aria-describedby.

### 4.3 Heading contract, per scope

- The first heading in the panel is an h2 whose text is the scope label.
- Heading levels never rise by more than one in document order.
- "Card structure" is an h3 (its accessible name starts with "Card structure"; the DS-061 badge may be appended).
- The DS-030 and DS-031 titles are h3. DS-035 has no heading: the loading branch of Card renders no title.
- Group labels Atoms, Molecules, Organism are accessible names of role=group and are not headings.

## 5. Tests

### 5.1 Vitest: card-structure.component.spec.ts (C5)

```ts
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { GalleryScopeId } from '../gallery-state';
import { CARD_CONTENT } from '../specimens/specimens';
import { STRUCTURE_GROUPS } from '../specimens/structure-specimens';
import { CardStructure } from './card-structure.component';

const SPECIMENS = STRUCTURE_GROUPS.flatMap((group) => group.specimens);

/** Caption text without the Design-ID badge. */
function visibleText(element: Element): string {
  const clone = element.cloneNode(true) as Element;
  clone.querySelectorAll('.id').forEach((badge) => badge.remove());
  return (clone.textContent ?? '').replace(/\s+/g, ' ').trim();
}

async function setup(scopeId: GalleryScopeId = 'artanon', showDesignIds = true): Promise<HTMLElement> {
  const fixture = TestBed.createComponent(CardStructure);
  fixture.componentRef.setInput('scopeId', scopeId);
  fixture.componentRef.setInput('showDesignIds', showDesignIds);
  await fixture.whenStable();
  return fixture.nativeElement as HTMLElement;
}

function figureFor(root: HTMLElement, testId: string): HTMLElement {
  const figure = root.querySelector<HTMLElement>(`[data-testid="${testId}"]`);
  if (!figure) throw new Error(`No figure ${testId}`);
  return figure;
}

@Component({
  imports: [CardStructure],
  template: `
    <gal-card-structure [scopeId]="'artanon'" [showDesignIds]="true" />
    <gal-card-structure [scopeId]="'mentor'" [showDesignIds]="true" />
  `,
})
class TwoScopes {}

describe('CardStructure', () => {
  it('renders the section heading as h3 named Card structure, with its DS-061 badge only while Design IDs are on', async () => {
    const on = await setup('artanon', true);
    const heading = on.querySelector('h3')!;
    expect(visibleText(heading)).toBe('Card structure');
    expect(heading.querySelector('.id')?.textContent).toBe('DS-061');

    const off = await setup('artanon', false);
    expect(off.querySelector('.id')).toBeNull();
  });

  it('renders three role=group elements named Atoms, Molecules and Organism, in order, each named by a P', async () => {
    const root = await setup();
    const groups = Array.from(root.querySelectorAll<HTMLElement>('[role="group"]'));
    expect(groups).toHaveLength(3);
    const names = groups.map((group) => {
      const label = root.querySelector(`[id="${group.getAttribute('aria-labelledby')}"]`);
      expect(label?.tagName).toBe('P');
      return label?.textContent?.trim();
    });
    expect(names).toEqual(['Atoms', 'Molecules', 'Organism']);
  });

  it('renders exactly three headings, the section h3 and the two organism titles, and none in the DS-035 card', async () => {
    const root = await setup('artanon');
    const headings = Array.from(root.querySelectorAll<HTMLElement>('h1,h2,h3,h4,h5,h6'));
    expect(headings.map((heading) => heading.tagName)).toEqual(['H3', 'H3', 'H3']);
    expect(headings.map((heading) => visibleText(heading))).toEqual([
      'Card structure',
      CARD_CONTENT.artanon.title,
      CARD_CONTENT.artanon.title,
    ]);
    expect(figureFor(root, 'gallery-structure-card-loading').querySelector('h1,h2,h3,h4,h5,h6')).toBeNull();
  });

  it('renders eight figures, each with its part and level as the first caption line', async () => {
    const root = await setup();
    expect(root.querySelectorAll('figure')).toHaveLength(8);
    for (const specimen of SPECIMENS) {
      const figure = figureFor(root, specimen.testId);
      expect(visibleText(figure.querySelector('.label')!), specimen.testId).toBe(
        `${specimen.part} · ${specimen.level}`,
      );
    }
  });

  it('renders the exact Built from line on the two molecules and three organisms, and on no atom', async () => {
    const root = await setup();
    for (const specimen of SPECIMENS) {
      const built = figureFor(root, specimen.testId).querySelector('.built');
      if (specimen.builtFrom) {
        expect(visibleText(built!), specimen.testId).toBe(`Built from: ${specimen.builtFrom}`);
      } else {
        expect(built, specimen.testId).toBeNull();
      }
    }
  });

  it('renders Shows the state of DS-030, DS-031 and DS-035 only while Design IDs are on', async () => {
    const on = await setup('artanon', true);
    expect(Array.from(on.querySelectorAll('.state'), (el) => visibleText(el))).toEqual([
      'Shows the state of DS-030',
      'Shows the state of DS-031',
      'Shows the state of DS-035',
    ]);
    const off = await setup('artanon', false);
    expect(off.querySelectorAll('.state')).toHaveLength(0);
    expect(off.querySelectorAll('.id')).toHaveLength(0);
  });

  it('shows the Code well in the CodeCraft scopes and Not used in this scope in ArtAnon and Mentor', async () => {
    const artanon = await setup('artanon');
    expect(artanon.querySelectorAll('bui-code-well')).toHaveLength(0);
    expect(visibleText(artanon.querySelector('[data-code-slot]')!)).toBe('Not used in this scope');

    const light = await setup('codecraft-light');
    expect(light.querySelectorAll('bui-code-well')).toHaveLength(3);
    expect(visibleText(light.querySelector('[data-code-slot] bui-code-well')!)).toBe(
      'const total = items.length;',
    );
  });

  it('gives the interactive card exactly one link, and the static and loading cards none', async () => {
    const root = await setup();
    expect(root.querySelectorAll('a')).toHaveLength(1);
    expect(figureFor(root, 'gallery-structure-card-interactive-default').querySelectorAll('a')).toHaveLength(1);
  });

  it('gives busy and Loading only to the DS-035 card, and hides every isolated skeleton', async () => {
    const root = await setup();
    const blocks = Array.from(root.querySelectorAll('bui-skeleton-block'));
    const loadingSkeletons = Array.from(root.querySelectorAll('bui-loading-skeleton'));
    expect(blocks).toHaveLength(9);
    expect(loadingSkeletons).toHaveLength(2);
    for (const element of [...blocks, ...loadingSkeletons]) {
      expect(element.getAttribute('aria-hidden')).toBe('true');
    }

    const busy = root.querySelectorAll('[aria-busy="true"]');
    expect(busy).toHaveLength(1);
    expect(busy[0].closest('figure')?.getAttribute('data-testid')).toBe(
      'gallery-structure-card-loading',
    );

    const loading = Array.from(root.querySelectorAll('span')).filter(
      (span) => span.textContent?.trim() === 'Loading',
    );
    expect(loading).toHaveLength(1);
    expect(loading[0].closest('figure')?.getAttribute('data-testid')).toBe(
      'gallery-structure-card-loading',
    );
  });

  it('gives both instances in one document explicit, scope-prefixed, disjoint ids', async () => {
    const fixture = TestBed.createComponent(TwoScopes);
    await fixture.whenStable();
    const [first, second] = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLElement>('gal-card-structure'),
    );
    const firstIds = Array.from(first.querySelectorAll('[id]'), (element) => element.id);
    const secondIds = Array.from(second.querySelectorAll('[id]'), (element) => element.id);
    // The section heading plus the three group labels.
    expect(firstIds).toHaveLength(4);
    expect(secondIds).toHaveLength(4);
    expect(firstIds.every((id) => id.startsWith('artanon-'))).toBe(true);
    expect(secondIds.every((id) => id.startsWith('mentor-'))).toBe(true);
    expect(firstIds.filter((id) => secondIds.includes(id))).toEqual([]);
  });

  it('uses no state attributes, no is-* classes and no Card-section or page selectors', async () => {
    const root = await setup();
    expect(
      root.querySelector(
        '[data-specimen-state], [data-specimen], [data-pair], [data-token], [class*="is-"], nav, dialog, input',
      ),
    ).toBeNull();
  });
});
```

Gallery page spec (E3), new it: places the Card structure view last in every scope panel, after the contrast evidence. For each panel (after press('gallery-switch-all')): Array.from(panel.children); the last child's tagName is GAL-CARD-STRUCTURE; the child before it has an aria-labelledby ending in -contrast.

### 5.2 Playwright: e2e/brand-and-contrast.spec.ts (E4)

Additional imports: type Page and type Scope from @playwright/test and ./helpers/gallery; STRUCTURE_GROUPS from ../projects/gallery/src/app/gallery/specimens/structure-specimens.

```ts
const STRUCTURE_SPECIMENS = STRUCTURE_GROUPS.flatMap((group) => group.specimens);
const structure = (page: Page, scope: Scope) =>
  panel(page, scope).getByTestId('gallery-structure-section-default');

/** Same rule as the `skeleton()` helper, plus the P1/P2 normalization. Self-contained for evaluate. */
function normalizeStructure(root: Element): string {
  const clone = root.cloneNode(true) as Element;
  for (const slot of Array.from(clone.querySelectorAll('[data-code-slot]'))) {
    slot.replaceChildren(document.createElement('x-code-slot'));
  }
  for (const well of Array.from(clone.querySelectorAll('bui-code-well'))) well.remove();
  const ignored = /^(_ng|ng-|data-testid$|id$|for$|aria-labelledby$|aria-describedby$)/;
  const describe = (element: Element): string => {
    const names = element
      .getAttributeNames()
      .filter((name) => !ignored.test(name))
      .sort()
      .join(',');
    return `<${element.tagName.toLowerCase()} ${names}>${Array.from(element.children).map(describe).join('')}</>`;
  };
  return describe(clone);
}

const EXPECTED_SEQUENCE = [
  'gallery-structure-section-default',
  'gallery-structure-group-atoms',
  'gallery-structure-tag-default',
  'gallery-structure-skeleton-block-loading',
  'gallery-structure-code-well-default',
  'gallery-structure-group-molecules',
  'gallery-structure-media-area-default',
  'gallery-structure-loading-skeleton-loading',
  'gallery-structure-group-organism',
  'gallery-structure-card-static',
  'gallery-structure-card-interactive-default',
  'gallery-structure-card-loading',
];

test.describe('Card structure view', () => {
  test('places the view last, with groups, captions and Design IDs, in every scope', async ({ page }) => {
    for (const scope of SCOPES) {
      await openGallery(page, scope.id);
      const shape = await panel(page, scope).evaluate((element) => ({
        last: element.lastElementChild?.tagName,
        beforeLast: element.children[element.children.length - 2]?.getAttribute('aria-labelledby'),
      }));
      expect(shape.last, `${scope.label}: last child`).toBe('GAL-CARD-STRUCTURE');
      expect(shape.beforeLast, `${scope.label}: child before the view`).toMatch(/-contrast$/);

      const section = structure(page, scope);
      await expect(section).toHaveAttribute('aria-labelledby', `${scope.id}-structure`);
      for (const name of ['Atoms', 'Molecules', 'Organism']) {
        await expect(section.getByRole('group', { name, exact: true })).toHaveCount(1);
      }
      await expect(section.locator('figure')).toHaveCount(8);
      for (const specimen of STRUCTURE_SPECIMENS) {
        const figure = section.getByTestId(specimen.testId);
        await expect(figure, specimen.testId).toHaveCount(1);
        await expect(figure.locator('.label')).toHaveText(`${specimen.part} · ${specimen.level}`);
        await expect(figure.locator('.id')).toHaveText(specimen.designId);
        if (specimen.builtFrom) {
          await expect(figure.locator('.built')).toHaveText(`Built from: ${specimen.builtFrom}`);
        } else {
          await expect(figure.locator('.built')).toHaveCount(0);
        }
        if (specimen.showsState) {
          await expect(figure.locator('.state')).toHaveText(`Shows the state of ${specimen.designId}`);
        } else {
          await expect(figure.locator('.state')).toHaveCount(0);
        }
      }
    }
  });

  test('keeps the view identical across scopes, except the authorized P1 and P2 differences', async ({ page }) => {
    await openGallery(page, 'all');
    const shapes: string[] = [];
    const sequences: (string | undefined)[][] = [];
    const codeWells: number[] = [];
    const notUsed: number[] = [];
    for (const scope of SCOPES) {
      const section = structure(page, scope);
      shapes.push(await section.evaluate(normalizeStructure));
      // The section root is prepended explicitly: querySelectorAll returns descendants only.
      sequences.push(
        await section.evaluate((root) =>
          [root as HTMLElement, ...Array.from(root.querySelectorAll<HTMLElement>('[data-testid]'))].map(
            (element) => element.dataset['testid'],
          ),
        ),
      );
      codeWells.push(await section.locator('bui-code-well').count());
      notUsed.push(await section.locator('[data-code-slot] .not-used').count());
    }
    expect(new Set(shapes).size, 'one normalized structure in all four scopes').toBe(1);
    for (const sequence of sequences) expect(sequence).toEqual(EXPECTED_SEQUENCE);
    // Order: ArtAnon, Mentor, CodeCraft Light, CodeCraft Dark.
    expect(codeWells).toEqual([0, 0, 3, 3]);
    expect(notUsed).toEqual([1, 1, 0, 0]);
  });

  test('paints each structure specimen from its own tokens in every scope', async ({ page }) => {
    for (const scope of SCOPES) {
      await openGallery(page, scope.id);
      const scoped = panel(page, scope);
      const section = structure(page, scope);
      const color = (token: string) => resolveColor(scoped, token);
      const sunken = await color('--bui-color-surface-sunken');

      const tag = await computed(section.getByTestId('gallery-structure-tag-default').locator('bui-tag'), [
        'background-color',
        'color',
      ]);
      expect(parseRgb(tag['background-color']), `${scope.label} Tag fill`).toEqual(await color('--bui-color-accent'));
      expect(parseRgb(tag['color']), `${scope.label} Tag label`).toEqual(await color('--bui-color-on-accent'));

      const skeleton = await computed(
        section.getByTestId('gallery-structure-skeleton-block-loading').locator('bui-skeleton-block'),
        ['background-color'],
      );
      expect(parseRgb(skeleton['background-color']), `${scope.label} DS-063 block`).toEqual(sunken);

      const media = await computed(section.getByTestId('gallery-structure-media-area-default').locator('bui-media-area'), [
        'background-color',
      ]);
      expect(parseRgb(media['background-color']), `${scope.label} DS-065 surface`).toEqual(sunken);

      const caption = await computed(section.getByTestId('gallery-structure-tag-default').locator('figcaption'), [
        'color',
      ]);
      expect(parseRgb(caption['color']), `${scope.label} caption`).toEqual(await color('--bui-color-text-muted'));

      const title = await computed(
        section.getByTestId('gallery-structure-card-static').getByRole('heading', { level: 3 }),
        ['color'],
      );
      expect(parseRgb(title['color']), `${scope.label} DS-030 title`).toEqual(await color('--bui-color-text'));
    }
  });
});
```

### 5.3 Playwright: e2e/keyboard-and-accessibility.spec.ts (E5)

Additional imports: type Page already imported; STRUCTURE_GROUPS not needed. structure helper defined locally as in §5.2. FOCUSABLE, tabTo, expectFocusRing, panel already exist.

Rule: no evaluate callback may reference a variable from the test scope. Values are passed as the second argument, as in FOCUSABLE below.

```ts
const structure = (page: Page, scope: Scope) =>
  panel(page, scope).getByTestId('gallery-structure-section-default');

type Motion = {
  readonly isCss: boolean;
  readonly hasEffect: boolean;
  readonly name: string | null;
  readonly duration: number | null;
  readonly iterations: number | 'infinite' | null;
};

/** Reads animations inside the page. `Infinity` is encoded as 'infinite' for serialization. */
async function motionOf(block: Locator): Promise<Motion[]> {
  return block.evaluate(
    (element): Motion[] =>
      element.getAnimations().map((animation) => {
        const timing = animation.effect?.getComputedTiming();
        const duration = timing?.duration;
        const iterations = timing?.iterations;
        return {
          isCss: animation instanceof CSSAnimation,
          hasEffect: animation.effect !== null,
          name: animation instanceof CSSAnimation ? animation.animationName : null,
          duration: typeof duration === 'number' ? duration : null,
          iterations:
            iterations === Infinity ? 'infinite' : typeof iterations === 'number' ? iterations : null,
        };
      }),
  );
}
```

**K1. The structure view has one link and one tab stop, on the interactive card, in <scope> (four scopes):**

```ts
await openGallery(page, scope.id);
const section = structure(page, scope);
const figure = section.getByTestId('gallery-structure-card-interactive-default');
const link = figure.getByRole('link');
await expect(link).toHaveCount(1);
const title = (await figure.getByRole('heading', { level: 3 }).textContent())!.trim();
await expect(link).toHaveAccessibleName(title);
expect(await section.evaluate((root, selector) => root.querySelectorAll(selector).length, FOCUSABLE)).toBe(1);
await expect(section.getByTestId('gallery-structure-card-static').locator(FOCUSABLE)).toHaveCount(0);
await expect(section.getByTestId('gallery-structure-card-loading').locator(FOCUSABLE)).toHaveCount(0);
await tabTo(page, link);
await expectFocusRing(scope, page, link, figure.locator('article'));
```

**K2. Hides the isolated skeletons and gives busy and Loading only to the DS-035 card, in <scope> (four scopes):**

```ts
await openGallery(page, scope.id);
const section = structure(page, scope);
await expect(section.locator('bui-skeleton-block')).toHaveCount(9);
await expect(section.locator('bui-loading-skeleton')).toHaveCount(2);
const allHidden = await section.evaluate((root) =>
  Array.from(root.querySelectorAll('bui-skeleton-block, bui-loading-skeleton')).every(
    (element) => element.getAttribute('aria-hidden') === 'true',
  ),
);
expect(allHidden).toBe(true);
await expect(section.locator('[aria-busy="true"]')).toHaveCount(1);
const loadingCard = section.getByTestId('gallery-structure-card-loading');
await expect(loadingCard.locator('article[aria-busy="true"]')).toHaveCount(1);
await expect(section.getByText('Loading', { exact: true })).toHaveCount(1);
await expect(loadingCard.getByText('Loading', { exact: true })).toHaveCount(1);
```

**K3. The isolated skeletons are visible, contained, sunken, animate normally and stop under reduced motion, in <scope> (four scopes).**

Selected approach: scroll the figure into view, then assert containment in the figure and bounds in the viewport. The sticky top bar can overlap the viewport edge. This test therefore proves geometric containment and viewport bounds, not occlusion.

Three assertions were added to the Revision 3 K3 body and are the only changes to it: `toBeVisible()` on the figure before `boundingBox()`, `toBeVisible()` on each block before its `boundingBox()`, and the viewport left-edge assertion `expect(box.x, ...inside viewport, left).toBeGreaterThanOrEqual(-0.5)`.

```ts
test(`the isolated skeletons are visible, contained, sunken, animate normally and stop under reduced motion, in ${scope.label}`, async ({ page }) => {
  await openGallery(page, scope.id);
  const scoped = panel(page, scope);
  const section = structure(page, scope);
  const sunken = await resolveColor(scoped, '--bui-color-surface-sunken');
  const viewport = (await page.viewportSize())!;
  const targets = [
    { name: 'DS-063', figure: section.getByTestId('gallery-structure-skeleton-block-loading'), blocks: 1 },
    { name: 'DS-066', figure: section.getByTestId('gallery-structure-loading-skeleton-loading'), blocks: 4 },
    { name: 'DS-035', figure: section.getByTestId('gallery-structure-card-loading'), blocks: 4 },
  ] as const;
  const blocks = targets.map((target) => target.figure.locator('bui-skeleton-block'));

  for (const [index, target] of targets.entries()) {
    await expect(blocks[index], `${target.name} block count`).toHaveCount(target.blocks);
  }

  // Geometry and paint, in normal motion.
  for (const [index, target] of targets.entries()) {
    await target.figure.scrollIntoViewIfNeeded();
    await expect(target.figure, `${target.name} figure visible`).toBeVisible();
    const figureBox = (await target.figure.boundingBox())!;
    for (let i = 0; i < target.blocks; i++) {
      const block = blocks[index].nth(i);
      await expect(block, `${target.name} block ${i} visible`).toBeVisible();
      const box = (await block.boundingBox())!;
      expect(box.width, `${target.name} block ${i} width`).toBeGreaterThan(0);
      expect(box.height, `${target.name} block ${i} height`).toBeGreaterThan(0);
      expect(box.x, `${target.name} block ${i} inside figure, left`).toBeGreaterThanOrEqual(figureBox.x - 0.5);
      expect(box.y, `${target.name} block ${i} inside figure, top`).toBeGreaterThanOrEqual(figureBox.y - 0.5);
      expect(box.x + box.width, `${target.name} block ${i} inside figure, right`).toBeLessThanOrEqual(
        figureBox.x + figureBox.width + 0.5,
      );
      expect(box.y + box.height, `${target.name} block ${i} inside figure, bottom`).toBeLessThanOrEqual(
        figureBox.y + figureBox.height + 0.5,
      );
      expect(box.x, `${target.name} block ${i} inside viewport, left`).toBeGreaterThanOrEqual(-0.5);
      expect(box.y, `${target.name} block ${i} inside viewport, top`).toBeGreaterThanOrEqual(0);
      expect(box.x + box.width, `${target.name} block ${i} inside viewport, right`).toBeLessThanOrEqual(
        viewport.width + 0.5,
      );
      expect(box.y + box.height, `${target.name} block ${i} inside viewport, bottom`).toBeLessThanOrEqual(
        viewport.height + 0.5,
      );
      const fill = await block.evaluate((element) => getComputedStyle(element).backgroundColor);
      expect(parseRgb(fill), `${target.name} block ${i} paint`).toEqual(sunken);
    }
  }

  try {
    // Normal motion: every block animates as the atom specifies.
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    for (const [index, target] of targets.entries()) {
      for (let i = 0; i < target.blocks; i++) {
        const motion = (await motionOf(blocks[index].nth(i))).filter((entry) => entry.isCss);
        expect(motion.length, `${target.name} block ${i} CSS animations`).toBeGreaterThan(0);
        const first = motion[0]!;
        expect(first.hasEffect, `${target.name} block ${i} effect present`).toBe(true);
        expect(first.name, `${target.name} block ${i} animation name`).not.toBe('none');
        expect(first.name, `${target.name} block ${i} animation name`).toBeTruthy();
        expect(first.duration, `${target.name} block ${i} duration`).toBe(1400);
        expect(first.iterations, `${target.name} block ${i} iterations`).toBe('infinite');
      }
    }

    // Reduced motion: one switch, then every block is checked.
    await page.emulateMedia({ reducedMotion: 'reduce' });
    for (const [index, target] of targets.entries()) {
      for (let i = 0; i < target.blocks; i++) {
        const block = blocks[index].nth(i);
        expect(await motionOf(block), `${target.name} block ${i} animations`).toEqual([]);
        expect(
          await block.evaluate((element) => getComputedStyle(element).animationName),
          `${target.name} block ${i} animation-name`,
        ).toBe('none');
      }
    }
  } finally {
    await page.emulateMedia({ reducedMotion: 'no-preference' });
  }
});
```

Type notes: `Locator.boundingBox()` returns `Promise<{x,y,width,height} | null>`. The `!` on the figure box is safe because the figure is asserted visible and count-checked first. The `!` on each block box is safe because each block is asserted visible first. `getAnimations()` returns `Animation[]`; the narrowing to CSSAnimation happens in motionOf before animationName is read, and effect !== null is asserted explicitly.

**K4. The view stacks to one column with no horizontal overflow, and its Cards stay usable, at phone width (one test, all scopes):**

```ts
await page.setViewportSize({ width: 400, height: 900 });
await openGallery(page, 'all');
for (const scope of SCOPES) {
  const section = structure(page, scope);
  const groups = await section.evaluate((root) =>
    Array.from(root.querySelectorAll<HTMLElement>('[role="group"]')).map((group) => {
      const figures = Array.from(group.querySelectorAll('figure')).map((figure) => figure.getBoundingClientRect());
      return {
        lefts: new Set(figures.map((rect) => Math.round(rect.left))).size,
        stacked: figures.every((rect, index) => index === 0 || rect.top >= figures[index - 1].bottom - 0.5),
      };
    }),
  );
  for (const group of groups) {
    expect(group.lefts, `${scope.label}: one column`).toBe(1);
    expect(group.stacked, `${scope.label}: figures stacked`).toBe(true);
  }
  const tops = await section.evaluate((root) =>
    Array.from(root.querySelectorAll<HTMLElement>('[role="group"]')).map((group) => group.getBoundingClientRect().top),
  );
  expect(tops, `${scope.label}: reading order`).toEqual([...tops].sort((a, b) => a - b));

  const overflow = await section.evaluate((root) => {
    const bounds = root.getBoundingClientRect();
    const outside = Array.from(root.querySelectorAll('figure, figure *')).filter((element) => {
      const box = element.getBoundingClientRect();
      return box.right > bounds.right + 0.5 || box.left < bounds.left - 0.5;
    }).length;
    return { scroll: root.scrollWidth - root.clientWidth, outside };
  });
  expect(overflow, `${scope.label}: no horizontal overflow`).toEqual({ scroll: 0, outside: 0 });

  for (const testId of ['gallery-structure-card-static', 'gallery-structure-card-interactive-default']) {
    const usable = await section.getByTestId(testId).locator('article').evaluate((article) => {
      const card = article.getBoundingClientRect();
      return Array.from(article.querySelectorAll('h3, p.text, p.meta, a')).every((element) => {
        const box = element.getBoundingClientRect();
        return box.width > 0 && box.left >= card.left - 0.5 && box.right <= card.right + 0.5;
      });
    });
    expect(usable, `${scope.label}: ${testId} content inside its Card`).toBe(true);
  }
  await expect(section.getByTestId('gallery-structure-card-interactive-default').getByRole('link')).toBeVisible();
}
```

Overflow is checked only inside the structure section, because the existing long-label cases are fixed-width and their behaviour at 400px has not been measured.

**K5. Heading order, the panel h2, the h3 Card structure heading, the h3 organism titles, the absent DS-035 heading and non-heading group labels are explicit in every scope (one test, all scopes):**

```ts
await openGallery(page, 'all');
for (const scope of SCOPES) {
  const scoped = panel(page, scope);
  const headings = await scoped.evaluate((root) =>
    Array.from(root.querySelectorAll('h1,h2,h3,h4,h5,h6')).map((heading) => ({
      level: Number(heading.tagName.slice(1)),
      text: (heading.textContent ?? '').replace(/\s+/g, ' ').trim(),
    })),
  );
  expect(headings[0]?.level, `${scope.label}: panel begins with h2`).toBe(2);
  expect(headings[0]?.text, `${scope.label}: panel h2 text`).toBe(scope.label);
  for (let i = 1; i < headings.length; i++) {
    expect(headings[i].level - headings[i - 1].level, `${scope.label}: no skip before "${headings[i].text}"`).toBeLessThanOrEqual(1);
  }

  const section = structure(page, scope);
  await expect(section.getByRole('heading', { level: 3, name: /^Card structure/ })).toHaveCount(1);
  await expect(section.getByRole('heading', { level: 3 })).toHaveCount(3);
  for (const testId of ['gallery-structure-card-static', 'gallery-structure-card-interactive-default']) {
    const figure = section.getByTestId(testId);
    const title = (await figure.getByRole('heading', { level: 3 }).textContent())!.trim();
    await expect(figure.getByRole('heading', { level: 3, name: title, exact: true })).toHaveCount(1);
  }
  await expect(section.getByTestId('gallery-structure-card-loading').getByRole('heading')).toHaveCount(0);
  for (const name of ['Atoms', 'Molecules', 'Organism']) {
    await expect(section.getByRole('group', { name, exact: true })).toHaveCount(1);
    await expect(section.getByRole('heading', { name, exact: true })).toHaveCount(0);
  }
}
```

## 6. Static gate: card-structure.component.scss and forbidden patterns

**Command.** Gate G8 runs the checker inside the Phase B verify script, function `Test-StaticGate` (Appendix A2). The checker is an inline Node program: its JavaScript is in a PowerShell single-quoted here-string, piped to `node --input-type=module`, and `$LASTEXITCODE` is checked immediately. It writes no file. Its terminal output is the implementation evidence.

**Policy.** Declaration values are reduced by removing permitted forms. Anything left over fails. Permitted forms are var(--bui-NAME) where --bui-NAME is declared in projects/ui/src/lib/theme/tokens/*.css, the exact form calc(var(--bui-NAME) * INTEGER), and the keywords and literals 0, 100%, 1fr, auto-fill, repeat, minmax, min, calc, block, flex, grid, inline-block, column, start, border-box, solid, currentColor. Forbidden constructs: @, &, backslash, url(, !important, expression(, image-set(, and any // after comment stripping.

**Source check.** `FORBIDDEN_SOURCE` covers `style=`, `[style`, `ngStyle`, `ngClass`, `CommonModule`, `standalone:`, `ChangeDetectionStrategy`, `@HostBinding`/`@HostListener`, `data-specimen`, `is-*`, and `: any`.

**Failure behaviour.** Any probe failure, source failure, missing file, or non-zero Node exit throws, which stops Phase B.

## 7. Phase lifecycle, temporary scripts and execution

The clean-tree requirement and the ten implementation changes cannot both hold in one process, so the lifecycle is split:

- **Phase A (preflight)** runs before any implementation edit, on a clean tree at the approved planning commit. It stops after preflight and never runs G1–G18.
- **Authorized implementation interval.** The Development Team makes the ten approved changes. No script is running.
- **Phase B (verification)** runs after the ten changes, does not require a clean tree, and runs G1–G18 in order.

The approved planning-commit SHA is the durable connection between the phases. It is the SHA of the Moderator-authorized planning commit that contains this file. It is recorded in the evidence and passed explicitly to each run. No PowerShell variable is shared across the interval.

**Temporary scripts.** Both scripts live outside the repository and are not implementation paths.

| Script | Exact path | Phase | SHA-256 |
|---|---|---|---|
| Preflight | `C:\Users\User\AppData\Local\Temp\brand-ui-step-07-preflight.ps1` | A | `359844fa8c91b3f9367f2177ec1af3d5894f349b450b650645fd3e70169717af` |
| Verification | `C:\Users\User\AppData\Local\Temp\brand-ui-step-07-verify.ps1` | B | `d2677ed93916dac93849610820582f2803f3dca843cfd3683bbbb2c979f70081` |

**Creation method.** Write the text of Appendix A1 and Appendix A2, verbatim, with LF line endings and UTF-8 without BOM, to the exact paths above. Do not edit either script to make a hash match.

**Literal hash comparison (evidence, immediately before each invocation).**

```powershell
$expected = '359844fa8c91b3f9367f2177ec1af3d5894f349b450b650645fd3e70169717af'
$actual = (Get-FileHash -Algorithm SHA256 -LiteralPath 'C:\Users\User\AppData\Local\Temp\brand-ui-step-07-preflight.ps1').Hash
if ($actual -ne $expected) { throw "preflight script hash mismatch: $actual" }
Write-Output "preflight script hash OK: $actual"
```

```powershell
$expected = 'd2677ed93916dac93849610820582f2803f3dca843cfd3683bbbb2c979f70081'
$actual = (Get-FileHash -Algorithm SHA256 -LiteralPath 'C:\Users\User\AppData\Local\Temp\brand-ui-step-07-verify.ps1').Hash
if ($actual -ne $expected) { throw "verify script hash mismatch: $actual" }
Write-Output "verify script hash OK: $actual"
```

(`-ne` on strings is case-insensitive in PowerShell, and `Get-FileHash` returns upper-case hex.)

**Repository location.** Both scripts take `-RepoPath`, defaulting to `C:\Users\User\Documents\_projects-angular\brand-ui`. Each validates the path, calls `Set-Location -LiteralPath $RepoPath` before the first Git command, and confirms that `git rev-parse --show-toplevel` resolves to the same directory.

**Invocation, Phase A (before implementation).** `-ApprovedSha` is the full SHA of the planning commit that contains this file, recorded when it is made. Do not infer it.

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "C:\Users\User\AppData\Local\Temp\brand-ui-step-07-preflight.ps1" -ApprovedSha <recorded planning commit SHA>
```

**Invocation, Phase B (after implementation).**

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "C:\Users\User\AppData\Local\Temp\brand-ui-step-07-verify.ps1" -ApprovedSha <recorded planning commit SHA>
```

Both scripts use `$ErrorActionPreference = 'Stop'`. An uncaught `throw` under `-File` produces exit code 1. Each native command's `$LASTEXITCODE` is checked immediately after the call.

**Cleanup, after evidence is recorded.** Literal paths only:

```powershell
Remove-Item -LiteralPath 'C:\Users\User\AppData\Local\Temp\brand-ui-step-07-preflight.ps1'
Remove-Item -LiteralPath 'C:\Users\User\AppData\Local\Temp\brand-ui-step-07-verify.ps1'
```

Neither script creates a repository evidence file. Phase B's `npm ci` and builds create only ignored output.

## 8. Ordered gates and AC/Design-ID mapping

Phase A and Phase B are separate. The implementation interval sits between them.

| Phase | Gate | Command or section | Prerequisite | Success condition | Maps to |
|---|---|---|---|---|---|
| A | A0 | Preflight: PowerShell 5.1, repository path and top level | Preflight invoked | Top level equals `RepoPath` | Precondition |
| A | A1 | Node 26.x; npm 11.12.1 | A0 | Versions match | Required toolchain; AC-23 |
| A | A2 | HEAD equals `-ApprovedSha` | A1 | HEAD equals the approved planning commit | AC-23 baseline |
| A | A3 | Tree clean, including untracked files | A2 | `git status --porcelain=v1 --untracked-files=all` empty | AC-23 baseline |
| A | A4 | `dist/`, `test-results/`, `playwright-report/`, `node_modules/` ignored, each checked separately | A3 | Each `git check-ignore -q -- <path>/` exits 0 | AC-24 |
| — | Implementation interval | The ten approved changes are made. No script runs. | Phase A exit 0 | Ten changed paths | AC-23 |
| B | Prelude | PowerShell 5.1, repository path, top level; `$BASE` assigned from `-ApprovedSha` | Phase B invoked after implementation | Top level equals `RepoPath` | Precondition |
| B | B1 | Node 26.x; npm 11.12.1 | Prelude | Versions match | Required toolchain |
| B | B0 | HEAD equals `$BASE`; tree need not be clean | B1 | HEAD equals the approved planning commit | AC-23 baseline |
| B | G0 | Ignores, each checked separately (as A4) | B0 | Each exits 0 | AC-24 |
| B | G1 | `npm ci` | G0 | Exit 0 | AC-23 |
| B | G2 | `npm run verify:atomic-archive` | G1 | Exit 0; archive unchanged | AC-22, AC-23 |
| B | G3 | V4 and V5 (HEAD equals `$BASE` again at V4) | G2 | Exact ten; five ?? and five ` M`; no excluded or mod-w change | AC-23, AC-14 |
| B | G4 | `npm run format:check` | G3 | Exit 0 | AC-24 |
| B | G5 | `npm run lint:tokens` | G4 | Exit 0; scope unchanged | AC-24 |
| B | G6 | `npm run check:assets` | G5 | Exit 0 | AC-24 |
| B | G7 | `npm run typecheck:e2e` | G6 | Exit 0 | AC-24 |
| B | G8 | Static checker, `Test-StaticGate` (§6, Appendix A2) | G7; the real structure files exist | `STRUCTURE STATIC CHECK: PASS`; exit 0 | AC-3, AC-25 (tokens only); project rules |
| B | G9 | `npm test` | G8 | Exit 0 (three projects) | AC-20, AC-24, AC-25 |
| B | G10 | `npx playwright test e2e/brand-and-contrast.spec.ts` | G9 | Exit 0 (B1–B3) | AC-25 |
| B | G11 | `npx playwright test e2e/keyboard-and-accessibility.spec.ts` | G10 | Exit 0 (K1–K5, axe) | AC-24, AC-25 |
| B | G12 | `npx playwright test e2e/long-label-and-bevel.spec.ts` | G11 | Exit 0; unchanged | AC-20, AC-24 |
| B | G13 | `npm run test:e2e` | G12 | Exit 0; exactly three specifications | AC-20, AC-24, AC-25 |
| B | G14 | `npm run build` | G13 | Exit 0 | AC-23, AC-25 |
| B | G15 | `npm run build:subfolder` | G14 | Exit 0 | AC-19, AC-23 |
| B | G16 | V1 (`git diff --check $BASE`) and V2 (untracked whitespace) | G15 | Both pass | AC-24 (hygiene) |
| B | G17 | V3 (`card.spec.ts` unchanged against `$BASE`) | G16 | Exit 0 | AC-20 |
| B | G18 | V4 and V5 (HEAD equals `$BASE` again) | G17 | As G3 | AC-23, AC-24 |

**Check labels.**

- **V1:** `git diff --check $BASE` for tracked files.
- **V2:** trailing whitespace, space-before-tab, and blank EOF on the five untracked approved files. This is a limited claim, not a full `git diff --check` equivalent. G4 covers formatting.
- **V3:** `git diff --exit-code $BASE -- projects/ui/src/lib/card/card.spec.ts`.
- **V4:** the exact-ten, deletion, and excluded-category proof.
- **V5:** the five-new and five-modified status proof.

**Design-ID mapping.**

| Check | Design ID | Tests |
|---|---|---|
| Section, groups, heading, captions | DS-061 | Vitest 1–6; B1; K5 |
| Tag | DS-062 | Vitest 4–5; B1; B3 |
| Skeleton block: visible, contained, paint, motion | DS-063 | Vitest 9; K2; K3; B3 |
| Code well (P1) | DS-064 | Vitest 7; B2 |
| Media area | DS-065 | B1; B3 |
| Loading skeleton: geometry, motion, hidden | DS-066 | Vitest 9; K2; K3 |
| Card static | DS-030 | Vitest 3–5, 7; B1; B2; B3; K5 |
| Card interactive: one link and tab stop, focus, h3 | DS-031 | Vitest 8; K1; K4; K5 |
| Card loading: busy, one Loading, no heading, motion | DS-035 | Vitest 3, 9; K2; K3; K5 |

**AC mapping.** AC-20: §9, G12, G13, G17. AC-23: installed imports, A1–A3, G1–G3, G14, G15, G18. AC-24: G0 and G4–G13, G16, G18. AC-25: B1–B3, K1–K5, placement it, G8.

## 9. AC-20 exception (Option A, the only amendment) — approved

- **Edit 1.** gallery-page.component.spec.ts, line 206: `root.querySelectorAll('bui-card')` becomes `root.querySelectorAll('[data-specimen="card"] bui-card')`. Expected value 6 is retained.
- **Edit 2.** gallery-page.component.spec.ts, line 395: `root.querySelectorAll('bui-card')` becomes `root.querySelectorAll('[data-specimen="card"] bui-card')`. Expected vector [0, 1, 1, 1, 1, 0] and test name are retained.

**Recorded reason (AC-20).** The two selector edits scope the existing Card-section assertions to the Card section's own `data-specimen="card"` wrappers. This measures the pre-existing Card contract (count 6, link vector [0,1,1,1,1,0]) unchanged, while isolating it from the new gallery-owned structure surface, which renders three additional bui-card hosts per panel. Expected values, test names and assertion meaning are unchanged.

No other existing assertion may change. No structure element carries data-specimen.

## 10. Stop conditions

Halt if any of the following occurs:

- Phase A fails, or HEAD differs from the approved planning commit, or the tree is not clean at the start.
- Phase B's B0 check fails, or HEAD differs from `$BASE` at V4 (G3 or G18).
- A script hash differs from the recorded value in §7.
- The planning commit is not made, or the approval record is missing.
- A file outside the ten approved paths changes, is created, or is deleted, or any mod-w/**, atomic, archive, manifest, lockfile, ui, token or helper path changes.
- An existing assertion beyond Edits 1 and 2 needs to change.
- A structure element carries data-specimen, data-specimen-state, data-pair, data-token, a class containing is-, or a nav, dialog or input element.
- A width, height, radius, colour, font or spacing value is needed that the §6 policy cannot express with an existing token.
- The static gate exits non-zero or its self-test fails. A probe that is not rejected, or a positive probe that is rejected, is a stop.
- The checker cannot be executed by `node --input-type=module` from the piped here-string in this environment. The Team reports this and stops. It does not substitute a different command.
- The gallery needs a path alias or relative import into atomic source, or installed resolution fails.
- A Card, atom or molecule change is needed.
- A Playwright specification file beyond the existing three is needed.
- Any structure difference outside P1–P3 appears in any scope.
- A heading skip, a non-h3 organism title, a heading in the DS-035 card, or a heading-named group label appears.
- An unexpected focus target, live region, Loading text or aria-busy appears in the structure section.
- Axe reports a serious or critical violation.
- K3 cannot prove containment, paint, animation or reduced motion without changing the approved approach.
- K4 fails: no one-column layout, horizontal overflow in the structure section, or clipped Card content.
- Any gate fails, or the required toolchain is unavailable.

## 11. Moderator decisions (approved 2026-10-28)

1. **AC-20 Option A:** change only the two existing global `bui-card` selectors to `[data-specimen="card"] bui-card`, retaining the count of 6 and vector `[0,1,1,1,1,0]`, with the reason recorded in §9.
2. **Caption-visibility rule:** `.label` and `.built` always visible; `.state` follows the Design-ID toggle (§3).
3. **Token-derived responsive track rule:** `minmax(min(100%, calc(var(--bui-control-height) * 6)), 1fr)` (§2 C4; §3).
4. **Static-check policy and its two-phase PowerShell execution plan:** §6 policy; §7 lifecycle; Appendix A.
5. **DS-035 no-heading correction:** the loading Card has no heading (§4.3).

## 12. Preconditions before implementation

1. The planning commit containing this file exists, and its full SHA is recorded.
2. Node 26.x and npm 11.12.1 are installed on the implementation machine. On the planning machine, Node was v24.13.0 and npm 11.6.2, so Phase A's A1 would fail there.
3. Phase A passes before any implementation edit.

## Appendix A1: Phase A preflight script, `brand-ui-step-07-preflight.ps1`

Path: `C:\Users\User\AppData\Local\Temp\brand-ui-step-07-preflight.ps1`. SHA-256: `359844fa8c91b3f9367f2177ec1af3d5894f349b450b650645fd3e70169717af`.

```powershell
# STEP-07 Revision 5, Phase A: pre-implementation preflight.
# Run before any implementation edit. The script stops after preflight and never runs G1-G18.
# Creation: write this text verbatim to C:\Users\User\AppData\Local\Temp\brand-ui-step-07-preflight.ps1
# Invocation (Windows PowerShell 5.1):
#   powershell.exe -NoProfile -ExecutionPolicy Bypass -File "C:\Users\User\AppData\Local\Temp\brand-ui-step-07-preflight.ps1" -ApprovedSha <40-hex approved planning commit>
param(
  [Parameter(Mandatory = $true)]
  [ValidatePattern('^[0-9a-f]{40}$')]
  [string]$ApprovedSha,
  [string]$RepoPath = 'C:\Users\User\Documents\_projects-angular\brand-ui'
)
$ErrorActionPreference = 'Stop'

if ($PSVersionTable.PSVersion.Major -ne 5 -or $PSVersionTable.PSVersion.Minor -ne 1) {
  throw "A0 FAIL: Windows PowerShell 5.1 required, found $($PSVersionTable.PSVersion)"
}
if (-not (Test-Path -LiteralPath $RepoPath -PathType Container)) { throw "A0 FAIL: repository path not found: $RepoPath" }
Set-Location -LiteralPath $RepoPath
$top = [string](& git rev-parse --show-toplevel)
if ($LASTEXITCODE -ne 0) { throw "A0 FAIL: not inside a git repository (exit $LASTEXITCODE)" }
if ([System.IO.Path]::GetFullPath($top.Replace('/', '\')) -ne [System.IO.Path]::GetFullPath($RepoPath)) {
  throw "A0 FAIL: repository top level $top differs from RepoPath $RepoPath"
}
Write-Output "A0 PASS: repository $top"

$nodeV = [string](& node -v)
if ($LASTEXITCODE -ne 0 -or $nodeV -notmatch '^v26\.') { throw "A1 FAIL: Node 26.x required, found $nodeV (exit $LASTEXITCODE)" }
$npmV = [string](& npm -v)
if ($LASTEXITCODE -ne 0 -or $npmV -ne '11.12.1') { throw "A1 FAIL: npm 11.12.1 required, found $npmV (exit $LASTEXITCODE)" }
Write-Output "A1 PASS: node $nodeV, npm $npmV"

$head = [string](& git rev-parse HEAD)
if ($LASTEXITCODE -ne 0 -or $head -ne $ApprovedSha) {
  throw "A2 FAIL: HEAD $head is not the approved planning commit $ApprovedSha (exit $LASTEXITCODE)"
}
Write-Output "A2 PASS: HEAD equals the approved planning commit $ApprovedSha"

$dirty = @(& git -c core.quotepath=off status --porcelain=v1 --untracked-files=all)
if ($LASTEXITCODE -ne 0) { throw "A3 FAIL: git status exit $LASTEXITCODE" }
if ($dirty.Count -ne 0) { throw "A3 FAIL: tree not clean ($($dirty.Count) entries): $($dirty -join '; ')" }
Write-Output 'A3 PASS: working tree clean, including untracked files'

foreach ($p in @('dist/', 'test-results/', 'playwright-report/', 'node_modules/')) {
  & git check-ignore -q -- $p
  if ($LASTEXITCODE -ne 0) { throw "A4 FAIL: $p is not ignored (check-ignore exit $LASTEXITCODE)" }
  Write-Output "A4 PASS: $p ignored"
}

Write-Output "PHASE A PASS: approved planning baseline $ApprovedSha. G1-G18 were not run."
```

## Appendix A2: Phase B verification script, `brand-ui-step-07-verify.ps1`

Path: `C:\Users\User\AppData\Local\Temp\brand-ui-step-07-verify.ps1`. SHA-256: `d2677ed93916dac93849610820582f2803f3dca843cfd3683bbbb2c979f70081`.

```powershell
# STEP-07 Revision 5, Phase B: post-implementation verification.
# Run only after the ten approved implementation paths have changed. It does not require a clean tree.
# Creation: write this text verbatim to C:\Users\User\AppData\Local\Temp\brand-ui-step-07-verify.ps1
# Invocation (Windows PowerShell 5.1):
#   powershell.exe -NoProfile -ExecutionPolicy Bypass -File "C:\Users\User\AppData\Local\Temp\brand-ui-step-07-verify.ps1" -ApprovedSha <40-hex approved planning commit>
# Every gate throws on failure. An uncaught throw under -File exits with code 1 and stops the run.
param(
  [Parameter(Mandatory = $true)]
  [ValidatePattern('^[0-9a-f]{40}$')]
  [string]$ApprovedSha,
  [string]$RepoPath = 'C:\Users\User\Documents\_projects-angular\brand-ui'
)
$ErrorActionPreference = 'Stop'

if ($PSVersionTable.PSVersion.Major -ne 5 -or $PSVersionTable.PSVersion.Minor -ne 1) {
  throw "B0 FAIL: Windows PowerShell 5.1 required, found $($PSVersionTable.PSVersion)"
}
if (-not (Test-Path -LiteralPath $RepoPath -PathType Container)) { throw "B0 FAIL: repository path not found: $RepoPath" }
Set-Location -LiteralPath $RepoPath
$top = [string](& git rev-parse --show-toplevel)
if ($LASTEXITCODE -ne 0) { throw "B0 FAIL: not inside a git repository (exit $LASTEXITCODE)" }
if ([System.IO.Path]::GetFullPath($top.Replace('/', '\')) -ne [System.IO.Path]::GetFullPath($RepoPath)) {
  throw "B0 FAIL: repository top level $top differs from RepoPath $RepoPath"
}

# The approved planning commit is the durable baseline. BASE is assigned from the parameter, not captured again.
$BASE = $ApprovedSha

# [FUNCTIONS-BEGIN]
$script:Approved = @(
  'e2e/brand-and-contrast.spec.ts',
  'e2e/keyboard-and-accessibility.spec.ts',
  'projects/gallery/src/app/gallery/gallery-page.component.html',
  'projects/gallery/src/app/gallery/gallery-page.component.spec.ts',
  'projects/gallery/src/app/gallery/gallery-page.component.ts',
  'projects/gallery/src/app/gallery/specimens/structure-specimens.ts',
  'projects/gallery/src/app/gallery/structure/card-structure.component.html',
  'projects/gallery/src/app/gallery/structure/card-structure.component.scss',
  'projects/gallery/src/app/gallery/structure/card-structure.component.spec.ts',
  'projects/gallery/src/app/gallery/structure/card-structure.component.ts'
)

function Invoke-Gate {
  param([string]$Gate, [string]$Exe, [string[]]$Arguments)
  & $Exe @Arguments
  if ($LASTEXITCODE -ne 0) { throw "$Gate FAIL: $Exe $($Arguments -join ' ') exit $LASTEXITCODE" }
  Write-Output "$Gate PASS"
}

function Get-ExpectedPaths {
  $expected = @($script:Approved | Sort-Object -Unique -CaseSensitive)
  if ($expected.Count -ne 10) { throw "V4 FAIL: approved list must hold ten unique paths, found $($expected.Count)" }
  return $expected
}

function Get-UntrackedPaths {
  $list = @(& git -c core.quotepath=off ls-files --others --exclude-standard)
  if ($LASTEXITCODE -ne 0) { throw "V4 FAIL: git ls-files exit $LASTEXITCODE" }
  return $list
}

function Get-ChangedPaths {
  param([string]$Base)
  $tracked = @(& git -c core.quotepath=off diff --name-only $Base --)
  if ($LASTEXITCODE -ne 0) { throw "V4 FAIL: git diff --name-only exit $LASTEXITCODE" }
  $untracked = @(Get-UntrackedPaths)
  return @(@($tracked) + @($untracked) | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne '' } | Sort-Object -Unique -CaseSensitive)
}

function Test-ScopeProof {
  $head = [string](& git rev-parse HEAD)
  if ($LASTEXITCODE -ne 0 -or $head -ne $BASE) { throw "V4 FAIL: HEAD $head differs from BASE $BASE (exit $LASTEXITCODE)" }
  $expected = @(Get-ExpectedPaths)
  $actual = @(Get-ChangedPaths $BASE)
  $diffs = @(Compare-Object -ReferenceObject $expected -DifferenceObject $actual -CaseSensitive)
  foreach ($d in $diffs) { Write-Output "V4 MISMATCH $($d.SideIndicator) $($d.InputObject)" }
  if ($diffs.Count -gt 0) { throw "V4 FAIL: $($diffs.Count) path mismatch(es)" }
  foreach ($p in $expected) {
    if (-not (Test-Path -LiteralPath $p)) { throw "V4 FAIL: approved path missing or deleted: $p" }
  }
  $deleted = @(& git -c core.quotepath=off diff --name-only --diff-filter=D $BASE --)
  if ($LASTEXITCODE -ne 0) { throw "V4 FAIL: deletion query exit $LASTEXITCODE" }
  if ($deleted.Count -gt 0) { throw "V4 FAIL: deleted tracked path(s): $($deleted -join ', ')" }
  if (@($actual | Where-Object { $_ -like 'mod-w/*' }).Count -gt 0) { throw 'V4 FAIL: mod-w change' }
  $excluded = @(
    'mod-w/*', 'projects/atomic/*', 'projects/ui/*', 'package-artifacts/*', 'package.json', 'package-lock.json',
    'scripts/*', 'e2e/helpers/*', 'tsconfig.json', 'e2e/tsconfig.json', 'angular.json', 'playwright.config.ts',
    'projects/gallery/src/app/gallery/specimens/specimens.ts'
  )
  foreach ($p in $actual) {
    foreach ($g in $excluded) {
      if ($p -like $g) { throw "V4 FAIL: excluded category changed: $p (matches $g)" }
    }
  }
  Write-Output 'V4 PASS: exactly the ten approved paths; none deleted; no excluded or mod-w change'
}

function Test-StatusCounts {
  $expected = @(Get-ExpectedPaths)
  $untracked = @(Get-UntrackedPaths)
  $status = @(& git -c core.quotepath=off status --porcelain=v1 --untracked-files=all)
  if ($LASTEXITCODE -ne 0) { throw "V5 FAIL: git status exit $LASTEXITCODE" }
  $other = @($status | ForEach-Object { $_.Substring(0, 2) } | Where-Object { @('??', ' M') -notcontains $_ })
  if ($other.Count -gt 0) { throw "V5 FAIL: forbidden status code(s): $($other -join ' ')" }
  $newPaths = @($status | Where-Object { $_.StartsWith('?? ') } | ForEach-Object { $_.Substring(3) })
  $modPaths = @($status | Where-Object { $_.StartsWith(' M ') } | ForEach-Object { $_.Substring(3) })
  if ($newPaths.Count -ne 5 -or $modPaths.Count -ne 5) {
    throw "V5 FAIL: expected 5 new and 5 modified, found $($newPaths.Count) new and $($modPaths.Count) modified"
  }
  $newExpected = @($expected | Where-Object { $untracked -ccontains $_ })
  $modExpected = @($expected | Where-Object { $untracked -cnotcontains $_ })
  if (@(Compare-Object -ReferenceObject $newExpected -DifferenceObject $newPaths -CaseSensitive).Count -gt 0) {
    throw 'V5 FAIL: new paths differ from the approved new set'
  }
  if (@(Compare-Object -ReferenceObject $modExpected -DifferenceObject $modPaths -CaseSensitive).Count -gt 0) {
    throw 'V5 FAIL: modified paths differ from the approved modified set'
  }
  Write-Output 'V5 PASS: five ?? and five modified entries; identities equal the approved ten'
}

function Test-Whitespace {
  & git diff --check $BASE
  if ($LASTEXITCODE -ne 0) { throw "V1 FAIL: git diff --check exit $LASTEXITCODE" }
  Write-Output 'V1 PASS: git diff --check against BASE (tracked files)'
  $expected = @(Get-ExpectedPaths)
  $untracked = @(Get-UntrackedPaths)
  $newFiles = @($expected | Where-Object { $untracked -ccontains $_ })
  if ($newFiles.Count -ne 5) { throw "V2 FAIL: expected 5 untracked approved files, found $($newFiles.Count)" }
  $bad = 0
  foreach ($f in $newFiles) {
    $hits = @(Select-String -LiteralPath $f -Pattern '[ \t]+\r?$|^ +\t')
    $text = [System.IO.File]::ReadAllText((Resolve-Path -LiteralPath $f).Path)
    if ($hits.Count -gt 0 -or $text -match '(\r?\n){2}$') { Write-Output "V2 WHITESPACE $f"; $bad++ }
  }
  if ($bad -gt 0) { throw "V2 FAIL: $bad untracked file(s) with whitespace errors" }
  Write-Output 'V2 PASS: trailing whitespace, space-before-tab and blank EOF in the five untracked approved files'
}

function Test-CardSpec {
  & git diff --exit-code $BASE -- projects/ui/src/lib/card/card.spec.ts
  if ($LASTEXITCODE -ne 0) { throw "V3 FAIL: card.spec.ts differs from BASE (exit $LASTEXITCODE)" }
  Write-Output 'V3 PASS: card.spec.ts unchanged against BASE'
}

function Test-StaticGate {
  $checker = @'
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const TOKEN_DIR = 'projects/ui/src/lib/theme/tokens';
const SCSS = 'projects/gallery/src/app/gallery/structure/card-structure.component.scss';
const SOURCES = [
  'projects/gallery/src/app/gallery/structure/card-structure.component.ts',
  'projects/gallery/src/app/gallery/structure/card-structure.component.html',
  'projects/gallery/src/app/gallery/specimens/structure-specimens.ts',
];
const TOKENS = new Set(
  readdirSync(TOKEN_DIR)
    .filter((file) => file.endsWith('.css'))
    .flatMap((file) =>
      [...readFileSync(join(TOKEN_DIR, file), 'utf8').matchAll(/(--bui-[a-z0-9-]+)\s*:/g)].map(
        (match) => match[1],
      ),
    ),
);
const ALLOWED = new Set([
  '0', '100%', '1fr', 'auto-fill', 'repeat', 'minmax', 'min', 'calc', 'block', 'flex', 'grid',
  'inline-block', 'column', 'start', 'border-box', 'solid', 'currentColor',
]);
const FORBIDDEN_CONSTRUCTS = /[@&]|\\|url\(|!important|expression\(|image-set\(/i;
const FORBIDDEN_SOURCE = [
  /\bstyle\s*=/, /\[style/, /\bngStyle\b/, /\bngClass\b/, /\bCommonModule\b/, /\bstandalone\s*:/,
  /\bChangeDetectionStrategy\b/, /@HostBinding|@HostListener/, /data-specimen/, /\bis-[a-z]/, /:\s*any\b/,
];
const RULE = /([^{}]+)\{([^{}]*)\}/g;

const read = (file) => {
  try {
    return readFileSync(file, 'utf8');
  } catch {
    return null;
  }
};
const stripComments = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

function unknownNames(value) {
  const normalised = value.replace(/\s+/g, ' ');
  const references = [...normalised.matchAll(/var\(--bui-([a-z0-9-]+)\)/g)].map((m) => `--bui-${m[1]}`);
  const rest = normalised
    .replace(/calc\(var\(--bui-[a-z0-9-]+\) \* [0-9]+\)/g, ' ')
    .replace(/var\(--bui-[a-z0-9-]+\)/g, ' ');
  const literals = rest.split(/[\s(),]+/).filter((token) => token !== '' && !ALLOWED.has(token));
  return [...literals, ...references.filter((name) => !TOKENS.has(name))];
}

function check(source) {
  const violations = [];
  const css = stripComments(source);
  if (css.includes('//')) violations.push('inline // comment or URL');
  if (FORBIDDEN_CONSTRUCTS.test(css)) violations.push('forbidden at-rule, ampersand, escape, url(), !important or function');
  const leftover = css.replace(RULE, '').trim();
  if (leftover !== '') violations.push(`text outside a simple rule: ${leftover.slice(0, 60)}`);
  for (const [, selector, body] of css.matchAll(RULE)) {
    for (const declaration of body.split(';')) {
      if (declaration.trim() === '') continue;
      const where = `${selector.trim()} { ${declaration.trim()} }`;
      const colon = declaration.indexOf(':');
      const property = colon < 0 ? '' : declaration.slice(0, colon).trim();
      const value = colon < 0 ? '' : declaration.slice(colon + 1).trim();
      if (!/^[a-z-]+$/.test(property) || value === '') {
        violations.push(`malformed declaration: ${where}`);
        continue;
      }
      const bad = unknownNames(value);
      if (bad.length > 0) violations.push(`literal, fallback or unknown token [${bad.join(' ')}]: ${where}`);
    }
  }
  return violations;
}

const NEGATIVE = [
  'a{color:#fff}', 'a{padding:12px}', 'a{font-family:Arial}',
  'a{color:var(--bui-color-text,#000)}', 'a{color:var(--bui-color-text, #000)}',
  'a{width:12rem}', 'a{color:red}', 'a{margin:5%}', 'a{border-radius:2px}', 'a{padding:0px}',
  'a{color:var(--bui-not-a-token)}', 'a{width:calc(var(--bui-space-5) * 1.5)}',
  'a{width:calc(100% - var(--bui-space-5))}', 'a{background:url(x.png)}',
  'a{color:var(--bui-color-text)!important}', '@media (min-width: 40rem) { a{width:0} }',
];
const POSITIVE = [
  'a{color:var(--bui-color-text)}',
  ':host{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,calc(var(--bui-control-height) * 6)),1fr));margin:0}',
];

let failures = 0;
const report = (ok, label, detail = '') => {
  if (!ok) failures += 1;
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${label}${!ok && detail ? ` -- ${detail}` : ''}`);
};

for (const probe of NEGATIVE) report(check(probe).length > 0, `negative probe rejected: ${probe}`, 'not rejected');
for (const probe of POSITIVE) {
  const found = check(probe);
  report(found.length === 0, `positive probe accepted: ${probe.slice(0, 48)}`, found.join(' | '));
}
const scss = read(SCSS);
report(scss !== null, `${SCSS} exists`, 'missing');
if (scss !== null) {
  const found = check(scss);
  report(found.length === 0, `${SCSS} uses tokens only`, found.join(' | '));
}
for (const file of SOURCES) {
  const text = read(file);
  report(text !== null, `${file} exists`, 'missing');
  if (text !== null) {
    const hits = FORBIDDEN_SOURCE.filter((pattern) => pattern.test(text));
    report(hits.length === 0, `${file} has no forbidden pattern`, hits.map(String).join(' '));
  }
}
console.log(failures === 0 ? 'STRUCTURE STATIC CHECK: PASS' : `STRUCTURE STATIC CHECK: FAIL (${failures} failing check(s))`);
process.exitCode = failures === 0 ? 0 : 1;
'@
  $checker | node --input-type=module
  if ($LASTEXITCODE -ne 0) { throw "G8 FAIL: static checker exit $LASTEXITCODE" }
  Write-Output 'G8 PASS: STRUCTURE STATIC CHECK exit 0'
}
# [FUNCTIONS-END]

# Toolchain, required again because npm ci runs in this phase.
$nodeV = [string](& node -v)
if ($LASTEXITCODE -ne 0 -or $nodeV -notmatch '^v26\.') { throw "B1 FAIL: Node 26.x required, found $nodeV (exit $LASTEXITCODE)" }
$npmV = [string](& npm -v)
if ($LASTEXITCODE -ne 0 -or $npmV -ne '11.12.1') { throw "B1 FAIL: npm 11.12.1 required, found $npmV (exit $LASTEXITCODE)" }
Write-Output "B1 PASS: node $nodeV, npm $npmV"

$head = [string](& git rev-parse HEAD)
if ($LASTEXITCODE -ne 0 -or $head -ne $BASE) { throw "B0 FAIL: HEAD $head differs from BASE $BASE (exit $LASTEXITCODE)" }
Write-Output "B0 PASS: HEAD equals BASE $BASE at the start of verification"

foreach ($p in @('dist/', 'test-results/', 'playwright-report/', 'node_modules/')) {
  & git check-ignore -q -- $p
  if ($LASTEXITCODE -ne 0) { throw "G0 FAIL: $p is not ignored (check-ignore exit $LASTEXITCODE)" }
}
Write-Output 'G0 PASS: dist, test-results, playwright-report and node_modules each ignored'

Invoke-Gate 'G1' 'npm' @('ci')
Invoke-Gate 'G2' 'npm' @('run', 'verify:atomic-archive')
Test-ScopeProof
Test-StatusCounts
Write-Output 'G3 PASS: scope proof (V4 and V5), HEAD equal to BASE'
Invoke-Gate 'G4' 'npm' @('run', 'format:check')
Invoke-Gate 'G5' 'npm' @('run', 'lint:tokens')
Invoke-Gate 'G6' 'npm' @('run', 'check:assets')
Invoke-Gate 'G7' 'npm' @('run', 'typecheck:e2e')
Test-StaticGate
Invoke-Gate 'G9' 'npm' @('test')
Invoke-Gate 'G10' 'npx' @('playwright', 'test', 'e2e/brand-and-contrast.spec.ts')
Invoke-Gate 'G11' 'npx' @('playwright', 'test', 'e2e/keyboard-and-accessibility.spec.ts')
Invoke-Gate 'G12' 'npx' @('playwright', 'test', 'e2e/long-label-and-bevel.spec.ts')
Invoke-Gate 'G13' 'npm' @('run', 'test:e2e')
Invoke-Gate 'G14' 'npm' @('run', 'build')
Invoke-Gate 'G15' 'npm' @('run', 'build:subfolder')
Test-Whitespace
Write-Output 'G16 PASS: V1 and V2'
Test-CardSpec
Write-Output 'G17 PASS: V3'
Test-ScopeProof
Test-StatusCounts
Write-Output 'G18 PASS: final scope proof (V4 and V5), HEAD equal to BASE'
Write-Output 'PHASE B PASS: G0 through G18'
```

Gate G8 appears inside the script as `Test-StaticGate`, and the checker JavaScript is carried verbatim from Revision 3. The script contains no placeholder, and no step in the implementation interval edits it.
