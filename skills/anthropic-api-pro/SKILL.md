---
name: anthropic-api-pro
description: Anthropic Claude API guidance — messages API, tool use, prompt caching, extended thinking, and production patterns.
category: development
---

## Overview

The Anthropic API exposes Claude models via the Messages API: a clean messages-in, message-out interface with best-in-class tool use, prompt caching (the cost story for long contexts), and extended thinking for hard reasoning. Claude's strengths — careful instruction-following, long-context handling, and reliable tool calling — shape how you should use it.

This skill covers the Messages API properly: message construction, tool use patterns, prompt caching for cost control, extended thinking, and production practices.

## When to use

- Calling the Claude Messages API.
- Implementing tool use (function calling).
- Reducing costs with prompt caching.
- Using extended thinking for complex reasoning.
- Streaming responses with tool use.
- Choosing between Claude models (Opus/Sonnet/Haiku).
- Migrating from OpenAI-style APIs.

## Core concepts

- **Messages API.** `POST /v1/messages`: `model`, `max_tokens` (required), `system`, `messages` (user/assistant turns). Stateless — you manage conversation history. Clean and explicit; no legacy baggage.
- **Model tiers.** Opus (frontier capability), Sonnet (the workhorse — intelligence per dollar), Haiku (fast/cheap for simple tasks). Sonnet is the default choice; Opus for the hardest problems; Haiku for high-volume simple work.
- **System prompts.** Separate `system` parameter (not a message) — supports caching and keeps instruction hierarchy clean. Long, detailed system prompts are where Claude shines; invest in them.
- **Tool use.** `tools` with JSON-schema `input_schema`; the model returns `tool_use` blocks, you return `tool_result` blocks. Claude's tool calling is among the most reliable — but tool design still matters: clear names/descriptions, narrow scope, useful errors.
- **Forced tool choice.** `tool_choice: {"type": "tool", "name": "..."}` forces a specific tool; `{"type": "any"}` requires some tool; `auto` lets the model decide. Force tools when the workflow demands it (extraction, classification).
- **Prompt caching.** Mark stable prefixes (system prompt, long context, few-shots) with `cache_control: {"type": "ephemeral"}` — cache writes cost extra once, reads cost ~90% less. The economics of long-context RAG/agents depend on this. Structure prompts: stable content first, varying query last.
- **Extended thinking.** `thinking: {"type": "enabled", "budget_tokens": N}` — the model reasons in a separate thinking block before answering; interleaved thinking with tools for agentic reasoning. Budget thinking tokens like any other cost; expose summaries, not raw traces, to users.
- **Streaming.** SSE streams with `message_start`, `content_block_delta`, `message_stop` events; thinking blocks and tool-use JSON stream as deltas. Assemble carefully — tool input JSON arrives in pieces.
- **Temperature.** Same semantics as elsewhere; 0-1 range typical. Low for deterministic work; the default 1 is fine for open-ended.
- **Long context.** 200K+ token windows — Claude handles long contexts well, but "can" ≠ "should": retrieval + caching usually beats stuffing everything in. Cache the stable corpus, vary the question.
- **Vision.** Image inputs (base64 or URL) in message content blocks — document understanding, screenshots, diagrams. Downscale huge images; multi-image reasoning works but costs.
- **Batch API.** 50% discount for async workloads — evaluations, bulk processing. Same pattern as elsewhere: patience pays.
- **Headers and versioning.** `anthropic-version` header pins the API version; `x-api-key` auth. Pin versions in production; test upgrades deliberately.
- **Error handling.** 429 (rate limit — backoff), 529 (overloaded — retry), 400 (invalid request — fix the payload), credit balance errors. Distinguish retryable from fatal.
- **Safety.** Claude's constitutional training helps, but validate outputs for consequential actions; human-in-the-loop for irreversible tool calls; no sensitive data beyond your threat model.

## Practical workflow

1. **Pick the tier.** Sonnet default; Haiku for volume/simple; Opus for frontier difficulty. Measure, don't assume.
2. **Write a strong system prompt.** Detailed, structured, with the stable context up front for caching:
   ```python
   response = client.messages.create(
       model="claude-sonnet-4-5",
       max_tokens=1024,
       system=[
           {"type": "text", "text": SYSTEM_PROMPT,
            "cache_control": {"type": "ephemeral"}},
           {"type": "text", "text": long_reference_doc,
            "cache_control": {"type": "ephemeral"}},
       ],
       messages=[{"role": "user", "content": question}],
       temperature=0,
   )
   ```
3. **Cache aggressively.** System prompt + reference docs + few-shots as cached prefixes; only the final user message varies. Watch the cache hit rate in usage stats.
4. **Design tools well.** JSON schemas with descriptions; `tool_choice` forced where the workflow requires; handle `tool_use` → execute → `tool_result` loop, with iteration caps.
5. **Use thinking for hard problems.** Enable with a token budget on reasoning-heavy tasks; stream thinking summaries for UX; keep raw traces internal.
6. **Stream everything interactive.** SSE with proper delta assembly for text, thinking, and tool JSON.
7. **Batch offline work.** 50% off for non-urgent bulk jobs.
8. **Monitor and evaluate.** Token usage by cache status (creation vs hits), latency, tool-call success rates; evals on every prompt change.

## Common pitfalls

- **No prompt caching** — paying full price on repeated long contexts; cache stable prefixes (90% read discount).
- **Unstable prompt order** — varying content before stable content breaks caching; stable first, query last.
- **Wrong tier** — Opus for trivial tasks or Haiku for hard reasoning; match tier to difficulty.
- **Thinking without budget discipline** — unbounded reasoning tokens; budget explicitly.
- **Exposing raw thinking** — internal reasoning traces to users; summaries instead.
- **Tool result mishandling** — wrong block structure in multi-turn tool loops; follow the tool_use/tool_result contract exactly.
- **Streaming assembly bugs** — partial tool JSON; accumulate deltas correctly.
- **Ignoring `max_tokens`** — it's required; set deliberately per task (and it caps thinking+output).
- **No version pinning** — unpinned `anthropic-version`; upgrades breaking production.
- **Uncapped agentic loops** — tool-use iterations without limits; cap and add circuit breakers.
- **Long-context stuffing** — 200K tokens when retrieval + caching would do; economics matter.
- **No evals on prompt changes** — system prompt edits by feel; golden sets.
- **Secrets in prompts** — beyond your threat model; scope what enters the context.
