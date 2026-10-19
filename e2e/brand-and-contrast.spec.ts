import { expect, test } from '@playwright/test';
import {
  REQUIRED_RATIO,
  USAGE_PAIRS,
} from '../projects/gallery/src/app/gallery/specimens/usage-pairs';
import { contrastRatio, parseRgb } from './helpers/contrast';
import {
  SCOPES,
  aboutDialog,
  aboutTrigger,
  computed,
  openGallery,
  panel,
  resolveColor,
  skeleton,
  tokenValue,
} from './helpers/gallery';

const normalizeQuotes = (value: string): string => value.replaceAll("'", '"');

test.describe('brand switching', () => {
  test('restyles the same components from tokens without a reload', async ({ page }) => {
    await openGallery(page, 'artanon');
    await page.evaluate(() => {
      (window as unknown as { __notReloaded: boolean }).__notReloaded = true;
    });

    const primaries = new Set<string>();
    for (const scope of SCOPES) {
      await page.getByTestId(`gallery-switch-${scope.id}`).click();
      await expect(page.locator('section.panel')).toHaveCount(1);
      const scoped = panel(page, scope);
      await expect(scoped).toBeVisible();
      await expect(scoped).toHaveAttribute('data-bui-brand', scope.brand);

      expect(
        await page.evaluate(() => (window as unknown as { __notReloaded?: boolean }).__notReloaded),
        `${scope.label}: page was not reloaded`,
      ).toBe(true);

      const button = scoped.getByTestId('gallery-button-primary-default').getByRole('button');
      const style = await computed(button, ['background-color', 'color', 'font-family']);
      const primary = await resolveColor(scoped, '--bui-color-primary');
      const onPrimary = await resolveColor(scoped, '--bui-color-on-primary');
      expect(parseRgb(style['background-color']), `${scope.label} button fill`).toEqual(primary);
      expect(parseRgb(style['color']), `${scope.label} button label`).toEqual(onPrimary);
      expect(normalizeQuotes(style['font-family']), `${scope.label} button font`).toBe(
        normalizeQuotes(await tokenValue(scoped, '--bui-font-ui')),
      );
      primaries.add(style['background-color']);

      const ground = await computed(scoped, ['background-color']);
      expect(parseRgb(ground['background-color'])).toEqual(
        await resolveColor(scoped, '--bui-color-bg'),
      );
    }
    expect(primaries.size, 'each scope paints its own primary').toBe(4);
  });

  test('shows three brands across four simultaneous scopes', async ({ page }) => {
    await openGallery(page, 'all');
    const panels = page.locator('section.panel');
    await expect(panels).toHaveCount(4);

    const attributes = await panels.evaluateAll((elements) =>
      elements.map((element) => [
        element.getAttribute('data-bui-brand'),
        element.getAttribute('data-bui-mode'),
      ]),
    );
    expect(attributes).toEqual([
      ['artanon', null],
      ['mentor', null],
      ['codecraft', 'light'],
      ['codecraft', 'dark'],
    ]);
    expect(new Set(attributes.map(([brand]) => brand)).size).toBe(3);

    // Every scope resolves the same token names to a non-empty value.
    const names = async (scopeIndex: number) =>
      panels
        .nth(scopeIndex)
        .locator('[data-token]')
        .evaluateAll((items) =>
          items.map((item) => [
            item.getAttribute('data-token'),
            item.querySelector('[data-testid="gallery-token-value"]')?.textContent?.trim() ?? '',
          ]),
        );
    const reference = await names(0);
    expect(reference.length).toBeGreaterThan(40);
    for (let index = 0; index < 4; index++) {
      const tokens = await names(index);
      expect(tokens.map(([name]) => name)).toEqual(reference.map(([name]) => name));
      expect(tokens.filter(([, value]) => value === '')).toEqual([]);
    }
  });

  test('keeps CodeCraft Light and Dark as modes of one brand', async ({ page }) => {
    await openGallery(page, 'all');
    const light = panel(page, 'codecraft-light');
    const dark = panel(page, 'codecraft-dark');
    const shared = [
      '--bui-font-display',
      '--bui-font-body',
      '--bui-font-ui',
      '--bui-space-3',
      '--bui-space-6',
      '--bui-radius-control',
      '--bui-radius-tr-card',
      '--bui-radius-tr-panel',
      '--bui-corner-shape-card',
      '--bui-focus-width',
      '--bui-indicator-width',
    ];
    for (const token of shared) {
      expect(await tokenValue(light, token), token).toBe(await tokenValue(dark, token));
    }
    for (const token of ['--bui-color-bg', '--bui-color-text', '--bui-color-primary']) {
      expect(await tokenValue(light, token), token).not.toBe(await tokenValue(dark, token));
    }
  });

  test('changes tokens only: component structure is identical in every scope', async ({ page }) => {
    await openGallery(page, 'all');
    const targets = [
      'gallery-button-primary-default',
      'gallery-button-secondary-loading',
      'gallery-input-field-default',
      'gallery-input-field-error',
      'gallery-nav-bar-default',
      'gallery-nav-bar-narrow',
    ];
    for (const target of targets) {
      const shapes = await Promise.all(
        SCOPES.map((scope) => skeleton(panel(page, scope).getByTestId(target))),
      );
      expect(new Set(shapes).size, `${target} has one structure in all four scopes`).toBe(1);
    }
  });
});

test.describe('contrast', () => {
  test('documents an explicit usage-pair list covering text, non-text and focus pairs', () => {
    const ids = USAGE_PAIRS.map((pair) => pair.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(USAGE_PAIRS.filter((pair) => pair.kind === 'text').length).toBeGreaterThanOrEqual(10);
    expect(USAGE_PAIRS.filter((pair) => pair.kind === 'non-text').length).toBeGreaterThanOrEqual(8);
    expect(ids).toEqual(expect.arrayContaining(['focus-on-bg', 'focus-on-surface']));
    // Disabled text is exempt from contrast and is never listed.
    expect(USAGE_PAIRS.some((pair) => pair.foreground.includes('disabled'))).toBe(false);
  });

  for (const scope of SCOPES) {
    test(`every usage pair meets its threshold in ${scope.label}`, async ({ page }) => {
      await openGallery(page, scope.id);
      const scoped = panel(page, scope);
      const failures: string[] = [];

      for (const pair of USAGE_PAIRS) {
        const foreground = await resolveColor(scoped, pair.foreground);
        const background = await resolveColor(scoped, pair.background);
        const ratio = contrastRatio(foreground, background);
        const required = REQUIRED_RATIO[pair.kind];
        if (ratio < required) {
          failures.push(`${pair.label}: ${ratio.toFixed(3)}:1 < ${required}:1`);
        }

        // The gallery shows the same number the browser-rendered colours give.
        const row = scoped.locator(`[data-pair="${pair.id}"]`);
        await expect(row.getByTestId('gallery-contrast-ratio')).toHaveText(`${ratio.toFixed(2)}:1`);
        await expect(row.getByTestId('gallery-contrast-result')).toHaveText(
          ratio >= required ? 'Pass' : 'Fail',
        );
      }

      expect(failures, `${scope.label} pairs below threshold`).toEqual([]);
    });
  }

  test('protects the approved Mentor 4.62:1 boundary pair', async ({ page }) => {
    await openGallery(page, 'mentor');
    const scoped = panel(page, 'mentor');
    const pair = USAGE_PAIRS.find((candidate) => candidate.id === 'secondary-on-tint');
    expect(pair, 'the Mentor boundary pair is in the list').toBeDefined();

    const ratio = contrastRatio(
      await resolveColor(scoped, pair!.foreground),
      await resolveColor(scoped, pair!.background),
    );
    expect(ratio).toBeGreaterThanOrEqual(REQUIRED_RATIO.text);
    expect(ratio.toFixed(2)).toBe('4.62');
    await expect(
      scoped.locator('[data-pair="secondary-on-tint"]').getByTestId('gallery-contrast-ratio'),
    ).toHaveText('4.62:1');
  });

  for (const scope of SCOPES) {
    test(`components paint the listed token pairs in ${scope.label}`, async ({ page }) => {
      await openGallery(page, scope.id);
      const scoped = panel(page, scope);
      const color = (token: string) => resolveColor(scoped, token);

      const primary = scoped.getByTestId('gallery-button-primary-default').getByRole('button');
      const primaryStyle = await computed(primary, ['color', 'background-color']);
      expect(parseRgb(primaryStyle['color'])).toEqual(await color('--bui-color-on-primary'));
      expect(parseRgb(primaryStyle['background-color'])).toEqual(
        await color('--bui-color-primary'),
      );

      const secondary = scoped.getByTestId('gallery-button-secondary-default').getByRole('button');
      const secondaryStyle = await computed(secondary, ['color', 'border-top-color']);
      expect(parseRgb(secondaryStyle['color'])).toEqual(await color('--bui-color-primary'));
      expect(parseRgb(secondaryStyle['border-top-color'])).toEqual(
        await color('--bui-color-primary'),
      );

      const field = scoped.getByTestId('gallery-input-field-filled').getByRole('textbox');
      const fieldStyle = await computed(field, ['color', 'background-color', 'border-top-color']);
      expect(parseRgb(fieldStyle['color'])).toEqual(await color('--bui-color-text'));
      expect(parseRgb(fieldStyle['background-color'])).toEqual(await color('--bui-color-surface'));
      expect(parseRgb(fieldStyle['border-top-color'])).toEqual(
        await color('--bui-color-border-strong'),
      );

      const invalid = scoped.getByTestId('gallery-input-field-error').getByRole('textbox');
      expect(parseRgb((await computed(invalid, ['border-top-color']))['border-top-color'])).toEqual(
        await color('--bui-color-danger'),
      );
      const message = scoped.getByTestId('gallery-input-field-error').getByText(/^Enter an? /);
      expect(parseRgb((await computed(message, ['color']))['color'])).toEqual(
        await color('--bui-color-danger'),
      );

      const hovered = scoped.getByTestId('gallery-nav-bar-hover').getByRole('link');
      expect(parseRgb((await computed(hovered, ['background-color']))['background-color'])).toEqual(
        await color('--bui-color-primary-tint'),
      );

      const current = scoped.getByTestId('gallery-nav-bar-current').getByRole('link');
      const indicator = (await computed(current, ['background-image']))['background-image'];
      const primaryRgb = await color('--bui-color-primary');
      expect(indicator).toContain(`rgb(${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b})`);

      const tag = scoped.getByTestId('gallery-card-static').getByText('Sample', { exact: true });
      const tagStyle = await computed(tag, ['color', 'background-color']);
      expect(parseRgb(tagStyle['color'])).toEqual(await color('--bui-color-on-accent'));
      expect(parseRgb(tagStyle['background-color'])).toEqual(await color('--bui-color-accent'));
    });
  }
});

test.describe('About panel tokens', () => {
  /** Every colour pair the dialog and its trigger paint is one of these existing usage pairs. */
  const ABOUT_PAIR_IDS = [
    'on-primary',
    'on-primary-hover',
    'on-primary-active',
    'text-on-bg',
    'secondary-on-bg',
    'secondary-border-on-bg',
    'secondary-on-tint',
    'input-border-on-bg',
    'focus-on-bg',
  ];

  for (const scope of SCOPES) {
    test(`paints only listed token pairs, and every one passes, in ${scope.label}`, async ({
      page,
    }) => {
      await openGallery(page, scope.id);
      const scoped = panel(page, scope);

      // The trigger sits on the gallery's neutral bar, not on a themed surface. It is a primary
      // button, so it paints its own fill: on-primary on primary, whatever the bar is.
      const trigger = aboutTrigger(page);
      const triggerPaint = await computed(trigger, ['color', 'background-color']);
      expect(parseRgb(triggerPaint['color'])).toEqual(
        await resolveColor(scoped, '--bui-color-on-primary'),
      );
      expect(parseRgb(triggerPaint['background-color'])).toEqual(
        await resolveColor(scoped, '--bui-color-primary'),
      );

      // Reach the trigger by keyboard, so the focus ring is genuine. The ring is the bar's own
      // neutral ring, and it must clear 3:1 against the bar it is drawn on.
      await trigger.focus();
      await page.keyboard.press('Shift+Tab');
      await page.keyboard.press('Tab');
      await expect(trigger).toBeFocused();
      const triggerRing = await computed(trigger, [
        'outline-style',
        'outline-width',
        'outline-color',
      ]);
      const bar = parseRgb(
        (await computed(page.locator('header.top'), ['background-color']))['background-color'],
      );
      expect(triggerRing['outline-style']).toBe('solid');
      expect(triggerRing['outline-width']).toBe('3px');
      expect(
        contrastRatio(parseRgb(triggerRing['outline-color']), bar),
        `${scope.label}: trigger focus ring on the bar`,
      ).toBeGreaterThanOrEqual(REQUIRED_RATIO['non-text']);
      await page.keyboard.press('Enter');

      const dialog = aboutDialog(page);
      await expect(dialog).toBeVisible();
      const color = (token: string) => resolveColor(dialog, token);

      const frame = await computed(dialog, ['color', 'background-color', 'border-top-color']);
      expect(parseRgb(frame['color'])).toEqual(await color('--bui-color-text'));
      expect(parseRgb(frame['background-color'])).toEqual(await color('--bui-color-bg'));
      expect(parseRgb(frame['border-top-color'])).toEqual(await color('--bui-color-border-strong'));

      for (const heading of await dialog.getByRole('heading').all()) {
        expect(parseRgb((await computed(heading, ['color']))['color'])).toEqual(
          await color('--bui-color-text'),
        );
      }

      const close = dialog.getByRole('button', { name: 'Close' });
      await expect(close).toBeFocused();
      const closeStyle = await computed(close, [
        'color',
        'border-top-color',
        'background-color',
        'outline-style',
        'outline-width',
        'outline-color',
      ]);
      expect(parseRgb(closeStyle['color'])).toEqual(await color('--bui-color-primary'));
      expect(parseRgb(closeStyle['border-top-color'])).toEqual(await color('--bui-color-primary'));
      expect(closeStyle['background-color']).toBe('rgba(0, 0, 0, 0)');
      expect(closeStyle['outline-style']).toBe('solid');
      expect(closeStyle['outline-width']).toBe(await tokenValue(dialog, '--bui-focus-width'));
      expect(parseRgb(closeStyle['outline-color'])).toEqual(await color('--bui-color-focus'));

      // Each of the two links is primary on the background, underlined, and rings in the focus token.
      const links = dialog.getByRole('link');
      await expect(links).toHaveCount(2);
      for (const link of await links.all()) {
        await link.focus();
        const linkStyle = await computed(link, [
          'color',
          'text-decoration-line',
          'outline-style',
          'outline-width',
          'outline-color',
        ]);
        expect(parseRgb(linkStyle['color'])).toEqual(await color('--bui-color-primary'));
        expect(linkStyle['text-decoration-line']).toBe('underline');
        expect(linkStyle['outline-style']).toBe('solid');
        expect(linkStyle['outline-width']).toBe(await tokenValue(dialog, '--bui-focus-width'));
        expect(parseRgb(linkStyle['outline-color'])).toEqual(await color('--bui-color-focus'));
      }

      // Each pair the dialog paints meets its AC-7 threshold in this scope.
      const failures: string[] = [];
      for (const id of ABOUT_PAIR_IDS) {
        const pair = USAGE_PAIRS.find((candidate) => candidate.id === id);
        expect(pair, `${id} is a listed usage pair`).toBeDefined();
        const ratio = contrastRatio(await color(pair!.foreground), await color(pair!.background));
        if (ratio < REQUIRED_RATIO[pair!.kind]) {
          failures.push(`${pair!.label}: ${ratio.toFixed(3)}:1 < ${REQUIRED_RATIO[pair!.kind]}:1`);
        }
      }
      expect(failures, `${scope.label} About pairs below threshold`).toEqual([]);
    });
  }

  for (const id of ['mentor', 'codecraft-dark'] as const) {
    test(`follows the retained selection (${id}) while All brands is displayed`, async ({
      page,
    }) => {
      await openGallery(page, id);
      await page.getByTestId('gallery-switch-all').click();
      await expect(page.locator('section.panel')).toHaveCount(4);
      await aboutTrigger(page).click();

      const dialog = aboutDialog(page);
      const scope = SCOPES.find((candidate) => candidate.id === id)!;
      await expect(dialog).toHaveAttribute('data-bui-brand', scope.brand);
      if (scope.mode) {
        await expect(dialog).toHaveAttribute('data-bui-mode', scope.mode);
      } else {
        await expect(dialog).not.toHaveAttribute('data-bui-mode', /.*/);
      }
      expect(parseRgb((await computed(dialog, ['background-color']))['background-color'])).toEqual(
        await resolveColor(panel(page, scope), '--bui-color-bg'),
      );
    });
  }

  test('changes tokens only: the dialog has one structure in every scope', async ({ page }) => {
    await openGallery(page, 'artanon');
    const shapes: string[] = [];
    for (const scope of SCOPES) {
      await page.getByTestId(`gallery-switch-${scope.id}`).click();
      await expect(page.locator('section.panel')).toHaveCount(1);
      await aboutTrigger(page).click();
      const dialog = aboutDialog(page);
      await expect(dialog).toBeVisible();
      await expect(dialog).toHaveAttribute('data-bui-brand', scope.brand);

      // The dialog host carries the scope attributes; everything inside it must be identical.
      const parts = [dialog.locator('header')];
      for (const section of await dialog.locator('section').all()) parts.push(section);
      shapes.push((await Promise.all(parts.map((part) => skeleton(part)))).join('|'));

      await page.keyboard.press('Escape');
      await expect(dialog).toHaveCount(0);
    }
    expect(new Set(shapes).size, 'one dialog structure in all four scopes').toBe(1);
  });
});
