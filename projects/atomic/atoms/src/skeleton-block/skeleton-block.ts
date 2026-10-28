import { Component } from '@angular/core';

/** Decorative pulsing placeholder. Size and shape belong to the arrangement that places it. */
@Component({
  selector: 'bui-skeleton-block',
  template: '',
  styleUrl: './skeleton-block.scss',
  host: { 'aria-hidden': 'true' },
})
export class SkeletonBlock {}
