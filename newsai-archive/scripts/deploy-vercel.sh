#!/usr/bin/env bash
# Simple helper to deploy with Vercel CLI. Requires VEREL_TOKEN env var or logged-in CLI.
set -euo pipefail
if ! command -v vercel >/dev/null 2>&1; then
  echo "Please install Vercel CLI: npm i -g vercel"
  exit 1
fi
# Use the current branch name
BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "Deploying branch: $BRANCH"
vercel --prod --confirm
