---
name: code-reviewer
description: Structured code review discipline: correctness, design, readability, and security checks with actionable feedback. Use when reviewing diffs, PRs, or code snippets before merge or after writing.
category: development
---

# Code Reviewer

## Overview

A code review is not a spell-check. It is the last structured chance to catch bugs, design drift, and
security holes before they ship — and the best mentoring surface a team has. This skill turns review
into a repeatable discipline: a layered checklist (correctness → design → readability → security),
comment conventions that keep feedback actionable and kind, and a decision rule for when to approve,
request changes, or block.

Good reviewers optimize for **throughput with safety**: catch what matters, don't relitigate settled
style, and leave the codebase — and the author — better than you found them.

## When to use

- Reviewing a pull request or merge request before approving.
- Reviewing your own diff before requesting review (self-review first).
- Auditing generated or AI-assisted code before merging it.
- Onboarding reviewers: giving a team a shared review standard.
- Post-incident: reviewing a hotfix under time pressure without skipping safety.

## Core concepts

- **Layered review order.** Check in this order and stop demanding re-reviews when lower layers fail:
  1. **Correctness** — does it do what it claims? Edge cases, nulls, off-by-ones, error paths.
  2. **Design** — does it fit the architecture? Abstractions, boundaries, naming, duplication.
  3. **Readability** — can the next person understand it in one pass? Comments where non-obvious.
  4. **Security** — injection, authz checks, secrets, unsafe deserialization.
  5. **Performance** — only when there's evidence of a hotspot (N+1 queries, unbounded loops).
- **Comment taxonomy.** Use consistent prefixes so the author knows what action is expected:
  - `nit:` — style preference, optional to take.
  - `question:` — genuine uncertainty, not a veiled criticism.
  - `suggestion:` — a concrete better approach, ideally with code.
  - `blocking:` — must change before merge (bug, security, broken contract).
- **Approval stances.** `Approve` (ship it), `Approve with comments` (nits only, no re-review),
  `Request changes` (blocking issues, re-review needed), `Hold` (needs design discussion first).
- **Review your own diff first.** Read the diff in the PR tool, not the files — you'll see it the way
  reviewers do and catch leftover debug code, accidental files, and weak commit messages.
- **Time-box.** Reviews older than 24 hours rot. Aim for a first response within a working day;
  large PRs should have been small PRs (send that feedback early, then review what's in front of you).

## Practical workflow

1. **Get context.** Read the PR description, linked issue, and test plan before the diff.
2. **Scan the diff top-to-bottom** once for shape: files touched, size, test coverage ratio.
3. **Correctness pass.** For each changed function ask:
   - What are the invalid inputs? Are they rejected or handled?
   - What happens on failure — does the error propagate to somewhere that handles it?
   - Are resources (files, connections, locks) released on every path?
4. **Design pass.** Check boundaries: does this layer know too much about another? Is there a simpler
   way that doesn't add an abstraction? Would a future maintainer find the seams?
5. **Security pass.** Trace every external input to its sink. Verify authorization is checked
   server-side, not just hidden in the UI. Look for secrets, tokens, or PII in logs and responses.
6. **Leave comments** using the taxonomy; batch related comments; always pair a `blocking:` with the
   reason and, when possible, the fix.
7. **Decide the stance** and state it explicitly, including what (if anything) needs re-review.

Quick self-review checklist before requesting review:

```text
[ ] Diff contains only intended files (no debug prints, no stray assets)
[ ] Tests cover the new behavior, including at least one failure case
[ ] Public APIs/naming reviewed against project conventions
[ ] No secrets, credentials, or internal URLs committed
[ ] PR description explains WHY, not just WHAT
[ ] Screenshots/logs attached for UI or behavior changes
```

## Common pitfalls

- **Style bikeshedding.** If a linter can enforce it, the linter should — never block a PR over
  formatting a tool could fix. Put the rule in the formatter config and move on.
- **Reviewing the author, not the code.** "You always…" is never useful. Comment on the diff.
- **Rubber-stamping large PRs.** A 2,000-line diff approved in 10 minutes is a signature, not a
  review. Push back on size early; review incrementally with stacked PRs.
- **Demanding perfection.** The bar is "safe to merge and maintain," not "the way I would have
  written it." Alternative approaches that are equally good are `nit:` at most.
- **Security theater.** "Use HTTPS" on an internal health check, or flagging a theoretical timing
  attack while missing an unauthenticated admin endpoint. Prioritize realistic threat paths.
- **Drive-by redesigns.** If the design is wrong at the architectural level, don't leave 40 comments
  on the implementation — `Hold`, explain the design concern, and talk it through.
- **Ghost reviews.** Requesting changes and disappearing stalls the author. Own the re-review and
  respond as fast as you did the first time.
