/// <reference types="node" />
import { readFileSync } from 'node:fs';
import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ThemeSelection, normalizeThemeSelection, themeHostAttributes } from './brand.types';
import { ThemeScopeDirective } from './theme-scope.directive';
import { ThemeService } from './theme.service';
import { TOKEN_NAMES } from './token-contract';

const tokenFile = (name: string): string =>
  readFileSync(`projects/ui/src/lib/theme/tokens/${name}.css`, 'utf8');
const artanon = tokenFile('artanon');
const mentor = tokenFile('mentor');
const codecraft = tokenFile('codecraft');
const codecraftLight = tokenFile('codecraft-light');
const codecraftDark = tokenFile('codecraft-dark');

const DESIGN_SPEC_SCOPES: readonly ThemeSelection[] = [
  { brand: 'artanon' },
  { brand: 'mentor' },
  { brand: 'codecraft', mode: 'light' },
  { brand: 'codecraft', mode: 'dark' },
];

describe('normalizeThemeSelection', () => {
  it('accepts every approved selection', () => {
    for (const selection of DESIGN_SPEC_SCOPES) {
      expect(normalizeThemeSelection(selection)).toEqual(selection);
    }
  });

  it('drops a stray mode from brands that have none', () => {
    expect(normalizeThemeSelection({ brand: 'artanon', mode: 'dark' })).toEqual({
      brand: 'artanon',
    });
    expect(normalizeThemeSelection({ brand: 'mentor', mode: 'light' })).toEqual({
      brand: 'mentor',
    });
  });

  it.each([
    null,
    undefined,
    'artanon',
    {},
    { brand: 'unknown' },
    { brand: 'codecraft' },
    { brand: 'codecraft', mode: 'sepia' },
    { brand: 'codecraft-dark' },
  ])('rejects %j', (value) => {
    expect(() => normalizeThemeSelection(value)).toThrow(RangeError);
  });
});

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    service = TestBed.inject(ThemeService);
  });

  it('starts on ArtAnon Shop and updates its selection signal', () => {
    expect(service.selection()).toEqual({ brand: 'artanon' });
    service.select({ brand: 'codecraft', mode: 'dark' });
    expect(service.selection()).toEqual({ brand: 'codecraft', mode: 'dark' });
  });

  it('keeps the previous selection when given an invalid one', () => {
    service.select({ brand: 'mentor' });
    expect(() => service.select({ brand: 'codecraft' } as unknown as ThemeSelection)).toThrow(
      RangeError,
    );
    expect(service.selection()).toEqual({ brand: 'mentor' });
  });

  it('applies and replaces attributes on a supplied element, including the root', () => {
    const root = document.documentElement;
    service.apply(root, { brand: 'codecraft', mode: 'light' });
    expect(root.getAttribute('data-bui-brand')).toBe('codecraft');
    expect(root.getAttribute('data-bui-mode')).toBe('light');

    service.apply(root, { brand: 'mentor' });
    expect(root.getAttribute('data-bui-brand')).toBe('mentor');
    expect(root.hasAttribute('data-bui-mode')).toBe(false);

    service.clear(root);
    expect(root.hasAttribute('data-bui-brand')).toBe(false);
    expect(root.hasAttribute('data-bui-mode')).toBe(false);
  });

  it('applies its own selection by default', () => {
    const element = document.createElement('div');
    service.select({ brand: 'codecraft', mode: 'dark' });
    service.apply(element);
    expect(element.getAttribute('data-bui-brand')).toBe('codecraft');
    expect(element.getAttribute('data-bui-mode')).toBe('dark');
  });
});

@Component({
  imports: [ThemeScopeDirective],
  template: `
    @for (scope of scopes(); track $index) {
      <section [buiThemeScope]="scope"></section>
    }
  `,
})
class ScopesHost {
  readonly scopes = signal<readonly ThemeSelection[]>(DESIGN_SPEC_SCOPES);
}

describe('ThemeScopeDirective', () => {
  it('attaches four independent selections at the same time', async () => {
    const fixture = TestBed.createComponent(ScopesHost);
    await fixture.whenStable();
    const hosts = Array.from<HTMLElement>(fixture.nativeElement.querySelectorAll('section'));
    expect(
      hosts.map((host) => [host.dataset['buiBrand'], host.dataset['buiMode'] ?? null]),
    ).toEqual([
      ['artanon', null],
      ['mentor', null],
      ['codecraft', 'light'],
      ['codecraft', 'dark'],
    ]);
  });

  it('follows a changed selection and removes a stale mode', async () => {
    const fixture = TestBed.createComponent(ScopesHost);
    await fixture.whenStable();
    fixture.componentInstance.scopes.set([{ brand: 'codecraft', mode: 'dark' }]);
    await fixture.whenStable();
    fixture.componentInstance.scopes.set([{ brand: 'mentor' }]);
    await fixture.whenStable();
    const host: HTMLElement = fixture.nativeElement.querySelector('section');
    expect(host.dataset['buiBrand']).toBe('mentor');
    expect(host.hasAttribute('data-bui-mode')).toBe(false);
  });

  it('exposes the attribute rule used for hosts', () => {
    expect(themeHostAttributes({ brand: 'codecraft', mode: 'dark' })).toEqual({
      brand: 'codecraft',
      mode: 'dark',
    });
  });
});

/** Declarations from the first rule in `css`, keyed by custom property name. */
function declarations(css: string): Map<string, string> {
  const body = css.slice(css.indexOf('{') + 1, css.lastIndexOf('}'));
  const map = new Map<string, string>();
  for (const [, name, value] of body.matchAll(/(--bui-[a-z0-9-]+)\s*:\s*([^;]+);/g)) {
    map.set(name, value.trim());
  }
  return map;
}

describe('token contract (CSS is the only value source)', () => {
  const art = declarations(artanon);
  const mentorTokens = declarations(mentor);
  const shared = declarations(codecraft);
  const light = declarations(codecraftLight);
  const dark = declarations(codecraftDark);
  const colorNames = TOKEN_NAMES.filter((name) => name.startsWith('--bui-color-'));
  const resolved = (mode: Map<string, string>) => new Map([...shared, ...mode]);

  it('selects each file with the documented host attributes', () => {
    expect(artanon).toContain("[data-bui-brand='artanon']");
    expect(mentor).toContain("[data-bui-brand='mentor']");
    expect(codecraft).toContain("[data-bui-brand='codecraft']");
    expect(codecraftLight).toContain("[data-bui-brand='codecraft'][data-bui-mode='light']");
    expect(codecraftDark).toContain("[data-bui-brand='codecraft'][data-bui-mode='dark']");
  });

  it('gives ArtAnon and Mentor the identical, complete contract', () => {
    expect([...art.keys()].sort()).toEqual([...TOKEN_NAMES].sort());
    expect([...mentorTokens.keys()].sort()).toEqual([...TOKEN_NAMES].sort());
  });

  it('resolves the complete contract for both CodeCraft modes', () => {
    expect([...resolved(light).keys()].sort()).toEqual([...TOKEN_NAMES].sort());
    expect([...resolved(dark).keys()].sort()).toEqual([...TOKEN_NAMES].sort());
  });

  it('keeps CodeCraft non-color values in one shared place and colors in the modes', () => {
    expect([...shared.keys()].some((name) => colorNames.includes(name as never))).toBe(false);
    expect([...light.keys()].sort()).toEqual([...colorNames].sort());
    expect([...dark.keys()].sort()).toEqual([...colorNames].sort());
  });

  it('differs between CodeCraft modes only in color values', () => {
    const light2 = resolved(light);
    const dark2 = resolved(dark);
    const differing = TOKEN_NAMES.filter((name) => light2.get(name) !== dark2.get(name));
    expect(differing.every((name) => name.startsWith('--bui-color-'))).toBe(true);
    expect(differing.length).toBeGreaterThan(0);
  });
});
