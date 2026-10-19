import { contrastRatio, evaluatePairs, luminance, parseColor } from './contrast';
import { REQUIRED_RATIO, USAGE_PAIRS } from './usage-pairs';
import { TOKEN_GROUPS } from '../token-inspector';

describe('parseColor', () => {
  it('reads short and long hex and rgb() notation', () => {
    expect(parseColor('#fff')).toEqual({ r: 255, g: 255, b: 255 });
    expect(parseColor(' #0E7490 ')).toEqual({ r: 14, g: 116, b: 144 });
    expect(parseColor('rgb(14, 116, 144)')).toEqual({ r: 14, g: 116, b: 144 });
    expect(parseColor('rgb(14 116 144 / 0.5)')).toEqual({ r: 14, g: 116, b: 144 });
  });

  it('returns null for anything it cannot read', () => {
    for (const value of ['', 'red', '#12', '#12345678', 'var(--x)', 'rgb(1, 2)']) {
      expect(parseColor(value)).toBeNull();
    }
  });
});

describe('contrastRatio', () => {
  const black = { r: 0, g: 0, b: 0 };
  const white = { r: 255, g: 255, b: 255 };

  it('is 21:1 for black on white, in either order, and 1:1 for equal colours', () => {
    expect(contrastRatio(black, white)).toBeCloseTo(21, 5);
    expect(contrastRatio(white, black)).toBeCloseTo(21, 5);
    expect(contrastRatio(white, white)).toBe(1);
  });

  it('matches known WCAG values', () => {
    // #777777 on white is the classic 4.48:1 near miss; #767676 is the lightest grey that passes.
    expect(contrastRatio(parseColor('#777777')!, white)).toBeCloseTo(4.48, 2);
    expect(contrastRatio(parseColor('#767676')!, white)).toBeCloseTo(4.54, 2);
    expect(luminance(white)).toBe(1);
    expect(luminance(black)).toBe(0);
  });
});

describe('usage pairs', () => {
  it('has unique ids and uses only colour tokens the contract declares', () => {
    const colorTokens = new Set(TOKEN_GROUPS.find((group) => group.id === 'color')!.names);
    expect(new Set(USAGE_PAIRS.map((pair) => pair.id)).size).toBe(USAGE_PAIRS.length);
    for (const pair of USAGE_PAIRS) {
      expect(colorTokens.has(pair.foreground)).toBe(true);
      expect(colorTokens.has(pair.background)).toBe(true);
      expect(REQUIRED_RATIO[pair.kind]).toBeGreaterThanOrEqual(3);
    }
  });

  it('never lists disabled text, which is exempt', () => {
    for (const pair of USAGE_PAIRS) {
      expect(pair.foreground).not.toContain('disabled');
    }
  });
});

describe('evaluatePairs', () => {
  it('passes at the threshold, fails just under it, and reports unresolved tokens', () => {
    const style = document.createElement('style');
    // #767676 on white is 4.54:1; #777777 on white is 4.48:1.
    style.textContent = `
      .scope-a { --bui-color-text: #767676; --bui-color-surface: #ffffff; }
      .scope-b { --bui-color-text: #777777; --bui-color-surface: #ffffff; }
    `;
    document.head.appendChild(style);
    try {
      const pair = USAGE_PAIRS.find((candidate) => candidate.id === 'text-on-surface')!;
      const host = (name: string) => {
        const element = document.createElement('div');
        element.className = name;
        document.body.appendChild(element);
        return element;
      };
      const a = host('scope-a');
      const b = host('scope-b');
      const c = host('scope-c');
      expect(evaluatePairs(a, [pair])[0].pass).toBe(true);
      expect(evaluatePairs(b, [pair])[0].pass).toBe(false);
      expect(evaluatePairs(b, [pair])[0].ratio).toBeCloseTo(4.48, 2);
      expect(evaluatePairs(c, [pair])[0]).toMatchObject({ ratio: null, pass: false });
      a.remove();
      b.remove();
      c.remove();
    } finally {
      style.remove();
    }
  });
});
