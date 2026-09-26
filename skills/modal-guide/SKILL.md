---
name: modal-guide
description: Run serverless GPUs with Modal — deploy models, batch jobs, and agents on demand without managing infrastructure.
category: ai-research
---

## Overview

Modal is a serverless compute platform for Python: you write ordinary Python
functions, decorate them with infrastructure requirements (GPU type, image,
timeouts), and Modal runs them on its cloud — scaling from zero to hundreds of
parallel containers. For AI work, it's the fastest path to "run this model on a
GPU" without provisioning anything: model inference endpoints, batch processing,
fine-tuning jobs, and agent sandboxes all fit the model.

The programming model is the product: infrastructure as decorators on Python
code. `@app.function(gpu="A100")` is the whole provisioning story. Combined
with fast cold starts (custom container images with cached layers), persistent
volumes, and secrets management, Modal covers the full lifecycle from notebook
experiment to production endpoint.

Use Modal when your unit of work is Python code needing serious compute, and
you'd rather not think about clusters, Kubernetes, or GPU procurement.

## When to use

- Serving open models on GPUs without managing servers (custom inference
  endpoints).
- Batch jobs: dataset processing, embedding generation, evaluation sweeps at
  scale.
- Fine-tuning runs and experimentation needing on-demand GPUs.
- Sandboxed code execution for agents (run untrusted generated code in isolated
  containers).
- Scheduled jobs (crons) and queues for ML pipelines.
- Prototypes that might become production — Modal scales both.

## Core concepts

- **Apps and functions**: an App groups functions; each function is a Python
  callable with declared resources. The decorator is the infrastructure spec —
  read it as documentation of what the function needs.
- **Images**: container images built from Python dependencies (pip, apt, CUDA).
  Image builds are cached in layers — keep them lean and stable for fast cold
  starts. Pin dependency versions.
- **GPU selection**: request GPU types per function (T4 through H100 classes).
  Match the GPU to the workload: inference on smaller GPUs, training on bigger
  ones. Cost scales with GPU class — don't overprovision.
- **Scaling**: functions scale from zero to many parallel containers
  automatically. Set concurrency limits per function to bound cost and protect
  downstream dependencies.
- **Volumes and storage**: persistent volumes for model weights, datasets, and
  caches. Mount weights from a volume instead of downloading per cold start —
  this is the single biggest cold-start optimization.
- **Secrets**: managed secrets injected as environment variables. Never hardcode
  API keys; use Modal secrets and rotate them.
- **Web endpoints**: expose functions as HTTP endpoints (including ASGI apps like
  FastAPI). The path from Python function to production API is one decorator.
- **Dedicated deployments**: reserved GPUs for your workload — no noisy
  neighbors, predictable latency. The right choice when shared capacity variance
  violates SLOs.

## Practical workflow

1. **Prototype locally, decorate for cloud.** Write the Python logic first; add
   Modal decorators for GPU/image/timeout. Keep a local-run path for fast
   iteration on logic.
2. **Optimize the image.** Pin dependencies, minimize layers, pre-download model
   weights into a volume. Cold-start time is dominated by image size and weight
   loading — attack both.
3. **Mount weights from volumes.** Never download multi-GB weights on cold start.
   Build a volume with the weights once; mount it read-only in serving
   functions.
4. **Set timeouts and concurrency limits.** Every function gets a timeout (fail
   fast, don't burn money on hangs) and a concurrency cap (bound cost, protect
   downstream).
5. **Load-test the endpoint.** Measure cold-start latency, warm latency, and
   behavior at target concurrency. Modal scales well, but your code's
   initialization path is yours to optimize.
6. **Use sandboxes for agent code execution.** Agents generating code should run
   it in Modal sandboxes — isolated, timeout-bounded, network-controllable.
7. **Monitor spend.** Serverless GPUs bill by the second; runaway scaling is
   expensive. Set concurrency limits, track per-function cost, and alert on
   anomalies.

Checklist for a Modal deployment:
- Image pinned and lean; weights on volumes, not downloads.
- Timeouts and concurrency limits on every function.
- Secrets managed, never hardcoded.
- Cold-start and warm latency measured at target concurrency.
- Per-function cost tracked with anomaly alerts.

## Common pitfalls

- **Fat images.** Unpinned, kitchen-sink dependencies → slow builds and slow
  cold starts. Curate the image like production infrastructure.
- **Downloading weights per invocation.** The classic Modal beginner mistake.
  Volumes exist for this — use them.
- **No concurrency limits.** Autoscaling is wonderful until a bug or traffic
  spike scales you into a shocking bill. Limits are guardrails, not pessimism.
- **Missing timeouts.** A hung GPU function bills until it dies. Set aggressive
  timeouts; retry with backoff instead of waiting.
- **Secrets in code or images.** Hardcoded keys in function code or baked into
  images. Use Modal secrets, rotate regularly.
- **Local/cloud divergence.** Code that works locally but fails on Modal
  (missing deps, path assumptions). Keep the local-run path honest and test
  the decorated path early.
- **Cold starts in latency-sensitive paths.** Serverless cold starts are real
  (seconds). For strict latency, keep functions warm (minimum containers) or
  accept the tradeoff consciously.
- **No cost monitoring.** Per-second GPU billing across many functions without
  attribution. The bill arrives monthly; the surprise shouldn't.
