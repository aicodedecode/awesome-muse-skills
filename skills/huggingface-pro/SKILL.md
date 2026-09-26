---
name: huggingface-pro
description: Hugging Face guidance — Hub, Transformers, datasets, fine-tuning, inference endpoints, and Spaces.
category: development
---

## Overview

Hugging Face is the GitHub of machine learning: the Hub hosts millions of models and datasets, Transformers is the standard library for using them, and the surrounding tools (Datasets, PEFT, TRL, Inference Endpoints, Spaces) cover the journey from pretrained checkpoint to production. Most teams' ML work starts with "find a good base model on the Hub."

This skill covers the Hub workflow: finding and evaluating models, using Transformers (pipelines, tokenizers, training), datasets at scale, efficient fine-tuning (LoRA/QLoRA), and deployment options.

## When to use

- Finding pretrained models or datasets.
- Using Transformers for inference or fine-tuning.
- Fine-tuning efficiently (LoRA/QLoRA).
- Working with large datasets (streaming, preprocessing).
- Deploying models (Inference Endpoints, self-hosted).
- Building demos with Spaces.

## Core concepts

- **The Hub.** Model/dataset repos with cards, versioning, and gated access. Model cards document intended use, training data, limitations, and evals — read them before adopting; a model without a card is a stranger.
- **Model selection.** Task tags, downloads/likes (popularity ≠ quality), eval results (Open LLM Leaderboard), license (commercial use?), architecture fit. Shortlist 2-3, evaluate on your data — never adopt on vibes.
- **Transformers pipelines.** `pipeline("sentiment-analysis")` — the fastest path from model to working inference; great for prototyping, not for production control.
- **Tokenizers.** `AutoTokenizer` — the model's required preprocessing; never swap tokenizers between models. `max_length`/truncation/padding handled via tokenizer calls; chat templates (`apply_chat_template`) for instruction models.
- **The model API.** `AutoModelForCausalLM` / `SequenceClassification` / etc. — `from_pretrained` loads weights + config; `generate()` parameters (temperature, top_p, max_new_tokens, do_sample) control decoding. `model.eval()` + `torch.no_grad()` for inference.
- **Datasets library.** Memory-mapped, cached, streaming datasets — `load_dataset` with streaming for data bigger than disk; `.map()` (batched, parallel, cached) for tokenization. The preprocessing is cached — reruns are free.
- **Training.** `Trainer`/`TrainingArguments` (or TRL's `SFTTrainer` for instruction tuning) — mixed precision, gradient accumulation, checkpointing, logging built in. Start from proven training scripts, don't hand-roll loops initially.
- **PEFT/LoRA.** Parameter-efficient fine-tuning: train small adapter matrices instead of full weights — fine-tune 70B-class models on single GPUs. LoRA rank/alpha, target modules; adapters are swappable and shareable. QLoRA (4-bit base + LoRA) for the biggest models on limited VRAM.
- **Quantization.** `bitsandbytes` 8/4-bit loading for inference on smaller GPUs; GPTQ/AWQ for quantized deployment; always evaluate post-quantization — quality drops are task-dependent.
- **Evaluation.** `evaluate` library + task metrics; eval on your data, not just benchmarks — benchmark scores don't transfer to your distribution. LLM-as-judge for generative tasks.
- **Inference Endpoints.** Managed dedicated inference on the Hub — autoscaling, private models, no infra management. The "just serve it" option.
- **Self-hosted serving.** Text Generation Inference (TGI) / vLLM for OpenAI-compatible serving with tensor parallelism, continuous batching, quantization — the production path for open models.
- **Spaces.** Gradio/Streamlit demos hosted on the Hub — the fastest way to share an interactive demo; also useful for internal tools.
- **Licensing.** Model licenses vary wildly (Apache, MIT, LLaMA community, gated commercial) — check before commercial use; gated models need access approval and token auth.
- **Security.** Pickle-based formats (`pytorch_model.bin`) can execute code on load — prefer `safetensors`; verify model sources; `trust_remote_code` only for code you trust (it runs arbitrary Python).

## Practical workflow

1. **Select deliberately.** Hub search by task → read model cards → check license → shortlist → evaluate on your data:
   ```python
   from transformers import AutoTokenizer, AutoModelForSequenceClassification
   tok = AutoTokenizer.from_pretrained("cardiffnlp/twitter-roberta-base-sentiment-latest")
   model = AutoModelForSequenceClassification.from_pretrained(
       "cardiffnlp/twitter-roberta-base-sentiment-latest")
   ```
2. **Prototype with pipelines.** Validate the approach end-to-end before investing in training infra.
3. **Prepare data with Datasets.** Streaming for large corpora; batched `.map` tokenization (cached); train/validation splits recorded.
   ```python
   from datasets import load_dataset
   ds = load_dataset("imdb", split="train")
   ds = ds.map(lambda b: tok(b["text"], truncation=True), batched=True)
   ```
4. **Fine-tune with PEFT.** LoRA adapters via PEFT + TRL's SFTTrainer for instruction tuning; full fine-tuning only for small models or when adapters underperform.
   ```python
   from peft import LoraConfig, get_peft_model
   peft_config = LoraConfig(r=16, lora_alpha=32,
                            target_modules=["q_proj", "v_proj"],
                            task_type="CAUSAL_LM")
   model = get_peft_model(model, peft_config)
   ```
5. **Evaluate on your distribution.** Task metrics + qualitative review; compare against the base model and your baselines; check for regressions on previously-good cases.
6. **Quantize for deployment.** Bitsandbytes/AWQ/GPTQ per target hardware; re-evaluate after quantization — accept only measured quality.
7. **Serve properly.** Inference Endpoints for managed, TGI/vLLM self-hosted for control; OpenAI-compatible APIs ease client migration; load-test before launch.
8. **Share via Spaces.** Gradio demo for stakeholders; model card updated with your fine-tune details; versioned Hub repo.

## Common pitfalls

- **Adopting on popularity** — downloads ≠ quality on your data; evaluate shortlisted models.
- **Ignoring model cards/licenses** — commercial use of restricted models; read before adopting.
- **Wrong tokenizer** — mismatched tokenization; always the model's own via AutoTokenizer.
- **Full fine-tuning by default** — expensive and often unnecessary; LoRA first.
- **No post-quantization eval** — silent quality drops; measure after every quantization.
- **`trust_remote_code=True` blindly** — arbitrary code execution; trust deliberately.
- **Pickle model files** — code execution on load; prefer safetensors.
- **Benchmark-only evaluation** — leaderboard scores ≠ your distribution; eval on your data.
- **Chat template ignored** — instruction models without `apply_chat_template`; formatting matters.
- **Training without baselines** — fine-tune vs base vs simple alternatives; know the delta.
- **Hub as the only backup** — fine-tuned adapters only on the Hub; keep local versioned copies.
- **VRAM surprises** — OOM mid-training; estimate memory (params × bytes × optimizer multiplier) before launching.
- **No inference optimization** — naive `generate()` in production; vLLM/TGI with batching and quantization.
