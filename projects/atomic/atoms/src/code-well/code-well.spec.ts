import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { CodeWell } from './code-well';

const SAMPLE = 'const a = 1;\n  return a;  // exact';

@Component({ imports: [CodeWell], template: `<bui-code-well>{{ sample() }}</bui-code-well>` })
class Host {
  readonly sample = signal(SAMPLE);
}

/** Every element of the part, host included. */
const nodes = (host: Element): Element[] => [host, ...Array.from(host.querySelectorAll('*'))];

/** Nothing a part renders may be a link, control, tab stop, live region, role or busy state. */
const FORBIDDEN =
  'a, button, input, select, textarea, [role], [aria-live], [aria-busy], [href], [tabindex]';

describe('CodeWell', () => {
  async function setup() {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    return (fixture.nativeElement as HTMLElement).querySelector('bui-code-well')!;
  }

  it('projects the text exactly into pre code', async () => {
    const well = await setup();
    expect(well.querySelector('pre.code > code')?.textContent).toBe(SAMPLE);
    expect(well.textContent).toBe(SAMPLE);
  });

  it('adds no link, control, tab stop, role, live region, busy state or aria-hidden', async () => {
    for (const node of nodes(await setup())) {
      expect(node.matches(FORBIDDEN)).toBe(false);
      expect(node.hasAttribute('aria-hidden')).toBe(false);
    }
  });
});
