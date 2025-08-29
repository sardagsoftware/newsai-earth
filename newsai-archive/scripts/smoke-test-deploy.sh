#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -lt 1 ]; then
  echo "Usage: $0 <base-url> [query]"
  echo "Example: $0 https://my-preview-url.vercel.app 'iklim değişikliği etkileri'"
  exit 2
fi

BASE="$1"
Q="${2:-iklim değişikliği etkileri}"

if ! command -v jq >/dev/null 2>&1; then
  echo "Warning: 'jq' not found — output will not be pretty-printed. Install jq for nicer output."
  curl -s -X POST "$BASE/api/search" -H "Content-Type: application/json" -d "{\"q\": \"$Q\"}" || true
  exit 0
fi

echo "Testing: $BASE/api/search?q=$Q"
curl -s -X POST "$BASE/api/search" \
  -H "Content-Type: application/json" \
  -d "{\"q\": \"$Q\"}" | jq '.'
