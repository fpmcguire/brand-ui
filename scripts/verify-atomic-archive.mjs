// Atomic package archive verification (AC-22, AC-23, D-12).
//
// 1. Rebuilds `atomic` independently and packs `dist/atomic` into a temporary directory.
// 2. Inspects the committed archive: identity, version, dependencies, entry points, an exact file
//    inventory, and the absence of secrets, assets, gallery/MOD-W content and source-path leakage.
// 3. Compares the rebuilt archive with the committed one after normalizing volatile pack metadata
//    (tar mtimes, owners, modes, ordering, gzip header, line endings); any path or content-hash
//    difference is source/archive drift.
// 4. Checks the installed-consumption boundary: the exact file dependency, the lockfile entry and
//    its integrity, no TypeScript alias or relative import into atomic source, and no install hooks.
//
// Nothing here publishes, contacts a registry, or writes outside the temporary directory.
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative } from 'node:path';
import { parseArchive } from './atomic-archive.mjs';
import { consumerImportProblems, outputImportProblems } from './atomic-imports.mjs';

const root = new URL('..', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const ARCHIVE = 'package-artifacts/brand-ui-atomic-1.1.0.tgz';
const DEPENDENCY = `file:${ARCHIVE}`;
const PACKAGE = '@brand-ui/atomic';
const VERSION = '1.1.0';
const ENTRY_POINTS = ['atoms', 'molecules', 'organisms'];
// Angular packages a package may declare as peers, and only when its output actually imports them.
const ALLOWED_PEERS = ['@angular/core', '@angular/common'];

const problems = [];
const fail = (message) => problems.push(message);

const isText = (path) => /\.(mjs|js|ts|json|md|txt)$/.test(path);
const digest = (buffer, algorithm = 'sha256') => createHash(algorithm).update(buffer).digest('hex');
// Normalized content: text files compared with LF line endings; everything else byte-for-byte.
function normalized(path, buffer) {
  return isText(path) ? Buffer.from(buffer.toString('utf8').replace(/\r\n/g, '\n')) : buffer;
}
const fingerprint = (entries) =>
  new Map(
    [...entries]
      .map(([path, buffer]) => [path, digest(normalized(path, buffer))])
      .sort(([a], [b]) => (a < b ? -1 : 1)),
  );

// --- 1. Rebuild and pack into a temporary directory ----------------------------------------------
const tmp = mkdtempSync(join(tmpdir(), 'atomic-archive-'));
const ng = join(root, 'node_modules/@angular/cli/bin/ng.js');
const npm = process.env['npm_execpath'];
if (!npm || !existsSync(npm)) {
  console.error('verify:atomic-archive must run through npm (npm_execpath is not set).');
  process.exit(1);
}

let rebuilt;
try {
  execFileSync(process.execPath, [ng, 'build', 'atomic'], { cwd: root, stdio: 'pipe' });
  execFileSync(process.execPath, [npm, 'pack', './dist/atomic', '--pack-destination', tmp], {
    cwd: root,
    stdio: 'pipe',
  });
  rebuilt = parseArchive(readFileSync(join(tmp, 'brand-ui-atomic-1.1.0.tgz')));
} finally {
  // Entries are read into memory above; the temporary directory is never needed afterwards.
  rmSync(tmp, { recursive: true, force: true });
}

// --- 2. Inspect the committed archive ------------------------------------------------------------
const archivePath = join(root, ARCHIVE);
if (!existsSync(archivePath)) {
  console.error(`verify:atomic-archive failed:\n- ${ARCHIVE} is missing`);
  process.exit(1);
}
const archiveBuffer = readFileSync(archivePath);
let committed = new Map();
try {
  committed = parseArchive(archiveBuffer);
} catch (error) {
  fail(`${ARCHIVE}: ${error.message}`);
}

const names = [PACKAGE, ...ENTRY_POINTS.map((e) => `${PACKAGE}-${e}`)].map((n) =>
  n.replace('@brand-ui/', 'brand-ui-'),
);
const required = [
  'package/package.json',
  ...names.map((n) => `package/fesm2022/${n}.mjs`),
  ...names.map((n) => `package/types/${n}.d.ts`),
];
const ALLOWED_INVENTORY =
  /^package\/(?:package\.json|fesm2022\/[\w.-]+\.mjs|types\/[\w.-]+\.d\.ts)$/;
const FORBIDDEN_PATH =
  /(?:^|\/)(?:mod-w|gallery|e2e|study-guides|projects|node_modules|\.git|\.env[^/]*|\.npmrc|[^/]*\.(?:map|pem|key|p12|css|scss|woff2?|ttf|otf|eot|png|jpe?g|gif|webp|avif|svg|ico|pdf|mp4|mov))$/i;
const FORBIDDEN_CONTENT = [
  [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, 'private key'],
  [/\b(?:npm|ghp|gho|github_pat)_[A-Za-z0-9_]{20,}/, 'access token'],
  [/_authToken|\bAKIA[0-9A-Z]{16}\b/, 'credential'],
  [/[A-Za-z]:[\\/]/, 'drive-letter source path'],
  [/\/(?:Users|home)\/[\w.-]+\//, 'home-directory source path'],
  [/projects[\\/](?:atomic|ui|gallery)|node_modules|mod-w/i, 'workspace path'],
  [/sourceMappingURL/, 'source map reference'],
  [/artanon|art-anon/i, 'ArtAnon reference'],
];

for (const path of required) if (!committed.has(path)) fail(`archive lacks ${path}`);
for (const path of committed.keys()) {
  if (!ALLOWED_INVENTORY.test(path)) fail(`archive contains unexpected file ${path}`);
  if (FORBIDDEN_PATH.test(path)) fail(`archive contains forbidden path ${path}`);
  if (!isText(path)) continue;
  const text = committed.get(path).toString('utf8');
  for (const [pattern, label] of FORBIDDEN_CONTENT) {
    if (pattern.test(text)) fail(`${path}: contains ${label}`);
  }
}

const manifestBuffer = committed.get('package/package.json');
const manifest = manifestBuffer ? JSON.parse(manifestBuffer.toString('utf8')) : {};
if (manifest.name !== PACKAGE) fail(`manifest name is ${manifest.name}, expected ${PACKAGE}`);
if (manifest.version !== VERSION)
  fail(`manifest version is ${manifest.version}, expected ${VERSION}`);
if (manifest.private) fail('manifest is private');
if (manifest.sideEffects !== false) fail('manifest must declare sideEffects: false');
if (manifest.scripts) fail('manifest must not declare scripts (no install hooks)');
if (JSON.stringify(Object.keys(manifest.dependencies ?? {})) !== '["tslib"]') {
  fail('runtime dependencies must be exactly tslib');
}
const peers = Object.entries(manifest.peerDependencies ?? {});
for (const [name, range] of peers) {
  if (!ALLOWED_PEERS.includes(name)) fail(`peer dependency ${name} is not approved`);
  if (!/^\^22\.2\.\d+$/.test(range))
    fail(`peer dependency ${name} range ${range} is not Angular 22`);
}
// Every bare specifier in the built output must be the exact approved manifest dependency/peer set
// (or the package's own entry points); declared peers must actually be imported.
const approved = [...Object.keys(manifest.dependencies ?? {}), ...peers.map(([name]) => name)];
const usedPackages = new Set();
for (const [path, buffer] of committed) {
  if (!/^package\/(?:fesm2022|types)\//.test(path)) continue;
  for (const problem of outputImportProblems(path, buffer.toString('utf8'), {
    approved,
    own: PACKAGE,
    entryPoints: ENTRY_POINTS,
    inventory: new Set(committed.keys()),
    used: usedPackages,
  })) {
    fail(problem);
  }
}
for (const [name] of peers) {
  if (!usedPackages.has(name)) {
    fail(`peer dependency ${name} is declared but not imported by the package output`);
  }
}
const exportsMap = manifest.exports ?? {};
for (const key of ['.', ...ENTRY_POINTS.map((e) => `./${e}`)]) {
  const entry = exportsMap[key];
  const base = key === '.' ? names[0] : names[ENTRY_POINTS.indexOf(key.slice(2)) + 1];
  if (!entry) fail(`manifest lacks export ${key}`);
  else {
    if (entry.default !== `./fesm2022/${base}.mjs`)
      fail(`export ${key} default is ${entry.default}`);
    if (entry.types !== `./types/${base}.d.ts`) fail(`export ${key} types is ${entry.types}`);
  }
}
const extraExports = Object.keys(exportsMap).filter(
  (key) => !['.', './package.json', ...ENTRY_POINTS.map((e) => `./${e}`)].includes(key),
);
if (extraExports.length) fail(`manifest has unexpected exports ${extraExports.join(', ')}`);

// --- 3. Normalized source/archive drift comparison -----------------------------------------------
const want = fingerprint(rebuilt);
const have = fingerprint(committed);
for (const [path, hash] of want) {
  if (!have.has(path)) fail(`drift: rebuilt package has ${path}, committed archive does not`);
  else if (have.get(path) !== hash) fail(`drift: ${path} differs from the rebuilt package`);
}
for (const path of have.keys()) {
  if (!want.has(path)) fail(`drift: committed archive has ${path}, rebuilt package does not`);
}

// --- 4. Installed-consumption boundary -----------------------------------------------------------
const readJson = (path) => JSON.parse(readFileSync(join(root, path), 'utf8'));
const rootPackage = readJson('package.json');
if (rootPackage.dependencies?.[PACKAGE] !== DEPENDENCY) {
  fail(`root dependency ${PACKAGE} must be exactly ${DEPENDENCY}`);
}
for (const hook of ['preinstall', 'install', 'postinstall', 'prepare', 'prepublish']) {
  if (rootPackage.scripts?.[hook]) fail(`root package.json declares an install hook: ${hook}`);
}
const lock = readJson('package-lock.json');
const locked = lock.packages?.[`node_modules/${PACKAGE}`];
if (!locked) fail(`package-lock.json lacks node_modules/${PACKAGE}`);
else {
  if (locked.resolved !== DEPENDENCY) fail(`lockfile resolved is ${locked.resolved}`);
  if (locked.version !== VERSION) fail(`lockfile version is ${locked.version}`);
  const integrity = `sha512-${createHash('sha512').update(archiveBuffer).digest('base64')}`;
  if (locked.integrity !== integrity)
    fail('lockfile integrity does not match the committed archive');
}
if (lock.packages?.['']?.dependencies?.[PACKAGE] !== DEPENDENCY) {
  fail('lockfile root entry does not record the exact file dependency');
}

// No path mapping or source import may reach atomic source.
const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
for (const config of [
  'tsconfig.json',
  ...walk(join(root, 'projects')).map((p) => relative(root, p)),
]) {
  if (!/(?:^|[\\/])tsconfig[\w.]*\.json$/.test(config)) continue;
  const text = readFileSync(join(root, config), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  if (/"paths"[\s\S]*?(?:@brand-ui|atomic)/.test(text)) fail(`${config}: path alias to atomic`);
}
for (const file of [
  join(root, 'playwright.config.ts'),
  ...['projects/ui', 'projects/gallery', 'e2e'].flatMap((dir) => walk(join(root, dir))),
]) {
  if (!/\.[cm]?[jt]sx?$/.test(file) || !existsSync(file)) continue;
  for (const problem of consumerImportProblems(root, file, readFileSync(file, 'utf8')))
    fail(problem);
}
// angular.json must not point any consumer at atomic source or output.
if (
  /projects\/atomic|dist\/atomic/.test(
    JSON.stringify(readJson('angular.json').projects?.gallery ?? {}) +
      JSON.stringify(readJson('angular.json').projects?.ui ?? {}),
  )
) {
  fail('angular.json: ui or gallery references atomic source or output');
}

// When installed, node_modules must hold exactly the committed archive's manifest.
const installed = join(root, 'node_modules', PACKAGE, 'package.json');
if (existsSync(installed)) {
  if (JSON.stringify(JSON.parse(readFileSync(installed, 'utf8'))) !== JSON.stringify(manifest)) {
    fail('installed package manifest differs from the committed archive manifest');
  }
}

if (problems.length) {
  console.error(`verify:atomic-archive failed (${problems.length}):\n- ${problems.join('\n- ')}`);
  process.exit(1);
}
console.log(
  `verify:atomic-archive passed (${PACKAGE}@${manifest.version}; ${committed.size} files; ` +
    `archive sha256 ${digest(archiveBuffer)}; no drift from rebuilt package).`,
);
