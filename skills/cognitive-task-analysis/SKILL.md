---
name: cognitive-task-analysis
description: Designing and analyzing cognitive tasks — Stroop, n-back, task-switching, and process-pure measurement.
category: scientific
---

## Overview

cognitive-task-analysis covers the classic experimental paradigms of cognitive psychology — Stroop,
flanker, n-back, task-switching, stop-signal, attentional blink — and how to analyze them so the
numbers reflect the intended process. The central problem: no task is process-pure, so every
"cognitive measure" is contaminated by general speed, strategy, and task-specific demands. This
skill is about designing tasks and analyses that isolate processes anyway.

## When to use

- Choosing a paradigm for a construct: inhibition, working memory, shifting, sustained attention.
- Task design: trial counts, congruency ratios, timing, practice blocks.
- Computing standard indices: Stroop interference, switch costs, stop-signal reaction time (SSRT).
- Difference scores: when they're justified and why they're often unreliable.
- Modeling: drift-diffusion and process models as alternatives to raw RT/accuracy.
- Individual-differences use: reliability of task indices for correlational research.

## Core concepts

- **The task-impurity problem.** Every cognitive task measures the target process plus perception,
  motor speed, motivation, and strategy. A "worse Stroop score" could be slower color naming, not
  worse inhibition. Control conditions (congruent/neutral baselines) exist to subtract the
  impurity — but subtraction assumes pure insertion, which is itself questionable.
- **Difference scores and their reliability.** Interference = incongruent − congruent. Difference
  scores amplify measurement error: reliability of a difference is lower than its components
  (often much lower). For individual-differences research, this is frequently fatal — check the
  reliability of the difference score itself, not just the raw conditions.
- **Stroop/flanker.** Interference effects (incongruent slower/less accurate). Design: enough
  trials per condition (≥50 for stable means), congruent/neutral/incongruent proportions that
  don't let participants strategize, manual vs vocal responses documented. Analyze: interference
  and facilitation separately; check for speed-accuracy trade-offs.
- **N-back.** Working-memory updating: 1-, 2-, 3-back loads; lures (n+1 matches) to prevent
  familiarity strategies. Dependent measures: hits/false alarms (d′), not just accuracy — response
  bias varies wildly. Note: n-back reliability for individual differences is modest; it's a
  within-subjects manipulation tool first.
- **Task-switching.** Switch cost = switch − repeat RT. Design: predictable (AABB) vs unpredictable
  (cued) switching, preparation intervals (CTI) to separate preparation from residual cost.
  Distinguish switch costs (transient control) from mixing costs (repeat trials in mixed vs pure
  blocks — sustained control).
- **Stop-signal task and SSRT.** The race model: go process vs stop process. SSRT estimated via
  the integration method with staircase-adjusted stop-signal delays (targeting ~50% inhibition).
  Critical assumption: the staircase must actually track 50% — verify, and exclude participants
  where it fails. SSRT is not directly observed; it's model-derived.
- **Drift-diffusion modeling.** Decomposes RT/accuracy into drift rate (evidence quality),
  boundary separation (caution), and non-decision time (encoding/motor). Often resolves
  ambiguities raw RTs can't (is the group slower because of worse processing or more caution?).
  Needs sufficient trials (≥100+ per condition ideally); fit with hierarchical Bayesian tools
  (HDDM) for typical sample sizes.
- **Reliability for individual differences.** Most cognitive tasks were built for within-subjects
  experimental effects, where reliability demands are low. Repurposing them as individual-
  difference measures requires demonstrating test-retest reliability of the specific index —
  many classic "effects" have difference-score reliabilities near zero.

## Practical workflow

1. **Pick the paradigm for the process**, not the fashion. List the process, its confounds, and
   the control conditions that isolate it.
2. **Design trials.** Enough per condition for stable estimates; proportions that prevent
   strategy; practice blocks with feedback; documented timing and response modality.
3. **Pilot.** Check effect presence (manipulation works?), RT distributions, error rates (5-15%
   is the sweet spot — floor/ceiling kills sensitivity), and participant comprehension.
4. **Preprocess.** Preregistered exclusions; analyze RT and accuracy jointly; compute d′ where
   relevant.
5. **Model.** Start with condition means and preregistered contrasts; use DDM/HDDM when the
   question is about processing vs caution; mixed-effects models for trial-level data.
6. **Reliability check (if individual differences).** Test-retest or split-half of the actual
   index; disattenuate correlations; abandon indices with near-zero reliability.
7. **Report.** Trial counts, exclusions, full descriptive statistics per condition, and the exact
   computation of every derived index.

## Common pitfalls

- Difference scores with unreported (terrible) reliability used in correlations.
- Interpreting slower RT as worse cognition without checking accuracy (caution shifts).
- N-back accuracy without d′ (response bias masquerading as memory).
- SSRT from a failed staircase (not ~50% inhibition).
- Too few trials for DDM fitting, or fitting DDM to group means instead of hierarchically.
- Strategy shifts across conditions mistaken for process differences.
- Ceiling/floor effects from poorly calibrated difficulty.
