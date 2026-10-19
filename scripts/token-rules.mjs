// Component style rules shared by lint-tokens.mjs and its self-test (D-01, AC-3, AC-14).
// Not a general lint platform: it only finds literal brand values that bypass the token contract.

// Documented allowlist of structural literals (property -> values that may appear literally).
// Everything else that is a length, a unitless zero in a governed property, or a color must be
// a `--bui-*` token. Percentages, line heights and aspect ratios are not matched at all.
// Radius and elevation have NO allowlisted zero: a zero corner is a brand value (CodeCraft).
export const ALLOWED_LITERALS = {
  // Visually-hidden text technique (-1px), and resetting the user-agent margin of
  // headings/paragraphs/pre (0), which is not a brand spacing value.
  margin: ['-1px', '0'],
  width: ['1px'],
  height: ['1px'],
  // Stretched-link hit area: `inset: 0` fills the positioned card; it is geometry, not space.
  inset: ['0'],
  // Navigation item limit fixed by DS-051 / D-06; no other max-width length is allowlisted.
  'max-width': ['16rem'],
};

// A dimension is a number (scientific notation allowed, e.g. `0e0px`) followed at once by a unit;
// CSS units are ASCII case-insensitive, so `4PX` and `0E0REM` count too.
const LENGTH = /(?<![\w.#-])-?\d*\.?\d+(?:e[+-]?\d+)?(?:px|rem|em|vw|vh|ch)\b/gi;
// Unitless zero in any CSS spelling, e.g. `border-radius: 0`, `calc(0 + ...)`, `var(--x, 0)`,
// `.0`, `0.00`, `-0`, and exponent forms such as `0e0` or `.0E-5`.
const ZERO = /(?<![\w.#$-])[+-]?(?:0+(?:\.0+)?|\.0+)(?:e[+-]?\d+)?(?![\w.%])/gi;
const COLOR_LITERAL = /#[0-9a-fA-F]{3,8}\b|\b(?:rgb|rgba|hsl|hsla|hwb|lab|lch|oklab|oklch|color)\(/;

// Spacing, radius and elevation properties (including custom properties named for them).
const GOVERNED = [
  /^(?:margin|padding)(?:-[a-z]+)*$/,
  /^(?:gap|row-gap|column-gap|grid-gap)$/,
  /^inset(?:-[a-z]+)*$/,
  /^(?:top|right|bottom|left)$/,
  /^border(?:-[a-z]+)*-radius$/,
  /^(?:box|text)-shadow$/,
  /^--[\w-]*(?:space|spacing|radius|elevation|shadow|gap|margin|padding|inset)[\w-]*$/,
];

const stripComments = (text) => text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

/** Declarations (`property: value`), with or without a trailing semicolon, minified or not. */
function declarations(text) {
  return [
    ...stripComments(text).matchAll(/(?<![\w-])(-{0,2}[a-z_][\w-]*)\s*:\s*([^;{}]+)(?=[;}]|$)/g),
  ].map((m) => [m[1], m[2].trim()]);
}

/** Returns one message per governed literal found in component CSS/SCSS text. */
export function checkStyleText(text) {
  const messages = [];
  for (const [property, v] of declarations(text)) {
    if (COLOR_LITERAL.test(v)) messages.push(`literal color in "${property}: ${v}"`);
    if (property === 'font-family' && !/^var\(/.test(v)) {
      messages.push(`font-family must be a token: "${v}"`);
    }
    if (property === 'opacity' || property.startsWith('animation')) continue;
    const allowed = ALLOWED_LITERALS[property] ?? [];
    const literals = [...(v.match(LENGTH) ?? [])];
    if (GOVERNED.some((rule) => rule.test(property))) literals.push(...(v.match(ZERO) ?? []));
    for (const literal of literals) {
      if (!allowed.includes(literal)) {
        messages.push(`literal ${literal} in "${property}: ${v}" (use a token)`);
      }
    }
  }
  return messages;
}

/**
 * CSS strings from literal `style="..."` / `style='...'` attributes in an external component
 * template. Deliberately narrow: not an HTML parser. Only a plain attribute preceded by whitespace
 * is matched, so `[style.x]`, `[attr.style]` and `data-style` are ignored; bindings, inline
 * `template:` strings and unquoted values are not covered.
 */
export function templateStyles(htmlText) {
  const withoutComments = htmlText.replace(/<!--[\s\S]*?-->/g, '');
  return [...withoutComments.matchAll(/(?<=\s)style\s*=\s*(?:"([^"]*)"|'([^']*)')/gi)].map(
    (m) => m[1] ?? m[2],
  );
}

/** CSS strings from an Angular component's inline `styles: [...]` / `styles: '...'`. */
export function inlineStyles(tsText) {
  const string = '`[^`]*`|\'[^\']*\'|"[^"]*"';
  const list = new RegExp(
    `\\bstyles\\s*:\\s*\\[?\\s*((?:${string})(?:\\s*,\\s*(?:${string}))*)`,
    'g',
  );
  return [...tsText.matchAll(list)].flatMap((m) =>
    [...m[1].matchAll(new RegExp(string, 'g'))].map((s) => s[0].slice(1, -1)),
  );
}
