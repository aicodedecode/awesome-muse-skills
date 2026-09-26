---
name: senior-qa
description: QA engineering perspective: risk-based test strategy, exploratory testing, defect advocacy, and quality gates. Use when planning test coverage, improving QA process, or evaluating release readiness.
category: development
---

# Senior QA Engineer

## Overview

Senior QA is **risk management for software quality**: you can't test everything, so you test the
right things — the paths users actually take, the changes most likely to break, and the failures
with the worst consequences. This skill captures that judgment: risk-based strategy, exploratory
testing skill, writing defects developers can act on, and quality gates that inform releases instead
of blocking them arbitrarily.

The through-line: QA's job isn't finding bugs — it's providing accurate information about risk so
the team can ship confidently.

## When to use

- Planning test coverage for a feature or release.
- A release process with no clear quality signal.
- Bug reports that bounce back as "can't reproduce" or "works as designed."
- Introducing exploratory testing or improving manual testing practice.
- Deciding release readiness under time pressure.

## Core concepts

- **Risk-based testing.** Allocate effort by (likelihood of failure × impact of failure). New code
  in payment processing outranks cosmetic changes in settings. Maintain a living risk list per
  release; test the top of it first.
- **Exploratory testing as a discipline.** Simultaneous learning, test design, and execution —
  guided by charters ("explore checkout with invalid payment methods for 45 min"), not random
  clicking. Session-based: time-boxed, debriefed, documented.
- **The defect report is a product.** A bug report developers love: precise title, environment,
  minimal reproduction steps, expected vs actual, severity *and* impact, logs/screenshots attached.
  "It's broken" is a complaint; a good report is a gift.
- **Severity vs priority.** Severity = technical badness; priority = business urgency. QA owns an
  honest severity assessment; priority is a product decision. Conflating them causes fights.
- **Quality gates, not quality walls.** Entry/exit criteria for test phases and releases (e.g.,
  "no open criticals, <5 high-priority defects, critical journeys green"). Gates inform the ship
  decision with data instead of one person's gut.
- **Shift-left partnership.** QA involved at requirements and design time catches ambiguity before
  it's code. The cheapest bug is the one prevented in a 10-minute design review.

## Practical workflow

1. **Build the risk list.** For the release: what's new, what's changed, what's historically
   fragile, what would hurt most if broken. Rank and assign coverage.
2. **Write charters for exploratory sessions.** Each charter: mission, time box, test data needed,
   and what "done" looks like. Debrief after: what was tested, what was found, what remains risky.
3. **Automate the checks, explore the risks.** Regression and happy paths → automation. New
   features, edge cases, usability, and "what if" scenarios → skilled exploratory testing.
4. **Triage defects ruthlessly.** Reproduce first; deduplicate; set honest severity; include impact
   ("blocks 30% of checkout attempts" beats "critical"). Verify fixes *and* check neighboring
   areas for regressions.
5. **Report quality status plainly.** Before release: what's tested, what's not, open defects by
   severity, residual risks. No surprises — the release decision belongs to the team, informed by
   your report.
6. **Close the loop.** Every escaped defect gets: a regression test, a "how did we miss it"
   note, and a process tweak. Escapes are the most valuable QA data you have.

Defect report template:

```text
Title: [Checkout] "Place order" double-charges when tapped twice quickly
Env: prod-web, Chrome 126, user id 84712
Steps: 1. Add item to cart  2. Go to checkout  3. Double-tap "Place order"
Expected: single charge; button disabled after first tap
Actual: two charges (order #A-99182, #A-99183); see screenshot + HAR file
Severity: High (financial impact, user-visible) | Frequency: reproducible 4/5
Notes: likely missing idempotency key on POST /orders
```

## Common pitfalls

- **Testing everything equally.** Spreading effort flat across the app means the riskiest areas
  get the same attention as the safest. Follow the risk list.
- **Vague bug reports.** "Checkout is broken" with no steps wastes everyone's time and erodes QA
  credibility. Reproduce minimally or say you couldn't.
- **QA as the quality gatekeeper-culprit.** "QA signed off, so it's their fault" — quality is the
  team's job. QA informs; the team decides; everyone owns the outcome.
- **Automating before understanding.** Scripting a flaky manual process produces flaky automation.
  Stabilize the test approach manually first, then automate.
- **Ignoring non-functional quality.** Performance, accessibility, and usability defects are real
  defects. "It works but takes 20 seconds" is a bug.
- **No regression strategy.** Fixing bugs without regression tests guarantees rediscovery. Every
  fix earns a test at the right level.
- **Testing only the happy path.** Users don't. Invalid inputs, interrupted flows, expired
  sessions, flaky networks — that's where the defects live.
