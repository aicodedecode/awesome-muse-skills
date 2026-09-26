---
name: llama-guide
description: Build with Meta's Llama models — the open-weight ecosystem standard for fine-tuning and deployment.
category: ai-research
---

## Overview

Llama (Meta) is the reference open-weight model family — the ecosystem
standard against which other open models are measured. Each generation
(Llama 2, 3, and beyond) ships dense models across sizes with strong general
performance, and the ecosystem around Llama is unmatched: every inference
provider hosts it, every fine-tuning tool targets it, and the fine-tune
universe (thousands of community variants) is largest for Llama.

For builders, Llama is the default open choice — not always the best on every
benchmark, but the safest: maximum provider support, maximum tooling, maximum
community knowledge, and Meta's continued investment. When you choose Llama,
you're choosing the ecosystem as much as the weights.

The strategic value: fine-tuning infrastructure, deployment options, and
hiring (everyone knows Llama) all favor the standard. Deviate from Llama when
benchmarks on your task justify it, not by default.

## When to use

- Default open-model choice when you want maximum ecosystem support.
- Fine-tuning: the largest tooling and community fine-tune ecosystem.
- Self-hosting with the widest deployment options and guides.
- Applications needing broad provider availability (everyone hosts Llama).
- Multimodal with Llama's vision variants.
- Long-term bets on continued Meta investment and releases.

## Core concepts

- **Model generations and sizes**: each generation spans sizes (e.g., 8B to
  70B+). Newer generations generally dominate older ones — prefer current,
  but benchmark.
- **Ecosystem standard**: providers, tools, and fine-tunes target Llama first.
  This network effect is a feature — deployment friction is lowest here.
- **Community fine-tunes**: thousands of specialized Llama derivatives
  (instruction-tuned, domain-tuned, uncensored, quantized). Evaluate
  candidates on your task — but verify quality and licensing individually.
- **Quantized variants**: GGUF and other quantized formats for local and
  resource-constrained deployment. Quality/size tradeoffs are well documented
  by the community.
- **Llama license**: the community license has specific terms (including
  provisions for very large-scale use). Read it for your situation — it's not
  OSI open source.
- **Instruction-tuned vs. base**: use instruction-tuned variants for chat and
  assistants; base models for fine-tuning starting points. Don't fine-tune
  from chat variants without reason.
- **Vision variants**: multimodal Llama models for image+text tasks. Evaluate
  against dedicated VLMs on your image tasks.
- **Deployment ubiquity**: vLLM, TGI, llama.cpp, every cloud provider —
  Llama runs everywhere. This simplifies migration and multi-provider
  strategies.

## Practical workflow

1. **Pick the generation and size.** Start with the current generation; benchmark
   sizes on your eval set to find the smallest adequate model.
2. **Survey community fine-tunes.** For your task domain, check if a quality
   fine-tune already exists — test it before training your own.
3. **Evaluate quantized options.** If deploying constrained: test quantization
   levels on your eval set. The community has mapped the tradeoffs well.
4. **Read the license.** Confirm the community license terms work for your
   scale and use case — especially the large-scale provisions.
5. **Choose deployment.** Provider API for speed to market; self-hosted
   (vLLM/TGI) for control and volume economics. Llama's ubiquity makes both
   easy.
6. **Fine-tune if needed.** When off-the-shelf variants fall short: fine-tune
   from the base model with your data, using the mature Llama tooling.
7. **Track generations.** New Llama generations reset the price/performance
   curve. Re-evaluate your size and deployment choices on each major release.

Checklist for Llama in production:
- Generation current; size chosen via your evals.
- License terms confirmed for your scale.
- Community fine-tunes surveyed before custom training.
- Deployment chosen (API vs. self-host) on economics.
- Quantization validated if used.

## Common pitfalls

- **Stale generation.** Running Llama 2 when current generations are strictly
  better. Track releases; upgrade deliberately.
- **Defaulting to 70B.** The ecosystem's prestige size isn't always needed.
  Smaller Llama models are capable — benchmark down the ladder.
- **Community fine-tune trust.** Using random fine-tunes without evaluating
  quality, safety, and licensing. The long tail varies wildly.
- **License blindness.** Not reading the community license, especially
  large-scale terms. It's not Apache/MIT — check.
- **Fine-tuning chat variants.** Starting custom training from
  instruction-tuned models when base models are the cleaner foundation.
- **Ignoring quantized deployment.** Running full precision where quantized
  would halve costs with negligible quality loss. Test the tradeoff.
- **Ecosystem complacency.** Choosing Llama by default without benchmarking
  alternatives on your task. The standard is the default, not the mandate.
- **No generation-upgrade plan.** Treating the model choice as permanent.
  Each generation shifts the optimum — revisit.
