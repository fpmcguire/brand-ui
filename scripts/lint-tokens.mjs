// Focused token-discipline checks (AC-1, AC-3, AC-13, AC-14). Not a general lint platform.
//
// 1. Component source (button, card, and later text-input/navigation, plus the whole atomic
//    package) has no literal colors, no literal font families, no literal space/radius/elevation
//    lengths, and no brand names.
// 2. The token CSS files fill one identical contract: ArtAnon and Mentor completely, CodeCraft as a
//    shared non-color base plus color-only Light and Dark modes. No token outside the contract.
// 3. The gallery's token-name list matches the library's contract (names only, never values).
//
// Documented allowlist of structural literals (property -> allowed values): see ALLOWED_LITERALS.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { checkStyleText, inlineStyles, templateStyles } from './token-rules.mjs';

const root = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const lib = join(root, 'projects/ui/src/lib');
// The atomic package root; `--atomic-root <dir>` lets the self-test prove package discovery on a
// temporary fixture instead of the real source.
const rootFlag = process.argv.indexOf('--atomic-root');
const atomicRoot =
  rootFlag > 0 ? resolve(process.argv[rootFlag + 1]) : join(root, 'projects/atomic');
const problems = [];
const fail = (file, message) => problems.push(`${relative(root, file)}: ${message}`);

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

const stripComments = (text) => text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

// --- 1. Component styles --------------------------------------------------------------------
// Literal rules and the documented structural allowlist live in token-rules.mjs; its fixtures in
// lint-tokens.selftest.mjs.
const COMPONENT_DIRS = ['button', 'card', 'text-input', 'navigation'].map((dir) => join(lib, dir));
const SOURCE_FILE = /.(?:ts|html|scss|css)$/; // atomic holds config JSON too
const BRAND_NAME = /artanon|art-anon|mentor|codecraft|code-craft/i;

for (const base of [...COMPONENT_DIRS, atomicRoot]) {
  let files;
  try {
    files = walk(base).filter(
      (f) => !f.endsWith('.spec.ts') && (base !== atomicRoot || SOURCE_FILE.test(f)),
    );
  } catch {
    continue; // component not built yet
  }
  for (const file of files) {
    const text = stripComments(readFileSync(file, 'utf8'));
    if (BRAND_NAME.test(text)) fail(file, 'contains a brand name; components must not know brands');
    const styles = /\.(scss|css)$/.test(file)
      ? [text]
      : file.endsWith('.ts')
        ? inlineStyles(text)
        : file.endsWith('.html')
          ? templateStyles(text)
          : [];
    for (const css of styles) for (const message of checkStyleText(css)) fail(file, message);
  }
}

// --- 2. Token files -------------------------------------------------------------------------
const contractFile = join(lib, 'theme/token-contract.ts');
const contract = [
  ...readFileSync(contractFile, 'utf8').matchAll(/'(--bui-[a-z0-9]+(?:-[a-z0-9]+)*)'/g),
].map((m) => m[1]);
const isColor = (name) => name.startsWith('--bui-color-');

function declared(name) {
  const file = join(lib, 'theme/tokens', `${name}.css`);
  const css = stripComments(readFileSync(file, 'utf8'));
  return { file, names: [...css.matchAll(/(--bui-[a-z0-9-]+)\s*:/g)].map((m) => m[1]) };
}
function compare(label, file, names, expected) {
  const missing = expected.filter((n) => !names.includes(n));
  const extra = names.filter((n) => !expected.includes(n));
  const dupes = names.filter((n, i) => names.indexOf(n) !== i);
  if (missing.length) fail(file, `${label} is missing ${missing.join(', ')}`);
  if (extra.length) fail(file, `${label} has tokens outside the contract: ${extra.join(', ')}`);
  if (dupes.length) fail(file, `${label} declares twice: ${dupes.join(', ')}`);
}

if (new Set(contract).size !== contract.length) fail(contractFile, 'duplicate contract names');
for (const brand of ['artanon', 'mentor']) {
  const { file, names } = declared(brand);
  compare(brand, file, names, contract);
}
const shared = declared('codecraft');
const light = declared('codecraft-light');
const dark = declared('codecraft-dark');
compare(
  'codecraft shared base',
  shared.file,
  shared.names,
  contract.filter((n) => !isColor(n)),
);
compare('codecraft-light', light.file, light.names, contract.filter(isColor));
compare('codecraft-dark', dark.file, dark.names, contract.filter(isColor));

// --- 3. Gallery token list matches the contract ---------------------------------------------
const inspector = join(root, 'projects/gallery/src/app/gallery/token-inspector.ts');
const galleryNames = [
  ...readFileSync(inspector, 'utf8').matchAll(/'(--bui-[a-z0-9]+(?:-[a-z0-9]+)*)'/g),
].map((m) => m[1]);
compare('gallery token list', inspector, galleryNames, contract);

// --- 4. Gallery imports the library only through `ui` --------------------------------------
for (const file of walk(join(root, 'projects/gallery/src'))) {
  if (!file.endsWith('.ts')) continue;
  const text = readFileSync(file, 'utf8');
  if (/from\s+['"][^'"]*(?:projects\/ui|\.\.\/ui\/|\/lib\/)[^'"]*['"]/.test(text)) {
    fail(file, 'imports library internals; import from "ui"');
  }
}

if (problems.length) {
  console.error(`lint:tokens failed (${problems.length}):\n- ${problems.join('\n- ')}`);
  process.exit(1);
}
console.log(`lint:tokens passed (${contract.length} contract tokens; 4 scopes; components clean).`);
