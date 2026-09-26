---
name: instructor-library
description: Get structured, validated outputs from LLMs with Instructor — Pydantic schemas, retries, and reliable JSON extraction.
category: ai-research
---

## Overview

Instructor is a Python library that turns LLM outputs into validated structured
data. You define a Pydantic model describing exactly the shape you want;
Instructor patches your LLM client so responses are parsed and validated against
that schema, with automatic retries when validation fails. Instead of
prompt-engineering JSON out of a model and praying the parse holds, you declare
the schema and let the library enforce it.

The pattern is simple and robust: schema as contract, validation as gate, retries
as recovery. Instructor supports multiple providers and modes (function calling,
JSON mode, markdown code blocks), picking the most reliable mechanism per
provider. It's the default answer to "I need the model to return structured data
I can actually use in code."

Instructor's philosophy: the schema is the prompt. A well-described Pydantic
model teaches the model what you want better than paragraphs of instructions, and
the validator catches what the prompt misses.

## When to use

- Extracting structured data from text: entities, attributes, classifications with
  fields.
- Any LLM-to-code boundary where downstream code consumes the output (APIs,
  databases, pipelines).
- Classification tasks where you want labels plus structured rationales or
  confidences.
- Multi-field generation: summaries with metadata, structured plans, form
  filling.
- Replacing fragile regex/JSON-parse postprocessing with validated schemas.
- Batch extraction jobs where per-item reliability compounds.

## Core concepts

- **Response models**: Pydantic classes defining the output schema. Field types,
  descriptions, and constraints (min/max, patterns, enums) all become instructions
  to the model and validation rules on the output. Descriptions are prompt
  engineering — write them for the model.
- **Modes**: function-calling mode (most reliable where supported), JSON mode,
  and fallback parsing modes. Instructor abstracts the provider differences;
  choose the strictest mode your provider supports.
- **Automatic retries**: when validation fails, Instructor re-asks with the error
  message included, up to a configured limit. This converts most malformed outputs
  into valid ones without your code handling it.
- **Streaming and partials**: for long outputs, stream partial objects as they're
  generated. Useful for UX (progressive display) and for failing fast on doomed
  generations.
- **Validation as prompt**: Pydantic validators (e.g., "end_date must be after
  start_date") run on model output and their error messages go back to the model
  on retry — the model learns the constraint from its own failure.
- **Batch and async**: first-class async support for high-throughput extraction.
  Structure your extraction as concurrent validated calls, not sequential hope.
- **Field descriptions as instructions**: each description should say what the
  field means, give an example value, and state constraints. This is the
  highest-leverage prompt content in structured extraction.
- **Nested models**: compose complex schemas from smaller Pydantic models. Keeps
  schemas readable and lets you reuse sub-schemas across tasks.

## Practical workflow

1. **Design the schema.** Write the Pydantic model: fields, types, descriptions,
   constraints. Keep it as small as the use case allows — every field is a chance
   for the model to err.
2. **Write field descriptions for the model.** Each description should say what
   the field means and give an example value. This is the highest-leverage prompt
   content in structured extraction.
3. **Pick the mode.** Function-calling where available; JSON mode otherwise. Test
   that the mode is actually supported by your provider+model combo.
4. **Set retries sensibly.** 2–3 retries with the validation error fed back. More
   retries rarely fix systematic schema misunderstandings — those need schema or
   prompt fixes.
5. **Handle the residual failures.** Even with retries, some outputs won't
   validate. Decide: fall back to a default, escalate to human review, or fail
   loudly. Never silently accept unvalidated data.
6. **Evaluate extraction quality.** On a labeled sample: field-level accuracy, not
   just "valid JSON." A schema-valid output with wrong values is worse than a
   parse error — it's silently wrong.
7. **Load-test the pattern.** Structured extraction at volume: measure latency,
   retry rates, and cost per successful extraction. High retry rates signal schema
   problems, not bad luck.

Checklist for production structured output:
- Schema minimal and precisely described per field.
- Retry count set; residual-failure policy defined.
- Field-level accuracy measured on labeled data.
- Unvalidated outputs never flow silently downstream.
- Retry rate monitored (spikes indicate schema drift).

## Common pitfalls

- **Schemas too ambitious.** Asking for 30 fields in one call degrades every
  field's accuracy. Split into multiple focused extractions.
- **Vague field descriptions.** "summary: str" gets you whatever the model feels
  like. "summary: one sentence, no quotes, under 200 characters" gets you that.
- **Trusting validity as correctness.** Validation checks shape, not truth. A
  valid-but-hallucinated extraction needs content-level evaluation.
- **Retry storms.** High retry counts on a systematically misunderstood schema
  burn money and latency. If retry 1 usually fails, fix the schema.
- **No fallback policy.** The 1% that never validates will happen in production.
  Decide up front what happens — don't let it throw in the request path unhandled.
- **Provider mode mismatch.** Assuming function calling works identically
  everywhere. Verify per provider; behavior differs in edge cases.
- **Nested schema overload.** Deeply nested schemas with dozens of fields in one
  call. Flatten or split — the model's accuracy degrades with schema complexity.
- **Ignoring retry-rate signals.** A rising retry rate in production means the
  model, the data, or the schema changed. Alert on it; don't just absorb the
  cost.
