#!/usr/bin/env bash
# D-12 measurement: one cold Lighthouse attempt. Usage: run-attempt.sh <attempt-number>
# Each attempt is a separate Node process, a freshly launched Chrome, and an empty user-data-dir.
# Lighthouse storage reset stays enabled (no --disable-storage-reset), so the cache is cold.
set -euo pipefail
N="${1:?attempt number}"
R=/c/Users/User/AppData/Local/Temp/bui-d12
TOOLS=$R/tools
OUT=$R/out
PROFILE=$R/profiles/p$N
CHROME='C:\Users\User\AppData\Local\ms-playwright\chromium-1248\chrome-win64\chrome.exe'
URL=http://localhost:4320/brand-ui/

[ ! -e "$OUT/reports/attempt-$N.json" ] || { echo "attempt $N already exists" >&2; exit 3; }
rm -rf "$PROFILE" && mkdir -p "$PROFILE"

export MSYS_NO_PATHCONV=1
export NG_CLI_ANALYTICS=false
export CHROME_PATH="$CHROME"

fnm exec --using=26.0.0 node "$(cygpath -w "$TOOLS/node_modules/lighthouse/cli/index.js")" \
  "$URL" \
  --form-factor=mobile \
  --throttling-method=simulate \
  --only-categories=performance \
  --chrome-flags="--headless=new --user-data-dir=$(cygpath -w "$PROFILE")" \
  --output=json \
  --output-path="$(cygpath -w "$OUT/reports/attempt-$N.json")" \
  > "$OUT/reports/attempt-$N.log" 2>&1
echo "attempt $N exit: $?"
