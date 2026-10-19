/**
 * Test support only. jsdom does not implement `<dialog>` methods, so unit tests install minimal
 * ones to exercise the component's coordination. Real modal behaviour (top layer, focus
 * containment, Esc, backdrop) is proven in Chromium by the Playwright specifications.
 */
export function installDialogShim(): void {
  const proto = HTMLDialogElement.prototype;
  if (typeof proto.showModal === 'function') {
    return;
  }
  proto.showModal = function showModal(this: HTMLDialogElement): void {
    if (this.hasAttribute('open')) {
      throw new DOMException('Already open', 'InvalidStateError');
    }
    this.setAttribute('open', '');
  };
  proto.close = function close(this: HTMLDialogElement): void {
    if (this.hasAttribute('open')) {
      this.removeAttribute('open');
      this.dispatchEvent(new Event('close'));
    }
  };
}
