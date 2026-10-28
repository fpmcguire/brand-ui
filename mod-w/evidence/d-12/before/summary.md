# D-12 before-measurement summary

Result: **PASS: five valid cold runs** (5 valid of 5 attempts; limit 7).

Baseline evidence only. It makes no performance, accessibility or maintainability improvement claim.

Accepted caveat (Moderator decision, option A): Lighthouse reported its slow-host-CPU warning on 5 of 5 used runs (benchmarkIndex below its threshold of 1000). Absolute LCP and TBT are therefore inflated and noisier; the after run must use the same machine and tooling.

## Lighthouse runs (valid, in order)

| Attempt | LCP (ms) | CLS | TBT (ms) | benchmarkIndex |
|---|---:|---:|---:|---:|
| 1 | 3237.5 | 0.0350 | 0.0 | 857 |
| 2 | 2559.6 | 0.0350 | 725.0 | 776 |
| 3 | 2513.6 | 0.0000 | 630.0 | 811 |
| 4 | 2555.5 | 0.0350 | 777.0 | 809 |
| 5 | 2956.7 | 0.0350 | 0.0 | 818 |
| **Median** | **2559.6** | **0.0350** | **630.0** | |

## All attempts

| Attempt | Valid | Reasons |
|---|---|---|
| 1 | yes |  |
| 2 | yes |  |
| 3 | yes |  |
| 4 | yes |  |
| 5 | yes |  |

## JavaScript loaded by the cold navigation (external files)

| File | Role | Loaded in runs | Raw | Gzip (L9) |
|---|---|---:|---:|---:|
| chunk-AHKUZRML.js | html-referenced | 5/5 | 137,041 B | 45,965 B |
| chunk-RK6W3FLA.js | startup-loaded | 5/5 | 63,719 B | 16,359 B |
| main-GFT2O7PC.js | html-referenced | 5/5 | 88,452 B | 25,016 B |
| **Total** | | | **289,212 B** | **87,340 B** |

## CSS loaded by the cold navigation

| Source | Raw | Gzip (L9) |
|---|---:|---:|
| external styles-MWHECO2O.css (html-referenced, 5/5 runs) | 8,256 B | 1,655 B |
| **External total** | **8,256 B** | **1,655 B** |
| inline <style> #0 | 38 B | 55 B |
| **Inline total** | **38 B** | **55 B** |
| **Combined CSS** | **8,294 B** | **1,710 B** |

JS + combined CSS: raw 297,506 B, gzip 89,050 B.

Inline <script> blocks (not in JS total): [{"index":0,"raw":163,"gzip":128}]

## Method

Size set: every Script and Stylesheet request in the Lighthouse network-requests audit of each of the five used (valid) cold runs (the navigation through the settled gallery page) that is same-origin under the base path, unioned with the <script src>, <link rel=stylesheet> and <link rel=modulepreload> URLs in dist index.html (<noscript> excluded), de-duplicated by built file path. The extraction fails if the loaded set differs between runs, if any request cannot be resolved to a build file, or if Lighthouse's resourceSize disagrees with the file's bytes. Sizes come only from the production-build files: raw = file bytes; gzip = zlib gzip level 9 of those bytes. Lighthouse transfer sizes are never used as gzip sizes; resourceSize is used only to verify the file match. Inline CSS = each <style> element's text in index.html (UTF-8) sized and gzipped individually, then summed. Combined CSS = external + inline. JS total = loaded external files only; inline <script> blocks are listed separately and excluded from every total. Compare before and after by the totals only: filenames carry content hashes and the file set may change between builds, so the per-file stem field in summary.json is informational only.The identical script and rule are applied to the after measurement.

## Size-set checks

- Loaded set identical across the 5 used runs: yes.
- Requests that could not be resolved to a build file: 0.
- Lighthouse resourceSize disagreements with build-file bytes: 0.
- Referenced by index.html but not loaded in any run: [].
