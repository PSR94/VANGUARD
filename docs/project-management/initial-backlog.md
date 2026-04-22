# Initial Backlog

This is a focused starting backlog for the current repository. It is intentionally short and based on work that is already visible in the codebase, workflows, and docs.

## 1. Move remaining client pages off render-triggered loading

- Type: `tech-debt`
- Priority: `P1`
- Labels: `tech-debt`, `frontend`
- Problem: `release-center`, `approvals-queue`, `reviewer-recommendations`, and `audit-log` still kick off async work during render instead of using a stable load pattern.
- Expected outcome: the pages stop double-firing requests in development and become easier to test and review.
- Acceptance criteria:
  - each affected route uses one explicit loading pattern
  - manual navigation does not trigger repeated fetch loops
  - screenshot automation stays stable for those routes
- Dependency notes: none

## 2. Add targeted service tests around risk, policy, and release readiness

- Type: `enhancement`
- Priority: `P1`
- Labels: `enhancement`, `backend`, `evaluation`
- Problem: API coverage is thin for the core decision logic that gives the product its credibility.
- Expected outcome: regressions in scoring, policy evaluation, and readiness gating are caught before merge.
- Acceptance criteria:
  - tests cover representative seeded PRs and release candidates
  - policy evaluation expectations are asserted explicitly
  - release readiness blockers are exercised for both pass and block paths
- Dependency notes: none

## 3. Add web smoke coverage for key operator routes

- Type: `enhancement`
- Priority: `P2`
- Labels: `enhancement`, `frontend`, `infra`
- Problem: the repo now has screenshot automation, but no automated signal that the main operator pages render successfully.
- Expected outcome: core routes fail fast in CI when a route breaks, hydrates badly, or loses required data.
- Acceptance criteria:
  - smoke coverage exists for `/`, `/pr-workspace`, `/release-center`, and `/policy-center`
  - the checks run in CI
  - failures point at the broken route clearly
- Dependency notes: easier after issue 1

## 4. Normalize base URL and CORS handling for localhost and 127.0.0.1

- Type: `bug`
- Priority: `P2`
- Labels: `bug`, `backend`, `frontend`
- Problem: the web app behaves differently depending on whether it is served from `localhost` or `127.0.0.1`, which surfaced during screenshot automation.
- Expected outcome: local workflows remain stable regardless of the host name used for browser access.
- Acceptance criteria:
  - both `http://localhost:3000` and `http://127.0.0.1:3000` can reach the API in local development
  - the expected host behavior is documented
- Dependency notes: none

## 5. Replace raw edge lists in Impact Explorer with an actual graph view

- Type: `enhancement`
- Priority: `P2`
- Labels: `enhancement`, `frontend`
- Problem: Impact Explorer exposes the right data but not a useful operator view.
- Expected outcome: a reviewer can understand blast radius and relationship depth without reading raw edge rows.
- Acceptance criteria:
  - graph view communicates node type or depth clearly
  - relationship types are visible
  - seeded data still drives the experience deterministically
- Dependency notes: none

## 6. Add search and time-range filters to Audit Log

- Type: `enhancement`
- Priority: `P2`
- Labels: `enhancement`, `frontend`, `observability`
- Problem: the current audit page is readable for a handful of records but does not scale to realistic operator use.
- Expected outcome: audit review becomes practical when the dataset grows and when approvals or overrides need traceability.
- Acceptance criteria:
  - actor and action filters remain
  - text search is added
  - a time-range or date filter exists
- Dependency notes: none

## 7. Clean up placeholder or unused service directories

- Type: `tech-debt`
- Priority: `P2`
- Labels: `tech-debt`, `backend`
- Problem: the repo still has placeholder service directories that suggest implementation depth that is not actually present.
- Expected outcome: the tree reflects the real implementation rather than abandoned scaffolding.
- Acceptance criteria:
  - unused placeholder directories are removed or populated intentionally
  - docs or imports do not reference deleted paths
- Dependency notes: validate against `GAPS_AND_ROADMAP.md`

## 8. Add policy management workflow beyond read-only display

- Type: `enhancement`
- Priority: `P3`
- Labels: `enhancement`, `frontend`, `security`
- Problem: Policy Center explains the current rules but does not support a controlled edit or enable/disable flow.
- Expected outcome: policy changes can be exercised locally in a disciplined way instead of being hardcoded-only behavior.
- Acceptance criteria:
  - policies can be edited or toggled through an explicit UI or local management path
  - risky changes remain reviewable and auditable
- Dependency notes: should align with existing governance baseline docs

## 9. Persist approval and audit state outside the in-memory flow

- Type: `enhancement`
- Priority: `P3`
- Labels: `enhancement`, `backend`, `observability`
- Problem: approval and audit flows are credible for seeded demos but not durable across longer local sessions.
- Expected outcome: a maintainer can preserve approval and audit state without losing the deterministic local-first shape of the repo.
- Acceptance criteria:
  - approval state survives application restarts in the supported local path
  - audit records are queryable after restart
  - the repo documents what remains seeded and what is persisted
- Dependency notes: should stay compatible with the local-first mode

## 10. Expand engineering insights and eval reporting into one review surface

- Type: `enhancement`
- Priority: `P3`
- Labels: `enhancement`, `evaluation`, `observability`
- Problem: insights and evals exist, but the repo still splits quality signals across multiple sparse views.
- Expected outcome: maintainers can judge system quality and regression risk from one high-signal surface.
- Acceptance criteria:
  - eval run history and engineering insights are connected in one operator flow
  - repeated failures and drift are easier to spot
  - the PR template can point to a concrete evidence source for quality changes
- Dependency notes: none
