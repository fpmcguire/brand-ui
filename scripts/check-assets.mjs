// Restricted-asset and font-provenance checks (AC-12, D-09).
//
// - No image or design-source file anywhere in the repository except an explicit allowlist.
// - Nothing named for ArtAnon outside source text, and no font files other than the self-hosted
//   WOFF2 families.
// - The atomic package source and its committed archive inventory carry no image, font, token
//   stylesheet or duplicated token declaration; package-artifacts holds only the reviewed archive.
// - Every font family directory has a copyright-bearing OFL.txt, a SOURCE.md naming its files, and
//   only WOFF2 binaries; every WOFF2 is referenced by typography.css and listed in SOURCE.md.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { parseArchive } from './atomic-archive.mjs';

const root = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const problems = [];

const files = execFileSync('git', ['ls-files', '-co', '--exclude-standard'], {
  cwd: root,
  encoding: 'utf8',
})
  .split('\n')
  .filter(Boolean);

const BINARY_ASSET = /\.(png|jpe?g|gif|webp|avif|bmp|tiff?|svg|ico|psd|ai|eps|pdf|mp4|mov)$/i;
const ALLOWED_BINARY = new Set(['projects/gallery/public/favicon.ico']);
const FONT_FILE = /\.(woff2?|ttf|otf|eot)$/i;
const FONT_ROOT = 'projects/ui/src/lib/theme/fonts/';

for (const file of files) {
  if (BINARY_ASSET.test(file) && !ALLOWED_BINARY.has(file)) {
    problems.push(`${file}: image or design asset is not allowed`);
  }
  if (/art-?anon/i.test(file) && !/\.(md|json|ts|html|scss|css|mjs)$/i.test(file)) {
    problems.push(`${file}: ArtAnon-named non-source file`);
  }
  if (FONT_FILE.test(file) && !(file.startsWith(FONT_ROOT) && file.endsWith('.woff2'))) {
    problems.push(`${file}: font files must be self-hosted WOFF2 under ${FONT_ROOT}`);
  }
}

// --- Atomic package source and archive inventory ---------------------------------------------
const ATOMIC_ROOT = 'projects/atomic/';
const ARCHIVE_DIR = 'package-artifacts/';
const ARCHIVE_FILE = `${ARCHIVE_DIR}brand-ui-atomic-1.1.0.tgz`;
const TOKEN_ASSET = /(?:^|\/)(?:tokens|fonts)\/|typography\.css$|\.(?:css|woff2?|ttf|otf|eot)$/i;
const TOKEN_DECLARATION = /--bui-[a-z0-9-]+\s*:|@font-face/;
const THIRD_PARTY_BRAND = /art-?anon/i;

for (const file of files) {
  if (file.startsWith(ARCHIVE_DIR) && file !== ARCHIVE_FILE) {
    problems.push(`${file}: only ${ARCHIVE_FILE} may live in ${ARCHIVE_DIR}`);
  }
  if (!file.startsWith(ATOMIC_ROOT)) continue;
  if (TOKEN_ASSET.test(file)) problems.push(`${file}: atomic must not duplicate fonts or tokens`);
  if (/.(?:ts|html|scss|css|mjs|json)$/.test(file)) {
    const text = readFileSync(join(root, file), 'utf8');
    if (TOKEN_DECLARATION.test(text)) problems.push(`${file}: declares token or font values`);
    if (THIRD_PARTY_BRAND.test(text)) problems.push(`${file}: references a prohibited brand`);
  }
}

let archiveFiles = 0;
if (existsSync(join(root, ARCHIVE_FILE))) {
  let entries = new Map();
  try {
    // The same strict, validated inventory the archive verifier uses; any stream irregularity fails.
    entries = parseArchive(readFileSync(join(root, ARCHIVE_FILE)));
  } catch (error) {
    problems.push(`${ARCHIVE_FILE}: ${error.message}`);
  }
  for (const [name, buffer] of entries) {
    const text = buffer.toString('utf8');
    archiveFiles++;
    if (BINARY_ASSET.test(name) || FONT_FILE.test(name) || TOKEN_ASSET.test(name)) {
      problems.push(`${ARCHIVE_FILE}: contains asset ${name}`);
    }
    if (TOKEN_DECLARATION.test(text)) problems.push(`${ARCHIVE_FILE}: ${name} declares tokens`);
    if (THIRD_PARTY_BRAND.test(name + text)) {
      problems.push(`${ARCHIVE_FILE}: ${name} references a prohibited brand`);
    }
  }
} else problems.push(`${ARCHIVE_FILE} is missing`);

const fontsDir = join(root, FONT_ROOT);
const typography = readFileSync(join(root, 'projects/ui/src/lib/theme/typography.css'), 'utf8');
const families = readdirSync(fontsDir, { withFileTypes: true }).filter((e) => e.isDirectory());

for (const { name } of families) {
  const dir = join(fontsDir, name);
  const entries = readdirSync(dir);
  const woff2 = entries.filter((e) => e.endsWith('.woff2'));
  const ofl = join(dir, 'OFL.txt');
  const source = join(dir, 'SOURCE.md');
  if (!woff2.length) problems.push(`${name}: no WOFF2 file`);
  if (!existsSync(ofl)) problems.push(`${name}: OFL.txt missing`);
  else {
    const text = readFileSync(ofl, 'utf8');
    if (!/^Copyright/m.test(text)) problems.push(`${name}: OFL.txt has no copyright line`);
    if (!/SIL OPEN FONT LICENSE Version 1\.1/i.test(text)) {
      problems.push(`${name}: OFL.txt is not OFL 1.1`);
    }
  }
  if (!existsSync(source)) problems.push(`${name}: SOURCE.md missing`);
  const sourceText = existsSync(source) ? readFileSync(source, 'utf8') : '';
  for (const file of woff2) {
    if (!typography.includes(`./fonts/${name}/${file}`)) {
      problems.push(`${name}/${file}: not used by typography.css (only used files are allowed)`);
    }
    if (!sourceText.includes(file)) problems.push(`${name}/${file}: not recorded in SOURCE.md`);
  }
  for (const label of ['Licence', 'Upstream distribution', 'Transformation']) {
    if (!sourceText.includes(`**${label}`)) problems.push(`${name}: SOURCE.md lacks "${label}"`);
  }
  const extra = entries.filter((e) => !woff2.includes(e) && e !== 'OFL.txt' && e !== 'SOURCE.md');
  if (extra.length) problems.push(`${name}: unexpected files ${extra.join(', ')}`);
}

for (const [, path] of typography.matchAll(/url\('\.\/(fonts\/[^']+)'\)/g)) {
  if (!existsSync(join(root, 'projects/ui/src/lib/theme', path))) {
    problems.push(`typography.css references missing file ${path}`);
  }
}

if (problems.length) {
  console.error(`check:assets failed (${problems.length}):\n- ${problems.join('\n- ')}`);
  process.exit(1);
}
console.log(
  `check:assets passed (${families.length} font families with OFL.txt and SOURCE.md; ${archiveFiles} atomic archive files; no restricted assets).`,
);
