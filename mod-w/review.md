# Tech Lead Review — STEP-04 Static subfolder deployment

## Verdict

**Pass.** The implementation, local `/brand-ui/` deployment, and authorized remote publication meet STEP-04. The previously public deployment archive was removed and returned 404 on focused re-check. This verdict is for the Moderator; it is not self-approval or Moderator acceptance.

**Moderator disposition:** Review approved on 2026-10-19; STEP-04 released to QA. Final acceptance remains pending QA evidence and Moderator decision.

## Scope check

- Implementation diff: only `package.json`, `projects/gallery/src/index.html`, and new `projects/gallery/public/robots.txt`.
- Exactly one `build:subfolder` script exists and equals `ng build gallery --base-href /brand-ui/`.
- No dependency/lockfile, route, SSR/service-worker, analytics, library/public API, token, `Navigation`, Design-ID, About lifecycle/content, first-visit, `mod-w/design/**`, `angular.json`, or `playwright.config.ts` change.
- No test file changed. Exactly three Chromium specs remain; no skipped/only/fixme test, disabled axe rule, excluded surface, snapshot, or assertion weakening entered the diff.
- No Design ID applies. The rejected prototype was irrelevant and unused.

## Findings

### Must fix now

None.

### Could fix later

- Root `/robots.txt` returns 404. The deployed page-level `noindex, nofollow` is the effective AC-19 control, so this is not a STEP-04 blocker. Any root rule is host-wide policy and should be separately authorized; if added, scope it to `/brand-ui/`.
- HTTP serves the gallery with 200 and does not redirect to HTTPS. No STEP-04 requirement mandates a redirect and the site carries no sensitive transaction, so this is host hardening, not an acceptance blocker.

## Acceptance and evidence mapping

| STEP-04 check | Result | Independent evidence |
|---|---|---|
| AC-19 static site under `/brand-ui/` | **Met** | Subfolder build passed. Local real-path Chromium load and refresh returned 200 with no failed/off-origin request; hashed CSS/JS, favicon, and local fonts resolved. About first-visit, close, refresh, and manual reopen remained intact. |
| AC-19 no indexing | **Met** | Source and emitted HTML contain `noindex, nofollow`; emitted and live `/brand-ui/robots.txt` contain exactly `User-agent: *` and `Disallow: /`. Emitted base is `/brand-ui/`; default build base is `/`. |
| AC-19 assets | **Met** | `check:assets` passed. Emitted CSS references seven local WOFF2 files; Chromium loaded local fonts/favicon; no remote or third-party brand asset request occurred. |
| Exact root script | **Met** | One occurrence; exact required command with trailing slash. |
| No prohibited scope change | **Met** | Commit path/diff inspection and targeted status/diff checks were clean for all prohibited surfaces. |
| Accepted STEP-01–03 coverage | **Met** | `ui` 68/68, gallery 64/64, Chromium 70/70 in exactly three specs. Complete-gallery and open-dialog axe checks passed unchanged. |
| All prescribed Node 26 gates | **Met** | Versions and every formatting, token, asset, typecheck, unit, browser, default-build, subfolder-build, diff, and scope command passed. |
| Authorized remote publication | **Met** | Focused Chromium re-check confirmed the upload ZIP now returns 404. The authorized HTTPS page remains healthy with only same-origin 200 resources and intact About/refresh behavior. |

## Command and browser evidence

- Runtime: Node `26.0.0`, npm `11.12.1`, Angular CLI/Angular `22.2.3`, TypeScript `6.0.3` via fnm.
- Passed: `format:check`, `lint:tokens` (51 tokens/four scopes), `check:assets`, `typecheck:e2e`, `npm test`, `test:e2e`, `build`, `build:subfolder`, `git diff --check`, both status commands.
- Live Chromium: `https://www.frank-mcguire.com/brand-ui/` returned 200; base and robots meta were correct; hashed same-origin bundles, local fonts, favicon, and robots returned 200; no failed/off-origin request; refresh and About behavior passed.
- Focused remote re-check after Moderator cleanup: deployment ZIP 404; gallery, hashed bundles, local fonts, favicon, and subfolder robots remained 200; no failed/off-origin request; refresh and About behavior remained intact.
- Non-blocking host observations remain: root robots 404; HTTP remains on HTTP with 200.

## Reference Implementation compliance

The prototype remains rejected as a Reference Implementation and was not used. STEP-04 has no Design ID and adds no badge or placeholder.

## Next action

QA hand-off authorized by the Moderator. QA should independently verify STEP-04 and return its evidence for the Moderator's final acceptance decision.
