---
name: prompt-engineering-pro
description: Prompt engineering guidance — system prompts, few-shot, chain-of-thought, structured output, and evaluation-driven iteration.
category: development
---

## Overview

Prompt engineering is programming in natural language: the discipline of getting reliable behavior from LLMs through instruction design, examples, and structure. It matters most where reliability matters — production features, not demos. The core loop is: hypothesize, test on evals, measure, iterate.

This skill covers the techniques that actually move reliability: system prompt design, few-shot examples, chain-of-thought, structured outputs, and the evaluation-driven workflow that replaces vibes with measurement.

## When to use

- Writing system prompts for production features.
- Improving LLM task reliability.
- Choosing few-shot vs fine-tuning.
- Getting structured/JSON output reliably.
- Debugging prompt failures.
- Setting up prompt evaluation and iteration.

## Core concepts

- **System prompts.** The behavior specification: role, task, constraints, output format, edge cases. Be explicit and structured (sections, numbered rules); long detailed prompts outperform clever short ones. Version them like code.
- **Instruction hierarchy.** System > developer > user — higher levels override lower. Put non-negotiable constraints at the highest level available; don't rely on user messages for safety rules.
- **Few-shot examples.** Input→output pairs demonstrating the task — the fastest way to teach format, tone, and edge cases. 3-5 diverse examples beat 20 similar ones; include negative examples (what NOT to do) for tricky distinctions.
- **Chain-of-thought.** "Think step by step" or structured reasoning sections — dramatically improves multi-step reasoning. For production: request reasoning in a separate field/block, then the answer — parseable and auditable.
- **Zero-shot vs few-shot vs fine-tune.** Zero-shot (clear instructions suffice) → few-shot (examples teach the pattern) → fine-tune (consistent behavior at scale, lower inference cost). Escalate when the cheaper level plateaus, measured on evals.
- **Structured output.** Schemas (JSON Schema, Pydantic) + strict mode where available; for free-text models, demand a format section and validate. Never regex-parse unvalidated LLM text in production.
- **Delimiters and structure.** XML tags, markdown sections, clear separators between instructions, context, and user input — structure prevents the model from confusing roles of text blocks. Especially critical with untrusted content.
- **Context management.** Relevant context in, noise out — long contexts dilute attention ("lost in the middle"). Order matters: important instructions early AND late; key data near the question.
- **Decomposition.** Break hard tasks into steps (separate calls or explicit sections) — each step simpler and verifiable. A pipeline of focused prompts beats one mega-prompt.
- **Self-correction patterns.** "Review your answer against these criteria, then revise" — a second pass catches errors the first pass makes. Costs 2x tokens; worth it for high-stakes outputs.
- **Personas.** Role framing ("you are a senior code reviewer") — useful for tone/expertise calibration, not magic. Specific behavioral instructions beat vague persona vibes.
- **Negative instructions.** "Do not..." is weaker than positive specification ("Do X") — models follow positive instructions more reliably. Prefer specifying correct behavior; use negatives for known failure modes.
- **Evaluation-driven iteration.** Golden datasets, rubrics, LLM-as-judge + deterministic checks — every prompt change measured. This is the whole game: without evals, prompt engineering is superstition.
- **Prompt injection awareness.** Untrusted content is data, never instructions — delimit it, instruct the model to treat it as such, and validate outputs. Assume adversarial inputs in exposed systems.
- **Versioning and testing.** Prompts in git, changes reviewed, evals in CI — prompt changes are code changes with the same rigor.
- **Self-consistency.** Sample multiple reasoning paths, take the majority answer — trades tokens for reliability on reasoning tasks; the simple ensemble.

## Practical workflow

1. **Specify the task precisely.** Write the system prompt as a behavior spec: role, inputs, outputs, constraints, edge cases — structured with sections:
   ```
   ## Role
   You are an invoice data extractor.
   ## Output
   Return JSON matching the schema below. No commentary.
   ## Rules
   1. Dates as YYYY-MM-DD. 2. Amounts as numbers, no currency symbols.
   3. If a field is absent, use null. Never invent values.
   ```
2. **Add few-shot examples.** 3-5 diverse pairs covering normal + edge cases; include a negative example for the most common mistake.
3. **Demand structure.** Chain-of-thought in a `reasoning` field, final answer in an `answer` field — or strict JSON schema mode. Parse and validate.
4. **Decompose hard tasks.** Multi-step reasoning → explicit steps; verify intermediate outputs where possible.
5. **Build the eval set.** 50-200 representative cases with expected outputs; deterministic checks + LLM judge with a rubric:
   ```python
   # eval loop: run prompt version against golden set, score, compare
   results = [run_case(prompt_v2, case) for case in golden_set]
   score = judge.score(results)  # rubric: correctness, format, completeness
   ```
6. **Iterate measured.** Change one thing, run evals, keep what improves. Track prompt versions with their scores — the changelog of what worked.
7. **Harden the boundaries.** Delimit untrusted content; add injection-resistance instructions; validate outputs before downstream use.
8. **Ship with monitoring.** Log prompts/outputs (privacy-aware), track quality metrics in production, alert on degradation — prompts decay as models update.

## Common pitfalls

- **Vibes-based iteration** — "feels better" without evals; measure everything.
- **Mega-prompts** — one prompt doing five jobs; decompose.
- **No structured output** — parsing free text; schemas + validation.
- **Negative-only instructions** — "don't do X" without specifying the right behavior; positive specification.
- **Context dumping** — everything in, attention diluted; curate and order context.
- **Ignoring lost-in-the-middle** — key info buried mid-context; position important content strategically.
- **Untrusted content as instructions** — injection vulnerabilities; delimit and instruct.
- **Prompt changes unreviewed** — edits straight to prod; version, review, eval.
- **Few-shot homogeneity** — 20 similar examples; diverse + negative examples.
- **Over-persona, under-specification** — "you're an expert" instead of concrete rules; behaviors, not vibes.
- **No output validation** — trusting raw LLM text downstream; validate schemas and content.
- **Fine-tuning too early** — expensive before few-shot plateaus; escalate on measured need.
- **Prompt decay ignored** — model updates changing behavior; monitor production quality.
