import { Component, input, signal } from '@angular/core';
import { TextInput } from 'ui';

/** The working-sample input (DS-020): a real, editable input that echoes what is typed. */
@Component({
  selector: 'gal-input-sample',
  imports: [TextInput],
  template: `
    <bui-text-input
      [id]="fieldId()"
      [label]="label()"
      [placeholder]="placeholder()"
      [helperText]="helperText()"
      [(value)]="value"
    />
    <p class="echo" data-testid="gallery-input-echo">Typed: {{ value() || '(nothing yet)' }}</p>
  `,
  styles: `
    :host {
      display: block;
    }

    .echo {
      margin: var(--bui-space-2) 0 0;
      color: var(--bui-color-text-muted);
      font-size: var(--bui-size-small);
    }
  `,
})
export class InputSampleComponent {
  readonly fieldId = input.required<string>();
  readonly label = input.required<string>();
  readonly placeholder = input.required<string>();
  readonly helperText = input.required<string>();

  protected readonly value = signal('');
}
