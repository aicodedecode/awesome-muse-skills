---
name: ai21-guide
description: Build with AI21 Labs' models — Jurassic for generation and strong task-specific models for enterprise use.
category: ai-research
---

## Overview

AI21 Labs builds foundation models with an enterprise focus: the Jurassic
family for general generation and, distinctively, a set of task-specific models
(Jamba for long-context, plus specialized models for summarization, reading
comprehension, and other focused tasks). The positioning is practical
enterprise AI: strong performance on specific business tasks, long-context
capabilities, and managed APIs with enterprise controls.

The distinctive angle is task specialization: where most labs push one general
model for everything, AI21 offers models tuned for particular jobs. For
enterprises with well-defined high-volume tasks (summarization pipelines,
document Q&A, classification), a specialized model can outperform a generalist
at lower cost.

Evaluate AI21 task by task: the question isn't "is Jurassic the best general
model" but "does the task-specific model beat the generalist on my task at my
economics."

## When to use

- High-volume summarization with consistent quality requirements.
- Long-context tasks (Jamba's context windows suit document-scale work).
- Document Q&A and reading comprehension at enterprise scale.
- Task-specific models where specialization beats generalist prompting.
- Enterprise deployments needing managed APIs with governance.
- Evaluating alternatives to generalist frontier models on defined tasks.

## Core concepts

- **Jurassic models**: general-purpose generation models. Benchmark against
  your current provider on your tasks — the comparison is task-specific.
- **Jamba**: long-context models (hybrid architecture) for document-scale
  inputs. Evaluate long-context quality on your documents, not just context
  length claims.
- **Task-specific models**: specialized models for summarization, comprehension,
  and similar focused tasks. These are the differentiator — test them on the
  tasks they're built for.
- **Long-context handling**: large context windows for whole-document
  processing. But length isn't quality — test retrieval and reasoning over
  long inputs on your data.
- **Enterprise API**: managed endpoints with the controls enterprises expect.
  Evaluate the operational fit alongside model quality.
- **Grounding**: models tuned for grounded enterprise use. Test faithfulness
  on your RAG pipelines.
- **Pricing**: per-token pricing; task-specific models may offer better
  economics than generalists for their tasks. Model cost per completed task.
- **Model selection**: the catalog has distinct models for distinct jobs —
  choose deliberately per task, not one model for everything.

## Practical workflow

1. **Identify candidate tasks.** List your well-defined, high-volume tasks
   (summarization, Q&A, classification). These are where task-specific models
   may win.
2. **Benchmark task-specific vs. generalist.** Same task, same eval set:
   AI21's specialized model vs. your current generalist. Measure quality and
   cost per task.
3. **Test long-context honestly.** For Jamba: your longest real documents,
   with questions requiring information from across the document. Test
   "lost in the middle" behavior explicitly.
4. **Evaluate grounding.** For RAG use: faithfulness to source documents,
   measured on your corpus and queries.
5. **Model the economics.** Task-specific models at lower per-token cost can
   win big at volume — but only if quality clears your bar. Cost per completed
   task, as always.
6. **Pilot on production-shaped traffic.** Run a bounded pilot with real
   inputs; monitor quality and latency distributions.
7. **Decide per task.** The outcome may be hybrid: AI21 for summarization,
   another provider for chat. That's fine — route per task.

Checklist for AI21 in production:
- Task-specific models benchmarked against generalists on your tasks.
- Long-context quality tested on your real documents.
- Grounding faithfulness measured for RAG use.
- Cost per completed task modeled at volume.
- Pilot validated on production-shaped traffic.

## Common pitfalls

- **Generalist comparisons only.** Evaluating Jurassic as a generic chatbot
  and missing the task-specific models where AI21 actually differentiates.
- **Context length as quality.** Assuming a big context window means good
  long-document reasoning. Test with questions spanning the full input.
- **No task-specific benchmarking.** Choosing models on vibes instead of
  task-level evals. The specialization story needs task-level proof.
- **Ignoring the hybrid outcome.** Feeling forced to pick one provider for
  everything. Route per task — that's the rational architecture.
- **Volume economics unmodeled.** Task-specific pricing advantages only matter
  at volume. Model your actual throughput.
- **Lost-in-the-middle blindness.** Long-context models still degrade on
  information buried mid-document. Test explicitly.
- **Single-task overfitting.** A model great at your summarization eval but
  untested on your Q&A. Evaluate each deployed task separately.
- **Skipping the pilot.** Going straight from benchmarks to full production.
  Real traffic always differs — pilot first.
