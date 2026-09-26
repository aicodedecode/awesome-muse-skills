---
name: pytorch-pro
description: PyTorch guidance — tensors, autograd, training loops, DataLoader, distributed training, and production inference.
category: development
---

## Overview

PyTorch is the dominant framework for deep learning research and increasingly for production: dynamic computation graphs, Pythonic APIs, and an ecosystem (torchvision, torchaudio, Hugging Face, Lightning) that covers most use cases. Its imperative style makes debugging intuitive — you can print tensors mid-forward-pass like any Python code.

This skill covers the PyTorch fundamentals that transfer everywhere: tensors and autograd, correct training loops, efficient data loading, distributed training, and the path to production inference (TorchScript, ONNX, TensorRT, torch.compile).

## When to use

- Building or debugging PyTorch models.
- Writing correct training loops (train/eval modes, gradient handling).
- Optimizing data loading (DataLoader bottlenecks).
- Training on multiple GPUs (DDP).
- Exporting models for production inference.
- Choosing between PyTorch, TensorFlow, and JAX.

## Core concepts

- **Tensors.** The core data structure: `torch.tensor`, shapes/dtypes/devices. Think in shapes — most bugs are shape mismatches; print shapes liberally while developing. `device` discipline (`.to(device)`) avoids CPU/GPU mixing errors.
- **Autograd.** Automatic differentiation: operations on `requires_grad=True` tensors build a graph; `loss.backward()` computes gradients. `torch.no_grad()` for inference (saves memory, disables graph); `detach()` to cut graph edges.
- **nn.Module.** The building block: `__init__` defines layers, `forward` defines computation. `model.train()` vs `model.eval()` — dropout/BatchNorm behave differently; forgetting `eval()` at inference is a classic silent bug.
- **Training loop anatomy.** Zero grads → forward → loss → backward → optimizer step. `optimizer.zero_grad()` placement matters (gradients accumulate by default — a feature for accumulation, a bug when forgotten).
- **DataLoader.** `Dataset` + `DataLoader`: `num_workers` for parallel loading, `pin_memory` for GPU transfer speed, custom `collate_fn` for variable-length data. Data loading is the usual bottleneck — profile it (`nvidia-smi` showing idle GPU = starved pipeline).
- **Losses and optimizers.** CrossEntropyLoss (classification), MSE/BCE variants; Adam/AdamW defaults, SGD with momentum for some vision tasks; learning-rate schedulers (cosine, OneCycle, ReduceLROnPlateau). AdamW + cosine is the strong default.
- **Mixed precision.** `torch.cuda.amp` (autocast + GradScaler): ~2x speedup, half memory, with loss scaling for stability. Nearly free performance — use it unless you have a reason not to.
- **Gradient clipping/accumulation.** Clip (`clip_grad_norm_`) for RNNs/transformers stability; accumulation (`loss / k`, step every k batches) for effective large batches on limited VRAM.
- **Checkpointing.** Save `model.state_dict()` + `optimizer.state_dict()` + epoch + scheduler + RNG states — resumable training needs all of these, not just weights. Save best + latest.
- **Distributed (DDP).** `DistributedDataParallel` — one process per GPU, gradients averaged. `torchrun` launcher; `DistributedSampler` for the DataLoader; sync BatchNorm where needed. DDP (not DataParallel) is the correct multi-GPU approach.
- **torch.compile.** The 2.0+ compiler: often 30%+ speedup with one line (`torch.compile(model)`). Graph breaks from data-dependent control flow reduce gains — write compile-friendly code (avoid Python branching on tensor values in hot paths).
- **Inference optimization.** `model.eval()` + `torch.no_grad()`/`inference_mode()`; export paths: TorchScript (C++ runtime), ONNX (cross-framework), TensorRT (NVIDIA GPUs, max perf), quantization (INT8 for CPU/latency). Choose by deployment target.
- **Debugging.** NaN hunting (check loss per batch, `torch.autograd.set_detect_anomaly(True)` for the guilty op), shape printing, overfitting a single batch as a smoke test (if it can't overfit 10 samples, something's broken).
- **Ecosystem.** torchvision/torchaudio/huggingface for pretrained models; PyTorch Lightning for training-loop structure; `torchmetrics` for correct metric computation.

## Practical workflow

1. **Write the correct loop.** Train/eval modes, zero grads, no-grad inference — the template:
   ```python
   for epoch in range(epochs):
       model.train()
       for x, y in train_loader:
           x, y = x.to(device), y.to(device)
           optimizer.zero_grad()
           with torch.autocast(device_type="cuda", dtype=torch.float16):
               loss = criterion(model(x), y)
           scaler.scale(loss).backward()
           scaler.unscale_(optimizer)
           torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
           scaler.step(optimizer); scaler.update()
       # validation
       model.eval()
       with torch.inference_mode():
           val_loss = sum(criterion(model(x.to(device)), y.to(device))
                          for x, y in val_loader) / len(val_loader)
   ```
2. **Smoke-test first.** Overfit a single batch — if loss doesn't → ~0, debug before full training (LR, data, labels, architecture).
3. **Fix data loading.** `num_workers=4+`, `pin_memory=True`, profile GPU utilization; move preprocessing (tokenization, augmentation) into the pipeline, not the training step.
4. **Scale with DDP.** `torchrun --nproc_per_node=4 train.py`; DDP wrap; DistributedSampler; scale LR with batch size (linear scaling rule as starting point).
5. **Checkpoint completely.** state_dicts for model+optimizer+scheduler, epoch, RNG states; save best-by-val and latest; test resume once.
6. **Compile and export.** `torch.compile` for training/inference speed; export to ONNX/TensorRT/quantized for deployment targets; benchmark latency/throughput per export.
7. **Monitor training.** Loss curves, LR schedule, gradient norms, GPU util/memory — W&B/MLflow from run one. Diverging loss? Check LR, data normalization, and label correctness first.
8. **Serve efficiently.** Batch inference requests, `inference_mode()`, right-sized instances; the deployment format (ONNX/TensorRT) chosen by latency requirements.

## Common pitfalls

- **Forgetting `model.eval()`** — dropout/BatchNorm active at inference; silent quality drop.
- **Forgetting `zero_grad()`** — gradients accumulating unintentionally; loss behaves strangely.
- **No `torch.no_grad()` at inference** — graph building wasting memory; `inference_mode()` is stricter.
- **DataLoader bottleneck** — GPU idle; `num_workers`, `pin_memory`, pipeline preprocessing.
- **Using DataParallel** — deprecated, slower; DDP with `torchrun`.
- **NaNs unchecked** — training diverging silently; anomaly detection + per-batch loss logging.
- **Wrong device mixing** — CPU tensor + CUDA tensor errors; consistent `.to(device)`.
- **Saving whole model instead of state_dict** — pickle fragility; `state_dict` + architecture code.
- **Incomplete checkpoints** — weights only, can't resume optimizer/scheduler; save everything.
- **LR not scaled with batch size** — DDP batch growth without LR adjustment; linear scaling starting point.
- **Compile-unfriendly code** — data-dependent Python branching killing `torch.compile` gains; restructure hot paths.
- **No smoke test** — full training on a broken setup; overfit-one-batch first.
- **Metric bugs** — wrong averaging across batches; `torchmetrics` or careful accumulation.
