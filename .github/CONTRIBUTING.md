# Contributing to VANGUARD

VANGUARD is currently maintained like a production-minded solo repository: small changes land quickly, but non-trivial changes should still be easy to review, easy to roll back, and easy to reason about from the history.

## Before opening a PR

- Start with an issue if the change is larger than a small fix, a docs edit, or a scoped refactor.
- Keep one concern per branch. A feature, a cleanup, and a docs rewrite should not share a PR unless they are inseparable.
- Check the existing maintenance docs before inventing new process:
  - [Commit guidance](../docs/project-management/commit-guidelines.md)
  - [Review guidance](../docs/project-management/review-guidelines.md)
  - [Labels and triage](../docs/project-management/labels.md)
  - [Release checklist](../docs/project-management/release-checklist.md)

## Local workflow

Common commands from the repo root:

```bash
make up
make api
make web
make test
```

For UI preview refreshes:

```bash
cd apps/web
npm run screenshots
```

That command expects the API on `http://localhost:8080` and the web app on `http://localhost:3000`.

## Branches

Use short, scoped branch names:

- `feat/release-center-approval-copy`
- `fix/pr-workspace-loading-loop`
- `chore/activate-github-ci`
- `docs/refresh-screenshot-workflow`

If a branch name starts broad, narrow it before opening the PR.

## Commits

Commit messages should make sense in a log without reading the diff.

Preferred shape:

```text
<area>: <meaningful change>
```

Examples:

- `frontend: capture live screenshots for README previews`
- `backend: tighten release readiness response handling`
- `docs: add project maintenance and review guidance`
- `infra: activate GitHub Actions CI workflow`

Avoid:

- `fix stuff`
- `update code`
- `final`
- `misc changes`

## Pull requests

- Use the PR template.
- Explain the change in terms of behavior, not just files touched.
- Call out risk explicitly when changing policy logic, risk scoring, release approvals, API contracts, or seeded datasets.
- Include verification evidence. For UI work, attach screenshots. For API or backend work, include commands or request examples.
- Update docs when the change alters workflow, setup, behavior, or screenshots.

## Review expectations

The default expectation is “reviewable by another engineer in one pass.”

That means:

- diffs stay focused
- acceptance criteria are clear
- rollback is obvious
- tests or verification evidence are present
- riskier changes describe failure modes and affected surfaces

If a change is intentionally partial, say so directly in the PR.
