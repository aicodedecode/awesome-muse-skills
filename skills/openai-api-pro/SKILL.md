---
name: openai-api-pro
description: OpenAI API guidance — chat/completions, function calling, structured outputs, embeddings, assistants, and cost control.
category: development
---

## Overview

The OpenAI API is the reference LLM API: chat completions, structured outputs, function calling, embeddings, image/audio models, and batch processing. The patterns here — message roles, JSON mode, tool definitions, streaming — transfer to most other providers, so fluency with this API pays beyond OpenAI itself.

This skill covers using the API well: message construction, structured outputs, function calling, embeddings, the right model for the job, and the cost/latency controls that keep bills sane.

## When to use

- Calling the OpenAI API (chat, structured outputs, tools).
- Designing function-calling / tool-use integrations.
- Getting reliable JSON from the model.
- Choosing models (flagship vs mini vs reasoning).
- Controlling cost and latency.
- Using embeddings for search/RAG.
- Migrating between OpenAI and compatible APIs.

## Core concepts

- **Messages API.** `system` / `user` / `assistant` (+ `tool`) roles; conversation as a message list. System prompts set behavior; keep them focused — one job per system prompt beats a constitution.
- **Model selection.** Flagship (hardest reasoning), mini (cheap/fast for simple tasks), reasoning models (o-series — for math/code/logic with visible effort). Right-size per task: classify with mini, reason with flagship. The cost spread is 10-100x.
- **Structured outputs.** `response_format` with JSON schema (strict mode) — guaranteed schema-conforming JSON. For anything downstream parses, structured outputs beat "please return JSON" prompting.
- **Function calling / tools.** `tools` array with JSON-schema parameters; the model returns `tool_calls`, you execute and return results. Tools are how LLMs act — design them like APIs: clear names, descriptions, narrow scope.
- **Streaming.** `stream: true` — tokens as they're generated; essential UX for chat (perceived latency), plus early cancellation. Handle tool-call streaming's chunked-argument assembly.
- **Embeddings.** `text-embedding-3-*` — `large` for quality, `small` for cost; `dimensions` parameter for truncated vectors (Matryoshka — shorter vectors, minimal quality loss). Normalize for cosine similarity; batch inputs.
- **Temperature/top_p.** Temperature 0 for deterministic tasks (classification, extraction); higher for creative. `top_p` as the alternative sampler — tune one, not both.
- **Reasoning effort.** For o-series: `reasoning_effort` (low/medium/high) trades tokens for thought — low for quick checks, high for hard problems. Don't pay for deep reasoning on shallow tasks.
- **Batch API.** 50% discount for non-urgent workloads (24h turnaround) — embeddings backfills, evaluations, bulk classification. The easiest cost win for offline work.
- **Caching.** Prompt caching (automatic on long prefixes) — repeated system prompts + context cost a fraction after the first call. Structure prompts with stable prefixes to maximize cache hits.
- **Rate limits and retries.** Tiered RPM/TPM; exponential backoff with jitter on 429s; request timeouts. The API is a shared resource — design clients that degrade gracefully.
- **Safety.** Moderation endpoint for user content, instruction hierarchy (system > developer > user), no secrets in prompts, PII awareness. Validate tool outputs before acting on them.
- **Assistants API (awareness).** The stateful assistants abstraction exists but the ecosystem has moved toward self-managed threads + tools — know it exists, prefer explicit control for new builds.
- **Evals.** Model-graded and deterministic evals on golden sets — run before every prompt/model change. The API makes it easy to call models; evals make it safe to change them.
- **Multimodal endpoints.** Image generation/editing, Whisper transcription, TTS speech, image inputs for vision — beyond text; audio models power voice interfaces.
- **Fine-tuning.** Supervised fine-tuning for consistent style/format on narrow tasks — when prompting plateaus; needs evals, and doesn't reliably inject new knowledge.

## Practical workflow

1. **Start with the right model.** Prototype on flagship, then distill: can mini handle it with a better prompt? Measure quality, not vibes.
2. **Structure the messages.** Focused system prompt, clear user message, examples where format matters:
   ```python
   response = client.chat.completions.create(
       model="gpt-4.1-mini",
       messages=[
           {"role": "system", "content": "Extract invoice fields. Return JSON only."},
           {"role": "user", "content": invoice_text},
       ],
       response_format={"type": "json_schema",
                        "json_schema": {"name": "invoice", "strict": True,
                                        "schema": Invoice.model_json_schema()}},
       temperature=0,
   )
   ```
3. **Use structured outputs.** JSON schema strict mode for all machine-consumed output; Pydantic models as the schema source; validate anyway.
4. **Design tools carefully.** Narrow functions, precise descriptions, typed parameters; execute server-side; return concise results (token-efficient tool outputs).
5. **Stream to users.** `stream=True` for interactive paths; assemble tool-call arguments from chunks correctly.
6. **Batch the offline work.** Batch API for evaluations, backfills, bulk jobs — half price for patience.
7. **Control costs.** Token logging per request, budgets and alerts, prompt caching via stable prefixes, right-sized models, max_tokens limits.
8. **Evaluate changes.** Golden dataset + model-graded evals in CI; every prompt or model change runs the suite before shipping.

## Common pitfalls

- **Flagship for everything** — 50x cost for tasks mini handles; right-size per task.
- **Unstructured JSON prompting** — "return JSON" without schema; strict structured outputs.
- **Temperature > 0 for extraction** — nondeterministic structured tasks; temperature 0.
- **No retries/backoff** — 429s crashing clients; exponential backoff with jitter.
- **Ignoring prompt caching** — unstable prompt prefixes; stable long prefixes for cache hits.
- **Batch API unused** — paying full price for offline work; 50% off for 24h turnaround.
- **Tool sprawl** — dozens of vague tools; narrow, well-described, few.
- **No evals** — prompt changes by feel; golden sets + graded evals.
- **Secrets in prompts** — API keys in context sent to third parties; scrub and scope.
- **Streaming mishandled** — broken tool-call assembly; handle chunked arguments.
- **No token logging** — surprise bills; log and budget per request/feature.
- **Reasoning overkill** — high effort on trivial tasks; match effort to difficulty.
- **Embedding without normalization** — cosine on unnormalized vectors; normalize (or use dot-product-aware stores).
