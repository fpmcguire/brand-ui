import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Card } from './card';

@Component({
  imports: [Card],
  template: `
    <bui-card
      [title]="'Sample title'"
      [description]="'Sample description'"
      [meta]="meta()"
      [tag]="'Sample'"
      [mediaLabel]="'Image placeholder'"
      [href]="href()"
      [codeSample]="codeSample()"
      [loading]="loading()"
    />
  `,
})
class Host {
  readonly meta = signal<string | undefined>('[SKU] · [SIZE] · [PRICE]');
  readonly href = signal<string | undefined>(undefined);
  readonly codeSample = signal<string | undefined>(undefined);
  readonly loading = signal(false);
}

async function setup() {
  const fixture = TestBed.createComponent(Host);
  await fixture.whenStable();
  const root: HTMLElement = fixture.nativeElement;
  const update = async (change: (host: Host) => void) => {
    change(fixture.componentInstance);
    await fixture.whenStable();
  };
  const focusables = () =>
    Array.from(root.querySelectorAll('a[href], button, input, select, textarea, [tabindex]'));
  return { root, update, focusables, article: () => root.querySelector('article')! };
}

describe('Card', () => {
  describe('static', () => {
    it('renders content with no link, no tab stop and no interactive marker', async () => {
      const { root, focusables, article } = await setup();
      expect(root.querySelector('h3')?.textContent?.trim()).toBe('Sample title');
      expect(root.textContent).toContain('Sample description');
      expect(root.textContent).toContain('[SKU] · [SIZE] · [PRICE]');
      expect(root.textContent).toContain('Image placeholder');
      expect(root.textContent).toContain('Sample');
      expect(focusables()).toHaveLength(0);
      expect(article().hasAttribute('data-interactive')).toBe(false);
      expect(article().hasAttribute('aria-busy')).toBe(false);
    });

    it('does not leave a title attribute on the host', async () => {
      const { root } = await setup();
      expect(root.querySelector('bui-card')?.hasAttribute('title')).toBe(false);
    });

    it('omits optional parts that are not supplied', async () => {
      const { root, update } = await setup();
      await update((h) => h.meta.set(undefined));
      expect(root.querySelector('.meta')).toBeNull();
      expect(root.querySelector('.code')).toBeNull();
    });

    it('shows a generic code sample when one is supplied', async () => {
      const { root, update } = await setup();
      await update((h) => h.codeSample.set('const total = 1;'));
      expect(root.querySelector('pre code')?.textContent).toBe('const total = 1;');
    });
  });

  describe('interactive', () => {
    it('has exactly one native link, on the title, and one tab stop', async () => {
      const { root, update, focusables, article } = await setup();
      await update((h) => h.href.set('/samples/one'));
      const links = root.querySelectorAll('a');
      expect(links).toHaveLength(1);
      expect(links[0].getAttribute('href')).toBe('/samples/one');
      expect(links[0].textContent?.trim()).toBe('Sample title');
      expect(links[0].closest('h3')).not.toBeNull();
      expect(focusables()).toHaveLength(1);
      expect(article().hasAttribute('data-interactive')).toBe(true);
    });

    it('goes back to static when the href is removed', async () => {
      const { root, update } = await setup();
      await update((h) => h.href.set('/samples/one'));
      await update((h) => h.href.set(undefined));
      expect(root.querySelector('a')).toBeNull();
    });
  });

  describe('loading', () => {
    it('is busy, non-interactive and exposes no link even with an href', async () => {
      const { root, update, focusables, article } = await setup();
      await update((h) => {
        h.href.set('/samples/one');
        h.loading.set(true);
      });
      expect(article().getAttribute('aria-busy')).toBe('true');
      expect(article().hasAttribute('data-interactive')).toBe(false);
      expect(root.querySelector('a')).toBeNull();
      expect(focusables()).toHaveLength(0);
      expect(root.querySelector('h3')).toBeNull();
      expect(root.querySelectorAll('.skeleton').length).toBeGreaterThan(0);
    });
  });
});
