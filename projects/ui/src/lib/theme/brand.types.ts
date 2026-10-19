export type BrandId = 'artanon' | 'mentor' | 'codecraft';

export type CodeCraftMode = 'light' | 'dark';

export type ThemeSelection =
  { brand: 'artanon' } | { brand: 'mentor' } | { brand: 'codecraft'; mode: CodeCraftMode };

/** The two host attributes that make the token CSS resolve. `mode` is only set for CodeCraft. */
export interface ThemeHostAttributes {
  readonly brand: BrandId;
  readonly mode: CodeCraftMode | null;
}

const MODES: readonly CodeCraftMode[] = ['light', 'dark'];

/**
 * Validates an unknown value and returns the canonical selection: a stray `mode` on ArtAnon or
 * Mentor is dropped, and CodeCraft without a valid mode is rejected.
 */
export function normalizeThemeSelection(value: unknown): ThemeSelection {
  if (typeof value === 'object' && value !== null && 'brand' in value) {
    switch (value.brand) {
      case 'artanon':
        return { brand: 'artanon' };
      case 'mentor':
        return { brand: 'mentor' };
      case 'codecraft': {
        const mode = 'mode' in value ? value.mode : undefined;
        if (MODES.includes(mode as CodeCraftMode)) {
          return { brand: 'codecraft', mode: mode as CodeCraftMode };
        }
      }
    }
  }
  throw new RangeError(`Invalid theme selection: ${JSON.stringify(value)}`);
}

export function themeHostAttributes(selection: ThemeSelection): ThemeHostAttributes {
  const normalized = normalizeThemeSelection(selection);
  return {
    brand: normalized.brand,
    mode: normalized.brand === 'codecraft' ? normalized.mode : null,
  };
}
