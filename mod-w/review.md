# Tech Lead Focused Re-review — STEP-03 Repository-link amendment

## Verdict

Pass.

The Repository-link amendment in commit `d49e703` meets Product 5.2/AC-17.7 and the amended STEP-03. The earlier STEP-03 Pass still stands for AC-17.1–17.6 and the dialog, storage, focus, accessibility, token, and gallery behavior outside the amendment. This is an independent Tech Lead review verdict, not Development Team self-approval or Moderator acceptance.

## Scope check

- The amendment is confined to the seventh About section, a comment-only pluralization in `about-panel.scss`, focused unit/browser assertions, and applying the existing link token/focus checks to both links.
- The seventh section is distinct and last. Its only link is `https://github.com/fpmcguire/brand-ui.git`, with `target="_blank"`, `rel="noopener noreferrer"`, visible text `github.com/fpmcguire/brand-ui`, and exact accessible name `github.com/fpmcguire/brand-ui (opens in a new tab)`.
- The panel contains exactly two `<a href>` elements. The pre-existing MOD-W section, prose, destination, visible text, new-tab, `rel`, and accessible-name contract remain separately asserted inside that section.
- No DS-, MW-OBS, install/tutorial wording, image, SVG, or base64 content entered the panel. README remains unchanged for the amendment, as approved by the Moderator.
- The accepted pre-amendment evidence in `mod-w/qa.md` identifies AC-17.1–17.6, `about-panel.ts`, `about-first-visit.ts`, `dialog-shim.ts`, gallery header/README, long-label/bevel coverage, library/public API, tokens, dependencies/workspace, configuration, and Design artifacts as already passing. Current source inspection and the full regression gates show no change in those contracts or behavior from the amendment.
- Exactly three `e2e/*.spec.ts` files remain, and `playwright.config.ts` declares Chromium only. No route, dependency, asset, deployment, token, Design-ID, `Navigation`, library, or public-API expansion is present.

## Amendment findings

### Must fix now

None.

### Could fix later

None introduced by the amendment. The two pre-existing later observations from the earlier review remain outside this amendment: the button-caption mojibake and optional README “method”/panel “methodology” prose alignment.

## Acceptance and evidence mapping

- **AC-17.7 Source repository:** met — the seventh `Source repository` section and exact link contract are present in `about-panel.html`; Vitest asserts the section, its position, its single paragraph/link, destination, text, new-tab behavior, `rel`, and accessible name.
- **Exactly two external links:** met — Vitest and Chromium assert exactly two links and both complete contracts. The MOD-W assertion is scoped to `section[aria-labelledby="gal-about-built"]`; the source assertion is scoped to the final source section.
- **Keyboard/new-tab security:** met — Chromium tabs from the initially focused Close control to the repository link, activates it with Enter against a stubbed GitHub destination, verifies the exact URL, and proves `window.opener` is `null`.
- **Seven headings and focus containment:** met — unit and browser checks assert the seven ordered headings. Tab/Shift+Tab coverage still rejects focus reaching the inert page, requires traversal through dialog content, and requires return to Close.
- **Four-scope token and focus evidence:** met — `brand-and-contrast.spec.ts` iterates both links in each of ArtAnon, Mentor, CodeCraft Light, and CodeCraft Dark, checking primary-on-background, underline, and focus-token outline; all listed AC-7 pairs pass.
- **Earlier STEP-03 behavior:** unaffected — all 64 gallery unit tests and all 70 Chromium tests pass. The browser suite re-proves AC-17.1–17.6 content, three close paths and deterministic focus restoration, manual reopening, first-visit persistence, guarded storage failures/once-per-page-load fallback, four-scope structure, retained selection, full-gallery axe, and open-dialog axe.
- **Accepted STEP-01/02 coverage:** unaffected — all 68 `ui` tests pass; existing brand/scope/contrast, keyboard, semantics, long-label, bevel, and full-gallery accessibility tests remain green.
- **No weakened evidence:** met — repository scan found no `.only`, `.skip`, `xit`, `fit`, `fixme`, snapshots/screenshots, disabled axe rules, or excluded axe surfaces. Complete-gallery serious/critical axe checks and focused open-dialog scans remain active.

## Command evidence

Run on 2026-10-19 from clean `master` at `d49e7034b71a62b605c8add4be9b73ce06316e16`, after `fnm use 26.0.0`:

| Check | Result |
|---|---|
| `node --version` | Pass — `v26.0.0` |
| `npm --version` | Pass — `11.12.1` |
| `npx ng version` | Pass — CLI/Angular `22.2.3`, Node `26.0.0` |
| `npx tsc --version` | Pass — `6.0.3` |
| `npm run format:check` | Pass |
| `npm run lint:tokens` | Pass — 51 contract tokens, four scopes, components clean |
| `npm run check:assets` | Pass — no restricted assets |
| `npm run typecheck:e2e` | Pass |
| `npm test` | Pass — `ui` 68/68; `gallery` 64/64 |
| `npm run test:e2e` | Pass — Chromium 70/70 in exactly three specs |
| `npm run build` | Pass — `ui` and `gallery` production builds |
| `git diff --check` | Pass |
| `git status --short` before review | Clean |
| `git status --short -- mod-w/design` | Clean |

The default shell initially resolved Node 24.13.0; validation was therefore rerun in the required fnm-managed Node 26.0.0 environment. Process-spawning gates required the managed execution permission and then passed unchanged.

## Design-ID and Reference Implementation compliance

No Design ID applies to S-11; the amendment is traced through AC-17.7 and displays no badge or placeholder. The rejected prototype remains visual evidence only and was not needed or used as an implementation authority. The amendment follows Product 5.2, D-11, and STEP-03 without widening bounded design authority.

## Next action

Return this focused Pass to the Moderator. The Moderator may accept STEP-03 and direct the separate QA delta/re-run. S-13 deployment remains a separate required post-STEP-03 gate and is not authorized by this review.
