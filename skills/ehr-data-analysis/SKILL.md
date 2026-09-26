---
name: ehr-data-analysis
description: Electronic health record analysis — phenotyping, missingness, bias, and observational study design with EHR data.
category: scientific
---

## Overview

ehr-data-analysis covers secondary analysis of electronic health record data: defining computable
phenotypes, handling the systematic missingness and biases of clinical data, and designing
observational studies (cohort, case-control, target-trial emulation) that produce credible
evidence rather than artifacts of documentation practice.

EHR data was collected for billing and clinical care, not research. Every analysis must reckon
with that: who gets tested, who gets coded, and who shows up at all are all non-random.

## When to use

- Defining computable phenotypes from diagnoses, labs, medications, and notes.
- Assessing data quality: completeness, plausibility, temporal coverage.
- Handling missing data that's missing-not-at-random (sicker patients have more data).
- Observational designs: cohort studies, case-control, target trial emulation.
- Confounding control: propensity scores, inverse probability weighting, doubly robust methods.
- Validation: chart review, phenotype PPV estimation.
- Privacy: de-identification, honest-broker workflows, IRB considerations.

## Core concepts

- **Computable phenotyping.** Turning clinical concepts into algorithms: e.g. "type 2 diabetes" =
  (ICD codes AND (A1c ≥6.5% OR diabetes medication)) NOT type 1 codes. Use published phenotype
  libraries (PheKB) as starting points; validate with chart review on a sample and report PPV/
  sensitivity. A phenotype without validation is a guess.
- **Coding is behavior, not biology.** ICD codes reflect billing incentives and documentation
  habits; they under-capture mild disease and over-capture billable conditions. Codes rule in
  poorly and rule out worse. Supplement with labs, meds, and NLP on notes.
- **Informed presence bias.** Patients appear in EHRs because they're sick or engaged with care.
  Comparing EHR patients to "everyone else" bakes in selection bias. Define the denominator
  explicitly (e.g. all patients with ≥1 primary-care visit in the window).
- **Missingness is systematic.** Labs are ordered when clinicians suspect something — missing
  labs usually mean "not suspected," not "unknown." This is MNAR; standard multiple imputation
  assuming MAR can mislead. Sensitivity analyses and explicit missingness indicators are often
  more honest.
- **Immortal time bias.** Defining exposure by a future event (e.g. "received drug X during
  admission") grants exposed patients survival until exposure. Use time-dependent exposures or
  target-trial emulation with proper time zero.
- **Target trial emulation.** Frame the observational question as the RCT you wish you could run:
  eligibility, treatment strategies, time zero, follow-up, outcome. Then emulate each element.
  This discipline eliminates most immortal-time and selection biases by construction.
- **Confounding control.** Propensity scores (matching, weighting, stratification) balance
  measured confounders; report balance (standardized mean differences <0.1). Unmeasured
  confounding remains — use negative controls, E-values, and quantitative bias analysis to bound
  it. Never claim causality from a single observational design.
- **Temporal issues.** Lookback windows for baseline covariates, washout periods for incident
  (not prevalent) user designs, and new-user active-comparator designs to reduce confounding by
  indication.

## Practical workflow

1. **Governance first.** IRB approval, data-use agreements, de-identification plan. Know what
   you may not do before touching the data.
2. **Define the cohort.** Explicit inclusion/exclusion with code lists; denominator definition;
   index date (time zero) rules.
3. **Build phenotypes.** Adapt published algorithms; validate with chart review (n≥50-100);
   report PPV.
4. **Data audit.** Completeness by variable and site, temporal trends (EHR system changes create
   fake trends), plausibility checks, missingness patterns.
5. **Design.** Target-trial emulation framing; new-user active-comparator where possible;
   prespecified analysis plan.
6. **Analyze.** Propensity weighting/matching with balance checks; primary model; negative
   controls; E-value for unmeasured confounding; multiple bias analyses.
7. **Report.** STROBE/RECORD: cohort construction flow, phenotype definitions and validation,
   missingness, balance tables, and explicit discussion of residual bias.

Example (SQL sketch):
```sql
-- incident diabetes phenotype: first qualifying event after 1-year clean window
WITH first_event AS (
  SELECT patient_id, MIN(event_date) AS index_date FROM diagnoses
  WHERE icd_code LIKE 'E11%' GROUP BY patient_id)
SELECT f.* FROM first_event f
WHERE NOT EXISTS (SELECT 1 FROM diagnoses d
  WHERE d.patient_id = f.patient_id AND d.event_date < f.index_date - INTERVAL '1 year'
  AND d.icd_code LIKE 'E11%');
```

## Common pitfalls

- Prevalent-user designs (comparing long-term users to never-users — confounding by indication).
- Immortal time bias from future-defined exposures.
- Treating ICD codes as ground truth without validation.
- MAR-based imputation on systematically missing clinical data.
- Confounding by indication hand-waved away ("we adjusted for age and sex").
- EHR system migrations creating spurious temporal trends.
- Denominator undefined — rates computed over whoever showed up.
