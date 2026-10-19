import { Locator, Page, expect } from '@playwright/test';
import { USAGE_PAIRS } from '../../projects/gallery/src/app/gallery/specimens/usage-pairs';
import { Rgb, parseRgb } from './contrast';

export type ScopeId = 'artanon' | 'mentor' | 'codecraft-light' | 'codecraft-dark';

export interface Scope {
  readonly id: ScopeId;
  readonly label: string;
  readonly brand: 'artanon' | 'mentor' | 'codecraft';
  readonly mode: 'light' | 'dark' | null;
}

/** Three brands across four scopes: CodeCraft Light and Dark are modes of one brand. */
export const SCOPES: readonly Scope[] = [
  { id: 'artanon', label: 'ArtAnon Shop', brand: 'artanon', mode: null },
  { id: 'mentor', label: 'IT English Mentor', brand: 'mentor', mode: null },
  { id: 'codecraft-light', label: 'CodeCraft Academy Light', brand: 'codecraft', mode: 'light' },
  { id: 'codecraft-dark', label: 'CodeCraft Academy Dark', brand: 'codecraft', mode: 'dark' },
];

/** The gallery-owned key that marks the About panel as seen. Stated here independently of the app. */
export const ABOUT_SEEN_KEY = 'brand-ui:gallery:about-seen:v1';

/** Marks the About panel as seen before the page loads, so it cannot cover the gallery. */
export async function seedAboutSeen(page: Page): Promise<void> {
  await page.addInitScript((key) => {
    try {
      window.localStorage.setItem(key, '1');
    } catch {
      // Storage unavailable: nothing to seed.
    }
  }, ABOUT_SEEN_KEY);
}

/** The top-bar About button, and the dialog it opens. */
export const aboutTrigger = (page: Page): Locator =>
  page.getByRole('button', { name: 'About', exact: true });
export const aboutDialog = (page: Page): Locator =>
  page.getByRole('dialog', { name: 'About brand-ui' });

/**
 * Waits until the gallery is settled: the contrast evidence is calculated after render and the web
 * fonts are loaded, so measurements are stable, and anything that opens at load has opened.
 */
export async function galleryReady(page: Page, panels: 1 | 4): Promise<void> {
  await expect(page.locator('section.panel')).toHaveCount(panels);
  await expect(page.getByTestId('gallery-contrast-ratio')).toHaveCount(USAGE_PAIRS.length * panels);
  await expect(page.getByTestId('gallery-contrast-ratio').filter({ hasText: 'n/a' })).toHaveCount(
    0,
  );
  await page.evaluate(() => document.fonts.ready);
}

/**
 * Opens the gallery on one scope or on all four, and waits until it is settled. The About panel is
 * seeded as seen, so it does not cover the gallery; pass `aboutSeen: false` for a first visit.
 */
export async function openGallery(
  page: Page,
  view: ScopeId | 'all',
  options: { readonly aboutSeen?: boolean } = {},
): Promise<void> {
  if (options.aboutSeen ?? true) {
    await seedAboutSeen(page);
  }
  await page.goto('/');
  const switcher = page.getByTestId(`gallery-switch-${view}`);
  await switcher.click();
  await expect(switcher).toHaveAttribute('aria-pressed', 'true');
  await galleryReady(page, view === 'all' ? 4 : 1);
}

export function panel(page: Page, scope: Scope | ScopeId): Locator {
  return page.getByTestId(`gallery-panel-${typeof scope === 'string' ? scope : scope.id}`);
}

/** Resolves a colour token inside `scope` to the colour the browser renders for it. */
export async function resolveColor(scope: Locator, token: string): Promise<Rgb> {
  const css = await scope.evaluate((element, name) => {
    const probe = document.createElement('span');
    probe.style.color = `var(${name})`;
    element.appendChild(probe);
    const resolved = getComputedStyle(probe).color;
    probe.remove();
    return resolved;
  }, token);
  return parseRgb(css);
}

/** Computed values of CSS properties (kebab-case names) for the element. */
export function computed(
  locator: Locator,
  properties: readonly string[],
): Promise<Record<string, string>> {
  return locator.evaluate((element, names) => {
    const style = getComputedStyle(element);
    return Object.fromEntries(names.map((name) => [name, style.getPropertyValue(name)]));
  }, properties);
}

/** The resolved value of a custom property in the element's scope. */
export function tokenValue(scope: Locator, token: string): Promise<string> {
  return scope.evaluate(
    (element, name) => getComputedStyle(element).getPropertyValue(name).trim(),
    token,
  );
}

/** Tag and attribute-name structure of an element, ignoring text, attribute values and ids. */
export function skeleton(locator: Locator): Promise<string> {
  return locator.evaluate((root) => {
    const describe = (element: Element): string => {
      const names = element
        .getAttributeNames()
        .filter(
          (name) =>
            !/^(_ng|ng-|data-testid$|id$|for$|aria-labelledby$|aria-describedby$)/.test(name),
        )
        .sort()
        .join(',');
      const children = Array.from(element.children).map(describe).join('');
      return `<${element.tagName.toLowerCase()} ${names}>${children}</>`;
    };
    return describe(root);
  });
}
