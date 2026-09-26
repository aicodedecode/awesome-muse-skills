---
name: datasets-library
description: Manage ML datasets with the datasets ecosystem — loading, streaming, preprocessing, versioning, and sharing. Use when data handling (not modeling) is the bottleneck.
category: ai-research
---

# Datasets Library

Models get the glory; datasets decide the outcome. The datasets ecosystem gives you: one-line 
loading of thousands of public datasets, memory-mapped access to data bigger than RAM, streaming 
for internet-scale corpora, and versioned, shareable dataset artifacts.

## Overview

The core abstractions: Dataset (an Arrow-backed table — fast, memory-mapped, sliceable), 
DatasetDict (train/validation/test splits together), and streaming mode (iterate without 
downloading). Processing is functional: `map` for transforms, `filter` for selection, `shuffle`, 
`select`, `train_test_split` — all returning new dataset objects, lazily evaluated and cached. 
Push to the hub to version and share.

## When to use

- Loading public datasets for training or evaluation without wrestling with formats.
- Preprocessing large corpora: tokenization, filtering, deduplication at scale.
- Streaming datasets too large to download.
- Versioning and sharing your own datasets reproducibly.

## Core concepts

- **Arrow backing**: columnar, memory-mapped storage — datasets larger than RAM are sliceable 
without loading. Understand this and stop worrying about size.
- **Lazy maps**: `map` with batching and multiprocessing, cached to disk. Write the transform once; 
it runs in parallel and caches.
- **Streaming**: iterate over massive datasets without downloading — for exploration and 
single-pass training. (Shuffling is approximate in streaming; know the trade-off.)
- **Splits**: train/validation/test as a DatasetDict; stratified splits for imbalanced data; 
deterministic seeds for reproducibility.
- **Features schema**: typed columns (including nested structures, images, audio). Define the 
schema; it validates your data and documents it.
- **Versioning**: datasets versioned like code — push to the hub with a revision, pin it in 
training configs. "Which data trained this model?" should always have an answer.

## Practical workflow

1. Load and inspect: look at examples, check the features schema, verify splits and sizes.
2. Write preprocessing as batched `map` functions: tokenization, cleaning, filtering. Cache the 
result.
3. Validate the processed data: sample outputs, check label distributions, verify no leakage 
between splits.
4. For huge data: switch to streaming for exploration; materialize only what's needed.
5. Version the final dataset: push with a clear name, README (documenting source, processing, 
license), and pinned revision.
6. Reference the pinned revision in every training run — data version is part of the experiment.

```text
Dataset pipeline:
load → inspect (examples, schema, splits)
→ map (tokenize/clean, batched, cached)
→ filter (quality, dedupe)
→ validate (samples, distributions, leakage check)
→ split (deterministic) → version (push + pin)
```

## Common pitfalls

- **Uninspected data**: training on a dataset you never looked at. Sample everything; surprises are 
the norm.
- **Leakage between splits**: duplicates or near-duplicates across train/test. Deduplicate globally 
before splitting.
- **Unversioned data**: "the dataset" changing under you. Pin revisions; treat data as code.
- **Streaming shuffle naivety**: assuming streaming shuffles perfectly. It approximates — buffer 
size matters.
- **License blindness**: public dataset ≠ free to use commercially. Check licenses before 
training products on data.
- **Preprocessing in training code**: tokenization buried in the training script, uncached, rerun 
every time. Preprocess once, cache, version.
