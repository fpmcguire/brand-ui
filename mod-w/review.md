# Tech Lead Re-review — STEP-05 Archive Mode Correction

## Verdict

**ACCEPT for Moderator consideration.** The tar-mode Must-fix is closed. This is review advice, not self-approval or final Moderator acceptance of STEP-05.

**Moderator disposition:** Approved on 2026-10-28 for the Development Team's corrected STEP-05 implementation to proceed to fresh QA. Product Owner sign-off and final Moderator acceptance remain pending. STEP-06 remains blocked.

## Scope check

- The correction is confined to `scripts/atomic-archive.mjs` and `scripts/verify-atomic-archive.selftest.mjs` relative to the documented prior review.
- The scripts were untracked at review time, so Git could not produce a literal correction-only diff. Comparison used the prior review's recorded six-mode allowlist and 66-fixture baseline.
- Strict gzip, complete 512-byte tar-header, PAX, path, padding, and terminator checks remain unchanged.
- `git status --short` contained the previously reviewed STEP-05 working tree. No new unauthorized path or `mod-w/design/` change was found. The existing review and gallery-source working-tree entries predated this correction.

## Findings

### Must fix now

None.

### Could fix later

- `scripts/lint-tokens.selftest.mjs` can dereference missing `stderr` when child-process creation itself fails. This affects diagnostics in a constrained sandbox, not the successful project gate or STEP-05 behavior.
- The correction prompt listed `0640` as a mode the transform cannot emit, but `(0640 | 0600) & ~0022` is `0640`. Admitting `0640` is required by the authoritative transform and 32-mode definition.

## Acceptance and Design-ID evidence mapping

| Acceptance check | Result | Evidence |
|---|---|---|
| AC-22 — independent build, pack, and archive integrity | **Ready for fresh QA** | The focused verifier rebuilt the package and passed with 9 files, 470 B, SHA-256 `6fb1f6c60f53171bc3475d14421963f4465f96db214ab204b8c9d318c017d620`, and no drift. The derived allowlist contains exactly the 32 outputs of npm's portable transform. |
| AC-23 — clean install and installed consumption | **Ready for fresh QA** | Development Team evidence reports a verified fresh-copy offline install without `--ignore-scripts`; QA must independently repeat the required install and resolution checks. |
| AC-24 — static gates and focused tests | **Ready for fresh QA** | Archive self-test passed with 70 archive, 19 consumer, and 17 output fixtures. The correction adds checksum-valid `0600`/`0755` positives and exact-error `0664`/`0400` negatives. |
| AC-20 — Card behavior preserved | **Ready for fresh QA** | Development Team evidence reports unchanged passing UI, gallery, and three-spec end-to-end coverage; QA must independently re-establish it. |
| AC-19 — static noindex/asset behavior | **Ready for fresh QA** | Development Team evidence reports passing production and subfolder builds; QA must independently re-establish it. |
| Design IDs | **Not applicable** | STEP-05 implements no Design ID and changes no approved visual surface. |

## Archive-validation disposition

- The exact transform over permission sets `0000` through `0777` produces 32 modes: owner `6` or `7`, with group and other each `0`, `1`, `4`, or `5`.
- `0600`, `0755`, and `0640` are correctly admitted. `0664`, `0666`, `0775`, `0777`, `0400`, `0444`, and `0660` are rejected.
- npm 11.12.1's installed `tar` implementation independently confirms `mode = (mode | 0o600) & ~0o22` in portable mode.
- All four new fixtures use the checksum-recomputing `mutated()` helper. The rejected fixtures assert the specific literal messages `tar header mode 664 is not approved` and `tar header mode 400 is not approved`, without alternation or wildcard catch-all expressions.
- The actual npm-format positive fixture is unchanged. Strict gzip, tar-header, PAX, effective-path, padding, and terminator validation remains intact.

## Reference Implementation compliance

The prototype remains rejected as a Reference Implementation. This correction concerns archive validation only; no visual implementation or Design ID is in scope. D-12 and the existing Card behavior contract remain authoritative.

## Command evidence

Focused commands used Node `v26.0.0` and npm `11.12.1`.

- Pass: mode-set enumeration — exactly 32 outputs; targeted accepted and rejected modes matched the transform.
- Pass: `node scripts/verify-atomic-archive.selftest.mjs` — 70 archive, 19 consumer, and 17 output fixtures.
- Pass outside the constrained child-process sandbox: `npm run verify:atomic-archive` — 9 files, expected SHA-256, and no rebuilt-package drift.
- Pass outside the constrained npm-cache sandbox: `npm pack ./dist/atomic --dry-run` — 9 files, 470 B.
- Pass: `git diff --check` — no whitespace errors; line-ending warnings only.

## Next action

Fresh QA must independently run the STEP-05 gates and write its QA result. Product Owner sign-off and final Moderator acceptance follow a QA pass. Do not begin STEP-06.
