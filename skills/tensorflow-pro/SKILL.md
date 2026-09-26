---
name: tensorflow-pro
description: TensorFlow/Keras guidance — model building, tf.data pipelines, training, SavedModel, TF Serving, and TFLite.
category: development
---

## Overview

TensorFlow (with Keras as its high-level API) is the production-oriented deep learning framework: strong serving story (TF Serving, TFLite, TF.js), `tf.data` pipelines, and broad deployment targets from servers to phones to browsers. Keras 3's multi-backend design (TensorFlow/JAX/PyTorch) makes model code portable in a way the ecosystem hasn't had before.

This skill covers the modern TF/Keras workflow: building models with the Functional/Sequential APIs, efficient `tf.data` pipelines, training with `fit()` and custom loops, exporting SavedModels, and deploying via TF Serving and TFLite.

## When to use

- Building models with Keras (Functional or Sequential API).
- Writing efficient `tf.data` input pipelines.
- Training with `fit()` vs custom training loops.
- Exporting SavedModel and serving with TF Serving.
- Deploying to mobile/edge with TFLite.
- Choosing between TensorFlow, PyTorch, and JAX.

## Core concepts

- **Keras APIs.** Sequential (linear stacks), Functional (DAGs — most real models), Subclassing (full control, less tooling support). Prefer Functional: it supports serialization, plotting, and multi-input/output cleanly.
- **Layers as the vocabulary.** Dense, Conv2D, LSTM/GRU, Embedding, Attention/MultiHeadAttention, normalization (BatchNorm/LayerNorm), Dropout — compose from these; custom layers via subclassing with `build`/`call`.
- **`tf.data`.** The input pipeline: `Dataset.from_tensor_slices`/TFRecord readers, `.map()` (parallel), `.batch()`, `.prefetch(tf.data.AUTOTUNE)`, `.cache()` — pipeline performance determines GPU utilization. TFRecord + prefetch is the production pattern.
- **Training with `fit()`.** Compile (optimizer, loss, metrics) → `fit()` with callbacks (EarlyStopping, ModelCheckpoint, ReduceLROnPlateau, TensorBoard). `fit()` handles distribution, callbacks, and validation correctly — use it unless custom loops are truly needed.
- **Custom training loops.** `tf.GradientTape` for research-level control — forward pass in tape context, `tape.gradient`, `optimizer.apply_gradients`. More code, more responsibility (metrics, distribution) — reach for it only when `fit()` can't express the training.
- **Losses/metrics/optimizers.** `CategoricalCrossentropy`/`SparseCategoricalCrossentropy` (know which your labels need), `BinaryCrossentropy`; Adam/AdamW; metrics as running averages via `Metric` objects. Label-format/loss mismatches are a perennial bug.
- **Mixed precision.** `tf.keras.mixed_precision.set_global_policy('mixed_float16')` — one line, significant speedup on modern GPUs, with automatic loss scaling.
- **Distribution strategies.** `MirroredStrategy` (multi-GPU single host), `MultiWorkerMirroredStrategy` (multi-host) — often just wrapping model creation and `fit()`; batch size and LR scaling as with any distributed training.
- **Callbacks.** EarlyStopping (restore_best_weights=True), ModelCheckpoint (save best), TensorBoard, LearningRateScheduler — the training harness around `fit()`.
- **SavedModel.** The serialization format: `model.save()` / `tf.saved_model.save` — architecture + weights + signatures. The handoff format for TF Serving, TFLite conversion, and TF.js. Signatures define the serving API explicitly.
- **TF Serving.** Production server for SavedModels: versioned model directories, gRPC/REST APIs, model config for multi-model serving, canary versions. The boring-reliable serving path.
- **TFLite.** Mobile/edge deployment: conversion with quantization (dynamic range, full integer, float16) trading size/latency for accuracy — always evaluate post-quantization metrics. The `TFLiteConverter` + representative dataset for full-integer quantization.
- **TFX (awareness).** The end-to-end platform (ExampleGen → Transform → Trainer → Pusher) — full MLOps on TF; adopt when the pipeline complexity justifies it, not before.
- **Keras 3 multi-backend.** Same Keras code on TensorFlow/JAX/PyTorch backends — write portable model code; backend-specific ops are the exception.

## Practical workflow

1. **Build with the Functional API.** Explicit inputs/outputs, serializable, plottable:
   ```python
   inputs = keras.Input(shape=(224, 224, 3))
   x = keras.layers.Rescaling(1.0 / 255)(inputs)
   x = keras.layers.Conv2D(64, 3, activation="relu")(x)
   x = keras.layers.GlobalAveragePooling2D()(x)
   outputs = keras.layers.Dense(10, activation="softmax")(x)
   model = keras.Model(inputs, outputs)
   ```
2. **Write the `tf.data` pipeline.** Parallel maps, batching, prefetching — and verify throughput before training:
   ```python
   ds = tf.data.Dataset.from_tensor_slices((paths, labels))
   ds = ds.map(load_and_preprocess, num_parallel_calls=tf.data.AUTOTUNE)
   ds = ds.shuffle(10000).batch(64).prefetch(tf.data.AUTOTUNE)
   ```
3. **Compile and fit with callbacks.** The right loss for your label format; early stopping with best-weight restore:
   ```python
   model.compile(optimizer=keras.optimizers.AdamW(1e-3),
                 loss="sparse_categorical_crossentropy", metrics=["accuracy"])
   model.fit(train_ds, validation_data=val_ds, epochs=50, callbacks=[
       keras.callbacks.EarlyStopping(patience=5, restore_best_weights=True),
       keras.callbacks.ModelCheckpoint("best.keras", save_best_only=True),
       keras.callbacks.TensorBoard(log_dir="logs"),
   ])
   ```
4. **Enable mixed precision.** One line near the top; verify no NaN regressions.
5. **Scale distribution.** `MirroredStrategy` scope around model creation; scale batch/LR; verify scaling efficiency.
6. **Export SavedModel.** `model.export("saved_model/1")` with explicit signatures; test the exported artifact with the same inputs serving will send.
7. **Serve or convert.** TF Serving for server deployment (versioned dirs, REST/gRPC); TFLite converter with quantization for mobile/edge — always re-evaluate metrics after quantization.
8. **Monitor training.** TensorBoard from run one: loss curves, LR, histograms; the smoke test (overfit one batch) applies here too.

## Common pitfalls

- **Wrong loss for label format** — `categorical` vs `sparse_categorical` mismatch; match loss to labels.
- **Slow `tf.data`** — Python-level maps without parallelism/prefetch; AUTOTUNE + TFRecords.
- **Custom loops when `fit()` suffices** — reimplementing distribution/callbacks badly; default to `fit()`.
- **Forgetting `restore_best_weights`** — EarlyStopping returning the overfit final epoch; always restore.
- **No mixed precision** — leaving 2x performance on the table; one line to enable.
- **Quantization without re-evaluation** — TFLite accuracy drops unnoticed; evaluate the converted model.
- **Serving signature mismatches** — SavedModel signatures not matching client inputs; define and test signatures.
- **Subclassed models breaking tooling** — serialization/plotting issues; prefer Functional API.
- **BatchNorm in custom loops** — `training=True/False` not passed; silent train/infer discrepancy.
- **Shuffling without enough buffer** — poor randomization; adequate shuffle buffer or file-level shuffling.
- **Ignoring TensorBoard** — training blind; log from the first run.
- **TFX too early** — platform complexity for a single model; adopt with pipeline count.
- **Version skew TF/Serving** — SavedModel ops unsupported by the serving version; align versions.
