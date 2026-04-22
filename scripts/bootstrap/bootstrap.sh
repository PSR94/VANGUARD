#!/usr/bin/env bash
set -euo pipefail

echo "[bootstrap] Copying env template"
cp -n .env.example .env || true

echo "[bootstrap] Starting infrastructure"
docker compose up -d postgres redis neo4j opensearch

echo "[bootstrap] Done"
