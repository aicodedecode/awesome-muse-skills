---
name: friendli-ai
description: High-throughput inference on FriendliAI — optimized serving engine for low-latency, cost-efficient LLMs.
category: ai-research
---

## Overview

FriendliAI builds inference infrastructure with a focus on serving efficiency:
their serving engine (with techniques like iteration-level scheduling and
optimized kernels) targets high throughput and low latency per dollar, offered
both as a managed inference service and as software for self-hosted deployment.
The positioning is infrastructure-grade efficiency — for teams serving LLMs at
scale where serving economics dominate the bill.

The distinctive angle is the engine itself: FriendliAI's research in efficient
serving (published work on scheduling and optimization) informs both their
cloud service and their deployable software. For organizations serving open
models at volume — whether on FriendliAI's cloud or their own GPUs with
FriendliAI's stack — the value is measured in tokens per dollar at target
latency.

Evaluate FriendliAI where serving efficiency is the decision criterion: high
volume, latency SLOs, and cost-per-token pressure.

## When to use

- High-volume LLM serving where cost-per-token at scale decides.
- Latency-sensitive serving needing efficient scheduling (low TTFT + high
  throughput).
- Self-hosted inference wanting a high-efficiency serving engine.
- Multi-tenant serving with mixed workload shapes.
- Throughput-heavy batch + online mixed workloads.
- Teams optimizing serving economics as a core competency.

## Core concepts

- **Serving engine efficiency**: iteration-level scheduling, optimized
  attention kernels, and quantization support — the technical sources of
  throughput-per-dollar. Understand what's applied in your deployment.
- **Managed service vs. software**: use their cloud, or deploy their engine
  on your infrastructure. The choice hinges on your ops capacity and data
  control needs.
- **Throughput per dollar**: the headline metric — tokens/sec per unit cost
  at your latency SLO. Benchmark this, not raw tokens/sec alone.
- **Latency SLO adherence**: efficiency that violates p99 latency isn't
  useful. Measure the latency distribution, not just the mean throughput.
- **Quantization integration**: efficient serving often involves quantization
  — validate output quality on your task for the quantized configuration.
- **Mixed workload handling**: batch and interactive traffic on shared
  infrastructure — scheduling that protects interactive latency while
  maintaining batch throughput.
- **Dedicated capacity**: reserved deployments for predictable performance.
  Match to your SLO requirements.
- **Observability**: throughput, latency percentiles, GPU utilization, queue
  depths — the metrics that reveal serving health.

## Practical workflow

1. **Define the efficiency target.** Target cost per million tokens at your
   required p99 latency. This is the benchmark everything else serves.
2. **Benchmark throughput per dollar.** Your models, your prompt shapes, your
   concurrency: measure tokens/sec per dollar at acceptable latency. Compare
   against your current serving.
3. **Validate quantized quality.** If the efficient configuration uses
   quantization: run your eval set. Efficiency that degrades quality below
   your bar is disqualified.
4. **Test mixed workloads.** If you serve batch + interactive: verify
   interactive latency holds under batch load. Scheduling quality shows here.
5. **Decide managed vs. self-hosted.** Ops capacity, data control, and
   economics — model both. Self-hosting the engine trades ops burden for
   control.
6. **Load-test at scale.** Sustained peak concurrency; watch latency
   percentiles, queue behavior, and failure modes under overload.
7. **Monitor serving economics continuously.** Track cost per token, latency
   SLOs, and utilization. Serving efficiency drifts with traffic shape —
   review regularly.

Checklist for FriendliAI in production:
- Cost per token at required p99 latency benchmarked.
- Quantized configurations quality-validated.
- Mixed-workload latency verified (if applicable).
- Managed vs. self-hosted decision modeled.
- Serving metrics monitored (throughput, latency, utilization, cost).

## Common pitfalls

- **Throughput without latency SLOs.** Optimizing tokens/sec while p99 latency
  violates UX requirements. Efficiency is throughput per dollar at acceptable
  latency.
- **Unvalidated quantization.** Assuming quantized serving preserves quality.
  Validate on your task — always.
- **Single-workload benchmarks.** Testing only uniform prompts when production
  mixes short/long, batch/interactive. Test the mix.
- **Ignoring queue behavior.** Throughput looks fine until queues build under
  burst. Test bursts; monitor queue depths.
- **Managed-vs-self-hosted on vibes.** Choosing without modeling ops cost,
  data control needs, and economics. Decide on numbers.
- **Utilization blindness.** Low GPU utilization means wasted money; saturation
  means latency risk. Right-size from metrics.
- **No overload plan.** What happens past capacity — graceful degradation or
  collapse? Define and test the overload behavior.
- **Static efficiency assumptions.** Traffic shape changes alter serving
  efficiency. Re-benchmark when workloads shift.
