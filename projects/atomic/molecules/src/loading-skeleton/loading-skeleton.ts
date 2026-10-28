import { Component } from '@angular/core';
import { SkeletonBlock } from '@brand-ui/atomic/atoms';

/**
 * Decorative placeholder arrangement for a loading card. It carries no busy state and no text:
 * the owning organism announces loading.
 */
@Component({
  selector: 'bui-loading-skeleton',
  imports: [SkeletonBlock],
  template: `
    <bui-skeleton-block class="media skeleton" />
    <div class="body">
      <bui-skeleton-block class="skeleton skeleton-title" />
      <bui-skeleton-block class="skeleton skeleton-line" />
      <bui-skeleton-block class="skeleton skeleton-line skeleton-short" />
    </div>
  `,
  styleUrl: './loading-skeleton.scss',
  host: { 'aria-hidden': 'true' },
})
export class LoadingSkeleton {}
