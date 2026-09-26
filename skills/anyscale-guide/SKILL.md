---
name: anyscale-guide
description: Scale Ray workloads and serve models on Anyscale — managed Ray clusters for training and inference.
category: ai-research
---

## Overview

Anyscale is the managed platform for Ray, the distributed computing framework —
it runs your Ray workloads (training, batch processing, hyperparameter tuning,
model serving with Ray Serve) on managed clusters without you operating the
infrastructure. For AI teams, the practical shape is: develop Ray code locally,
then run it at scale on Anyscale with managed cluster lifecycle, observability,
and cost controls.

The distinctive value is Ray itself: a unified programming model for distributed
Python that covers training, serving, and data processing in one framework. If
your ML work spans "train a model," "tune hyperparameters," "run batch
inference," and "serve the model," Ray does all four — and Anyscale removes the
cluster-management burden. It's infrastructure for teams whose workloads are
genuinely distributed, not just "a GPU in the cloud."

Anyscale's lens: if you're reaching for Ray, use the managed platform; if you're
not using Ray, Anyscale probably isn't your starting point.

## When to use

- Distributed training jobs that need multi-node/multi-GPU orchestration.
- Hyperparameter sweeps at scale (Ray Tune) without managing the cluster.
- Model serving with Ray Serve: composable deployments, multi-model pipelines.
- Batch inference over large datasets with distributed processing.
- Reinforcement learning workloads (Ray RLlib) at scale.
- Teams standardizing on Ray as their distributed compute layer.

## Core concepts

- **Ray core primitives**: tasks (stateless functions), actors (stateful
  workers), and objects (distributed shared memory). Learn these three — every
  Ray program composes them.
- **Managed clusters**: Anyscale provisions and manages the cluster lifecycle
  (autoscaling node pools, spot instances, upgrades). You declare compute
  config; the platform handles the rest.
- **Ray Tune**: distributed hyperparameter optimization with schedulers
  (ASHA/PBT) that kill bad trials early. The cost savings from early stopping
  usually dwarf the platform cost.
- **Ray Serve**: model serving with deployment graphs — compose models,
  preprocessors, and business logic into one served application with
  autoscaling per deployment.
- **Workspaces**: interactive development environments on the cluster — develop
  against real distributed resources, not just your laptop.
- **Jobs**: the production unit — submit a Ray job (training run, batch
  pipeline) with pinned code, dependencies, and compute config. Jobs are
  auditable and reproducible.
- **Autoscaling and spot**: clusters scale node pools with demand; spot
  instances cut cost for fault-tolerant workloads. Configure per workload —
  serving on spot needs care.
- **Observability**: Ray dashboard plus Anyscale's monitoring — task timelines,
  actor states, GPU utilization, logs. Distributed debugging lives here.

## Practical workflow

1. **Develop the Ray program locally.** Write tasks/actors/serve deployments
   against a local Ray cluster. Get the logic right at small scale first.
2. **Define compute config.** Node types, autoscaling bounds, GPU requirements
   per workload. Start modest; scale based on measured utilization.
3. **Run as a Job for anything repeatable.** Notebooks and workspaces for
   exploration; Jobs for training runs and pipelines — reproducible, logged,
   reviewable.
4. **Tune with early stopping.** For hyperparameter search, use ASHA or PBT
   schedulers — killing bad trials early is the highest-ROI optimization in
   distributed tuning.
5. **Serve with Ray Serve graphs.** Compose the inference pipeline (preprocess →
   model → postprocess) as a deployment graph with per-deployment scaling.
   Load-test the graph, not just the model.
6. **Use spot where fault-tolerant.** Training with checkpointing and batch
   jobs tolerate preemption — spot instances cut those costs substantially.
   Keep serving and stateful work on on-demand.
7. **Monitor and right-size.** Watch GPU utilization, autoscaling behavior, and
   cost per job. Distributed systems drift toward waste — review regularly.

Checklist for Anyscale production work:
- Jobs pinned (code, deps, compute config) and reproducible.
- Autoscaling bounds set per workload; spot policy deliberate.
- Tuning uses early-stopping schedulers.
- Serve graphs load-tested end-to-end.
- GPU utilization and cost-per-job monitored.

## Common pitfalls

- **Ray for non-distributed work.** A single-GPU training job doesn't need Ray's
  machinery. Use Ray when the workload is genuinely distributed.
- **No checkpointing with spot.** Spot preemptions without checkpoints waste
  the entire run. Checkpoint frequently; make training resumable.
- **Autoscaling misconfiguration.** Bounds too tight (jobs queue forever) or too
  loose (idle GPUs burning money). Tune from utilization data.
- **Tuning without early stopping.** Full-fidelity training of every
  hyperparameter combination. ASHA/PBT exist precisely to avoid this.
- **Serving the model, not the graph.** Load-testing the bare model while
  production runs a preprocess→model→postprocess graph with different scaling
  needs per stage.
- **Workspace-as-production.** Running production workloads from interactive
  workspaces instead of Jobs. Workspaces are for development; Jobs are for
  repeatability.
- **Ignoring data locality.** Distributed compute with centralized data access
  bottlenecks on I/O. Co-locate data access with compute; use Ray Data
  thoughtfully.
- **Cost blindness.** Multi-node GPU clusters without per-job cost tracking.
  Distributed waste scales as fast as distributed compute.
