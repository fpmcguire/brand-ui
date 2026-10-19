import { Component, ElementRef, afterRenderEffect, inject, input, signal } from '@angular/core';
import { ThemeSelection } from 'ui';
import { GalleryState } from '../gallery-state';
import { PairResult, evaluatePairs } from './contrast';
import { USAGE_PAIRS } from './usage-pairs';

/** DS-060: contrast of every usage pair, calculated from the colours this scope resolves to. */
@Component({
  selector: 'gal-contrast-evidence',
  templateUrl: './contrast-evidence.component.html',
  styleUrl: './contrast-evidence.component.scss',
})
export class ContrastEvidenceComponent {
  protected readonly state = inject(GalleryState);
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Re-reads the computed values when the scope's selection changes. */
  readonly scope = input.required<ThemeSelection>();

  protected readonly results = signal<readonly PairResult[]>([]);

  constructor() {
    afterRenderEffect({
      read: () => {
        this.scope();
        this.results.set(evaluatePairs(this.element.nativeElement, USAGE_PAIRS));
      },
    });
  }

  protected format(ratio: number | null): string {
    return ratio === null ? 'n/a' : `${ratio.toFixed(2)}:1`;
  }
}
