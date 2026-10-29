# Tech Lead Implementation Review — STEP-08

## Verdict

**PASS under the Moderator's bounded amendment.** The implementation correctly records a TBT threshold breach rather than claiming that `check:performance` passed. The authoritative five-run measurement was not rerun or replaced, the remaining extension gates passed, and the evidence set is complete and internally hash-consistent.

This is Tech Lead advice only. It is not fresh QA, Product Owner sign-off, Moderator acceptance, permission to commit, or authorization to begin STEP-09.

**Moderator disposition:** Accepted on 2026-10-29 as the STEP-08 Tech Lead review and released to fresh QA. The recorded TBT breach remains authoritative and is not converted into a passing performance check. This disposition is not fresh QA, Product Owner sign-off, STEP-08 acceptance, commit authorization, or permission to begin STEP-09.

## Scope check

- `git status --short --untracked-files=all` shows only the edited root `package.json`, the created `scripts/d12/` files, and `mod-w/evidence/d-12/after/`, plus this Tech Lead-owned review after review writing.
- No `projects/**`, public API, component, gallery, token, asset, Design-ID, test assertion, `mod-w/design/**`, publish, or deployment path changed.
- The root `package-lock.json` is unchanged; `env.json` records the same SHA-256 before and after measurement.
- The Moderator-ratified implementation deviations are bounded and recorded in `commands.md`: direct use of the hash-verified frozen server, temporary installation from the pinned tooling files, and tooling installation inside `measure-after.mjs`.
- No Reference Implementation exists for this extension. AC-20 remains the behavior baseline.

## Findings

### Must fix

None.

### Recorded exception

- `check:performance` exited 1 because median TBT is 809.362275 ms against the full-precision limit 692.9999999999998 ms. LCP, CLS, and compressed JS+CSS remain within their limits. The Moderator accepted the breach as authoritative evidence, not as a passing check, and authorized bounded continuation without another measurement or threshold run.
- Cause is not attributed to the code. All five before and after runs carry the accepted slow-host warning; baseline TBT is bimodal; the after benchmarkIndex range differs; other applications were running; and baseline AC-power state is unknown. These caveats are stated in `commands.md`, `summary.md`, `threshold.md`, and `logs/host.txt` without a benefit claim.

### Should or could fix later

None within STEP-08. Any performance investigation or optimization requires separate Moderator scope and must not rewrite this evidence.

## Implementation review

- `check-performance.mjs` verifies the frozen baseline summary hash, rejects incomplete or inconsistent evidence, requires a shared config hash, computes all four limits from the baseline at full precision, and uses strict `after > limit` breach semantics.
- `check-performance.selftest.mjs` covers the frozen reference values, equality, adjacent floating-point boundary values, percentage/absolute selection, the CLS ceiling, invalid evidence, and baseline self-comparison.
- `measure-after.mjs` asserts Node 26.0.0, npm 11.12.1, pinned tooling hashes, all baseline hashes, Chrome 156.0.8078.4, Balanced power, the build base href, and free ports. It owns and verifies the server, uses separate processes and fresh profiles, permits replacements only after invalid evidence, preserves all reports, and checks the root lock and Lighthouse config hash.
- The new extractor retains the baseline extraction and size-set rules. The recorded equivalence run reproduced the frozen baseline summaries byte for byte with its default label.
- The tooling manifests are byte-identical to the frozen baseline copies: SHA-256 `7bb6a856…` and `d1051146…`.
- The evidence hash manifest has 23 entries for the other 23 evidence files. Independent SHA-256 verification found zero missing or mismatched entries.

## Acceptance and Design-ID evidence mapping

| Criterion                             | Evidence                                                                                                                                                             | Disposition                                                                                        |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| AC-22                                 | Archive self-test/rebuild, exact nine-file inventory, manifest/security checks, no drift                                                                             | Pass                                                                                               |
| AC-23                                 | Clean `npm ci`, installed archive boundary, subfolder and production builds, unchanged root lock                                                                     | Pass                                                                                               |
| AC-24                                 | Format, token self-test/scan, asset/provenance check, E2E typecheck, 160 unit tests, axe/contrast E2E, exactly three specifications                                  | Pass                                                                                               |
| AC-20                                 | Atomic/UI/gallery unit suites and existing E2E suites; no assertion edit or weakening                                                                                | Pass as regression coverage                                                                        |
| AC-25 / DS-061–066 and DS-030/031/035 | 87 passing E2E tests across the existing three specifications; no structure implementation change in STEP-08                                                         | Pass as regression coverage                                                                        |
| AC-26                                 | Frozen before evidence; five valid after runs; production size set; LCP, CLS and TBT; deterministic failing threshold; reported breach and caveats; no benefit claim | Requirement behavior satisfied under the Moderator decision; performance result remains **BREACH** |

## Command and evidence review

Development Team evidence, hash-verified in `logs/gates.log` and `commands.md`:

- `verify:atomic-archive`: exit 0; self-test passed; nine files; no drift.
- `format:check`, `lint:tokens`, `check:assets`, `typecheck:e2e`: exit 0.
- `npm test`: exit 0; atomic 15, UI 69, gallery 76.
- `test:e2e`: exit 0; 87 passed across exactly three specifications.
- `npm run build`: exit 0 for atomic, UI, and gallery.
- `git diff --check`: exit 0.
- `check:performance`: exit 1, intentionally retained as the TBT breach.

Independent Tech Lead checks under Node 26.0.0:

- Evidence SHA-256 verification: 23 entries, zero mismatches; 24 evidence files including the manifest.
- `format:check`: pass.
- `check-performance.selftest.mjs`: pass.
- `lint:tokens`: pass after rerun outside the process sandbox; the first isolated attempt could not spawn its fixture child process (`EPERM`).
- `check:assets`: pass after rerun outside the process sandbox; the first isolated attempt could not spawn `git` (`EPERM`).
- `typecheck:e2e`: pass.
- Measurement and `check:performance` were deliberately not rerun.

## Reference Implementation compliance

No Reference Implementation exists for the Atomic Design extension. The rejected prototype was not used as technical authority. STEP-08 changes no prototype, design artifact, UI structure, token value, component API, or Design ID.

## Next action

The Moderator accepted this review and released STEP-08 to fresh QA. QA must preserve the authoritative measurement and TBT breach without rerunning `measure:gallery:after` or `check:performance`, then report its independent review. Product Owner sign-off and final Moderator acceptance remain required. The TBT breach must remain visible in every downstream review; no reviewer should describe the performance check as passing or attribute the breach to the code without new authorized evidence. Commit only if the Moderator directs it. STEP-09 remains blocked until STEP-08 receives final Moderator acceptance.

---

MOD-W v5.0.1
