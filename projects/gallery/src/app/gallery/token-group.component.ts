import { Component, ElementRef, afterRenderEffect, inject, input, signal } from '@angular/core';
import { ThemeSelection } from 'ui';
import { GalleryState } from './gallery-state';
import { TokenGroup, previewKind, readTokens } from './token-inspector';

/** Lists a token group with the value each token resolves to inside the surrounding scope. */
@Component({
  selector: 'gal-token-group',
  templateUrl: './token-group.component.html',
  styleUrl: './token-group.component.scss',
})
export class TokenGroupComponent {
  protected readonly state = inject(GalleryState);
  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly group = input.required<TokenGroup>();
  /** Re-reads the computed values when the scope's selection changes. */
  readonly scope = input.required<ThemeSelection>();

  protected readonly values = signal<Readonly<Record<string, string>>>({});
  protected readonly preview = previewKind;

  constructor() {
    afterRenderEffect({
      read: () => {
        this.scope();
        this.values.set(readTokens(this.element.nativeElement, this.group().names));
      },
    });
  }
}
