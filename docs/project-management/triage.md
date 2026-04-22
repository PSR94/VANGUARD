# Triage Guide

The repository does not need elaborate project management. It does need disciplined intake.

## Weekly triage pass

For a small solo-maintained repo, one quick pass is usually enough:

1. Confirm the issue is still real and still scoped well.
2. Add the right type label and one surface label.
3. Decide whether it belongs in the near-term backlog, should stay parked, or should be closed.
4. If it is blocked, say what it is blocked on.

## What makes an issue ready

An issue is ready when it has:

- a concrete problem statement
- a defined outcome
- acceptance criteria that can be checked
- enough context that a branch can start without a discovery rewrite

If those are missing, fix the issue before starting implementation.

## When to close without coding

Close an issue if:

- the repo already behaves correctly
- the requested change conflicts with the current project direction
- the issue duplicates another tracked item
- the proposed work is too vague to be actionable and never gets clarified

Closing weak issues is healthier than keeping a noisy backlog.

## Priority shorthand

- `P1`: blocks trust in the repo or breaks a core workflow
- `P2`: meaningful next work that improves product or maintenance quality
- `P3`: worthwhile, but not on the immediate path

Priority does not replace labels. It complements them in the issue body or title.

## Backlog discipline

- Keep the backlog short enough to read in one sitting.
- Prefer a dozen real issues over fifty placeholders.
- If a roadmap item has no practical next action, leave it in a roadmap doc instead of forcing it into the issue tracker.
