---
name: clarifai-guide
description: Build multimodal AI apps on Clarifai — model marketplace, pipelines, and computer vision plus language workflows.
category: ai-research
---

## Overview

Clarifai is a full-stack AI platform with unusual breadth: a model marketplace
(pre-trained models across vision, language, and audio), tools for building
inference pipelines, dataset management, and model training/fine-tuning — all
behind unified APIs. The heritage is computer vision (image/video recognition
APIs), expanded into a general platform where you can compose models into
workflows spanning modalities.

The distinctive value is composition: Clarifai's workflows let you chain models
(a detector feeding a classifier feeding an LLM, for example) as a managed
pipeline, and the marketplace means you're rarely starting from zero — there's
usually a pre-trained model close to your task. For multimodal applications
mixing vision and language, it's a one-platform option worth evaluating.

Think of Clarifai as the AI platform for teams whose problems span modalities
and who want marketplace models, pipelines, and training in one place.

## When to use

- Multimodal applications mixing computer vision with language (image
  understanding + LLM reasoning).
- Computer vision tasks via API: detection, classification, segmentation,
  visual search.
- Composing multi-model pipelines as managed workflows.
- Fine-tuning vision or language models on your data within one platform.
- Prototyping with marketplace models before committing to custom training.
- Teams needing vision + language + training without stitching providers.

## Core concepts

- **Model marketplace**: pre-trained models across modalities, runnable via
  API. Start here — evaluate existing models on your data before training
  anything.
- **Workflows**: managed pipelines chaining models (and operators) into
  multi-step inference. The composition layer — design the pipeline on paper,
  then wire it.
- **Computer vision depth**: detection, classification, segmentation, OCR,
  visual similarity — the platform's historical strength. Benchmark against
  alternatives on your images.
- **Language models**: LLMs in the marketplace for text tasks within
  multimodal pipelines. Evaluate like any LLM provider for those steps.
- **Datasets and labeling**: dataset management with labeling workflows for
  training data. Data quality tooling matters when you fine-tune.
- **Training and fine-tuning**: train custom models on the platform from your
  labeled datasets. The full loop: label → train → deploy → monitor.
- **Predict API**: unified inference interface across models. Standardize
  your client on it for portability within the platform.
- **Deployment options**: cloud API plus deployment flexibility for enterprise
  needs. Match the deployment model to your governance requirements.

## Practical workflow

1. **Survey the marketplace.** For each task in your pipeline, find candidate
   pre-trained models. Test them on your data before considering training.
2. **Prototype the workflow.** Chain candidate models into a Clarifai workflow;
   test end-to-end on representative inputs. Measure per-stage quality.
3. **Evaluate per stage.** When the pipeline fails, identify which stage —
   detector, classifier, LLM step. Stage-level evals, not just end-to-end.
4. **Fine-tune where marketplace falls short.** For stages where pre-trained
   models underperform: label data, train, and compare against the baseline.
   Fine-tune surgically, not wholesale.
5. **Optimize the pipeline.** Remove weak stages, fuse steps where possible,
   and right-size each model (a smaller model may suffice for an easy stage).
6. **Load-test the workflow.** End-to-end latency and throughput at expected
   concurrency — pipelines compound per-stage latency.
7. **Monitor per stage in production.** Stage-level quality and latency
   metrics; alert on the stage, not just the pipeline.

Checklist for a Clarifai deployment:
- Marketplace models evaluated per task on your data.
- Workflow prototyped end-to-end with stage-level evals.
- Fine-tuning applied surgically with before/after comparisons.
- Pipeline latency measured end-to-end at expected concurrency.
- Per-stage production monitoring in place.

## Common pitfalls

- **Training before marketplace evaluation.** Building custom models when a
  marketplace model already works. Evaluate existing models first — always.
- **End-to-end-only evaluation.** A failing pipeline without stage-level
  diagnostics. Instrument each stage.
- **Pipeline latency blindness.** Chaining five models without measuring
  cumulative latency. Pipelines compound — budget per stage.
- **Over-fine-tuning.** Training everything when one stage needed it. Surgical
  fine-tuning; leave working stages alone.
- **Data labeling skimped.** Fine-tuning on sloppy labels, then blaming the
  platform. Label quality is the ceiling.
- **Modality mismatch.** Using a vision model for a task that's really about
  the accompanying text (or vice versa). Match the model to the actual signal.
- **Ignoring per-stage cost.** Five-model pipelines at per-model pricing add
  up. Model the full pipeline cost per request.
- **No stage-level monitoring.** Production pipeline degrades and you can't
  tell which stage broke. Monitor stages, not just outputs.
