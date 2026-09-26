---
name: prompt-engineering
description: Craft effective prompts — instruction design, few-shot examples, structured outputs, chain-of-thought, and iterative prompt refinement. Use when a model's responses need to be more reliable, specific, or correctly formatted.
category: ai-research
---

# Prompt Engineering

Prompt engineering is interface design for language models: shaping instructions, examples, and 
context so the model produces the right output reliably. It is an empirical discipline — test, 
measure, iterate.

## Overview

A prompt has four jobs: set the role and context, state the task precisely, show what good looks 
like, and constrain the output format. Models respond best to explicit, concrete instructions with 
examples. The engineering part is treating prompts as versioned artifacts with test cases, not as 
one-off magic strings.

## When to use

- Model outputs are vague, off-format, or inconsistent across runs.
- You're adding a new LLM-powered feature and need a first reliable prompt.
- Switching models breaks behavior that worked before — prompts often need per-model tuning.
- You need structured output (JSON, tables, classifications) from free-text input.

## Core concepts

- **Instruction clarity**: one task per prompt, stated concretely. "Summarize in 3 bullets, each 
under 20 words" beats "summarize briefly."
- **Few-shot examples**: 2–5 input/output pairs showing exactly the desired behavior. Examples 
teach format and edge cases faster than rules.
- **Structured output**: request JSON or a fixed schema, and describe required fields. Validate the 
output programmatically — don't trust it blindly.
- **Chain-of-thought**: ask the model to reason step-by-step before answering for hard reasoning 
tasks. For production, separate the reasoning scratchpad from the final answer.
- **Role and context**: a short role line plus relevant background ("you are reviewing this diff 
for security issues") focuses the model better than generic instructions.
- **Delimiters**: wrap inputs in clear markers (triple quotes, XML-style tags) so the model 
distinguishes instructions from data.

## Practical workflow

1. Write the task spec first: what goes in, what comes out, what "correct" means. The prompt is a 
translation of this spec.
2. Draft a minimal prompt — role, task, format, one example. Test on 5 diverse inputs.
3. Add examples for the cases that failed. Add explicit rules only for failures examples don't fix.
4. Lock the format: request structured output and validate it; fix the parser before tweaking the 
prompt.
5. Stress-test: adversarial inputs, empty inputs, very long inputs. Record failure modes.
6. Version the prompt with its test set; rerun tests when the model or prompt changes.

```text
Prompt anatomy:
[ROLE]     Who the model is + what it knows
[CONTEXT]  Background facts it needs
[TASK]     The concrete job, one per prompt
[EXAMPLES] 2-5 input/output pairs (few-shot)
[FORMAT]   Exact output shape, schema, length limits
[GUARD]    What to do when unsure (ask, abstain, default)
```

## Common pitfalls

- **Prompt as dumping ground**: cramming every rule into one mega-prompt. Split complex jobs into 
pipelines of simple prompts.
- **No test set**: "it worked on my one example." Build 10–20 test cases before claiming a prompt 
works.
- **Examples that all look alike**: few-shot sets need diversity — include edge cases and 
negative examples.
- **Fighting the model**: long lists of "don't do X." Positive instructions ("do Y") with examples 
work better than prohibitions.
- **Ignoring temperature**: creative tasks need higher temperature; extraction and classification 
need low/zero. Set it deliberately.
- **One prompt for all models**: prompts are somewhat portable but not fully. Re-validate on each 
model you ship with.
