---
name: data-scientist
description: Run the data science workflow end to end — framing, exploration, feature engineering, modeling, validation, and communicating results. Use when turning raw data into decisions or predictions.
category: ai-research
---

# Data Scientist

Data science is decision-making under uncertainty with data. The workflow is: frame the question, 
explore the data, engineer features, model carefully, validate honestly, and communicate so the 
result changes something.

## Overview

Most of data science is not modeling — it's framing the right question and understanding the 
data. A model built on a misunderstood problem or leaky data is worse than no model: it produces 
confident wrong answers. The discipline is in the checks: train/test hygiene, baselines before 
complexity, and communicating uncertainty alongside every number.

## When to use

- A business question that data could answer: churn, demand, pricing, risk, targeting.
- Building a predictive model from tabular, text, or time-series data.
- Exploring an unfamiliar dataset to find what's in it and what it's good for.
- Evaluating whether an existing model is still working.

## Core concepts

- **Problem framing**: translate the business question into a modeling task — what is the target, 
what's the decision, what's the cost of being wrong? The most important step.
- **Exploratory analysis**: distributions, missingness, correlations, outliers, and data quality. 
Plot first; model later.
- **Feature engineering**: creating informative inputs from raw data — often more impactful than 
model choice. Domain knowledge lives here.
- **Baselines**: a simple model (mean prediction, logistic regression, heuristics) before anything 
fancy. Complexity must earn its place.
- **Validation**: honest train/test splits, cross-validation, and — for time data — time-based 
splits. Leakage (future information in training) is the classic silent killer.
- **Uncertainty**: point estimates plus intervals and calibration. "70% ± 15" is more useful than 
"70%."

## Practical workflow

1. Write the decision the analysis will inform and the metric that matters — before touching the 
data.
2. Explore: profile every column, check missingness and outliers, verify joins and grain (one row = 
what?).
3. Build the simplest baseline and a proper validation scheme; record the baseline score.
4. Engineer features iteratively, measuring each addition against the baseline — keep what moves 
the needle.
5. Tune modestly; prefer robust simple models over brittle complex ones unless the gain is real and 
validated.
6. Communicate: the finding, the uncertainty, the limitations, and the recommended action — in 
that order.

```text
Analysis checklist:
[ ] Question and decision defined
[ ] Data grain and quality understood
[ ] Baseline model + score recorded
[ ] Validation scheme resists leakage
[ ] Uncertainty quantified
[ ] Limitations stated plainly
```

## Common pitfalls

- **Leakage**: future or target-derived information in features. Always ask: "would I know this at 
prediction time?"
- **Skipping the baseline**: jumping to complex models. If logistic regression is within noise of 
the fancy model, ship the simple one.
- **Metric myopia**: optimizing accuracy on imbalanced data, or a metric nobody's decision actually 
uses. Match the metric to the cost of errors.
- **Overfitting the validation set**: tuning until the test score looks good. Hold out a final set 
you touch once.
- **Ignoring the data-generating process**: models assume the future resembles the past. Regime 
changes, selection bias, and feedback loops break this.
- **Analysis without a decision**: beautiful notebooks that change nothing. Start from the decision 
and work backward.
