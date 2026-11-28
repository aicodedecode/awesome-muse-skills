---
name: personal-project-manager
category: productivity
description: "Run a person's goals, projects, and requests the project-management way, translated for a personal assistant: classify every effort as portfolio, program, project, or operations; charter it in one structured record; decompose, estimate honestly, track earned value, keep a risk register, control changes to settled plans, and close with a benefit sustain check. Use whenever a request is a project, a goal needs managing across sessions, or a plan needs a schedule with real dependencies, not for one-off lookups."
---

# Personal Project Manager

A playbook for an AI personal assistant that manages a person's work
and life projects with real project-management discipline, scaled to
the stakes. The method is distilled from PMI's PMBOK Guide (7th and
8th editions) and the PMP Examination Content Outline, paraphrased
into assistant practice. It is an original synthesis, not PMI text,
and it is not affiliated with PMI.

The core insight: almost everything a person asks an assistant to do
over more than one sitting is a project or a program, personal
efforts included. A job hunt is a program. A trip, a move, a health
effort, a party, a savings objective, and learning a skill all
classify the same way professional work does. Rigor scales with
stakes, irreversibility, and people involved, but classification
never scales to zero.

## Place the work at the right level first

- Classify every effort before acting: portfolio (all goals and the
  budget together, choosing what gets resources), program (a standing
  goal made of related projects), project (bounded, defined outcome,
  an end), or operations (recurring machinery managed for
  reliability).
- Scale rigor with stakes, but never scale classification to zero: a
  micro-project still gets a one-line charter, a decomposition, and a
  closure check, because the failures this playbook prevents happen
  at every size.
- Run operations for reliability and cost, never as projects: monitor
  them, improve in small increments, and retire them cleanly with
  every piece of state handed to a named successor.
- Act as a PMO, not process police: the assistant is a service
  provider whose place is earned by value the person perceives.

## Run every project through five focus areas

- Initiate with a charter: outcome in one line, benefit and who owns
  it, definition of done stated as evidence, a real deadline if any,
  constraints, stakeholders, and decision rights (what the assistant
  decides, what the person decides). Create the tracked work item at
  initiation, and check portfolio fit, including whether the budget
  category meant to fund it is actually funded.
- Plan before executing: decompose, estimate, and surface risks and
  dependencies while they are cheap, then save the plan as a baseline
  so later changes are visible as changes.
- Execute in verifiable increments: each increment ends with evidence
  (a confirmation, a read-back, a checksum, a live probe). Remove
  impediments fast, and escalate blocks only the person can clear to
  them directly instead of parking them.
- Monitor by exception: compare actuals to baseline on a cadence
  matched to risk, absorb variance inside thresholds the person set,
  and surface only variance that crosses a threshold.
- Close deliberately: verify the definition of done against evidence,
  transfer anything ongoing to a permanent owner, schedule the
  benefit sustain check, capture the lesson where future work will
  look for it, then close the item.

## Apply front-end discipline

- Start from the need, not the solution named in the request: when a
  request names a tool or a file, establish the outcome it serves
  before building anything.
- Elicit requirements from evidence first: the person's stated
  preferences, corrections, calendar, and spending beat conventions
  and guesses, and every material requirement traces to a goal and a
  way to know it was met.
- Decompose under the 100 Percent Rule: the breakdown contains all of
  the work and only the work, which catches both the forgotten
  subtask and gold-plating.
- Stop decomposing at work packages: one owner, fits one sitting or
  one agent run, a visible done state, dependencies named, and a one
  or two line dictionary entry a future session can act on without
  re-asking.

## Keep numbers honest

- Build schedule models, not date lists: activities, sequence,
  dependencies, and the critical path, with buffers placed on the
  critical leg and before the deadline instead of padding spread
  everywhere.
- Plan far work with rolling wave: near work in detail, far work as
  named blocks elaborated as they approach.
- Give estimates as ranges with a named basis (analogous to a past
  actual, parametric from a rate, bottom-up from parts), expect the
  cone of uncertainty to narrow as evidence arrives, and record the
  variance and its cause when an estimate is beaten or missed.
- Use earned value logic on money and effort: compare planned value,
  earned value, and actual cost, forecast the final cost at the
  current performance rate, and surface the forecast early when it
  crosses the funded amount. The companion script `references/pmcalc.py` computes
  CPM, PERT Monte Carlo, and EVM so the arithmetic is never
  hand-waved.

## Manage risk, benefits, and change as living systems

- Keep a living risk register in each major project record: risk
  stated as cause, event, and effect on the goal, with an owner, a
  trigger, a planned response, and a review date.
- Run a premortem on high-stakes or hard-to-reverse plans (group
  bookings, large purchases, moves, other people's money or dates),
  and convert the top failure causes into register entries with
  responses.
- Treat opportunities as positive risks: a price drop or an opening
  is capturable only when the response (payment method, budget line,
  decision) was planned in advance.
- Realize benefits in three stages, Identify, Execute, Sustain: name
  the benefit and its owner before authorizing work, track it while
  work runs, and check at 30 and 90 days after closure whether the
  benefit is still there, with a recovery action or a lessons entry
  when it evaporated.
- Treat every settled plan as a baseline under change control: any
  change, including the person's own mid-flight changes, gets an
  impact check (cost, schedule, stakeholders, other goals), then the
  baseline is updated everywhere it lives and verified by read-back,
  never half-applied.
- Diagnose complexity before adding process: human behavior sources
  get engagement and ground rules, system behavior sources get
  decoupling, and genuine ambiguity gets small experiments with short
  feedback loops.

## Choose the way of working, and govern the AI

- Pick the delivery approach per effort at initiation and write it in
  the record: predictive for fixed outcomes and dates (flights,
  tickets, filings), iterative or incremental for builds and hunts,
  flow for continuous streams (triage, deals, notifications), and
  revisit the choice as the work teaches.
- Keep backlogs refined: an item is schedulable only when its outcome
  and next action are clear. Otherwise it is a wish, and wishes do
  not get scheduled.
- Close painful or delightful projects with a five minute retro
  (expected, happened, one change), and encode the change into a
  skill, checklist, or threshold in the same handling.
- Govern the assistant's own work: verify inputs before acting (data
  quality first), keep the person's decision in the loop for
  irreversible, high-value, or identity-bearing actions, show
  evidence for consequential claims, and run every automation through
  its life cycle from charter to monitored operation to clean
  retirement.

## The charter record

Keep one structured record per project: a `charter.yaml` file next to
the project's other files. Required fields:

- level: portfolio, program, project, or operations
- outcome: the result in one line
- benefit: what improves if the outcome lands
- benefit_owner: who owns the benefit (usually the person)
- done_evidence: what proof closes the project
- deadline_or_constraints: the real deadline or binding constraint
- stakeholders: who else is involved
- status: active, blocked, closing, closed, or sustaining

Optional fields: budget_category, risks (each with risk, trigger,
owner, response), sustain (days, 30 or 90, and a due date), and
estimates (each with item, low, likely, high, actual, unit).

Two rules give the record its teeth:

- A project is not properly chartered until its charter validates.
- A project may not be closed with a persisting benefit unless a
  sustain check is recorded. Unchecked benefits evaporate silently;
  in one real portfolio audit, 161 closures in 90 days had zero
  sustain checks between them.

The companion script `references/pmrecord.py` initializes, validates,
and rolls up charter records across a workspace of project folders.
A starter template ships as `references/charter-template.yaml`.

## Tools philosophy

- Keep the system of record you already have. Goals, tracked items,
  the budget, and the calendar stay the record; dashboards compile
  from records. Do not migrate project data into an external project
  management app just to get discipline: the suites demand becoming a
  second system of record, and their agent integrations are often
  plan-gated or interactive-auth only, which breaks unattended work.
- Buy or borrow a calculator for the math, not a platform: the companion
  pmcalc.py script wraps the open source pmcontrols library for
  critical path, PERT Monte Carlo, and earned value.
- Add structure before software: the charter record plus the two
  scripts cover the gaps that actually bite (no structured record, no
  risk register, no sustain mechanism, no estimate-versus-actual log,
  no earned value link between goals and the budget).
