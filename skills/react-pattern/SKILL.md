---
name: react-pattern
description: Build agents that interleave reasoning and acting — the ReAct loop of thought, action, and observation.
category: ai-research
---

## Overview

ReAct (Reason + Act) is the foundational agent loop: the model alternates between
thinking (a reasoning trace about what to do next), acting (calling a tool), and
observing (reading the tool's result), repeating until the task is done. The
interleaving is the point — reasoning guides which action to take, and
observations ground the next round of reasoning in reality instead of speculation.
A ReAct trajectory looks like: Thought: "I need the current price, so I'll
search." Action: search("..."). Observation: results. Thought: "Got it, now
I'll..."

It's deliberately simple — no planner, no memory system, no multi-agent
choreography — which is why it's the default starting architecture for tool-using
agents and the baseline everything else is compared against. Few-shot
demonstrations of the Thought/Action/Observation format are usually enough to get
a capable model running the loop reliably.

ReAct's longevity comes from a deep truth: most agent tasks are just "figure out
the next step, do it, look at what happened" repeated. Architectures that beat
ReAct do so on specific task shapes; nothing beats it on generality per unit of
complexity.

## When to use

- Your first agent for any tool-using task — start here before adding complexity.
- Tasks where each step's outcome determines the next step (research, debugging,
  data gathering).
- Question answering over tools: search, lookup, calculate, then synthesize.
- As the inner loop inside fancier architectures (planners that delegate to ReAct
  executors).
- When you need transparent agent behavior — the thought traces make the agent's
  reasoning auditable.
- Baselines: every fancier agent architecture should be compared against ReAct
  before claiming victory.

## Core concepts

- **The trajectory**: the full sequence of thoughts, actions, and observations is
  the agent's working memory. Everything the agent "knows" about the task state
  lives here. Keep it; don't summarize it away mid-task.
- **Thought**: free-text reasoning before each action. It should state the current
  subgoal, what information is missing, and why the chosen action fills the gap.
  Vague thoughts ("Let me think...") produce vague actions.
- **Action**: a structured tool call — name plus arguments. Parse strictly; a
  malformed action is a wasted turn. Constrain the action space to the tools the
  task needs.
- **Observation**: the tool's result, appended verbatim (or summarized if huge).
  Observations are the only grounding the agent gets — everything else is the
  model's prior.
- **Few-shot trajectory examples**: 1–3 complete example trajectories in the prompt
  teach the format far better than instructions alone. Include one example with a
  failed action and recovery — it teaches the agent that errors are normal and
  recoverable.
- **Termination**: the agent must know how to stop — a dedicated "finish" action
  with the final answer. Without it, agents loop until the context fills.
- **Thought quality as the lever**: the highest-ROI prompt engineering in ReAct is
  making thoughts specific. "What is my subgoal? What's missing? Why this action?"
  as a required thought structure transforms behavior.
- **Observation discipline**: long tool outputs should be summarized before
  appending, but the summary must preserve the facts the next thought needs.
  Summarize with the task in mind, not generically.

## Practical workflow

1. **Define the toolset narrowly.** 3–7 tools with crisp descriptions. Each tool:
   name, purpose, arguments, output format. The agent's action quality is bounded
   by tool clarity.
2. **Write trajectory demonstrations.** Craft 2–3 full Thought/Action/Observation
   examples for your domain, including one error-recovery example. These are the
   highest-leverage prompt content.
3. **Enforce thought structure.** Require thoughts to state: current subgoal,
   missing information, chosen action and why. Structured thoughts beat freeform
   musings.
4. **Set the loop mechanics.** Max iterations (10–25 typical), per-action timeout,
   strict action parsing with a re-prompt on malformed actions ("That action was
   invalid; valid actions are...").
5. **Run and read trajectories.** The debugging unit is the trajectory, not the
   final answer. For each failure, classify: bad thought (wrong plan), bad action
   (wrong tool/args), bad observation handling (ignored the result), or tool
   failure.
6. **Fix the dominant failure class.** Bad thoughts → better demonstrations or a
   planning step. Bad actions → clearer tool docs or argument validation. Ignored
   observations → prompt the agent to quote the relevant observation before
   acting.
7. **Add guardrails last.** Once the loop works: confirm-before-act for
   irreversible actions, budget caps, and a fallback answer when max iterations
   hit.

Checklist for a ReAct deployment:
- Trajectory examples include error recovery.
- Thought structure enforced (subgoal, missing info, why this action).
- Malformed actions re-prompted, not crashed on.
- Max iterations set with a graceful fallback.
- Irreversible actions gated behind confirmation.
- Trajectory logging enabled for debugging.

## Common pitfalls

- **Thoughtless acting.** If thoughts are generic filler, actions become random.
  Demand specific thoughts: subgoal, missing info, chosen action, why.
- **Observation blindness.** The agent gets the answer in an observation and keeps
  searching anyway. Prompt it to check "does the observation already answer the
  question?" before acting.
- **Tool descriptions written for humans.** Developers write terse docs; the agent
  needs argument examples and output shapes. Write docs for the model.
- **No error recovery.** The first failed tool call derails the trajectory.
  Demonstrate recovery in the few-shot examples and handle common errors in the
  loop.
- **Infinite loops.** The agent retries the same failing action. Detect repeated
  identical actions and intervene — force a different approach or abort.
- **Premature complexity.** Adding planners, memory, and sub-agents before the
  basic ReAct loop works on your task. Get the loop reliable first; most tasks
  never need more.
- **Summarizing away the state.** Aggressively compressing the trajectory
  mid-task destroys the agent's working memory. Summarize tool outputs, not the
  decision history.
- **No baseline comparison.** Building a fancier architecture without measuring
  against ReAct first. Often the fancy version isn't better — just more expensive.
