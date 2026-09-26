---
name: tokenizers
description: Understand and work with tokenizers — BPE, WordPiece, Unigram, special tokens, and the practical effects of tokenization on cost and quality. Use when token counts, chunking, or model inputs misbehave.
category: ai-research
---

# Tokenizers

Tokenizers turn text into the integer sequences models actually process. They're invisible until 
they cause problems: surprising costs, broken chunking, or corrupted inputs. Understanding them 
turns those mysteries into mechanics.

## Overview

Modern tokenizers learn subword vocabularies from data (BPE merges frequent pairs; WordPiece and 
Unigram have their own strategies), then split text into those pieces. Key consequences: token 
count ≠ word count (varies by language and content — code and non-English text tokenize less 
efficiently), special tokens mark boundaries and roles, and detokenization isn't always the exact 
inverse. Every model has its own tokenizer — using the wrong one corrupts inputs silently.

## When to use

- Estimating costs: tokens are the billing unit — count with the right tokenizer.
- Debugging "the model saw something different": encoding issues, truncation surprises.
- Designing chunking for RAG: chunk by tokens, not characters.
- Working with structured formats: JSON, code, and special tokens need care.

## Core concepts

- **Subword algorithms**: BPE (merge frequent pairs), WordPiece (likelihood-based merges), Unigram 
(probabilistic pruning). Different trade-offs; what matters is which one your model uses.
- **Vocabulary**: the learned piece inventory, typically 30k–200k entries. Larger vocabs tokenize 
more efficiently (fewer tokens per text) but need bigger embedding tables.
- **Special tokens**: BOS/EOS markers, padding, separators, and chat-template tokens (`<|user|>`, 
etc.). Chat templates are tokenizer-level — apply them via the tokenizer, not by hand.
- **Fertility**: tokens per word — varies wildly by language and domain. English prose ~1.3; code 
higher; some languages 2–3×. Budget multilingual contexts accordingly.
- **Encode/decode round-trip**: decoding isn't always exact (whitespace handling, byte fallbacks). 
Test round-trips for pipelines that reconstruct text.
- **Pre-tokenization**: how text is split before BPE (whitespace, punctuation rules). Explains many 
"why did it split there?" mysteries.

## Practical workflow

1. Identify the model's actual tokenizer — never assume; load it from the model's own artifacts.
2. For cost estimation: tokenize representative inputs with that tokenizer, not a generic counter.
3. For chunking: chunk on token boundaries with the model's tokenizer; account for special tokens 
added by chat templates.
4. When debugging inputs: decode what the model actually received — compare against what you 
intended.
5. Apply chat templates through the tokenizer's template support; verify the rendered format 
matches documentation.
6. For multilingual work: measure fertility per language; adjust context budgets per language.

```text
Tokenizer debugging checklist:
[ ] Using the model's own tokenizer (not a generic one)
[ ] Chat template applied via tokenizer, output verified
[ ] Token counts measured on real inputs per language
[ ] Special tokens accounted for in budgets
[ ] Round-trip tested for reconstruction pipelines
```

## Common pitfalls

- **Wrong tokenizer**: counting or chunking with a different tokenizer than the model uses. 
Silently wrong everywhere.
- **Hand-rolled chat templates**: formatting `<|user|>` blocks manually and getting subtle details 
wrong. Use the tokenizer's template.
- **Character-based chunking**: splitting mid-token or mid-word for RAG. Chunk by tokens with 
overlap.
- **Ignoring fertility**: budgeting English token counts for multilingual content. Measure per 
language.
- **Truncation surprises**: tokenizers truncate silently at limits. Check lengths; truncate 
deliberately with the right strategy (head, tail, or middle).
- **Byte-fallback blindness**: rare characters becoming multi-token byte sequences. Affects cost 
and sometimes quality for unusual scripts.
