# Release Checklist

Use this before pushing a visible repo update, cutting a tag, or merging a materially risky branch.

## Repo state

- `main` is clean and up to date
- the PR or branch scope is clear from the commit history
- issue references are present where they help future context

## Verification

- API tests pass
- web build passes
- any changed routes or workflows were exercised manually
- risky contract changes have request or response evidence

## Docs and screenshots

- setup docs still match the current commands
- README screenshots are refreshed if UI behavior changed
- maintenance docs were updated if workflow or expectations changed

## Risky surfaces

Double-check these when touched:

- policy rules
- risk scoring
- release readiness
- approvals and overrides
- seeded datasets that change demos or screenshots
- CI and local setup flow

## Final pass

- PR description explains behavior and risk
- rollback is obvious
- follow-up work is captured as an issue instead of hidden in comments

This checklist is intentionally short. If a release needs a longer one, the branch is probably carrying too many concerns.
