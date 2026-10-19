import { Component, signal } from '@angular/core';
import { Button } from 'ui';

/**
 * A real form around a submit button and a loading submit button, with counters, so a reviewer
 * (and the browser tests) can see that loading suppresses activation and form submission.
 */
@Component({
  selector: 'gal-button-form-fixture',
  imports: [Button],
  template: `
    <form class="fixture" data-testid="gallery-button-form" (submit)="onSubmit($event)">
      <bui-button type="submit" (activated)="activated.set(activated() + 1)"
        >Submit sample</bui-button
      >
      <bui-button type="submit" [loading]="true" (activated)="activated.set(activated() + 1)"
        >Submitting sample</bui-button
      >
      <p class="counts">
        Activated <span data-testid="gallery-button-form-activated">{{ activated() }}</span> ·
        Submitted <span data-testid="gallery-button-form-submitted">{{ submitted() }}</span>
      </p>
    </form>
  `,
  styles: `
    .fixture {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--bui-space-3);
    }

    .counts {
      margin: 0;
      color: var(--bui-color-text-muted);
      font-size: var(--bui-size-small);
    }
  `,
})
export class ButtonFormFixtureComponent {
  protected readonly activated = signal(0);
  protected readonly submitted = signal(0);

  /** Counts the submission and keeps the review surface on the page. */
  protected onSubmit(event: Event): void {
    event.preventDefault();
    this.submitted.set(this.submitted() + 1);
  }
}
