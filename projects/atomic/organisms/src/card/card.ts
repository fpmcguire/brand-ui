import { Component, booleanAttribute, computed, input } from '@angular/core';
import { CodeWell } from '@brand-ui/atomic/atoms';
import { LoadingSkeleton, MediaArea } from '@brand-ui/atomic/molecules';

@Component({
  selector: 'bui-card',
  imports: [CodeWell, LoadingSkeleton, MediaArea],
  templateUrl: './card.html',
  styleUrl: './card.scss',
  // `title` is also a global HTML attribute; drop it so it never becomes a second tooltip.
  host: { '[attr.title]': 'null' },
})
export class Card {
  readonly title = input.required<string>();
  readonly description = input<string>();
  readonly meta = input<string>();
  readonly tag = input<string>();
  readonly mediaLabel = input<string>();
  /** With an `href` the title becomes the card's single native link; without one the card is static. */
  readonly href = input<string>();
  /** Optional generic code well. Supplied by the consumer; never inferred from the active brand. */
  readonly codeSample = input<string>();
  readonly loading = input(false, { transform: booleanAttribute });

  protected readonly interactive = computed(() => !this.loading() && !!this.href());
}
