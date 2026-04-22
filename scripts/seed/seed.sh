#!/usr/bin/env bash
set -euo pipefail

cd apps/api
uv run python -m app.workers.seed
