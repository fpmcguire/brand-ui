import { TestBed } from '@angular/core/testing';
import { ThemeService } from 'ui';
import { GalleryPage } from './gallery-page.component';
import { USAGE_PAIRS } from './specimens/usage-pairs';

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

  it('shows every component state with Design IDs, and can hide the IDs', async () => {
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
      'DS-020',
      'DS-021',
      'DS-022',
      'DS-023',
      'DS-024',
      'DS-025',
      'DS-030',
      'DS-031',
      'DS-032',
      'DS-033',
      'DS-034',
      'DS-035',
      'DS-040',
      'DS-041',
      'DS-042',
      'DS-043',
      'DS-044',
      'DS-045',
      'DS-050',
      'DS-051',
      'DS-060',
    ]) {
      expect(text()).toContain(id);
    }
    expect(root.querySelectorAll('[data-specimen="button"] bui-button')).toHaveLength(12);
    expect(root.querySelectorAll('bui-text-input')).toHaveLength(6);
    expect(root.querySelectorAll('bui-card')).toHaveLength(6);
    expect(root.querySelectorAll('[data-specimen="nav"] bui-navigation')).toHaveLength(6);

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
    // Button (2 variants), card, text input and navigation.
    expect(forced.sort()).toEqual([
      'active',
      'active',
      'active',
      'focus',
      'focus',
      'focus',
      'focus',
      'focus',
      'hover',
      'hover',
      'hover',
      'hover',
      'hover',
    ]);
    expect(root.querySelector('[class*="is-"]')).toBeNull();
  });

  describe('text input specimens', () => {
    it('shows default, hover, focus, filled, error and disabled with unique ids', async () => {
      const { root } = await setup();
      const fields = Array.from(root.querySelectorAll<HTMLElement>('[data-specimen="input"]'));
      expect(fields.map((field) => field.dataset['testid'])).toEqual([
        'gallery-input-field-default',
        'gallery-input-field-hover',
        'gallery-input-field-focus',
        'gallery-input-field-filled',
        'gallery-input-field-error',
        'gallery-input-field-disabled',
      ]);
      const inputs = fields.map((field) => field.querySelector('input')!);
      expect(new Set(inputs.map((input) => input.id)).size).toBe(6);
      expect(inputs.map((input) => input.labels?.length)).toEqual([1, 1, 1, 1, 1, 1]);
    });

    it('presents the error and disabled states through native semantics', async () => {
      const { root } = await setup();
      const input = (state: string) =>
        root.querySelector<HTMLInputElement>(`[data-testid="gallery-input-field-${state}"] input`)!;
      expect(input('error').getAttribute('aria-invalid')).toBe('true');
      expect(input('error').getAttribute('aria-describedby')).toMatch(/-error$/);
      expect(input('disabled').disabled).toBe(true);
      expect(input('filled').value).not.toBe('');
      expect(input('default').value).toBe('');
      expect(root.querySelectorAll('[aria-invalid="true"]')).toHaveLength(1);
    });

    it('echoes what is typed into the working sample', async () => {
      const { fixture, root } = await setup();
      const input = root.querySelector<HTMLInputElement>(
        '[data-testid="gallery-input-field-default"] input',
      )!;
      const echo = () => root.querySelector('[data-testid="gallery-input-echo"]')?.textContent;
      expect(echo()).toContain('(nothing yet)');
      input.value = 'hello';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      await fixture.whenStable();
      expect(echo()).toContain('hello');
    });
  });

  describe('navigation specimens', () => {
    it('shows the working sample, four single-item states and the narrow bar', async () => {
      const { root } = await setup();
      const bars = Array.from(root.querySelectorAll<HTMLElement>('[data-specimen="nav"]'));
      expect(bars.map((bar) => bar.dataset['testid'])).toEqual([
        'gallery-nav-bar-default',
        'gallery-nav-bar-hover',
        'gallery-nav-bar-current',
        'gallery-nav-bar-focus',
        'gallery-nav-bar-disabled',
        'gallery-nav-bar-narrow',
      ]);
      expect(bars.map((bar) => bar.querySelectorAll('li').length)).toEqual([4, 1, 1, 1, 1, 4]);
      expect(bars[5].hasAttribute('data-narrow')).toBe(true);
    });

    it('marks the current page and renders the disabled item as non-link text', async () => {
      const { root } = await setup();
      const bar = (state: string) =>
        root.querySelector<HTMLElement>(`[data-testid="gallery-nav-bar-${state}"]`)!;
      expect(bar('current').querySelector('a')?.getAttribute('aria-current')).toBe('page');
      expect(bar('disabled').querySelector('a')).toBeNull();
      expect(bar('disabled').querySelectorAll('[aria-disabled="true"]')).toHaveLength(1);
      expect(bar('default').querySelectorAll('a[aria-current="page"]')).toHaveLength(1);
    });

    it('gives every bar its own accessible name and keeps links on the page', async () => {
      const { root } = await setup();
      const names = Array.from(root.querySelectorAll('nav')).map((nav) =>
        nav.getAttribute('aria-label'),
      );
      expect(new Set(names).size).toBe(names.length);
      const link = root.querySelector<HTMLAnchorElement>('[data-specimen="nav"] a')!;
      const event = new MouseEvent('click', { bubbles: true, cancelable: true });
      link.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(true);
    });
  });

  describe('long-label specimens', () => {
    it('shows the button and navigation cases at 180px, 280px, 360px and full width', async () => {
      const { root } = await setup();
      for (const component of ['button', 'nav']) {
        const widths = Array.from(
          root.querySelectorAll<HTMLElement>(`[data-testid^="gallery-long-${component}-"]`),
        ).map((container) => container.dataset['width']);
        expect(widths).toEqual(['180', '280', '360', 'full']);
      }
    });

    it('keeps the full text of the long navigation item as its tooltip', async () => {
      const { root } = await setup();
      const links = Array.from(
        root.querySelectorAll<HTMLAnchorElement>('[data-testid="gallery-long-nav-280"] a'),
      );
      const long = links.find((link) => link.hasAttribute('title'))!;
      expect(long.getAttribute('title')).toBe(long.textContent?.trim());
    });
  });

  describe('button form fixture', () => {
    it('counts a submit activation and a submission, and ignores the loading submit button', async () => {
      const { fixture, root } = await setup();
      const count = (name: string) =>
        root.querySelector(`[data-testid="gallery-button-form-${name}"]`)?.textContent;
      const [submit, loading] = Array.from(
        root.querySelectorAll<HTMLButtonElement>('[data-testid="gallery-button-form"] button'),
      );
      expect([count('activated'), count('submitted')]).toEqual(['0', '0']);

      loading.click();
      await fixture.whenStable();
      expect([count('activated'), count('submitted')]).toEqual(['0', '0']);

      submit.click();
      await fixture.whenStable();
      expect([count('activated'), count('submitted')]).toEqual(['1', '1']);
    });
  });

  describe('contrast evidence', () => {
    it('lists every usage pair for every scope, and reads ratios from the computed style', async () => {
      const extra = document.createElement('style');
      extra.textContent = `[data-bui-brand='artanon'] { --bui-color-text: #000000; --bui-color-surface: #ffffff; }`;
      document.head.appendChild(extra);
      try {
        const { press, panels } = await setup();
        await press('gallery-switch-all');
        for (const panel of panels()) {
          expect(panel.querySelectorAll('[data-pair]')).toHaveLength(USAGE_PAIRS.length);
        }
        const artanon = panels()[0];
        const row = artanon.querySelector('[data-pair="text-on-surface"]')!;
        expect(row.querySelector('[data-testid="gallery-contrast-ratio"]')?.textContent).toBe(
          '21.00:1',
        );
        expect(row.querySelector('[data-testid="gallery-contrast-result"]')?.textContent).toBe(
          'Pass',
        );
        // Tokens that do not resolve to a colour are reported, not silently passed.
        const unresolved = panels()[1].querySelector('[data-pair="text-on-surface"]')!;
        expect(
          unresolved.querySelector('[data-testid="gallery-contrast-result"]')?.textContent,
        ).toBe('Fail');
      } finally {
        extra.remove();
      }
    });
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
