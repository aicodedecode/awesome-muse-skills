---
name: lepton-ai
description: Run models and build AI apps on Lepton AI — cloud GPUs, model APIs, and photon-based deployment.
category: ai-research
---

## Overview

Lepton AI is a cloud platform for AI workloads combining GPU cloud rental with
model APIs and "photons" — their unit for deploying code/models as scalable
serverless functions. The pitch is developer simplicity: run a model, deploy a
photon (your code packaged as an API), or rent GPUs — all with minimal
friction and straightforward pricing.

The photon abstraction is the distinctive piece: package Python code (a model,
a pipeline, an agent step) and get a scalable API endpoint without managing
servers. For builders who think in "I have code, I want an endpoint," photons
map directly to that mental model — similar in spirit to Modal's functions or
Replicate's deployments, with Lepton's own packaging and scaling.

Evaluate Lepton as a developer-friendly GPU cloud + deployment platform: the
question is whether its simplicity and pricing fit your workload better than
alternatives.

## When to use

- Deploying Python code/models as scalable API endpoints (photons) quickly.
- GPU cloud rental for training, fine-tuning, or custom serving.
- Model APIs for open models without infrastructure management.
- Prototypes that need "code → endpoint" with minimal DevOps.
- Batch jobs on rented GPUs.
- Teams wanting one platform for GPUs, model APIs, and custom deployments.

## Core concepts

- **Photons**: deployable units — package your Python code/model as a photon,
  get an autoscaled API endpoint. The core abstraction; learn its packaging,
  configuration, and scaling behavior.
- **Model APIs**: hosted open-model inference for standard use cases. The
  quick path when you don't need custom code.
- **GPU cloud**: rentable GPUs for custom workloads. For training and
  specialized serving beyond the API/photon abstractions.
- **Autoscaling**: photons scale with demand within configured bounds. Set
  min/max deliberately — min for latency (warm capacity), max for cost
  control.
- **Simple pricing**: straightforward pay-per-use. Model your expected costs
  at projected volume; compare against alternatives.
- **Development velocity**: the platform optimizes for time-to-deployed.
  Measure your actual path from code to production endpoint.
- **Custom environments**: control over dependencies and runtimes for photons.
  Pin versions; keep images lean for fast cold starts.
- **Monitoring basics**: request metrics, logs, and cost tracking. Wire into
  your operational practices.

## Practical workflow

1. **Start with the simplest abstraction.** Model API if a hosted model fits;
   photon if you have custom code; GPU rental if you need full control.
2. **Package the photon carefully.** Dependencies pinned, model weights cached
   or mounted (not downloaded per cold start), startup path optimized.
3. **Configure scaling deliberately.** Min instances for latency-sensitive
   endpoints; max as cost protection. Load-test the scaling behavior.
4. **Benchmark against alternatives.** Same workload on Lepton vs. your
   current platform: deployment velocity, latency, cost. Simplicity has value
   — quantify it.
5. **Load-test at expected traffic.** Cold starts, warm latency, behavior
   under burst — the standard serving validation.
6. **Set up monitoring.** Request metrics, error rates, latency percentiles,
   and cost per photon. Alert on anomalies.
7. **Review costs regularly.** Pay-per-use across photons and GPUs needs
   attribution. Track per-workload spend.

Checklist for Lepton in production:
- Right abstraction chosen (API vs. photon vs. GPU rental).
- Photon packaging optimized (pinned deps, cached weights).
- Scaling bounds set and load-tested.
- Benchmarked against alternatives on velocity/latency/cost.
- Per-workload cost monitoring in place.

## Common pitfalls

- **Wrong abstraction.** Using GPU rental for what a model API handles, or a
  photon for what needs full cluster control. Match abstraction to need.
- **Cold-start blindness.** Serverless deployment without measuring cold
  starts against latency requirements. Warm capacity where SLOs demand.
- **Unpinned dependencies.** Photon builds drifting as dependencies update.
  Pin everything; rebuild deliberately.
- **Weight downloads per start.** Fetching model weights on cold start
  instead of caching. Cache aggressively.
- **No scaling bounds.** Autoscaling without max = billing surprise;
  without min = latency surprise. Set both.
- **Simplicity overkill.** Choosing the simple platform for workloads needing
  control it doesn't offer. Know the ceiling.
- **Cost attribution gaps.** Multiple photons and GPU jobs without per-unit
  cost tracking. Tag and monitor.
- **No comparison.** Adopting on ease-of-use alone without benchmarking cost
  and performance against alternatives. Ease matters — but measure the rest.
