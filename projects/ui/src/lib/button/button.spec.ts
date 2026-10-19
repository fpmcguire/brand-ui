import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Button, ButtonType, ButtonVariant } from './button';

@Component({
  imports: [Button],
  template: `
    <form (submit)="submitted.set(submitted() + 1); $event.preventDefault()">
      <bui-button
        [variant]="variant()"
        [type]="type()"
        [disabled]="disabled()"
        [loading]="loading()"
        (activated)="activations.set(activations() + 1)"
        (click)="hostClicks.set(hostClicks() + 1)"
        >Save changes</bui-button
      >
    </form>
  `,
})
class Host {
  readonly variant = signal<ButtonVariant>('primary');
  readonly type = signal<ButtonType>('button');
  readonly disabled = signal(false);
  readonly loading = signal(false);
  readonly activations = signal(0);
  readonly hostClicks = signal(0);
  readonly submitted = signal(0);
}

async function setup() {
  const fixture = TestBed.createComponent(Host);
  await fixture.whenStable();
  const button = (): HTMLButtonElement => fixture.nativeElement.querySelector('button');
  const update = async (change: (host: Host) => void) => {
    change(fixture.componentInstance);
    await fixture.whenStable();
  };
  return { fixture, host: fixture.componentInstance, button, update };
}

describe('Button', () => {
  it('renders a native button named by its projected label', async () => {
    const { button } = await setup();
    expect(button().tagName).toBe('BUTTON');
    expect(button().textContent?.trim()).toBe('Save changes');
    expect(button().getAttribute('type')).toBe('button');
    expect(button().getAttribute('data-variant')).toBe('primary');
    expect(button().hasAttribute('aria-busy')).toBe(false);
  });

  it('reflects the variant input', async () => {
    const { button, update } = await setup();
    await update((host) => host.variant.set('secondary'));
    expect(button().getAttribute('data-variant')).toBe('secondary');
  });

  it('emits activated once per click', async () => {
    const { button, host } = await setup();
    button().click();
    expect(host.activations()).toBe(1);
    expect(host.hostClicks()).toBe(1);
  });

  it('submits the enclosing form only when type is submit', async () => {
    const { button, host, update } = await setup();
    button().click();
    expect(host.submitted()).toBe(0);

    await update((h) => h.type.set('submit'));
    expect(button().getAttribute('type')).toBe('submit');
    button().click();
    expect(host.submitted()).toBe(1);
  });

  it('is natively disabled and does not activate', async () => {
    const { button, host, update } = await setup();
    await update((h) => h.disabled.set(true));
    expect(button().disabled).toBe(true);
    button().click();
    expect(host.activations()).toBe(0);
  });

  describe('disabled=true, loading=false', () => {
    it('is natively disabled, unfocusable, not busy, and suppresses activation and submission', async () => {
      const { button, host, update } = await setup();
      await update((h) => {
        h.type.set('submit');
        h.disabled.set(true);
        h.loading.set(false);
      });
      expect(button().disabled).toBe(true);
      expect(button().hasAttribute('aria-disabled')).toBe(false);
      expect(button().hasAttribute('aria-busy')).toBe(false);
      button().focus();
      expect(document.activeElement).not.toBe(button());
      button().click();
      expect(host.activations()).toBe(0);
      expect(host.submitted()).toBe(0);
    });
  });

  describe('disabled=true, loading=true', () => {
    it('stays enabled and focusable, keeps its label, and announces aria-busy', async () => {
      const { fixture, button, update } = await setup();
      await update((h) => {
        h.disabled.set(true);
        h.loading.set(true);
      });
      expect(button().disabled).toBe(false);
      expect(button().hasAttribute('aria-disabled')).toBe(false);
      expect(button().getAttribute('aria-busy')).toBe('true');
      expect(button().textContent?.trim()).toBe('Save changes');
      expect(fixture.nativeElement.querySelector('.spinner')?.getAttribute('aria-hidden')).toBe(
        'true',
      );
      button().focus();
      expect(document.activeElement).toBe(button());
    });

    it('suppresses activated, submission, host click and keyboard-derived clicks', async () => {
      const { button, host, update } = await setup();
      await update((h) => {
        h.type.set('submit');
        h.disabled.set(true);
        h.loading.set(true);
      });
      button().focus();
      button().click();
      button().dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      button().dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
      expect(host.activations()).toBe(0);
      expect(host.submitted()).toBe(0);
      expect(host.hostClicks()).toBe(0);
    });

    it('becomes natively disabled again once loading ends', async () => {
      const { button, update } = await setup();
      await update((h) => {
        h.disabled.set(true);
        h.loading.set(true);
      });
      await update((h) => h.loading.set(false));
      expect(button().disabled).toBe(true);
      expect(button().hasAttribute('aria-busy')).toBe(false);
    });
  });

  describe('loading', () => {
    it('keeps its label, stays enabled and focusable, and announces aria-busy', async () => {
      const { fixture, button, update } = await setup();
      await update((h) => h.loading.set(true));
      expect(button().getAttribute('aria-busy')).toBe('true');
      expect(button().disabled).toBe(false);
      expect(button().textContent?.trim()).toBe('Save changes');
      expect(fixture.nativeElement.querySelector('.spinner')?.getAttribute('aria-hidden')).toBe(
        'true',
      );

      button().focus();
      expect(document.activeElement).toBe(button());
    });

    it('suppresses click, form submission and ancestor click listeners', async () => {
      const { button, host, update } = await setup();
      await update((h) => {
        h.type.set('submit');
        h.loading.set(true);
      });
      button().click();
      expect(host.activations()).toBe(0);
      expect(host.submitted()).toBe(0);
      expect(host.hostClicks()).toBe(0);
    });

    it('suppresses keyboard activation, which the browser turns into a click', async () => {
      const { button, host, update } = await setup();
      await update((h) => h.loading.set(true));
      button().focus();
      // A native button turns Enter/Space into a click event; jsdom does not, so dispatch it.
      button().dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      button().dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
      expect(host.activations()).toBe(0);
    });

    it('activates again once loading ends', async () => {
      const { button, host, update } = await setup();
      await update((h) => h.loading.set(true));
      button().click();
      await update((h) => h.loading.set(false));
      button().click();
      expect(host.activations()).toBe(1);
      expect(button().hasAttribute('aria-busy')).toBe(false);
    });
  });
});
