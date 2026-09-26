---
name: vllm-serving
description: Serve LLMs at scale with high-throughput inference servers — continuous batching, paged attention, tensor parallelism, and production operations. Use when self-hosting models for many users or high QPS.
category: ai-research
---

# High-Throughput LLM Serving

Serving LLMs efficiently is a systems problem: GPU memory is finite, requests arrive unpredictably, 
and naive serving wastes most of the hardware. Modern inference servers use continuous batching and 
paged memory management to multiply throughput — this skill covers operating them.

## Overview

The key techniques: continuous batching (requests join and leave the batch dynamically instead of 
waiting for fixed batches), paged KV-cache management (memory allocated in blocks, eliminating 
fragmentation), and tensor parallelism (splitting large models across GPUs). Together they raise 
throughput several-fold over naive serving. Your job: configure for your workload, monitor the 
right metrics, and operate reliably.

## When to use

- Self-hosting open models for production traffic.
- Batch inference over large datasets where throughput is cost.
- Low-latency interactive serving with concurrent users.
- Choosing between serving frameworks or sizing GPU infrastructure.

## Core concepts

- **Continuous batching**: the scheduler packs requests at the token level — new requests join 
mid-generation, finished ones leave. Utilization stays high under variable load.
- **Paged KV cache**: the attention key-value cache managed in fixed blocks, like OS virtual 
memory. Kills fragmentation; enables larger batches and longer contexts.
- **Tensor parallelism**: splitting model layers across multiple GPUs for models that don't fit on 
one. Needed for large models; adds communication overhead.
- **Quantization for serving**: weight quantization (FP8/INT8/INT4) shrinks memory, allowing bigger 
batches or smaller GPUs. Pair with the server's supported formats.
- **Scheduling policies**: prioritizing by arrival, deadline, or prefix-sharing. Prefix caching 
(shared system prompts) saves recomputation across requests.
- **Metrics that matter**: time-to-first-token (TTFT), inter-token latency, tokens/sec/GPU, queue 
wait time, and GPU memory utilization. Optimize for your workload's sensitivity.

## Practical workflow

1. Size the deployment: model size + quantization → GPU count and memory headroom for KV cache.
2. Configure: max batch tokens, max sequences, KV cache allocation — start from recommended 
defaults for your GPU, then tune.
3. Load-test with realistic traffic: concurrent users, real prompt-length distribution. Measure 
TTFT, latency, throughput.
4. Tune the knobs that matter: batch sizes for throughput, parallelism for large models, prefix 
caching for shared prompts.
5. Set up monitoring and autoscaling: queue depth, latency percentiles, error rates — alert 
before users notice.
6. Plan operations: rolling updates, model versioning, request logging (redacted), and capacity 
headroom for spikes.

```text
Serving checklist:
[ ] GPU sizing: model + KV cache headroom calculated
[ ] Quantization chosen and quality-validated
[ ] Load-tested with realistic traffic mix
[ ] TTFT + inter-token latency within targets
[ ] Monitoring: queue depth, latency p95/p99, errors
[ ] Autoscaling + rolling update plan
```

## Common pitfalls

- **Under-provisioned KV cache**: long contexts + many concurrent requests exhaust memory. Size for 
your actual context lengths.
- **Benchmarking with toy prompts**: uniform short prompts hide real-world variance. Test with your 
distribution.
- **Ignoring TTFT**: optimizing tokens/sec while users wait seconds for the first token. Match 
metrics to UX.
- **No quantization**: serving FP16 when INT8/FP8 would double capacity at negligible quality cost. 
Validate and quantize.
- **Single-GPU thinking**: large models need tensor parallelism; misconfigured parallelism wastes 
GPUs.
- **No backpressure**: accepting unlimited requests until latency explodes. Queue with limits; shed 
or degrade gracefully.
