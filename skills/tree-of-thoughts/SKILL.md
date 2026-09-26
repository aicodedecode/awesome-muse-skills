---
name: tree-of-thoughts
description: Search over multiple reasoning paths — branch, evaluate, backtrack — for problems where one linear chain isn't enough.
category: ai-research
---

## Overview

Tree-of-Thoughts (ToT) generalizes chain-of-thought from a single reasoning path
to a search tree. Instead of committing to one chain, the model generates multiple
candidate "thoughts" at each step, evaluates which partial solutions look
promising, and explores the best ones — backtracking when a branch dead-ends. It's
deliberative search applied to language-model reasoning: the model proposes, a
value function (often the model itself) scores, and a search algorithm (BFS or
DFS) manages the exploration.

The payoff comes on tasks requiring planning, lookahead, or creative exploration
— puzzles like Game of 24, crossword-style constraint satisfaction, or multi-step
plans where early choices determine success. On such tasks ToT substantially
outperforms single-chain CoT. The price is compute: ToT multiplies inference cost
by the branching factor times the depth, so it's a technique for hard, high-value
problems, not for bulk inference.

ToT sits between CoT and full agent search: more deliberate than sampling multiple
chains, less heavyweight than running an environment-backed agent loop. Use it
where the problem has verifiable intermediate states and genuine branching.

## When to use

- Puzzles and constraint-satisfaction problems where the solution needs trying
  alternatives (Game of 24, logic puzzles, scheduling).
- Planning tasks where early decisions constrain later ones and backtracking is
  natural.
- Creative generation where exploring diverse directions then selecting beats
  committing early.
- Debugging complex reasoning: the tree makes the model's considered alternatives
  visible.
- High-stakes single queries (a difficult math problem, a tricky analysis) where
  spending 50x tokens is justified.
- Tasks with a cheap verifier for partial states — the evaluator is what makes
  search work.

## Core concepts

- **Thoughts as nodes**: each node is a coherent intermediate state — a partial
  solution, a plan step, a candidate equation. Keep thoughts atomic enough to
  evaluate but substantial enough to be meaningful (a sentence or two, not a
  token).
- **Generation (branching)**: at each node, sample k candidate continuations.
  Diversity matters more than quality here — use temperature or explicitly ask for
  distinct approaches.
- **Evaluation (scoring)**: score partial solutions for promise. Options: the
  model self-evaluates ("rate this partial solution 1–10"), majority vote across
  samples, or a task-specific verifier (a checker function is far more reliable
  than self-evaluation when one exists).
- **Search strategy**: BFS explores level by level (good when you want the best
  shallow solution); DFS goes deep with backtracking (good when solutions need
  depth). Prune aggressively — keep only top-b beams.
- **Backtracking**: the defining advantage over CoT. When evaluation says a branch
  is dead, abandon it and try siblings. Explicitly prompt for this: "if stuck,
  backtrack to the last promising state."
- **Cost control**: branching factor × depth × evaluations = the bill. Typical
  configs: 3–5 branches, depth 3–6, beam width 3–5. Set a hard node budget.
- **Verifiers beat self-evaluation**: whenever the domain admits a programmatic
  check (constraint satisfaction, arithmetic validity, code execution), use it as
  the evaluator. Self-evaluation is the fallback, not the default.
- **Beam management**: the beam is your working memory of hypotheses. Too narrow
  and you lose the solution early; too wide and you burn budget on mediocrity.

## Practical workflow

1. **Decompose the problem into checkable steps.** ToT needs intermediate states
   you can evaluate. If you can't define what a "partial solution" looks like, ToT
   doesn't apply.
2. **Design the thought format.** One node = one concrete step (e.g., "combine two
   numbers with an operation" for Game of 24). Vague nodes produce vague
   evaluations.
3. **Build the evaluator.** Prefer a programmatic verifier (does this partial
   state violate constraints?). Fall back to model self-evaluation with a strict
   rubric, sampled multiple times for stability.
4. **Implement search.** BFS with beam pruning is the default. Pseudocode:
   frontier = [root]; loop: generate k children per node, score all, keep top b,
   repeat until depth limit or a complete solution verifies.
5. **Verify the final answer.** Run the complete solution through an independent
   checker. ToT's search can converge on confidently-wrong answers if the
   evaluator is weak.
6. **Measure cost vs. gain.** Compare against self-consistency CoT at equal token
   budget. ToT should win on planning-heavy tasks; if it doesn't, the evaluator
   is probably the weak link.
7. **Tune the search parameters.** Grid-search branching factor, beam width, and
   depth on a dev set. Small changes here move the cost/accuracy frontier a lot.

Checklist for a ToT implementation:
- Node format defined and enforced in generation prompts.
- Evaluator validated independently (scores known good/bad partial states
  correctly).
- Node budget capped; timeout handling in place.
- Final-answer verification separate from the search evaluator.
- Cost benchmarked against self-consistency at equal budget.

## Common pitfalls

- **Weak evaluator.** ToT is only as good as its scoring function. Model
  self-evaluation is noisy and overconfident; a bad evaluator turns expensive
  search into expensive random walk.
- **Applying ToT to linear problems.** If the task is "apply steps in order," ToT
  adds cost without benefit. Reserve it for genuine branching problems.
- **Unbounded search.** Without beam width and depth limits, the tree explodes.
  Always cap nodes and have a fallback (best-so-far) answer.
- **Thoughts too granular or too vague.** Token-level nodes are unsearchable;
  essay-level nodes are unevaluable. Aim for one meaningful step per node.
- **Ignoring the cheaper alternatives.** Self-consistency with 10 samples often
  captures much of the benefit at a fraction of the complexity. Benchmark it
  first.
- **No independent verification.** Using the same model to generate, evaluate, and
  verify creates correlated failures. An external checker breaks the correlation.
- **Evaluator-model correlation.** Even "independent" verifiers built from the
  same model family share blind spots. Prefer programmatic checks where possible.
- **Premature convergence.** An overconfident evaluator prunes the branch holding
  the real solution early. Keep beams a little wider than feels necessary.
