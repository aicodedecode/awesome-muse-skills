---
name: methods-writing
description: Writing reproducible Methods sections — detail calibration, reporting standards, and the reproducibility checklist.
category: scientific
---

## Overview

The Methods section is a recipe: a competent reader should be able to
reproduce the work. This skill covers calibrating detail (what's novel
vs routine), organizing methods logically, reporting standards by field,
the statistics-reporting checklist, and writing so that reproducibility
is real rather than aspirational.

## When to use

- Writing the Methods section of a paper or thesis
- Deciding how much detail a protocol needs (main text vs supplement)
- Reporting computational methods: software versions, parameters, hardware
- Writing statistical methods that reviewers accept
- Auditing a draft for reproducibility gaps before submission

## Core concepts

- **The reproducibility standard:** could a skilled researcher in your field replicate this from the text plus cited protocols? "As previously described" is acceptable only when the cited protocol is complete and accessible — otherwise summarize the essentials.
- **Novel vs routine:** novel or decision-critical steps get full detail in main text; truly routine procedures get a citation; everything in between goes to the supplement — the judgment call reviewers actually make.
- **Parameters are data:** concentrations, temperatures, timings, instrument settings, software versions, random seeds, hyperparameters — a method without its parameters is a story, not a protocol.
- **Statistics reporting:** name every test, state why it was chosen (assumptions checked?), report exact p-values, effect sizes with intervals, corrections for multiplicity, and how sample size was determined.
- **Materials provenance:** reagents (supplier, catalog/lot), cell lines (source, authentication, mycoplasma), animal strains, software (version, parameters, availability) — the details that explain irreproducibility when omitted.
- **Negative and null details:** what was tried and failed, exclusion criteria applied, data points removed (with rules stated before seeing results) — preregister or timestamp these to keep them honest.

- **The "naive replicator" test:** hand the Methods to a competent outsider — every question they ask ("what concentration?", "which version?", "how long?") marks a gap to fill.
- **Negative results and exclusions:** report what was tried and abandoned, exclusion criteria, and data removed — with the rules stated before results were seen; preregistration is the gold standard.
- **Version pinning:** software, datasets, protocols, and instrument firmware all have versions — "we used X" without a version is not reproducible; pin everything.

## Practical workflow

### 1. Structure logically

1. Order by workflow (what was done first → last), not by importance — readers replicate sequentially.
2. Use informative subheadings ("Protein expression and purification", not "Methods part 2"); mirror the Results order where possible.
3. Keep a parallel detailed protocol in the supplement or a repository (protocols.io, GitHub) and cite it.

### 2. Write each method completely

1. **Experimental:** materials with provenance, step-by-step procedure with quantities and conditions, instruments with settings, controls and calibration.
2. **Computational:** software + version, all non-default parameters, input data provenance, hardware/runtime for heavy computations, random seeds, code availability link.
3. **Statistical:** analysis plan per result — test, assumptions verified, multiple-comparison correction, effect size + CI, sample-size rationale.

### 3. Apply the reproducibility checklist

- [ ] All reagents/materials sourced (supplier, identifier)
- [ ] Every number that matters stated (concentrations, times, temperatures, n)
- [ ] Instruments and settings specified
- [ ] Software versions and parameters recorded
- [ ] Statistical tests named with assumptions checked
- [ ] Exclusion criteria and data cleaning rules stated
- [ ] Code and data availability statements with working links
- [ ] A naive-but-skilled reader could follow it

### 4. Edit for precision

1. Replace vague verbs ("treated", "analyzed", "processed") with specific actions and quantities.
2. Use past tense, passive or active consistently — clarity over style dogma.
3. Cross-check every method against the Results: each result must trace to a described method; each method must produce a reported result.

### 5. Write the statistics subsection

1. Name every test/model, justify the choice (assumptions checked how?), and state the software and version.
2. Report how sample size was determined (power analysis, resource equation, or convention — stated honestly), randomization, blinding, and exclusion rules.
3. Define significance thresholds, multiple-comparison corrections, and what effect sizes with intervals will be reported — before presenting any result.

### 6. Quick-reference checklist

- [ ] "Naive replicator" test: would a competent outsider have unanswered questions?
- [ ] All software, instruments, datasets version-pinned
- [ ] Sample size determination stated (power analysis or honest convention)
- [ ] Randomization, blinding, exclusion rules reported
- [ ] Statistics subsection: tests named, assumptions checked, corrections stated
- [ ] Prespecified vs exploratory analyses distinguished
- [ ] Negative results and exclusions reported with rules
- [ ] Ethics approvals and permits cited

## Common pitfalls

- **"As previously described" chains:** citation → citation → dead protocol — verify the chain ends somewhere complete.
- **Missing parameters:** the exact details that determine whether it works (antibody dilution, annealing temperature, learning rate) omitted as "obvious".
- **Statistics hand-waving:** "data were analyzed" without naming tests — reviewers reject for this alone.
- **Version amnesia:** software named without version — results can change between versions; pin them.
- **n ambiguity:** biological vs technical replicates, and whether n was chosen by power analysis or convenience — state both.
- **Supplement dumping:** hiding decision-critical details in an unreviewed 200-page supplement — if it determines the result, it belongs in the main text or a cited, complete protocol.
- **"Data were analyzed" vagueness:** naming no test, no software, no version — the single most common Methods failure; reviewers reject for this alone.
- **HARKing by omission:** presenting exploratory analyses as confirmatory — distinguish prespecified from post-hoc analyses explicitly.
