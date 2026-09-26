---
name: gemma-guide
description: Build with Google's Gemma models — lightweight open models from 1B to 27B with permissive terms.
category: ai-research
---

## Overview

Gemma is Google's family of lightweight open models (from 1B to 27B
parameters), built with the research and data behind Gemini and offered with
permissive terms for commercial use. The positioning is efficient open AI:
strong performance per parameter, small enough to run on a laptop (1B–4B) or a
single GPU (12B–27B), with Google's training quality behind them.

For builders, Gemma's niche is the small-but-capable segment: on-device and
edge deployment, cost-efficient API inference, fine-tuning starting points
that train fast, and applications where a 27B model is plenty. The permissive
terms remove licensing friction that complicates some other open families.

The practical stance: when your task fits a small model, Gemma is among the
best small options. Don't use a 70B model for a 9B task.

## When to use

- Small-model tasks: classification, extraction, simple generation, RAG
  components.
- On-device and edge deployment (1B–4B variants).
- Cost-efficient inference where small models suffice.
- Fine-tuning starting points that train quickly and cheaply.
- Distillation targets and student models.
- Prototyping before scaling up model size.

## Core concepts

- **Size range (1B–27B)**: the full ladder from tiny to substantial. Benchmark
  across it — Gemma's quality-per-parameter means smaller sizes go further
  than expected.
- **Permissive terms**: commercial-friendly licensing with fewer complications
  than some open families. Still read the terms for your use case.
- **Instruction-tuned variants**: tuned versions for chat and assistants;
  base versions for fine-tuning foundations. Choose correctly.
- **Efficiency**: strong performance per parameter from Google's training
  investment. This is why Gemma punches above its weight class.
- **Edge deployment**: the small variants target on-device use (phones,
  laptops, browsers). Quantized formats extend the reach further.
- **Multimodal variants**: vision-capable Gemma versions for image+text tasks
  at small scale. Evaluate against larger VLMs on your images.
- **Fine-tuning friendliness**: small sizes train fast on modest hardware —
  practical for teams without large compute budgets.
- **Provider availability**: hosted by major inference providers for easy
  API benchmarking before committing to deployment.

## Practical workflow

1. **Test whether small suffices.** Before reaching for big models: benchmark
   Gemma 9B/27B on your task. Many production tasks don't need more.
2. **Climb down the ladder.** If 27B works, test 9B; if 9B works, test 4B.
   Find the smallest adequate size — the cost and latency savings compound.
3. **Evaluate instruction-tuned variants.** For assistants and chat: test the
   IT versions on your conversational evals.
4. **Consider fine-tuning.** Small models fine-tune fast and cheap. If base
   Gemma is close on your task, a quick fine-tune may close the gap at a
   fraction of big-model costs.
5. **Test edge deployment.** For on-device: quantize, benchmark on target
   hardware, and validate quality after quantization.
6. **Check the terms.** Confirm the license works for your commercial use —
   permissive, but verify.
7. **Monitor the small-model frontier.** This segment moves fast; re-benchmark
   new releases — today's 9B may beat yesterday's 27B.

Checklist for Gemma in production:
- Smallest adequate size found via ladder benchmarking.
- Instruction-tuned vs. base chosen correctly.
- Fine-tuning evaluated where base is close.
- License confirmed; edge deployment validated if applicable.
- New releases re-benchmarked periodically.

## Common pitfalls

- **Size snobbery.** Dismissing small models without testing. Many tasks are
  9B tasks wearing 70B clothes.
- **Skipping the ladder.** Picking 27B without testing 9B. The savings from
  right-sizing are permanent.
- **Wrong variant.** Fine-tuning from instruction-tuned instead of base, or
  deploying base for chat. Match variant to use.
- **Quantization untested.** Assuming quantized small models preserve quality.
  Test on your evals — small models have less redundancy to spare.
- **Ignoring fine-tuning economics.** Small models make fine-tuning cheap —
  don't leave that lever unused when base models are close.
- **Terms assumed.** "Permissive" still has terms. Read them.
- **Static choice.** The small-model segment evolves fastest. Annual
  re-benchmarking at minimum.
- **Over-tasking tiny models.** 1B models are impressive, not magical. Match
  task difficulty to model capacity honestly.
