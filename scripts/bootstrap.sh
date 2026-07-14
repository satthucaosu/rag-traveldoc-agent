#!/usr/bin/env bash
# First-run environment setup. Run once after cloning.
set -euo pipefail
cd "$(dirname "$0")/.."

echo "==> Installing dependencies"
(none)

echo "==> Running smoke check"
"$(dirname "$0")/check.sh"

echo "==> Bootstrap complete."
