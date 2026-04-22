# Local Operations Runbook

## Health checks
- GET /health
- GET /health/dependencies

## Common operations
- Analyze PR: POST /api/v1/pull-requests/{id}/analyze
- Evaluate release: POST /api/v1/releases/{id}/evaluate
- Run eval suite: POST /api/v1/evals/run
