# STEP-08 Implementation Plan — Revision 2 (approved)

**Status:** Approved by the Moderator on 2026-10-29. The Moderator approved the Development Team's exact Revision 2 plan recorded in this file, which incorporates the Tech Lead's PASS WITH CONDITIONS plan review (findings 1 to 6 and the three open-decision recommendations). STEP-08 is active for implementation under this plan only. This is plan approval, not Step acceptance.

**Provenance.** Revision 1 was submitted on 2026-10-29. The Tech Lead (Codex) returned PASS WITH CONDITIONS with four blocking amendments and two conditions. Revision 2 adopts all of them. The Tech Lead's review text is not stored in `mod-w/review.md`; its findings are summarized below as approval conditions.

## 1. Scope and requirements

Automate D-12's production comparison, record the after run under the baseline's conditions, add a deterministic threshold check, and confirm the package, token and asset gates are final. Traces to S-18, AC-22 to AC-26 and A-19. AC-20 and AC-25 are regression coverage only. No UI, API, token, design, or `mod-w/design/**` change. No threshold or baseline change. No performance-benefit claim. No STEP-09 work, publishing or deployment.

## 2. Baseline (frozen, validated)

`mod-w/evidence/d-12/before/` identifies `v1.0.0` = `bd241525a93afa468d069ca42bc300f62af3bd91`. Node 26.0.0, npm 11.12.1, Lighthouse 13.5.0, Chrome for Testing 156.0.8078.4, i7-7500U, Balanced plan. Five valid cold runs, config hash `80bad53803f8f14b469b4f6e19a31ec73d81d51084d16a6dba0707aafa285eaf`. Medians: LCP 2559.6461 ms, CLS 0.03502823531995759, TBT 629.9999999999998 ms. Startup JS plus combined CSS: raw 297,506 B, gzip level 9 89,050 B. All 29 entries in `hashes.sha256` verify.

Known caveats (accepted, unchanged): the slow-host-CPU warning on every run (benchmarkIndex 776 to 857); bimodal TBT (0 ms in two runs, 630 to 777 ms in three); baseline AC-power state was not recorded, so AC-power parity cannot be claimed.

## 3. Approval conditions (Tech Lead amendments, all adopted)

1. **Full-precision thresholds.** `check-performance.mjs` computes each limit from the hash-verified baseline `summary.json` with the fixed formulas; it stores no rounded constants. LCP `b + max(0.10·b, 150)`; TBT `b + max(0.10·b, 50)`; CLS `min(b + 0.02, 0.10)`; size `b + max(0.05·b, 10240)`. A metric breaches only when `after > limit`, so equality passes. Reference values: LCP 2815.61071, TBT 693, CLS 0.05502823531995759, size 99,290. Rounded values are display text only. The self-test uses full-precision values and covers exactly-at-limit (pass), the smallest value above the limit (breach), the 0.10 CLS ceiling, and the percentage-versus-absolute choice for each metric.
2. **Node and npm parity.** Every command (`npm ci`, tooling install, build, measurement, extraction, threshold check, all gates) runs under `fnm exec --using=26.0.0`, with `npm.cmd` and absolute `node.exe` paths on Windows. The scripts assert `process.version === 'v26.0.0'` and npm `11.12.1`, exit before any work if either differs, and record both in `env.json`. The host default (Node 24.13.0, npm 11.6.2) is never used.
3. **Evidence set and scope rule.** `reports/attempt-1` to `attempt-N`, N between 5 and 7 (`.json` and `.log`), every invalid attempt retained with its reason; the first five valid attempts form the run set. Named files under `mod-w/evidence/d-12/after/`: `commands.md`, `env.json`, `summary.json`, `summary.md`, `hashes.sha256`, `threshold.json`, `threshold.md`, and `logs/` containing `npm-ci.log`, `build-subfolder.log`, `tools-install.log`, `server.log`, `host.txt`, `gates.log`. `hashes.sha256` covers every evidence file except itself. The outside-scope stop rule applies to tracked or unignored paths only (`git status --short` lists only approved paths); ignored `node_modules`, `dist` and `playwright-report` output is expected. The root `package-lock.json` hash is recorded before and after and must not change.
4. **Server and port ownership.** Before measuring, fail if port 4310 or 4320 has a listener. Spawn `scripts/d12/serve.mjs` as an owned child process from Node with Windows paths (no Git Bash path conversion), wait for its `listening` line, verify the served `index.html` hash equals the built `dist/gallery/browser/index.html`, and terminate the child in `finally`. Playwright (port 4310) runs only after measurement, with the server gone.
5. **Hardened gates.** Phase A audits the existing `lint-tokens.mjs`, `check-assets.mjs`, `verify-atomic-archive.mjs` and the exactly-three-specs rule against AC-22 to AC-25 and records the result in `commands.md`. If sufficient, re-running them is the finalization. If a gap is found, stop for an exact-plan amendment before editing any gate script.
6. **Power state.** Record AC or battery state and the power plan for the after run. State baseline AC-power parity as an unproven caveat; never claim it.

## 4. Open decisions (resolved)

- **Tooling location:** `scripts/d12/tooling/` with byte-identical copies of the baseline `package.json` (sha256 `7bb6a8563a5f7e98a81994f94a37e6a8c8deee95f42819d4bd564800d3528740`) and `package-lock.json` (sha256 `d10511466828c7b1a28f6d671c7729b76017b98db67aaf6cd2435dfc02df44eb`), installed with `npm ci --ignore-scripts`. The root dependencies and root lockfile do not change.
- **Host drift:** an after benchmarkIndex outside 776 to 857 is recorded and reported; it does not invalidate or replace a run. If a timing metric also breaches, report the drift and assert no cause.
- **Extractor:** the new `scripts/d12/extract.mjs` takes a label parameter. The frozen baseline script is untouched. Equivalence is proven by running it on the baseline reports and obtaining JSON identical to the baseline `summary.json` for runs, medians and attempts, with only the Markdown heading and label differing.

## 5. Measurement method and host-consistency controls

- Serve with the byte-identical baseline `serve.mjs` (sha256 `0fa43298fe6c5becc1d26e926177b1217ea461ae33151dec11603e983bcf1b84`), gzip level 9, `http://localhost:4320/brand-ui/`.
- Lighthouse 13.5.0 CLI arguments as the baseline: `--form-factor=mobile --throttling-method=simulate --only-categories=performance`, headless=new, fresh `--user-data-dir` per run, one Node process per run, storage reset enabled. Chromium comes from Playwright 1.64.1 `chromium.executablePath()`, asserted to be Chrome for Testing 156.0.8078.4.
- Every run is validated against the baseline's expected values. The after config hash must equal `80bad538…`; otherwise fail.
- Attempt budget: five runs plus at most two replacements, replacements only for objectively invalid runs. A valid run is never discarded for being slow or fast.
- Record benchmarkIndex for each run against the baseline range. Close other programs; record AC power and the Balanced plan; stop if conditions cannot match.
- Size set and method are the baseline's, unchanged: Lighthouse network log unioned with `index.html` references, de-duplicated by build path, sized from the production build with zlib level 9, inline CSS included, inline JS excluded.

## 6. Files

**Edited**

| # | Path | Change |
|---|---|---|
| E1 | package.json | Add `measure:gallery:after` and `check:performance`, plus a tooling-install helper script. No dependency change. |

**Created**

| # | Path | Purpose |
|---|---|---|
| C1 | scripts/d12/measure-after.mjs | Orchestrator: version asserts, port and server ownership, five cold runs, extraction, evidence files. |
| C2 | scripts/d12/serve.mjs | Byte-identical copy of the baseline server. |
| C3 | scripts/d12/extract.mjs | Baseline extractor plus a label parameter. |
| C4 | scripts/d12/check-performance.mjs | Deterministic threshold check. |
| C5 | scripts/d12/check-performance.selftest.mjs | Threshold self-test. |
| C6 | scripts/d12/tooling/package.json | Byte-identical baseline copy. |
| C7 | scripts/d12/tooling/package-lock.json | Byte-identical baseline copy. |
| C8 | mod-w/evidence/d-12/after/** | The evidence set in §3.3. |

The root `package-lock.json` must be unchanged. No other implementation path may change; any other tracked or unignored path is a stop condition.

## 7. Phase A: preflight, no edits

1. `HEAD` equals the commit recording this approval; tree clean; `git rev-parse v1.0.0^{commit}` equals `bd241525…`.
2. `fnm exec --using=26.0.0`: node `v26.0.0`, npm `11.12.1`. Stop on mismatch.
3. Re-verify the baseline `hashes.sha256`.
4. Check power plan and AC power from PowerShell; confirm Chromium 156.0.8078.4 and ports 4310 and 4320 are free.
5. Gate audit per §3.5.
6. `npm ci` under Node 26; record the root `package-lock.json` hash.

## 8. Phase B: implementation, measurement and gates

Create the files, run the extractor equivalence proof, then in order: `npm run build:subfolder`, `npm run measure:gallery:after`, `npm run check:performance`, `npm run verify:atomic-archive`, `npm run format:check`, `npm run lint:tokens`, `npm run check:assets`, `npm run typecheck:e2e`, `npm test`, `npm run test:e2e`, `npm run build`, `git diff --check`, `git status --short`. Every command runs under `fnm exec --using=26.0.0`. Record the command, exit code and relevant output for each.

## 9. Mapping

| Criterion | Evidence |
|---|---|
| AC-26 | after evidence set, `threshold.json`/`threshold.md`, equivalence proof, no benefit claim |
| AC-22, AC-23 | `npm ci`, `build:subfolder`, `verify:atomic-archive`, `npm run build` |
| AC-24 | `format:check`, `lint:tokens`, `check:assets`, `typecheck:e2e`, `npm test`, `test:e2e` (axe, contrast, exactly three specs) |
| AC-20, AC-25 | `npm test` and `test:e2e` with no assertion weakening |

## 10. Stop conditions

Stop, report, and wait for the Moderator on: a missing, contaminated or differently conditioned baseline; any version, port, config-hash or server-identity mismatch; an inconsistent or unresolved size set; more than seven attempts needed; any threshold breach (report figures; no re-run to obtain a different result); a gate gap found in Phase A; any assertion that would need weakening; any failed gate; any change to the root lockfile; any tracked or unignored path outside §6. After a clean run, stop for Tech Lead review. Do not self-approve and do not begin STEP-09.

Commits happen only when the Moderator asks.

MOD-W v5.0.1
