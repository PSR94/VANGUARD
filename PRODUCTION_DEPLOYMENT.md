# VANGUARD: Production Deployment Guide

## Pre-Deployment Checklist

### Infrastructure & Secrets
- [ ] Database (PostgreSQL 14+) configured with automated backups
- [ ] Redis cluster setup with persistence
- [ ] Neo4j configured for production (memory, indexes)
- [ ] Environment secrets in secure store (not .env files)
- [ ] SSL/TLS certificates obtained
- [ ] Load balancer/reverse proxy configured (Nginx/Traefik)

### Application Configuration
- [ ] Update `POSTGRES_URL` to production database
- [ ] Update `REDIS_URL` to production Redis
- [ ] Update `NEO4J_URI` to production Neo4j
- [ ] Configure `VANGUARD_ENV=production` in settings
- [ ] Disable debug/verbose logging in production
- [ ] Set appropriate `API_RATE_LIMIT`
- [ ] Configure CORS for production domain

### Security
- [ ] Authentication layer implemented (OAuth2/OIDC)
- [ ] API keys/tokens for CI/CD integration
- [ ] Role-based access control (RBAC) configured
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention verified
- [ ] HTTPS enforced
- [ ] HSTS headers configured
- [ ] CSRF protection enabled

### Observability
- [ ] Logging aggregation setup (ELK/DataDog/Splunk)
- [ ] Metrics collection (Prometheus/Datadog)
- [ ] Distributed tracing (Jaeger/DataDog)
- [ ] Alerting configured for:
  - [ ] API error rates > 1%
  - [ ] Response latency p99 > 2s
  - [ ] Database connection pool exhaustion
  - [ ] Redis memory usage > 80%
  - [ ] Neo4j query timeouts

### Database & Data
- [ ] Migration tested on production schema
- [ ] Backup strategy documented and tested
- [ ] Point-in-time recovery tested
- [ ] Data seeding strategy determined (initial load vs. live)
- [ ] Indexes created for common queries
- [ ] Connection pooling configured (PgBouncer)

### Testing
- [ ] Load testing (1000+ concurrent users)
- [ ] Failover testing (graceful degradation)
- [ ] Database failover tested
- [ ] Backup restoration tested
- [ ] Health check endpoints verified
- [ ] Dependency health checks verified

### Deployment
- [ ] Docker images built and pushed to registry
- [ ] Kubernetes manifests created (if using k8s)
- [ ] Docker Compose for swarm (if using swarm)
- [ ] Rollout strategy defined (blue-green/canary)
- [ ] Rollback procedure documented
- [ ] Zero-downtime deployment tested

### Operations
- [ ] Runbooks created for common issues
- [ ] Incident response procedures documented
- [ ] On-call rotation established
- [ ] Escalation procedures defined
- [ ] Performance baselines recorded
- [ ] Capacity planning done

---

## Production Architecture

```
                          CDN
                           │
                    ┌──────┴──────┐
                    │   HTTPS     │
                    │  TLS 1.3    │
                    └──────┬──────┘
                           │
                    ┌──────▼──────────────┐
                    │  Load Balancer      │
                    │  (Nginx/Traefik)    │
                    │  - Rate Limiting    │
                    │  - CORS             │
                    │  - Request Logging  │
                    └──────┬──────────────┘
                           │
            ┌──────────────┼──────────────┐
            │              │              │
        ┌───▼───┐      ┌───▼───┐     ┌───▼───┐
        │ API 1 │      │ API 2 │     │ API 3 │
        │Replicas:3   │ or    │     │ or    │
        │  Fast       │ More  │     │ More  │
        │  API   │      │       │
        └───┬───┘      └───┬───┘     └───┬───┘
            │              │              │
        ┌───▼──────────────▼──────────────▼───┐
        │  Service Discovery / Service Mesh   │
        │  (Consul, Istio, or simple DNS)     │
        └───┬──────────────────────────────────┘
            │
    ┌───────┼───────┬──────────┬──────────┐
    │       │       │          │          │
┌───▼──┐ ┌─▼──┐ ┌──▼───┐ ┌───▼──┐ ┌────▼────┐
│ PG   │ │Rdis │ │Neo4j │ │OSRCH │ │ Logging │
│Managed│ │Clu │ │Clstr │ │ (opt)│ │ Agg    │
│ DB   │ │ster│ │      │ │      │ │ ELK/DD │
└──────┘ └────┘ └──────┘ └──────┘ └────────┘
    │       │       │          │          │
    └───────┼───────┼──────────┼──────────┘
            │
    ┌───────▼──────────────────┐
    │ Monitoring & Alerting    │
    │ - Prometheus             │
    │ - Grafana                │
    │ - PagerDuty              │
    └──────────────────────────┘
```

---

## Step-by-Step Deployment

### 1. Build & Push Docker Images

```bash
# From VANGUARD root
docker build -f Dockerfile.api -t myregistry.azurecr.io/vanguard-api:latest apps/api/
docker build -f Dockerfile.web -t myregistry.azurecr.io/vanguard-web:latest apps/web/

docker push myregistry.azurecr.io/vanguard-api:latest
docker push myregistry.azurecr.io/vanguard-web:latest
```

### 2. Deploy Infrastructure (if self-hosted)

```bash
# Database
docker-compose -f infra/docker-compose.prod.yml up -d postgres redis neo4j

# Initialize database
docker-compose exec postgres alembic upgrade head

# Seed initial data (if needed)
docker-compose exec api python -m app.workers.seed
```

### 3. Deploy API Service

```yaml
# k8s deployment (if using Kubernetes)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: vanguard-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: vanguard-api
  template:
    metadata:
      labels:
        app: vanguard-api
    spec:
      containers:
      - name: api
        image: myregistry.azurecr.io/vanguard-api:latest
        ports:
        - containerPort: 8080
        env:
        - name: POSTGRES_URL
          valueFrom:
            secretKeyRef:
              name: vanguard-secrets
              key: postgres-url
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: vanguard-secrets
              key: redis-url
        livenessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 8080
          initialDelaySeconds: 10
          periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: vanguard-api
spec:
  selector:
    app: vanguard-api
  ports:
  - port: 8080
    targetPort: 8080
  type: LoadBalancer
```

### 4. Deploy Web Service

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: vanguard-web
spec:
  replicas: 3
  selector:
    matchLabels:
      app: vanguard-web
  template:
    metadata:
      labels:
        app: vanguard-web
    spec:
      containers:
      - name: web
        image: myregistry.azurecr.io/vanguard-web:latest
        ports:
        - containerPort: 3000
        env:
        - name: NEXT_PUBLIC_API_URL
          value: "https://api.vanguard.example.com"
        livenessProbe:
          httpGet:
            path: /
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: vanguard-web
spec:
  selector:
    app: vanguard-web
  ports:
  - port: 3000
    targetPort: 3000
  type: LoadBalancer
```

### 5. Configure Ingress

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: vanguard-ingress
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/rate-limit: "100"
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - vanguard.example.com
    secretName: vanguard-tls
  rules:
  - host: vanguard.example.com
    http:
      paths:
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: vanguard-api
            port:
              number: 8080
      - path: /
        pathType: Prefix
        backend:
          service:
            name: vanguard-web
            port:
              number: 3000
```

### 6. Setup Monitoring

```yaml
# Prometheus scrape config
global:
  scrape_interval: 15s

scrape_configs:
- job_name: 'vanguard-api'
  static_configs:
  - targets: ['vanguard-api:8080']
  metrics_path: '/metrics'

- job_name: 'postgres'
  static_configs:
  - targets: ['postgres-exporter:9187']
```

---

## Database Optimization for Production

### Indexes

```sql
-- Pull request queries
CREATE INDEX idx_pr_risk_score ON pull_requests(risk_score);
CREATE INDEX idx_pr_author ON pull_requests(author);
CREATE INDEX idx_pr_repository ON pull_requests(repository);

-- Audit event queries
CREATE INDEX idx_audit_actor ON audit_events(actor);
CREATE INDEX idx_audit_action ON audit_events(action);
CREATE INDEX idx_audit_timestamp ON audit_events(timestamp DESC);
CREATE INDEX idx_audit_object ON audit_events(object_type, object_id);

-- Release approval queries
CREATE INDEX idx_approval_release ON release_approvals(release_id);
CREATE INDEX idx_approval_team ON release_approvals(team);
CREATE INDEX idx_approval_timestamp ON release_approvals(timestamp DESC);
```

### Connection Pooling (PgBouncer)

```ini
# pgbouncer.ini
[databases]
vanguard = host=postgres port=5432 dbname=vanguard

[pgbouncer]
pool_mode = transaction
max_client_conn = 1000
default_pool_size = 25
min_pool_size = 10
reserve_pool_size = 5
```

### Query Optimization

```python
# apps/api/app/services/analysis_service.py

# Use pagination for large result sets
prs = session.query(PullRequest)\
    .order_by(PullRequest.created_at.desc())\
    .offset(0)\
    .limit(50)\
    .all()

# Use connection pooling
from sqlalchemy.pool import QueuePool
engine = create_engine(
    DATABASE_URL,
    poolclass=QueuePool,
    pool_size=20,
    max_overflow=40,
    pool_pre_ping=True  # Test connections
)
```

---

## Monitoring & Alerting

### Key Metrics to Monitor

```
Application:
- api_request_duration_seconds (p50, p95, p99)
- api_request_count_total (by endpoint, status)
- api_errors_total (by error type)
- audit_events_written_total
- analysis_runs_total (success/failure)

Infrastructure:
- postgres_connections_used
- postgres_cache_hit_ratio
- redis_memory_usage_bytes
- redis_connected_clients
- neo4j_heap_usage

Business:
- prs_analyzed_per_day
- avg_risk_score
- policy_blocks_per_week
- release_approvals_per_week
- audit_events_per_day
```

### Alert Rules

```yaml
groups:
- name: vanguard
  rules:
  - alert: HighErrorRate
    expr: rate(api_errors_total[5m]) > 0.01
    annotations:
      summary: "API error rate > 1%"

  - alert: SlowAPI
    expr: api_request_duration_seconds{quantile="0.99"} > 2
    annotations:
      summary: "API p99 latency > 2s"

  - alert: DatabaseDown
    expr: postgres_connections_used == 0
    annotations:
      summary: "PostgreSQL may be down"

  - alert: LowDiskSpace
    expr: node_filesystem_avail_bytes{mountpoint="/"} < 10737418240
    annotations:
      summary: "Less than 10GB free disk space"
```

---

## Runbooks

### Issue: High API Latency

```
1. Check metrics dashboard for slow endpoints
2. Check database slow query log
3. Review recent code deployments
4. Scale up API replicas if CPU-bound
5. Check Redis connection pool
6. If persists, rollback last deployment
```

### Issue: Database Connection Exhaustion

```
1. Check connection pool settings in app config
2. Check for connection leaks in application code
3. Increase pool_size in PgBouncer
4. Restart API pods to reset connections
5. Scale down API replicas if over-provisioned
```

### Issue: Audit Log Growing Too Large

```
1. Archive old audit events to cold storage
2. Implement retention policy (e.g., 90 days)
3. Partition audit_events table by date
4. Add compression to cold storage
```

---

## Scaling Strategy

| Load Level | Action |
|---|---|
| < 100 req/s | Single API pod, managed DB sufficient |
| 100-500 req/s | 2-3 API replicas, PgBouncer, Redis cluster |
| 500-2000 req/s | 5-10 API replicas, dedicated DB cluster, Redis Sentinel |
| > 2000 req/s | Full microservices with separate analysis/policy engines, read replicas |

---

## Backup & Disaster Recovery

### Daily Backup Strategy

```bash
#!/bin/bash
# backup.sh

BACKUP_DIR="/backups/vanguard"
DATE=$(date +%Y%m%d_%H%M%S)

# PostgreSQL
pg_dump $POSTGRES_URL > "$BACKUP_DIR/vanguard_$DATE.sql"
gzip "$BACKUP_DIR/vanguard_$DATE.sql"

# Upload to S3/GCS
aws s3 cp "$BACKUP_DIR/vanguard_$DATE.sql.gz" s3://backups/vanguard/

# Retain last 30 days
find $BACKUP_DIR -name "vanguard_*.sql.gz" -mtime +30 -delete

# Test restore
pg_restore --dry-run "$BACKUP_DIR/vanguard_$DATE.sql.gz"
```

### Recovery Procedure

```bash
# 1. Create new empty database
createdb vanguard_restore

# 2. Restore from backup
pg_restore -d vanguard_restore vanguard_20260421.sql.gz

# 3. Verify data
psql -d vanguard_restore -c "SELECT COUNT(*) FROM pull_requests;"

# 4. Switch application connection string
# Update POSTGRES_URL environment variable
# Restart API pods

# 5. Verify system health
curl https://vanguard.example.com/api/v1/health
```

---

## Support & Escalation

- **On-Call**: Page on-call engineer for Severity 1 (service down)
- **Incident Channel**: #vanguard-incidents (Slack)
- **Status Page**: https://status.vanguard.example.com
- **Postmortem**: RCA within 24h for all Severity 1-2 incidents
