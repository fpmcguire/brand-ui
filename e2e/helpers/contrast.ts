/**
 * Test-side WCAG 2.x contrast oracle. Deliberately independent of the gallery's own calculation:
 * the specifications compare the two, so a mistake in either shows up.
 */
export interface Rgb {
  readonly r: number;
  readonly g: number;
  readonly b: number;
}

/** Parses the `rgb()`/`rgba()` string a browser returns for a resolved colour. Opaque only. */
export function parseRgb(css: string): Rgb {
  const match = /^rgba?\(\s*(\d+(?:\.\d+)?)[\s,]+(\d+(?:\.\d+)?)[\s,]+(\d+(?:\.\d+)?)/.exec(css);
  if (!match) throw new Error(`Not an rgb() colour: "${css}"`);
  if (/^rgba\(.*,\s*0(?:\.\d+)?\)$/.test(css)) throw new Error(`Not opaque: "${css}"`);
  return { r: Number(match[1]), g: Number(match[2]), b: Number(match[3]) };
}

function channel(value: number): number {
  const srgb = value / 255;
  return srgb <= 0.04045 ? srgb / 12.92 : ((srgb + 0.055) / 1.055) ** 2.4;
}

function luminance({ r, g, b }: Rgb): number {
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrastRatio(a: Rgb, b: Rgb): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}
