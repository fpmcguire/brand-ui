import { Component, booleanAttribute, input, output } from '@angular/core';

export type ButtonVariant = 'primary' | 'secondary';
export type ButtonType = 'button' | 'submit' | 'reset';

@Component({
  selector: 'bui-button',
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class Button {
  readonly variant = input<ButtonVariant>('primary');
  readonly type = input<ButtonType>('button');
  /** Natively disabled, unless `loading` is also set: loading takes precedence and stays focusable. */
  readonly disabled = input(false, { transform: booleanAttribute });
  /** Keeps the label and focus, announces `aria-busy`, and suppresses every kind of activation. */
  readonly loading = input(false, { transform: booleanAttribute });

  readonly activated = output<void>();

  protected onClick(event: Event): void {
    if (this.loading()) {
      // Stops form submission and any click listener on an ancestor, e.g. the host element.
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    this.activated.emit();
  }
}
