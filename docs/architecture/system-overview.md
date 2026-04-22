# VANGUARD System Overview

VANGUARD is a local-first engineering intelligence platform with:
- FastAPI backend for PR, release, policy, and risk APIs
- Next.js frontend for operator workflows
- PostgreSQL, Redis, Neo4j, OpenSearch for operational metadata and graph traversal
- Seeded datasets for deterministic local behavior
- Eval harness to validate recommendation and risk quality

```mermaid
%%{init: {'theme': 'base', 'themeVariables': {
  'fontFamily': 'Trebuchet MS, Verdana, sans-serif',
  'primaryColor': '#dbeafe',
  'primaryBorderColor': '#145DA0',
  'primaryTextColor': '#0C2D48',
  'lineColor': '#145DA0',
  'secondaryColor': '#dcfce7',
  'tertiaryColor': '#fff7ed'
}}}%%
flowchart LR
  UI[Next.js Web App] --> API[FastAPI API Layer]
  API --> DS[Seeded Dataset Loader]
  API --> RISK[Risk Engine]
  API --> POLICY[Policy Engine]
  API --> GRAPH[Impact Graph Service]
  API --> EVAL[Evaluation Service]
  API --> AUDIT[Audit Service]
  API --> PG[(PostgreSQL)]
  API --> REDIS[(Redis)]
  API --> NEO4J[(Neo4j)]
  API --> OS[(OpenSearch)]
  GRAPH --> NEO4J
  EVAL --> AUDIT

  classDef entry fill:#dbeafe,stroke:#145DA0,color:#0C2D48,stroke-width:2px;
  classDef core fill:#dcfce7,stroke:#1f8a70,color:#14532d,stroke-width:2px;
  classDef service fill:#fff7ed,stroke:#ea580c,color:#9a3412,stroke-width:2px;
  classDef storage fill:#ede9fe,stroke:#7c3aed,color:#4c1d95,stroke-width:2px;

  class UI entry;
  class API core;
  class DS,RISK,POLICY,GRAPH,EVAL,AUDIT service;
  class PG,REDIS,NEO4J,OS storage;
```
