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

async function setup(
  scopeId: GalleryScopeId = 'artanon',
  showDesignIds = true,
): Promise<HTMLElement> {
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
    expect(
      figureFor(root, 'gallery-structure-card-loading').querySelector('h1,h2,h3,h4,h5,h6'),
    ).toBeNull();
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
    expect(
      figureFor(root, 'gallery-structure-card-interactive-default').querySelectorAll('a'),
    ).toHaveLength(1);
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
