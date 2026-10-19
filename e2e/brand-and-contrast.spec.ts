import { expect, test } from '@playwright/test';
import {
  REQUIRED_RATIO,
  USAGE_PAIRS,
} from '../projects/gallery/src/app/gallery/specimens/usage-pairs';
import { contrastRatio, parseRgb } from './helpers/contrast';
import {
  SCOPES,
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
