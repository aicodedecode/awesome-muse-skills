---
name: seroprevalence-surveys
description: Designing and analyzing seroprevalence studies — sampling, assay validation, and adjusting for test performance.
category: scientific
---

## Overview

seroprevalence-surveys covers population surveys measuring antibodies (or other biomarkers) to
estimate how many people have been infected or vaccinated. It focuses on the three things that
make or break serosurveys: representative sampling, validated assays, and correct statistical
adjustment for imperfect test sensitivity and specificity.

A serosurvey with a convenience sample and an unvalidated assay produces a number that is worse
than useless — it looks authoritative while being wrong.

## When to use

- Designing serosurveys: sampling frames, sample size, stratification.
- Choosing and validating serologic assays for population use.
- Adjusting seroprevalence for test sensitivity/specificity (Rogan-Gladen).
- Accounting for antibody waning and its effect on estimates.
- Interpreting seroprevalence vs reported cases (the ascertainment ratio).
- Residual-sera vs population-based designs: trade-offs.

## Core concepts

- **Sampling is everything.** Probability-based sampling (stratified random, cluster) from a
  defined population is the gold standard. Convenience samples (blood donors, clinic patients,
  volunteers) are biased in predictable directions — blood donors are healthier, clinic patients
  sicker. If you must use residual sera, characterize the source population and weight to the
  target population.
- **Sample size.** Driven by expected prevalence and desired precision, with design-effect
  inflation for cluster sampling. Low expected prevalence needs larger samples and, critically,
  high-specificity assays (see below).
- **Assay validation for the use case.** Clinical diagnostic validation (sick vs healthy) does
  not equal population-survey validation. You need sensitivity/specificity estimated in samples
  resembling the survey population, including mild/asymptomatic infections and relevant
  cross-reactive conditions. Validate independently — don't trust the kit insert alone.
- **The specificity catastrophe.** At 2% true prevalence, a test with 98% specificity yields
  ~50% false positives among positives. Low-prevalence serosurveys live or die on specificity.
  Mitigations: two-assay orthogonal testing algorithms (screen + confirm), and statistical
  adjustment.
- **Rogan-Gladen adjustment.** True prevalence = (apparent + spec − 1) / (sens + spec − 1).
  Use it always, with uncertainty propagated (Bayesian methods that incorporate uncertainty in
  sens/spec are better than plug-in). Report both apparent and adjusted estimates.
- **Antibody waning.** Seroprevalence underestimates cumulative infection because antibodies
  wane below detection. The longer since the epidemic wave, the bigger the gap. Model waning
  explicitly (using longitudinal assay data) or present estimates as lower bounds with the
  caveat stated.
- **Distinguishing infection from vaccination.** Use assays targeting antigens absent from the
  vaccine (e.g. nucleocapsid vs spike for most COVID vaccines) — or collect vaccination
  histories. Conflating the two answers a different question than the one asked.
- **Ascertainment ratio.** Seroprevalence ÷ reported cases estimates the undercount factor.
  It's a powerful advocacy number but sensitive to all the above errors — present with
  uncertainty.

## Practical workflow

1. **Define the estimand.** Cumulative infection? Recent infection? In which population, at what
   time?
2. **Sample.** Probability-based design, stratified by age/geography; target sample size with
   design effect; plan for non-response (track and weight).
3. **Validate the assay.** Independent validation panel; estimate sens/spec with CIs; consider
   two-assay algorithms for low-prevalence settings.
4. **Collect.** Standardized questionnaire (symptoms, exposures, vaccination); cold-chain and
   lab QC; blinded testing.
5. **Analyze.** Weight to population; Rogan-Gladen/Bayesian adjustment for test performance;
   stratify by age, sex, geography, time; account for waning where data allow.
6. **Report.** Apparent and adjusted prevalence with 95% CIs, assay validation details,
   sampling design and response rates, waning caveats, ascertainment ratio with uncertainty.

Example adjustment sketch:
```r
# Bayesian adjustment propagating sens/spec uncertainty
# apparent ~ Binomial(n, prev*sens + (1-prev)*(1-spec))
# priors on sens, spec from validation study counts
```

## Common pitfalls

- Convenience samples presented as population estimates.
- Unvalidated assays, especially low-specificity tests in low-prevalence settings.
- No adjustment for test performance (reporting apparent prevalence as truth).
- Ignoring antibody waning (underestimating cumulative infections).
- Infection vs vaccination conflated.
- Non-response bias unaddressed (who refuses blood draws is non-random).
- Overprecise estimates from small samples with wide sens/spec uncertainty.
