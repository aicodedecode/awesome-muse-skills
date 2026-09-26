---
name: replicate-guide
description: Ship ML models as APIs with Replicate — run open models, deploy custom models, and pay per use.
category: ai-research
---

## Overview

Replicate is a platform for running machine-learning models in the cloud: a vast
public catalog of open models (LLMs, image, video, audio) runnable via API, plus
the ability to package and deploy your own models (including fine-tunes) as
versioned, scalable endpoints. The core abstraction is the model version —
every model is pinned, reproducible, and callable via a uniform API with
pay-per-use billing.

The distinctive strengths: enormous model variety (if an open model exists,
someone has probably put it on Replicate), dead-simple custom deployment
(package your model with Cog, push, get an API), and hardware flexibility (pick
GPU types per workload). For builders who need "run this model" without "manage
this infrastructure," across modalities, Replicate is the pragmatic default.

Think of it as: the app store model for ML compute. Browse, pin a version, call
the API, pay for what you run.

## When to use

- Running open models (any modality) via API without infrastructure.
- Deploying a custom or fine-tuned model as a scalable endpoint quickly.
- Multimodal products needing image/video/audio models alongside LLMs.
- Batch/offline processing: predictions API for bulk jobs.
- Prototyping with many different models before committing to one.
- Teams that want version-pinned, reproducible model execution.

## Core concepts

- **Models and versions**: every model has immutable versions; you call a
  specific version. Pin versions in production — "latest" moves and behavior
  changes with it.
- **Predictions API**: async-first — create a prediction, poll or webhook for
  completion. Designed for models with variable runtimes (seconds to minutes).
  Handle the async pattern properly in your client.
- **Cog**: the open-source tool for packaging models into containers. Define the
  environment and predict function; Cog builds a reproducible image. Your custom
  deployments start here.
- **Custom deployments**: push a Cog package to get a private scalable endpoint.
  Autoscaling, hardware selection, and per-deployment configuration.
- **Hardware selection**: choose GPU types per model/workload. Bigger GPUs cost
  more per second but finish faster — the cost-optimal choice is workload-specific.
- **Fine-tunes on the platform**: train supported model types on Replicate
  directly, then run the resulting version like any other model. Keeps the
  train→serve loop in one place.
- **Webhooks**: get notified on prediction completion instead of polling. Use
  webhooks for production; poll only in scripts and prototypes.
- **Pay-per-use billing**: billed for compute time per prediction. Cold starts
  and queue times are part of the latency picture — measure end-to-end.

## Practical workflow

1. **Browse and test in the playground.** Find candidate models, test with your
   inputs in the web UI, inspect outputs and runtimes before writing code.
2. **Pin a version.** Choose a specific model version for your integration. Record
   it; never ship against a floating tag.
3. **Integrate the async API.** Create prediction → webhook/poll → handle result.
   Build timeout and retry handling around the async pattern from the start.
4. **Measure the full latency picture.** Queue time + cold start + compute, at
   your expected concurrency. Replicate latency is spikier than dedicated
   serving — verify against your SLOs.
5. **Package custom models with Cog.** For fine-tunes or custom models: write the
   Cog config, test locally with `cog predict`, then push for deployment.
6. **Choose hardware deliberately.** Benchmark your model on candidate GPU types;
   pick the cost-optimal option for your latency target, not just the biggest.
7. **Monitor spend per model version.** Pay-per-use across many models needs
   attribution. Track cost per prediction and per feature.

Checklist for production on Replicate:
- Model versions pinned, not floating.
- Async handling (webhooks) implemented with timeouts.
- End-to-end latency measured at expected concurrency.
- Hardware choice benchmarked for cost/latency.
- Spend tracked per model and feature.

## Common pitfalls

- **Floating versions.** Shipping against "latest" and getting surprised by a
  model update. Pin everything.
- **Polling in production.** Poll loops are fine for scripts; production needs
  webhooks. Polling at scale is wasteful and slow to react.
- **Ignoring cold starts.** First prediction after idle takes longer (container
  spin-up, model load). If latency matters, measure cold vs. warm and plan
  accordingly.
- **Synchronous assumptions.** Treating predictions like instant API calls.
  Design the UX around async from the start (progress states, notifications).
- **Wrong hardware economics.** Defaulting to the biggest GPU "to be safe."
  Benchmark — smaller GPUs often win on cost per prediction.
- **No timeout handling.** Predictions can hang or queue long. Timeouts with
  graceful degradation beat infinite waits.
- **Cog packaging surprises.** "Works on my machine" models failing in Cog
  containers. Test with `cog predict` locally — it runs the same container.
- **Cost blindness across models.** Trying dozens of models in dev, then being
  surprised by the bill. The catalog invites experimentation; track the spend.
