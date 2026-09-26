---
name: agents-pro
description: AI agent guidance — agent architecture, tool design, planning loops, guardrails, evaluation, and production agents.
category: development
---

## Overview

AI agents are LLMs that act: perceiving (tools, context), reasoning (planning, reflection), and acting (tool calls) in loops until a goal is reached. The spectrum runs from fixed pipelines (predictable) through ReAct loops (flexible) to fully autonomous agents (powerful, risky). Most production value lives in the middle: structured agentic workflows with explicit control flow.

This skill covers agent architecture done responsibly: the loop, tool design, planning strategies, guardrails, evaluation, and the production hardening that keeps agents useful instead of dangerous.

## When to use

- Designing AI agents (support, coding, research, ops).
- Choosing agent frameworks (LangGraph, CrewAI, raw loops).
- Designing tools for agents.
- Adding guardrails and human-in-the-loop.
- Evaluating agent performance.
- Debugging agent failures (loops, tool misuse).
- Deciding agents vs fixed pipelines.

## Core concepts

- **The agent loop.** Observe → think → act → observe... — the ReAct pattern: reasoning traces interleaved with tool calls. Everything else is elaboration on this loop. Understand it cold before adding frameworks.
- **Pipelines vs agents.** Fixed sequence (deterministic, cheap, debuggable) vs dynamic tool selection (flexible, expensive, emergent failure modes). Default to pipelines; use agents where the path genuinely can't be predetermined.
- **Tool design.** The agent's hands and its biggest lever: narrow scope, precise descriptions, typed inputs, informative errors, idempotent where possible. An agent is only as capable as its tools are well-designed. Fewer, better tools beat tool sprawl.
- **Planning.** ReAct (interleaved), plan-then-execute (upfront plan, then steps), reflection (self-critique loops), hierarchical (planner + executors). Match strategy to task: simple tasks need no explicit planning; complex ones need plan-then-execute with verification.
- **Memory.** Short-term (conversation/tool history in context — summarize when long), long-term (vector stores, knowledge bases), episodic (past task traces for learning). LangGraph checkpointing gives durable resumable state.
- **State machines (LangGraph-style).** Agents as explicit graphs: nodes, conditional edges, persistent state — control flow you can inspect and constrain. The answer to "my agent is uncontrollable": make the control flow explicit.
- **Guardrails.** Input validation, tool allowlists, output filtering, step/iteration caps, cost budgets, human-in-the-loop for consequential actions. Defense in depth — no single guardrail is sufficient.
- **Human-in-the-loop.** Approval gates before irreversible actions (payments, deletions, external sends); interrupt/resume patterns; the human as the ultimate tool. Design the UX of approval — friction where it matters, flow where it doesn't.
- **Failure modes.** Infinite loops (no progress detection), tool misuse (wrong args, wrong tool), hallucinated tool outputs (acting on invented data), context overflow (history eating the window), goal drift (losing the objective). Each needs a specific mitigation.
- **Evaluation.** Task success rate on realistic scenarios, trajectory evaluation (was the path sensible?), tool-call accuracy, cost/latency per task. Golden task sets run on every change — agent behavior is emergent; only measurement tames it.
- **Observability.** Full traces: reasoning, tool calls, inputs/outputs, latencies, tokens. LangSmith-style tracing is non-negotiable — debugging agents from final outputs is hopeless.
- **Multi-agent.** Specialized agents (planner, researcher, coder, critic) collaborating — powerful for complex tasks, but coordination overhead and failure multiplication are real. Single agent with good tools first; multi-agent when specialization clearly pays.
- **Cost control.** Token budgets per task, model tiering (cheap for simple steps, strong for hard reasoning), caching, early termination on success/failure detection. Agents burn tokens in loops — budget like it.
- **Security.** Prompt injection (untrusted tool outputs treated as instructions — validate and sandbox), least-privilege tools (the agent's tools are its attack surface), secrets handling, audit logs of all actions. Treat agent tool access like service account permissions.
- **Framework choice.** LangGraph (control + state), CrewAI (role-based teams), raw loops (full control, more code), managed (OpenAI/Anthropic agent APIs). Frameworks accelerate; the loop fundamentals transfer.
- **Verification.** A separate verifier (LLM or code) checking the agent's work — plan validators, output checkers; catches errors the actor misses.
- **Recovery.** Explicit error handling: tool failures → retry/fallback/replan; the difference between a demo and a system is what happens when tools fail.

## Practical workflow

1. **Define the task narrowly.** What inputs, what success looks like, what's out of scope — agents need bounded objectives; "be helpful" isn't one.
2. **Start with a pipeline.** Fixed steps with LLM calls where judgment is needed; measure. Graduate to agentic loops only for the steps that need dynamic decisions.
3. **Design the tools.** Narrow, described, typed, safe — then test tool selection on realistic inputs before building the loop:
   ```python
   @tool
   def search_tickets(query: str, status: str = "open") -> list[dict]:
       """Search support tickets by text query and status.
       Returns ticket id, subject, and last update. Use for investigating issues."""
       ...
   ```
4. **Build the loop with caps.** Max iterations, timeouts, progress detection (same action thrice = stuck), cost budget — the guardrails are part of v1, not v2.
   ```python
   for step in range(MAX_STEPS):           # iteration cap: the essential guardrail
       thought, action = llm.think(state)   # reason, then choose a tool call
       if action.name == "finish":
           return action.result
       observation = tools[action.name](**action.args)  # execute; validate output
       state = update(state, thought, action, observation)
   raise AgentStuckError("max steps reached")
   ```

5. **Add human gates.** Approval before irreversible actions; clear UX showing what the agent wants to do and why.
6. **Trace everything.** Full observability from the first run; review traces of failures — the trace is where agent debugging happens.
7. **Evaluate on golden tasks.** Realistic scenarios with success criteria; trajectory review; run on every prompt/tool/model change.
8. **Harden and monitor.** Rate limits, budgets, alerting on anomalies (cost spikes, failure rates, unusual tool use); incident runbooks for misbehaving agents; kill switches.

## Common pitfalls

- **Agents for pipeline problems** — dynamic loops where fixed steps work; cost and flakiness.
- **Tool sprawl** — 30 vague tools; narrow, well-described, few.
- **No iteration caps** — infinite loops burning money; caps + progress detection.
- **Missing human gates** — irreversible actions without approval; gate consequential tools.
- **No tracing** — debugging from outputs; full traces from day one.
- **Prompt injection naivety** — untrusted tool outputs as instructions; validate and sandbox.
- **Over-powerful tools** — delete/prod-write tools on a v1 agent; least privilege.
- **No evals** — emergent behavior unmeasured; golden task sets.
- **Context overflow** — unbounded history; summarize/prune deliberately.
- **Multi-agent prematurely** — coordination overhead for simple tasks; single agent first.
- **Ignoring cost** — token burn in loops; budgets per task.
- **No kill switch** — runaway agents unstoppable; operational controls.
- **Goal drift** — long runs losing the objective; re-anchor goals, verify milestones.
- **No verification** — the agent's word taken as truth; verify consequential outputs independently.
- **Brittle tool error handling** — one failed call killing the run; retry/fallback/replan by design.
