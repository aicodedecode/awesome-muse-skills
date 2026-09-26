---
name: langchain-pro
description: LangChain guidance — chains, agents, tools, RAG pipelines, LangGraph, evaluation, and production hardening.
category: development
---

## Overview

LangChain is the framework for LLM applications: chains (composable LLM calls), agents (LLMs using tools), RAG pipelines, and LangGraph (stateful, controllable agent workflows). The ecosystem moves fast — today's best practice is LangGraph for agents, LCEL (LangChain Expression Language) for chains, and skepticism toward anything magical.

This skill covers building LLM apps that work in production: prompt management, structured output, tool design, RAG done right, LangGraph agents, evaluation, and the hardening (cost, latency, reliability) that separates demos from products.

## When to use

- Building RAG applications.
- Creating agents with tools.
- Choosing between chains, agents, and LangGraph.
- Getting structured output from LLMs.
- Evaluating LLM application quality.
- Debugging LangChain/LangGraph apps (LangSmith).
- Productionizing LLM apps (cost, latency, reliability).

## Core concepts

- **LCEL (runnables).** The composition language: `prompt | model | parser` — pipe-based chains with streaming, batching, and async built in. Prefer LCEL over legacy Chain classes; it's the stable core.
- **Prompts as code.** `ChatPromptTemplate` with variables, system/human message structure, few-shot examples — versioned in git, not hidden in strings. Prompt changes are code changes: review and test them.
- **Structured output.** `with_structured_output(PydanticModel)` — constrained generation into schemas; the bridge from LLM text to application logic. Always validate; models still make schema mistakes under pressure.
- **Tools.** Python functions with clear names, descriptions, and typed args (`@tool`) — the agent's hands. Tool design determines agent success: narrow, well-described, idempotent where possible, with useful error messages.
- **Agents vs chains.** Chains: fixed sequence (predictable, cheap, debuggable). Agents: LLM decides tool calls dynamically (flexible, expensive, less predictable). Start with chains; graduate to agents when the workflow genuinely needs dynamic decisions.
- **LangGraph.** Stateful agent workflows as graphs: nodes (LLM calls, tools), edges (conditional routing), persistent state, human-in-the-loop interrupts. The answer to "my agent is uncontrollable" — explicit control flow with LLM flexibility.
- **Memory.** Conversation state: short-term (message history, summarized when long), long-term (vector/persistent stores). LangGraph's checkpointing gives durable, resumable agent state — threads that survive restarts.
- **RAG.** Retrieve-then-generate: chunk documents → embed → vector store → retrieve top-k → stuff into prompt → generate. The unglamorous truth: chunking quality and retrieval evaluation matter more than the LLM choice.
- **Retrieval tuning.** Chunk size/overlap, hybrid search (dense + BM25), reranking (cross-encoders), metadata filtering, query rewriting — each a lever; evaluate retrieval (hit rate, MRR) independently of generation.
- **Evaluation.** LLM-as-judge (with rubrics, not vibes), deterministic checks (schema validity, citation presence), golden datasets, regression sets on prompt changes. LangSmith datasets + evaluators; eval before every prompt/model change.
- **Streaming.** Token streaming for UX (`.stream()`/`.astream()`), streaming with structured output and tool calls — latency perception matters as much as latency.
- **Cost/latency control.** Model selection per task (small for classification, large for reasoning), caching (exact + semantic), batching, max-tokens limits, timeout/retry policies. Log tokens per request; set budgets.
- **Reliability.** Retries with backoff, fallbacks (model → model), validation of outputs, circuit breakers on tool failures, human-in-the-loop for consequential actions. LLM apps fail in creative ways — design for it.
- **Observability (LangSmith).** Traces of every run: prompts, tool calls, latencies, tokens, errors. Non-negotiable for debugging agents — without traces you're guessing.
- **Security.** Prompt injection awareness (untrusted content in context), tool allowlisting, output validation, no sensitive data in prompts to third-party APIs, least-privilege tools (an agent's tools are its attack surface).

## Practical workflow

1. **Start with the simplest chain.** Prompt → model → parser in LCEL; prove value before adding agents:
   ```python
   from langchain_core.prompts import ChatPromptTemplate
   from langchain_core.output_parsers import StrOutputParser

   prompt = ChatPromptTemplate.from_messages([
       ("system", "You are a support analyst. Answer only from the context."),
       ("human", "Context:\n{context}\n\nQuestion: {question}"),
   ])
   chain = prompt | model | StrOutputParser()
   ```
2. **Add structured output.** Pydantic schemas for anything downstream consumes; validate and handle validation failures explicitly.
3. **Build RAG deliberately.** Chunk thoughtfully (semantic boundaries, overlap), evaluate retrieval separately, add reranking before blaming the LLM:
   ```python
   from langchain_core.runnables import RunnablePassthrough

   rag = (
       {"context": retriever | format_docs, "question": RunnablePassthrough()}
       | prompt | model | StrOutputParser()
   )
   ```
4. **Graduate to LangGraph for agents.** Explicit nodes/edges/state; human-in-the-loop interrupts for consequential steps; checkpointing for durability.
5. **Design tools well.** Narrow scope, great descriptions, typed args, informative errors — then test the agent's tool selection on realistic inputs.
6. **Evaluate continuously.** Golden dataset + LLM-judge with rubrics + deterministic checks; run evals on every prompt/model change; track regressions.
7. **Harden for production.** Timeouts, retries, fallbacks, token budgets, output validation, LangSmith tracing, cost dashboards. Load-test the agent paths, not just the model calls.
8. **Secure the surface.** Treat retrieved/untrusted content as data, not instructions; least-privilege tools; audit what the agent can do before exposing it.

## Common pitfalls

- **Agents for chain problems** — dynamic tool-calling where a fixed pipeline works; cost and flakiness for nothing.
- **Unevaluated RAG** — blaming the LLM for retrieval failures; measure retrieval separately.
- **Bad chunking** — arbitrary splits destroying context; semantic boundaries + overlap.
- **No evals** — prompt changes by vibes; golden datasets + judges.
- **Unbounded agent loops** — no step limits or timeouts; cap iterations, add circuit breakers.
- **Ignoring token costs** — no budgets or logging; cost per request tracked from day one.
- **No tracing** — debugging agents blind; LangSmith (or equivalent) from the start.
- **Over-powerful tools** — agents with destructive tools and no confirmation; least privilege + human-in-the-loop.
- **Prompt injection naivety** — untrusted content treated as instructions; validate and sandbox.
- **Legacy Chain classes** — deprecated abstractions; LCEL and LangGraph are the current core.
- **No structured output** — regex-parsing LLM text; schemas + validation.
- **Streaming ignored** — 30s of silence; stream tokens for perceived latency.
- **Model maximalism** — largest model for every subtask; right-size per step.
