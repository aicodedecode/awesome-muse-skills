---
name: senior-prompt-engineer
description: Expert prompt design for LLM systems: instruction structure, few-shot examples, output control, and systematic evaluation. Use when building prompts, agents, or LLM features that must behave reliably.
category: development
---

# Senior Prompt Engineer

## Overview

Prompt engineering is **interface design for probabilistic systems**: you're writing a specification
that a model interprets, not code a compiler checks. The senior discipline is treating prompts as
engineered artifacts — structured, versioned, tested against real inputs, and evaluated
systematically rather than vibes-checked on three examples.

This skill covers how to write prompts that behave reliably: structure, examples, constraints,
output control, and the evaluation loops that keep them honest as models and inputs change.

## When to use

- Writing system prompts for assistants, agents, or features.
- Getting inconsistent or unreliable output from an LLM integration.
- Designing few-shot examples, output schemas, or tool-use instructions.
- Building evals for prompt quality before shipping.
- Debugging why a prompt works in testing but fails in production.

## Core concepts

- **Structure beats cleverness.** Models respond to clear structure: role/context, task, inputs,
  constraints, output format, examples — in that order. A well-organized plain prompt outperforms
  a "clever" trick-laden one and survives model upgrades better.
- **Specify the output contract.** Exact format (JSON schema, markdown sections, length bounds),
  and what to do when uncertain (say so, ask, or pick a default — pick one explicitly). Vague
  output specs produce parsing bugs; strict specs produce reliable pipelines.
- **Few-shot examples teach edge cases.** 2–5 examples showing not just the happy path but the
  tricky inputs: ambiguous cases, refusals, format edge cases. Examples are worth more than
  paragraphs of rules — but keep them short and representative of production distribution.
- **Constraints, not essays.** Each rule should be load-bearing. Ten rules get selectively ignored;
  five crisp ones get followed. If two rules can conflict, state the priority order explicitly.
- **Calibrate verbosity and confidence.** Tell the model when to be terse vs thorough, and forbid
  hedging theater ("As an AI…") where decisiveness matters — or require explicit uncertainty where
  overconfidence is dangerous (medical, legal, financial contexts).
- **Prompts are code: version and test them.** Store prompts in files, review changes in diffs,
  and run regression evals before merging prompt changes. "I tweaked the prompt" should be as
  reviewable as "I changed the code."

## Practical workflow

1. **Define success concretely.** What does a good output look like? Write 5–10 input/output pairs
   *by hand* first — these become your golden examples and your eval set.
2. **Draft the minimal prompt.** Role (one line), task, input, output format. Test on the golden
   set before adding anything.
3. **Add examples for failures only.** Run the draft; for each failure mode, decide: add a rule or
   add an example? Prefer examples for pattern-like fixes, rules for hard constraints.
4. **Lock the output format.** Provide a schema or template and one complete example output.
   Validate programmatically (JSON parse, required fields) — never trust vibes.
5. **Build a regression eval.** 20–50 representative inputs with expected behaviors; score
   automatically where possible (format validity, keyword presence, refusal correctness), sample
   manually where judgment is needed. Run it on every prompt change.
6. **Harden for production.** Handle: empty/malicious/oversized inputs, model refusals, truncated
   outputs, and schema violations (retry with a repair prompt, then fall back gracefully). Log
   inputs/outputs (with PII care) to catch drift.

Prompt skeleton:

```text
ROLE: You are <role> for <audience>.
TASK: <one-sentence job>
INPUT: <what the user provides, delimited clearly>
CONSTRAINTS:
- <hard rule 1>
- <hard rule 2> (if conflicts with rule 1, rule 1 wins)
OUTPUT FORMAT:
<exact schema or template>
EXAMPLES:
Input: <tricky case> → Output: <correct handling>
UNCERTAINTY: If <condition>, respond with <fallback> instead of guessing.
```

## Common pitfalls

- **Prompt stuffing.** Adding more rules for every failure until the prompt contradicts itself.
  When the prompt exceeds ~15 rules, split the task or move logic into code.
- **Testing on three examples.** A prompt that works on your hand-picked demos and fails on real
  input distribution. Your eval set must resemble production, including the ugly inputs.
- **Fragile formatting tricks.** Relying on exact whitespace, magic phrases, or model-specific
  quirks. Prefer explicit structure; re-verify after model upgrades.
- **No output validation.** Parsing model output with hope. Validate shape, retry on violation,
  and have a deterministic fallback — the pipeline must survive a weird Tuesday.
- **Letting the model do what code should do.** Math, counting, sorting, exact string transforms,
  calling APIs — give the model tools or do it in code; don't ask it to simulate computation.
- **Ignoring the failure modes.** No plan for refusals, truncation, or injection in user input.
  Production prompts need the same error handling as production code.
- **One giant prompt for a multi-step job.** Long chains of reasoning in a single prompt drift.
  Decompose into steps with intermediate validation — each step's output checked before the next.
