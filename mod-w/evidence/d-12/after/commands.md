# D-12 after-measurement: commands and gate record

Measurement evidence only. It makes no performance, accessibility or maintainability improvement claim, and it does not declare the performance check passed.

Run on `feature/atomic-design` at `f887821` (`projects/` tree unchanged from STEP-07 acceptance; see `env.json`), Node v26.0.0 and npm 11.12.1 through `fnm exec --using=26.0.0` with `npm.cmd`, `NG_CLI_ANALYTICS=false`.

## Outcome

- **Threshold check: BREACH (TBT).** After median TBT 809.3623 ms against a limit of 693 ms. LCP, CLS and JS+CSS gzip are within their limits. See `threshold.md` and `threshold.json`.
- The five-run after measurement and this breach are authoritative. They were not rerun or replaced (Moderator decision, Option 1, 2026-10-29). `check:performance` was run once and not repeated.
- Cause is not attributed. The baseline TBT was bimodal (0 ms in two runs, 630 to 777 ms in three); the after runs were all 714 to 948 ms. The after host benchmarkIndex range (825 to 996.5) differs from the baseline range (775.5 to 856.5).

## Comparability caveats

- Lighthouse reported the slow-host-CPU warning on all five after runs, as in the baseline.
- Other applications were running during the after measurement (for example Snagit, ChatGPT and editors; see `logs/host.txt`). The baseline did not record this. Recorded as a comparability caveat by the Moderator.
- Baseline AC-power state was not recorded, so AC-power parity is not claimed. The after run was on AC power (BatteryStatus 2) under the Balanced plan.

## Moderator-ratified deviations from the Revision 2 plan

1. The frozen, hash-verified baseline `mod-w/evidence/d-12/before/scripts/serve.mjs` (SHA-256 `0fa43298…`) is used directly; no copy exists under `scripts/d12/`, because a byte-identical copy fails `format:check`.
2. The pinned tooling files in `scripts/d12/tooling/` are copied to a temporary directory outside the repository and installed there with `npm ci --ignore-scripts` (the repository `.gitignore` ignores only the root `node_modules`).
3. There is no separate tooling-install helper; `measure:gallery:after` installs the tooling itself.

## Pre-measurement (Phase A)

| Command | Exit | Evidence |
|---|---:|---|
| `git rev-parse HEAD`; `git status --short`; `git rev-parse v1.0.0^{commit}` | 0 | clean tree; `bd241525a93afa468d069ca42bc300f62af3bd91` |
| `fnm exec --using=26.0.0 node --version`; `npm.cmd --version` | 0 | v26.0.0; 11.12.1 |
| `sha256sum -c hashes.sha256` (baseline) | 0 | 29 of 29 entries OK |
| port, Chromium, power checks | 0 | 4310 and 4320 free; Chrome for Testing 156.0.8078.4; Balanced; AC power |
| `npm ci --no-audit --no-fund` | 0 | 321 packages; root `package-lock.json` SHA-256 `663bf084…` before and after (`logs/npm-ci.log`) |

Gate audit (finding 5): `scripts/lint-tokens.mjs` covers atomic package discovery with a 232-line self-test; `scripts/check-assets.mjs` covers atomic source and archive assets; `scripts/verify-atomic-archive.mjs` covers archive rebuild and drift, inventory and identity, dependency, lockfile integrity, and alias and relative-import boundaries with a 1,003-line self-test; `e2e/` holds exactly three specifications. No gap was found and no gate script was edited.

Extractor equivalence: `v1.0.0` was rebuilt in a temporary worktree (since removed) and the new `scripts/d12/extract.mjs` run on `before/reports` with the default label. It reproduced the baseline `summary.json` (SHA-256 `c8f44744…`) and `summary.md` byte for byte, including sizes.

## Measurement and threshold

| Command | Exit | Evidence |
|---|---:|---|
| `npm run build:subfolder` | 0 | `logs/build-subfolder.log` |
| `npm run measure:gallery:after` | 0 | five valid cold runs, attempts 1 to 5, no replacements; medians LCP 2642.81095 ms, CLS 0.03502823531995759, TBT 809.362275 ms; JS+CSS gzip 90,954 B; `summary.json`, `summary.md`, `reports/` |
| `npm run check:performance` | 1 | self-test passed; TBT breach; `threshold.json`, `threshold.md`, `logs/check-performance.log` |

## Remaining gates (`logs/gates.log`)

| Command | Exit | Key output |
|---|---:|---|
| `npm run verify:atomic-archive` | 0 | self-test passed; `@brand-ui/atomic@1.1.0`, 9 files, no drift |
| `npm run format:check` | 0 | |
| `npm run lint:tokens` | 0 | self-test passed; 51 contract tokens, 4 scopes |
| `npm run check:assets` | 0 | 9 atomic archive files; no restricted assets |
| `npm run typecheck:e2e` | 0 | |
| `npm test` | 0 | atomic 15, ui 69, gallery 76 tests passed |
| `npm run test:e2e` | 0 | 87 passed across exactly three specifications |
| `npm run build` | 0 | atomic, ui and gallery builds |

## Final repository checks

`git diff --check` exited 0. `git status --short` lists only `package.json`, `scripts/d12/` and `mod-w/evidence/d-12/after/`. The root `package-lock.json` is unchanged. Nothing is committed.
