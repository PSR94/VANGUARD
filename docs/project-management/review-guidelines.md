# Review Guidance

VANGUARD is solo-maintained today, but the code should still be shaped for review. The point is not ceremony. The point is reducing ambiguity around behavior and risk.

## What every PR should answer

- What changed?
- Why was the change needed?
- How was it verified?
- What is risky about it?
- What is the rollback if it misbehaves?

If a PR cannot answer those quickly, it is not ready.

## Changes that need deeper review

These deserve extra care in the PR description and the review pass:

- risk scoring logic
- policy evaluation rules
- release approval and override flows
- seeded datasets that change expected product behavior
- API contracts or route payload shapes
- CI or local setup workflow changes
- audit and observability behavior

For these, include concrete evidence: curl output, route examples, screenshots, or test results.

## Evidence by change type

For frontend changes:

- before or after screenshots when behavior moved
- route names touched
- note whether screenshots in the README were refreshed

For backend changes:

- commands run
- example request and response when contracts changed
- note on dataset or configuration impact

For maintenance changes:

- explain the operational payoff
- show that the new workflow is actually wired, not just documented

## Risk framing

Use plain language. Good risk notes sound like this:

- “Touches release approval handling; failure would block approvals or record the wrong actor.”
- “Changes seeded benchmark data; screenshots and demo flows may shift.”
- “Moves CI from an infra reference path into active GitHub workflow execution.”

Avoid vague phrases like “minor cleanup” when the behavior surface is not minor.

## Review categories

- Low risk: docs, copy, narrow refactors, screenshot refreshes
- Medium risk: page state flow, route wiring, seeded data changes
- High risk: policy logic, release readiness logic, approval flow, API contract changes, CI path changes

If a change is high risk, say so in the PR instead of hoping the diff speaks for itself.
