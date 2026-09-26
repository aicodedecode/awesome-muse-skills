---
name: code-review-pro
description: Professional code review craft: review strategy, feedback that lands, reviewer efficiency, and team review culture. Use when reviewing code or improving a team's review process.
category: development
---

# Code Review Pro

## Overview

Code review is **the team's highest-leverage quality practice** — and its highest-leverage mentoring
surface. Professional reviewing means reviewing *efficiently* (fast first response, right depth),
writing feedback that gets accepted (specific, kind, actionable), and building a review culture
where reviews unblock rather than gatekeep.

The through-line: optimize for throughput with safety — catch what matters, teach generously, and
never be the bottleneck.

## When to use

- Reviewing pull requests effectively.
- Giving feedback that's critical but well-received.
- Speeding up a slow review process.
- Establishing review standards and culture for a team.
- Reviewing your own code before requesting review.

## Core concepts

- **Review in layers.** Correctness first (does it work? edge cases? error paths?), then design
  (does it fit the architecture?), then readability, then nits. Don't block on nits; don't nitpick
  code with correctness issues — review the important layer that's actually broken.
- **Comment taxonomy.** Prefix comments so intent is clear: `blocking:` (must fix — bug/security/
  broken contract), `suggestion:` (concrete better approach, with code), `question:` (genuine
  uncertainty — not a veiled criticism), `nit:` (optional style). Authors triage instantly.
- **Approval stances.** Approve (ship it), comment-only/approve-with-nits (no re-review needed),
  request changes (blocking issues — own the re-review promptly), hold (needs design discussion —
  take it to a call, not 40 comments).
- **Speed is a feature.** First response within a working day; reviews rot after 24h. For large
  PRs: review incrementally (stacked PRs), and push back on size early — "this is too big to
  review well, can we split it?" is the most valuable review comment.
- **Kindness is strategy.** Critique the code, never the author; assume good intent; praise good
  work specifically (reinforces what to repeat); ask questions before asserting ("Did you consider
  X?" beats "This is wrong"). Reviews shape culture — harsh reviews produce defensive, minimal PRs.
- **Self-review first.** Read your own diff in the PR tool before requesting review — you'll catch
  debug leftovers, accidental files, and weak spots, and your reviewers' time goes to real issues.

## Practical workflow

1. **Get context first.** PR description, linked issue, test plan — then the diff. Reviewing
   without context produces irrelevant feedback.
2. **Scan for shape.** Files touched, size, test coverage. If it's too big or missing tests, say
   so before deep-diving — don't review 2,000 lines you'll ask to split anyway.
3. **Correctness pass.** Trace the logic: inputs (invalid? boundary?), error paths (handled?
   propagated?), resources (released on all paths?), concurrency (races? deadlocks?).
4. **Design pass.** Boundaries respected? Abstractions earned? Naming clear? Would a maintainer
   find the seams? Duplication that's actually shared knowledge?
5. **Security pass.** Untrusted input traced to sinks; authz server-side; no secrets in code/logs;
   dependencies vetted. (Deeper: see security review practices.)
6. **Write the review.** Batched, taxonomized comments; blocking issues paired with reasons and
   suggested fixes; explicit stance; for request-changes, state exactly what needs re-review.
7. **Follow through.** Re-review promptly when changes are requested; don't move goalposts on
   re-review (new blocking issues on round 2 erode trust — get it right the first time).

Review comment examples:

```text
blocking: This query is missing a tenant filter — user A can list user B's orders.
  Suggest: add `.where(tenant_id = current_tenant)` like in listInvoices().

suggestion: Consider extracting this retry logic — checkout and refunds both
  implement it slightly differently. Happy to take it as a follow-up.

question: Is the 30s timeout based on the payment provider's SLA? Their docs
  suggest p99 of 8s — want to make sure we're not timing out legitimate charges.

nit: `usr` → `user` for consistency with the rest of the file.
```

## Common pitfalls

- **Bikeshedding.** Blocking on formatting a linter could enforce. Automate style; review design.
- **Rubber-stamping.** Approving huge diffs in minutes — a signature, not a review. If you can't
  review it properly, say so and ask for a split.
- **Perfection demands.** Blocking on "I would have written it differently" when the code is
  correct, clear, and tested. The bar: safe to merge and maintain.
- **Drive-by redesigns.** 40 implementation comments when the architecture is the problem — stop,
  call a hold, discuss the design synchronously.
- **Ghost reviewing.** Requesting changes then disappearing for days. Own the re-review with the
  same urgency as the first.
- **Vague feedback.** "This is confusing" without saying what or suggesting an alternative.
  Specific, actionable, kind — all three, every comment.
- **Review as gatekeeping.** Using reviews to assert seniority or block approaches you dislike.
  Reviews serve the codebase and the author — check your ego at the diff.
