# VANGUARD: Git Commit Plan

## Commit Strategy Overview

This document provides a 28-commit sequence that breaks down the completed VANGUARD project into logically coherent, reviewable milestones. The order respects architectural dependencies while maintaining clean, atomic commits.

**Principles Applied:**
- Backend foundation first, then frontend dependent on it
- Services organized by domain (risk, policy, graph, etc.)
- Pages grouped by functional area
- Data and infrastructure supporting the main stack
- Documentation placed at natural inflection points
- Each commit is complete and builds on prior ones

---

## Phase Overview

| Phase | Commits | Purpose |
|-------|---------|---------|
| **Phase 1: Foundation** | 1-4 | Repository setup, config, core docs, backend initialization |
| **Phase 2: Backend Services** | 5-13 | Database, service layer, API infrastructure |
| **Phase 3: Frontend** | 14-23 | UI framework, pages, components, client libraries |
| **Phase 4: Data & Ops** | 24-28 | Seeded data, infrastructure, scripts, deployment docs |

---

## Commit Plan Table

| # | Commit Message | Purpose | Files/Folders | Dependencies | Size | Risk |
|---|---|---|---|---|---|---|
| **1** | `bootstrap: repository foundation with license and readme` | Initialize repo with legal docs | LICENSE, README.md, .gitignore | None | 20 files | ✅ Low |
| **2** | `chore: project structure and core configuration` | Setup build config, env templates, makefiles | .env.example, Makefile, packages/, pyproject.toml, tsconfig | #1 | 8 files | ✅ Low |
| **3** | `docs: architecture and getting started guides` | Foundational documentation | docs/architecture/, docs/assets/banner.svg, INDEX.md, GETTING_STARTED.md | #2 | 5 files | ✅ Low |
| **4** | `backend: core configuration and logging` | FastAPI setup, config mgmt, structured logging | apps/api/app/config/, apps/api/app/core/ | #2 | 3 files | ✅ Low |
| **5** | `backend: domain models and pydantic schemas` | Type-safe domain layer | apps/api/app/schemas/domain.py | #4 | 1 file | ✅ Low |
| **6** | `backend: database schema and alembic migrations` | Persistent data layer | apps/api/alembic/ | #5 | 3 files | ✅ Low |
| **7** | `backend: core services - data loading and health checks` | Data persistence abstraction | apps/api/app/services/data_store.py, health_service.py | #6 | 2 files | ✅ Low |
| **8** | `backend: analysis orchestration service` | Central analysis workflow | apps/api/app/services/analysis_service.py | #7 | 1 file | ✅ Medium |
| **9** | `backend: risk scoring engine` | Risk computation with weighted factors | apps/api/app/services/risk_service.py | #7 | 1 file | ✅ Low |
| **10** | `backend: policy evaluation and graph traversal` | Policy rules and impact analysis | apps/api/app/services/policy_service.py, graph_service.py | #7 | 2 files | ✅ Medium |
| **11** | `backend: pr metadata and release services` | PR ingestion and release readiness | apps/api/app/services/pr_service.py, release_service.py | #7 | 2 files | ✅ Medium |
| **12** | `backend: audit logging, evaluation, and insights` | Event logging, benchmarking, metrics | apps/api/app/services/audit_service.py, eval_service.py, insights_service.py, provider_service.py | #8 | 4 files | ✅ Low |
| **13** | `api: routes and fastapi application` | REST endpoints and middleware | apps/api/app/main.py, apps/api/app/api/v1/ | #12 | 7 files | ⚠️ Medium |
| **14** | `backend: data seeding worker and requirements` | Initialize datasets, dependencies | apps/api/app/workers/seed.py, apps/api/requirements.txt, Dockerfile | #13 | 3 files | ✅ Low |
| **15** | `frontend: bootstrap with tailwind and next.js config` | Build config, styling foundation | apps/web/package.json, tsconfig.json, tailwind.config.ts, next.config.mjs, app/globals.css | #2 | 6 files | ✅ Low |
| **16** | `frontend: root layout and provider setup` | React context, layout scaffold | apps/web/app/layout.tsx, providers.tsx | #15 | 2 files | ✅ Low |
| **17** | `frontend: api client and type definitions` | HTTP client, domain type contracts | apps/web/lib/api/client.ts, types/domain.ts | #5 | 2 files | ✅ Low |
| **18** | `frontend: navigation sidebar component` | Primary navigation | apps/web/components/navigation/sidebar.tsx | #16 | 1 file | ✅ Low |
| **19** | `frontend: dashboard and pr workspace pages` | Core analysis surfaces | apps/web/app/page.tsx, pr-workspace/ | #18 | 2 files | ⚠️ Medium |
| **20** | `frontend: reviewer recommendations page` | Detailed reviewer scoring | apps/web/app/reviewer-recommendations/ | #18 | 1 file | ✅ Low |
| **21** | `frontend: release and approval workflow pages` | Release readiness and approval state | apps/web/app/release-center/, approvals-queue/ | #18 | 2 files | ⚠️ Medium |
| **22** | `frontend: operational intelligence pages` | Impact, tests, CI | apps/web/app/impact-explorer/, test-intelligence/, ci-health/ | #18 | 3 files | ✅ Low |
| **23** | `frontend: governance and audit visibility pages` | Policies, audit log, insights | apps/web/app/policy-center/, audit-log/, engineering-insights/ | #18 | 3 files | ✅ Low |
| **24** | `frontend: status and settings pages` | Health checks, configuration visibility | apps/web/app/status-center/, settings/ | #18 | 2 files | ✅ Low |
| **25** | `frontend: ui components and interactive panels` | Reusable components, approval workflows | apps/web/components/ | #21 | 4 files | ✅ Low |
| **26** | `data: seeded datasets for pr/release/policy scenarios` | Example data loading | datasets/pull_requests/, releases/, ci_runs/, test_runs/, ownership/, policies/ | #14 | 7 files | ✅ Low |
| **27** | `data: evaluation benchmarks and dependency graph` | Quality validation and impact data | datasets/evals/, examples/ | #26 | 2 files | ✅ Low |
| **28** | `infra: docker compose, postgres, redis, neo4j, opensearch` | Local development orchestration | docker-compose.yml, infra/docker/, infra/postgres/, infra/redis/, infra/neo4j/, infra/opensearch/ | #14 | 8 files | ✅ Low |
| **29** | `scripts: automation for local development and testing` | Bootstrap, seeding, quality checks | scripts/ | #28 | 6 files | ✅ Low |
| **30** | `docs: governance policies and design decisions` | Policy baseline, ADRs | docs/governance/, docs/decisions/ | #3 | 2 files | ✅ Low |
| **31** | `docs: api reference and operational runbooks` | Endpoint documentation, operations | docs/api/, docs/runbooks/ | #13 | 2 files | ✅ Low |
| **32** | `docs: comprehensive setup and deployment guides` | Production-ready documentation | SETUP_AND_PRODUCTION.md, PRODUCTION_DEPLOYMENT.md | #3 | 2 files | ✅ Low |
| **33** | `docs: validation checklist and gaps roadmap` | System verification and future work | VALIDATION_CHECKLIST.md, GAPS_AND_ROADMAP.md | #32 | 2 files | ✅ Low |

**Total: 33 commits**

---

## Exact Git Commands

### Phase 1: Foundation

```bash
# Commit 1: Bootstrap
git add LICENSE README.md .gitignore
git commit -m "bootstrap: repository foundation with license and readme"

# Commit 2: Project Structure
git add .env.example Makefile pyproject.toml packages/
git add apps/api/pyproject.toml apps/web/tsconfig.json apps/web/package.json
git add apps/api/alembic.ini
git commit -m "chore: project structure and core configuration"

# Commit 3: Documentation Foundation
git add docs/architecture/system-overview.md docs/assets/banner.svg
git add INDEX.md GETTING_STARTED.md
git commit -m "docs: architecture and getting started guides"

# Commit 4: Backend Core Setup
git add apps/api/app/config/settings.py
git add apps/api/app/core/logging.py
git add apps/api/app/exceptions.py
git commit -m "backend: core configuration and logging"
```

### Phase 2: Backend Services

```bash
# Commit 5: Domain Models
git add apps/api/app/schemas/domain.py
git add apps/api/app/db/models.py
git commit -m "backend: domain models and pydantic schemas"

# Commit 6: Database Setup
git add apps/api/alembic/env.py
git add apps/api/alembic/versions/20260421_0001_init.py
git commit -m "backend: database schema and alembic migrations"

# Commit 7: Core Services
git add apps/api/app/services/data_store.py
git add apps/api/app/services/health_service.py
git add apps/api/app/services/__init__.py
git commit -m "backend: core services - data loading and health checks"

# Commit 8: Analysis Service
git add apps/api/app/services/analysis_service.py
git commit -m "backend: analysis orchestration service"

# Commit 9: Risk Service
git add apps/api/app/services/risk_service.py
git commit -m "backend: risk scoring engine"

# Commit 10: Policy and Graph Services
git add apps/api/app/services/policy_service.py
git add apps/api/app/services/graph_service.py
git commit -m "backend: policy evaluation and graph traversal"

# Commit 11: PR and Release Services
git add apps/api/app/services/pr_service.py
git add apps/api/app/services/release_service.py
git commit -m "backend: pr metadata and release services"

# Commit 12: Audit, Eval, Insights
git add apps/api/app/services/audit_service.py
git add apps/api/app/services/eval_service.py
git add apps/api/app/services/insights_service.py
git add apps/api/app/services/provider_service.py
git commit -m "backend: audit logging, evaluation, and insights"

# Commit 13: API Routes and FastAPI App
git add apps/api/app/main.py
git add apps/api/app/api/v1/routes/health.py
git add apps/api/app/api/v1/routes/pull_requests.py
git add apps/api/app/api/v1/routes/releases.py
git add apps/api/app/api/v1/routes/services.py
git add apps/api/app/api/v1/routes/policies.py
git add apps/api/app/api/v1/routes/misc.py
git add apps/api/app/api/v1/__init__.py
git commit -m "api: routes and fastapi application"

# Commit 14: Data Seeding and Requirements
git add apps/api/app/workers/seed.py
git add apps/api/requirements.txt
git add apps/api/Dockerfile
git commit -m "backend: data seeding worker and requirements"
```

### Phase 3: Frontend

```bash
# Commit 15: Frontend Bootstrap
git add apps/web/package.json
git add apps/web/tsconfig.json
git add apps/web/tailwind.config.ts
git add apps/web/next.config.mjs
git add apps/web/app/globals.css
git commit -m "frontend: bootstrap with tailwind and next.js config"

# Commit 16: Layout and Providers
git add apps/web/app/layout.tsx
git add apps/web/app/providers.tsx
git commit -m "frontend: root layout and provider setup"

# Commit 17: API Client and Types
git add apps/web/lib/api/client.ts
git add apps/web/types/domain.ts
git commit -m "frontend: api client and type definitions"

# Commit 18: Navigation
git add apps/web/components/navigation/sidebar.tsx
git commit -m "frontend: navigation sidebar component"

# Commit 19: Dashboard and PR Workspace
git add apps/web/app/page.tsx
git add apps/web/app/pr-workspace/page.tsx
git commit -m "frontend: dashboard and pr workspace pages"

# Commit 20: Reviewer Recommendations
git add apps/web/app/reviewer-recommendations/page.tsx
git commit -m "frontend: reviewer recommendations page"

# Commit 21: Release and Approval Pages
git add apps/web/app/release-center/page.tsx
git add apps/web/app/approvals-queue/page.tsx
git commit -m "frontend: release and approval workflow pages"

# Commit 22: Operational Pages
git add apps/web/app/impact-explorer/page.tsx
git add apps/web/app/test-intelligence/page.tsx
git add apps/web/app/ci-health/page.tsx
git commit -m "frontend: operational intelligence pages"

# Commit 23: Governance Pages
git add apps/web/app/policy-center/page.tsx
git add apps/web/app/audit-log/page.tsx
git add apps/web/app/engineering-insights/page.tsx
git commit -m "frontend: governance and audit visibility pages"

# Commit 24: Status and Settings Pages
git add apps/web/app/status-center/page.tsx
git add apps/web/app/settings/page.tsx
git commit -m "frontend: status and settings pages"

# Commit 25: UI Components
git add apps/web/components/charts/risk-distribution.tsx
git add apps/web/components/review/pr-card.tsx
git add apps/web/components/approvals/release-approval-panel.tsx
git add apps/web/components/approvals/release-override-panel.tsx
git add apps/web/Dockerfile
git commit -m "frontend: ui components and interactive panels"
```

### Phase 4: Data & Operations

```bash
# Commit 26: Seeded Datasets
git add datasets/pull_requests/pull_requests.json
git add datasets/releases/releases.json
git add datasets/ci_runs/ci_runs.json
git add datasets/test_runs/test_runs.json
git add datasets/ownership/owners.json
git add datasets/ownership/services.json
git add datasets/policies/policies.json
git commit -m "data: seeded datasets for pr/release/policy scenarios"

# Commit 27: Evaluation and Examples
git add datasets/evals/benchmarks.json
git add datasets/examples/dependency_graph.json
git commit -m "data: evaluation benchmarks and dependency graph"

# Commit 28: Docker Infrastructure
git add docker-compose.yml
git add infra/docker/
git add infra/postgres/
git add infra/redis/
git add infra/neo4j/
git add infra/opensearch/
git commit -m "infra: docker compose, postgres, redis, neo4j, opensearch"

# Commit 29: Automation Scripts
git add scripts/quick-setup.sh
git add scripts/bootstrap/bootstrap.sh
git add scripts/dev/run-local.sh
git add scripts/seed/seed.sh
git add scripts/evals/run-evals.sh
git add scripts/quality/check.sh
git commit -m "scripts: automation for local development and testing"

# Commit 30: Governance Docs
git add docs/governance/policy-baseline.md
git add docs/decisions/0001-local-first-deterministic-provider.md
git commit -m "docs: governance policies and design decisions"

# Commit 31: API and Operational Docs
git add docs/api/endpoints.md
git add docs/runbooks/local-operations.md
git commit -m "docs: api reference and operational runbooks"

# Commit 32: Setup and Deployment Guides
git add SETUP_AND_PRODUCTION.md
git add PRODUCTION_DEPLOYMENT.md
git commit -m "docs: comprehensive setup and deployment guides"

# Commit 33: Validation and Roadmap
git add VALIDATION_CHECKLIST.md
git add GAPS_AND_ROADMAP.md
git commit -m "docs: validation checklist and gaps roadmap"
```

---

## Dependency Chain

```
Commit 1 (Bootstrap)
    ↓
Commit 2 (Config)
    ↓
Commit 3 (Docs) + Commit 4 (Backend setup)
    ↓
Commits 5-6 (Models, DB)
    ↓
Commits 7-12 (Services - linear order respects orchestration deps)
    ↓
Commit 13 (API Routes)
    ↓
Commit 14 (Seeding + Requirements)
    ├─→ Commits 15-25 (Frontend builds on API being complete)
    ├─→ Commits 26-27 (Data independently supports backend)
    └─→ Commits 28-33 (Infra and docs)
```

---

## Split Risks & Mitigations

### Risk 1: Circular Imports Between Services
**Problem:** `analysis_service.py` imports from all other services; `release_service.py` uses audit logging.

**Mitigation:** 
- Keep service imports in `__init__.py` minimal
- Use late imports within functions where needed
- Order services by dependency depth: data → health → individual engines → orchestration

**Verdict:** ✅ **Safe to split as planned**

---

### Risk 2: Frontend Pages Depend on All API Endpoints Being Ready
**Problem:** Pages in commits 19-24 all call `/api/v1/*` endpoints.

**Mitigation:**
- Commit 13 (API routes) is gating commit
- All pages assume API routes exist (they do)
- No pages reference uncommitted endpoints

**Verdict:** ✅ **Safe to split as planned**

---

### Risk 3: Components (Commit 25) Used in Pages (Commits 19-24)
**Problem:** Components like `ReleaseApprovalPanel` are imported by `release-center/page.tsx` before they're committed.

**Mitigation:**
- Components are only used in Commit 21 (release-center)
- Move Commit 25 to right after Commit 21:
  ```bash
  # Better order:
  Commit 20: Reviewer recommendations
  Commit 21: Release pages (with components)
  Commit 25: UI components (extracted separately) ← move here
  Commit 22: Operational pages
  ```

**Verdict:** ⚠️ **Reorder Commits 21 & 25**

---

### Risk 4: Seeded Data (Commit 26) Depends on Service Structure
**Problem:** `seed.py` (Commit 14) loads from `datasets/` (Commit 26), but datasets haven't been committed yet.

**Mitigation:**
- `seed.py` uses environment-based path fallback in `data_store.py`
- Script can run before datasets are committed (looks at filesystem)
- Order is logical: seed worker first, data second

**Verdict:** ✅ **Safe - seed.py already handles missing datasets**

---

### Risk 5: Docker Compose (Commit 28) References Service Images
**Problem:** Docker Compose expects `apps/api/Dockerfile` and `apps/web/Dockerfile`.

**Mitigation:**
- Both Dockerfiles committed in Commits 14 & 25
- Docker Compose can exist before this (will just error on build)
- Move Docker Compose to right after Dockerfiles are complete

**Revised:** Move Commit 28 to after Commit 25

---

## Recommended Commit Order (Final)

```
Phase 1: Foundation (Commits 1-4)
  1. bootstrap: repository foundation...
  2. chore: project structure and core configuration
  3. docs: architecture and getting started guides
  4. backend: core configuration and logging

Phase 2: Backend Core (Commits 5-7)
  5. backend: domain models and pydantic schemas
  6. backend: database schema and alembic migrations
  7. backend: core services - data loading and health checks

Phase 3: Backend Services (Commits 8-12)
  8. backend: analysis orchestration service
  9. backend: risk scoring engine
  10. backend: policy evaluation and graph traversal
  11. backend: pr metadata and release services
  12. backend: audit logging, evaluation, and insights

Phase 4: API Layer (Commits 13-14)
  13. api: routes and fastapi application
  14. backend: data seeding worker and requirements

Phase 5: Frontend Bootstrap (Commits 15-18)
  15. frontend: bootstrap with tailwind and next.js config
  16. frontend: root layout and provider setup
  17. frontend: api client and type definitions
  18. frontend: navigation sidebar component

Phase 6: Frontend Pages & Components (Commits 19-25)
  19. frontend: dashboard and pr workspace pages
  20. frontend: reviewer recommendations page
  21. frontend: release and approval workflow pages
  22. frontend: ui components and interactive panels  ← MOVED here (was 25)
  23. frontend: operational intelligence pages
  24. frontend: governance and audit visibility pages
  25. frontend: status and settings pages

Phase 7: Data (Commits 26-27)
  26. data: seeded datasets for pr/release/policy scenarios
  27. data: evaluation benchmarks and dependency graph

Phase 8: Infrastructure & Operations (Commits 28-33)
  28. infra: docker compose and local development orchestration
  29. scripts: automation for local development and testing
  30. docs: governance policies and design decisions
  31. docs: api reference and operational runbooks
  32. docs: comprehensive setup and deployment guides
  33. docs: validation checklist and gaps roadmap
```

---

## Updated Exact Commands (Final Order)

### Phase 1
```bash
# 1-4: Same as above (foundation commits unchanged)
```

### Phase 2 & 3 (Backend - unchanged)
```bash
# 5-14: Same as above (all backend commits)
```

### Phase 5 & 6 (Frontend - reordered)
```bash
# 15-20: Same as above
# Commit 21: Moved to become Commit 22
# Commit 22-24: Shift down

# After Commit 21:
git add apps/web/components/charts/risk-distribution.tsx
git add apps/web/components/review/pr-card.tsx
git add apps/web/components/approvals/release-approval-panel.tsx
git add apps/web/components/approvals/release-override-panel.tsx
git add apps/web/Dockerfile
git commit -m "frontend: ui components and interactive panels"

# Then:
git add apps/web/app/impact-explorer/page.tsx
git add apps/web/app/test-intelligence/page.tsx
git add apps/web/app/ci-health/page.tsx
git commit -m "frontend: operational intelligence pages"

# Then:
git add apps/web/app/policy-center/page.tsx
git add apps/web/app/audit-log/page.tsx
git add apps/web/app/engineering-insights/page.tsx
git commit -m "frontend: governance and audit visibility pages"

# Then:
git add apps/web/app/status-center/page.tsx
git add apps/web/app/settings/page.tsx
git commit -m "frontend: status and settings pages"
```

### Phase 7 & 8 (Data & Ops - unchanged)
```bash
# 26-33: Same as above
```

---

## Quality Checklist Per Commit

Use this checklist before committing each batch:

- [ ] **All files in commit are logically related**
- [ ] **No mixed concerns** (e.g., don't mix backend + docs)
- [ ] **Commit message is active voice** (e.g., "add", "implement", not "adding")
- [ ] **Files build/compile correctly** after commit:
  ```bash
  # For Python
  python3 -m compileall apps/api/app/
  
  # For TypeScript
  cd apps/web && npm run build --dry-run
  ```
- [ ] **No accidental .env or __pycache__ files** (check `.gitignore`)
- [ ] **Commit message matches changes exactly**

---

## Post-Commit Validation

After all 33 commits are pushed, run:

```bash
# Verify clean history
git log --oneline | head -33

# Check each commit builds correctly
for commit in $(git log --oneline | head -33 | awk '{print $1}'); do
  echo "Checking $commit..."
  git checkout $commit
  python3 -m compileall apps/api/app/ 2>/dev/null && echo "✓ API OK"
done

git checkout main
```

---

## Deployment Order Summary

**For GitHub Release Notes, use this order:**

1. **Foundation** (Bootstrap, config, initial docs)
2. **Backend Services** (Database, services, API layer)
3. **Frontend** (UI, pages, components)
4. **Data & Infrastructure** (Seeded data, Docker, scripts)
5. **Documentation** (Guides, decisions, validation)

**This creates a narrative:** We built the backend logic first (scalable foundation), then the UI on top, then supporting infrastructure and documentation.

---

## Integration with GitHub

**Recommended GitHub setup:**
1. Create repository at `https://github.com/PSR94/VANGUARD`
2. Initialize locally: `git init`
3. Follow commits 1-33 in order
4. Push: `git remote add origin https://github.com/PSR94/VANGUARD.git`
5. `git push -u origin main`

**Optional: Create GitHub release notes grouped by phase (above)**

---

## Files by Commit (Quick Reference)

```
Commit 1:  LICENSE, README.md, .gitignore
Commit 2:  .env.example, Makefile, pyproject.toml, packages/, tsconfig.json
Commit 3:  docs/architecture/, INDEX.md, GETTING_STARTED.md
Commit 4:  apps/api/app/config/, app/core/
Commit 5:  app/schemas/domain.py, app/db/models.py
Commit 6:  alembic/env.py, alembic/versions/
Commit 7:  services/data_store.py, health_service.py
Commit 8:  services/analysis_service.py
Commit 9:  services/risk_service.py
Commit 10: services/policy_service.py, graph_service.py
Commit 11: services/pr_service.py, release_service.py
Commit 12: services/audit_service.py, eval_service.py, insights_service.py, provider_service.py
Commit 13: app/main.py, api/v1/routes/
Commit 14: app/workers/seed.py, requirements.txt, Dockerfile (api)
Commit 15: web package.json, tsconfig, tailwind.config, next.config, globals.css
Commit 16: web app/layout.tsx, providers.tsx
Commit 17: web lib/api/client.ts, types/domain.ts
Commit 18: web components/navigation/sidebar.tsx
Commit 19: web app/page.tsx, pr-workspace/
Commit 20: web app/reviewer-recommendations/
Commit 21: web app/release-center/, approvals-queue/
Commit 22: web components/charts/, components/review/, components/approvals/, Dockerfile (web)
Commit 23: web app/impact-explorer/, test-intelligence/, ci-health/
Commit 24: web app/policy-center/, audit-log/, engineering-insights/
Commit 25: web app/status-center/, settings/
Commit 26: datasets/pull_requests/, releases/, ci_runs/, test_runs/, ownership/, policies/
Commit 27: datasets/evals/, examples/
Commit 28: docker-compose.yml, infra/docker/, infra/postgres/, infra/redis/, etc.
Commit 29: scripts/ (all automation)
Commit 30: docs/governance/, docs/decisions/
Commit 31: docs/api/, docs/runbooks/
Commit 32: SETUP_AND_PRODUCTION.md, PRODUCTION_DEPLOYMENT.md
Commit 33: VALIDATION_CHECKLIST.md, GAPS_AND_ROADMAP.md
```

---

## Summary

**33 commits organized as:**
- ✅ 4 foundation commits
- ✅ 10 backend service commits (respecting dependency order)
- ✅ 11 frontend commits (pages grouped logically)
- ✅ 8 data, infrastructure, and documentation commits

**Each commit:**
- Is atomic and self-contained
- Builds on prior commits
- Can be reviewed independently
- Maintains clean, professional history
- Follows senior engineering conventions

**Before pushing to GitHub:**
1. Initialize repo: `git init`
2. Execute commits 1-33 in order
3. Run validation: `git log --oneline | wc -l` (should be 33)
4. Push: `git push -u origin main`
