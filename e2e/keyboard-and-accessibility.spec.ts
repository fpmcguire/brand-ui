import AxeBuilder from '@axe-core/playwright';
import { Locator, Page, TestInfo, expect, test } from '@playwright/test';
import { parseRgb } from './helpers/contrast';
import {
  ABOUT_SEEN_KEY,
  SCOPES,
  Scope,
  aboutDialog,
  aboutTrigger,
  computed,
  galleryReady,
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
    await expect(bar.locator(FOCUSABLE)).toHaveCount(0);
    const disabled = bar.locator('[aria-disabled]');
    await expect(disabled).toHaveCount(1);
    await expect(disabled).toHaveAttribute('aria-disabled', 'true');
    await expect(disabled).toHaveText('Disabled');
    await expect(disabled).not.toHaveAttribute('role', /.*/);
    await expect(disabled).not.toHaveAttribute('aria-current', /.*/);
    expect(await disabled.evaluate((element) => element.tagName)).toBe('SPAN');
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

/** Attaches the axe results and fails on any serious or critical violation. */
async function expectNoBlockingViolations(
  results: Awaited<ReturnType<AxeBuilder['analyze']>>,
  testInfo: TestInfo,
  attachment: string,
  minimumPasses: number,
): Promise<void> {
  await testInfo.attach(attachment, {
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

  expect(results.passes.length, 'axe evaluated the page').toBeGreaterThan(minimumPasses);
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
}

test.describe('automated accessibility', () => {
  // The scan of four stacked scopes is slow enough to approach the default timeout under load.
  test.slow();

  test('the complete gallery has no serious or critical axe violations', async ({
    page,
  }, testInfo) => {
    await openGallery(page, 'all');
    await expect(page.getByTestId('gallery-status')).toContainText('Reference spike');

    const results = await new AxeBuilder({ page }).analyze();
    await expectNoBlockingViolations(results, testInfo, 'axe-results.json', 10);
  });

  test('the complete gallery has no serious or critical axe violations once the About panel is dismissed', async ({
    page,
  }, testInfo) => {
    await page.goto('/');
    await expect(aboutDialog(page)).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(aboutDialog(page)).toHaveCount(0);
    await page.getByTestId('gallery-switch-all').click();
    await galleryReady(page, 4);
    await expect(page.getByTestId('gallery-status')).toContainText('Reference spike');

    const results = await new AxeBuilder({ page }).analyze();
    await expectNoBlockingViolations(results, testInfo, 'axe-results-after-about.json', 10);
  });

  for (const scope of SCOPES) {
    test(`the open About panel has no serious or critical axe violations in ${scope.label}`, async ({
      page,
    }, testInfo) => {
      await openGallery(page, scope.id);
      await aboutTrigger(page).click();
      await expect(aboutDialog(page)).toBeVisible();

      const results = await new AxeBuilder({ page }).include('dialog[open]').analyze();
      await expectNoBlockingViolations(results, testInfo, 'axe-results-about-dialog.json', 5);
    });
  }
});

test.describe('About panel', () => {
  const closeButton = (page: Page) => aboutDialog(page).getByRole('button', { name: 'Close' });
  /** The two external links the panel permits: the methodology, then the source repository. */
  const EXTERNAL_LINKS = [
    {
      name: 'github.com/fpmcguire/mod-w (opens in a new tab)',
      text: 'github.com/fpmcguire/mod-w',
      href: 'https://github.com/fpmcguire/mod-w',
    },
    {
      name: 'github.com/fpmcguire/brand-ui (opens in a new tab)',
      text: 'github.com/fpmcguire/brand-ui',
      href: 'https://github.com/fpmcguire/brand-ui.git',
    },
  ] as const;
  /**
   * Where keyboard focus is: on Close, on the dialog itself (its scrolling box), somewhere else in
   * the dialog, in the browser's own UI (the document has lost focus), or on a page element.
   */
  const focusStop = (page: Page) =>
    page.evaluate(() => {
      const active = document.activeElement;
      const dialog = document.querySelector('dialog[open]');
      if (!document.hasFocus() && (active === null || active === document.body)) return 'browser';
      if (active && dialog?.contains(active)) {
        if (active === dialog) return 'dialog';
        return active.textContent?.trim() === 'Close' ? 'close' : 'inside';
      }
      return `page element ${active?.tagName}`;
    });

  /** The three ways to dismiss the panel: Close button, Esc, and a click outside the dialog. */
  const DISMISSALS: ReadonlyArray<readonly [string, (page: Page) => Promise<void>]> = [
    ['the Close button', (page) => closeButton(page).click()],
    ['Esc', (page) => page.keyboard.press('Escape')],
    ['a click outside the dialog', (page) => page.mouse.click(5, 5)],
  ];

  test('opens by itself on a first visit: modal, named by its heading, focused on Close', async ({
    page,
  }) => {
    await page.goto('/');
    const dialog = aboutDialog(page);
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveAccessibleName('About brand-ui');
    await expect(dialog.getByRole('heading', { level: 2 })).toHaveText('About brand-ui');
    expect(await dialog.evaluate((element) => element.matches(':modal'))).toBe(true);
    await expect(closeButton(page)).toBeFocused();

    // Recorded when the automatic opening is initiated, not when it is closed.
    expect(await page.evaluate((key) => localStorage.getItem(key), ABOUT_SEEN_KEY)).not.toBeNull();

    await expect(dialog.getByRole('heading', { level: 3 })).toHaveText([
      'A reference spike, not production',
      'Three brands, four scopes',
      'The ui library',
      'How the gallery relates to the library',
      'Using the gallery',
      'How this was built',
      'Source repository',
    ]);
    await expect(dialog.getByText(/DS-/)).toHaveCount(0);

    const library = dialog.locator('section[aria-labelledby="gal-about-library"]');
    await expect(library).toContainText('Atomic Design');
    await expect(library).toContainText('Tag, SkeletonBlock and CodeWell are atoms');
    await expect(library).toContainText('MediaArea and LoadingSkeleton are molecules');
    await expect(library).toContainText('Card is the organism');
    await expect(library.locator('a')).toHaveCount(0);

    // Exactly two external links, each opening in a new tab and saying so.
    await expect(dialog.getByRole('link')).toHaveCount(2);
    for (const { name, text, href } of EXTERNAL_LINKS) {
      const link = dialog.getByRole('link', { name, exact: true });
      await expect(link).toHaveCount(1);
      await expect(link).toHaveText(text);
      await expect(link).toHaveAttribute('href', href);
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    }

    // The source repository has its own, last, section.
    await expect(dialog.getByRole('heading', { level: 3 }).last()).toHaveText('Source repository');
  });

  test('the source-repository link is reached and opened in a new tab from the keyboard', async ({
    page,
    context,
  }) => {
    // The destination is stubbed, so the test never depends on the network.
    await context.route('https://github.com/**', (route) =>
      route.fulfill({ contentType: 'text/html', body: '<title>stub</title>' }),
    );
    await page.goto('/');
    const dialog = aboutDialog(page);
    await expect(dialog).toBeVisible();
    await expect(closeButton(page)).toBeFocused();

    const repository = dialog.getByRole('link', { name: EXTERNAL_LINKS[1].name, exact: true });
    for (let press = 0; press < 6; press++) {
      if (await repository.evaluate((link) => link === document.activeElement)) break;
      await page.keyboard.press('Tab');
    }
    await expect(repository).toBeFocused();

    const [popup] = await Promise.all([context.waitForEvent('page'), page.keyboard.press('Enter')]);
    await popup.waitForLoadState();
    expect(popup.url()).toBe(EXTERNAL_LINKS[1].href);
    // noopener: the new tab has no handle back to the gallery.
    expect(await popup.evaluate(() => window.opener)).toBeNull();
    await popup.close();

    await expect(dialog).toBeVisible();
    await expect(repository).toBeFocused();
  });

  test('Tab and Shift+Tab never reach the page behind the open dialog', async ({ page }) => {
    await page.goto('/');
    await expect(aboutDialog(page)).toBeVisible();

    // Focus cycles Close, the dialog's own box, its two links and the browser's own UI. It must
    // never land on a page element, in either direction, and must come back to Close.
    const contained = new Set(['close', 'dialog', 'inside', 'browser']);
    for (const key of ['Tab', 'Shift+Tab']) {
      const stops: string[] = [];
      for (let press = 0; press < 9; press++) {
        await page.keyboard.press(key);
        stops.push(await focusStop(page));
      }
      expect(
        stops.filter((stop) => !contained.has(stop)),
        `${key} stops outside the dialog`,
      ).toEqual([]);
      expect(stops, `${key} comes back to Close`).toContain('close');
      expect(stops, `${key} reaches the links inside the dialog`).toContain('inside');
    }

    const reachedPage = await page.evaluate(() => {
      const behind = document.querySelector<HTMLElement>('[data-testid="gallery-switch-all"]')!;
      behind.focus();
      return document.activeElement === behind;
    });
    expect(reachedPage, 'a control behind the modal takes focus').toBe(false);
  });

  for (const [name, dismiss] of DISMISSALS) {
    test(`${name} closes it and returns focus to About, on a first visit and on a manual reopen`, async ({
      page,
    }) => {
      await page.goto('/');
      const dialog = aboutDialog(page);
      await expect(dialog).toBeVisible();
      await dismiss(page);
      await expect(dialog).toHaveCount(0);
      await expect(aboutTrigger(page)).toBeFocused();

      await aboutTrigger(page).click();
      await expect(dialog).toBeVisible();
      await expect(closeButton(page)).toBeFocused();
      await dismiss(page);
      await expect(dialog).toHaveCount(0);
      await expect(aboutTrigger(page)).toBeFocused();
    });
  }

  test('reopens from the keyboard with Enter and with Space', async ({ page }) => {
    await openGallery(page, 'artanon');
    const dialog = aboutDialog(page);
    for (const key of ['Enter', 'Space']) {
      await aboutTrigger(page).focus();
      await page.keyboard.press(key);
      await expect(dialog).toBeVisible();
      await expect(closeButton(page)).toBeFocused();
      await page.keyboard.press('Escape');
      await expect(dialog).toHaveCount(0);
      await expect(aboutTrigger(page)).toBeFocused();
    }
  });

  test('does not close from interaction inside the dialog', async ({ page }) => {
    await page.goto('/');
    const dialog = aboutDialog(page);
    await expect(dialog).toBeVisible();

    await dialog.getByRole('heading', { level: 2 }).click();
    await expect(dialog).toBeVisible();

    // The dialog's own padding is inside its rectangle: the click target is the dialog itself.
    const box = (await dialog.boundingBox())!;
    await page.mouse.click(box.x + 3, box.y + 3);
    await expect(dialog).toBeVisible();

    // A drag that starts inside and is released over the backdrop is not an outside click.
    await page.mouse.move(box.x + box.width / 2, box.y + 20);
    await page.mouse.down();
    await page.mouse.move(5, 5);
    await page.mouse.up();
    await expect(dialog).toBeVisible();
  });

  test('opens on the first visit only: the seen value persists across a reload', async ({
    page,
  }) => {
    await page.goto('/');
    await expect(aboutDialog(page)).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(aboutDialog(page)).toHaveCount(0);

    await page.reload();
    await galleryReady(page, 1);
    await expect(aboutDialog(page)).toHaveCount(0);
    expect(await page.evaluate((key) => localStorage.getItem(key), ABOUT_SEEN_KEY)).not.toBeNull();
  });

  const STORAGE_FAILURES: ReadonlyArray<readonly [string, () => void]> = [
    [
      'Storage reads and writes throw',
      () => {
        const fail = () => {
          throw new DOMException('denied', 'SecurityError');
        };
        Storage.prototype.getItem = fail;
        Storage.prototype.setItem = fail;
      },
    ],
    [
      'the localStorage getter throws',
      () => {
        Object.defineProperty(window, 'localStorage', {
          configurable: true,
          get() {
            throw new DOMException('denied', 'SecurityError');
          },
        });
      },
    ],
  ];

  for (const [name, fail] of STORAGE_FAILURES) {
    test(`when ${name}, it opens once per page load, works by hand, and opens again after a reload`, async ({
      page,
    }) => {
      await page.addInitScript(fail);
      await page.goto('/');
      const dialog = aboutDialog(page);
      await expect(dialog).toHaveCount(1);
      await expect(dialog).toBeVisible();

      await page.keyboard.press('Escape');
      await expect(dialog).toHaveCount(0);
      await expect(aboutTrigger(page)).toBeFocused();
      await galleryReady(page, 1);
      await expect(dialog, 'no second automatic opening in this page load').toHaveCount(0);

      await aboutTrigger(page).click();
      await expect(dialog).toBeVisible();
      await closeButton(page).click();
      await expect(dialog).toHaveCount(0);
      await expect(aboutTrigger(page)).toBeFocused();

      await page.reload();
      await expect(aboutDialog(page)).toBeVisible();
    });
  }
});

const structure = (page: Page, scope: Scope) =>
  panel(page, scope).getByTestId('gallery-structure-section-default');

type Motion = {
  readonly isCss: boolean;
  readonly hasEffect: boolean;
  readonly name: string | null;
  readonly duration: number | null;
  readonly iterations: number | 'infinite' | null;
};

/** Reads animations inside the page. `Infinity` is encoded as 'infinite' for serialization. */
async function motionOf(block: Locator): Promise<Motion[]> {
  return block.evaluate((element): Motion[] =>
    element.getAnimations().map((animation) => {
      const timing = animation.effect?.getComputedTiming();
      const duration = timing?.duration;
      const iterations = timing?.iterations;
      return {
        isCss: animation instanceof CSSAnimation,
        hasEffect: animation.effect !== null,
        name: animation instanceof CSSAnimation ? animation.animationName : null,
        duration: typeof duration === 'number' ? duration : null,
        iterations:
          iterations === Infinity ? 'infinite' : typeof iterations === 'number' ? iterations : null,
      };
    }),
  );
}

test.describe('Card structure view', () => {
  for (const scope of SCOPES) {
    test(`the structure view has one link and one tab stop, on the interactive card, in ${scope.label}`, async ({
      page,
    }) => {
      await openGallery(page, scope.id);
      const section = structure(page, scope);
      const figure = section.getByTestId('gallery-structure-card-interactive-default');
      const link = figure.getByRole('link');
      await expect(link).toHaveCount(1);
      const title = (await figure.getByRole('heading', { level: 3 }).textContent())!.trim();
      await expect(link).toHaveAccessibleName(title);
      expect(
        await section.evaluate(
          (root, selector) => root.querySelectorAll(selector).length,
          FOCUSABLE,
        ),
      ).toBe(1);
      await expect(
        section.getByTestId('gallery-structure-card-static').locator(FOCUSABLE),
      ).toHaveCount(0);
      await expect(
        section.getByTestId('gallery-structure-card-loading').locator(FOCUSABLE),
      ).toHaveCount(0);
      await tabTo(page, link);
      await expectFocusRing(scope, page, link, figure.locator('article'));
    });

    test(`hides the isolated skeletons and gives busy and Loading only to the DS-035 card, in ${scope.label}`, async ({
      page,
    }) => {
      await openGallery(page, scope.id);
      const section = structure(page, scope);
      await expect(section.locator('bui-skeleton-block')).toHaveCount(9);
      await expect(section.locator('bui-loading-skeleton')).toHaveCount(2);
      const allHidden = await section.evaluate((root) =>
        Array.from(root.querySelectorAll('bui-skeleton-block, bui-loading-skeleton')).every(
          (element) => element.getAttribute('aria-hidden') === 'true',
        ),
      );
      expect(allHidden).toBe(true);
      await expect(section.locator('[aria-busy="true"]')).toHaveCount(1);
      const loadingCard = section.getByTestId('gallery-structure-card-loading');
      await expect(loadingCard.locator('article[aria-busy="true"]')).toHaveCount(1);
      await expect(section.getByText('Loading', { exact: true })).toHaveCount(1);
      await expect(loadingCard.getByText('Loading', { exact: true })).toHaveCount(1);
    });

    test(`the isolated skeletons are visible, contained, sunken, animate normally and stop under reduced motion, in ${scope.label}`, async ({
      page,
    }) => {
      await openGallery(page, scope.id);
      const scoped = panel(page, scope);
      const section = structure(page, scope);
      const sunken = await resolveColor(scoped, '--bui-color-surface-sunken');
      const viewport = (await page.viewportSize())!;
      const targets = [
        {
          name: 'DS-063',
          figure: section.getByTestId('gallery-structure-skeleton-block-loading'),
          blocks: 1,
        },
        {
          name: 'DS-066',
          figure: section.getByTestId('gallery-structure-loading-skeleton-loading'),
          blocks: 4,
        },
        {
          name: 'DS-035',
          figure: section.getByTestId('gallery-structure-card-loading'),
          blocks: 4,
        },
      ] as const;
      const blocks = targets.map((target) => target.figure.locator('bui-skeleton-block'));

      for (const [index, target] of targets.entries()) {
        await expect(blocks[index], `${target.name} block count`).toHaveCount(target.blocks);
      }

      // Geometry and paint, in normal motion.
      for (const [index, target] of targets.entries()) {
        await target.figure.scrollIntoViewIfNeeded();
        await expect(target.figure, `${target.name} figure visible`).toBeVisible();
        const figureBox = (await target.figure.boundingBox())!;
        for (let i = 0; i < target.blocks; i++) {
          const block = blocks[index].nth(i);
          await expect(block, `${target.name} block ${i} visible`).toBeVisible();
          const box = (await block.boundingBox())!;
          expect(box.width, `${target.name} block ${i} width`).toBeGreaterThan(0);
          expect(box.height, `${target.name} block ${i} height`).toBeGreaterThan(0);
          expect(box.x, `${target.name} block ${i} inside figure, left`).toBeGreaterThanOrEqual(
            figureBox.x - 0.5,
          );
          expect(box.y, `${target.name} block ${i} inside figure, top`).toBeGreaterThanOrEqual(
            figureBox.y - 0.5,
          );
          expect(
            box.x + box.width,
            `${target.name} block ${i} inside figure, right`,
          ).toBeLessThanOrEqual(figureBox.x + figureBox.width + 0.5);
          expect(
            box.y + box.height,
            `${target.name} block ${i} inside figure, bottom`,
          ).toBeLessThanOrEqual(figureBox.y + figureBox.height + 0.5);
          expect(box.x, `${target.name} block ${i} inside viewport, left`).toBeGreaterThanOrEqual(
            -0.5,
          );
          expect(box.y, `${target.name} block ${i} inside viewport, top`).toBeGreaterThanOrEqual(0);
          expect(
            box.x + box.width,
            `${target.name} block ${i} inside viewport, right`,
          ).toBeLessThanOrEqual(viewport.width + 0.5);
          expect(
            box.y + box.height,
            `${target.name} block ${i} inside viewport, bottom`,
          ).toBeLessThanOrEqual(viewport.height + 0.5);
          const fill = await block.evaluate((element) => getComputedStyle(element).backgroundColor);
          expect(parseRgb(fill), `${target.name} block ${i} paint`).toEqual(sunken);
        }
      }

      try {
        // Normal motion: every block animates as the atom specifies.
        await page.emulateMedia({ reducedMotion: 'no-preference' });
        for (const [index, target] of targets.entries()) {
          for (let i = 0; i < target.blocks; i++) {
            const motion = (await motionOf(blocks[index].nth(i))).filter((entry) => entry.isCss);
            expect(motion.length, `${target.name} block ${i} CSS animations`).toBeGreaterThan(0);
            const first = motion[0]!;
            expect(first.hasEffect, `${target.name} block ${i} effect present`).toBe(true);
            expect(first.name, `${target.name} block ${i} animation name`).not.toBe('none');
            expect(first.name, `${target.name} block ${i} animation name`).toBeTruthy();
            expect(first.duration, `${target.name} block ${i} duration`).toBe(1400);
            expect(first.iterations, `${target.name} block ${i} iterations`).toBe('infinite');
          }
        }

        // Reduced motion: one switch, then every block is checked.
        await page.emulateMedia({ reducedMotion: 'reduce' });
        for (const [index, target] of targets.entries()) {
          for (let i = 0; i < target.blocks; i++) {
            const block = blocks[index].nth(i);
            expect(await motionOf(block), `${target.name} block ${i} animations`).toEqual([]);
            expect(
              await block.evaluate((element) => getComputedStyle(element).animationName),
              `${target.name} block ${i} animation-name`,
            ).toBe('none');
          }
        }
      } finally {
        await page.emulateMedia({ reducedMotion: 'no-preference' });
      }
    });
  }

  test('the view stacks to one column with no horizontal overflow, and its Cards stay usable, at phone width', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 400, height: 900 });
    await openGallery(page, 'all');
    for (const scope of SCOPES) {
      const section = structure(page, scope);
      const groups = await section.evaluate((root) =>
        Array.from(root.querySelectorAll<HTMLElement>('[role="group"]')).map((group) => {
          const figures = Array.from(group.querySelectorAll('figure')).map((figure) =>
            figure.getBoundingClientRect(),
          );
          return {
            lefts: new Set(figures.map((rect) => Math.round(rect.left))).size,
            stacked: figures.every(
              (rect, index) => index === 0 || rect.top >= figures[index - 1].bottom - 0.5,
            ),
          };
        }),
      );
      for (const group of groups) {
        expect(group.lefts, `${scope.label}: one column`).toBe(1);
        expect(group.stacked, `${scope.label}: figures stacked`).toBe(true);
      }
      const tops = await section.evaluate((root) =>
        Array.from(root.querySelectorAll<HTMLElement>('[role="group"]')).map(
          (group) => group.getBoundingClientRect().top,
        ),
      );
      expect(tops, `${scope.label}: reading order`).toEqual([...tops].sort((a, b) => a - b));

      const overflow = await section.evaluate((root) => {
        const bounds = root.getBoundingClientRect();
        const outside = Array.from(root.querySelectorAll('figure, figure *')).filter((element) => {
          const box = element.getBoundingClientRect();
          return box.right > bounds.right + 0.5 || box.left < bounds.left - 0.5;
        }).length;
        return { scroll: root.scrollWidth - root.clientWidth, outside };
      });
      expect(overflow, `${scope.label}: no horizontal overflow`).toEqual({ scroll: 0, outside: 0 });

      for (const testId of [
        'gallery-structure-card-static',
        'gallery-structure-card-interactive-default',
      ]) {
        const usable = await section
          .getByTestId(testId)
          .locator('article')
          .evaluate((article) => {
            const card = article.getBoundingClientRect();
            return Array.from(article.querySelectorAll('h3, p.text, p.meta, a')).every(
              (element) => {
                const box = element.getBoundingClientRect();
                return (
                  box.width > 0 && box.left >= card.left - 0.5 && box.right <= card.right + 0.5
                );
              },
            );
          });
        expect(usable, `${scope.label}: ${testId} content inside its Card`).toBe(true);
      }
      await expect(
        section.getByTestId('gallery-structure-card-interactive-default').getByRole('link'),
      ).toBeVisible();
    }
  });

  test('heading order, the panel h2, the h3 Card structure heading, the h3 organism titles, the absent DS-035 heading and non-heading group labels are explicit in every scope', async ({
    page,
  }) => {
    await openGallery(page, 'all');
    for (const scope of SCOPES) {
      const scoped = panel(page, scope);
      const headings = await scoped.evaluate((root) =>
        Array.from(root.querySelectorAll('h1,h2,h3,h4,h5,h6')).map((heading) => ({
          level: Number(heading.tagName.slice(1)),
          text: (heading.textContent ?? '').replace(/\s+/g, ' ').trim(),
        })),
      );
      expect(headings[0]?.level, `${scope.label}: panel begins with h2`).toBe(2);
      expect(headings[0]?.text, `${scope.label}: panel h2 text`).toBe(scope.label);
      for (let i = 1; i < headings.length; i++) {
        expect(
          headings[i].level - headings[i - 1].level,
          `${scope.label}: no skip before "${headings[i].text}"`,
        ).toBeLessThanOrEqual(1);
      }

      const section = structure(page, scope);
      await expect(section.getByRole('heading', { level: 3, name: /^Card structure/ })).toHaveCount(
        1,
      );
      await expect(section.getByRole('heading', { level: 3 })).toHaveCount(3);
      for (const testId of [
        'gallery-structure-card-static',
        'gallery-structure-card-interactive-default',
      ]) {
        const figure = section.getByTestId(testId);
        const title = (await figure.getByRole('heading', { level: 3 }).textContent())!.trim();
        await expect(
          figure.getByRole('heading', { level: 3, name: title, exact: true }),
        ).toHaveCount(1);
      }
      await expect(
        section.getByTestId('gallery-structure-card-loading').getByRole('heading'),
      ).toHaveCount(0);
      for (const name of ['Atoms', 'Molecules', 'Organism']) {
        await expect(section.getByRole('group', { name, exact: true })).toHaveCount(1);
        await expect(section.getByRole('heading', { name, exact: true })).toHaveCount(0);
      }
    }
  });
});
