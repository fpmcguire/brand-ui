# STEP-04 — Static subfolder deployment

**Status:** QA REVIEW APPROVED — implementation and deployment complete; the Tech Lead recorded Pass after independent local, gate, and remote verification and the Moderator approved that review on 2026-10-19; QA then recorded Pass with notes, and the Moderator approved the QA review on 2026-10-19. Product Owner acceptance validation and the Moderator's final gate remain pending; the acceptance checkboxes below stay unchecked until the Moderator accepts the Step.

**Owner:** Development Team (Claude Code), after plan approval. Codex Tech Lead reviews; Moderator has final authority.

## Goal

Prepare and verify the gallery as a static site served from `/brand-ui/`, with indexing disabled and no third-party brand asset, without changing the `ui` library, application behavior, routes, tokens, Design IDs, dependencies, or accepted STEP-01–03 coverage.

## Authority and traceability

- Product: S-13 and AC-19; preserve AC-4, AC-8, AC-9, AC-12, and AC-17.
- Architecture: existing Angular application build, static assets, public-entry-point, asset/provenance, and verification boundaries.
- Domain language: gallery, reference spike, public entry point, three brands across four scopes.
- Design IDs: none. Deployment has no Design ID and must not add a badge or placeholder.
- Reference Implementation: rejected; the prototype is irrelevant to deployment and must not be used.

## Required implementation

1. Add exactly this root script to `package.json`:

   ```json
   "build:subfolder": "ng build gallery --base-href /brand-ui/"
   ```

2. Disable indexing in the built static site using both:
   - `<meta name="robots" content="noindex, nofollow" />` in the gallery document head; and
   - a static `robots.txt` containing `User-agent: *` and `Disallow: /`.
3. Build the gallery for the `/brand-ui/` subfolder and verify the emitted `dist/gallery/browser/index.html` base URL, robots meta, copied `robots.txt`, hashed local bundles, and local favicon/font references.
4. Do not add a deployment dependency, application route, runtime deployment branch, third-party asset, remote font, analytics, tracking, service worker, SSR, CNAME, production claim, or indexing exception.
5. Do not publish or mutate a remote hosting service until the Moderator separately identifies and authorizes the target and public URL.

## Allowed files

- `package.json`
- `projects/gallery/src/index.html`
- `projects/gallery/public/robots.txt` (new)
- A hosting workflow/configuration file only after the Moderator identifies and authorizes the target host.

No lockfile change is expected because no dependency changes are allowed. Stop if the package manager changes it.

## Development Team procedure

1. Inspect the accepted baseline and submit an exact file/command plan. State the final host/public URL if one has been authorized; otherwise limit the plan to deployment-ready static output.
2. Wait for separate Moderator approval of that exact plan.
3. Record Node, npm, Angular CLI, and TypeScript versions under Node 26.
4. Make the smallest approved change and build the `/brand-ui/` artifact.
5. Serve `dist/gallery/browser` under an actual `/brand-ui/` path locally and verify initial load, hashed scripts/styles, favicon, self-hosted fonts, About behavior, and browser refresh at the only gallery URL without network 404s.
6. Run every verification gate and return evidence. Stop for Tech Lead review; do not self-approve or deploy without explicit remote-target authority.

## Verification commands

Run under Node 26.0.0:

```text
node --version
npm --version
npx ng version
npx tsc --version
npm run format:check
npm run lint:tokens
npm run check:assets
npm run typecheck:e2e
npm test
npm run test:e2e
npm run build
npm run build:subfolder
git diff --check
git status --short
git status --short -- mod-w/design projects/ui package-lock.json angular.json playwright.config.ts
```

The report must also provide read-only evidence that:

- `package.json` contains exactly one `build:subfolder` script with the approved gallery command and `/brand-ui/` trailing slash;
- emitted `index.html` has `<base href="/brand-ui/">` and `noindex, nofollow`;
- emitted `robots.txt` disallows all crawlers;
- every emitted page resource resolves when hosted beneath `/brand-ui/`, with no remote fonts/assets or third-party brand asset;
- the default `npm run build`, all 68 `ui` tests, all 64 gallery tests, exactly three Chromium specifications, complete-gallery axe, open-dialog axe, and 70 browser tests remain unchanged and passing;
- no library/public API, token, Navigation, Design-ID, route, dependency/lockfile, About lifecycle/content, first-visit behavior, or `mod-w/design/**` change entered the implementation;
- no skipped/only/fixme test, disabled axe rule, excluded surface, snapshot, or assertion weakening was added.

## Acceptance checks

- [ ] **AC-19 static site:** the gallery builds to static files and works from `/brand-ui/` with no broken local resource request.
- [ ] **AC-19 no indexing:** source and emitted HTML contain `noindex, nofollow`, and emitted `robots.txt` disallows `/` for every user agent.
- [ ] **AC-19 assets:** `check:assets` passes and the deployment contains no third-party brand asset or remote font/asset.
- [ ] The root `build:subfolder` script is exactly `ng build gallery --base-href /brand-ui/`.
- [ ] No dependency, lockfile, route, SSR/service-worker, analytics, library/public-API, token, Navigation, Design-ID, or application-behavior change occurs.
- [ ] Accepted STEP-01–03 tests and behavior remain green, including exactly three Chromium specs and both axe surfaces.
- [ ] Formatting, token, asset, typecheck, unit, browser, default build, subfolder build, diff, and scope gates pass under Node 26.
- [ ] Remote publication, if requested, uses only the separately authorized host and URL and is verified after deployment.

Every checkbox remains unmet until supported by diff, command, browser, or deployed-URL evidence and independent review.

## Development Team record

Recorded 2026-10-19 by the Development Team (Claude Code). This is evidence for Tech Lead review, not self-approval.

**Implementation.** Three allowed files only: `package.json` (`build:subfolder`, exactly `ng build gallery --base-href /brand-ui/`), `projects/gallery/src/index.html` (`<meta name="robots" content="noindex, nofollow" />`; source `<base href="/" />` unchanged), and new `projects/gallery/public/robots.txt` (`User-agent: *`, `Disallow: /`). No lockfile, `angular.json`, `playwright.config.ts`, `projects/ui`, or `mod-w/design/**` change.

**Versions (Node 26.0.0).** npm 11.12.1; Angular CLI 22.2.3; TypeScript 6.0.3.

**Gates (all exit 0).** `format:check`; `lint:tokens` (51 contract tokens, four scopes, components clean); `check:assets` (no restricted assets); `typecheck:e2e`; `npm test` (`ui` 68/68, `gallery` 64/64); `test:e2e` (Chromium 70/70, same three specifications, both axe surfaces); `npm run build` (emits `<base href="/">`); `npm run build:subfolder`; `git diff --check` (only LF/CRLF warnings). Scope status over `mod-w/design projects/ui package-lock.json angular.json playwright.config.ts` was empty. No `.only`, `.skip`, `fixme`, snapshot, disabled axe rule, or excluded surface was added.

**Emitted output.** `dist/gallery/browser/index.html` has `<base href="/brand-ui/">` and `noindex, nofollow`; `robots.txt` was copied with the Disallow rule; scripts and styles are hashed; all seven fonts are local `./media/*.woff2`; the favicon is local. Emitted HTML and CSS contain no remote URL. The JavaScript contains only XML namespaces, an Angular documentation string, the `example.com` input placeholder, and the two authorized About links.

**Local `/brand-ui/` run.** `dist/gallery/browser` was served under `/brand-ui/` by a throwaway static server kept outside the repository. In Chromium, initial load and refresh made 19 requests, all 200, with no failed, off-origin, or console-error request. About auto-opened on first visit with seven headings and two links, closed by Close and Esc with focus returning to About, did not auto-open after refresh, and reopened manually.

**Remote publication.** On the Moderator's identification (cPanel `public_html/frank-mcguire/brand-ui`, public URL `https://www.frank-mcguire.com/brand-ui/`), the `build:subfolder` output was uploaded manually by the Moderator as a zip and extracted; the Development Team did not access the host. Post-deployment Chromium checks at that URL showed all requests 200 or 304 with none failed or off-origin, no console errors, `<base href="/brand-ui/">`, `noindex, nofollow`, `/brand-ui/robots.txt` returning the Disallow rule, local favicon and fonts, and the same About behavior and refresh as above.

**Open observations (not changes).**

- `brand-ui-site.zip` was still publicly downloadable at `/brand-ui/brand-ui-site.zip` when last checked; the Moderator was asked to delete it and it has not been rechecked since.
- Crawlers read `robots.txt` only at a domain root, so the `/brand-ui/robots.txt` copy is not effective by itself; the meta tag is the working control at this path. A root `robots.txt` is a host matter outside this Step.
- `http://www.frank-mcguire.com/brand-ui/` returns 200 without redirecting to HTTPS; no change was made.
- The host's Mod Security returns 406 to plain `curl`; browsers are unaffected.

## Stop conditions

Stop and report if the exact Development Team plan is not separately approved; a host or URL must be guessed; a dependency, lockfile, route, library, token, Design-ID, asset, SSR, service-worker, analytics, or unrelated change seems necessary; `/brand-ui/` produces a broken resource; indexing cannot be disabled; any existing gate fails; or remote publication would exceed explicit Moderator authority.

---

MOD-W v5.0.1
