import { TestBed } from '@angular/core/testing';
import { ThemeService } from 'ui';
import { GalleryPage } from './gallery-page.component';

const TEST_STYLES = `
  [data-bui-brand='artanon'] { --bui-color-bg: #010203; }
  [data-bui-brand='mentor'] { --bui-color-bg: #040506; }
  [data-bui-brand='codecraft'][data-bui-mode='light'] { --bui-color-bg: #070809; }
  [data-bui-brand='codecraft'][data-bui-mode='dark'] { --bui-color-bg: #0a0b0c; }
`;

async function setup() {
  const fixture = TestBed.createComponent(GalleryPage);
  await fixture.whenStable();
  const root: HTMLElement = fixture.nativeElement;
  const press = async (testId: string) => {
    root.querySelector<HTMLButtonElement>(`[data-testid="${testId}"]`)!.click();
    await fixture.whenStable();
  };
  const panels = () => Array.from(root.querySelectorAll<HTMLElement>('section.panel'));
  return { fixture, root, press, panels };
}

describe('GalleryPage', () => {
  let style: HTMLStyleElement;

  beforeEach(() => {
    style = document.createElement('style');
    style.textContent = TEST_STYLES;
    document.head.appendChild(style);
  });

  afterEach(() => style.remove());

  it('starts on ArtAnon Shop with one panel and the switcher reflecting it', async () => {
    const { root, panels } = await setup();
    expect(panels()).toHaveLength(1);
    expect(panels()[0].dataset['buiBrand']).toBe('artanon');
    const pressed = Array.from(root.querySelectorAll('.seg')).map((button) =>
      button.getAttribute('aria-pressed'),
    );
    expect(pressed).toEqual(['true', 'false', 'false', 'false', 'false']);
  });

  it('switches scope without a reload, by changing the theme selection', async () => {
    const { press, panels } = await setup();
    await press('gallery-switch-mentor');
    expect(panels()).toHaveLength(1);
    expect(panels()[0].dataset['buiBrand']).toBe('mentor');
    expect(TestBed.inject(ThemeService).selection()).toEqual({ brand: 'mentor' });

    await press('gallery-switch-codecraft-dark');
    expect(panels()[0].dataset['buiBrand']).toBe('codecraft');
    expect(panels()[0].dataset['buiMode']).toBe('dark');
  });

  it('shows three brands across four scopes for All brands', async () => {
    const { press, panels, root } = await setup();
    await press('gallery-switch-all');
    expect(
      panels().map((panel) => [panel.dataset['buiBrand'], panel.dataset['buiMode'] ?? null]),
    ).toEqual([
      ['artanon', null],
      ['mentor', null],
      ['codecraft', 'light'],
      ['codecraft', 'dark'],
    ]);
    expect(new Set(panels().map((panel) => panel.dataset['buiBrand'])).size).toBe(3);
    expect(
      root.querySelector('[data-testid="gallery-switch-all"]')?.getAttribute('aria-pressed'),
    ).toBe('true');
  });

  it('renders swatch values from the computed style of the panel, not from stored data', async () => {
    const { press, panels } = await setup();
    await press('gallery-switch-all');
    const values = panels().map(
      (panel) =>
        panel.querySelector('[data-token="--bui-color-bg"] [data-testid="gallery-token-value"]')
          ?.textContent,
    );
    expect(values).toEqual(['#010203', '#040506', '#070809', '#0a0b0c']);
  });

  it('re-reads computed values after a switch', async () => {
    const { press, panels } = await setup();
    const read = () =>
      panels()[0].querySelector('[data-token="--bui-color-bg"] [data-testid="gallery-token-value"]')
        ?.textContent;
    expect(read()).toBe('#010203');
    await press('gallery-switch-mentor');
    expect(read()).toBe('#040506');
  });

  it('shows every Step 1 button and card state with Design IDs, and can hide the IDs', async () => {
    const { fixture, root } = await setup();
    const text = () => root.textContent ?? '';
    for (const id of [
      'DS-001',
      'DS-002',
      'DS-003',
      'DS-004',
      'DS-005',
      'DS-010',
      'DS-011',
      'DS-012',
      'DS-013',
      'DS-014',
      'DS-015',
      'DS-030',
      'DS-031',
      'DS-032',
      'DS-033',
      'DS-034',
      'DS-035',
      'DS-060',
    ]) {
      expect(text()).toContain(id);
    }
    expect(root.querySelectorAll('bui-button')).toHaveLength(12);
    expect(root.querySelectorAll('bui-card')).toHaveLength(6);

    const checkbox = root.querySelector<HTMLInputElement>('input[type="checkbox"]')!;
    checkbox.checked = false;
    checkbox.dispatchEvent(new Event('change'));
    await fixture.whenStable();
    expect(text()).not.toContain('DS-010');
  });

  it('forces hover, active and focus through gallery wrappers, not component classes or inputs', async () => {
    const { root } = await setup();
    const forced = Array.from(root.querySelectorAll('[data-specimen-state]')).map((el) =>
      el.getAttribute('data-specimen-state'),
    );
    expect(forced.sort()).toEqual([
      'active',
      'active',
      'active',
      'focus',
      'focus',
      'focus',
      'hover',
      'hover',
      'hover',
    ]);
    expect(root.querySelector('[class*="is-"]')).toBeNull();
  });

  it('gives the interactive card specimens exactly one link each and keeps loading cards inert', async () => {
    const { root } = await setup();
    const cards = Array.from(root.querySelectorAll('bui-card'));
    expect(cards.map((card) => card.querySelectorAll('a').length)).toEqual([0, 1, 1, 1, 1, 0]);
    expect(cards[5].querySelector('article')?.getAttribute('aria-busy')).toBe('true');
  });

  it('keeps sample card links on the page', async () => {
    const { root } = await setup();
    const link = root.querySelector<HTMLAnchorElement>('bui-card a')!;
    const event = new MouseEvent('click', { bubbles: true, cancelable: true });
    link.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
  });
});
