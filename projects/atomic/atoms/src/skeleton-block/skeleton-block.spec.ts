import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SkeletonBlock } from './skeleton-block';

@Component({ imports: [SkeletonBlock], template: `<bui-skeleton-block />` })
class Host {}

/** Every element of the part, host included. */
const nodes = (host: Element): Element[] => [host, ...Array.from(host.querySelectorAll('*'))];

/** Nothing a part renders may be a link, control, tab stop, live region, role or busy state. */
const FORBIDDEN =
  'a, button, input, select, textarea, [role], [aria-live], [aria-busy], [href], [tabindex]';

describe('SkeletonBlock', () => {
  async function setup() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    return (fixture.nativeElement as HTMLElement).querySelector('bui-skeleton-block')!;
  }

  it('is empty and decorative on the host only', async () => {
    const block = await setup();
    expect(block.getAttribute('aria-hidden')).toBe('true');
    expect(block.children).toHaveLength(0);
    expect(block.textContent).toBe('');
  });

  it('adds no link, control, tab stop, role, live region or busy state', async () => {
    for (const node of nodes(await setup())) expect(node.matches(FORBIDDEN)).toBe(false);
  });
});
