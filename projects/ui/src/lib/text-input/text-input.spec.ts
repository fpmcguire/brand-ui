import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TextInput } from './text-input';

@Component({
  imports: [TextInput],
  template: `
    <bui-text-input
      id="email"
      label="Email address"
      name="email"
      [placeholder]="placeholder()"
      [helperText]="helperText()"
      [errorText]="errorText()"
      [disabled]="disabled()"
      [(value)]="value"
    />
  `,
})
class Host {
  readonly value = signal('');
  readonly placeholder = signal<string | undefined>('name@example.com');
  readonly helperText = signal<string | undefined>('Used only for this sample.');
  readonly errorText = signal<string | undefined>(undefined);
  readonly disabled = signal(false);
}

async function setup() {
  const fixture = TestBed.createComponent(Host);
  await fixture.whenStable();
  const root: HTMLElement = fixture.nativeElement;
  const input = (): HTMLInputElement => root.querySelector('input')!;
  const message = (): HTMLElement | null => root.querySelector('.message');
  const update = async (change: (host: Host) => void) => {
    change(fixture.componentInstance);
    await fixture.whenStable();
  };
  const type = async (text: string) => {
    input().value = text;
    input().dispatchEvent(new Event('input', { bubbles: true }));
    await fixture.whenStable();
  };
  return { fixture, root, host: fixture.componentInstance, input, message, update, type };
}

describe('TextInput', () => {
  it('renders a native text input named by its visible label', async () => {
    const { root, input } = await setup();
    expect(input().tagName).toBe('INPUT');
    expect(input().type).toBe('text');
    expect(input().id).toBe('email');
    expect(input().labels).toHaveLength(1);
    expect(input().labels?.[0].textContent?.trim()).toBe('Email address');
    expect(root.querySelector('label')?.getAttribute('for')).toBe('email');
  });

  it('keeps the id on the native input only, so the page never has a duplicate', async () => {
    const { root } = await setup();
    expect(root.querySelector('bui-text-input')?.hasAttribute('id')).toBe(false);
    expect(root.querySelectorAll('#email')).toHaveLength(1);
  });

  it('passes name and placeholder to the native input, and omits them when unset', async () => {
    const { input, update } = await setup();
    expect(input().getAttribute('name')).toBe('email');
    expect(input().getAttribute('placeholder')).toBe('name@example.com');
    await update((h) => h.placeholder.set(undefined));
    expect(input().hasAttribute('placeholder')).toBe(false);
  });

  it('describes the input by its helper text and is not invalid', async () => {
    const { input, message } = await setup();
    expect(message()?.textContent?.trim()).toBe('Used only for this sample.');
    expect(input().getAttribute('aria-describedby')).toBe(message()?.id);
    expect(message()?.id).toBe('email-helper');
    expect(input().hasAttribute('aria-invalid')).toBe(false);
  });

  it('has no description when there is neither helper nor error text', async () => {
    const { input, message, update } = await setup();
    await update((h) => h.helperText.set(undefined));
    expect(message()).toBeNull();
    expect(input().hasAttribute('aria-describedby')).toBe(false);
  });

  describe('error', () => {
    it('replaces the helper text, sets aria-invalid, and is described by the error', async () => {
      const { root, input, message, update } = await setup();
      await update((h) => h.errorText.set('Enter an email address.'));
      expect(root.querySelectorAll('.message')).toHaveLength(1);
      expect(root.querySelector('.helper')).toBeNull();
      expect(message()?.textContent?.trim()).toBe('Enter an email address.');
      expect(input().getAttribute('aria-invalid')).toBe('true');
      expect(input().getAttribute('aria-describedby')).toBe('email-error');
      expect(message()?.id).toBe('email-error');
    });

    it('shows an icon as well as text, hides the icon from assistive technology, and sets no role', async () => {
      const { message, update } = await setup();
      await update((h) => h.errorText.set('Enter an email address.'));
      const icon = message()?.querySelector('svg');
      expect(icon).not.toBeNull();
      expect(icon?.getAttribute('aria-hidden')).toBe('true');
      expect(message()?.textContent?.trim()).toBe('Enter an email address.');
      expect(message()?.hasAttribute('role')).toBe(false);
    });

    it('restores the helper text and clears aria-invalid once the error is gone', async () => {
      const { input, message, update } = await setup();
      await update((h) => h.errorText.set('Enter an email address.'));
      await update((h) => h.errorText.set(undefined));
      expect(message()?.textContent?.trim()).toBe('Used only for this sample.');
      expect(input().hasAttribute('aria-invalid')).toBe(false);
      expect(input().getAttribute('aria-describedby')).toBe('email-helper');
    });

    it('describes the input by the error alone when there is no helper text', async () => {
      const { input, update } = await setup();
      await update((h) => {
        h.helperText.set(undefined);
        h.errorText.set('Enter an email address.');
      });
      expect(input().getAttribute('aria-describedby')).toBe('email-error');
    });
  });

  describe('value model', () => {
    it('writes typing back to the bound signal', async () => {
      const { host, type } = await setup();
      await type('person@example.com');
      expect(host.value()).toBe('person@example.com');
    });

    it('shows a value set from outside', async () => {
      const { input, update } = await setup();
      await update((h) => h.value.set('set@example.com'));
      expect(input().value).toBe('set@example.com');
    });

    it('starts empty', async () => {
      const { input, host } = await setup();
      expect(input().value).toBe('');
      expect(host.value()).toBe('');
    });
  });

  describe('disabled', () => {
    it('is natively disabled and unfocusable', async () => {
      const { input, update } = await setup();
      await update((h) => h.disabled.set(true));
      expect(input().disabled).toBe(true);
      expect(input().hasAttribute('aria-disabled')).toBe(false);
      input().focus();
      expect(document.activeElement).not.toBe(input());
    });

    it('stays described by its helper text', async () => {
      const { input, update } = await setup();
      await update((h) => h.disabled.set(true));
      expect(input().getAttribute('aria-describedby')).toBe('email-helper');
    });

    it('is enabled and focusable otherwise', async () => {
      const { input } = await setup();
      expect(input().disabled).toBe(false);
      input().focus();
      expect(document.activeElement).toBe(input());
    });
  });
});
