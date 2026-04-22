#!/bin/bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

BLUE='\033[0;34m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}════════════════════════════════════════════${NC}"
echo -e "${BLUE}VANGUARD Git Commit Plan Executor${NC}"
echo -e "${BLUE}════════════════════════════════════════════${NC}"
echo ""

if [ ! -d .git ]; then
    echo -e "${YELLOW}[!] Git repository not initialized${NC}"
    echo "Initializing git in $ROOT_DIR..."
    if git init -b main >/dev/null 2>&1; then
        :
    else
        git init >/dev/null
        git branch -M main >/dev/null 2>&1 || true
    fi
fi

git branch -M main >/dev/null 2>&1 || true

if git rev-parse --verify HEAD >/dev/null 2>&1; then
    echo -e "${RED}[x] Existing commit history detected.${NC}"
    echo "This script is designed for a fresh repository so the history lands at exactly 33 commits."
    echo "Create a new clone or remove the existing .git directory before running it again."
    exit 1
fi

commit_batch() {
    local number="$1"
    local message="$2"
    shift 2
    local files=("$@")

    echo -e "${BLUE}[Commit ${number}]${NC} ${message}"
    git add -- "${files[@]}"

    if git diff --cached --quiet; then
        echo -e "${RED}  x Nothing staged for commit ${number}${NC}"
        exit 1
    fi

    git commit -m "$message" >/dev/null
    echo -e "${GREEN}  ✓ Committed${NC}"
    echo ""
}

echo -e "${YELLOW}═══ Phase 1: Foundation ═══${NC}"
echo ""

commit_batch 1 "bootstrap: repository foundation with license and readme" \
    LICENSE README.md .gitignore

commit_batch 2 "chore: environment examples and build entrypoints" \
    .env.example Makefile

commit_batch 3 "docs: project index and start-here navigation" \
    INDEX.md START_HERE.md

commit_batch 4 "docs: github publishing walkthrough and release notes" \
    README_GITHUB_SETUP.md GITHUB_PUSH_GUIDE.md QUICK_GITHUB_SUMMARY.md \
    INDEX_GITHUB_PUSH.md GITHUB_COMMIT_HISTORY_PREVIEW.md GIT_COMMIT_PLAN.md \
    DELIVERY_COMPLETE.md

commit_batch 5 "docs: onboarding and deployment overview" \
    GETTING_STARTED.md SETUP_AND_PRODUCTION.md PRODUCTION_DEPLOYMENT.md

commit_batch 6 "docs: readiness validation and roadmap" \
    VALIDATION_CHECKLIST.md READINESS_CHECKLIST.md GAPS_AND_ROADMAP.md

commit_batch 7 "docs: architecture overview and system diagrams" \
    docs/architecture/system-overview.md docs/diagrams/overview.mmd docs/assets/banner.svg

commit_batch 8 "docs: dashboard and workflow preview assets" \
    docs/assets/ui-preview-dashboard.svg docs/assets/ui-preview-pr-workspace.svg \
    docs/assets/ui-preview-release-center.svg docs/assets/ui-preview-policy-center.svg

commit_batch 9 "docs: governance decisions api reference and runbooks" \
    docs/governance/policy-baseline.md docs/decisions/0001-local-first-deterministic-provider.md \
    docs/api/endpoints.md docs/runbooks/local-operations.md

commit_batch 10 "packages: workspace documentation for config graph and markdown" \
    packages/config/README.md packages/graph/README.md packages/markdown/README.md

commit_batch 11 "packages: workspace documentation for product domains" \
    packages/policy-rules/README.md packages/prompts/README.md packages/risk/README.md \
    packages/shared-types/README.md packages/ui/README.md

echo -e "${YELLOW}═══ Phase 2: Backend ═══${NC}"
echo ""

commit_batch 12 "backend: api service bootstrap and module scaffolding" \
    apps/api/pyproject.toml apps/api/Dockerfile apps/api/alembic.ini \
    apps/api/app/__init__.py apps/api/app/api/__init__.py \
    apps/api/app/config/__init__.py apps/api/app/core/__init__.py

commit_batch 13 "backend: runtime settings logging and error handling" \
    apps/api/app/config/settings.py apps/api/app/core/logging.py apps/api/app/core/errors.py

commit_batch 14 "backend: domain schemas and persistence models" \
    apps/api/app/schemas/domain.py apps/api/app/db/models.py

commit_batch 15 "backend: alembic environment and initial migration" \
    apps/api/alembic/env.py apps/api/alembic/script.py.mako \
    apps/api/alembic/versions/20260421_0001_init.py

commit_batch 16 "backend: data loading health checks and service exports" \
    apps/api/app/services/data_store.py apps/api/app/services/health_service.py \
    apps/api/app/services/__init__.py

commit_batch 17 "backend: analysis orchestration and risk scoring services" \
    apps/api/app/services/analysis_service.py apps/api/app/services/risk_service.py

commit_batch 18 "backend: policy graph traversal and release services" \
    apps/api/app/services/policy_service.py apps/api/app/services/graph_service.py \
    apps/api/app/services/release_service.py

commit_batch 19 "backend: pr audit evaluation insights and provider services" \
    apps/api/app/services/pr_service.py apps/api/app/services/audit_service.py \
    apps/api/app/services/eval_service.py apps/api/app/services/insights_service.py \
    apps/api/app/services/provider_service.py

commit_batch 20 "api: fastapi app skeleton and utility routes" \
    apps/api/app/main.py apps/api/app/api/v1/__init__.py \
    apps/api/app/api/v1/routes/__init__.py apps/api/app/api/v1/routes/health.py \
    apps/api/app/api/v1/routes/misc.py

commit_batch 21 "api: pull request release service and policy routes" \
    apps/api/app/api/v1/routes/pull_requests.py apps/api/app/api/v1/routes/releases.py \
    apps/api/app/api/v1/routes/services.py apps/api/app/api/v1/routes/policies.py

commit_batch 22 "backend: seed worker and smoke coverage" \
    apps/api/app/workers/seed.py apps/api/tests/smoke/test_health.py

echo -e "${YELLOW}═══ Phase 3: Frontend ═══${NC}"
echo ""

commit_batch 23 "frontend: next.js bootstrap and build configuration" \
    apps/web/package.json apps/web/tsconfig.json apps/web/next-env.d.ts \
    apps/web/next.config.mjs apps/web/postcss.config.js apps/web/tailwind.config.ts \
    apps/web/Dockerfile

commit_batch 24 "frontend: global styles layout and provider wiring" \
    apps/web/app/globals.css apps/web/app/layout.tsx apps/web/app/providers.tsx

commit_batch 25 "frontend: typed api client and shared domain types" \
    apps/web/lib/api/client.ts apps/web/types/domain.ts

commit_batch 26 "frontend: dashboard shell navigation and pr workspace" \
    apps/web/components/navigation/sidebar.tsx apps/web/app/page.tsx \
    apps/web/app/pr-workspace/page.tsx

commit_batch 27 "frontend: reviewer recommendations and review cards" \
    apps/web/app/reviewer-recommendations/page.tsx apps/web/components/review/pr-card.tsx

commit_batch 28 "frontend: release center approvals and override panels" \
    apps/web/app/release-center/page.tsx apps/web/app/approvals-queue/page.tsx \
    apps/web/components/approvals/release-approval-panel.tsx \
    apps/web/components/approvals/release-override-panel.tsx

commit_batch 29 "frontend: operational intelligence dashboards" \
    apps/web/app/impact-explorer/page.tsx apps/web/app/test-intelligence/page.tsx \
    apps/web/app/ci-health/page.tsx apps/web/components/charts/risk-distribution.tsx

commit_batch 30 "frontend: governance audit and settings visibility pages" \
    apps/web/app/policy-center/page.tsx apps/web/app/audit-log/page.tsx \
    apps/web/app/engineering-insights/page.tsx apps/web/app/status-center/page.tsx \
    apps/web/app/settings/page.tsx

echo -e "${YELLOW}═══ Phase 4: Data And Operations ═══${NC}"
echo ""

commit_batch 31 "data: seeded product ownership policy and release scenarios" \
    datasets/pull_requests/pull_requests.json datasets/releases/releases.json \
    datasets/ci_runs/ci_runs.json datasets/test_runs/test_runs.json \
    datasets/ownership/owners.json datasets/ownership/services.json \
    datasets/policies/policies.json datasets/repositories/repositories.json

commit_batch 32 "data: evaluation benchmarks scenario docs and dependency graph" \
    datasets/evals/benchmarks.json datasets/examples/scenarios.md \
    datasets/examples/dependency_graph.json

commit_batch 33 "ops: local orchestration infrastructure ci and automation scripts" \
    docker-compose.yml infra/docker/README.md infra/postgres/README.md infra/redis/README.md \
    infra/neo4j/README.md infra/opensearch/README.md infra/github/workflows/ci.yml \
    infra/terraform/local-reference/main.tf scripts/bootstrap/bootstrap.sh \
    scripts/dev/run-local.sh scripts/evals/run-evals.sh scripts/git-commit-plan.sh \
    scripts/quality/check.sh scripts/quick-setup.sh scripts/seed/seed.sh

if [ -n "$(git status --short --untracked-files=all)" ]; then
    echo -e "${RED}[x] Working tree is not clean after commit plan execution.${NC}"
    git status --short --untracked-files=all
    exit 1
fi

COMMIT_COUNT="$(git rev-list --count HEAD)"

echo -e "${BLUE}════════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ Commit plan execution complete${NC}"
echo -e "${BLUE}════════════════════════════════════════════${NC}"
echo ""
echo -e "${GREEN}Total commits created: ${COMMIT_COUNT}${NC}"
echo ""
echo -e "${YELLOW}Recent commits:${NC}"
git log --oneline -10
echo ""
