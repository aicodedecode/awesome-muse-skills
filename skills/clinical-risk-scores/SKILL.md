---
name: clinical-risk-scores
description: Clinical prediction models and risk scores — development, validation, calibration, and bedside use.
category: scientific
---

## Overview

clinical-risk-scores covers the lifecycle of clinical prediction models: developing scores from
cohort data (logistic regression, points systems), validating them (discrimination, calibration,
clinical utility), and deploying them for real decisions. It emphasizes the gap between a model
with a good AUC and a tool that improves care — most published scores never cross that gap.

Covers classic scores (APACHE, CHA2DS2-VASc, Wells, CURB-65) as design patterns, and modern ML
models with the same validation discipline.

## When to use

- Developing a risk score: outcome definition, predictor selection, sample size (events per
  variable).
- Validation: internal (bootstrap), temporal, geographic, and fully external.
- Discrimination vs calibration: why a high AUC with bad calibration is dangerous.
- Clinical utility: decision curves, net benefit, impact studies.
- Implementing: EHR integration, alert fatigue, workflow fit.
- Appraising published scores (TRIPOD checklist).

## Core concepts

- **Define the clinical question first.** Predict what, in whom, at what moment, to trigger what
  action? A 30-day mortality model for discharged patients is a different tool from an ICU
  deterioration model. Models without a linked action are ornaments.
- **Events per variable (EPV).** Classic rule: ≥10-20 outcome events per candidate predictor to
  avoid overfitting. With 50 events and 20 candidate predictors, the model will memorize noise.
  Penalized regression (lasso/ridge) or dimensionality reduction when EPV is low.
- **Discrimination.** AUC/c-statistic: can the model rank patients? Necessary but not sufficient —
  a model can discriminate well while being miscalibrated.
- **Calibration.** Do predicted probabilities match observed event rates? Assessed with
  calibration plots (predicted vs observed by decile), calibration slope and intercept, and
  recalibration on new populations. A model predicting 30% risk for patients with 10% observed
  risk will cause overtreatment — calibration matters more than AUC for decision-making.
- **Validation hierarchy.** Apparent performance (optimistic) → internal (bootstrap optimism
  correction — preferred over split-sample) → temporal (later patients, same site) → geographic
  (different sites) → fully independent external validation. Each level typically loses
  performance; plan for it.
- **Clinical utility.** Decision-curve analysis: net benefit across threshold probabilities vs
  treat-all/treat-none strategies. A model is useful only if it beats simple strategies at
  clinically plausible thresholds. Impact studies (does using the score change outcomes?) are the
  gold standard and are rarely done — note their absence when appraising.
- **Points scores vs models.** Integer point systems (CHA2DS2-VASc) sacrifice some accuracy for
  bedside usability; with EHR integration, full models are deployable. Don't simplify to points
  unless the use case demands mental arithmetic.
- **Fairness.** Validate performance across subgroups (sex, race, age). Models trained on
  majority populations can systematically miscalibrate for others — check calibration within
  subgroups, not just overall.

## Practical workflow

1. **Specify.** Outcome, prediction timepoint, target population, intended action, clinically
   relevant thresholds.
2. **Data.** Cohort with adequate events (EPV ≥10-20); predictors available at prediction time
   (no leakage from the future); handle missingness explicitly.
3. **Develop.** Prespecified candidate predictors; penalized regression or careful stepwise;
   avoid univariable screening (it misses confounded predictors and overfits).
4. **Internal validation.** Bootstrap optimism correction for AUC and calibration; shrinkage of
   coefficients.
5. **Report TRIPOD.** Full model equation (intercept + coefficients), performance with CIs,
   calibration plot — enough detail for independent validation.
6. **External validation.** New data, new setting; assess discrimination AND calibration;
   recalibrate intercept/slope if needed rather than discarding.
7. **Utility and implementation.** Decision curves; workflow integration; silent-mode prospective
   evaluation before alerting; monitor calibration drift over time.

Example (R sketch):
```r
library(rms)
fit <- lrm(outcome ~ age + sbp + creatinine, data = d, x = TRUE, y = TRUE)
validate(fit, B = 200)          # bootstrap optimism-corrected performance
cal <- calibrate(fit, B = 200); plot(cal)
```

## Common pitfalls

- Good AUC, terrible calibration — deployed anyway.
- Split-sample "validation" instead of bootstrap (wastes data, still optimistic).
- Predictor leakage: variables measured after the prediction timepoint.
- EPV violations producing overfit models that collapse externally.
- No external validation — or "external" validation on the same hospital's next month.
- Ignoring subgroup calibration (fairness failures).
- Deploying without silent-mode testing → alert fatigue → clinicians ignore it.
- Updating never: calibration drifts as populations and practice change.
