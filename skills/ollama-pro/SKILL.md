---
name: ollama-pro
description: Ollama guidance — running local LLMs, model selection, Modelfiles, API usage, and RAG/agent integration.
category: development
---

## Overview

Ollama is the easiest way to run open LLMs locally: `ollama run llama3.1` and you have a model on your machine — no cloud, no API keys, no data leaving your network. It manages model downloads, quantization, GPU offloading, and exposes an OpenAI-compatible API that plugs into existing tooling.

Local models trade raw capability for privacy, cost (after hardware), latency control, and offline operation. This skill covers running Ollama well: model selection, Modelfiles, the API, and integrating local models into RAG and agent workflows.

## When to use

- Running LLMs locally (privacy, offline, cost).
- Choosing local models (size vs quality vs hardware).
- Customizing models with Modelfiles.
- Using the Ollama API (including OpenAI-compatible endpoints).
- Building RAG/agents on local models.
- Deciding local vs cloud models.

## Core concepts

- **The model library.** `ollama pull llama3.1:8b` — versioned models with size tags (`8b`, `70b`), quantization variants (`q4_0`, `q8_0`), and variants (instruct, vision, code, embedding). Tags encode the size/quantization tradeoff.
- **Quantization.** Q4_K_M default — ~4 bits per weight, big quality retention; Q8 for more quality, smaller quants for tight VRAM. Quantization is why 70B models run on consumer hardware.
- **Hardware fit.** Rule of thumb: ~0.5GB VRAM per billion params at Q4 (plus context overhead). 8B ≈ fits 8GB GPUs; 70B needs ~40GB+ or CPU offload (slow). Match model to hardware, not ambition.
- **Modelfiles.** `FROM`, `PARAMETER` (temperature, num_ctx), `SYSTEM`, `TEMPLATE`, `ADAPTER` — declarative model customization; versioned in git like Dockerfiles. Custom system prompts and defaults without code.
- **The API.** `POST /api/generate` (completion), `/api/chat` (messages), `/api/embed` (embeddings) — plus OpenAI-compatible endpoints (`/v1/chat/completions`) that drop into existing clients. `ollama ps` shows loaded models.
- **Context window.** `num_ctx` parameter — larger contexts need more memory (KV cache scales with context); set per use case, not maximally.
- **GPU offloading.** `num_gpu` layers offloaded; partial offload splits CPU/GPU (slower but fits bigger models). Ollama auto-detects; override when tuning.
- **Keep-alive.** Models unload after inactivity (`keep_alive`) — preload latency-sensitive models (`ollama run` once, or `keep_alive: -1`); balance VRAM across concurrently-needed models.
- **Embeddings.** `nomic-embed-text`, `mxbai-embed-large` — local embeddings for RAG; quality close enough for most retrieval, zero API cost, private.
- **Vision models.** `llama3.2-vision`, `llava` — image understanding locally; quality behind frontier APIs but sufficient for many tasks (document QA, classification).
- **Tool use.** Supported in recent models/APIs (`tools` parameter) — local agents are viable for well-scoped tools; weaker instruction-following than frontier models means simpler tools and more validation.
- **RAG integration.** Ollama (LLM + embeddings) + your vector store (Chroma, Qdrant, pgvector) = fully local RAG. LangChain/LlamaIndex both have Ollama integrations — swap the model layer, keep the pipeline.
- **Evals for local models.** Smaller models fail differently (instruction-following, JSON validity, reasoning depth) — eval your actual tasks on the actual model; don't assume cloud-model prompts transfer.
- **Updates.** `ollama pull` refreshes models; pin versions for reproducibility (`:8b` vs `:latest` semantics); test after updates — model updates change behavior.

## Practical workflow

1. **Size to hardware.** Check VRAM/RAM, pick the largest model that fits comfortably at Q4 with your context needs:
   ```bash
   ollama pull llama3.1:8b        # ~5GB, solid general use
   ollama pull qwen2.5-coder:32b  # coding tasks, needs ~20GB
   ollama pull nomic-embed-text   # local embeddings
   ```
2. **Customize with Modelfiles.** System prompts, parameters, context size — versioned:
   ```
   FROM llama3.1:8b
   PARAMETER temperature 0
   PARAMETER num_ctx 8192
   SYSTEM """
   You are a code reviewer. Be terse. Flag only real issues.
   """
   ```
   ```bash
   ollama create reviewer -f Modelfile
   ```
3. **Use the API.** Chat, generate, embeddings — or the OpenAI-compatible endpoint for existing clients:
   ```bash
   curl http://localhost:11434/api/chat -d '{
     "model": "llama3.1:8b",
     "messages": [{"role": "user", "content": "Explain KV caching briefly."}],
     "stream": false
   }'
   ```
4. **Wire into RAG.** Local embeddings + vector store + Ollama generation — the private RAG stack; evaluate retrieval and generation on your corpus.
5. **Tune serving.** `keep_alive` for hot models, `num_ctx` per use case, concurrent request limits; monitor tokens/sec per model.
6. **Evaluate honestly.** Run your task evals on the local model; identify where it underperforms cloud models (usually: complex reasoning, strict JSON, long instructions) and design around it (simpler prompts, validation, fallbacks).
7. **Hybrid architectures.** Local for private/bulk/simple, cloud for hard reasoning — route by task sensitivity and difficulty, not ideology.
8. **Keep updated deliberately.** Pin versions in production; test model updates against evals before rolling.

## Common pitfalls

- **Model bigger than hardware** — swapping to death; size to actual VRAM/RAM.
- **Default context too small/large** — truncated inputs or wasted memory; `num_ctx` per use case.
- **Cloud prompts on local models** — complex prompts failing on 8B models; simplify, validate outputs.
- **No output validation** — weaker JSON adherence; schema-validate everything.
- **Ignoring keep-alive** — cold-start latency on every request; preload hot models.
- **Unpinned `:latest`** — silent model updates changing behavior; pin versions.
- **Local-only dogma** — struggling with tasks needing frontier reasoning; hybrid routing.
- **Embedding mismatch** — different embedding model than the index was built with; keep them paired.
- **No evals** — assuming parity with cloud models; measure on your tasks.
- **VRAM contention** — multiple large models fighting; plan concurrent model sets.
- **CPU offload surprises** — 70B "running" at 2 tok/s; know your throughput requirements.
- **Secrets in Modelfiles** — API keys baked into shared files; keep secrets out.
- **Skipping quantization awareness** — tiny quants for quality-critical tasks; match quant to need.
