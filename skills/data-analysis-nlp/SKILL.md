---
name: data-analysis-nlp
description: Analyze text data with NLP — preprocessing, embeddings, topic modeling, sentiment, classification, and evaluation. Use when turning unstructured text into structured insight.
category: ai-research
---

# NLP Data Analysis

Text is data with opinions, ambiguity, and mess. NLP analysis turns it into something countable: 
clean it, represent it, model it, and evaluate honestly — with error analysis, not just accuracy 
numbers.

## Overview

The pipeline: define the question, collect and sample the text, clean it (with a light touch — 
over-cleaning destroys signal), represent it (from TF-IDF to embeddings to LLM features), model it 
(classify, cluster, extract), and evaluate on held-out data with error analysis. The question 
drives every choice: sentiment needs different handling than topic discovery, which needs different 
handling than entity extraction.

## When to use

- Classifying text: sentiment, topics, intent, toxicity, urgency.
- Discovering structure: topic modeling, clustering, trend analysis over corpora.
- Extracting information: entities, relations, key phrases from documents.
- Analyzing language at scale: reviews, tickets, survey responses, social posts.

## Core concepts

- **Preprocessing**: normalization (case, unicode), tokenization, and noise removal — calibrated 
to the task. Keep emojis for sentiment; drop them for topic modeling. Document every step.
- **Representations**: sparse (TF-IDF — interpretable, strong baseline), dense embeddings 
(semantic similarity, multilingual), LLM-derived (richest, most expensive). Start simple; 
complexity must earn its place.
- **Supervised tasks**: classification/extraction with labeled data — split properly, mind class 
imbalance, choose metrics that match the cost of errors (F1, not accuracy, for rare classes).
- **Unsupervised discovery**: topic models and clustering for exploration — validate topics by 
reading documents, not by coherence scores alone. Human judgment is the metric.
- **Annotation**: quality labels are the ceiling. Write guidelines, measure inter-annotator 
agreement, adjudicate disagreements. Bad labels guarantee bad models.
- **Error analysis**: read the mistakes. Confusion patterns tell you whether the problem is data, 
features, or the task definition itself.

## Practical workflow

1. Define the question and the decision the analysis informs; sample the data representatively.
2. Explore: lengths, languages, noise, duplicates, class balance. Look at raw examples before any 
modeling.
3. Establish baselines: keyword rules or TF-IDF + linear model. Record the score to beat.
4. Iterate on representation and model, evaluating on a held-out set with appropriate metrics.
5. Do error analysis on 50+ mistakes: categorize them, fix the data issues, and only then tune the 
model.
6. Report with uncertainty: metrics plus confidence intervals, plus the error analysis summary and 
limitations.

```text
NLP project checklist:
[ ] Question + decision defined; sample is representative
[ ] Preprocessing documented and justified per task
[ ] Baseline model + score recorded
[ ] Labels validated (agreement measured) if supervised
[ ] Held-out evaluation with task-appropriate metrics
[ ] Error analysis done; top failure modes addressed or noted
```

## Common pitfalls

- **Skipping the baseline**: jumping to LLMs for a task TF-IDF solves. Baselines are cheap and 
often sufficient.
- **Label leakage**: information from the label in the features (e.g., the answer in the text). 
Always ask what the model could cheat with.
- **Ignoring class imbalance**: 95% accuracy on a 95%-majority class means nothing. Use F1, PR 
curves, per-class metrics.
- **Over-cleaning**: aggressive normalization destroying signal — casing, punctuation, and slang 
often carry meaning.
- **Topic models without reading**: trusting coherence scores over human inspection. Read the top 
documents per topic.
- **No error analysis**: reporting a single metric. The mistakes are where the insight — and the 
next improvement — lives.
