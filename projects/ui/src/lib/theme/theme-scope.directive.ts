import { Directive, computed, input } from '@angular/core';
import { ThemeSelection, themeHostAttributes } from './brand.types';

/**
 * Attaches one theme selection to its own host, so several themed subtrees can render side by side.
 * Components inside inherit the semantic tokens; nothing else about them changes.
 */
@Directive({
  selector: '[buiThemeScope]',
  host: {
    '[attr.data-bui-brand]': 'attributes().brand',
    '[attr.data-bui-mode]': 'attributes().mode',
  },
})
export class ThemeScopeDirective {
  readonly buiThemeScope = input.required<ThemeSelection>();

  protected readonly attributes = computed(() => themeHostAttributes(this.buiThemeScope()));
}
