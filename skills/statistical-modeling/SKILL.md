---
name: statistical-modeling
description: Build statistical models properly — choosing models, checking assumptions, quantifying uncertainty, and avoiding common inferential traps. Use when moving beyond descriptives to inference or prediction with statistics.
category: ai-research
---

# Statistical Modeling

Statistical models turn data into quantified claims: effects with uncertainty, predictions with 
intervals. The craft is choosing the right model, checking that its assumptions hold, and reporting 
honestly — including what the model can't tell you.

## Overview

Model selection follows the question and the data: continuous outcomes → regression family; 
counts → Poisson/negative binomial; binary → logistic; hierarchical structure → mixed models; 
time dependence → time series. Every model makes assumptions — check them with diagnostics, not 
faith. Report estimates with uncertainty (intervals, not just points), and distinguish what the 
data shows from what you wish it showed.

## When to use

- Estimating effects: "how much does X change Y, and how sure are we?"
- Predicting outcomes with quantified uncertainty.
- Accounting for structure: repeated measures, groups, time, space.
- Reviewing analyses: checking whether the model fits the question.

## Core concepts

- **Model-data match**: the model must respect the outcome type and data structure. Linear 
regression on counts or ignoring clustering produces confident nonsense.
- **Assumptions and diagnostics**: linearity, independence, homoscedasticity, distributional shape 
— checked with residual plots and tests, not assumed. Violations get fixed (transform, different 
model) not ignored.
- **Uncertainty quantification**: confidence/credible intervals, standard errors, prediction 
intervals. A point estimate without uncertainty is half a result.
- **Regularization**: shrinkage (ridge/lasso) and priors tame overfitting when predictors are many 
or collinear. Complexity needs justification.
- **Model comparison**: AIC/BIC, cross-validation, posterior predictive checks — principled ways 
to choose among models. Fit alone never justifies complexity.
- **Causation boundaries**: most models describe association. Causal claims need design 
(experiments, quasi-experiments) or explicit causal assumptions — the model alone doesn't provide 
them.

## Practical workflow

1. State the question, outcome type, and data structure; choose the model family that matches.
2. Explore the data first: distributions, relationships, missingness, outliers — the model should 
fit the data you have.
3. Fit simply first; check diagnostics (residuals, influence, convergence). Fix violations before 
adding complexity.
4. Quantify uncertainty: intervals for key estimates; prediction intervals if predicting.
5. Compare candidate models with cross-validation or information criteria; prefer the simpler model 
when performance ties.
6. Report: estimates with intervals, assumption checks, sensitivity analyses, and plain-language 
limits on interpretation.

```text
Modeling checklist:
[ ] Model family matches outcome type + data structure
[ ] Assumptions checked with diagnostics (not assumed)
[ ] Uncertainty reported (intervals, not just points)
[ ] Compared against simpler alternatives
[ ] Sensitivity to key choices tested
[ ] Causal language only where design supports it
```

## Common pitfalls

- **p-value theater**: reporting significance without effect sizes or intervals. "Significant" tiny 
effects mislead.
- **Ignoring structure**: treating clustered/longitudinal data as independent. Standard errors 
collapse; false precision follows.
- **Overfitting**: complex models fitting noise. Regularize, validate, prefer simplicity.
- **Assumption blindness**: never looking at residuals. The diagnostics are where model failures 
announce themselves.
- **Causal language from observational fits**: "X increases Y" from a regression without causal 
design. Say "associated."
- **Researcher degrees of freedom**: trying models until one "works." Pre-specify the primary 
model; report the garden of forking paths.
