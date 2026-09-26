---
name: quantization
description: Quantize models for efficient inference — precision formats, calibration, accuracy validation, and hardware considerations. Use when models are too big, slow, or expensive to serve at full precision.
category: ai-research
---

# Model Quantization

Quantization shrinks models by representing weights (and activations) in fewer bits — 16-bit to 
8-bit to 4-bit — cutting memory, speeding inference, and lowering cost. Modern methods preserve 
quality remarkably well, but the details matter.

## Overview

The trade: fewer bits per weight means smaller, faster models with some precision loss. 
Post-training quantization (PTQ) converts an existing model without retraining — fast and usually 
sufficient. Quantization-aware training (QAT) trains with quantization simulated — better 
quality, more effort. Weight-only quantization shrinks memory (the common bottleneck); 
weight+activation quantization also speeds compute. Calibration data tunes the quantization ranges 
— use representative data.

## When to use

- Serving large models on limited GPUs or CPUs.
- Reducing inference cost and latency in production.
- Deploying to edge devices or laptops.
- Anytime memory bandwidth (not compute) is the bottleneck — which is most LLM serving.

## Core concepts

- **Precision formats**: FP16/BF16 (near-lossless baseline), INT8 (2× smaller, minimal loss with 
care), INT4 (4× smaller, needs good methods), mixed precision (sensitive layers kept higher).
- **PTQ vs QAT**: post-training is fast and works well down to 8-bit and often 4-bit for weights; 
QAT recovers quality at aggressive precisions but requires training.
- **Weight-only vs weight+activation**: quantizing weights cuts memory (usually the binding 
constraint); quantizing activations too speeds compute but is more quality-sensitive.
- **Calibration**: a small representative dataset sets quantization ranges. Bad calibration data 
→ bad quantization. Match your deployment distribution.
- **Granularity**: per-tensor, per-channel, or per-group quantization. Finer granularity preserves 
quality at low bit-widths; group-wise is the modern sweet spot.
- **Quality validation**: perplexity plus downstream task evals. Some capabilities (long-context 
reasoning, rare tokens) degrade before average metrics show it.

## Practical workflow

1. Profile the bottleneck: memory capacity, memory bandwidth, or compute? Quantize accordingly.
2. Start with weight-only 8-bit or 4-bit PTQ — the best effort-to-gain ratio.
3. Calibrate on representative data from your actual workload, not generic text.
4. Validate quality: perplexity + task evals + targeted tests (long context, math, rare knowledge).
5. If quality drops unacceptably: try finer granularity, keep sensitive layers at higher precision, 
or step up one bit-width.
6. Benchmark end-to-end: tokens/sec, latency, and memory on your hardware — theoretical gains 
don't always materialize.

```text
Quantization decision path:
Memory-bound serving? → weight-only INT4/INT8 PTQ
Need max quality?     → INT8, or mixed precision
Quality dropped?      → finer granularity → higher bits for sensitive layers → QAT
Always: calibrate on YOUR data, validate on YOUR tasks
```

## Common pitfalls

- **Generic calibration data**: calibrating on web text for a code assistant. Match the deployment 
distribution.
- **Average-metric validation**: perplexity looks fine while long-context reasoning silently 
degrades. Test capabilities, not just averages.
- **Ignoring the hardware**: a format your GPU doesn't accelerate may run slower than FP16. Match 
format to hardware support.
- **Over-quantizing**: pushing to 4-bit or below everywhere for marginal gains while quality 
bleeds. Step down gradually.
- **No baseline comparison**: quantizing without measuring the FP16 original on your evals. You 
need the delta.
- **Activation quantization by default**: it's the quality-sensitive one. Start weight-only; add 
activation quantization deliberately.
