import { expect, test } from '@playwright/test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { SCOPES, ScopeId, computed, openGallery, panel, tokenValue } from './helpers/gallery';

type Width = '180' | '280' | '360' | 'full';
const WIDTHS: readonly Width[] = ['180', '280', '360', 'full'];

/** What the gallery's long labels must say, stated independently of the gallery's own data. */
const BUTTON_LABEL: Record<ScopeId, string> = {
  artanon: 'Add this original artwork to my collection and arrange insured delivery',
  mentor: 'Book a one-to-one session to practise explaining architecture decisions to my team',
  'codecraft-light':
    'Open this annotated example in the playground and fork it to my own workspace',
  'codecraft-dark': 'Open this annotated example in the playground and fork it to my own workspace',
};
const NAV_LABEL: Record<ScopeId, string> = {
  artanon: 'Commissions, framing and insured delivery information',
  mentor: 'Frequently asked questions about lesson formats and scheduling',
  'codecraft-light': 'Contribution guidelines for new code examples and reviews',
  'codecraft-dark': 'Contribution guidelines for new code examples and reviews',
};

test.describe('DS-050 button long label', () => {
  for (const scope of SCOPES) {
    test(`wraps, grows and never truncates or overflows in ${scope.label}`, async ({ page }) => {
      await openGallery(page, scope.id);
      const scoped = panel(page, scope);
      const label = BUTTON_LABEL[scope.id];
      const controlHeight = parseFloat(await tokenValue(scoped, '--bui-control-height'));
      const heights: number[] = [];

      expect(await page.evaluate(() => document.documentElement.lang)).toBe('en');

      for (const width of WIDTHS) {
        const where = `${scope.label} at ${width}`;
        const container = scoped.getByTestId(`gallery-long-button-${width}`);
        const measured = await container.evaluate((box) => {
          const boxRect = box.getBoundingClientRect();
          return {
            width: boxRect.width,
            scrollWidth: box.scrollWidth,
            clientWidth: box.clientWidth,
            buttons: Array.from(box.querySelectorAll('button')).map((button) => {
              const rect = button.getBoundingClientRect();
              const range = document.createRange();
              range.selectNodeContents(button);
              const tops = new Set(
                Array.from(range.getClientRects()).map((r) => Math.round(r.top)),
              );
              const style = getComputedStyle(button);
              return {
                text: (button.textContent ?? '').replace(/\s+/g, ' ').trim(),
                left: rect.left - boxRect.left,
                right: rect.right - boxRect.left,
                height: rect.height,
                lines: tops.size,
                scrollWidth: button.scrollWidth,
                clientWidth: button.clientWidth,
                scrollHeight: button.scrollHeight,
                clientHeight: button.clientHeight,
                hyphens: style.hyphens,
                overflowWrap: style.overflowWrap,
                textWrapStyle: style.textWrapStyle,
                textOverflow: style.textOverflow,
              };
            }),
          };
        });

        if (width !== 'full') expect(measured.width, where).toBeCloseTo(Number(width), 1);
        // No unintended horizontal overflow, from the container or the buttons.
        expect(measured.scrollWidth, `${where}: container overflow`).toBeLessThanOrEqual(
          measured.clientWidth,
        );
        expect(measured.buttons).toHaveLength(2);
        for (const button of measured.buttons) {
          expect(button.text, `${where}: full label in the DOM`).toBe(label);
          expect(button.left, `${where}: left edge`).toBeGreaterThanOrEqual(-0.5);
          expect(button.right, `${where}: right edge`).toBeLessThanOrEqual(measured.width + 0.5);
          // Never truncated or clipped: all content fits in the button's own box.
          expect(button.scrollWidth, `${where}: clipped sideways`).toBeLessThanOrEqual(
            button.clientWidth + 1,
          );
          expect(button.scrollHeight, `${where}: clipped vertically`).toBeLessThanOrEqual(
            button.clientHeight + 1,
          );
          expect(button.textOverflow, where).not.toBe('ellipsis');
          expect(button.hyphens, where).toBe('auto');
          expect(button.overflowWrap, where).toBe('break-word');
          expect(button.textWrapStyle, where).toBe('balance');
          expect(button.height, `${where}: at least a control tall`).toBeGreaterThanOrEqual(
            controlHeight - 0.5,
          );
        }
        heights.push(measured.buttons[0].height);

        if (width === '180') {
          expect(
            measured.buttons[0].lines,
            `${where}: wraps onto several lines`,
          ).toBeGreaterThanOrEqual(3);
        }

        // The full text is the accessible name, whatever the width.
        await expect(container.getByRole('button', { name: label })).toHaveCount(2);
      }

      // Growth: the narrower the container, the taller the button, and it is never fixed-height.
      expect(heights[0]).toBeGreaterThanOrEqual(heights[1]);
      expect(heights[1]).toBeGreaterThanOrEqual(heights[2]);
      expect(heights[2]).toBeGreaterThanOrEqual(heights[3]);
      expect(heights[0]).toBeGreaterThan(heights[3] + 20);
    });
  }
});

test.describe('DS-051 navigation long label', () => {
  for (const scope of SCOPES) {
    test(`clamps to two lines at no more than 16rem, keeping the full name, in ${scope.label}`, async ({
      page,
    }) => {
      await openGallery(page, scope.id);
      const scoped = panel(page, scope);
      const label = NAV_LABEL[scope.id];

      for (const width of WIDTHS) {
        const where = `${scope.label} at ${width}`;
        const container = scoped.getByTestId(`gallery-long-nav-${width}`);
        const long = container.getByRole('link', { name: label });

        // Full accessible name and supplemental tooltip.
        await expect(long, `${where}: accessible name is the full text`).toHaveCount(1);
        await expect(long).toHaveAttribute('title', label);
        await expect(long).toHaveText(label);

        const measured = await container.evaluate((box) => {
          const boxRect = box.getBoundingClientRect();
          const link = Array.from(box.querySelectorAll('a')).find((a) => a.hasAttribute('title'))!;
          const rect = link.getBoundingClientRect();
          const style = getComputedStyle(link);
          const lineHeight = parseFloat(style.lineHeight);
          const chrome =
            parseFloat(style.paddingTop) +
            parseFloat(style.paddingBottom) +
            parseFloat(style.borderTopWidth) +
            parseFloat(style.borderBottomWidth);

          // The same link with the clamp lifted: how tall the full text really is here.
          const clone = link.cloneNode(true) as HTMLElement;
          clone.removeAttribute('title');
          clone.querySelectorAll('*').forEach((descendant) => {
            (descendant as HTMLElement).style.setProperty('-webkit-line-clamp', 'none');
          });
          link.parentElement!.appendChild(clone);
          const natural = clone.getBoundingClientRect().height;
          clone.remove();

          const clamped = Array.from(link.querySelectorAll('*')).find(
            (descendant) =>
              getComputedStyle(descendant).getPropertyValue('-webkit-line-clamp') === '2',
          );
          const nav = box.querySelector('nav')!;
          return {
            boxWidth: boxRect.width,
            boxScrollWidth: box.scrollWidth,
            boxClientWidth: box.clientWidth,
            navScrollWidth: nav.scrollWidth,
            navClientWidth: nav.clientWidth,
            linkWidth: rect.width,
            linkLeft: rect.left - boxRect.left,
            linkRight: rect.right - boxRect.left,
            linkHeight: rect.height,
            linkScrollWidth: link.scrollWidth,
            linkClientWidth: link.clientWidth,
            lineHeight,
            maxHeight: 2 * lineHeight + chrome,
            naturalHeight: natural,
            naturalLines: (natural - chrome) / lineHeight,
            clampOverflow: clamped ? getComputedStyle(clamped).overflow : null,
            clampLines: clamped
              ? getComputedStyle(clamped).getPropertyValue('-webkit-line-clamp')
              : null,
            rem: parseFloat(getComputedStyle(document.documentElement).fontSize),
            page: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          };
        });

        if (width !== 'full') expect(measured.boxWidth, where).toBeCloseTo(Number(width), 1);
        // Visual clamp: two lines, painted with overflow hidden.
        expect(measured.clampLines, `${where}: line clamp`).toBe('2');
        expect(measured.clampOverflow, `${where}: clipped, not scrolled`).toBe('hidden');
        expect(measured.linkHeight, `${where}: at most two lines tall`).toBeLessThanOrEqual(
          measured.maxHeight + 1,
        );
        if (width === '180') {
          expect(measured.naturalLines, `${where}: needs more than two lines`).toBeGreaterThan(2);
        }
        if (measured.naturalLines > 2.5) {
          // The text really is longer than two lines, so the clamp is what hides the rest.
          expect(
            measured.naturalHeight - measured.linkHeight,
            `${where}: clamped below its natural height`,
          ).toBeGreaterThanOrEqual(measured.lineHeight - 1);
        }

        // Never wider than 16rem, and never wider than its container.
        expect(measured.linkWidth, `${where}: 16rem limit`).toBeLessThanOrEqual(
          16 * measured.rem + 0.5,
        );
        expect(measured.linkLeft, `${where}: left edge`).toBeGreaterThanOrEqual(-0.5);
        expect(measured.linkRight, `${where}: right edge`).toBeLessThanOrEqual(
          measured.boxWidth + 0.5,
        );
        expect(measured.linkScrollWidth, `${where}: link overflow`).toBeLessThanOrEqual(
          measured.linkClientWidth + 1,
        );
        expect(measured.boxScrollWidth, `${where}: container overflow`).toBeLessThanOrEqual(
          measured.boxClientWidth,
        );
        expect(measured.navScrollWidth, `${where}: bar overflow`).toBeLessThanOrEqual(
          measured.navClientWidth,
        );
        expect(measured.page, `${where}: page scrolls sideways`).toBeLessThanOrEqual(0);
      }
    });
  }
});

test.describe('DS-045 narrow navigation', () => {
  for (const scope of SCOPES) {
    test(`wraps onto further rows without a collapsed menu in ${scope.label}`, async ({ page }) => {
      await openGallery(page, scope.id);
      const scoped = panel(page, scope);
      const rows = (testId: string) =>
        scoped
          .getByTestId(testId)
          .getByRole('link')
          .evaluateAll(
            (links) =>
              new Set(links.map((link) => Math.round(link.getBoundingClientRect().top))).size,
          );

      expect(await rows('gallery-nav-bar-default'), 'the wide bar is a single row').toBe(1);
      expect(await rows('gallery-nav-bar-narrow'), 'the narrow bar wraps').toBeGreaterThanOrEqual(
        2,
      );

      const narrow = scoped.getByTestId('gallery-nav-bar-narrow');
      await expect(narrow.getByRole('link')).toHaveCount(4);
      for (const link of await narrow.getByRole('link').all()) await expect(link).toBeVisible();
      await expect(narrow.locator('button, [aria-expanded], [aria-haspopup]')).toHaveCount(0);

      const fits = await narrow.getByRole('navigation').evaluate((nav) => ({
        scroll: nav.scrollWidth - nav.clientWidth,
        width: nav.getBoundingClientRect().width,
        rem: parseFloat(getComputedStyle(document.documentElement).fontSize),
      }));
      expect(fits.scroll).toBeLessThanOrEqual(0);
      expect(fits.width).toBeLessThanOrEqual(17.5 * fits.rem + 0.5);
    });
  }
});

test.describe('CodeCraft bevel', () => {
  test('Chromium supports corner-top-right-shape and applies the bevel only where tokens ask', async ({
    page,
  }) => {
    await openGallery(page, 'all');
    expect(await page.evaluate(() => CSS.supports('corner-top-right-shape', 'bevel'))).toBe(true);

    // The browser computes keywords to their superellipse form, so compare like with like.
    const resolved = (keyword: string) =>
      page.evaluate((value) => {
        const probe = document.createElement('div');
        probe.style.setProperty('corner-top-right-shape', value);
        document.body.appendChild(probe);
        const shape = getComputedStyle(probe).getPropertyValue('corner-top-right-shape');
        probe.remove();
        return shape;
      }, keyword);
    const round = await resolved('round');
    const bevel = await resolved('bevel');
    expect(bevel).not.toBe(round);

    for (const scope of SCOPES) {
      const scoped = panel(page, scope);
      const card = scoped.getByTestId('gallery-card-static').locator('article');
      const style = await computed(card, ['corner-top-right-shape', 'border-top-right-radius']);
      expect(style['corner-top-right-shape'], scope.label).toBe(
        await resolved(await tokenValue(scoped, '--bui-corner-shape-card')),
      );
      expect(style['border-top-right-radius'], scope.label).toBe(
        await tokenValue(scoped, '--bui-radius-tr-card'),
      );
      if (scope.brand === 'codecraft') {
        expect(style['corner-top-right-shape'], scope.label).toBe(bevel);
        expect(style['border-top-right-radius'], scope.label).toBe('16px');
      } else {
        expect(style['corner-top-right-shape'], scope.label).toBe(round);
      }
    }
  });

  test('the rounded fallback radius is in force even when the shape is not', async ({ page }) => {
    await openGallery(page, 'codecraft-light');
    const card = panel(page, 'codecraft-light')
      .getByTestId('gallery-card-static')
      .locator('article');
    // A browser without corner-shape support computes this radius and draws the rounded corner.
    const before = await computed(card, ['corner-top-right-shape', 'border-top-right-radius']);
    await card.evaluate((element) => {
      element.style.setProperty('corner-top-right-shape', 'round');
    });
    const after = await computed(card, ['corner-top-right-shape', 'border-top-right-radius']);
    expect(after['corner-top-right-shape']).not.toBe(before['corner-top-right-shape']);
    expect(after['border-top-right-radius']).toBe('16px');
    expect(after['border-top-right-radius']).toBe(before['border-top-right-radius']);
  });

  test('the source declares the rounded radius before the shape, so the fallback comes first', () => {
    const scss = readFileSync(
      join(__dirname, '../projects/atomic/organisms/src/card/card.scss'),
      'utf8',
    );
    const card = scss.slice(scss.indexOf('.card {'));
    const shorthand = card.indexOf('border-radius:');
    const topRight = card.indexOf('border-top-right-radius:');
    const shape = card.indexOf('corner-top-right-shape:');
    expect(shorthand).toBeGreaterThan(-1);
    expect(shorthand).toBeLessThan(topRight);
    expect(topRight).toBeLessThan(shape);
  });
});
