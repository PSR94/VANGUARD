# Label Taxonomy

Keep the label set small enough that it gets used consistently.

## Core labels

| Label | Use it for |
|---|---|
| `bug` | Broken behavior, regressions, or incorrect output |
| `enhancement` | New product or engineering capability |
| `tech-debt` | Cleanup or structural improvement with clear maintenance payoff |
| `backend` | API, services, data handling, route behavior |
| `frontend` | Next.js pages, components, UI state, screenshots |
| `infra` | CI, local setup, workflows, environment wiring |
| `docs` | Documentation, onboarding, screenshots, contributor guidance |
| `evaluation` | Eval harness, benchmark quality, regression measurement |
| `observability` | Audit, logging, health, diagnostics, operational visibility |
| `security` | Auth, approval gates, policy enforcement, sensitive config |
| `good first issue` | A contained issue with low domain risk and a clear path to done |
| `blocked` | Waiting on another change, missing context, or an external dependency |

## Usage notes

- Prefer one type label: `bug`, `enhancement`, or `tech-debt`.
- Add one or two surface labels at most. Example: `bug` + `frontend`, or `enhancement` + `evaluation`.
- Use `blocked` sparingly and remove it as soon as the issue is actionable again.
- `good first issue` should only be applied if the acceptance criteria are already concrete.

## Example combinations

- `bug`, `frontend`
- `enhancement`, `backend`, `security`
- `tech-debt`, `infra`
- `enhancement`, `evaluation`, `observability`
- `docs`, `frontend`
