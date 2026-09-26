---
name: affective-computing-basics
description: Measuring emotion from behavior and physiology — facial expression, voice, EDA, and self-report integration.
category: scientific
---

## Overview

affective-computing-basics covers the scientific measurement of emotion and affect: self-report
instruments, facial expression analysis, vocal prosody, and peripheral physiology (EDA, heart rate,
respiration). It focuses on validity — what each channel actually indexes — because emotion
measurement is where convenient proxies most often replace the construct.

The dimensional view (valence × arousal, plus dominance) organizes most measurement; discrete
emotion categories ("basic emotions") are useful labels but contested as natural kinds. Measure
dimensions; interpret categories cautiously.

## When to use

- Choosing emotion measures for an experiment: self-report vs behavior vs physiology.
- Facial expression analysis: FACS/action units vs black-box "emotion AI" classifiers.
- Vocal affect: prosodic features (pitch, intensity, rate) and their limits.
- Physiology: EDA (arousal), HRV (regulatory capacity), startle/facial EMG (valence).
- Multimodal integration: combining channels without double-counting.
- Evaluating commercial "emotion recognition" claims.

## Core concepts

- **Self-report: still the gold standard for experience.** Validated scales (PANAS, SAM manikins,
  Geneva Emotion Wheel) measure felt affect directly. Limitations: introspection limits,
  demand characteristics, and retrospective bias — use momentary (EMA) over recalled reports when
  possible. Never treat a proxy as superior to self-report for subjective experience without
  evidence.
- **Dimensional vs discrete.** Valence (pleasant-unpleasant) × arousal (calm-activated) captures
  most variance in affective responses. Discrete labels (anger, fear, joy) are folk categories
  with fuzzy boundaries — useful for communication, weak as measurement targets.
- **Facial expressions.** FACS action units (AU4 brow lowerer, AU12 lip corner puller) are
  anatomically grounded and codable; automated AU detection is reasonably mature. Black-box
  "this face = angry" classifiers conflate expression with felt emotion — posed-expression
  training data doesn't generalize to spontaneous affect, and context dominates interpretation.
- **Vocal prosody.** Mean/range of F0, intensity, speech rate, jitter/shimmer index arousal
  reliably; valence from voice alone is weak. Speaker normalization is essential; recording
  conditions (microphone, room) confound features.
- **EDA (skin conductance).** Indexes sympathetic arousal — sensitive, but valence-blind (fear
  and excitement look identical). Measure: skin conductance responses (event-related peaks,
  1-4 s latency) and tonic level. Confounds: temperature, humidity, movement, electrode drying.
  Always record a baseline and analyze change scores.
- **Cardiac measures.** Heart rate (arousal/effort), HRV — RMSSD and high-frequency power index
  parasympathetic activity, associated with emotion regulation capacity. Needs clean ECG/PPG,
  controlled respiration (respiratory rate confounds HF-HRV), and ≥5 min recordings for trait
  HRV.
- **Facial EMG.** Corrugator (frown) tracks negative valence, zygomaticus (smile) positive
  valence — more valence-sensitive than EDA. Invasive-feeling but the best peripheral valence
  measure available.
- **Multimodal integration.** Channels disagree routinely (desynchrony is normal — experience,
  expression, and physiology decouple). Don't average them into one "emotion score"; model them
  as separate indicators of a latent state, and report divergence as a finding.

## Practical workflow

1. **Define the affective target.** Valence? Arousal? Specific appraisal? Pick measures that
   index that target (don't use EDA to study valence).
2. **Baseline.** Resting baseline for every physiological channel, every session; control room
   temperature and time of day.
3. **Elicit.** Validated stimuli (IAPS/NAPS images, film clips, music) with pilot-tested
   effectiveness; include neutral controls; randomize order.
4. **Record multimodally.** Self-report (SAM/PANAS) + at least one behavioral + one
   physiological channel; synchronize timestamps.
5. **Preprocess.** Artifact rejection per channel (movement in EDA, ectopic beats in ECG);
   baseline-correct; extract features in preregistered windows.
6. **Analyze.** Channel-appropriate models; test convergence across channels; treat divergence as
   informative, not as error.
7. **Report.** Stimulus validation data, preprocessing parameters, baseline procedures, and the
   validity evidence for each measure's claimed interpretation.

## Common pitfalls

- Treating commercial "emotion AI" labels as ground truth about felt emotion.
- Using EDA (arousal-only) to claim valence effects.
- Posed-expression datasets presented as spontaneous-emotion evidence.
- Ignoring desynchrony — forcing channels to agree.
- No baseline correction for physiology (individual differences swamp effects).
- Retrospective emotion ratings treated as momentary experience.
- Confounding emotion with attention, effort, or novelty (arousal is not specific).
