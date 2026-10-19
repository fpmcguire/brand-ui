import {
  Component,
  ElementRef,
  afterNextRender,
  afterRenderEffect,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { Button, ThemeScopeDirective, ThemeSelection } from 'ui';
import { AboutFirstVisit } from './about-first-visit';

/** True when a pointer position lies outside the rectangle, i.e. on the backdrop. */
export function isOutsideRect(
  rect: Pick<DOMRect, 'left' | 'right' | 'top' | 'bottom'>,
  x: number,
  y: number,
): boolean {
  return x < rect.left || x > rect.right || y < rect.top || y > rect.bottom;
}

/**
 * The gallery-owned About panel: a native modal dialog (D-11). It opens by itself on a first visit,
 * `show()` opens it again, and every way of closing it ends in `close()`, which emits `closed`.
 * The dialog is only in the DOM while it is open.
 */
@Component({
  selector: 'gal-about-panel',
  imports: [Button, ThemeScopeDirective],
  templateUrl: './about-panel.html',
  styleUrl: './about-panel.scss',
})
export class AboutPanel {
  /** The theme the dialog follows; it paints through tokens only. */
  readonly selection = input.required<ThemeSelection>();

  /** Emitted after the dialog has closed, whichever way it was dismissed. */
  readonly closed = output<void>();

  protected readonly rendered = signal(false);

  private readonly dialog = viewChild<ElementRef<HTMLDialogElement>>('dialog');
  private readonly closeButton = viewChild('closeButton', { read: ElementRef<HTMLElement> });
  private readonly firstVisit = new AboutFirstVisit();
  private pressedOutside = false;

  constructor() {
    afterNextRender(() => {
      if (this.firstVisit.claimAutoOpen()) {
        this.show();
      }
    });

    // Opens the dialog once its element exists, then puts focus on Close.
    afterRenderEffect(() => {
      const dialog = this.dialog()?.nativeElement;
      if (dialog && !dialog.open) {
        dialog.showModal();
        this.closeButton()?.nativeElement.querySelector('button')?.focus();
      }
    });
  }

  show(): void {
    this.rendered.set(true);
  }

  /** The one close operation: Close button, Esc and backdrop all end here. */
  protected close(): void {
    if (!this.rendered()) {
      return;
    }
    this.dialog()?.nativeElement.close();
    this.rendered.set(false);
    this.closed.emit();
  }

  /** Esc: take over from the native close so that it follows the same path. */
  protected onCancel(event: Event): void {
    event.preventDefault();
    this.close();
  }

  protected onPointerDown(event: MouseEvent): void {
    this.pressedOutside = this.isOutside(event);
  }

  /**
   * A backdrop click needs the press and the click both outside the rectangle, and the dialog
   * itself as the target. Clicks on content or padding, programmatic clicks, and a drag that
   * starts inside do not dismiss it.
   */
  protected onClick(event: MouseEvent): void {
    const dismiss =
      event.target === this.dialog()?.nativeElement && this.pressedOutside && this.isOutside(event);
    this.pressedOutside = false;
    if (dismiss) {
      this.close();
    }
  }

  private isOutside(event: MouseEvent): boolean {
    const dialog = this.dialog()?.nativeElement;
    return dialog
      ? isOutsideRect(dialog.getBoundingClientRect(), event.clientX, event.clientY)
      : false;
  }
}
