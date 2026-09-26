---
name: outlines-library
description: Constrain LLM generation to exact structures with Outlines — regex, JSON schema, and grammar-guided decoding.
category: ai-research
---

## Overview

Outlines controls what a language model is allowed to generate at the token
level. Instead of asking for JSON and hoping, you give Outlines a schema (JSON
schema, regex, or context-free grammar) and it constrains decoding so every
output is valid by construction — invalid tokens are masked out during
generation. The difference from post-hoc validation is fundamental: Outlines
can't produce invalid output, so there's no retry loop, no parse failures, and no
wasted tokens on doomed generations.

This is the right tool when structure is non-negotiable: strict JSON APIs,
domain-specific languages, formatted outputs (dates, codes, enums), and anywhere
downstream code parses the result. It trades some flexibility (constrained
decoding adds per-step overhead and needs logits access, so it works with
local/self-hosted models, not opaque APIs) for a hard guarantee.

The guarantee changes the engineering: downstream code can parse without
try/except, retry budgets drop to zero for format issues, and "the model produced
invalid JSON" disappears as a failure class entirely.

## When to use

- Generating JSON that must validate against a schema — every time, with zero
  retries.
- Domain-specific formats: structured codes, templated text, multiple-choice with
  exact labels.
- High-throughput structured generation where retry loops would be expensive.
- Grammar-constrained tasks: arithmetic expressions, simple DSLs, nested
  structures.
- Replacing brittle "output JSON" prompting with a guarantee.
- Pipelines where a single malformed output breaks the batch.

## Core concepts

- **Constrained decoding**: at each generation step, the allowed token set is
  restricted to tokens that keep some valid completion possible. Implemented via
  finite-state machines (for regex) or pushdown automata (for grammars) compiled
  from your schema.
- **JSON schema mode**: the most common — define the schema, get guaranteed-valid
  JSON. Supports nested objects, arrays, enums, and string patterns. The schema is
  both the constraint and the documentation.
- **Regex mode**: for formatted strings — dates, IDs, phone numbers, fixed
  vocabularies. Lighter than a full schema when you need one patterned field.
- **Grammar mode**: context-free grammars for nested/recursive structures
  (expressions, DSLs). Most expressive; most expensive to compile.
- **Logits access requirement**: Outlines needs to modify the sampling
  distribution, so it runs against models you host (Transformers, vLLM, llama.cpp
  integrations) — not against black-box APIs that hide logits.
- **Few-shot + constraints**: constraints guarantee shape; examples still improve
  content. Combine: constrained decoding for structure, demonstrations for
  quality.
- **Choice mode**: constrain output to one of a fixed set of strings — the
  simplest constraint, ideal for classification with exact labels.
- **Compilation cost**: schemas compile to automata once; complex grammars take
  longer. Compile at startup, not per request.

## Practical workflow

1. **Write the schema first.** JSON schema (or regex/grammar) describing exactly
   the valid output space. Test the schema itself against example valid/invalid
   outputs before involving the model.
2. **Choose the integration.** Pick the backend matching your serving setup (local
   Transformers for dev, vLLM/llama.cpp for production). Verify constrained
   generation works end-to-end on your model.
3. **Prompt for content, constrain for form.** The prompt should focus on what to
   say; the constraint handles how it's shaped. Don't waste prompt tokens
   enforcing format the decoder already guarantees.
4. **Benchmark the overhead.** Constrained decoding adds per-token cost (mask
   computation). Measure tokens/sec with and without constraints at your sequence
   lengths; for huge schemas or deep grammars, consider simplifying.
5. **Test edge cases.** Empty outputs, maximum-length outputs, adversarial prompts
   trying to break the format. The guarantee should hold — verify it rather than
   assuming.
6. **Precompile schemas.** Compile at startup or deploy time, not per request.
   Cache compiled automata for schemas you reuse.
7. **Monitor in production.** Log constraint violations (should be zero) and
   generation latency. A sudden latency spike often means the constraint is
   fighting the model's instincts — a sign the prompt and schema disagree.

Checklist for constrained generation:
- Schema tested against valid/invalid examples independently of the model.
- Backend integration verified on the deployment model.
- Schemas precompiled; compilation cost measured.
- Latency overhead measured and acceptable.
- Prompt focuses on content; format left to the constraint.

## Common pitfalls

- **Over-constrained schemas.** A schema so tight the model can't express the
  answer degrades content quality. Constrain the shape, not the substance.
- **Expecting it to fix bad prompts.** Outlines guarantees valid JSON, not good
  JSON. Content quality still comes from the prompt and the model.
- **Grammar complexity blowup.** Deeply recursive grammars compile to expensive
  automata. Simplify the grammar or accept the latency.
- **Using it with black-box APIs.** Without logits access there's nothing to
  constrain. For API models, use schema-validated retries (Instructor-style)
  instead.
- **Schema/prompt mismatch.** The prompt asks for a summary plus JSON while the
  schema allows only JSON — the model fights the mask, latency spikes, quality
  drops. Align them.
- **No content evaluation.** "100% valid JSON" is not a quality metric. Evaluate
  the values inside, not just the brackets outside.
- **Per-request compilation.** Compiling the automaton on every call. Precompile
  once; the per-request cost should be just the masking.
- **Constraint as crutch for bad data.** Forcing structure onto outputs the model
  doesn't understand produces valid-shaped nonsense. Fix understanding first.
