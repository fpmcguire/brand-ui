import { Component, booleanAttribute, computed, input, model } from '@angular/core';

@Component({
  selector: 'bui-text-input',
  templateUrl: './text-input.html',
  styleUrl: './text-input.scss',
  // `id` is also a global HTML attribute; the native input owns it, so the host never repeats it.
  host: { '[attr.id]': 'null' },
})
export class TextInput {
  /** Stable id of the native input. The label, helper text and error text ids derive from it. */
  readonly id = input.required<string>();
  readonly label = input.required<string>();
  readonly value = model('');
  readonly placeholder = input<string>();
  readonly helperText = input<string>();
  /** Replaces the helper text, marks the input invalid, and is described by icon plus text. */
  readonly errorText = input<string>();
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly name = input<string>();

  protected readonly labelId = computed(() => `${this.id()}-label`);
  protected readonly helperId = computed(() => `${this.id()}-helper`);
  protected readonly errorId = computed(() => `${this.id()}-error`);
  protected readonly invalid = computed(() => !!this.errorText());

  protected readonly describedBy = computed(() => {
    if (this.invalid()) return this.errorId();
    return this.helperText() ? this.helperId() : null;
  });

  protected onInput(event: Event): void {
    if (event.target instanceof HTMLInputElement) {
      this.value.set(event.target.value);
    }
  }
}
