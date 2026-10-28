import { Component, reflectComponentType } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Card } from './card';

@Component({
  imports: [Card],
  template: `<bui-card title="T" loading /><bui-card title="T" loading="false" /><bui-card
      title="T"
    />`,
})
class Host {}

describe('Card contract', () => {
  const mirror = reflectComponentType(Card)!;
  it('keeps the selector', () => {
    expect(mirror.selector).toBe('bui-card');
  });

  it('keeps the input names and requiredness', () => {
    expect(mirror.inputs.map((i) => i.propName).sort()).toEqual(
      ['codeSample', 'description', 'href', 'loading', 'mediaLabel', 'meta', 'tag', 'title'].sort(),
    );
    // The mirror does not expose requiredness, so read each unset input from a bare instance.
    const card = TestBed.createComponent(Card).componentInstance;
    expect(() => card.title()).toThrow(/NG0950/);
    expect(card.description()).toBeUndefined();
    expect(card.meta()).toBeUndefined();
    expect(card.tag()).toBeUndefined();
    expect(card.mediaLabel()).toBeUndefined();
    expect(card.href()).toBeUndefined();
    expect(card.codeSample()).toBeUndefined();
    expect(card.loading()).toBe(false);
    expect(mirror.inputs.every((i) => i.isSignal)).toBe(true);
  });

  it('keeps the boolean attribute transform on loading', async () => {
    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    const busy = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('article')).map(
      (article) => article.hasAttribute('aria-busy'),
    );
    expect(busy).toEqual([true, false, false]);
  });
});
