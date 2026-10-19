## Product Owner Sign-off — STEP-04

**Date:** 2026-10-19
**Placement:** Recorded here at the Moderator's direction. `step-04.md`, `review.md` and `qa.md` are unchanged. This sign-off is input to the Moderator's final gate; it is not Step acceptance.

### Verdict

Accepted with notes

### Acceptance check review

- **AC-19 static site: met.** The diff adds only the `build:subfolder` script and static files. QA and the Tech Lead each served `dist/gallery/browser` under a real `/brand-ui/` path and on the live URL: every response was 200, with no failed or off-origin request and no console errors. Load, refresh and About behavior were intact.
- **AC-19 no indexing: met.** `noindex, nofollow` is in both the source and emitted HTML. The emitted and live `/brand-ui/robots.txt` disallow `/` for all agents. See the O-1 judgment below.
- **AC-19 assets: met.** `check:assets` passed. Seven local WOFF2 files, a local favicon, no remote font or asset. The diff adds no asset. ArtAnon appears only as a text wordmark and palette values.
- **Exact root script: met.** One `build:subfolder` entry, exactly `ng build gallery --base-href /brand-ui/`.
- **No prohibited change: met.** The diff touches exactly the three allowed files; the source change is one `<meta>` line. QA reports empty diffs for `mod-w/design`, `projects/ui`, the lockfile, `angular.json`, `playwright.config.ts`, `e2e` and the gallery `app` directory.
- **STEP-01–03 coverage intact: met.** Per QA's independent re-run: 68 `ui`, 64 gallery and 70 browser tests in exactly three specs, with both axe surfaces passing. No skip, only, fixme, snapshot, excluded surface or disabled rule.
- **All gates under Node 26: met.** QA re-ran every gate under Node 26.0.0.
- **Remote publication: met.** The Moderator identified the host and URL and performed the upload. The deployed files match the local build, and `brand-ui-site.zip` returns 404.

### Notes

- **O-1 judgment.** The page-level `noindex, nofollow` meta alone satisfies AC-19. It is the control that works at a subfolder path. The `/brand-ui/robots.txt` copy is defense-in-depth that is not currently crawler-effective, because crawlers read `robots.txt` only at the domain root. It should not be described as the AC-19 control. The absent root `robots.txt` is what lets compliant crawlers fetch the page and read `noindex`. A future root `Disallow: /brand-ui/` would stop them reading it, and the URL could then appear as a bare link. Any root rule is host-wide policy and needs separate Moderator authorization and that trade-off weighed.
- **O-2 (non-request URL strings, Text input svg): no effect on acceptance.** The strings are XML namespaces, an Angular docs URL, the Router's `http://fake` parsing base, the `example.com` placeholder and the two authorized About links. All network requests are same-origin. The `svg` is the existing STEP-02 `aria-hidden` error icon.
- **O-3 (HTTP does not redirect to HTTPS): no effect on acceptance.** Neither S-13 nor AC-19 addresses transport. Host hardening, outside this Step.
- **O-4 (Node default, stale CLAUDE.md wording): no effect on acceptance.** The Node 24 default shell predates this Step. The stale `CLAUDE.md` S-13 wording was refreshed by the Moderator's direction on 2026-10-19. A Node-version pin (`.nvmrc` or `.node-version`) is a separate item.
- **Reference-spike and unofficial-concept wording: preserved.** The About panel (`projects/gallery/src/app/gallery/about-panel/about-panel.html`) and the gallery page footer say "reference spike, not production", "unofficial concept exploration", "no affiliation or delivery claim", and "no production, client-delivery, official-rebrand or rollout claim". STEP-04 touched neither file and adds no claim, badge or placeholder.
- **Limits of this validation.** The Product Owner independently checked the diff, the About source and the live `/brand-ui/robots.txt`. The deployed page's raw `<head>` and browser behavior rest on the Tech Lead and QA evidence. QA tested Chromium only, at one point in time, and did not test deep paths or `/brand-ui` without the trailing slash.
