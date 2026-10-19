import { Component, input } from '@angular/core';

export interface NavigationItem {
  /** Stable identity of the item; used to track it across renders. */
  readonly id: string;
  readonly label: string;
  readonly href: string;
  /** Marks the item for the current page. Ignored when the item is disabled. */
  readonly current?: boolean;
  /** Renders plain, non-focusable text instead of a link. */
  readonly disabled?: boolean;
  /** Supplemental tooltip only. The accessible name is always the full label. */
  readonly title?: string;
}

@Component({
  selector: 'bui-navigation',
  templateUrl: './navigation.html',
  styleUrl: './navigation.scss',
})
export class Navigation {
  /** Accessible name of the `nav` landmark. */
  readonly label = input.required<string>();
  readonly wordmark = input.required<string>();
  readonly items = input.required<readonly NavigationItem[]>();
}
