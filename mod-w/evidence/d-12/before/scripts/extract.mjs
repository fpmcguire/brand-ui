// D-12 measurement extraction and validation.
// Usage: node extract.mjs <reports-dir> <dist-browser-dir> <out-dir> [expected-url]
//
// Reads <reports-dir>/attempt-N.json (Lighthouse JSON), validates each attempt, takes the first
// five valid attempts in order, and writes summary.json / summary.md to <out-dir>.
// Also computes the JS/CSS size baseline: every Script/Stylesheet loaded by the cold navigation
// (taken from the used runs' Lighthouse network logs, plus the index.html references), de-duplicated by
// built file path and sized from <dist-browser-dir> (raw bytes and zlib level 9). See the Method in summary.md.
// Exit codes: 0 = five valid runs and a consistent, fully resolved size set; 2 = otherwise.
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { gzipSync } from 'node:zlib';
import { join, posix, resolve } from 'node:path';

const [reportsDir, distDir, outDir, expectedUrl = 'http://localhost:4320/brand-ui/'] = process.argv.slice(2);
if (!reportsDir || !distDir || !outDir) {
  console.error('usage: node extract.mjs <reports-dir> <dist-browser-dir> <out-dir> [expected-url]');
  process.exit(2);
}

const REQUIRED_RUNS = 5;
const MAX_ATTEMPTS = 7; // five runs plus at most two replacement attempts
const GZIP_LEVEL = 9;
const EXPECTED = {
  lighthouseVersion: '13.5.0',
  // Chrome's reduced user-agent string reports only the major version (156.0.0.0); the exact build
  // (156.0.8078.4) is recorded separately from the executable's file version in env.json.
  hostChrome: 'HeadlessChrome/156.0.0.0',
  formFactor: 'mobile',
  throttlingMethod: 'simulate',
  throttling: { rttMs: 150, throughputKbps: 1638.4, cpuSlowdownMultiplier: 4 },
};
const SLOW_CPU_WARNING = /slower CPU than/i;
const METRICS = {
  lcpMs: 'largest-contentful-paint',
  cls: 'cumulative-layout-shift',
  tbtMs: 'total-blocking-time',
};

const sha256 = (data) => createHash('sha256').update(data).digest('hex');
const stable = (value) =>
  JSON.stringify(value, (_, v) =>
    v && typeof v === 'object' && !Array.isArray(v)
      ? Object.fromEntries(Object.entries(v).sort(([a], [b]) => (a < b ? -1 : 1)))
      : v,
  );
const median = (values) => {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = sorted.length >> 1;
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};

// ---------- Lighthouse attempts ----------
const attemptFiles = readdirSync(reportsDir)
  .map((name) => ({ name, n: /^attempt-(\d+)\.json$/.exec(name)?.[1] }))
  .filter((f) => f.n)
  .map((f) => ({ name: f.name, n: Number(f.n) }))
  .sort((a, b) => a.n - b.n);

function inspect(file) {
  const reasons = [];
  let report;
  try {
    report = JSON.parse(readFileSync(join(reportsDir, file.name), 'utf8'));
  } catch (error) {
    return { attempt: file.n, file: file.name, valid: false, reasons: [`unreadable JSON: ${error.message}`] };
  }
  const cfg = report.configSettings ?? {};
  const thr = cfg.throttling ?? {};
  if (report.runtimeError) reasons.push(`runtimeError: ${report.runtimeError.code}`);
  // Moderator decision (option A): the slow-host-CPU warning is an accepted, recorded caveat.
  // Any other run warning still invalidates the attempt.
  const allWarnings = report.runWarnings ?? [];
  const otherWarnings = allWarnings.filter((w) => !SLOW_CPU_WARNING.test(String(w)));
  if (otherWarnings.length) reasons.push(`runWarnings: ${JSON.stringify(otherWarnings)}`);
  if (report.lighthouseVersion !== EXPECTED.lighthouseVersion) reasons.push(`lighthouseVersion ${report.lighthouseVersion}`);
  if (report.finalDisplayedUrl !== expectedUrl) reasons.push(`finalDisplayedUrl ${report.finalDisplayedUrl}`);
  if (!String(report.environment?.hostUserAgent ?? '').includes(EXPECTED.hostChrome))
    reasons.push(`hostUserAgent ${report.environment?.hostUserAgent}`);
  if (cfg.formFactor !== EXPECTED.formFactor) reasons.push(`formFactor ${cfg.formFactor}`);
  if (cfg.throttlingMethod !== EXPECTED.throttlingMethod) reasons.push(`throttlingMethod ${cfg.throttlingMethod}`);
  for (const [key, value] of Object.entries(EXPECTED.throttling))
    if (thr[key] !== value) reasons.push(`throttling.${key} ${thr[key]}`);
  if (cfg.disableStorageReset) reasons.push('disableStorageReset true (not a cold run)');
  if (stable(cfg.onlyCategories) !== stable(['performance'])) reasons.push(`onlyCategories ${stable(cfg.onlyCategories)}`);

  const metrics = {};
  for (const [key, id] of Object.entries(METRICS)) {
    const audit = report.audits?.[id];
    if (!audit || typeof audit.numericValue !== 'number' || audit.errorMessage)
      reasons.push(`metric ${id} missing or errored: ${audit?.errorMessage ?? 'no numericValue'}`);
    else metrics[key] = audit.numericValue;
  }
  return {
    attempt: file.n,
    file: file.name,
    valid: reasons.length === 0,
    reasons,
    metrics,
    benchmarkIndex: report.environment?.benchmarkIndex,
    slowHostCpuWarning: allWarnings.some((w) => SLOW_CPU_WARNING.test(String(w))),
    fetchTime: report.fetchTime,
    hostUserAgent: report.environment?.hostUserAgent,
    configHash: sha256(stable(cfg)),
    reportSha256: sha256(readFileSync(join(reportsDir, file.name))),
    report,
  };
}

const attempts = attemptFiles.map(inspect);
let valid = attempts.filter((a) => a.valid);
// Valid runs must share one configuration.
const configHashes = new Set(valid.map((a) => a.configHash));
const configConsistent = configHashes.size <= 1;
const used = valid.slice(0, REQUIRED_RUNS);

// ---------- Initial JS/CSS ----------
const indexHtml = readFileSync(join(distDir, 'index.html'), 'utf8');
// <noscript> duplicates the stylesheet link; it is not an additional resource.
const html = indexHtml.replace(/<noscript>[\s\S]*?<\/noscript>/gi, '');

function attrs(tag) {
  const out = {};
  for (const m of tag.matchAll(/([\w:-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g))
    out[m[1].toLowerCase()] = m[2] ?? m[3] ?? m[4] ?? '';
  return out;
}

const refs = new Map(); // href -> { kinds:Set }
const addRef = (href, kind) => {
  if (!href || /^(https?:)?\/\//.test(href) || href.startsWith('data:')) return;
  const key = posix.normalize(href.replace(/^\.\//, '').split(/[?#]/)[0]);
  (refs.get(key) ?? refs.set(key, new Set()).get(key)).add(kind);
};
for (const m of html.matchAll(/<script\b([^>]*)>/gi)) {
  const a = attrs(m[1]);
  if (a.src) addRef(a.src, 'script');
}
for (const m of html.matchAll(/<link\b([^>]*)>/gi)) {
  const a = attrs(m[1]);
  const rel = (a.rel ?? '').toLowerCase().split(/\s+/);
  if (rel.includes('stylesheet')) addRef(a.href, 'stylesheet');
  else if (rel.includes('modulepreload')) addRef(a.href, 'modulepreload');
}

const sizes = (buf) => ({ raw: buf.length, gzip: gzipSync(buf, { level: GZIP_LEVEL }).length });
const total = (rows) => rows.reduce((t, r) => ({ raw: t.raw + r.raw, gzip: t.gzip + r.gzip }), { raw: 0, gzip: 0 });

// Resources loaded by the cold navigation: Script/Stylesheet requests in each used run's network log
// that are same-origin under the base path. Anything else cannot be sized from the build and is flagged.
const expected = new URL(expectedUrl);
const loadedByRun = used.map((a) => {
  const paths = new Map(); // built file path -> Lighthouse resourceSize (decoded bytes, verification only)
  const unresolved = [];
  const items = a.report.audits?.['network-requests']?.details?.items ?? [];
  for (const item of items) {
    if (item.resourceType !== 'Script' && item.resourceType !== 'Stylesheet') continue;
    const url = new URL(item.url);
    if (url.origin !== expected.origin || !url.pathname.startsWith(expected.pathname)) unresolved.push(item.url);
    else paths.set(posix.normalize(decodeURIComponent(url.pathname.slice(expected.pathname.length))), item.resourceSize);
  }
  return { attempt: a.attempt, paths, unresolved };
});
const pathKey = (set) => [...set].sort().join('\n');
const loadedSetConsistent = new Set(loadedByRun.map((r) => pathKey(r.paths.keys()))).size <= 1;
const unresolvedRequests = loadedByRun.flatMap((r) => r.unresolved.map((url) => ({ attempt: r.attempt, url })));

// Union of every loaded path and every index.html reference, de-duplicated by built file path.
const allPaths = new Set([...refs.keys(), ...loadedByRun.flatMap((r) => [...r.paths.keys()])]);
// Hashed filenames change between builds; the stem (content hash removed) is informational only.
const stemOf = (path) => path.replace(/-[A-Z0-9]{8}(?=\.[^./]+$)/, '');

const externalJs = [];
const externalCss = [];
const resourceSizeMismatches = [];
for (const path of [...allPaths].sort()) {
  const buf = readFileSync(join(distDir, path));
  const inHtml = refs.has(path);
  const loadedInRuns = loadedByRun.filter((r) => r.paths.has(path)).length;
  const row = {
    path,
    stem: stemOf(path),
    role: inHtml ? 'html-referenced' : 'startup-loaded',
    htmlReferences: inHtml ? [...refs.get(path)].sort() : [],
    loadedInRuns,
    ...sizes(buf),
  };
  for (const r of loadedByRun) {
    const reported = r.paths.get(path);
    if (reported != null && reported !== buf.length)
      resourceSizeMismatches.push({ attempt: r.attempt, path, lighthouseResourceSize: reported, fileBytes: buf.length });
  }
  if (path.endsWith('.css')) externalCss.push(row);
  else if (path.endsWith('.js') || path.endsWith('.mjs')) externalJs.push(row);
  else unresolvedRequests.push({ attempt: null, url: path, reason: 'unexpected extension' });
}
const htmlNotLoaded = [...refs.keys()].filter((p) => !loadedByRun.some((r) => r.paths.has(p)));

// Angular-inlined critical CSS: each <style> element's text is sized and gzipped on its own.
const inlineCss = [...html.matchAll(/<style\b([^>]*)>([\s\S]*?)<\/style>/gi)].map((m, i) => ({
  index: i,
  ...sizes(Buffer.from(m[2], 'utf8')),
}));
// Inline <script> elements without src are reported for transparency; not part of the JS total.
const inlineJs = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
  .filter((m) => !attrs(m[1]).src)
  .map((m, i) => ({ index: i, ...sizes(Buffer.from(m[2], 'utf8')) }));

const assetChecks = {
  loadedSetConsistentAcrossRuns: loadedSetConsistent,
  unresolvedRequests,
  lighthouseResourceSizeMismatches: resourceSizeMismatches,
  htmlReferencedButNotLoaded: htmlNotLoaded,
};
const assetsOk = loadedSetConsistent && unresolvedRequests.length === 0 && resourceSizeMismatches.length === 0 && used.length > 0;

const assets = {
  method:
    `Size set: every Script and Stylesheet request in the Lighthouse network-requests audit of each of the five used (valid) cold runs ` +
    `(the navigation through the settled gallery page) that is same-origin under the base path, unioned with the <script src>, <link rel=stylesheet> ` +
    `and <link rel=modulepreload> URLs in dist index.html (<noscript> excluded), de-duplicated by built file path. ` +
    `The extraction fails if the loaded set differs between runs, if any request cannot be resolved to a build file, or if Lighthouse's resourceSize disagrees with the file's bytes. ` +
    `Sizes come only from the production-build files: raw = file bytes; gzip = zlib gzip level ${GZIP_LEVEL} of those bytes. ` +
    `Lighthouse transfer sizes are never used as gzip sizes; resourceSize is used only to verify the file match. ` +
    `Inline CSS = each <style> element's text in index.html (UTF-8) sized and gzipped individually, then summed. ` +
    `Combined CSS = external + inline. JS total = loaded external files only; inline <script> blocks are listed separately and excluded from every total. ` +
    `Compare before and after by the totals only: filenames carry content hashes and the file set may change between builds, so the per-file stem field in summary.json is informational only.` +
    `The identical script and rule are applied to the after measurement.`,
  checks: assetChecks,
  js: { files: externalJs, total: total(externalJs) },
  css: {
    external: { files: externalCss, total: total(externalCss) },
    inline: { blocks: inlineCss, total: total(inlineCss) },
    combined: total([...externalCss, ...inlineCss]),
  },
  inlineJs: { blocks: inlineJs, total: total(inlineJs) },
  jsPlusCssCombined: total([...externalJs, ...externalCss, ...inlineCss]),
  indexHtml: { sha256: sha256(readFileSync(join(distDir, 'index.html'))), ...sizes(readFileSync(join(distDir, 'index.html'))) },
};

// ---------- Summary ----------
const perRun = used.map((a) => ({
  attempt: a.attempt,
  ...a.metrics,
  benchmarkIndex: a.benchmarkIndex,
  slowHostCpuWarning: a.slowHostCpuWarning,
}));
const medians = Object.fromEntries(Object.keys(METRICS).map((k) => [k, perRun.length ? median(perRun.map((r) => r[k])) : null]));
const ok = used.length === REQUIRED_RUNS && attempts.length <= MAX_ATTEMPTS && configConsistent && assetsOk;

const summary = {
  result: ok ? 'PASS: five valid cold runs' : 'FAIL',
  requiredRuns: REQUIRED_RUNS,
  attemptsTotal: attempts.length,
  maxAttempts: MAX_ATTEMPTS,
  validRunsUsed: used.length,
  configConsistentAcrossValidRuns: configConsistent,
  expected: EXPECTED,
  runs: perRun,
  medians,
  attempts: attempts.map(({ report: _r, ...rest }) => rest),
  assets,
};

writeFileSync(join(outDir, 'summary.json'), JSON.stringify(summary, null, 2) + '\n');

const f = (n, d = 0) => (n == null ? 'n/a' : Number(n).toFixed(d));
const kb = (n) => `${n.toLocaleString('en-US')} B`;
const md = [];
md.push('# D-12 before-measurement summary', '');
md.push(`Result: **${summary.result}** (${summary.validRunsUsed} valid of ${summary.attemptsTotal} attempts; limit ${MAX_ATTEMPTS}).`, '');
md.push('Baseline evidence only. It makes no performance, accessibility or maintainability improvement claim.', '');
md.push(
  `Accepted caveat (Moderator decision, option A): Lighthouse reported its slow-host-CPU warning on ${perRun.filter((r) => r.slowHostCpuWarning).length} of ${perRun.length} used runs (benchmarkIndex below its threshold of 1000). Absolute LCP and TBT are therefore inflated and noisier; the after run must use the same machine and tooling.`,
  '',
);
md.push('## Lighthouse runs (valid, in order)', '', '| Attempt | LCP (ms) | CLS | TBT (ms) | benchmarkIndex |', '|---|---:|---:|---:|---:|');
for (const r of perRun) md.push(`| ${r.attempt} | ${f(r.lcpMs, 1)} | ${f(r.cls, 4)} | ${f(r.tbtMs, 1)} | ${f(r.benchmarkIndex)} |`);
md.push(`| **Median** | **${f(medians.lcpMs, 1)}** | **${f(medians.cls, 4)}** | **${f(medians.tbtMs, 1)}** | |`, '');
md.push('## All attempts', '', '| Attempt | Valid | Reasons |', '|---|---|---|');
for (const a of summary.attempts) md.push(`| ${a.attempt} | ${a.valid ? 'yes' : 'no'} | ${a.reasons.join('; ') || ''} |`);
md.push('', '## JavaScript loaded by the cold navigation (external files)', '', '| File | Role | Loaded in runs | Raw | Gzip (L9) |', '|---|---|---:|---:|---:|');
for (const r of externalJs) md.push(`| ${r.path} | ${r.role} | ${r.loadedInRuns}/${used.length} | ${kb(r.raw)} | ${kb(r.gzip)} |`);
md.push(`| **Total** | | | **${kb(assets.js.total.raw)}** | **${kb(assets.js.total.gzip)}** |`, '');
md.push('## CSS loaded by the cold navigation', '', '| Source | Raw | Gzip (L9) |', '|---|---:|---:|');
for (const r of externalCss) md.push(`| external ${r.path} (${r.role}, ${r.loadedInRuns}/${used.length} runs) | ${kb(r.raw)} | ${kb(r.gzip)} |`);
md.push(`| **External total** | **${kb(assets.css.external.total.raw)}** | **${kb(assets.css.external.total.gzip)}** |`);
for (const b of inlineCss) md.push(`| inline <style> #${b.index} | ${kb(b.raw)} | ${kb(b.gzip)} |`);
md.push(`| **Inline total** | **${kb(assets.css.inline.total.raw)}** | **${kb(assets.css.inline.total.gzip)}** |`);
md.push(`| **Combined CSS** | **${kb(assets.css.combined.raw)}** | **${kb(assets.css.combined.gzip)}** |`, '');
md.push(`JS + combined CSS: raw ${kb(assets.jsPlusCssCombined.raw)}, gzip ${kb(assets.jsPlusCssCombined.gzip)}.`, '');
if (inlineJs.length) md.push(`Inline <script> blocks (not in JS total): ${JSON.stringify(inlineJs)}`, '');
md.push('## Method', '', assets.method, '');
md.push(
  '## Size-set checks',
  '',
  `- Loaded set identical across the ${used.length} used runs: ${assetChecks.loadedSetConsistentAcrossRuns ? 'yes' : 'NO'}.`,
  `- Requests that could not be resolved to a build file: ${assetChecks.unresolvedRequests.length}.`,
  `- Lighthouse resourceSize disagreements with build-file bytes: ${assetChecks.lighthouseResourceSizeMismatches.length}.`,
  `- Referenced by index.html but not loaded in any run: ${JSON.stringify(assetChecks.htmlReferencedButNotLoaded)}.`,
  '',
);
writeFileSync(join(outDir, 'summary.md'), md.join('\n'));

console.log(JSON.stringify({ result: summary.result, attempts: attempts.length, valid: valid.length, medians, configConsistent }, null, 2));
process.exit(ok ? 0 : 2);
