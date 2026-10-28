import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { MediaArea } from './media-area';

@Component({
  imports: [MediaArea],
  template: `<bui-media-area [label]="label()" [tag]="tag()" />`,
})
class Host {
  readonly label = signal<string | undefined>('Image placeholder');
  readonly tag = signal<string | undefined>('Sample');
}

/** Every element of the part, host included. */
const nodes = (host: Element): Element[] => [host, ...Array.from(host.querySelectorAll('*'))];

/** Nothing a part renders may be a link, control, tab stop, live region, role or busy state. */
const FORBIDDEN =
  'a, button, input, select, textarea, [role], [aria-live], [aria-busy], [href], [tabindex]';

describe('MediaArea', () => {
  async function setup() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const root: HTMLElement = fixture.nativeElement;
    const update = async (change: (host: Host) => void) => {
      change(fixture.componentInstance);
      await fixture.whenStable();
    };
    return { area: () => root.querySelector('bui-media-area')!, update };
  }

  it('shows the label before the tag', async () => {
    const { area } = await setup();
    const children = Array.from(area().children);
    expect(children.map((c) => c.localName)).toEqual(['span', 'bui-tag']);
    expect(children[0].classList.contains('media-label')).toBe(true);
    expect(children[0].textContent).toBe('Image placeholder');
    expect(children[1].textContent).toBe('Sample');
  });

  it('omits the label and the tag when they are not supplied', async () => {
    const { area, update } = await setup();
    await update((h) => {
      h.label.set(undefined);
      h.tag.set(undefined);
    });
    expect(area().querySelector('.media-label')).toBeNull();
    expect(area().querySelector('bui-tag')).toBeNull();
    expect(area().children).toHaveLength(0);
  });

  it('adds no link, control, tab stop, role, live region, busy state or aria-hidden', async () => {
    const { area } = await setup();
    for (const node of nodes(area())) {
      expect(node.matches(FORBIDDEN)).toBe(false);
      expect(node.hasAttribute('aria-hidden')).toBe(false);
    }
  });
});
