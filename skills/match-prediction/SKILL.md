---
name: match-prediction
description: Predict sports match outcomes with statistical models: Elo, Poisson, expected goals, features, and proper evaluation. Use when building data-driven sports forecasts — not for gambling advice.
category: sports
---

# Match Prediction

## Overview

Statistical match prediction estimates outcome probabilities from data: team strength ratings, scoring models, and contextual features.

Standard approaches: Elo-style ratings, Poisson goal models, expected-goals (xG) models, and machine learning over engineered features.

Honest prediction means calibrated probabilities and rigorous evaluation — not picking winners, but quantifying uncertainty.

This skill is about modeling methodology, not betting. Predictions inform analysis; they don't overcome bookmaker margins reliably.

## When to use

- Building a sports prediction model for analysis
- Comparing teams quantitatively beyond standings
- Learning sports analytics methodology
- Evaluating tipster/model claims critically
- Fantasy or analytical projects needing win probabilities

## Core concepts

- **Elo ratings.**
  Teams gain/lose points based on results vs. expectation. Simple, self-correcting, works across sports. Home advantage as a rating offset.
- **Poisson goal models.**
  Model each team's scoring rate from attack/defense strength; Poisson distributions give scoreline probabilities, hence win/draw/loss.
- **Expected goals (xG).**
  Shot quality > shot quantity. xG-based ratings measure underlying performance better than results, which are noisy.
- **Feature engineering.**
  Recent form (weighted), home/away splits, rest days, injuries, head-to-head, motivation (nothing-to-play-for effects). Features beat raw tables.
- **Calibration.**
  Predicted 70% should happen ~70% of the time. Plot calibration curves; a model that's right on winners but wrong on probabilities is broken.
- **Evaluation metrics.**
  Log loss and Brier score for probabilities (not just accuracy). Backtest on out-of-sample data; never evaluate on training data.
- **Market as benchmark.**
  Bookmaker odds imply probabilities (minus margin). Beat the closing line consistently or your model adds no value over the market.
- **Uncertainty.**
  Report probabilities with uncertainty, not certainties. '65% ± 8%' is honest; 'Team X will win' is not prediction, it's punditry.

## Practical workflow

1. **Choose the sport and scope.**
   One league, recent seasons. Define exactly what you predict (match outcome, scoreline, totals).
2. **Gather data.**
   Results, scores, dates, venues. xG data if available. Clean: handle postponements, neutral venues, promoted teams.
3. **Build baseline ratings.**
   Start with Elo: initialize, update per match, tune K-factor and home advantage on historical data.
4. **Add a scoring model.**
   Poisson with attack/defense parameters, or xG-based expected scores. Convert to outcome probabilities.
5. **Engineer features.**
   Weighted recent form, rest, injuries, motivation. Add incrementally; validate each addition out-of-sample.
6. **Backtest properly.**
   Walk-forward validation: train on past, predict future, roll forward. Never touch the test set during development.
7. **Evaluate calibration.**
   Log loss, Brier score, calibration plots vs. baseline (Elo-only) and vs. market odds. Iterate on failures.
8. **Report honestly.**
   Probabilities with uncertainty; documented methodology; limitations stated. Update as new data arrives.

## Common pitfalls

- **Accuracy-only evaluation.**
  60% accuracy with terrible probabilities. Log loss/Brier score judge probability quality; accuracy doesn't.
- **Training-set testing.**
  Evaluating on data the model was built on. Optimistic fiction — walk-forward out-of-sample only.
- **Ignoring the market.**
  Claiming edge without comparing to odds-implied probabilities. The market is the benchmark to beat.
- **Overfitting features.**
  20 features tuned on 3 seasons. Simple models generalize; complex ones memorize. Validate ruthlessly.
- **Result-based ratings only.**
  Rankings from wins/losses ignore underlying performance. xG-style metrics predict better than raw results.
- **Certainty theater.**
  Presenting 58% as 'will win.' Probabilities are the product; false certainty destroys trust (and bankrolls).
- **Gambler's fallacy inputs.**
  'Due for a win' streak logic. Models use base rates and current strength, not narratives.
- **Betting on your model.**
  This skill is methodology, not financial advice. Models rarely beat efficient markets after margin; treat predictions as analysis.
