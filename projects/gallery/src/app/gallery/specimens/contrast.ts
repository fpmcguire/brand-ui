import { REQUIRED_RATIO, UsagePair } from './usage-pairs';

export interface Rgb {
  readonly r: number;
  readonly g: number;
  readonly b: number;
}

const HEX = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;
const RGB =
  /^rgba?\(\s*(\d+(?:\.\d+)?)[\s,]+(\d+(?:\.\d+)?)[\s,]+(\d+(?:\.\d+)?)\s*(?:[,/][^)]*)?\)$/i;

/** Parses an opaque `#rgb`, `#rrggbb` or `rgb()` colour; returns null for anything else. */
export function parseColor(value: string): Rgb | null {
  const text = value.trim();
  const hex = HEX.exec(text)?.[1];
  if (hex) {
    const full = hex.length === 3 ? [...hex].map((digit) => digit + digit).join('') : hex;
    return {
      r: parseInt(full.slice(0, 2), 16),
      g: parseInt(full.slice(2, 4), 16),
      b: parseInt(full.slice(4, 6), 16),
    };
  }
  const rgb = RGB.exec(text);
  return rgb ? { r: Number(rgb[1]), g: Number(rgb[2]), b: Number(rgb[3]) } : null;
}

function channel(value: number): number {
  const srgb = value / 255;
  return srgb <= 0.04045 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
}

/** WCAG 2.x relative luminance. */
export function luminance({ r, g, b }: Rgb): number {
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** WCAG 2.x contrast ratio, from 1 to 21, never rounded. */
export function contrastRatio(a: Rgb, b: Rgb): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

export interface PairResult {
  readonly pair: UsagePair;
  readonly foreground: string;
  readonly background: string;
  /** Null when either token does not resolve to a colour in this scope. */
  readonly ratio: number | null;
  readonly required: number;
  readonly pass: boolean;
}

/** Evaluates each pair against the colours the tokens resolve to inside `element`'s scope. */
export function evaluatePairs(element: Element, pairs: readonly UsagePair[]): PairResult[] {
  const style = getComputedStyle(element);
  return pairs.map((pair) => {
    const foreground = style.getPropertyValue(pair.foreground).trim();
    const background = style.getPropertyValue(pair.background).trim();
    const fg = parseColor(foreground);
    const bg = parseColor(background);
    const ratio = fg && bg ? contrastRatio(fg, bg) : null;
    const required = REQUIRED_RATIO[pair.kind];
    return {
      pair,
      foreground,
      background,
      ratio,
      required,
      pass: ratio !== null && ratio >= required,
    };
  });
}
