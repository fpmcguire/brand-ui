# D-12 before-measurement: commands

Run from a detached worktree at `v1.0.0` (`bd24152`), with every Node and npm invocation through `fnm exec --using=26.0.0`. On Windows, call `npm.cmd` (not `npm`) under `fnm exec`, and set `MSYS_NO_PATHCONV=1` when passing `/brand-ui/` from Git Bash.

```bash
R=/c/Users/User/AppData/Local/Temp/bui-d12      # approved temporary root
git worktree add --detach "$R/wt" v1.0.0

# Frozen install and production /brand-ui/ build (cwd $R/wt, NG_CLI_ANALYTICS=false)
fnm exec --using=26.0.0 npm.cmd ci --no-audit --no-fund
fnm exec --using=26.0.0 npm.cmd run build:subfolder      # ng build gallery --base-href /brand-ui/

# Pinned Lighthouse, outside the repository (cwd $R/tools, with tooling/package.json + package-lock.json)
fnm exec --using=26.0.0 npm.cmd ci --ignore-scripts --no-audit --no-fund

# Serve the production output (identical implementation reused for the after run)
MSYS_NO_PATHCONV=1 fnm exec --using=26.0.0 node scripts/serve.mjs "$R/wt/dist/gallery/browser" 4320 /brand-ui/

# One cold attempt (repeat for N = 1..5); see scripts/run-attempt.sh
bash scripts/run-attempt.sh N

# Validate, take medians, compute initial JS/CSS raw + gzip, write summary.json / summary.md
fnm exec --using=26.0.0 node scripts/extract.mjs reports "$R/wt/dist/gallery/browser" .
```

`run-attempt.sh` runs Lighthouse 13.5.0 with `--form-factor=mobile --throttling-method=simulate --only-categories=performance` and `--chrome-flags="--headless=new --user-data-dir=…"`, `CHROME_PATH` set to the pinned Chromium. Chrome-launcher supplies its own fresh temporary profile for each launch, so every attempt is cold.

## Calculation method for STEP-08

Revised after the Tech Lead review (`mod-w/review.md`). See the Method section of `summary.md`. In short:

- **Size set:** every Script and Stylesheet request in the `network-requests` audit of each of the five used cold runs (the navigation through the settled gallery page) that is same-origin under `/brand-ui/`, unioned with the `<script src>`, `<link rel=stylesheet>` and `<link rel=modulepreload>` URLs in `dist/gallery/browser/index.html` (`<noscript>` excluded). It is de-duplicated by built file path. This includes the startup-loaded gallery route chunk.
- **Sizes:** read only from the production-build files. Raw is file bytes and gzip is zlib level 9 of those bytes. Lighthouse transfer sizes are never used as gzip sizes. Lighthouse `resourceSize` is used only to verify it equals the file's bytes.
- **Fails on:** a loaded set that differs between runs, a request that cannot be resolved to a build file, or a `resourceSize` mismatch.
- **Inline content:** `<style>` text is sized per element, reported separately, then combined with the external stylesheets. Inline `<script>` blocks are listed separately and excluded from every total.
- **Reuse for STEP-08:** run the identical `extract.mjs` on the after reports and build. Compare the totals only, never filenames, because content hashes and the file set change between builds.
- **Medians:** taken per metric over the five valid runs; the raw timing reports were not re-run or modified.

Re-extraction command (needs a production `/brand-ui/` build of `v1.0.0` at `$R/wt/dist/gallery/browser`; hashed filenames were identical on rebuild):

```bash
fnm exec --using=26.0.0 node scripts/extract.mjs reports "$R/wt/dist/gallery/browser" .
```

## Known limits

- The slow-host-CPU warning appeared on every run (accepted by the Moderator). Absolute LCP and TBT are inflated and noisy, and the five runs differ widely (for example TBT 0 ms in two runs against 630 to 777 ms in three). The after run must use the same machine, power plan and tooling.
- The gallery route chunk `chunk-RK6W3FLA.js` loads at startup and is now inside the size baseline (it was missing from the first submission). The method counts what the cold navigation loaded, not only what `index.html` references.
- The size baseline came from a second build of the frozen `v1.0.0` checkout (fresh `npm ci`, same production command). The hashed filenames and byte sizes matched the first build, and the Lighthouse runs were not repeated.
- The results are baseline evidence only. They claim no improvement.
