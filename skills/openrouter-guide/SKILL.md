---
name: openrouter-guide
description: Access hundreds of models through one API with OpenRouter — routing, fallbacks, and unified billing for LLM apps.
category: ai-research
---

## Overview

OpenRouter is a unified API gateway for language models: one API key, one
OpenAI-compatible interface, and access to hundreds of models from dozens of
providers — commercial labs, open-model hosts, and community fine-tunes. You
send requests specifying a model (or a routing preference), and OpenRouter routes
to the underlying provider, handling the per-provider differences. Billing is
unified: pay-per-token across all models on one account.

The strategic value is optionality. You can benchmark twenty models on your task
in an afternoon, switch providers when one has an outage or raises prices, and
use cheap models for easy work and frontier models for hard work — all without
integrating N vendor SDKs. For evaluation, experimentation, and multi-model
products, it's the fastest way to get broad model access.

OpenRouter is a marketplace and router, not a model lab. Your relationship is
with the gateway; the models remain the providers' — which matters for data
policies and terms.

## When to use

- Evaluating many models on your task quickly (benchmark across providers with
  one integration).
- Products that let users choose models, or that route between models by task
  difficulty/cost.
- Fallback routing: if your primary provider is down, fail over to equivalents
  automatically.
- Accessing models whose providers you don't want to integrate directly (niche
  fine-tunes, new labs).
- Prototyping before committing to a provider contract or direct integration.
- Unified billing across an experimental multi-model workload.

## Core concepts

- **Unified API**: OpenAI-compatible endpoints — `model` namespaced by provider
  (e.g., `provider/model`). Existing OpenAI client code usually works with a base
  URL and key swap.
- **Model catalog**: hundreds of models with per-model pricing, context lengths,
  and provider info. New models appear quickly; check availability and pricing
  per model before building on it.
- **Routing and fallbacks**: request a specific model, or specify fallback
  ordering so failures route to alternates. Configure fallbacks for production —
  single-model requests inherit that provider's outages.
- **Per-request provider preferences**: pin providers, require specific data
  policies, or sort by price/latency/throughput. Use these to express what
  matters (cost vs. speed vs. data handling).
- **Unified billing and rate limits**: one balance, per-model token pricing
  (often with provider margin). Rate limits vary by model and account tier —
  load-test the models you depend on.
- **Data policies**: providers differ in whether they train on or log request
  data. OpenRouter surfaces provider data policies; for sensitive data, filter to
  providers with acceptable terms.
- **Free models tier**: some models offer free endpoints (rate-limited) — useful
  for development and evaluation, not for production SLOs.
- **Activity/usage tracking**: per-request logging of model, tokens, and cost.
  Essential for multi-model cost attribution.

## Practical workflow

1. **Define your model shortlist.** Start from task requirements (reasoning
   depth, context length, structured output, latency) and pick candidate models
   across price tiers — include cheap and frontier options.
2. **Benchmark on your task.** Same prompts, same eval set, multiple models via
   the one API. Record quality, latency, and cost per task — the three axes that
   decide.
3. **Choose routing logic.** Simplest robust pattern: primary model + ordered
   fallbacks. More advanced: route by task difficulty (classifier or heuristic)
   to cheap vs. strong models.
4. **Set provider preferences.** For production traffic, express data-policy
   requirements and sort preferences (e.g., prefer lowest latency among
   acceptable providers).
5. **Implement fallbacks and retries.** Handle model-level failures (provider
   outage, rate limit) by falling back; handle request-level transient errors
   with bounded retries.
6. **Track cost per model.** Attribute spend by model and route. Multi-model
   setups drift — a fallback firing constantly or a router misclassifying shows
   up in the cost breakdown first.
7. **Re-benchmark periodically.** The catalog changes fast; new models regularly
   beat old price/performance points. Schedule re-evaluation, not just
   set-and-forget.

Checklist for production on OpenRouter:
- Fallback ordering configured for every critical model.
- Data policies reviewed for providers in the routing set.
- Cost attribution per model/route in place.
- Rate limits load-tested for production traffic.
- Re-benchmark cadence scheduled.

## Common pitfalls

- **No fallbacks in production.** A provider outage becomes your outage. Always
  configure ordered fallbacks for critical paths.
- **Ignoring data policies.** Routing sensitive prompts through providers that
  log or train on data. Check policies per provider in your routing set.
- **Price-only routing.** The cheapest model that "works" in a demo often fails
  on edge cases. Route on measured task quality, with cost as a secondary axis.
- **Model availability churn.** Models get deprecated or providers leave. Pin
  versions where possible and monitor for deprecation notices.
- **Free-tier dependence.** Building production on rate-limited free endpoints.
  Free tiers are for evaluation; production needs paid capacity.
- **Untracked multi-model spend.** Ten models × unclear attribution = surprise
  bills. Tag requests and review per-model cost regularly.
- **Latency variance.** Routing across providers means latency varies by provider
  and load. Measure p95/p99 per route, not just averages.
- **Assuming identical behavior.** Same model name via different providers can
  differ (quantization, system handling, version). Validate the actual endpoint
  you route to.
