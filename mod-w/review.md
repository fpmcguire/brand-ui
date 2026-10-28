# Tech Lead Plan Re-review — STEP-07 Revision 5

## Verdict

**APPROVE PLAN FOR MODERATOR CONSIDERATION.** Revision 5 resolves the Revision 4 runner lifecycle, embedded-checker, deterministic-path, ignore-check, K3 containment, status-language, and dry-run-evidence findings. The proposed ten-file implementation and two-phase verification plan are coherent, executable in the governed Windows PowerShell 5.1 environment once the required toolchain and approved planning SHA exist, and ready for the Moderator's separate decisions.

This is Tech Lead advice only—not Moderator approval, STEP-07 activation, implementation authorization, STEP acceptance, or acceptance of the AC-20 exception. No implementation gate was run during this review.

**Moderator disposition:** Approved on 2026-10-28. The Moderator approved this Tech Lead review and the exact Development Team Revision 5 plan, recorded in `mod-w/step-07-plan.md`, including its five decisions: AC-20 Option A with its recorded reason, the caption-visibility rule, the token-derived responsive track rule, the static-check policy with its two-phase PowerShell execution plan, and the DS-035 no-heading correction. STEP-07 is active and implementation is authorized under that exact plan. The two non-blocking Tech Lead clarifications (Phase B label order and literal hash-comparison evidence) are recorded as approval conditions in the plan. This is plan approval, not STEP-07 acceptance; Tech Lead implementation review, fresh QA, Product Owner sign-off, and final Moderator acceptance remain required.

## Scope check

- The implementation remains exactly five created and five edited paths. No atomic source, archive, manifest, lockfile, `ui`, token, Design-ID, brand/scope, helper, script, `mod-w/**`, or fourth Playwright specification change is proposed (`mod-w/step-07.md:15-21`).
- The two PowerShell scripts are temporary verification machinery at fixed paths outside the repository. Their submitted LF/UTF-8-without-BOM SHA-256 values match the Appendix A text.
- Installed secondary-entry imports, gallery ownership, eight figures plus DS-061, P1–P3 normalization, exact captions, the token-derived responsive track, and DS-035's no-heading correction remain conformant.
- AC-20 Option A remains exactly two selector-only edits retaining the six-card count and `[0,1,1,1,1,0]` vector. No structure element carries `data-specimen`.
- STEP-06 received final Moderator acceptance and is tagged `step-06-complete`; it is not a STEP-07 blocker.

## Findings

### Must fix before approval

None.

### Should fix

- Align the Phase B table labels with Appendix A2: the script validates PowerShell/repository state, checks B1 toolchain versions, and then performs the B0 HEAD equality check. This is non-mutating and functionally safe, but the table currently lists the complete B0 check before B1.
- In implementation evidence, show the two literal `Get-FileHash` commands and their comparisons with the recorded hashes immediately before each invocation. Section 7 already makes a mismatch a stop condition; spelling out the comparisons will make that evidence self-contained.

These are documentation/evidence clarifications, not plan blockers and do not change the approved commands, scope, tests, or acceptance mapping.

### Could fix later

None.

## Revision 4 finding disposition

| Revision 4 finding | Revision 5 disposition |
|---|---|
| Impossible clean-tree/ten-change lifecycle | **Resolved.** Phase A validates the clean approved baseline and exits; Phase B verifies the dirty implementation tree using the same explicit approved SHA |
| G8 placeholder | **Resolved.** Appendix A2 embeds the complete checker with exactly one `TOKEN_DIR`; no splice remains |
| Non-deterministic runner path/working directory | **Resolved.** Fixed temporary paths, validated `RepoPath`, pre-Git `Set-Location`, fixed hashes, invocations and cleanup are specified |
| Missing `node_modules` ignore proof | **Resolved.** All four ignored paths are checked independently using the working trailing-slash form |
| Missing K3 viewport-left assertion | **Resolved.** Left, top, right and bottom viewport bounds are now explicit |
| Incorrect pre-review blocker title | **Resolved.** Preconditions are correctly classified as pre-implementation conditions |
| Dry-run claims did not match exact submitted text | **Resolved.** Claims identify submitted versus derivative scripts and retain implementation-evidence limits |

## Command and evidence review

- Both Appendix scripts parse with zero errors under the installed Windows PowerShell 5.1 parser.
- The preflight script hash is `359844fa8c91b3f9367f2177ec1af3d5894f349b450b650645fd3e70169717af`, matching the plan.
- The verification script hash is `d2677ed93916dac93849610820582f2803f3dca843cfd3683bbbb2c979f70081`, matching the plan.
- The embedded 114-line checker is byte-identical to Revision 3 lines 2874–2987 and contains one `TOKEN_DIR` declaration.
- `git check-ignore -q` returns zero for `dist/`, `test-results/`, `playwright-report/`, and `node_modules/` in the current repository.
- Phase A stops after the clean-baseline checks. Phase B assigns `$BASE` from the approved SHA, does not demand a clean tree, and rechecks HEAD and exact scope at G3 and G18.
- Native-command exit checks, exact-ten comparison, deletion detection, excluded-path detection, five-new/five-modified identities, tracked/untracked whitespace checks, and unchanged `card.spec.ts` proof are exact and fail closed.
- The Team's fixture evidence is appropriately bounded. Node 26/npm 11.12.1, the real implementation files, and G1–G18 remain unverified until authorized implementation.

## Test-feasibility review

- The Vitest plan proves the exact groups, captions, headings, semantics, counts, Code-well differences and ID uniqueness without a component API change.
- B1–B3 prove placement, exact cross-scope structure under P1–P3, captions/IDs and token paint in all four scopes.
- K1–K5 cover the sole link/tab stop, hidden skeletons, busy/Loading ownership, geometry/paint/motion, reduced motion, narrow layout, Card usability, axe and four-scope heading order.
- K3 now establishes figure and per-block visibility before geometry, figure containment, all four viewport edges, token paint, 1.4-second infinite CSS animation, reduced-motion removal and restoration.
- The static checker retains its self-tests, token discovery, source checks, missing-file failure and non-zero exit behavior without adding a repository file.

## Acceptance and Design-ID evidence mapping

| Check | Plan disposition | Implementation evidence still required |
|---|---|---|
| AC-20 | Ready for separate Moderator exception decision | Exact two-selector reason; retained count/vector; unchanged Card spec; all unit/E2E gates |
| AC-23 | Plan complete | Phase A baseline; installed imports; clean install/archive verification; exact scope; production/subfolder builds |
| AC-24 | Plan complete | Format, token, asset, typecheck, unit, exactly-three-spec E2E/axe, G8 and final hygiene |
| AC-25 / DS-061 | Plan complete | Last placement, exact groups/captions/IDs/order, token-only shell and gallery ownership |
| DS-062 | Plan complete | Installed Tag and four-scope token paint |
| DS-063 | Plan complete | Non-zero contained hidden block, sunken paint and normal/reduced motion |
| DS-064 | Plan complete | Installed CodeWell for CodeCraft and exact fallback elsewhere |
| DS-065 | Plan complete | Installed MediaArea and sunken paint |
| DS-066 | Plan complete | Four contained hidden blocks and normal/reduced motion |
| DS-030 | Plan complete | Static Card, h3, captions/ID and no link |
| DS-031 | Plan complete | h3, one native link/tab stop and focus ring |
| DS-035 | Ready for separate no-heading decision | No heading; sole busy/Loading Card; four hidden animated blocks and reduced-motion stop |

## Reference Implementation compliance

No Reference Implementation exists for the Atomic Design extension. The prototype remains rejected and is not used as technical authority. Revision 5 proposes no prototype, `mod-w/design/**`, token-value, public-API, or Design-ID change.

## Moderator decisions

The following are ready for separate Moderator consideration; none is approved by this review:

1. AC-20 Option A and its exact recorded reason.
2. The caption-visibility rule.
3. The token-derived responsive track rule.
4. The static-check policy and complete two-phase PowerShell execution plan.
5. The DS-035 no-heading correction.

## Evidence reviewed

- Development Team STEP-07 Implementation Plan Revision 5, including complete proposed source/test bodies and Appendices A1/A2.
- `mod-w/product.md`, `mod-w/architecture.md`, `mod-w/domain-language.md`, `mod-w/step-07.md`, current source/tests, and prior STEP-07 reviews.
- STEP-06 final acceptance at HEAD `74dbd2e`, tagged `step-06-complete`.
- Read-only PowerShell parsing, SHA-256 calculation, checker comparison, command discovery and ignore probes. No implementation gate was run.

## Next action

The Moderator approved Revision 5 and its five decisions on 2026-10-28. The review and approval record are committed as the planning baseline, and that commit's full SHA is passed unchanged to both scripts. Phase A must pass under Node 26.x/npm 11.12.1 before any implementation edit. The Development Team may implement only the exact approved plan in `mod-w/step-07-plan.md`, must stop on any recorded stop condition, and must then provide the complete implementation evidence for Tech Lead review. STEP-08 remains blocked until STEP-07 receives Tech Lead review, fresh QA, Product Owner sign-off, and Moderator acceptance.

---

MOD-W v5.0.1
