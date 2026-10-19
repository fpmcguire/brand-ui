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

/**
 * Opens the gallery on one scope or on all four, and waits until it is settled: the contrast
 * evidence is calculated after render and the web fonts are loaded, so measurements are stable.
 */
export async function openGallery(page: Page, view: ScopeId | 'all'): Promise<void> {
  await page.goto('/');
  const switcher = page.getByTestId(`gallery-switch-${view}`);
  await switcher.click();
  await expect(switcher).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('section.panel')).toHaveCount(view === 'all' ? 4 : 1);
  await expect(page.getByTestId('gallery-contrast-ratio')).toHaveCount(
    USAGE_PAIRS.length * (view === 'all' ? 4 : 1),
  );
  await expect(page.getByTestId('gallery-contrast-ratio').filter({ hasText: 'n/a' })).toHaveCount(
    0,
  );
  await page.evaluate(() => document.fonts.ready);
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
