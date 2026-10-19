import { Injectable, computed, inject, signal } from '@angular/core';
import { ThemeSelection, ThemeService } from 'ui';

/** A gallery scope is one themed panel. CodeCraft Light and Dark are two scopes of one brand. */
export type GalleryScopeId = 'artanon' | 'mentor' | 'codecraft-light' | 'codecraft-dark';

export interface GalleryScope {
  readonly id: GalleryScopeId;
  readonly label: string;
  readonly note?: string;
  readonly selection: ThemeSelection;
}

export const GALLERY_SCOPES: readonly GalleryScope[] = [
  {
    id: 'artanon',
    label: 'ArtAnon Shop',
    note: 'Unofficial concept exploration of an existing identity. No affiliation or delivery claim.',
    selection: { brand: 'artanon' },
  },
  { id: 'mentor', label: 'IT English Mentor', selection: { brand: 'mentor' } },
  {
    id: 'codecraft-light',
    label: 'CodeCraft Academy Light',
    note: 'Placeholder brand name.',
    selection: { brand: 'codecraft', mode: 'light' },
  },
  {
    id: 'codecraft-dark',
    label: 'CodeCraft Academy Dark',
    note: 'Placeholder brand name. A styling mode of the same brand.',
    selection: { brand: 'codecraft', mode: 'dark' },
  },
];

export type SwitcherValue = GalleryScopeId | 'all';

export interface SwitcherOption {
  readonly id: SwitcherValue;
  readonly label: string;
}

export const SWITCHER_OPTIONS: readonly SwitcherOption[] = [
  ...GALLERY_SCOPES.map(({ id, label }) => ({ id, label })),
  { id: 'all', label: 'All brands' },
];

function scopeFor(selection: ThemeSelection): GalleryScope {
  const match = GALLERY_SCOPES.find(
    (scope) =>
      scope.selection.brand === selection.brand &&
      (selection.brand !== 'codecraft' ||
        (scope.selection.brand === 'codecraft' && scope.selection.mode === selection.mode)),
  );
  if (!match) {
    throw new Error(`No gallery scope for ${JSON.stringify(selection)}`);
  }
  return match;
}

/** Owns what the gallery shows: the chosen scope or all of them, and Design-ID visibility. */
@Injectable()
export class GalleryState {
  private readonly theme = inject(ThemeService);

  readonly options = SWITCHER_OPTIONS;
  readonly showAll = signal(false);
  readonly showDesignIds = signal(true);

  /** The single scope shown when "All brands" is off; follows the theme service selection. */
  readonly activeScope = computed(() => scopeFor(this.theme.selection()));
  readonly visibleScopes = computed(() => (this.showAll() ? GALLERY_SCOPES : [this.activeScope()]));

  isPressed(id: SwitcherValue): boolean {
    return id === 'all' ? this.showAll() : !this.showAll() && this.activeScope().id === id;
  }

  choose(id: SwitcherValue): void {
    if (id === 'all') {
      this.showAll.set(true);
      return;
    }
    const scope = GALLERY_SCOPES.find((candidate) => candidate.id === id);
    if (scope) {
      this.showAll.set(false);
      this.theme.select(scope.selection);
    }
  }
}
