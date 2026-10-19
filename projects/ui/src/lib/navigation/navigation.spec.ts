import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Navigation, NavigationItem } from './navigation';

const LONG = 'Frequently asked questions about lesson formats and scheduling';

const ITEMS: readonly NavigationItem[] = [
  { id: 'home', label: 'Home', href: '#home', current: true },
  { id: 'about', label: 'About', href: '#about' },
  { id: 'faq', label: LONG, href: '#faq', title: LONG },
  { id: 'soon', label: 'Coming soon', href: '#soon', disabled: true, title: 'Not available yet' },
];

@Component({
  imports: [Navigation],
  template: `<bui-navigation label="Main" wordmark="Sample brand" [items]="items()" />`,
})
class Host {
  readonly items = signal<readonly NavigationItem[]>(ITEMS);
}

async function setup() {
  const fixture = TestBed.createComponent(Host);
  await fixture.whenStable();
  const root: HTMLElement = fixture.nativeElement;
  const update = async (items: readonly NavigationItem[]) => {
    fixture.componentInstance.items.set(items);
    await fixture.whenStable();
  };
  const links = () => Array.from(root.querySelectorAll<HTMLAnchorElement>('a'));
  const entries = () => Array.from(root.querySelectorAll<HTMLElement>('li'));
  return { fixture, root, links, entries, update };
}

describe('Navigation', () => {
  it('renders a native nav landmark with the supplied accessible name', async () => {
    const { root } = await setup();
    const nav = root.querySelector('nav');
    expect(nav).not.toBeNull();
    expect(nav?.getAttribute('aria-label')).toBe('Main');
  });

  it('shows the wordmark as plain text, not a link', async () => {
    const { root, links } = await setup();
    const wordmark = root.querySelector('.wordmark');
    expect(wordmark?.textContent?.trim()).toBe('Sample brand');
    expect(wordmark?.closest('a')).toBeNull();
    expect(links().some((link) => link.textContent?.includes('Sample brand'))).toBe(false);
  });

  it('lists every item in order inside a list', async () => {
    const { root, entries } = await setup();
    expect(root.querySelector('ul')).not.toBeNull();
    expect(entries().map((entry) => entry.textContent?.trim())).toEqual([
      'Home',
      'About',
      LONG,
      'Coming soon',
    ]);
  });

  it('renders enabled items as native anchors with their href', async () => {
    const { links } = await setup();
    expect(links().map((link) => link.getAttribute('href'))).toEqual(['#home', '#about', '#faq']);
  });

  it('marks only the current item with aria-current="page"', async () => {
    const { links } = await setup();
    expect(links().map((link) => link.getAttribute('aria-current'))).toEqual(['page', null, null]);
  });

  it('renders a disabled item as non-link text with no role, tabindex or aria-disabled', async () => {
    const { entries } = await setup();
    const disabled = entries()[3];
    expect(disabled.querySelector('a')).toBeNull();
    const item = disabled.querySelector<HTMLElement>('.item')!;
    expect(item.hasAttribute('href')).toBe(false);
    expect(item.hasAttribute('role')).toBe(false);
    expect(item.hasAttribute('tabindex')).toBe(false);
    expect(item.hasAttribute('aria-disabled')).toBe(false);
    expect(item.hasAttribute('aria-current')).toBe(false);
    expect(item.textContent?.trim()).toBe('Coming soon');
  });

  it('puts only the enabled items in the tab order', async () => {
    const { root } = await setup();
    const focusable = root.querySelectorAll('a[href], button, input, [tabindex]');
    expect(focusable).toHaveLength(3);
  });

  it('does not mark a disabled item as current', async () => {
    const { entries, update } = await setup();
    await update([{ id: 'x', label: 'X', href: '#x', current: true, disabled: true }]);
    expect(entries()[0].querySelector('a')).toBeNull();
    expect(entries()[0].querySelector('[aria-current]')).toBeNull();
  });

  it('keeps the full label in the DOM for the accessible name and repeats it as a tooltip', async () => {
    const { links } = await setup();
    const long = links()[2];
    expect(long.textContent?.trim()).toBe(LONG);
    expect(long.getAttribute('title')).toBe(LONG);
  });

  it('sets a title only when one is supplied', async () => {
    const { links, entries } = await setup();
    expect(links()[0].hasAttribute('title')).toBe(false);
    expect(entries()[3].querySelector('.item')?.getAttribute('title')).toBe('Not available yet');
  });

  it('updates when the items change', async () => {
    const { links, update } = await setup();
    await update([{ id: 'only', label: 'Only', href: '#only' }]);
    expect(links().map((link) => link.textContent?.trim())).toEqual(['Only']);
  });
});
