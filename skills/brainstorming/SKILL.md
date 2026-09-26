---
name: brainstorming
description: Structured ideation for technical problems: divergent generation, constraint framing, and convergent selection. Use when stuck on a design, naming, architecture, or feature approach and need fresh options.
category: development
---

# Brainstorming

## Overview

Brainstorming fails when it's just "think of ideas" — the loudest voice wins and the first idea
sticks. This skill makes ideation **structured**: separate generation from evaluation, use
constraints as fuel rather than obstacles, apply specific techniques to break fixation, and converge
with explicit criteria instead of vibes.

It works for architecture options, feature designs, naming, debugging hypotheses, and any problem
where the obvious answer might not be the best one.

## When to use

- Stuck on a design decision with no clear winner.
- Starting a feature and wanting options before committing.
- Naming things (services, APIs, concepts) without bikeshedding for a week.
- Generating debugging hypotheses when the cause isn't obvious.
- Breaking a team out of "we've always done it this way."

## Core concepts

- **Diverge before you converge.** Generation and evaluation use different mental modes; mixing them
  kills ideas before they form. First produce quantity (aim for 15–20 raw options), then filter.
  No criticism during divergence — even from yourself.
- **Constraints are creative fuel.** "Design X with no new dependencies / in half the code / that a
  junior can maintain" produces more interesting ideas than a blank page. Add artificial constraints
  deliberately to force lateral moves.
- **Fixation breakers.** When ideas circle the same shape, change the lens:
  - *Inversion:* "How would we guarantee this fails?" then invert the answers.
  - *Subtraction:* "What if we removed the hardest part entirely?"
  - *Analogy:* "How does [unrelated domain] solve this?" (logistics, biology, games).
  - *Worst idea first:* deliberately propose terrible ideas — they lower the bar and often contain
    a salvageable kernel.
- **Convergence criteria.** Filter with explicit, weighted criteria: impact, effort, reversibility,
  risk, fit with existing architecture. Score quickly (1–3 per criterion); don't over-model.
- **Time-boxing.** 10 minutes of divergence, 10 of clustering, 10 of convergence. Parkinson's law
  applies to thinking too — open-ended brainstorming produces open-ended meetings.
- **Write it down.** Ideas evaporate. Capture raw options verbatim during divergence; the exact
  phrasing often holds the insight that a summary would lose.

## Practical workflow

1. **Frame the problem as a question.** "How might we…?" — specific enough to aim at, open enough
   for range. Write down what a good solution must achieve (the real constraints).
2. **Diverge (10 min).** Generate 15+ options fast. Use one fixation breaker if you stall. No
   judging, no discussing — just capture.
3. **Cluster.** Group similar ideas; name each cluster. Clusters reveal the underlying approaches
   (usually 3–5 distinct strategies hiding in 20 ideas).
4. **Add constraints round (optional, 5 min).** Pick the most interesting cluster and re-ideate
   under a harsh constraint ("no new infra", "must ship Friday"). Keep the best 2–3.
5. **Converge.** Score top candidates against your criteria (impact/effort/risk/reversibility).
   Pick one primary and one backup. Note what would change your mind.
6. **Spike the winner.** Before full commitment, time-box a prototype or investigation that tests
   the riskiest assumption. An idea that survives contact with reality is a plan.

Example — framing and convergence:

```text
Problem: "How might we cut our CI pipeline from 25 min to under 10?"
Constraints: no new paid services; must keep e2e coverage on critical journeys.
Divergence (sample): split by test type, cache Docker layers, parallelize e2e shards,
  drop redundant browser matrix on PRs, nightly full matrix, faster runners, test-impact
  analysis, merge small services' pipelines...
Convergence criteria: time saved (weight 3), effort (weight 2), risk (weight 2).
Winner: shard e2e + cache layers + PR-vs-nightly matrix split → spike: measure cache hit rate first.
```

## Common pitfalls

- **Evaluating during generation.** "That won't work because…" in the first five minutes guarantees
  a short, boring list. Defer judgment — structurally, not just politely.
- **Anchoring on the first idea.** The first suggestion frames everything after it. Counter it:
  generate privately before sharing, or deliberately start from the opposite approach.
- **Vague problem framing.** "Brainstorm the new dashboard" produces decoration ideas. "How might
  we show a user their week in under 5 seconds?" produces design ideas.
- **Converging on vibes.** "I just like option B" without criteria means the decision can't be
  revisited rationally. Write the criteria down — future-you needs them.
- **No owner, no deadline.** A brainstorm that ends with "interesting ideas" and no spike owner is
  entertainment. End every session with: what we test next, who does it, by when.
- **Groupthink in teams.** Senior voices first = everyone agrees with senior voices. Collect ideas
  silently and simultaneously, then discuss.
- **Falling in love with cleverness.** The elegant, novel solution that nobody can maintain loses
  to the boring one that ships. Weight maintainability in convergence.
