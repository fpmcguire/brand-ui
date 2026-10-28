import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LoadingSkeleton } from './loading-skeleton';

@Component({ imports: [LoadingSkeleton], template: `<bui-loading-skeleton />` })
class Host {}

/** Every element of the part, host included. */
const nodes = (host: Element): Element[] => [host, ...Array.from(host.querySelectorAll('*'))];

/** Nothing a part renders may be a link, control, tab stop, live region, role or busy state. */
const FORBIDDEN =
  'a, button, input, select, textarea, [role], [aria-live], [aria-busy], [href], [tabindex]';

describe('LoadingSkeleton', () => {
  async function setup() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    return (fixture.nativeElement as HTMLElement).querySelector('bui-loading-skeleton')!;
  }

  it('renders exactly four skeleton blocks with the retained role classes', async () => {
    const skeleton = await setup();
    const blocks = Array.from(skeleton.querySelectorAll('.skeleton'));
    expect(blocks).toHaveLength(4);
    expect(blocks.every((b) => b.localName === 'bui-skeleton-block')).toBe(true);
    const has = (block: Element, ...names: string[]) =>
      names.every((name) => block.classList.contains(name));
    expect(has(blocks[0], 'media')).toBe(true);
    expect(has(blocks[1], 'skeleton-title')).toBe(true);
    expect(has(blocks[2], 'skeleton-line')).toBe(true);
    expect(has(blocks[3], 'skeleton-line', 'skeleton-short')).toBe(true);
    expect(skeleton.querySelectorAll('.body')).toHaveLength(1);
  });

  it('is decorative on its host and on the block hosts only', async () => {
    const skeleton = await setup();
    const hidden = nodes(skeleton).filter((n) => n.hasAttribute('aria-hidden'));
    expect(hidden).toEqual([skeleton, ...Array.from(skeleton.querySelectorAll('.skeleton'))]);
    expect(hidden.every((n) => n.getAttribute('aria-hidden') === 'true')).toBe(true);
    expect(skeleton.querySelector('div[aria-hidden]')).toBeNull();
  });

  it('owns no busy state and no Loading text', async () => {
    const skeleton = await setup();
    expect(skeleton.textContent?.trim()).toBe('');
    for (const node of nodes(skeleton)) expect(node.matches(FORBIDDEN)).toBe(false);
  });
});
