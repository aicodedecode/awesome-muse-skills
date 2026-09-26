---
name: statistical-review-checklist
description: Reviewing the statistics in a manuscript — design, assumptions, multiplicity, effect sizes, and reproducibility.
category: scientific
---

## Overview

Statistical errors are among the most common reasons papers mislead —
and among the hardest for generalist reviewers to catch. This skill is
a specialist's checklist for reviewing quantitative analyses: study
design and power, assumption checking, multiplicity, effect sizes vs
p-values, model validity, and whether the statistics support the words.

## When to use

- Reviewing the statistical analysis in a manuscript (as assigned stats reviewer or conscientious generalist)
- Auditing your own analysis before submission
- Checking whether conclusions follow from the numbers
- Evaluating machine-learning or Bayesian analyses in papers
- Writing the statistical paragraph of a review

## Core concepts

- **Design before analysis:** was the study designed to answer the question? (Controls, randomization, blinding, pre-registration.) No analysis rescues a broken design — this is the first and most important check.
- **Assumptions are claims:** every test assumes something (normality, independence, homoscedasticity, proportional hazards) — check whether the authors verified them, not just named the test.
- **Multiplicity:** every additional test/look/subgroup inflates false positives — check for correction (Bonferroni, FDR) or preregistration; uncorrected exploratory analyses presented as confirmatory are the classic sin.
- **Effect sizes with uncertainty:** p-values measure surprise under the null, not importance — demand estimates with confidence/credible intervals; "p < 0.001" with a trivial effect is not a finding.
- **Model checking:** residuals, goodness-of-fit, calibration, validation scheme — a model is a set of assumptions; the review checks whether they held.
- **Words must match numbers:** "X causes Y", "no difference", "trend toward significance" — each phrase makes a statistical claim; verify the analysis earns the verb.

- **The "garden of forking paths":** undisclosed analyst decisions (outlier rules, transform choices, covariate sets) inflate false positives as surely as p-hacking — demand multiverse or specification-curve analyses for high-stakes claims.
- **Measurement validity:** before any model, ask whether the numbers measure what they claim — unreliable measures plus sophisticated statistics equal precise nonsense.
- **Causal identification:** in observational work, name the identification strategy (randomization, IV, discontinuity, diff-in-diff) — "controlled for X" without a causal framework is not causal inference.

## Practical workflow

### 1. Check the design

1. Is there a control/comparison appropriate to the claim? Are confounders addressed (randomization, matching, adjustment)?
2. Sample size: justified by power analysis or precision targets? (Post-hoc power is meaningless — check a priori reasoning or precision achieved.)
3. Independence: are observations truly independent, or clustered/repeated (requiring mixed models, GEE, or cluster-robust SEs)? Pseudoreplication is endemic.

### 2. Check the analysis mechanics

1. **Test choice:** appropriate to data type and design? (t-test on skewed n=8 data, chi-square on tiny expected counts, Pearson on nonlinear relationships — all common failures.)
2. **Assumptions:** verified and reported, or merely assumed? Ask for diagnostics where missing.
3. **Multiplicity:** count the tests actually performed (including interim looks and subgroup explorations); check correction or demand it.
4. **Missing data:** how much, what mechanism assumed, what method used (complete-case analysis on non-random missingness biases everything)?

### 3. Check the interpretation

1. **Effect sizes:** reported with intervals for every key claim? Can you tell whether the effect matters, not just whether p < 0.05?
2. **"No difference" claims:** supported by equivalence testing or narrow intervals — not by p > 0.05 alone (absence of evidence ≠ evidence of absence).
3. **Causal language:** matches the design (RCT → causal; observational → associational unless identification strategy justifies more)?
4. **Subgroup claims:** interaction tested, or just significant-in-one-group storytelling? (The difference between significant and non-significant is not itself significant.)

### 4. Check reproducibility

1. Could you redo the analysis? Data availability, code, software versions, random seeds, exact model specifications.
2. Are the reported numbers internally consistent (df match n, CIs contain point estimates, percentages sum correctly)?
3. Figures: do the plotted data match the reported statistics? (Plot-vs-text mismatches reveal analysis errors.)

### 5. Write the statistical review

1. Lead with the verdict on the main claims: do the analyses support them? State plainly, with the specific analysis each judgment rests on.
2. Separate must-fix (wrong test, uncorrected multiplicity, unsupported causal language) from nice-to-have (additional robustness checks, clearer reporting).
3. Suggest concrete remedies, not just problems: "use mixed models with random intercepts for clinics" beats "account for clustering".

### 6. Quick-reference checklist

- [ ] Analysis matches the question (estimation vs testing vs prediction)
- [ ] Test assumptions checked (not just stated)
- [ ] Multiplicity controlled across ALL analyses, including post-hoc
- [ ] Effect sizes with intervals reported, not just p-values
- [ ] Clustering/repeated measures handled (mixed models)
- [ ] Causal language matched to the identification strategy
- [ ] Analyst-degrees-of-freedom disclosed (multiverse/specification curve for key claims)
- [ ] Must-fix vs nice-to-have separated; concrete remedies suggested

## Common pitfalls (in papers under review)

- **Pseudoreplication:** treating 100 cells from 3 animals as n=100 — the experimental unit is what was independently randomized.
- **HARKing:** hypotheses presented as a priori that the analysis pattern reveals as post hoc — check for preregistration or timestamped plans.
- **Garden of forking paths:** undisclosed analyst degrees of freedom (outlier rules, transform choices, covariate sets) — demand robustness checks or multiverse reporting.
- **Dichotomania:** reducing everything to significant/non-significant — insist on estimation thinking.
- **Overfitted ML:** no proper validation (leakage between train/test, tiny test sets, no external validation) with grand claims — check the validation scheme first.
- **Bayesian without priors:** posterior reported, priors unstated — the result is irreproducible and possibly prior-driven.
- **Demanding perfection:** no analysis is flawless — distinguish flaws that threaten conclusions from imperfections that merely limit precision.
- **Statistical machismo:** insisting on the most complex method when a simpler, assumption-transparent one answers the question — match the method to the claim.
