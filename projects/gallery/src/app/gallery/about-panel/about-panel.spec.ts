import { TestBed } from '@angular/core/testing';
import { ThemeSelection } from 'ui';
import { ABOUT_SEEN_STORAGE_KEY } from './about-first-visit';
import { AboutPanel, isOutsideRect } from './about-panel';
import { installDialogShim } from './dialog-shim';

const RECT = { left: 100, right: 300, top: 100, bottom: 300 };

async function setup(options: { seen: boolean; selection?: ThemeSelection } = { seen: true }) {
  localStorage.clear();
  if (options.seen) {
    localStorage.setItem(ABOUT_SEEN_STORAGE_KEY, '1');
  }
  const fixture = TestBed.createComponent(AboutPanel);
  fixture.componentRef.setInput('selection', options.selection ?? { brand: 'artanon' });
  const closed = vi.fn();
  fixture.componentInstance.closed.subscribe(closed);
  await fixture.whenStable();
  const root: HTMLElement = fixture.nativeElement;
  const dialog = () => root.querySelector<HTMLDialogElement>('dialog');
  const settle = () => fixture.whenStable();
  const pointer = (type: string, target: Element, x: number, y: number) =>
    target.dispatchEvent(new MouseEvent(type, { bubbles: true, clientX: x, clientY: y }));
  const stubRect = () =>
    vi.spyOn(dialog()!, 'getBoundingClientRect').mockReturnValue(RECT as DOMRect);
  return { fixture, root, closed, dialog, settle, pointer, stubRect };
}

describe('isOutsideRect', () => {
  it('is false on and inside the edges and true beyond any of them', () => {
    expect(isOutsideRect(RECT, 100, 100)).toBe(false);
    expect(isOutsideRect(RECT, 300, 300)).toBe(false);
    expect(isOutsideRect(RECT, 200, 200)).toBe(false);
    expect(isOutsideRect(RECT, 99, 200)).toBe(true);
    expect(isOutsideRect(RECT, 301, 200)).toBe(true);
    expect(isOutsideRect(RECT, 200, 99)).toBe(true);
    expect(isOutsideRect(RECT, 200, 301)).toBe(true);
  });
});

describe('AboutPanel', () => {
  beforeAll(() => installDialogShim());

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  describe('opening', () => {
    it('opens by itself on a first visit and records the seen value at once', async () => {
      const { dialog } = await setup({ seen: false });
      expect(dialog()?.hasAttribute('open')).toBe(true);
      expect(localStorage.getItem(ABOUT_SEEN_STORAGE_KEY)).not.toBeNull();
    });

    it('stays closed, and absent from the DOM, when the key is present', async () => {
      const { dialog } = await setup({ seen: true });
      expect(dialog()).toBeNull();
    });

    it('opens modally on show() and does nothing the second time', async () => {
      const { fixture, dialog, settle } = await setup();
      const showModal = vi.spyOn(HTMLDialogElement.prototype, 'showModal');
      fixture.componentInstance.show();
      await settle();
      fixture.componentInstance.show();
      await settle();
      expect(dialog()?.hasAttribute('open')).toBe(true);
      expect(showModal).toHaveBeenCalledTimes(1);
    });

    it('moves focus to the Close button', async () => {
      const { fixture, root, settle } = await setup();
      fixture.componentInstance.show();
      await settle();
      const close = root.querySelector<HTMLButtonElement>('bui-button button')!;
      expect(close.textContent?.trim()).toBe('Close');
      expect(document.activeElement).toBe(close);
    });

    it('is named by its visible heading', async () => {
      const { fixture, dialog, settle } = await setup();
      fixture.componentInstance.show();
      await settle();
      const labelledBy = dialog()!.getAttribute('aria-labelledby')!;
      const heading = dialog()!.querySelector(`#${labelledBy}`);
      expect(heading?.tagName).toBe('H2');
      expect(heading?.textContent?.trim()).toBe('About brand-ui');
    });

    it('follows the theme selection it is given, through a theme scope only', async () => {
      const { fixture, dialog, settle } = await setup({
        seen: true,
        selection: { brand: 'codecraft', mode: 'dark' },
      });
      fixture.componentInstance.show();
      await settle();
      expect(dialog()?.dataset['buiBrand']).toBe('codecraft');
      expect(dialog()?.dataset['buiMode']).toBe('dark');

      fixture.componentRef.setInput('selection', { brand: 'mentor' });
      await settle();
      expect(dialog()?.dataset['buiBrand']).toBe('mentor');
      expect(dialog()?.hasAttribute('data-bui-mode')).toBe(false);
    });
  });

  describe('closing', () => {
    async function opened() {
      const context = await setup();
      context.fixture.componentInstance.show();
      await context.settle();
      return context;
    }

    it('closes from the Close button, once', async () => {
      const { root, dialog, closed, settle } = await opened();
      root.querySelector<HTMLButtonElement>('bui-button button')!.click();
      await settle();
      expect(closed).toHaveBeenCalledTimes(1);
      expect(dialog()).toBeNull();
    });

    it('closes from the native cancel event, once, and takes over the default action', async () => {
      const { dialog, closed, settle } = await opened();
      const cancel = new Event('cancel', { cancelable: true });
      dialog()!.dispatchEvent(cancel);
      await settle();
      expect(cancel.defaultPrevented).toBe(true);
      expect(closed).toHaveBeenCalledTimes(1);
      expect(dialog()).toBeNull();
    });

    it('closes when the press and the click are both on the backdrop', async () => {
      const { dialog, closed, settle, pointer, stubRect } = await opened();
      stubRect();
      pointer('pointerdown', dialog()!, 10, 10);
      pointer('click', dialog()!, 10, 10);
      await settle();
      expect(closed).toHaveBeenCalledTimes(1);
      expect(dialog()).toBeNull();
    });

    it('does not close from a click on the content', async () => {
      const { dialog, closed, settle, pointer, stubRect } = await opened();
      stubRect();
      const heading = dialog()!.querySelector('h2')!;
      pointer('pointerdown', heading, 150, 150);
      pointer('click', heading, 150, 150);
      await settle();
      expect(closed).not.toHaveBeenCalled();
      expect(dialog()).not.toBeNull();
    });

    it('does not close from a click on the dialog padding, inside its rectangle', async () => {
      const { dialog, closed, settle, pointer, stubRect } = await opened();
      stubRect();
      pointer('pointerdown', dialog()!, 101, 101);
      pointer('click', dialog()!, 101, 101);
      await settle();
      expect(closed).not.toHaveBeenCalled();
    });

    it('does not close from a click that had no pointer press, or a drag that began inside', async () => {
      const { dialog, closed, settle, pointer, stubRect } = await opened();
      stubRect();
      pointer('click', dialog()!, 10, 10);
      pointer('pointerdown', dialog()!, 200, 200);
      pointer('click', dialog()!, 10, 10);
      await settle();
      expect(closed).not.toHaveBeenCalled();
      expect(dialog()).not.toBeNull();
    });

    it('can be opened again after any close, and closes again', async () => {
      const { fixture, root, dialog, closed, settle } = await opened();
      root.querySelector<HTMLButtonElement>('bui-button button')!.click();
      await settle();
      fixture.componentInstance.show();
      await settle();
      expect(dialog()?.hasAttribute('open')).toBe(true);
      root.querySelector<HTMLButtonElement>('bui-button button')!.click();
      await settle();
      expect(closed).toHaveBeenCalledTimes(2);
    });
  });

  describe('storage failure', () => {
    it('opens once per page load and stays operable by hand', async () => {
      const denied = () => {
        throw new DOMException('denied', 'SecurityError');
      };
      vi.spyOn(Storage.prototype, 'getItem').mockImplementation(denied);
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(denied);
      const { fixture, root, dialog, closed, settle } = await setup({ seen: false });
      expect(dialog()?.hasAttribute('open')).toBe(true);

      root.querySelector<HTMLButtonElement>('bui-button button')!.click();
      await settle();
      expect(dialog()).toBeNull();
      expect(closed).toHaveBeenCalledTimes(1);

      fixture.componentInstance.show();
      await settle();
      expect(dialog()?.hasAttribute('open')).toBe(true);
      root.querySelector<HTMLButtonElement>('bui-button button')!.click();
      await settle();
      expect(dialog()).toBeNull();
      expect(closed).toHaveBeenCalledTimes(2);
    });
  });

  describe('content', () => {
    async function text() {
      const { fixture, dialog, settle } = await setup();
      fixture.componentInstance.show();
      await settle();
      return { element: dialog()!, content: (dialog()!.textContent ?? '').replace(/\s+/g, ' ') };
    }

    it('has the seven content sections, in order, under one title', async () => {
      const { element } = await text();
      expect(element.querySelector('h2')?.textContent?.trim()).toBe('About brand-ui');
      expect(Array.from(element.querySelectorAll('h3')).map((h) => h.textContent?.trim())).toEqual([
        'A reference spike, not production',
        'Three brands, four scopes',
        'The ui library',
        'How the gallery relates to the library',
        'Using the gallery',
        'How this was built',
        'Source repository',
      ]);
      for (const section of Array.from(element.querySelectorAll('section'))) {
        const heading = section.querySelector(`#${section.getAttribute('aria-labelledby')}`);
        expect(heading?.tagName).toBe('H3');
      }
    });

    it('states the project intent and the prohibited claims (AC-17.1)', async () => {
      const { content } = await text();
      for (const statement of [
        'reference spike, not production software',
        'domain learning',
        'workflow evidence',
        'no production, client-delivery, official-rebrand or rollout claim',
      ]) {
        expect(content).toContain(statement);
      }
    });

    it('states the three brand statuses and the four scopes (AC-17.2)', async () => {
      const { content } = await text();
      for (const statement of [
        'three brands across four scopes',
        'Light and Dark are two styling modes of one brand',
        'unofficial concept exploration',
        'no affiliation or delivery claim is made',
        "the Moderator's own freelance venture",
        'a placeholder name for open-source tech and code examples',
      ]) {
        expect(content).toContain(statement);
      }
    });

    it('names the library parts and the token idea (AC-17.3)', async () => {
      const { content } = await text();
      for (const statement of [
        'Button, TextInput, Card and Navigation',
        'ThemeService',
        'ThemeScopeDirective',
        'same set of semantic token names',
        'hold no brand values',
        'changes tokens only, never component structure',
      ]) {
        expect(content).toContain(statement);
      }
    });

    it('states the gallery and library boundary (AC-17.4)', async () => {
      const { content } = await text();
      for (const statement of [
        'separate review application',
        'only through the ui public entry point',
        'does not depend on the gallery',
        'brand scope switcher',
        'persistent hover, focus and active specimens',
        'token read-outs',
        'contrast evidence',
        'Design IDs',
      ]) {
        expect(content).toContain(statement);
      }
    });

    it('explains how to use the gallery (AC-17.5)', async () => {
      const { content } = await text();
      for (const statement of [
        'All brands',
        'Design IDs checkbox',
        'Panel sections',
        "opens by itself on a browser's first visit",
        'About button in the top bar',
      ]) {
        expect(content).toContain(statement);
      }
    });

    it('explains how it was built, matching the README, with a safe methodology link (AC-17.6)', async () => {
      const { element, content } = await text();
      for (const statement of [
        'Built with MOD-W v5.0.1, a role-separated workflow in which a Moderator (human-in-the-loop) approves each step and plan and a Tech Lead reviews each step before QA.',
        'Implementation was done by Claude Code acting as the Development Team.',
        'The governing documents are in mod-w/; the methodology is at github.com/fpmcguire/mod-w.',
      ]) {
        expect(content).toContain(statement);
      }
      // The governing-documents sentence starts its own paragraph.
      const built = element.querySelector('section[aria-labelledby="gal-about-built"]')!;
      const paragraphs = Array.from(built.querySelectorAll('p'));
      expect(paragraphs).toHaveLength(2);
      expect(paragraphs[1].textContent?.trim()).toMatch(/^The governing documents are in/);
      expect(built.querySelector('h3')?.textContent?.trim()).toBe('How this was built');

      const links = Array.from(built.querySelectorAll('a'));
      expect(links).toHaveLength(1);
      expect(links[0].getAttribute('href')).toBe('https://github.com/fpmcguire/mod-w');
      expect(links[0].getAttribute('target')).toBe('_blank');
      expect(links[0].getAttribute('rel')).toBe('noopener noreferrer');
      expect(links[0].textContent?.trim()).toBe('github.com/fpmcguire/mod-w');
      expect(links[0].getAttribute('aria-label')).toBe(
        'github.com/fpmcguire/mod-w (opens in a new tab)',
      );
    });

    it('ends with a distinct source-repository section and a safe link (AC-17.7)', async () => {
      const { element, content } = await text();
      expect(content).toContain('public brand-ui repository on GitHub');

      const sections = Array.from(element.querySelectorAll('section'));
      expect(sections).toHaveLength(7);
      const source = sections.at(-1)!;
      expect(source.getAttribute('aria-labelledby')).toBe('gal-about-source');
      expect(source.querySelector('h3')?.textContent?.trim()).toBe('Source repository');
      expect(source.querySelectorAll('p')).toHaveLength(1);

      const links = Array.from(source.querySelectorAll('a'));
      expect(links).toHaveLength(1);
      expect(links[0].getAttribute('href')).toBe('https://github.com/fpmcguire/brand-ui.git');
      expect(links[0].getAttribute('target')).toBe('_blank');
      expect(links[0].getAttribute('rel')).toBe('noopener noreferrer');
      expect(links[0].textContent?.trim()).toBe('github.com/fpmcguire/brand-ui');
      expect(links[0].getAttribute('aria-label')).toBe(
        'github.com/fpmcguire/brand-ui (opens in a new tab)',
      );
    });

    it('permits exactly two external links, each safeguarded', async () => {
      const { element } = await text();
      const links = Array.from(element.querySelectorAll('a'));
      expect(links.map((link) => link.getAttribute('href'))).toEqual([
        'https://github.com/fpmcguire/mod-w',
        'https://github.com/fpmcguire/brand-ui.git',
      ]);
      expect(element.querySelectorAll('[href]')).toHaveLength(2);
      expect(element.querySelectorAll('[target]')).toHaveLength(2);
      for (const link of links) {
        expect(link.getAttribute('target')).toBe('_blank');
        expect(link.getAttribute('rel')).toBe('noopener noreferrer');
        // The accessible name begins with the visible text and announces the new tab.
        const visible = link.textContent?.trim() ?? '';
        expect(link.getAttribute('aria-label')).toBe(`${visible} (opens in a new tab)`);
      }
    });

    it('shows no Design ID badge or placeholder, and nothing prohibited', async () => {
      const { element, content } = await text();
      expect(content).not.toMatch(/DS-/);
      expect(content).not.toMatch(/no design id/i);
      expect(content).not.toMatch(/MW-OBS/);
      expect(content).not.toMatch(/install|tutorial|npm |ng add/i);
      expect(element.querySelector('img, svg, picture, video, [class~="id"]')).toBeNull();
    });
  });
});
