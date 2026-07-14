#!/usr/bin/env bash
# Unified verification — run before marking work done.
set -euo pipefail
cd "$(dirname "$0")/.."

echo "==> Tests"
(none) || exit $?

echo "==> All checks passed."
