# VANGUARD: Complete Setup Guide

## Quick Start (5 minutes)

### Prerequisites
- Docker & Docker Compose
- Python 3.11+
- Node.js 20+
- Make (optional, but helpful)

### 1. Clone & Setup

```bash
cd /Users/pavan/Desktop/AI\ Projects/VANGUARD

# Copy environment template
cp .env.example .env

# View .env to confirm settings
cat .env
```

### 2. Start Infrastructure

```bash
# Start all services (postgres, redis, neo4j, opensearch)
docker-compose up -d

# Verify services are running
docker-compose ps

# Check PostgreSQL is ready
docker-compose exec postgres pg_isready
```

### 3. Initialize Database

```bash
# Navigate to backend
cd apps/api

# Install dependencies
pip install -r requirements.txt

# Run Alembic migrations to create schema
alembic upgrade head

# Verify tables were created
alembic current
```

### 4. Seed Data

```bash
# Load seeded datasets (PRs, releases, policies, etc.)
python -m app.workers.seed

# Verify data loaded by checking API
curl http://localhost:8080/api/v1/pull-requests
```

### 5. Start Backend API

```bash
# From apps/api/
uvicorn app.main:app --host 0.0.0.0 --port 8080 --reload
```

### 6. Start Frontend (new terminal)

```bash
cd /Users/pavan/Desktop/AI\ Projects/VANGUARD/apps/web

# Install dependencies
npm install

# Start dev server
npm run dev
```

### 7. Access the App

- **Web UI**: http://localhost:3000
- **API Docs**: http://localhost:8080/docs
- **PostgreSQL**: localhost:5432 (user: vanguard, password: vanguard_dev)
- **Redis**: localhost:6379
- **Neo4j**: http://localhost:7474 (user: neo4j, password: password)

---

## What Gets Set Up

### Database Schema (PostgreSQL)

```sql
-- Created by alembic upgrade head
CREATE TABLE pull_requests (
  id TEXT PRIMARY KEY,
  repository TEXT,
  title TEXT,
  author TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

CREATE TABLE audit_events (
  id TEXT PRIMARY KEY,
  timestamp TIMESTAMP,
  actor TEXT,
  action TEXT,
  object_type TEXT,
  object_id TEXT,
  rationale TEXT,
  metadata JSONB
);

CREATE TABLE release_approvals (
  id TEXT PRIMARY KEY,
  release_id TEXT,
  team TEXT,
  approved BOOLEAN,
  actor TEXT,
  timestamp TIMESTAMP
);
```

### Seeded Data

- **3 Pull Requests** with realistic CI/test scenarios
- **1 Release Candidate** (REL-2026.04.3) with approvals workflow
- **3 Ownership Teams** with code path coverage
- **3 Policy Rules** for payment/auth/high-risk changes
- **3 Benchmark Cases** for quality evaluation
- **10-node Dependency Graph** (services, repos, teams, jobs)

### Services Running

| Service | Port | Purpose |
|---|---|---|
| PostgreSQL | 5432 | PR metadata, audit, approvals |
| Redis | 6379 | Caching, session coordination |
| Neo4j | 7474/7687 | Service dependency graph |
| OpenSearch | 9200 | Full-text search (optional) |
| FastAPI | 8080 | Backend API |
| Next.js | 3000 | Web frontend |

---

## Verify Everything Works

### 1. Health Check

```bash
# All dependencies up?
curl http://localhost:8080/api/v1/health/dependencies
```

**Expected response:**
```json
{
  "postgres": "up",
  "redis": "up",
  "neo4j": "up",
  "opensearch": "up"
}
```

### 2. Get Pull Requests

```bash
curl http://localhost:8080/api/v1/pull-requests
```

**Expected:** 3 PRs (PR-3414, PR-3412, PR-3413)

### 3. Run Analysis

```bash
curl -X POST http://localhost:8080/api/v1/pull-requests/PR-3414/analyze
```

**Expected:** Risk score, impacted services, policy findings

### 4. Check Releases

```bash
curl http://localhost:8080/api/v1/releases
```

**Expected:** REL-2026.04.3 with readiness score

### 5. View Audit Log

```bash
curl http://localhost:8080/api/v1/audit
```

**Expected:** List of analysis events

---

## Full Data Flow Example

```
1. User opens http://localhost:3000 → Dashboard page
2. Dashboard calls GET /api/v1/pull-requests → gets 3 PRs
3. User clicks PR-3412 → navigates to PR Workspace
4. Workspace calls POST /api/v1/pull-requests/PR-3412/analyze
5. Backend runs analysis:
   - risk_service.score() → 72 (HIGH)
   - graph_service.service_graph() → 5 impacted services
   - policy_service.evaluate() → POL-CRIT-PAYMENTS-APPROVAL blocks it
   - pr_service.recommend_reviewers() → recommends team-payments lead
   - provider_service.pr_summary() → generates grounded summary
   - audit_service.log() → records analysis event
6. API returns complete AnalysisResult
7. Frontend renders Risk, Reviewers, Tests, CI, Policies, Summary, Impact
8. User clicks "Submit Approval" on Release Center
9. Frontend POSTs to /api/v1/releases/REL-2026.04.3/approve
10. Backend:
    - release_service.approve() → updates approval state
    - audit_service.log() → records approval decision
    - response includes updated release status
11. Audit Log shows approval event
```

---

## Production Readiness Checklist

### ✅ Currently Working (Local Dev)
- [x] All 18+ API endpoints operational
- [x] 13 frontend pages fully wired
- [x] Seeded realistic data
- [x] Docker Compose infrastructure code
- [x] Database schema and migrations
- [x] Audit trail for all actions
- [x] Error handling middleware
- [x] Structured JSON logging
- [x] Health/dependency checks

### ⚠️ For Production, You Need

#### 1. **Real Database Connection**
```bash
# Edit .env
POSTGRES_URL=postgresql://user:password@prod-db.example.com:5432/vanguard

# Run migrations on prod database
alembic upgrade head

# Migrate seeded data to prod (optional)
```

#### 2. **Secrets Management**
```bash
# Don't use .env files - use:
# - Environment variables (k8s secrets)
# - AWS Secrets Manager / Azure Key Vault
# - HashiCorp Vault

# Update config/settings.py to read from secret store
```

#### 3. **Authentication & Authorization**
```python
# apps/api/app/middleware/auth.py (create)
# - OAuth2/OpenID Connect integration
# - Team-based RBAC
# - API key authentication for CI/CD
```

#### 4. **HTTPS/TLS**
```bash
# Use reverse proxy (Nginx/Traefik)
# - Terminate TLS
# - Rate limiting
# - Request validation
```

#### 5. **Logging & Monitoring**
```python
# Current: stdout JSON logs
# Production:
# - Send logs to ELK/DataDog/Splunk
# - Add OpenTelemetry tracing
# - Set up dashboards for error rates, latency
```

#### 6. **Database Optimization**
```sql
-- Add indexes for query performance
CREATE INDEX idx_pr_risk_score ON pull_requests(risk_score);
CREATE INDEX idx_audit_actor ON audit_events(actor);
CREATE INDEX idx_release_status ON releases(status);

-- Configure connection pooling (PgBouncer)
```

#### 7. **Deployment**
```yaml
# Kubernetes manifests or Docker Swarm config
# - API deployment (replicas=3+)
# - Web deployment (replicas=3+)
# - PostgreSQL (managed DB service recommended)
# - Redis (managed cache service)
# - Horizontal auto-scaling
# - Health check probes
```

#### 8. **CI/CD Integration**
```bash
# GitHub Actions workflow (.github/workflows/deploy.yml)
# - Build Docker images
# - Run tests
# - Push to registry
# - Deploy to prod cluster
```

#### 9. **Backup & Disaster Recovery**
```bash
# PostgreSQL backups
# - Automated daily backups
# - Point-in-time recovery testing
# - Cross-region replication

# Redis snapshots
# - Regular RDB dumps
```

#### 10. **Performance Tuning**
```python
# Implement caching
# - Redis for PR analysis results (TTL: 1 hour)
# - Redis for policy evaluations (TTL: 30 min)
# - Redis for risk scores (TTL: 2 hours)

# Query optimization
# - Add database indexes
# - Use connection pooling
# - Pagination for large result sets
```

---

## Quick Troubleshooting

### PostgreSQL won't connect

```bash
# Check if container is running
docker-compose ps postgres

# Check logs
docker-compose logs postgres

# Reset database
docker-compose down -v
docker-compose up -d postgres
sleep 5
alembic upgrade head
python -m app.workers.seed
```

### API returning 500 errors

```bash
# Check API logs
docker-compose logs api

# Or if running locally:
# Look at terminal where you ran `uvicorn`

# Common issues:
# - DATASET_ROOT not set correctly (check .env)
# - Database migrations not applied (run: alembic upgrade head)
# - Missing seeded data (run: python -m app.workers.seed)
```

### Frontend can't reach API

```bash
# Check API is running
curl http://localhost:8080/api/v1/health

# Check CORS is configured
# (should be in FastAPI app, already configured)

# Check frontend is calling correct URL
# (should be http://localhost:8080, check lib/api/client.ts)
```

### Graph visualization not showing

```bash
# Currently Impact Explorer shows raw edge data
# See GAPS_AND_ROADMAP.md for graph viz implementation
# Need to add D3.js or similar
```

---

## Next Steps

1. **Explore the Data**
   - Open http://localhost:3000/audit-log to see all events
   - Try filtering by actor/action
   - Check timestamp correlation

2. **Run Benchmarks**
   ```bash
   curl -X POST http://localhost:8080/api/v1/evals/run
   ```

3. **Test Approval Workflow**
   - Open Release Center
   - Click "Submit Approval" for pending team
   - Check Approvals Queue updates
   - Verify audit log shows approval event

4. **Examine Impact Analysis**
   - Open PR Workspace
   - Select PR-3413 (auth hardening)
   - View impacted services list
   - Check policy evaluation for security

5. **Deploy to Production** (when ready)
   - See Production Readiness Checklist above
   - Containerize with production secrets
   - Set up monitoring/alerting
   - Configure autoscaling
   - Test failover scenarios

---

## Code Locations

| Component | Path | Language |
|---|---|---|
| **Backend API** | `/apps/api/app/main.py` | Python |
| **Service Layer** | `/apps/api/app/services/*.py` | Python |
| **API Routes** | `/apps/api/app/api/v1/routes/*.py` | Python |
| **Database Models** | `/apps/api/app/db/models.py` | Python |
| **Migrations** | `/apps/api/alembic/versions/*.py` | Python |
| **Frontend** | `/apps/web/app/**/*.tsx` | TypeScript/React |
| **API Client** | `/apps/web/lib/api/client.ts` | TypeScript |
| **Seeded Data** | `/datasets/**/*.json` | JSON |
| **Docker Config** | `/docker-compose.yml` | YAML |
| **Docs** | `/docs/**/*.md` | Markdown |

---

## Support

- **API Docs**: http://localhost:8080/docs (Swagger UI)
- **Architecture**: See [docs/architecture/system-overview.md](../docs/architecture/system-overview.md)
- **Known Gaps**: See [GAPS_AND_ROADMAP.md](../GAPS_AND_ROADMAP.md)
- **Decisions**: See [docs/decisions/](../docs/decisions/)
