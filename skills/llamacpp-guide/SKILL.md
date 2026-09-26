---
name: llamacpp-guide
description: Run and optimize models with llama.cpp — GGUF quantization, CPU/GPU offloading, server mode, and performance tuning. Use when you need maximum local inference efficiency or cross-platform deployment.
category: ai-research
---

# llama.cpp Guide

llama.cpp is the portable inference engine: C++-based, runs everywhere from phones to servers, with 
the best CPU inference in the business and broad GGUF model support. It's the power tool behind 
most serious local LLM setups.

## Overview

The mental model: models in GGUF format (quantized variants from 2-bit to 8-bit), an engine that 
splits work between CPU and GPU layers, and two interfaces — a CLI for direct use and a server 
mode exposing an OpenAI-compatible API. Performance comes from tuning thread counts, batch sizes, 
and GPU offloading to your specific hardware. It's lower-level than packaged runners, which means 
more control and more knobs.

## When to use

- Maximum local performance: squeezing the most tokens/sec from your hardware.
- CPU-only inference where other engines struggle.
- Cross-platform deployment: same engine on Mac, Linux, Windows, even mobile.
- Fine-grained control: custom quantization, speculative decoding, grammar-constrained output.

## Core concepts

- **GGUF format**: the model container — architecture, weights, and metadata in one file, with 
quantization variants (Q4_K_M is the popular sweet spot). Choose the largest quant that fits your 
RAM.
- **GPU offloading**: layers assigned to GPU (`-ngl`) vs. CPU. Full offload when VRAM fits; partial 
offload still beats CPU-only. More offloaded layers = faster.
- **Threading and batching**: CPU thread count matched to your cores (physical, not hyperthreaded, 
usually); batch size tuned for prompt processing vs. generation.
- **Server mode**: HTTP server with OpenAI-compatible endpoints — the integration point for apps 
and agents. Supports concurrent requests with continuous batching.
- **Context management**: context size set at load (`-c`); KV cache quantization to stretch long 
contexts into limited RAM.
- **Advanced features**: speculative decoding (draft model proposes, main model verifies — big 
speedups), grammar-constrained generation (JSON mode via grammars), multimodal support.

## Practical workflow

1. Pick the GGUF quant: largest that fits comfortably in RAM (leave headroom for context/KV cache).
2. Benchmark your hardware: try full GPU offload first; fall back to partial; tune thread count 
(start at physical core count).
3. Set context size for your use case; enable KV cache quantization if context is the constraint.
4. Run server mode for app integration; test concurrent requests and streaming.
5. Tune batch parameters for your workload: prompt-heavy (bigger batches) vs. generation-heavy 
(smaller).
6. Consider speculative decoding with a small draft model for interactive latency wins.

```text
Tuning order (biggest wins first):
1. GPU offload: max layers that fit VRAM
2. Quant choice: biggest that fits RAM
3. Threads: physical core count (CPU-bound parts)
4. Speculative decoding: small draft model
5. Batch/context knobs for your workload mix
```

## Common pitfalls

- **Wrong thread count**: too many threads on hyperthreaded cores can slow things down. Start with 
physical cores.
- **Quant too aggressive**: Q2 fits but quality suffers. Q4_K_M is the default for a reason — 
deviate deliberately.
- **Ignoring KV cache**: long contexts eat RAM beyond the model weights. Budget for it or quantize 
the cache.
- **No GPU offload configured**: running full CPU when a GPU sits idle. Check offload actually 
engaged.
- **Server defaults for production**: default concurrency and timeouts are demo settings. Tune for 
your load.
- **Model-architecture mismatch**: not every GGUF file works with every build. Match the engine 
version to the model format.
