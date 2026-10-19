import AxeBuilder from '@axe-core/playwright';
import { Locator, Page, expect, test } from '@playwright/test';
import { parseRgb } from './helpers/contrast';
import {
  SCOPES,
  Scope,
  computed,
  openGallery,
  panel,
  resolveColor,
  tokenValue,
} from './helpers/gallery';

const FOCUSABLE = 'a[href], button, input, select, textarea, [tabindex]';

/** Presses Tab until `target` has focus, so the focus is reached the way a keyboard user reaches it. */
async function tabTo(page: Page, target: Locator, limit = 300): Promise<void> {
  for (let presses = 0; presses < limit; presses++) {
    await page.keyboard.press('Tab');
    if (await target.evaluate((element) => element === document.activeElement)) return;
  }
  throw new Error(`Not reachable with Tab within ${limit} presses`);
}

/** Genuine :focus-visible evidence: the ring comes from the real pseudo-class, in the focus token. */
async function expectFocusRing(scope: Scope, page: Page, focused: Locator, ringOwner: Locator) {
  const scoped = panel(page, scope);
  await expect(focused).toBeFocused();
  expect(await focused.evaluate((element) => element.matches(':focus-visible'))).toBe(true);
  const ring = await computed(ringOwner, ['outline-style', 'outline-width', 'outline-color']);
  expect(ring['outline-style']).toBe('solid');
  expect(ring['outline-width']).toBe(await tokenValue(scoped, '--bui-focus-width'));
  expect(parseRgb(ring['outline-color'])).toEqual(await resolveColor(scoped, '--bui-color-focus'));
}

test.describe('keyboard operation', () => {
  test('tab order follows the page and reaches only enabled controls', async ({ page }) => {
    await openGallery(page, 'artanon');
    const total = await page.evaluate(
      (selector) =>
        Array.from(document.querySelectorAll<HTMLElement>(selector)).filter(
          (element) => !element.matches(':disabled') && element.tabIndex >= 0,
        ).length,
      FOCUSABLE,
    );
    expect(total).toBeGreaterThan(30);

    // Start from the top of the page: clicking the heading sets where Tab begins.
    await page.getByRole('heading', { level: 1 }).click();
    const visited: number[] = [];
    for (let press = 0; press < total; press++) {
      await page.keyboard.press('Tab');
      visited.push(
        await page.evaluate((selector) => {
          const reachable = Array.from(document.querySelectorAll<HTMLElement>(selector)).filter(
            (element) => !element.matches(':disabled') && element.tabIndex >= 0,
          );
          return reachable.indexOf(document.activeElement as HTMLElement);
        }, FOCUSABLE),
      );
    }
    expect(visited).toEqual(Array.from({ length: total }, (_, index) => index));
  });

  test('a disabled button and a disabled input cannot be focused', async ({ page }) => {
    await openGallery(page, 'artanon');
    const button = page.getByTestId('gallery-button-primary-disabled').getByRole('button');
    const input = page.getByTestId('gallery-input-field-disabled').getByRole('textbox');
    for (const control of [button, input]) {
      await expect(control).toBeDisabled();
      await control.focus();
      await expect(control).not.toBeFocused();
    }
  });

  test('a disabled navigation item is plain text, not a link and not in the tab order', async ({
    page,
  }) => {
    await openGallery(page, 'artanon');
    const bar = page.getByTestId('gallery-nav-bar-disabled');
    await expect(bar.getByText('Disabled', { exact: true })).toBeVisible();
    await expect(bar.getByRole('link')).toHaveCount(0);
    await expect(bar.locator(`${FOCUSABLE}, [aria-disabled]`)).toHaveCount(0);
  });

  test('Enter and Space activate a button; loading suppresses key, pointer and submission', async ({
    page,
  }) => {
    await openGallery(page, 'artanon');
    const form = page.getByTestId('gallery-button-form');
    const submit = form.getByRole('button', { name: 'Submit sample' });
    const loading = form.getByRole('button', { name: 'Submitting sample' });
    const activated = page.getByTestId('gallery-button-form-activated');
    const submitted = page.getByTestId('gallery-button-form-submitted');

    await tabTo(page, submit);
    await page.keyboard.press('Enter');
    await expect(activated).toHaveText('1');
    await expect(submitted).toHaveText('1');
    await page.keyboard.press('Space');
    await expect(activated).toHaveText('2');
    await expect(submitted).toHaveText('2');

    // The loading button stays in the tab order and keeps its label and focus...
    await page.keyboard.press('Tab');
    await expect(loading).toBeFocused();
    await expect(loading).toHaveAttribute('aria-busy', 'true');
    await expect(loading).toBeEnabled();
    await expect(loading).toHaveText('Submitting sample');

    // ...but ignores the keyboard, the pointer, and form submission.
    await page.keyboard.press('Enter');
    await page.keyboard.press('Space');
    await loading.click();
    await loading.dblclick();
    await expect(loading).toBeFocused();
    await expect(activated).toHaveText('2');
    await expect(submitted).toHaveText('2');
  });

  test('Enter follows a navigation link and a card link by keyboard', async ({ page }) => {
    await openGallery(page, 'artanon');
    await page.evaluate(() => {
      const holder = window as unknown as { __clicked: string[] };
      holder.__clicked = [];
      document.addEventListener(
        'click',
        (event) => {
          const link = (event.target as Element).closest('a');
          if (link) holder.__clicked.push(link.textContent?.trim() ?? '');
        },
        true,
      );
    });
    const card = page.getByTestId('gallery-card-interactive').getByRole('link');
    const nav = page
      .getByTestId('gallery-nav-bar-default')
      .getByRole('link', { name: 'Collections' });

    await tabTo(page, card);
    await page.keyboard.press('Enter');
    await tabTo(page, nav);
    await page.keyboard.press('Enter');

    const clicked = await page.evaluate(
      () => (window as unknown as { __clicked: string[] }).__clicked,
    );
    expect(clicked).toEqual(['Sample artwork title', 'Collections']);
  });
});

test.describe('genuine focus-visible', () => {
  for (const scope of SCOPES) {
    test(`button, input, card and navigation show a keyboard focus ring in ${scope.label}`, async ({
      page,
    }) => {
      await openGallery(page, scope.id);
      const scoped = panel(page, scope);

      const button = scoped.getByTestId('gallery-button-primary-default').getByRole('button');
      await tabTo(page, button);
      await expectFocusRing(scope, page, button, button);

      const input = scoped.getByTestId('gallery-input-field-default').getByRole('textbox');
      await tabTo(page, input);
      await expectFocusRing(scope, page, input, input);

      const cardLink = scoped.getByTestId('gallery-card-interactive').getByRole('link');
      await tabTo(page, cardLink);
      // The single link takes focus; the ring is drawn around the whole card.
      await expectFocusRing(
        scope,
        page,
        cardLink,
        scoped.getByTestId('gallery-card-interactive').locator('article'),
      );
      expect((await computed(cardLink, ['outline-style']))['outline-style']).toBe('none');

      const navLink = scoped.getByTestId('gallery-nav-bar-default').getByRole('link').first();
      await tabTo(page, navLink);
      await expectFocusRing(scope, page, navLink, navLink);
    });
  }
});

test.describe('text input semantics', () => {
  test('every state is named by its visible label', async ({ page }) => {
    await openGallery(page, 'artanon');
    for (const state of ['default', 'hover', 'focus', 'filled', 'error', 'disabled']) {
      const field = page.getByTestId(`gallery-input-field-${state}`);
      const input = field.getByLabel('Email address');
      await expect(input).toHaveCount(1);
      await expect(input).toHaveAccessibleName('Email address');
    }
  });

  test('helper text describes a valid input; error text replaces it, with icon and text', async ({
    page,
  }) => {
    await openGallery(page, 'artanon');
    const valid = page.getByTestId('gallery-input-field-filled');
    await expect(valid.getByRole('textbox')).toHaveAccessibleDescription('Sample helper text.');
    await expect(valid.getByRole('textbox')).not.toHaveAttribute('aria-invalid', /.*/);

    const invalid = page.getByTestId('gallery-input-field-error');
    const input = invalid.getByRole('textbox');
    await expect(input).toHaveAttribute('aria-invalid', 'true');
    await expect(input).toHaveAccessibleDescription(
      'Enter an email address in the format name@example.com.',
    );
    await expect(invalid.getByText('Sample helper text.')).toHaveCount(0);
    const message = invalid.getByText(/^Enter an email address/);
    await expect(message).toBeVisible();
    await expect(invalid.locator('svg')).toHaveCount(1);
    await expect(invalid.locator('svg')).toHaveAttribute('aria-hidden', 'true');
    await expect(invalid.locator('[role="alert"]')).toHaveCount(0);
  });

  test('typing updates the value and the echo of the working sample', async ({ page }) => {
    await openGallery(page, 'artanon');
    const input = page.getByTestId('gallery-input-field-default').getByRole('textbox');
    const echo = page.getByTestId('gallery-input-echo');
    await expect(echo).toContainText('(nothing yet)');
    await input.click();
    await page.keyboard.type('person@example.com');
    await expect(input).toHaveValue('person@example.com');
    await expect(echo).toContainText('person@example.com');
  });

  test('a disabled input keeps its value and its description', async ({ page }) => {
    await openGallery(page, 'artanon');
    const input = page.getByTestId('gallery-input-field-disabled').getByRole('textbox');
    await expect(input).toBeDisabled();
    await expect(input).toHaveValue('person@example.com');
    await expect(input).toHaveAccessibleDescription('Sample helper text.');
  });
});

test.describe('card and navigation semantics', () => {
  test('a static card has no link; an interactive card has exactly one native link and one tab stop', async ({
    page,
  }) => {
    await openGallery(page, 'artanon');
    const staticCard = page.getByTestId('gallery-card-static');
    await expect(staticCard.getByRole('link')).toHaveCount(0);
    await expect(staticCard.getByRole('heading', { level: 3 })).toHaveText('Sample artwork title');

    const card = page.getByTestId('gallery-card-interactive');
    await expect(card.getByRole('link')).toHaveCount(1);
    await expect(card.getByRole('link')).toHaveAccessibleName('Sample artwork title');
    await expect(card.locator(FOCUSABLE)).toHaveCount(1);
  });

  test('clicking anywhere on an interactive card follows its single link', async ({ page }) => {
    await openGallery(page, 'artanon');
    await page.evaluate(() => {
      const holder = window as unknown as { __target: string | null };
      holder.__target = null;
      document.addEventListener(
        'click',
        (event) => {
          holder.__target = (event.target as Element).closest('a')?.textContent?.trim() ?? null;
        },
        true,
      );
    });
    // The description text is not the link, but the link's hit area covers the card. Click where a
    // pointer would, not on the element: Playwright rightly refuses to click through an overlay.
    const description = page
      .getByTestId('gallery-card-interactive')
      .getByText('Sample description of a print', { exact: false });
    await description.evaluate((element) => element.scrollIntoView({ block: 'center' }));
    const box = (await description.boundingBox())!;
    await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
    expect(
      await page.evaluate(() => (window as unknown as { __target: string | null }).__target),
    ).toBe('Sample artwork title');
  });

  test('a loading card is busy and has nothing to focus', async ({ page }) => {
    await openGallery(page, 'artanon');
    const loading = page.getByTestId('gallery-card-loading');
    await expect(loading.locator('article')).toHaveAttribute('aria-busy', 'true');
    await expect(loading.locator(FOCUSABLE)).toHaveCount(0);
    await expect(loading.getByText('Loading', { exact: true })).toHaveCount(1);
  });

  test('navigation is a named landmark with native links and a single current page', async ({
    page,
  }) => {
    await openGallery(page, 'artanon');
    const nav = page.getByRole('navigation', { name: 'ArtAnon Shop navigation, default' });
    await expect(nav).toHaveCount(1);
    await expect(nav.getByRole('listitem')).toHaveCount(4);
    for (const name of ['Shop', 'Collections', 'About', 'Contact']) {
      await expect(nav.getByRole('link', { name })).toHaveAttribute('href', '#sample');
    }
    await expect(nav.getByRole('link', { name: 'Shop' })).toHaveAttribute('aria-current', 'page');
    await expect(nav.locator('[aria-current]')).toHaveCount(1);
    await expect(nav.getByText('ArtAnon', { exact: true })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'ArtAnon' })).toHaveCount(0);
  });
});

test.describe('automated accessibility', () => {
  test('the complete gallery has no serious or critical axe violations', async ({
    page,
  }, testInfo) => {
    await openGallery(page, 'all');
    await expect(page.getByTestId('gallery-status')).toContainText('Reference spike');

    const results = await new AxeBuilder({ page }).analyze();
    await testInfo.attach('axe-results.json', {
      body: JSON.stringify(
        {
          url: results.url,
          violations: results.violations,
          incomplete: results.incomplete.map(({ id, impact, nodes }) => ({
            id,
            impact,
            nodes: nodes.length,
          })),
          passes: results.passes.length,
        },
        null,
        2,
      ),
      contentType: 'application/json',
    });

    expect(results.passes.length, 'axe evaluated the page').toBeGreaterThan(10);
    const blocking = results.violations.filter(
      (violation) => violation.impact === 'serious' || violation.impact === 'critical',
    );
    expect(
      blocking.map((violation) => ({
        id: violation.id,
        impact: violation.impact,
        targets: violation.nodes.map((node) => node.target.join(' ')),
      })),
    ).toEqual([]);
  });
});
