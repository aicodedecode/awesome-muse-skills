---
name: self-reflection
description: Build agents that critique and improve their own outputs — reflection loops, Reflexion-style memory, and verbal reinforcement.
category: ai-research
---

## Overview

Self-reflection gives a language model a second pass over its own work: generate,
critique, revise. The critique can target correctness ("does this code pass the
tests?"), quality ("is this summary faithful?"), or strategy ("is this plan
actually going to work?"). Unlike gradient-based learning, reflection improves the
output within a single episode using only inference — the model reads its own
draft the way an editor reads a manuscript, spots problems, and fixes them.

The research lineage runs from simple "review your answer" prompts through
Reflexion — which stores reflections as episodic memory across trials, so the
agent learns from past failures without weight updates — to verbal reinforcement
methods where the model maintains textual "lessons learned." The pattern is most
powerful when the critique is grounded: test results, tool outputs, or retrieved
facts, rather than the model grading its own vibes.

Reflection is inference-time self-improvement. It costs tokens instead of
gradients, and it works on any model — including ones you can't fine-tune.

## When to use

- Agent tasks with verifiable feedback: code that runs, plans that execute,
  answers checkable against sources.
- Improving output quality when you can't or won't fine-tune (API-only models,
  one-off tasks).
- Multi-attempt problems where learning from failed attempts beats independent
  retries.
- Long-horizon tasks where early mistakes compound — reflection catches drift
  before it cascades.
- Building "verbal RL" loops: accumulating textual lessons across episodes as a
  lightweight alternative to training.
- Quality gates in generation pipelines: draft → critique → ship only if clean.

## Core concepts

- **Generator–critic split**: even with one model, separate the roles with
  distinct prompts. The generator is optimistic and constructive; the critic is
  skeptical and specific. Same weights, different instructions — the role
  separation is what makes it work.
- **Grounded critique**: a critic armed with evidence (test failures, tool
  outputs, retrieved documents) beats a critic armed with opinions. Always feed
  the critic the most objective signal available.
- **Reflexion-style episodic memory**: after each trial, the model writes a short
  reflection ("I failed because I didn't handle empty input; next time validate
  first") stored in a memory buffer and prepended to future trials. The memory is
  the learning; it persists across attempts.
- **Reflection depth**: one critique-revise pass catches surface errors; two to
  three passes catch deeper issues. Beyond that, returns diminish and the model
  starts second-guessing correct answers.
- **Critic calibration**: critics can be harsh (rejecting good outputs) or
  sycophantic (approving everything). Calibrate on examples where you know the
  right verdict, and prefer specific, actionable critiques over scores.
- **Verbal reinforcement**: accumulating "do/don't" lessons in text across
  episodes. Cheaper than fine-tuning, interpretable, but bounded by context length
  — curate the lesson list, don't just append forever.
- **Self-consistency of critique**: run the critic multiple times on important
  outputs; critiques that reproduce are more trustworthy than one-offs.
- **Termination signals**: "no substantive issues found" is a valid and important
  critic output. Without it, loops polish forever.

## Practical workflow

1. **Generate the initial output.** Normal generation, no reflection yet. This is
   the draft.
2. **Gather ground truth signals.** Run the tests, execute the code, retrieve the
   source documents — whatever objective feedback exists. Feed failures verbatim
   to the critic.
3. **Critique with a dedicated prompt.** Ask for specific flaws: "List concrete
   problems with this output. For each: what's wrong, why it matters, how to fix
   it." Ban vague praise/criticism.
4. **Revise against the critique.** The generator addresses each point. Require it
   to explain what changed — this prevents silent ignoring of the critique.
5. **Loop with a budget.** Typically 1–3 rounds or until the critic finds no
   substantive issues. Stop conditions prevent infinite polish loops.
6. **Persist lessons (for repeated tasks).** Distill recurring fixes into a lessons
   list reused across episodes — the Reflexion pattern. Prune lessons that stop
   applying.
7. **Measure the delta.** Compare final quality with and without reflection on a
   test set. If reflection adds little, simplify — the tokens aren't free.

Checklist for a reflection loop:
- Critic prompt tested on known-good and known-bad outputs (it must distinguish
  them).
- Objective signals (tests, tools) fed to the critic, not just the draft.
- Max rounds capped; "no issues found" is a valid termination.
- Lessons memory pruned periodically if used across episodes.
- Quality delta measured to justify the token cost.

## Common pitfalls

- **Ungrounded self-grading.** "Review your own answer" with no external signal
  often produces confident approval of wrong answers or random changes to right
  ones. Ground the critic.
- **Reflection theater.** The model writes a critique, then regenerates essentially
  the same output. Require the revision to address each critique point explicitly.
- **Over-reflection.** Too many rounds degrade good outputs — the model finds
  problems that aren't there. Cap rounds and trust the first good pass.
- **Critic–generator collusion.** With weak role separation, the critic
  rubber-stamps. Use sharply different prompts, lower temperature for the critic,
  or a different model.
- **Unbounded lesson memory.** An ever-growing lessons list fills the context with
  stale advice. Keep it short, specific, and pruned.
- **No measurement.** Reflection costs 2–4x tokens. Measure the quality delta per
  round; if round 2+ adds nothing, ship one round or none.
- **Critic without standards.** A critic that doesn't know what "good" looks like
  for your task invents standards. Give it rubrics and examples.
- **Reflecting on the wrong object.** Critiquing the final answer when the flaw is
  in the plan, or vice versa. Direct the critic at the right artifact.
