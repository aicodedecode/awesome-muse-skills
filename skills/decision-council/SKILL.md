---
name: decision-council
description: Decide complex or high-stakes questions with a small council of independent subagents (architect, skeptic, delivery operator), tally their stances, execute the verdict in the same session, and verify and log the outcome. Use when a task involves real tradeoffs, ambiguity, architecture options, or a multi-step plan, not for simple or settled tasks.
category: ai-maestro
---

# Decision Council

For decisions with real tradeoffs, one pass of reasoning tends to
defend its first idea. A small council of independent reviewers,
each with a different job, catches what a single pass misses, and
the discipline is that the verdict gets executed and verified,
not just written down.

## When to use, and when not to

Use for: real decisions, tradeoffs, ambiguous tasks, architecture
options, multi-step execution plans, and anything irreversible or
expensive to undo.

Do not use for: single-step reversible tasks, direct instructions
the user already decided, or settled rules. Never convene a
council to re-deliberate an existing rule.

Two modes:

- **Full council** for complex, multi-variable, or high-stakes
  calls.
- **Rapid triage** for time-sensitive, in-flight decisions: the
  same seats, compressed. Output is the single highest-leverage
  move, the consensus core in one or two sentences, and the
  primary blind spot, then execution.

## The council (real subagents, never simulated)

Every seat is an independently reasoning subagent, spawned in
parallel. Role-playing the council in one response defeats the
purpose.

Default three seats:

- **Technical Architect**: architectural integrity, modularity,
  contracts, technical debt. "Is this sound and scalable, or a
  fragile patch?"
- **Skeptic / Risk Guard**: downside risk, worst cases, security
  and privacy, single points of failure, rollback. Standing
  dissent duty: steelman the strongest counter-case to the
  emerging consensus, never a cosmetic objection. Mandatory seat
  for irreversible calls.
- **Delivery Operator**: critical path, dependencies, delivery
  velocity, and post-execution verification. "Can this ship, and
  where does it stall?"

Add seats for irreversible or high-stakes calls, or a split vote:

- **Energy and Bandwidth Advocate**: cognitive load and
  sustainable pacing for the user; plans against their actual
  day, not a static template.
- **Strategic Lead**: leverage and return on effort; guards drift
  by naming the core objective the decision serves. If it serves
  none, it does not run.
- Specialists on demand: security and data retention, metrics and
  quotas, people and stakeholder impact.

## Spawn protocol

Each seat's brief carries: its persona and core question, the
frame (goal, done criteria, the key evidence already gathered,
as references rather than re-pasted bulk), and the output
contract: a firm stance (Yes, No, or Yes-with-conditions), a two
or three sentence assessment, and its single biggest blind spot.

Seats are advisory only: no actions, no side effects, no child
agents. If a seat fails or returns nothing usable, fill it inline,
flag the substitution in the record, and exclude it from the
tally, because a substituted seat is the chair voting for itself.
One failed seat never blocks the verdict.

## The flow

1. **Frame.** One sentence: the goal or dilemma. Plus what done
   means, the core objective served, and today's real constraints
   (time, energy, deadlines) when they bear on the call.
2. **Deliberate.** Spawn the council, collect stances, tally,
   and write the verdict bottom line first. A split vote or a
   Skeptic-led objection on an irreversible call escalates the
   seat count before deciding, not after.
3. **Execute and verify.** Carry out the verdict within the
   user's authorizations. Anything that sends a message to a
   third party, books or buys something, or deletes something
   permanently needs the user's explicit go-ahead for that action
   first, whatever the council decided. Then verify the outputs
   actually landed: files exist, changes read back, references
   resolve. A decision that passed but silently failed to ship is
   a defect.
4. **Record.** Append one decision record (format below) to a log
   the user can find. No credentials or unnecessary personal data
   in the log.

## Decision record format

```markdown
## YYYY-MM-DD, <goal in one sentence>
- Mode / seats: [full | triage; seats used; substitutions if any]
- Verdict: [bottom line + tally]
- Executed: [what actually shipped]
- Verified: [how landing was confirmed]
- Notes: [friction, blind spots, candidate learnings]
```

## Failure modes this prevents

- Advice with no execution: a deliberation that ends in a
  recommendation nobody carries out.
- Deferral substitutes: creating a task or reminder as a stand-in
  for work that could be done now. Tracked follow-ups are only
  for actions genuinely blocked on someone else.
- Unverified success: reporting a plan as done because the steps
  were run, without reading the result back.
