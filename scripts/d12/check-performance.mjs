// D-12 regression threshold check (S-18, AC-26, A-19).
//
// Compares the after measurement with the frozen v1.0.0 baseline and fails on any breach. Limits are
// computed at full precision from the hash-verified baseline medians; none is stored as a constant
// and none may be relaxed:
//
//   LCP          baseline + max(10%, 150 ms)
//   TBT          baseline + max(10%, 50 ms)
//   CLS          min(baseline + 0.02, 0.10)   (0.10 is a hard ceiling)
//   JS+CSS gzip  baseline + max(5%, 10 KiB)   (startup JS plus combined CSS, gzip level 9)
//
// A metric breaches only when after > limit, so a value equal to its limit passes.
// Exit codes: 0 = within thresholds; 1 = at least one breach; 2 = invalid or incomplete evidence.
// The report states figures only. It makes no performance-benefit claim, and a timing breach is not
// attributed to the code: the host is a slow, noisy development laptop (see the Known limits).
//
// Usage: node check-performance.mjs [baseline-dir] [after-dir]
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const KIB = 1024;
export const RULES = {
  lcpMs: { label: 'LCP', unit: 'ms', limit: (b) => b + Math.max(0.1 * b, 150) },
  tbtMs: { label: 'TBT', unit: 'ms', limit: (b) => b + Math.max(0.1 * b, 50) },
  cls: { label: 'CLS', unit: '', limit: (b) => Math.min(b + 0.02, 0.1) },
  gzipBytes: { label: 'JS+CSS gzip', unit: 'B', limit: (b) => b + Math.max(0.05 * b, 10 * KIB) },
};
const REQUIRED_RUNS = 5;

const median = (values) => {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = sorted.length >> 1;
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
};

/** The four compared figures of a summary.json, or the reasons it cannot be used. */
export function figures(summary, name) {
  const problems = [];
  const runs = summary?.runs ?? [];
  if (!String(summary?.result ?? '').startsWith('PASS'))
    problems.push(`${name}: result is not PASS`);
  if (summary?.validRunsUsed !== REQUIRED_RUNS || runs.length !== REQUIRED_RUNS)
    problems.push(`${name}: expected ${REQUIRED_RUNS} valid runs, found ${runs.length}`);
  if (summary?.configConsistentAcrossValidRuns !== true)
    problems.push(`${name}: run configuration is not consistent`);
  const result = {};
  for (const key of ['lcpMs', 'cls', 'tbtMs']) {
    const value = summary?.medians?.[key];
    if (typeof value !== 'number' || !Number.isFinite(value))
      problems.push(`${name}: median ${key} missing`);
    else if (runs.length && value !== median(runs.map((r) => r[key])))
      problems.push(`${name}: median ${key} does not equal the median of its runs`);
    result[key] = value;
  }
  const gzip = summary?.assets?.jsPlusCssCombined?.gzip;
  if (!Number.isInteger(gzip)) problems.push(`${name}: JS+CSS gzip size missing`);
  result.gzipBytes = gzip;
  const checks = summary?.assets?.checks;
  if (
    checks?.loadedSetConsistentAcrossRuns !== true ||
    checks?.unresolvedRequests?.length !== 0 ||
    checks?.lighthouseResourceSizeMismatches?.length !== 0
  )
    problems.push(`${name}: size-set checks did not pass`);
  const configHashes = new Set(
    (summary?.attempts ?? []).filter((a) => a.valid).map((a) => a.configHash),
  );
  if (configHashes.size !== 1) problems.push(`${name}: valid runs do not share one config hash`);
  return { figures: result, configHash: [...configHashes][0], problems };
}

/** Evaluates after against baseline. Pure: equality passes, anything above the limit breaches. */
export function evaluate(baseline, after) {
  return Object.entries(RULES).map(([key, rule]) => {
    const limit = rule.limit(baseline[key]);
    return {
      key,
      label: rule.label,
      unit: rule.unit,
      baseline: baseline[key],
      after: after[key],
      limit,
      breach: after[key] > limit,
    };
  });
}

const sha256 = (data) => createHash('sha256').update(data).digest('hex');
const fmt = (n, unit) => {
  const digits = unit === '' ? 6 : unit === 'B' ? 0 : 4;
  return `${Number(n).toFixed(digits)}${unit ? ` ${unit}` : ''}`;
};

/** Reads and verifies both summaries; returns the comparison. Throws on invalid evidence. */
export function compare(beforeDir, afterDir) {
  const problems = [];
  const baselineBytes = readFileSync(join(beforeDir, 'summary.json'));
  const recorded = readFileSync(join(beforeDir, 'hashes.sha256'), 'utf8')
    .split(/\r?\n/)
    .map((line) => /^([0-9a-f]{64}) \*\.\/summary\.json$/.exec(line)?.[1])
    .find(Boolean);
  if (!recorded) problems.push('baseline hashes.sha256 has no summary.json entry');
  else if (recorded !== sha256(baselineBytes))
    problems.push('baseline summary.json does not match its recorded SHA-256');

  const baselineSummary = JSON.parse(baselineBytes.toString('utf8'));
  const afterSummary = JSON.parse(readFileSync(join(afterDir, 'summary.json'), 'utf8'));
  const baseline = figures(baselineSummary, 'baseline');
  const after = figures(afterSummary, 'after');
  problems.push(...baseline.problems, ...after.problems);
  if (baseline.configHash && baseline.configHash !== after.configHash)
    problems.push(
      `after config hash ${after.configHash} differs from baseline ${baseline.configHash}`,
    );

  const bench = (summary) => summary.runs.map((r) => r.benchmarkIndex);
  const range = (values) => [Math.min(...values), Math.max(...values)];
  const host = problems.length
    ? null
    : {
        baselineBenchmarkIndex: range(bench(baselineSummary)),
        afterBenchmarkIndex: range(bench(afterSummary)),
      };
  return {
    problems,
    rows: problems.length ? [] : evaluate(baseline.figures, after.figures),
    host,
    baselineSha256: recorded,
    configHash: baseline.configHash,
  };
}

function report({ rows, host, baselineSha256, configHash }) {
  const breached = rows.filter((r) => r.breach);
  const lines = [
    '# D-12 regression threshold check',
    '',
    `Result: **${breached.length ? 'BREACH' : 'WITHIN THRESHOLDS'}**`,
    '',
    'Figures only. This check makes no performance-benefit claim, and a timing breach is not attributed to the code.',
    '',
    '| Metric | Baseline | After | Limit | Result |',
    '|---|---:|---:|---:|---|',
    ...rows.map(
      (r) =>
        `| ${r.label} | ${fmt(r.baseline, r.unit)} | ${fmt(r.after, r.unit)} | ${fmt(r.limit, r.unit)} | ${r.breach ? 'BREACH' : 'within'} |`,
    ),
    '',
    'Rules: LCP +max(10%, 150 ms); TBT +max(10%, 50 ms); CLS +0.02 with a hard ceiling of 0.10; JS+CSS gzip +max(5%, 10 KiB). A value equal to its limit passes.',
    '',
    `Baseline summary.json SHA-256: ${baselineSha256}`,
    `Shared Lighthouse config hash: ${configHash}`,
    `Host benchmarkIndex range: baseline ${host.baselineBenchmarkIndex.join(' to ')}, after ${host.afterBenchmarkIndex.join(' to ')} (recorded, not a pass/fail input; Lighthouse's slow-host threshold is 1000).`,
    '',
  ];
  return lines.join('\n');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const root = fileURLToPath(new URL('../../', import.meta.url));
  const [
    beforeDir = join(root, 'mod-w/evidence/d-12/before'),
    afterDir = join(root, 'mod-w/evidence/d-12/after'),
  ] = process.argv.slice(2);
  let result;
  try {
    result = compare(beforeDir, afterDir);
  } catch (error) {
    console.error(`check:performance: cannot read evidence: ${error.message}`);
    process.exit(2);
  }
  if (result.problems.length) {
    console.error('check:performance: invalid or incomplete evidence:');
    for (const problem of result.problems) console.error(`  - ${problem}`);
    process.exit(2);
  }
  const markdown = report(result);
  writeFileSync(join(afterDir, 'threshold.md'), markdown);
  writeFileSync(
    join(afterDir, 'threshold.json'),
    JSON.stringify(
      {
        result: result.rows.some((r) => r.breach) ? 'BREACH' : 'WITHIN THRESHOLDS',
        ...result,
        problems: undefined,
      },
      null,
      2,
    ) + '\n',
  );
  console.log(markdown);
  const breached = result.rows.filter((r) => r.breach);
  if (breached.length) {
    console.error(
      `check:performance: ${breached.length} threshold breach(es): ${breached.map((r) => r.label).join(', ')}`,
    );
    process.exit(1);
  }
}
