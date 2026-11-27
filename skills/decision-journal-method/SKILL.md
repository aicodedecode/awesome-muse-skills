---
name: decision-journal-method
description: Run a decision journal that actually improves decisions: record each real decision with its options, context, and a dated prediction before the outcome is known, then review on schedule and grade the process separately from the outcome. Use when the user faces a significant or hard-to-reverse decision, asks to track their decisions, or wants to learn from past choices.
category: productivity
---

# Decision Journal Method

Decisions feel obvious in hindsight and invisible in advance.
A decision journal fixes both: it writes down what was decided,
why, and what was expected, before the outcome is known, so
later reviews compare the reasoning against reality instead of
against a rewritten memory. The journal is append-only: entries
are never edited after the fact, only reviewed.

## When to journal

Journal any decision with a real cost, a commitment, or a
consequence: purchases above the user's everyday threshold,
bookings, subscriptions, schedule tradeoffs, commitments to
other people. Trivial, fully reversible micro-choices do not
need an entry; when in doubt, the act of stating the decision
in one sentence usually settles whether it qualifies. A
decision that cannot be stated in one sentence gets decomposed
until it can.

## Working a decision

1. **State it.** One sentence: what is being decided, and what
   "done well" looks like.
2. **Generate the real options.** Always include the status
   quo (doing nothing, with its true drift cost: doing nothing
   is a choice with a price, never free), a structured defer
   option (decide at a named better time, with a pre-set
   default), and where one exists a minimum-viable option (the
   lowest-friction way to meet most of the need). Cap the
   finalists at two or three.
3. **Apply hard filters before scoring.** Affordability against
   the actual budget, immovable commitments, the user's own
   standing rules: an option that fails a filter is out before
   any comparison of merits. Zero survivors means the
   pre-committed fallback fires; exactly one survivor means it
   is selected without further deliberation.
4. **Take the outside view first.** Start every forecast from a
   base rate: how do decisions like this usually turn out, and
   what does the journal's own history in this category say?
   Record the inside view (why this case feels different)
   separately, and never let it silently replace the base rate.
5. **Stress the leader.** For any costly or hard-to-reverse
   decision, run a devil's-advocate pass (the strongest case
   against the leading option) and a premortem: it is a year
   later and this failed; write down why. Treat seller-imposed
   urgency and scarcity as attack signals, presumed manufactured
   until verified at a primary source.
6. **Cool off in proportion to irreversibility.** No
   irreversible decision is finalized in the session where it
   first appeared: overnight for large ones, two separate days
   for one-way doors. A counterparty who refuses cooling-off
   time loses standing in the comparison.
7. **Record kill criteria at decision time.** The conditions
   that would reverse the choice (a return-by date, a usage
   threshold, a price movement, a checkpoint date) go in the
   entry the moment the decision is made, not after doubts
   appear.

## The entry format

```
## <date>: <one-sentence decision>
- Question: as stated at intake
- Options: each option, with hard-filter verdicts
- Decided: the choice, and how (user, or agent under the
  user's standing rules)
- Why: the top variables that drove it
- Context: the state that mattered (time pressure, energy,
  constraints) at the moment of deciding
- Evidence: primary sources, with dates; manipulation signals
  found, if any
- Prediction: a dated, resolvable prediction with a stated
  probability ("70%: still using this weekly at <date>")
- Kill criteria: reversal conditions and their dates
- Reviews: appended at each review date, never edited in
```

## Reviews and calibration

- Review at fixed horizons after the decision (for example
  +24 hours, +7 days, +30 days, +90 days; a year for the
  biggest). Append the review to the entry: what happened, and
  two separate grades, one for the outcome and one for the
  process.
- **Grade the process, never just the outcome.** A good
  decision can have a bad outcome; only the process grade
  should change how future decisions are made. Grading by
  outcome alone teaches superstition.
- Score the predictions. A prediction log with stated
  probabilities can be calibration-checked over time (a simple
  Brier score works): the goal is that "70%" predictions come
  true about 70% of the time, for the user and for the agent.
- Mine the misses. When a review finds a variable that was
  forgotten at decision time and would have changed the choice,
  record it as a standing checklist item for that category of
  decision, permanently. The journal's history becomes the base
  rate the next decision starts from.

## Presenting a decision

- When the user is stuck, present one recommendation with its
  reason, not an uncapped menu. If they pass on it, the reason
  for the pass becomes a variable in the next round.
- For large decisions, surface a short brief: the
  recommendation, its probability, the top three drivers, the
  top risk, the premortem headline, the kill criteria, and the
  deadline with its default. Prepared work first; the user's
  only job is to approve or veto.
