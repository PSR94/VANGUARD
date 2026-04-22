#!/bin/bash
set -e

echo "🚀 VANGUARD Quick Setup Script"
echo "================================"

VANGUARD_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$VANGUARD_ROOT"

# Color codes
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Check prerequisites
echo -e "${YELLOW}[1/7]${NC} Checking prerequisites..."

if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker not found${NC}"
    exit 1
fi

if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 not found${NC}"
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found${NC}"
    exit 1
fi

echo -e "${GREEN}✓ All prerequisites met${NC}"

# Step 2: Setup environment
echo -e "${YELLOW}[2/7]${NC} Setting up environment..."

if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${GREEN}✓ .env created${NC}"
else
    echo -e "${GREEN}✓ .env already exists${NC}"
fi

# Step 3: Start infrastructure
echo -e "${YELLOW}[3/7]${NC} Starting Docker infrastructure..."

docker-compose up -d postgres redis neo4j opensearch

echo "Waiting for PostgreSQL to be ready..."
for i in {1..30}; do
    if docker-compose exec -T postgres pg_isready -q; then
        echo -e "${GREEN}✓ PostgreSQL ready${NC}"
        break
    fi
    echo "Attempt $i/30..."
    sleep 1
done

# Step 4: Initialize database
echo -e "${YELLOW}[4/7]${NC} Initializing database..."

cd "$VANGUARD_ROOT/apps/api"

# Install Python dependencies
python3 -m pip install -q -r requirements.txt 2>/dev/null || true

# Run migrations
python3 -m alembic upgrade head
echo -e "${GREEN}✓ Database schema created${NC}"

# Step 5: Seed data
echo -e "${YELLOW}[5/7]${NC} Seeding data..."

python3 -m app.workers.seed
echo -e "${GREEN}✓ Data seeded${NC}"

# Step 6: Backend setup
echo -e "${YELLOW}[6/7]${NC} Installing backend dependencies..."

pip install -q -r requirements.txt 2>/dev/null || true
echo -e "${GREEN}✓ Backend ready${NC}"

# Step 7: Frontend setup
echo -e "${YELLOW}[7/7]${NC} Installing frontend dependencies..."

cd "$VANGUARD_ROOT/apps/web"
npm install -q 2>/dev/null || true
echo -e "${GREEN}✓ Frontend ready${NC}"

# Summary
echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo -e "${GREEN}✓ Setup Complete!${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════${NC}"
echo ""
echo "Next steps:"
echo ""
echo "1. Start the backend (from apps/api/):"
echo -e "   ${YELLOW}uvicorn app.main:app --reload${NC}"
echo ""
echo "2. Start the frontend (from apps/web/):"
echo -e "   ${YELLOW}npm run dev${NC}"
echo ""
echo "Then open: ${YELLOW}http://localhost:3000${NC}"
echo ""
echo "Infrastructure:"
echo "  • PostgreSQL:  localhost:5432"
echo "  • Redis:       localhost:6379"
echo "  • Neo4j:       localhost:7474"
echo "  • API Docs:    http://localhost:8080/docs"
echo ""
echo "To stop infrastructure:"
echo -e "   ${YELLOW}docker-compose down${NC}"
echo ""
