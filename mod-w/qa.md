## QA — STEP-04 — Static subfolder deployment (S-13, AC-19)

**Project:** brand-ui
**Tester:** QA (Claude Code), independent of the Development Team and the Tech Lead
**Date:** 2026-10-19
**Baseline:** `master` at `21908ae` (clean tree before and after QA). Implementation commit `f205dc3`.
**Status of this document:** QA evidence for the Moderator's final acceptance decision. It is **not** Step acceptance and does not authorize any further deployment.

**Moderator disposition:** QA review approved on 2026-10-19. Product Owner acceptance validation and the Moderator's final gate remain pending.

The STEP-03 QA report that previously occupied this file is preserved in git history (`git log -- mod-w/qa.md`).

---

### Summary

**Pass with notes.** All eight STEP-04 acceptance checks are supported by independent command and browser evidence. No defect was found. Four non-blocking observations (O-1 to O-4) are for the Moderator; none is a STEP-04 requirement.

I did not rely on the Development Team's or Tech Lead's reported results. Every gate was re-run and the deployed site was checked by QA's own scripts.

---

### Preconditions

- Approval record: `mod-w/step-04.md` status and `mod-w/review.md` (Tech Lead **Pass**, Moderator approval and release to QA recorded 2026-10-19) and `mod-w/roadmap.md` ("Tech Lead Pass approved; QA pending") are all committed in `21908ae`. The working tree was clean, so there was nothing further to commit.
- The bare shell resolves **Node 24.13.0**. All gates below were run under Node 26.0.0 via `fnm exec --using=26.0.0` (see O-4).

| Tool | Version |
| ---- | ------- |
| Node | 26.0.0 |
| npm | 11.12.1 (matches `packageManager`) |
| Angular CLI / Angular | 22.2.3 / 22.2.3 |
| TypeScript | 6.0.3 |

---

### Gates (each run by QA; all exit 0)

| Command | Result | Evidence |
| ------- | ------ | -------- |
| `npm run format:check` | Pass | "All matched files use Prettier code style!" |
| `npm run lint:tokens` | Pass | self-test 88 evasion / 21 clean fixtures; "51 contract tokens; 4 scopes; components clean" |
| `npm run check:assets` | Pass | "6 font families with OFL.txt and SOURCE.md; no restricted assets" |
| `npm run typecheck:e2e` | Pass | no output, exit 0 |
| `npm test` | Pass | `ui` 5 files / **68** tests; `gallery` 5 files / **64** tests |
| `npm run test:e2e` | Pass | "Running 70 tests using 2 workers" → **70 passed** in exactly three specs |
| `npm run build` | Pass | `Built ui`; gallery bundle complete, initial total 233.75 kB |
| `npm run build:subfolder` | Pass | gallery bundle complete, same hashed chunk names and sizes as the default build |
| `git diff --check` | Pass | exit 0 |
| `git status --short` | Pass | empty (tracked and untracked) |
| `git status --short -- mod-w/design projects/ui package-lock.json angular.json playwright.config.ts` | Pass | empty |

Counts match the Step's stated invariants (68 `ui`, 64 gallery, 70 browser). Both axe surfaces ran and passed: "the complete gallery has no serious or critical axe violations" (two tests: before and after the first-visit dialog is dismissed) and "the open About panel has no serious or critical axe violations" in each of four scopes.

---

### Acceptance check results

| Check | Result | Evidence |
| ----- | ------ | -------- |
| **AC-19 static site** — builds to static files and works from `/brand-ui/` with no broken local request | **Pass** | `dist/gallery/browser` is plain static files. QA served it under a real `/brand-ui/` path (server and script outside the repo) and drove Chromium: initial load plus refresh made 15 responses, **all 200**; 0 failed, 0 off-origin, 0 console/page errors. Resources were `index.html`, 1 hashed CSS, 3 hashed JS modules, 4 WOFF2 and `robots.txt`, all under `/brand-ui/`. Behavior intact: About auto-opens on a first visit with accessible name "About brand-ui", focus on Close, seven headings, two links; Close and Esc each return focus to About; refresh does not auto-open; manual reopen works. |
| **AC-19 no indexing** — `noindex, nofollow` in source and emitted HTML; emitted `robots.txt` disallows `/` for all agents | **Pass** (note O-1) | Source `projects/gallery/src/index.html` and emitted `dist/gallery/browser/index.html` both contain `<meta name="robots" content="noindex, nofollow">`. Emitted `robots.txt` is byte-exact `User-agent: *\nDisallow: /\n`. Emitted base is `/brand-ui/`. Default build keeps the source `<base href="/">` (source diff and build log; `dist` was overwritten by the final subfolder build, so I did not re-inspect the default build's HTML). |
| **AC-19 assets** — `check:assets` passes; no third-party brand asset or remote font/asset | **Pass** | `check:assets` passed. Emitted CSS references exactly 7 relative `./media/*.woff2` files and no other `url(...)`. All 7 are present in `media/`, begin with the `wOF2` signature, and fetch 200 with identical byte sizes locally and live. Emitted HTML/CSS contain no remote URL. Emitted JS contains only the strings listed under O-2. Page has 0 `img/picture/video/canvas/iframe` elements and 0 `svg` elements other than the pre-existing Text input error icon (O-2). Favicon is the local `favicon.ico`. |
| **Root script** is exactly `ng build gallery --base-href /brand-ui/` | **Pass** | `grep -c '"build:subfolder"' package.json` → 1; line 8 is exactly that command, with trailing slash. |
| **No prohibited change** (dependency, lockfile, route, SSR/service-worker, analytics, library/public API, token, Navigation, Design ID, application behavior) | **Pass** | `git diff --name-only aeb1513 HEAD` outside `mod-w/`, `e2e/`, `projects/gallery/src/app`, README and CLAUDE.md lists only `package.json`, `projects/gallery/public/robots.txt`, `projects/gallery/src/index.html` (the STEP-03 files in that range are the already-accepted About work). The implementation commit `f205dc3` touches exactly those three plus `mod-w` records. `git diff d49e703 f205dc3` over `mod-w/design`, `projects/ui`, `package-lock.json`, `angular.json`, `playwright.config.ts`, `e2e`, `projects/gallery/src/app` is empty. Emitted `index.html` has no service-worker or analytics reference; only the one `<meta>` line was added to the source. |
| **Accepted STEP-01–03 tests and behavior remain green**, exactly three Chromium specs, both axe surfaces | **Pass** | `e2e/` has exactly three `*.spec.ts`; `playwright.config.ts` has one project, `chromium`. 68 + 64 unit and 70 browser tests pass; both axe surfaces pass (above). Grep over `e2e` and `projects` for `.only(`, `.skip(`, `fixme`, `xit(`, `fit(`, `toMatchSnapshot`, `toHaveScreenshot`, `disableRules`, `.exclude(` finds nothing. No test file changed in the STEP-04 implementation commit. |
| **All prescribed gates pass under Node 26** | **Pass** | Gates table above. |
| **Remote publication, if requested, uses only the authorized host and URL and is verified after deployment** | **Pass** (see note) | Read-only Chromium checks of `https://www.frank-mcguire.com/brand-ui/` (the URL the Moderator identified): 15 responses all 200, 0 off-origin, 0 failed, 0 console/page errors; `<base href="/brand-ui/">`; robots meta correct; same About and refresh behavior as the local run; hashed bundle names identical to the local build; all 7 WOFF2 fetch 200 with the same sizes as local; `/brand-ui/robots.txt` returns the exact Disallow rule; the previously exposed `brand-ui-site.zip` now returns **404**. QA cannot observe who uploaded or what host was touched; consistent with the record that the Moderator uploaded manually, the deployed files match the local build. |

---

### Regressions or risks

No regressions found. No behavior outside STEP-04 scope was observed. No source file, test, token, library, route, dependency or `mod-w/design/**` file was modified by QA.

### Observations (non-blocking; none is a STEP-04 requirement)

| ID | Observation | Evidence | Suggested owner |
| -- | ----------- | -------- | --------------- |
| O-1 | Root `https://www.frank-mcguire.com/robots.txt` returns **404**. Crawlers read `robots.txt` only at a domain root, so the `/brand-ui/robots.txt` copy is not effective by itself; the page-level `noindex, nofollow` meta is the working AC-19 control at this path. A root rule is host-wide policy and outside this Step. | QA fetch: 404. Matches the Tech Lead's "Could fix later". | Moderator (host policy) |
| O-2 | Emitted JS contains non-request URL strings: Angular's XML namespaces and a docs URL; Angular Router's internal parsing base `http://fake`; the Text input specimen value `https://example.com/repo`; and the two authorized About links (`github.com/fpmcguire/mod-w`, `github.com/fpmcguire/brand-ui.git`). None is fetched; every network request is same-origin. One inline `svg` (circle and path, `aria-hidden`) exists on the page: the Text input error icon at `projects/ui/src/lib/text-input/text-input.html:17`, a STEP-02 element, not a new or third-party asset. | Response log; `grep` of emitted files; `git log` for text-input. | None (informational) |
| O-3 | `http://www.frank-mcguire.com/brand-ui/` returns 200 and does not redirect to HTTPS. The site carries no sensitive transaction and no STEP-04 check requires a redirect. | QA fetch: 200, final URL stays `http://`. | Moderator (host hardening) |
| O-4 | The default shell resolves Node 24.13.0 although Node 26.0.0 is the project target and `fnm` default; the repo has no `.nvmrc`/`.node-version`. Under Node 24 `ng` refuses to run. Pre-existing and unchanged by this Step. Also, `CLAUDE.md` still says S-13 implementation "requires separate Moderator approval" (stale now that STEP-04 is implemented, deployed and in QA); documentation drift only. | `node --version` → v24.13.0; `fnm list`. | Moderator |

### Manual checks required

None blocking. Remaining human decisions, not QA-verifiable:

1. The Moderator's final acceptance decision for STEP-04.
2. Whether to address O-1 (root `robots.txt`, scoped to `/brand-ui/` if added) and O-3 (HTTPS redirect), both host matters outside this Step and requiring separate authorization.
3. The "full project study review" gate in `roadmap.md` remains the Moderator's.

### Known limitations of this QA

- QA checked the deployed site with Chromium only (matching the project's browser scope) and at one point in time. The host's Mod Security rejects plain `curl` with 406; I did not test non-browser clients.
- The refresh check is a reload of `/brand-ui/`, the only gallery URL. The Step defines no other route, and I did not test deep paths or the no-trailing-slash form `/brand-ui`, which depend on host behavior.
- My first browser run reported seven failures. Investigation showed they were bugs in my script (asserting visibility immediately after a click, before the next render; and counting the pre-existing Text input `svg`), not application behavior. I corrected the script and re-ran the whole thing: **36/36 checks pass** locally and live. The per-check records above reflect the corrected run.
- Scratch scripts and logs are outside the repository (session scratchpad). `dist/`, `playwright-report/` and `test-results/` are git-ignored build outputs.

---

### Recommendation to the Moderator

**Accept STEP-04 on QA grounds, with notes O-1 to O-4 recorded.** All eight acceptance checks are met; no defect, regression, or scope violation was found. Not self-accepted. Final acceptance is the Moderator's decision.

---

MOD-W v5.0.1
