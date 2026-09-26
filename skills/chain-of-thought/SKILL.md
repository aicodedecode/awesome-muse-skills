---
name: chain-of-thought
description: Elicit step-by-step reasoning from language models to boost accuracy on math, logic, and multi-step problems.
category: ai-research
---

## Overview

Chain-of-thought (CoT) prompting gets language models to reason through problems
step by step before answering, instead of jumping straight to a final answer. The
mechanism is straightforward: by generating intermediate reasoning tokens, the
model gives itself more computation per problem and a scratchpad to hold partial
results. On arithmetic, logic puzzles, and multi-hop questions, this reliably
produces large accuracy gains over direct answering — it's one of the most
replicated findings in prompting research.

The two flavors are zero-shot CoT ("Let's think step by step" appended to the
prompt) and few-shot CoT (demonstrations showing worked reasoning). Few-shot CoT
with well-crafted demonstrations generally outperforms zero-shot, but zero-shot is
a strong, nearly-free baseline. The modern ecosystem extends the idea:
self-consistency samples multiple chains and takes the majority answer;
least-to-most decomposes problems into subproblems; and reasoning is now often
trained in (RL on verifiable reasoning traces) rather than merely prompted.

CoT is inference-time compute made legible: you pay in tokens, you gain in
accuracy, and you get a trace you can inspect. The art is knowing when the trade
is worth it.

## When to use

- Math word problems, logic puzzles, and any task where the answer requires
  combining multiple facts.
- Multi-hop question answering where evidence must be chained across sources.
- Code generation for non-trivial algorithms — reasoning about the approach before
  writing code.
- Debugging model errors: a visible reasoning trace shows where the model's logic
  went wrong.
- Any accuracy-critical task where extra inference-time tokens are an acceptable
  cost.
- Evaluation and red-teaming, where traces reveal failure modes that final
  answers hide.

## Core concepts

- **Reasoning as compute**: each generated token is computation. CoT works because
  it lets the model spend tokens on intermediate steps rather than forcing the
  answer out of a single forward pass.
- **Zero-shot CoT**: appending a phrase like "Let's think step by step" or "Reason
  carefully before answering." Costs nothing to try; typically adds a few points on
  reasoning benchmarks.
- **Few-shot CoT**: demonstrations with worked solutions. The demonstrations
  teach both the reasoning style and the output format. Most effective when
  demonstrations cover diverse problem structures.
- **Self-consistency**: sample N reasoning chains at temperature > 0, take the
  majority final answer. Trades compute for accuracy; particularly effective when
  individual chains are noisy but the modal answer is right.
- **Faithfulness caveat**: the generated chain is a rationalization the model
  produces, not a guaranteed record of its internal computation. Chains can
  contain plausible-sounding steps that don't actually determine the answer. Don't
  treat them as proofs.
- **Answer extraction**: with CoT, parse the final answer from the trace (e.g.,
  "Therefore, the answer is X"). Standardize the extraction format in
  demonstrations to make parsing reliable.
- **Least-to-most**: decompose a hard problem into easier subproblems, solve
  sequentially, building on answers. Helps when the full reasoning chain is too
  long to hold in one pass.
- **Program-aided reasoning**: offload exact computation to code (the model writes
  and runs programs) instead of doing arithmetic in prose. Eliminates the most
  common CoT failure mode — arithmetic slips.

## Practical workflow

1. **Baseline without CoT.** Measure direct-answer accuracy first so you know what
   the reasoning is buying you.
2. **Try zero-shot CoT.** Add an explicit reasoning instruction. If it helps
   meaningfully, you have a cheap win.
3. **Craft few-shot demonstrations.** Write 4–8 worked examples with clear, correct
   reasoning steps in a consistent format. Include at least one example
   demonstrating how to handle a trick or edge case.
4. **Standardize the answer format.** End every demonstration with an unambiguous
   final-answer marker. Your parser depends on this.
5. **Add self-consistency for critical tasks.** Sample 5–10 chains, majority-vote
   the extracted answers. Measure the accuracy-per-dollar trade-off.
6. **Consider program-aided variants.** For math-heavy tasks, have the model write
   code and execute it rather than reasoning in prose — strictly better where
   execution is available.
7. **Evaluate the chains, not just answers.** Sample traces and check: are steps
   actually valid? Does the final answer follow from the steps? Invalid-but-lucky
   chains indicate the prompt needs work.

Checklist for a CoT deployment:
- Accuracy delta over direct answering measured on held-out data.
- Answer parser tested against real traces (not just the clean demonstrations).
- Token budget accounted for: CoT multiplies output tokens significantly.
- Trace sampling in production for ongoing quality monitoring.
- Decision documented on when CoT applies (routed) vs. always-on.

## Common pitfalls

- **Assuming faithfulness.** A fluent reasoning chain can mask a wrong answer
  reached for the wrong reasons — or a right answer reached by luck. Verify steps
  independently on a sample.
- **Demonstrations that leak the answer pattern.** If all few-shot examples have
  answer "C" or follow an identical template, the model learns the template, not
  the reasoning.
- **CoT on non-reasoning tasks.** For memorization, style, or simple lookup tasks,
  CoT adds tokens and sometimes hurts (the model talks itself into wrong answers).
  Apply it where intermediate computation helps.
- **Unparseable traces.** Free-form reasoning without a consistent final-answer
  format makes automated evaluation and downstream use painful. Enforce the format.
- **Ignoring cost.** CoT can 5–10x output tokens. For high-volume, low-margin
  tasks, distill the CoT behavior into the model (train on traces) or reserve CoT
  for hard cases via routing.
- **Prompting a weak reasoner.** CoT amplifies reasoning ability but can't create
  it. Small or non-instruction-tuned models often produce incoherent chains —
  verify the base capability first.
- **Arithmetic in prose.** Letting the model do multi-digit arithmetic in the
  trace instead of using code execution. The most avoidable CoT failure.
- **No routing.** Applying CoT uniformly when only 20% of queries need it. Route
  by difficulty — a classifier or confidence heuristic — and save the tokens.
