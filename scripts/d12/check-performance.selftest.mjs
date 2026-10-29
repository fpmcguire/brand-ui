// Self-test for the D-12 threshold check: full-precision limits, boundary semantics, the CLS
// ceiling, the percentage-versus-absolute choice, and rejection of invalid evidence.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { RULES, compare, evaluate, figures } from './check-performance.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const beforeDir = `${root}mod-w/evidence/d-12/before`;

const nextUp = (x) => {
  const f = new Float64Array([x]);
  new BigInt64Array(f.buffer)[0] += 1n;
  return f[0];
};
const nextDown = (x) => {
  const f = new Float64Array([x]);
  new BigInt64Array(f.buffer)[0] -= 1n;
  return f[0];
};
const near = (actual, expected, message) =>
  assert.ok(Math.abs(actual - expected) < 1e-9, `${message}: ${actual} vs ${expected}`);

// --- The frozen baseline reproduces the reference limits (not rounded constants) ----------------
const baselineSummary = JSON.parse(readFileSync(`${beforeDir}/summary.json`, 'utf8'));
const baseline = figures(baselineSummary, 'baseline');
assert.deepEqual(baseline.problems, [], 'the frozen baseline summary is valid');
assert.equal(baseline.figures.gzipBytes, 89050);
near(RULES.lcpMs.limit(baseline.figures.lcpMs), 2815.61071, 'LCP limit');
near(RULES.tbtMs.limit(baseline.figures.tbtMs), 693, 'TBT limit');
assert.equal(RULES.cls.limit(baseline.figures.cls), baseline.figures.cls + 0.02, 'CLS limit');
near(RULES.cls.limit(baseline.figures.cls), 0.05502823531995759, 'CLS limit value');
assert.equal(RULES.gzipBytes.limit(baseline.figures.gzipBytes), 99290, 'size limit (10 KiB floor)');

// --- Boundary semantics per metric: equal passes, the next representable value breaches ---------
for (const [key, rule] of Object.entries(RULES)) {
  const b = baseline.figures[key];
  const limit = rule.limit(b);
  const at = evaluate(baseline.figures, { ...baseline.figures, [key]: limit }).find(
    (r) => r.key === key,
  );
  assert.equal(at.breach, false, `${key}: a value equal to its limit passes`);
  const over = evaluate(baseline.figures, { ...baseline.figures, [key]: nextUp(limit) }).find(
    (r) => r.key === key,
  );
  assert.equal(over.breach, true, `${key}: the next value above the limit breaches`);
  const under = evaluate(baseline.figures, { ...baseline.figures, [key]: nextDown(limit) }).find(
    (r) => r.key === key,
  );
  assert.equal(under.breach, false, `${key}: the next value below the limit passes`);
}
// An unchanged measurement passes every rule.
assert.ok(evaluate(baseline.figures, baseline.figures).every((r) => !r.breach));

// --- Percentage versus absolute floor ----------------------------------------------------------
assert.equal(RULES.lcpMs.limit(1000), 1150, 'LCP: the 150 ms floor binds below 1500 ms');
assert.equal(RULES.lcpMs.limit(3000), 3300, 'LCP: 10% binds above 1500 ms');
assert.equal(RULES.tbtMs.limit(100), 150, 'TBT: the 50 ms floor binds below 500 ms');
assert.equal(RULES.tbtMs.limit(1000), 1100, 'TBT: 10% binds above 500 ms');
assert.equal(RULES.gzipBytes.limit(100000), 110240, 'size: the 10 KiB floor binds below 204800 B');
assert.equal(RULES.gzipBytes.limit(300000), 315000, 'size: 5% binds above 204800 B');

// --- CLS hard ceiling --------------------------------------------------------------------------
assert.equal(
  RULES.cls.limit(0.09),
  0.1,
  'CLS: the 0.10 ceiling binds when baseline + 0.02 exceeds it',
);
assert.equal(RULES.cls.limit(0.2), 0.1, 'CLS: the ceiling holds above a 0.10 baseline');
assert.equal(RULES.cls.limit(0), 0.02, 'CLS: +0.02 binds from a zero baseline');

// --- Evidence validation -----------------------------------------------------------------------
const run = (n, lcp, cls, tbt) => ({
  attempt: n,
  lcpMs: lcp,
  cls,
  tbtMs: tbt,
  benchmarkIndex: 800,
});
const fixture = (overrides = {}) => {
  const runs = [
    run(1, 2500, 0.03, 600),
    run(2, 2600, 0.03, 650),
    run(3, 2700, 0.03, 700),
    run(4, 2800, 0.04, 0),
    run(5, 2900, 0.05, 0),
  ];
  return {
    result: 'PASS: five valid cold runs',
    validRunsUsed: 5,
    configConsistentAcrossValidRuns: true,
    runs,
    medians: { lcpMs: 2700, cls: 0.03, tbtMs: 600 },
    attempts: runs.map((r) => ({ valid: true, configHash: 'abc' })),
    assets: {
      jsPlusCssCombined: { raw: 1, gzip: 89050 },
      checks: {
        loadedSetConsistentAcrossRuns: true,
        unresolvedRequests: [],
        lighthouseResourceSizeMismatches: [],
      },
    },
    ...overrides,
  };
};
assert.deepEqual(figures(fixture(), 'x').problems, [], 'a complete fixture is accepted');
const rejected = (overrides, text) =>
  assert.ok(
    figures(fixture(overrides), 'x').problems.some((p) => p.includes(text)),
    `rejects: ${text}`,
  );
rejected({ result: 'FAIL' }, 'not PASS');
rejected({ validRunsUsed: 4 }, 'valid runs');
rejected({ configConsistentAcrossValidRuns: false }, 'not consistent');
rejected({ medians: { lcpMs: 2700, cls: 0.03 } }, 'median tbtMs missing');
rejected({ medians: { lcpMs: 1, cls: 0.03, tbtMs: 600 } }, 'does not equal the median');
rejected({ assets: { jsPlusCssCombined: {}, checks: {} } }, 'gzip size missing');
rejected(
  {
    attempts: [
      { valid: true, configHash: 'a' },
      { valid: true, configHash: 'b' },
    ],
  },
  'one config hash',
);

// The frozen baseline compared with itself is within thresholds and carries its recorded hash.
const self = compare(beforeDir, beforeDir);
assert.deepEqual(self.problems, []);
assert.ok(
  self.rows.every((r) => !r.breach),
  'baseline against itself is within thresholds',
);
assert.match(self.baselineSha256, /^[0-9a-f]{64}$/);

console.log('check-performance self-test: all assertions passed');
