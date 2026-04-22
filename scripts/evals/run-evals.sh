#!/usr/bin/env bash
set -euo pipefail

curl -s -X POST http://localhost:8080/api/v1/evals/run | jq
