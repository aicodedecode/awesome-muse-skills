---
name: ollama-local
description: Run LLMs locally — model selection, setup, quantization choices, API usage, and practical local workflows. Use when you want private, offline, or cost-free model inference on your own machine.
category: ai-research
---

# Local LLM Inference

Running models on your own machine gives you privacy (data never leaves), zero per-token cost, and 
offline capability — at the price of smaller models and your hardware's limits. This skill covers 
making local inference genuinely useful.

## Overview

Local runners package model downloading, quantization, and serving into one tool: pull a model, run 
it, query via CLI or API. The practical art is matching model size and quantization to your 
RAM/VRAM, choosing models by task (chat, code, embeddings each have strengths), and knowing when 
local is enough vs. when you need a frontier API.

## When to use

- Privacy-sensitive work: proprietary code, personal data, confidential documents.
- Offline or air-gapped environments.
- High-volume low-stakes tasks where API costs would dominate: classification, extraction, drafting.
- Development and experimentation without per-token billing anxiety.

## Core concepts

- **Model sizing**: parameters ÷ quantization ≈ memory needed. A 7B model at 4-bit needs ~5GB; 
70B needs ~40GB+. Fit the model to your hardware, not your ambition.
- **Quantization levels**: smaller quants (4-bit) fit bigger models in less RAM with modest quality 
loss; larger quants preserve quality for smaller models. The standard trade.
- **Model selection**: different models excel at different tasks — chat, instruction-following, 
code, multilingual. Match the model to the job; test 2–3 candidates on your tasks.
- **Local API**: most runners expose an OpenAI-compatible endpoint — point your existing code at 
localhost and swap models freely.
- **System prompts and parameters**: temperature, context length, and system instructions work the 
same locally. Tune per model — defaults vary.
- **When to escalate**: hard reasoning, long-context synthesis, cutting-edge knowledge — local 
models have limits. Design workflows that escalate tough cases to bigger models.

## Practical workflow

1. Check your hardware: available RAM/VRAM sets your model size ceiling.
2. Pull 2–3 candidate models suited to your task; test them on 10 representative examples.
3. Choose quantization: start with the recommended 4-bit; step up if quality matters and RAM allows.
4. Set up the local API endpoint; configure your tools to use it as a drop-in model provider.
5. Tune per model: system prompt, temperature, context window — local models have different sweet 
spots.
6. Build the escalation path: easy cases local, hard cases to a frontier model — with routing 
logic.

```text
Hardware → model guide (4-bit quantized):
~8GB RAM:    7-8B models (chat, simple tasks)
~16GB:       13-14B or small 30B (better quality)
~32GB+:      30-70B (strong local performance)
GPU VRAM:    prefer GPU offload; partial offload still helps
```

## Common pitfalls

- **Oversized models**: pulling a 70B model onto 16GB RAM. It'll crawl or crash — size honestly.
- **One model for everything**: using a chat model for embeddings or code. Task-match your models.
- **Expecting frontier quality**: local 8B models are useful, not magical. Calibrate expectations; 
escalate hard tasks.
- **Default parameters**: every model has different ideal temperature and prompt format. Tune; 
don't assume.
- **No escalation path**: forcing everything through the local model. Hybrid local+API beats either 
alone.
- **Stale models**: the local ecosystem moves fast. Re-evaluate your picks periodically.
