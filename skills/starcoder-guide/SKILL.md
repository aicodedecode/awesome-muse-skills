---
name: starcoder-guide
description: Build with StarCoder code models — open code LLMs trained on The Stack with fill-in-the-middle support.
category: ai-research
---

## Overview

StarCoder (BigCode — a collaboration involving Hugging Face and ServiceNow)
is an open code-LLM family trained on The Stack, a large dataset of
permissively-licensed source code. The licensing story is the differentiator:
training on license-filtered code was designed to make StarCoder safer for
commercial use from a code-provenance perspective. StarCoder2 continued the
line with improved training and efficiency.

For builders, StarCoder's relevance is strongest where code IP provenance
matters: organizations with strict policies about training-data licensing for
the models they deploy. Technically, StarCoder supports fill-in-the-middle
(FIM) for code completion, long-ish contexts, and standard code tasks —
evaluate it against other code models on your languages and tasks.

The honest framing: StarCoder's licensing posture is its edge; its code
quality should be established by benchmarking like any model.

## When to use

- Organizations with strict code-provenance/licensing requirements for AI
  models.
- Code completion with fill-in-the-middle (infilling) support.
- Open code-model evaluation where training-data licensing is a criterion.
- Fine-tuning open code models with clear provenance.
- Research on license-aware code model training.
- Multi-language code generation via API or self-hosted.

## Core concepts

- **The Stack dataset**: training on permissively-licensed code with opt-out
  mechanisms. Understand what this means for your IP risk assessment — it's a
  meaningful reduction, not a legal guarantee; consult counsel for your
  situation.
- **Fill-in-the-middle (FIM)**: trained to complete code given both prefix
  and suffix — the core interaction for IDE-style completion. Test infilling
  quality on your code patterns.
- **StarCoder2**: the improved generation — better training, efficiency, and
  performance. Prefer current generations.
- **Long context**: extended context for repository-level code understanding.
  Test on your real repositories, not just synthetic long-context benchmarks.
- **Multi-language**: trained across many programming languages. Per-language
  evaluation on your stack's languages.
- **Open weights**: downloadable, fine-tunable, self-hostable. Check license
  per release.
- **Instruction variants**: tuned versions for chat-style code assistance.
- **BigCode provenance**: the open, documented training approach — read the
  technical reports for the details relevant to your compliance review.

## Practical workflow

1. **Assess the licensing requirement.** What does your organization actually
   require regarding training-data provenance? Get the requirement specific
   before evaluating.
2. **Benchmark code quality.** Your languages, your tasks (completion,
   generation, infilling, explanation): StarCoder vs. Code Llama, DeepSeek
   Coder, Qwen-Coder. Licensing doesn't exempt quality evaluation.
3. **Test fill-in-the-middle.** If IDE completion is the use case: prefix+suffix
   completion quality on your codebase patterns.
4. **Test repository context.** For repo-level tasks: feed real repository
   context and evaluate understanding and edit quality.
5. **Review provenance documentation.** Read the BigCode technical reports;
   collect what's needed for your compliance review.
6. **Evaluate deployment.** API vs. self-hosted on your economics; confirm
   hosting availability.
7. **Pin and monitor.** Version pins; code-quality monitoring in production
   (acceptance rates, not just benchmark scores).

Checklist for StarCoder in production:
- Licensing requirements specified and matched to the provenance docs.
- Code quality benchmarked against alternatives on your languages.
- FIM quality tested for completion use cases.
- Repository-context performance validated.
- Deployment economics modeled; version pinned.

## Common pitfalls

- **Licensing as quality proxy.** Provenance matters for compliance; it says
  nothing about code quality. Benchmark anyway.
- **Provenance over-read.** Treating license-filtered training as a legal
  guarantee. It's risk reduction — get proper legal review for your situation.
- **Old generation.** Evaluating or deploying StarCoder 1 when StarCoder2 is
  substantially better.
- **Generic code benchmarks.** Public code benchmarks don't predict your
  languages and codebase patterns. Test yours.
- **FIM untested.** Deploying for completion without testing infilling
  quality specifically.
- **Repo context assumed.** Long context windows without testing real
  repository understanding.
- **No acceptance tracking.** Production code assistants need acceptance-rate
  monitoring, not just offline benchmarks.
- **Compliance file incomplete.** Starting a licensing review without the
  technical documentation collected. Gather it during evaluation.
