---
name: biostatistics
description: Statistical methods for biology and medicine — study design, hypothesis testing, regression, and survival analysis.
category: scientific
---

## Overview

biostatistics is the application of statistical reasoning to biological and medical data. It covers
study design (how to collect data that can answer the question), inference (hypothesis tests and
confidence intervals that respect the data's structure), and modeling (regression, mixed models,
survival analysis) for messy, real-world biomedical datasets with missing values, confounding, and
small samples.

The emphasis is on correct application, not mathematical derivation: choosing the right test for the
data type, checking assumptions, handling multiplicity, and reporting effect sizes with uncertainty —
the things that separate a defensible analysis from a p-value lottery.

## When to use

- Designing a study: sample-size/power calculation, randomization scheme, primary vs secondary
  endpoints.
- Choosing a test: t-test vs Mann-Whitney, chi-square vs Fisher, ANOVA vs Kruskal-Wallis, paired
  vs unpaired designs.
- Modeling: linear/logistic regression, mixed-effects models for repeated measures or clustered
  data, Cox proportional hazards for time-to-event.
- Survival analysis: Kaplan-Meier curves, log-rank tests, competing risks.
- Diagnostic studies: sensitivity/specificity, ROC/AUC, predictive values, likelihood ratios.
- Meta-analysis: pooling effect sizes, heterogeneity (I²), fixed vs random effects.
- Reviewing a paper: checking whether the statistics support the conclusions.

## Core concepts

- **Power and sample size.** Power = probability of detecting a real effect. Calculate n from the
  minimum clinically/biologically meaningful effect, expected variance, alpha (usually 0.05), and
  target power (usually 0.80). Underpowered studies waste resources and produce false negatives;
  they also inflate the false-positive rate among "significant" findings.
- **Data types drive test choice.** Continuous normal → parametric (t-test, ANOVA, Pearson);
  continuous non-normal or ordinal → non-parametric (Mann-Whitney, Kruskal-Wallis, Spearman);
  categorical → chi-square/Fisher; counts → Poisson/negative binomial; time-to-event → survival
  methods. A test on the wrong data type is invalid regardless of the p-value.
- **Assumptions are checkable.** Normality (Q-Q plots, Shapiro-Wilk), equal variance (Levene),
  linearity, independence of observations. Document the checks; switch methods when they fail.
- **Confounding vs mediation vs effect modification.** Confounders distort the exposure-outcome
  association and must be adjusted for; mediators lie on the causal path and adjusting for them
  can erase the real effect; effect modifiers mean the effect differs by subgroup (test with
  interaction terms, not by fishing through subgroups).
- **Multiple testing.** Every extra test inflates the false-positive rate. Use Bonferroni/Holm
  for confirmatory families, FDR (Benjamini-Hochberg) for exploratory screening like omics, and
  prespecify primary endpoints so one cannot shop for significance.
- **Effect sizes with uncertainty.** A p-value says nothing about magnitude. Report mean differences,
  odds ratios, hazard ratios, or risk differences with 95% confidence intervals. A "significant"
  effect of trivial size is usually not actionable.
- **Missing data.** Classify as MCAR/MAR/MNAR. Complete-case analysis is only valid under MCAR.
  Prefer multiple imputation or likelihood-based methods under MAR; MNAR needs sensitivity analyses.
- **Survival analysis specifics.** Censoring must be non-informative; check proportional hazards
  (Schoenfeld residuals); Kaplan-Meier for description, Cox for adjustment; competing risks need
  Fine-Gray, not naive Kaplan-Meier.

## Practical workflow

1. **Define the question and estimand.** What population, what comparison, what outcome, what time
   horizon? Write the primary analysis plan before seeing the data.
2. **Power calculation.** Use the smallest meaningful effect size; add 10-20% for dropout. Record
   the assumptions — they will be audited.
3. **Data audit.** Distributions, missingness patterns, outliers, impossible values. Clean
   reproducibly (scripted, never by hand in a spreadsheet).
4. **Exploratory plots.** Histograms, boxplots by group, scatterplots, survival curves. Choose the
   model family from what you see, not from habit.
5. **Primary analysis.** Prespecified model, assumption checks, adjusted estimates with CIs.
6. **Sensitivity analyses.** Alternative missing-data handling, per-protocol vs intention-to-treat,
   subgroup checks with interaction tests.
7. **Report.** CONSORT/STROBE-style flow of participants, baseline table, primary result with
   effect size + CI, then secondary/exploratory clearly labeled.

Example (R sketch):
```r
power.t.test(delta = 5, sd = 10, power = 0.8)          # sample size
wilcox.test(outcome ~ group, data = d)                 # non-normal comparison
fit <- coxph(Surv(time, event) ~ treatment + age, data = d)
cox.zph(fit)                                            # proportional-hazards check
```

## Common pitfalls

- p-hacking: running many unplanned analyses until something is "significant."
- Treating ordinal scales (e.g. pain scores) as continuous without checking.
- Ignoring clustering (patients within hospitals, repeated measures) — standard errors collapse.
- Survivor bias / immortal-time bias in observational survival comparisons.
- Interpreting a non-significant result as "no effect" rather than "insufficient evidence."
- Overfitting: more predictors than events (rule of thumb: ≥10 events per variable in logistic/Cox).
- Reporting relative risk without absolute risk — a 50% relative reduction can be clinically trivial.
