---
name: behavioral-data-analysis
description: Analyzing behavioral experiment data — RT/accuracy preprocessing, mixed-effects models, and robust inference.
category: scientific
---

## Overview

behavioral-data-analysis covers the practical statistics of human performance data: reaction times,
accuracy, choices, and ratings from psychology experiments. It focuses on the preprocessing
decisions that make or break RT analyses (trimming, transformations), the mixed-effects models that
have replaced repeated-measures ANOVA, and robust inference for the skewed, outlier-prone data
behavioral science produces.

## When to use

- Preprocessing RT data: outlier handling, trimming vs transformations, speed-accuracy trade-offs.
- Accuracy/proportion data: logistic mixed models instead of ANOVA on percentages.
- Repeated-measures designs: linear mixed-effects models with crossed random effects.
- Choice data: logistic regression, drift-diffusion modeling basics.
- Rating scale data: ordinal models vs treating Likert as continuous.
- Power and inference: contrasts, emmeans, multiplicity control.
- Reproducible analysis pipelines for behavioral datasets.

## Core concepts

- **RT distributions are skewed.** Reaction times are never normal — they're ex-Gaussian-ish with
  a long right tail. Options: log or inverse transform, or model directly (GLMM with Gamma/inverse-
  Gaussian family, or ex-Gaussian models). Don't just trim 2 SD and run ANOVA and hope.
- **Outlier handling, preregistered.** Common rules: drop RTs <200 ms (anticipations) and >2-3 s
  or >3 SD from the participant's condition mean; or use robust methods. Whatever the rule,
  decide before analysis and report how many trials were lost. Never tune the cutoff to the
  result.
- **Speed-accuracy trade-off.** Faster responses are often less accurate. Analyze RT and accuracy
  together; a "faster" condition with more errors may show nothing at all. Consider inverse
  efficiency or, better, drift-diffusion modeling to separate drift rate from caution.
- **Mixed-effects models.** `RT ~ condition + (1 + condition | subject) + (1 + condition | item)`
  — crossed random effects for subjects and items handle the repeated-measures structure that
  ANOVA mangles. Maximal random-effects structure justified by the design (Barr et al.); simplify
  only on convergence grounds, transparently.
- **Accuracy needs logistic models.** `glmer(accuracy ~ condition + (1|subject), family=binomial)`.
  ANOVA on proportions violates every assumption (bounded, heteroscedastic). Report odds ratios
  or predicted probabilities, not just p-values.
- **Contrasts, not omnibus tests.** A significant 3-level ANOVA tells you almost nothing. Specify
  planned contrasts (treatment vs control, linear trend) that test the hypothesis directly.
- **Ordinal data.** Likert ratings are ordinal — consider cumulative link mixed models
  (`ordinal::clmm`) rather than pretending 1-7 is interval. In practice linear models are often
  robust, but check with an ordinal model as sensitivity analysis.
- **Multiplicity.** Families of post-hoc comparisons need correction (Tukey, Holm, FDR).
  Exploratory model fishing across transformations and subsets is p-hacking — preregister the
  pipeline.

## Practical workflow

1. **Audit.** Trial counts per cell, missing data, impossible values, participant-level
   summaries. Plot RT distributions per condition before any modeling.
2. **Preprocess (preregistered).** Apply exclusion rules; transform or choose model family based
   on the distribution you see in pilot/blind data.
3. **Model.** LMM for RT (transformed or Gamma GLMM), binomial GLMM for accuracy, CLMM for
   ratings. Maximal random effects; check convergence and singularity.
4. **Check.** Residual plots, random-effect distributions, influence diagnostics. Refit without
   influential participants as sensitivity analysis.
5. **Inference.** Planned contrasts with CIs (emmeans); report effect sizes in original units
   (ms differences, percentage points) alongside standardized ones.
6. **Report.** Exclusion counts, transformation/model family, random-effects structure,
   convergence notes, and the analysis script. Follow the preregistration; label deviations.

Example (R sketch):
```r
library(lme4)
d <- subset(d, rt > 0.2 & rt < 3)                 # preregistered exclusions
m <- lmer(log(rt) ~ condition + (1 + condition | subject) + (1 | item), data = d)
m_acc <- glmer(acc ~ condition + (1 | subject) + (1 | item), data = d, family = binomial)
emmeans::emmeans(m, pairwise ~ condition)
```

## Common pitfalls

- ANOVA on raw RTs or on accuracy proportions.
- Post-hoc outlier trimming tuned to produce significance.
- Ignoring the speed-accuracy trade-off (reporting RT effects with unreported accuracy costs).
- Random-intercepts-only models when the design needs random slopes (inflated Type I error).
- Treating participants as fixed or averaging away item variance ("language-as-fixed-effect").
- Uncorrected post-hoc t-tests after every ANOVA.
- Analyzing only correct-trial RTs without checking whether errors differ by condition.
