# Commit Guidance

VANGUARD does not need a formal commit framework. It does need a history that is readable, technically specific, and calm under review.

## Preferred shape

Use:

```text
<area>: <meaningful change>
```

Good areas for this repo:

- `backend`
- `frontend`
- `api`
- `infra`
- `data`
- `docs`
- `evals`
- `screenshots`
- `chore`

## What good looks like

Good examples for this repository:

- `frontend: stabilize PR workspace analysis flow`
- `backend: tighten release approval payload validation`
- `api: expose engineering insights endpoint`
- `infra: activate GitHub Actions CI workflow`
- `docs: add maintainer review and triage guidance`
- `screenshots: refresh README preview assets from live routes`
- `data: adjust seeded release blockers for approval coverage`

These work because they answer two questions immediately:

- what part of the repo changed
- what behavior or maintenance surface changed

## What to avoid

Do not commit with messages like:

- `fix stuff`
- `update code`
- `final`
- `final-final`
- `temp`
- `misc changes`

Those messages force the reader to reverse-engineer intent from the diff. That gets expensive fast.

## Practical rules

- Keep one concern per commit when possible.
- Split docs-only cleanup from behavior changes unless the docs are inseparable from the implementation.
- If a commit changes behavior, the message should say what behavior changed.
- If a commit is maintenance-only, say that directly rather than hiding it under `chore`.
- Reserve `chore` for narrow operational work, not major behavior changes.

## Commit sizing

Preferred:

- one commit for a targeted fix
- a few commits for a larger change with natural milestones

Avoid:

- one giant commit that mixes UI, API, datasets, docs, and CI
- ten tiny commits that only rename variables or move punctuation

The target is not perfect micro-history. The target is a history another engineer can scan and trust.
