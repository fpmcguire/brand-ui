// D-12 after-measurement orchestrator (S-18, AC-26, A-19).
//
// Re-runs the baseline's conditions against the production /brand-ui/ build in dist/gallery/browser:
// the frozen baseline server, the pinned Lighthouse 13.5.0 CLI with the baseline arguments, five
// cold runs (one Node process and one fresh Chrome profile each, storage reset enabled), then the
// shared extractor. Evidence goes to mod-w/evidence/d-12/after/. It never edits the baseline.
//
// Preconditions are checked before any run and any mismatch exits non-zero without measuring:
// Node v26.0.0 and npm 11.12.1, tooling and server hashes, baseline hashes, Chrome for Testing
// 156.0.8078.4, the Balanced power plan, ports 4310 and 4320 free, a built /brand-ui/ output.
// The measurement makes no performance-benefit claim. Run it under `fnm exec --using=26.0.0`.
import { spawn, execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import {
  copyFileSync,
  createWriteStream,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import net from 'node:net';
import os from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';

const root = fileURLToPath(new URL('../../', import.meta.url));
const BEFORE = join(root, 'mod-w/evidence/d-12/before');
const AFTER = join(root, 'mod-w/evidence/d-12/after');
const DIST = join(root, 'dist/gallery/browser');
const TOOLING_SRC = join(root, 'scripts/d12/tooling');
const SERVE = join(BEFORE, 'scripts/serve.mjs');
const EXTRACT = join(root, 'scripts/d12/extract.mjs');
const WORK = join(os.tmpdir(), 'bui-d12-after');

const EXPECTED = {
  node: 'v26.0.0',
  npm: '11.12.1',
  chrome: '156.0.8078.4',
  lighthouse: '13.5.0',
  powerPlan: /\(Balanced\)/,
  hashes: {
    'scripts/d12/tooling/package.json':
      '7bb6a8563a5f7e98a81994f94a37e6a8c8deee95f42819d4bd564800d3528740',
    'scripts/d12/tooling/package-lock.json':
      'd10511466828c7b1a28f6d671c7729b76017b98db67aaf6cd2435dfc02df44eb',
    'mod-w/evidence/d-12/before/scripts/serve.mjs':
      '0fa43298fe6c5becc1d26e926177b1217ea461ae33151dec11603e983bcf1b84',
  },
  configHash: '80bad53803f8f14b469b4f6e19a31ec73d81d51084d16a6dba0707aafa285eaf',
};
const PORT = 4320;
const PLAYWRIGHT_PORT = 4310;
const URL_UNDER_TEST = `http://localhost:${PORT}/brand-ui/`;
const REQUIRED_RUNS = 5;
const MAX_ATTEMPTS = 7;

const sha256 = (data) => createHash('sha256').update(data).digest('hex');
const fileHash = (path) => sha256(readFileSync(path));
const git = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
const powershell = (command) =>
  execFileSync('powershell.exe', ['-NoProfile', '-Command', command], { encoding: 'utf8' }).trim();

let onStop = () => {};
function stop(message) {
  console.error(`measure:gallery:after: STOP: ${message}`);
  onStop();
  process.exit(2);
}
const need = (condition, message) => {
  if (!condition) stop(message);
};

// ---------- Preconditions (no measurement until all pass) ----------
need(process.version === EXPECTED.node, `Node is ${process.version}, expected ${EXPECTED.node}`);
const npmDir = join(dirname(process.execPath), 'node_modules', 'npm');
need(existsSync(join(npmDir, 'package.json')), `npm not found beside ${process.execPath}`);
const npmVersion = JSON.parse(readFileSync(join(npmDir, 'package.json'), 'utf8')).version;
need(npmVersion === EXPECTED.npm, `npm is ${npmVersion}, expected ${EXPECTED.npm}`);

for (const [path, hash] of Object.entries(EXPECTED.hashes))
  need(fileHash(join(root, path)) === hash, `${path} does not match its recorded SHA-256`);

const recorded = readFileSync(join(BEFORE, 'hashes.sha256'), 'utf8')
  .split(/\r?\n/)
  .filter(Boolean)
  .map((line) => /^([0-9a-f]{64}) \*\.\/(.+)$/.exec(line));
need(recorded.length > 0 && recorded.every(Boolean), 'baseline hashes.sha256 is malformed');
for (const [, hash, path] of recorded)
  need(fileHash(join(BEFORE, path)) === hash, `baseline file ${path} does not match hashes.sha256`);

const chromePath = chromium.executablePath();
need(existsSync(chromePath), `Chromium not found at ${chromePath}`);
const chromeVersion = powershell(`(Get-Item '${chromePath}').VersionInfo.FileVersion`);
need(chromeVersion === EXPECTED.chrome, `Chrome is ${chromeVersion}, expected ${EXPECTED.chrome}`);

const powerPlan = powershell('powercfg /getactivescheme');
need(EXPECTED.powerPlan.test(powerPlan), `power plan is not Balanced: ${powerPlan}`);
const batteryStatus = powershell(
  '$b = Get-CimInstance Win32_Battery; if ($b) { $b.BatteryStatus } else { "none" }',
);
need(batteryStatus !== '1', 'the host is running on battery power (BatteryStatus 1)');

const portOpen = (port, host) =>
  new Promise((resolve) => {
    const socket = net.connect({ port, host });
    socket.setTimeout(1000);
    socket.once('connect', () => (socket.destroy(), resolve(true)));
    socket.once('timeout', () => (socket.destroy(), resolve(false)));
    socket.once('error', () => resolve(false));
  });
for (const port of [PLAYWRIGHT_PORT, PORT])
  for (const host of ['127.0.0.1', '::1'])
    need(!(await portOpen(port, host)), `port ${port} already has a listener on ${host}`);

const indexPath = join(DIST, 'index.html');
need(
  existsSync(indexPath),
  'dist/gallery/browser/index.html is missing; run npm run build:subfolder',
);
need(
  /<base href="\/brand-ui\/">/.test(readFileSync(indexPath, 'utf8')),
  'the build does not use base href /brand-ui/; run npm run build:subfolder',
);
need(
  !existsSync(join(AFTER, 'summary.json')),
  'after evidence already exists; it is not overwritten',
);

const rootLockBefore = fileHash(join(root, 'package-lock.json'));
const headCommit = git('rev-parse', 'HEAD');
const projectsTree = git('rev-parse', 'HEAD:projects');
const statusBefore = git('status', '--short');

// ---------- Pinned Lighthouse tooling, installed outside the repository ----------
mkdirSync(join(AFTER, 'reports'), { recursive: true });
mkdirSync(join(AFTER, 'logs'), { recursive: true });
rmSync(WORK, { recursive: true, force: true });
mkdirSync(join(WORK, 'tools'), { recursive: true });
for (const name of ['package.json', 'package-lock.json'])
  copyFileSync(join(TOOLING_SRC, name), join(WORK, 'tools', name));
need(
  fileHash(join(WORK, 'tools/package.json')) ===
    EXPECTED.hashes['scripts/d12/tooling/package.json'] &&
    fileHash(join(WORK, 'tools/package-lock.json')) ===
      EXPECTED.hashes['scripts/d12/tooling/package-lock.json'],
  'the tooling copy does not match the pinned files',
);
const install = execFileSync(
  process.execPath,
  [join(npmDir, 'bin/npm-cli.js'), 'ci', '--ignore-scripts', '--no-audit', '--no-fund'],
  {
    cwd: join(WORK, 'tools'),
    encoding: 'utf8',
    env: { ...process.env, NG_CLI_ANALYTICS: 'false' },
  },
);
writeFileSync(join(AFTER, 'logs/tools-install.log'), install);
const lighthouseCli = join(WORK, 'tools/node_modules/lighthouse/cli/index.js');
const lighthouseVersion = JSON.parse(
  readFileSync(join(WORK, 'tools/node_modules/lighthouse/package.json'), 'utf8'),
).version;
need(lighthouseVersion === EXPECTED.lighthouse, `Lighthouse is ${lighthouseVersion}`);
const chromeLauncherVersion = JSON.parse(
  readFileSync(join(WORK, 'tools/node_modules/chrome-launcher/package.json'), 'utf8'),
).version;

// ---------- Host record ----------
const processes = powershell(
  'Get-Process | Sort-Object CPU -Descending | Select-Object -First 15 Name, CPU | Format-Table -AutoSize | Out-String',
);
const cpu = os.cpus();
writeFileSync(
  join(AFTER, 'logs/host.txt'),
  [
    `CPU=${cpu[0].model} logical=${cpu.length}`,
    `RAMGB=${(os.totalmem() / 2 ** 30).toFixed(1)} OS=${os.type()} ${os.release()}`,
    `POWER=${powerPlan}`,
    `BatteryStatus=${batteryStatus} (2 = AC power; "none" = no battery)`,
    `Recorded: ${new Date().toISOString()}`,
    'Top processes by cumulative CPU time at measurement start (other programs were not closed by this script):',
    processes,
    '',
  ].join('\n'),
);

// ---------- Owned server ----------
const serverLog = createWriteStream(join(AFTER, 'logs/server.log'));
const server = spawn(process.execPath, [SERVE, DIST, String(PORT), '/brand-ui/'], {
  stdio: ['ignore', 'pipe', 'pipe'],
});
server.stdout.pipe(serverLog, { end: false });
server.stderr.pipe(serverLog, { end: false });
let serverOutput = '';
server.stdout.on('data', (chunk) => (serverOutput += chunk));
const serverExited = new Promise((resolve) => server.once('exit', resolve));
onStop = () => server.kill();

async function launchAttempt(n) {
  const profile = join(WORK, 'profiles', `p${n}`);
  rmSync(profile, { recursive: true, force: true });
  mkdirSync(profile, { recursive: true });
  const report = join(AFTER, 'reports', `attempt-${n}.json`);
  const log = createWriteStream(join(AFTER, 'reports', `attempt-${n}.log`));
  const child = spawn(
    process.execPath,
    [
      lighthouseCli,
      URL_UNDER_TEST,
      '--form-factor=mobile',
      '--throttling-method=simulate',
      '--only-categories=performance',
      `--chrome-flags=--headless=new --user-data-dir=${profile}`,
      '--output=json',
      `--output-path=${report}`,
    ],
    {
      stdio: ['ignore', 'pipe', 'pipe'],
      env: { ...process.env, CHROME_PATH: chromePath, NG_CLI_ANALYTICS: 'false' },
    },
  );
  child.stdout.pipe(log, { end: false });
  child.stderr.pipe(log, { end: false });
  const code = await new Promise((resolve) => child.once('exit', resolve));
  log.end(`\nattempt ${n} exit: ${code}\n`);
  console.log(`attempt ${n} exit: ${code}`);
  return code;
}

function extract() {
  try {
    execFileSync(
      process.execPath,
      [EXTRACT, join(AFTER, 'reports'), DIST, AFTER, URL_UNDER_TEST, 'after-measurement'],
      { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] },
    );
    return true;
  } catch (error) {
    console.error(String(error.stdout ?? '') + String(error.stderr ?? ''));
    return false;
  }
}

let attempts = 0;
let ok = false;
try {
  const deadline = Date.now() + 15_000;
  while (!/listening/.test(serverOutput)) {
    need(Date.now() < deadline && server.exitCode === null, 'the measurement server did not start');
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  const served = await fetch(URL_UNDER_TEST, { headers: { 'Accept-Encoding': 'identity' } });
  need(
    served.ok && sha256(Buffer.from(await served.arrayBuffer())) === fileHash(indexPath),
    'the served index.html is not the built dist/gallery/browser/index.html',
  );

  while (!ok && attempts < MAX_ATTEMPTS) {
    // Five attempts first; a replacement is launched only after extraction reports fewer than five valid runs.
    const batch = attempts === 0 ? REQUIRED_RUNS : 1;
    for (let i = 0; i < batch; i++) await launchAttempt(++attempts);
    ok = extract();
  }
} finally {
  server.kill();
  await serverExited;
  serverLog.end();
}

// ---------- Evidence ----------
const rootLockAfter = fileHash(join(root, 'package-lock.json'));
const summaryPath = join(AFTER, 'summary.json');
const summary = existsSync(summaryPath) ? JSON.parse(readFileSync(summaryPath, 'utf8')) : null;
writeFileSync(
  join(AFTER, 'env.json'),
  JSON.stringify(
    {
      purpose:
        'D-12 after-measurement (S-18, AC-26, A-19). Measurement evidence only; makes no performance, accessibility or maintainability improvement claim.',
      measuredAt: new Date().toISOString(),
      repository: {
        head: headCommit,
        projectsTree,
        statusBeforeMeasurement: statusBefore.split('\n').filter(Boolean),
        rootPackageLockSha256: { before: rootLockBefore, after: rootLockAfter },
        indexHtmlSha256: fileHash(indexPath),
      },
      tools: {
        node: process.version,
        npm: npmVersion,
        lighthouse: lighthouseVersion,
        chromeLauncher: chromeLauncherVersion,
        chromium: chromeVersion,
        chromiumPath: chromePath,
        playwright: JSON.parse(
          readFileSync(join(root, 'node_modules/@playwright/test/package.json'), 'utf8'),
        ).version,
        toolingInstall:
          'npm ci --ignore-scripts from the pinned scripts/d12/tooling files, installed outside the repository',
        toolingFileSha256: EXPECTED.hashes,
        serverScript:
          'mod-w/evidence/d-12/before/scripts/serve.mjs (frozen baseline file, hash verified)',
      },
      host: {
        cpu: `${cpu[0].model} logical=${cpu.length}`,
        ramGB: Number((os.totalmem() / 2 ** 30).toFixed(1)),
        os: `${os.type()} ${os.release()}`,
        powerPlan,
        batteryStatus: `${batteryStatus} (2 = AC power)`,
        note: 'Development laptop, not CI. Baseline AC-power state was not recorded, so AC-power parity with the baseline is not claimed.',
      },
      lighthouseConfiguration: {
        url: URL_UNDER_TEST,
        formFactor: 'mobile',
        throttlingMethod: 'simulate',
        onlyCategories: ['performance'],
        storageReset:
          'enabled (cold); each attempt is a separate Node process and freshly launched Chrome',
        expectedConfigHash: EXPECTED.configHash,
      },
      attemptsLaunched: attempts,
      result: ok ? 'PASS: five valid cold runs' : 'FAIL',
    },
    null,
    2,
  ) + '\n',
);

need(rootLockBefore === rootLockAfter, 'the root package-lock.json changed during measurement');
need(
  readdirSync(join(AFTER, 'reports')).some((name) => name.endsWith('.json')),
  'no Lighthouse report was produced',
);
need(ok && summary, 'the measurement did not produce five valid cold runs; see the attempt logs');
need(
  summary.attempts.filter((a) => a.valid).every((a) => a.configHash === EXPECTED.configHash),
  'a valid run has a config hash different from the baseline',
);
console.log(
  `measure:gallery:after: ${summary.result}; medians ${JSON.stringify(summary.medians)}; ` +
    `JS+CSS gzip ${summary.assets.jsPlusCssCombined.gzip} B`,
);
