import { Injectable, signal } from '@angular/core';
import { ThemeSelection, normalizeThemeSelection, themeHostAttributes } from './brand.types';

/**
 * Owns the application-wide theme selection and the rule for attaching a selection to an element.
 * It never holds token values: the attributes it writes make the CSS in `tokens/` resolve.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly current = signal<ThemeSelection>({ brand: 'artanon' });

  /** The application-wide selection. Scopes that bind their own selection ignore it. */
  readonly selection = this.current.asReadonly();

  /** Throws a `RangeError` for an invalid selection and leaves the current one unchanged. */
  select(selection: ThemeSelection): void {
    this.current.set(normalizeThemeSelection(selection));
  }

  /** Writes the brand (and CodeCraft mode) attributes on `element`, replacing earlier ones. */
  apply(element: Element, selection: ThemeSelection = this.current()): void {
    const { brand, mode } = themeHostAttributes(selection);
    element.setAttribute('data-bui-brand', brand);
    if (mode === null) {
      element.removeAttribute('data-bui-mode');
    } else {
      element.setAttribute('data-bui-mode', mode);
    }
  }

  /** Removes the theme attributes from `element`. */
  clear(element: Element): void {
    element.removeAttribute('data-bui-brand');
    element.removeAttribute('data-bui-mode');
  }
}
