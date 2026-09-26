---
name: qa-test-planner
description: Plan software testing systematically — test strategy, risk-based prioritization, test case design, automation decisions, and defect triage. Use when deciding what to test and how before writing a single test.
category: ai-research
---

# QA Test Planner

Testing is infinite; time is not. Test planning is the discipline of deciding what to test, how 
deeply, and in what order — so the most important risks get covered first.

## Overview

A test plan answers: what's in scope, what the risks are, which test types apply (unit, 
integration, end-to-end, exploratory, performance, security), what gets automated vs. manual, and 
what "done" means. Risk-based prioritization is the core skill: rank features by likelihood of 
failure times impact of failure, and test in that order.

## When to use

- Starting a new feature or release: deciding the testing approach before code lands.
- Inheriting an untested codebase: figuring out where testing effort pays off most.
- Deciding what to automate vs. test manually.
- Triaging a bug backlog: which defects matter and in what order to fix them.

## Core concepts

- **Risk-based prioritization**: risk = probability of defect × impact. New code, complex logic, 
and payment/auth paths rank highest; cosmetic copy ranks lowest.
- **Test levels**: unit (single function), integration (components together), end-to-end (full user 
flows), plus non-functional (performance, security, accessibility).
- **Test case design**: equivalence partitioning (one representative per class of input), boundary 
values (edges where bugs live), and error guessing from experience.
- **Automation pyramid**: many fast unit tests, fewer integration tests, few end-to-end tests. 
Invert it and you get a slow, flaky suite nobody trusts.
- **Exploratory testing**: structured unscripted testing — charter, timebox, debrief. Catches 
what scripted tests miss.
- **Exit criteria**: the definition of "tested enough" — risk coverage, not a percentage. 100% 
coverage of trivial code means nothing.

## Practical workflow

1. List features/changes; score each on failure likelihood and impact. Sort by risk.
2. Assign test levels per feature: high-risk gets unit + integration + e2e; low-risk gets unit or 
exploratory only.
3. Write test cases for the top risks first: happy path, boundaries, and the most likely failure 
modes.
4. Decide automation: automate stable, repeated checks (regression); keep exploratory and one-off 
checks manual.
5. Define entry/exit criteria: when testing starts (build is stable) and when it stops (risks 
covered, criticals fixed).
6. Triage defects by severity × priority; retest fixes and run regression on affected areas.

```text
Test plan skeleton:
SCOPE:    <features in/out>
RISKS:    <ranked: feature — likelihood × impact>
LEVELS:   <per feature: unit/integration/e2e/exploratory>
AUTOMATE: <what + why>   MANUAL: <what + why>
EXIT:     <criteria for "tested enough">
```

## Common pitfalls

- **Testing everything equally**: spreads effort thin and leaves real risks uncovered. Prioritize 
by risk.
- **Inverted pyramid**: heavy e2e suites that are slow and flaky. Push checks down to unit level 
where possible.
- **No exit criteria**: testing continues until someone gets tired. Define done up front.
- **Automating chaos**: automating tests for unstable features produces flaky suites that erode 
trust. Stabilize first.
- **Coverage as a goal**: 100% line coverage with weak assertions proves little. Cover risks, not 
lines.
- **Skipping exploratory**: scripted tests only verify what you thought of. Timebox exploration for 
what you didn't.
