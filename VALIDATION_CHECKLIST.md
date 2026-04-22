# VANGUARD: System Validation & Health Check

Use this document to verify your VANGUARD installation is complete and operational.

## Quick Health Check (1 minute)

### 1. Services Running?

```bash
docker-compose ps
```

**Expected:**
```
NAME              STATUS
postgres          Up (healthy)
redis             Up (healthy)
neo4j             Up (healthy)
opensearch        Up (healthy)
```

### 2. Database Ready?

```bash
curl -s http://localhost:8080/api/v1/health/dependencies | jq .
```

**Expected:**
```json
{
  "postgres": "up",
  "redis": "up",
  "neo4j": "up",
  "opensearch": "up"
}
```

### 3. Data Exists?

```bash
curl -s http://localhost:8080/api/v1/pull-requests | jq '. | length'
```

**Expected:** `3` (PR-3414, PR-3412, PR-3413)

### 4. Frontend Loading?

```bash
curl -s http://localhost:3000 | head -20
```

**Expected:** HTML response starting with `<!DOCTYPE html>`

---

## Complete Validation Checklist

### Backend Setup

- [ ] Python 3.11+ installed
  ```bash
  python3 --version
  ```

- [ ] FastAPI dependencies installed
  ```bash
  cd apps/api && pip list | grep -E "(fastapi|uvicorn|pydantic)"
  ```

- [ ] Database migrations applied
  ```bash
  cd apps/api && alembic current
  # Expected: "20260421_0001_init"
  ```

- [ ] Seeded data loaded
  ```bash
  curl -s http://localhost:8080/api/v1/pull-requests | jq '.[0].id'
  # Expected: "PR-3414"
  ```

- [ ] All API routes registered
  ```bash
  curl -s http://localhost:8080/api/v1/pull-requests \
    && curl -s http://localhost:8080/api/v1/releases \
    && curl -s http://localhost:8080/api/v1/audit \
    && echo "✓ All routes working"
  ```

### Frontend Setup

- [ ] Node.js 20+ installed
  ```bash
  node --version npm --version
  ```

- [ ] Dependencies installed
  ```bash
  cd apps/web && npm list next react @tanstack/react-query | head -5
  ```

- [ ] Build succeeds
  ```bash
  cd apps/web && npm run build --silent && echo "✓ Build OK"
  ```

- [ ] Dev server starts
  ```bash
  cd apps/web && timeout 10 npm run dev 2>&1 | grep "localhost:3000" || true
  ```

- [ ] Pages loadable
  ```bash
  curl -s http://localhost:3000 | grep -q "VANGUARD" && echo "✓ Frontend OK"
  ```

### Database

- [ ] PostgreSQL responsive
  ```bash
  psql -U vanguard -h localhost -d vanguard -c "SELECT COUNT(*) FROM pull_requests;" 2>/dev/null || echo "Not connected"
  ```

- [ ] Tables exist
  ```bash
  psql -U vanguard -h localhost -d vanguard -c "\dt" 2>/dev/null | grep -E "(pull_requests|audit_events|release_approvals)"
  ```

- [ ] Data present
  ```bash
  psql -U vanguard -h localhost -d vanguard -c "SELECT id FROM pull_requests LIMIT 3;" 2>/dev/null
  # Expected: PR-3414, PR-3412, PR-3413
  ```

### Integration

- [ ] API → Database connected
  ```bash
  curl -s http://localhost:8080/api/v1/pull-requests | jq '.[0]' | grep -q "PR-3414" && echo "✓ API→DB working"
  ```

- [ ] Frontend → API connected
  ```bash
  curl -s http://localhost:3000/pr-workspace | grep -q "PR Workspace" && echo "✓ Frontend→API working"
  ```

- [ ] End-to-end analysis works
  ```bash
  curl -s -X POST http://localhost:8080/api/v1/pull-requests/PR-3414/analyze | jq '.risk.score' | grep -q "[0-9]" && echo "✓ E2E working"
  ```

### Workflows

- [ ] Risk scoring works
  ```bash
  curl -s http://localhost:8080/api/v1/pull-requests/PR-3412 | jq '.risk.score'
  # Expected: ~72
  ```

- [ ] Policy evaluation works
  ```bash
  curl -s -X POST http://localhost:8080/api/v1/pull-requests/PR-3412/analyze | jq '.policies | length'
  # Expected: 2+ policies evaluated
  ```

- [ ] Release readiness works
  ```bash
  curl -s http://localhost:8080/api/v1/releases/REL-2026.04.3/readiness | jq '.score'
  # Expected: number between 0-100
  ```

- [ ] Approval workflow works
  ```bash
  curl -s -X POST http://localhost:8080/api/v1/releases/REL-2026.04.3/approve \
    -H "Content-Type: application/json" \
    -d '{"team":"platform","actor":"test"}' | jq '.status'
  ```

- [ ] Audit logging works
  ```bash
  curl -s http://localhost:8080/api/v1/audit | jq '. | length'
  # Expected: > 0
  ```

---

## Performance Baseline

Run these to establish baseline metrics:

### API Latency

```bash
for i in {1..10}; do
  time curl -s http://localhost:8080/api/v1/pull-requests > /dev/null
done
# Expected: ~50-200ms per request
```

### Analysis Latency

```bash
time curl -s -X POST http://localhost:8080/api/v1/pull-requests/PR-3414/analyze > /dev/null
# Expected: ~100-300ms
```

### Database Query

```bash
time psql -U vanguard -h localhost -d vanguard -c "SELECT * FROM pull_requests;" > /dev/null
# Expected: ~10-50ms
```

---

## Data Validation

### Pull Requests

```bash
curl -s http://localhost:8080/api/v1/pull-requests | jq -r '.[] | "\(.id): \(.title) (\(.changed_files | length) files)"'

# Expected:
# PR-3414: Observability tag normalization (3 files)
# PR-3412: Payment retry policy configuration (122 files)
# PR-3413: Auth hardening with tighter checks (89 files)
```

### Risk Scores

```bash
curl -s http://localhost:8080/api/v1/pull-requests | jq -r '.[] | "\(.id): \(.risk.severity) (\(.risk.score))"'

# Expected:
# PR-3414: LOW (15-30)
# PR-3412: MEDIUM (50-70)
# PR-3413: HIGH (70-85)
```

### Release Status

```bash
curl -s http://localhost:8080/api/v1/releases/REL-2026.04.3 | jq '{name, pr_ids, approvals}'

# Expected: release with 3 PRs, 2 required approvals (platform, security)
```

### Audit Trail

```bash
curl -s http://localhost:8080/api/v1/audit | jq '.[0] | {actor, action, object_type, object_id}'

# Expected: recent analysis or approval event
```

---

## Feature Validation

### ✅ Risk Scoring

- [ ] PR-3414 scores LOW (< 35)
- [ ] PR-3412 scores MEDIUM (35-59)
- [ ] PR-3413 scores HIGH (≥ 75)
- [ ] Risk reasons include file count, protected paths, test coverage

### ✅ Policy Evaluation

- [ ] PR-3412 triggers POL-CRIT-PAYMENTS-APPROVAL (blocks release)
- [ ] PR-3413 triggers POL-AUTH-CONFIG-SECURITY (requires security approval)
- [ ] Policies are evaluated per PR

### ✅ Impact Graph

- [ ] Impacted services returned for each PR
- [ ] Dependency traversal includes transitive services
- [ ] Depth information tracked

### ✅ Test Intelligence

- [ ] Coverage deltas shown (e.g., +1.9%, -7.8%)
- [ ] Flaky tests identified
- [ ] Failed tests listed with failure summary

### ✅ CI Intelligence

- [ ] CI job status aggregated (passed/unstable/failed)
- [ ] Retry counts tracked
- [ ] Failure messages captured

### ✅ Reviewer Recommendations

- [ ] Reviewers ranked by score
- [ ] Rationale provided for each recommendation
- [ ] Team ownership reflected

### ✅ Release Readiness

- [ ] Readiness score computed (0-100)
- [ ] Blockers identified (high-risk PRs, failed policies)
- [ ] Approval status tracked

### ✅ Audit Trail

- [ ] All analysis runs logged
- [ ] All approvals logged with actor/rationale
- [ ] All overrides logged with justification
- [ ] Events timestamped and immutable

### ✅ Audit Log Filtering

- [ ] Filter by actor works
- [ ] Filter by action works
- [ ] Event count shown
- [ ] Rationale displayed for approvals/overrides

### ✅ Interactive Workflows

- [ ] PR selection dropdown on PR Workspace
- [ ] Analyze button triggers fresh analysis
- [ ] Approval panel appears on Release Center
- [ ] Override panel appears with caution styling
- [ ] Success/error messages shown

---

## Docker Validation

### Container Status

```bash
docker-compose ps
docker-compose logs postgres | head -10
docker-compose logs redis | head -10
docker-compose logs neo4j | head -10
```

### Volume Persistence

```bash
# Verify volumes exist
docker volume ls | grep vanguard

# Check PostgreSQL data
docker-compose exec postgres ls -la /var/lib/postgresql/data/
```

### Health Checks

```bash
docker-compose ps | grep -E "(healthy|unhealthy)"
# Expected: all show "healthy" or "up"
```

---

## Stress Test (Optional)

### 100 Concurrent Requests

```bash
# Install Apache Bench if needed
ab -n 100 -c 10 http://localhost:8080/api/v1/pull-requests

# Expected: < 1% failure rate, avg response < 200ms
```

### Database Connection Pool

```bash
# Check active connections
psql -U vanguard -h localhost -d vanguard -c "SELECT count(*) FROM pg_stat_activity;"
# Expected: < 10 (depends on pool size)
```

---

## Clean State / Reset

If something breaks, clean and restart:

```bash
# Stop everything
docker-compose down

# Remove volumes (WARNING: loses data)
docker-compose down -v

# Restart
docker-compose up -d postgres redis neo4j opensearch

# Wait for ready
sleep 10

# Re-initialize
cd apps/api
alembic upgrade head
python -m app.workers.seed

# Restart backend/frontend
```

---

## Success Criteria

✅ **You're ready if:**

- [ ] All 8 services running (postgres, redis, neo4j, opensearch, api, web)
- [ ] Database schema created (3 tables: pull_requests, audit_events, release_approvals)
- [ ] Seeded data loaded (3 PRs, 1 release, policies, benchmarks)
- [ ] All 18+ API endpoints responding
- [ ] All 13 frontend pages rendering
- [ ] Risk scores computed correctly
- [ ] Policy evaluation working
- [ ] Approval workflow functional
- [ ] Audit trail capturing events
- [ ] Frontend can select PRs and trigger analysis
- [ ] Release readiness score calculated

---

## Next Steps

1. **If everything passes**: You're ready to deploy, customize, or extend
2. **If something fails**: Check troubleshooting section in [GETTING_STARTED.md](GETTING_STARTED.md)
3. **For production**: See [PRODUCTION_DEPLOYMENT.md](PRODUCTION_DEPLOYMENT.md)
4. **To customize**: Modify seeded data, add policies, extend risk factors
5. **To understand code**: Start with `/apps/api/app/services/` and `/apps/web/app/`
