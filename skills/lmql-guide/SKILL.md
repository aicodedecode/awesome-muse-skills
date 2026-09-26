---
name: lmql-guide
description: Write LMQL queries that blend prompts with constraints — scripting language-model generation with logic.
category: ai-research
---

## Overview

LMQL (Language Model Query Language) is a programming language for interacting
with LLMs that unifies prompting and constrained generation. You write queries
that look like Python with embedded prompt strings, and LMQL adds two superpowers:
declarative constraints (`where` clauses that restrict what the model may
generate, enforced during decoding) and scripting control flow (loops, branches,
and function calls around model queries). A query can say "generate a list of
three cities where each is a valid capital and no city repeats" — and the
constraint is enforced token-by-token, not checked after the fact.

Think of it as SQL for language models: you declare what you want, including
logical conditions on the output, and the runtime figures out how to guide
generation to satisfy them. It's most at home in research and complex
structured-generation tasks where the output must satisfy checkable properties.

LMQL's niche: the intersection of programmability and constraint enforcement. If
you need either alone, simpler tools exist; if you need both in one language,
LMQL is the answer.

## When to use

- Structured generation with logical constraints: "generate N items with property
  P, all distinct, in format F."
- Multi-step prompt programs where later queries depend on earlier results
  (LMQL's scripting handles this natively).
- Research on constrained decoding and prompt programming — LMQL exposes the
  machinery.
- Tasks mixing retrieval/computation with generation in one script.
- When prompt + post-hoc validation keeps failing on constraint satisfaction and
  you want the constraint enforced during generation.
- Prototyping constrained-generation ideas before committing to a production
  stack.

## Core concepts

- **Queries as programs**: `query` blocks contain prompt strings with holes
  (`{variable}`) filled by model generation, plus ordinary Python code around
  them. The model call is an expression in a larger program.
- **`where` constraints**: boolean conditions on generated variables, enforced
  during decoding via token masking. Only conditions the runtime can check
  incrementally are enforceable — keep constraints simple and token-local where
  possible.
- **Distribution clauses**: `sample`/`argmax` control decoding strategy per query.
  Use argmax for deterministic extraction, sampling for creative generation.
- **Control flow**: loops over generations ("keep generating until valid"),
  branches on model outputs, and Python functions for pre/post-processing. This
  makes LMQL a full prompt-programming environment, not just a constraint layer.
- **Decoding integration**: LMQL hooks into the model's logits (it runs against
  models you host, typically via Hugging Face Transformers). Like Outlines, it
  needs logits access — no black-box APIs.
- **FollowMaps and partial evaluation**: advanced machinery for efficiently
  enforcing constraints without enumerating the vocabulary at every step. You
  mostly benefit automatically, but knowing it exists explains why some
  constraints are cheap and others slow.
- **Decoders**: pluggable decoding strategies per query. Match the decoder to the
  query's purpose — deterministic for extraction, stochastic for exploration.
- **Python interop**: arbitrary Python runs between and around queries. The
  pragmatic rule: put logic in Python, generation in queries, constraints in
  `where` — don't force everything into one layer.

## Practical workflow

1. **Express the task as query + constraints.** Write the prompt with holes for
   each generated piece; write the validity conditions as `where` clauses. If a
   condition can't be phrased simply, consider checking it in Python after
   generation instead.
2. **Start unconstrained, then add constraints.** Get the query producing good
   content first; then add `where` clauses one at a time, verifying each doesn't
   tank quality or explode latency.
3. **Choose decoding per query.** Deterministic (argmax) for extraction and
   classification; sampling for diverse generation. Set temperature deliberately
   per query, not globally.
4. **Script the surrounding logic.** Use LMQL's Python integration for retries,
   aggregation over samples, and calling tools — keep the query blocks focused on
   generation.
5. **Profile constraint cost.** Complex constraints slow decoding. If a query gets
   sluggish, simplify the constraint or move the check to post-generation
   validation.
6. **Test constraint satisfaction empirically.** Generate a few hundred outputs and
   check constraint compliance plus content quality. The theory says constraints
   hold; verify on your model and schema.
7. **Decide what stays in LMQL.** Prototype in LMQL; for production, keep it where
   its constraints earn their keep, and move stable parts to simpler stacks.

Checklist for an LMQL program:
- Each `where` clause verified to actually constrain (not silently ignored).
- Decoding strategy chosen per query.
- Latency measured with constraints on.
- Fallback for queries that can't satisfy constraints within budget.
- Production role decided (prototype vs. deployed component).

## Common pitfalls

- **Unenforceable constraints.** Conditions requiring global knowledge (e.g., "the
  whole essay must argue position X") can't be masked token-by-token. Enforce
  what's local; validate what's global afterward.
- **Constraint vs. content tension.** Heavy constraints can strangle generation
  quality — the model satisfies the letter of the constraint with degenerate
  content. Read actual outputs.
- **Black-box API expectations.** LMQL needs logits access. Pointing it at an
  opaque API won't work — use it with hosted models.
- **Over-scripting.** LMQL can express arbitrary programs, but a 200-line query
  script is harder to debug than a Python program calling a simpler generation
  library. Use LMQL where its constraints earn their keep.
- **Ignoring the Python escape hatch.** Not everything belongs in `where`.
  Post-generation Python checks are sometimes cheaper and clearer than
  decoding-time constraints.
- **Version/model sensitivity.** Constraint behavior can shift with model
  versions. Pin the model for production queries and re-verify after upgrades.
- **Constraint interaction bugs.** Multiple `where` clauses can interact in
  surprising ways (one making another unsatisfiable). Add constraints incrementally
  and test the combination.
- **No timeout on constrained search.** A nearly-unsatisfiable constraint can make
  decoding crawl. Bound the effort; fall back gracefully.
