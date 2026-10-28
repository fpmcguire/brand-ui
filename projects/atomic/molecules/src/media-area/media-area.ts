import { Component, input } from '@angular/core';
import { Tag } from '@brand-ui/atomic/atoms';

/** The 4:3 media surface: an optional placeholder label and an optional accent tag. */
@Component({
  selector: 'bui-media-area',
  imports: [Tag],
  template: `
    @if (label(); as label) {
      <span class="media-label">{{ label }}</span>
    }
    @if (tag(); as tag) {
      <bui-tag>{{ tag }}</bui-tag>
    }
  `,
  styleUrl: './media-area.scss',
})
export class MediaArea {
  readonly label = input<string>();
  readonly tag = input<string>();
}
