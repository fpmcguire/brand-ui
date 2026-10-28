import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Tag } from './tag';

@Component({ imports: [Tag], template: `<bui-tag>Sample</bui-tag>` })
class Host {}

/** Every element of the part, host included. */
const nodes = (host: Element): Element[] => [host, ...Array.from(host.querySelectorAll('*'))];

/** Nothing a part renders may be a link, control, tab stop, live region, role or busy state. */
const FORBIDDEN =
  'a, button, input, select, textarea, [role], [aria-live], [aria-busy], [href], [tabindex]';

describe('Tag', () => {
  async function setup() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    return (fixture.nativeElement as HTMLElement).querySelector('bui-tag')!;
  }

  it('projects its content and has no inputs', async () => {
    const tag = await setup();
    expect(tag.textContent).toBe('Sample');
    expect(tag.children).toHaveLength(0);
  });

  it('adds no link, control, tab stop, role, live region, busy state or aria-hidden', async () => {
    for (const node of nodes(await setup())) {
      expect(node.matches(FORBIDDEN)).toBe(false);
      expect(node.hasAttribute('aria-hidden')).toBe(false);
    }
  });
});
