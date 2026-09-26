---
name: time-series-forecasting
description: Forecasting time-ordered data — ARIMA/state-space models, stationarity handling, backtesting, and honest prediction intervals.
category: scientific
---

## Overview

Forecasting turns time-ordered observations into decisions about the
future. This skill covers the classical forecasting toolkit
(decomposition, ARIMA/SARIMA, exponential smoothing, state-space
models), making series stationary, spectral analysis, and the
validation discipline — rolling-origin backtesting without leakage —
that separates real forecast skill from in-sample illusions.

## When to use

- Forecasting: demand, concentrations, prices, sensor readings, disease incidence
- Decomposing trend/seasonality/residuals for reporting or preprocessing
- Testing for unit roots, changepoints, or structural breaks
- Choosing between ARIMA, ETS, and ML approaches for a forecasting task
- Evaluating forecasts honestly: backtesting without lookahead leakage

## Core concepts

- **Stationarity:** constant mean/variance/autocovariance over time — most classical methods assume it; test (ADF, KPSS — use both, they have opposite nulls) and induce it by differencing or detrending.
- **ACF/PACF:** autocorrelation and partial autocorrelation patterns identify AR vs MA signatures — the Box–Jenkins identification step; slow ACF decay = non-stationarity.
- **ARIMA(p,d,q):** autoregressive + integrated (differencing) + moving-average; seasonal SARIMA adds seasonal terms. Parsimony wins: information-criterion selection beats hand-tuning.
- **State-space / ETS:** unobserved components (level, trend, seasonality) evolving stochastically — the Kalman filter gives optimal updates; handles missing data naturally.
- **Decomposition:** classical/STL split into trend + seasonal + remainder — STL (LOESS-based) is robust and the default exploratory choice.
- **Forecast intervals widen:** uncertainty grows with horizon (√h for random walks, faster with parameter uncertainty) — point forecasts without intervals are half an answer.

- **Intermittent demand:** series with many zeros (spare parts, slow movers) break ARIMA — Croston's method and its variants (SBA, TSB) model demand size and interval separately.
- **Hierarchical forecasting:** forecasts at multiple aggregation levels (SKU → category → total) must cohere — reconciliation (bottom-up, top-down, MinT) enforces adding-up with better accuracy than independent forecasts.
- **Probabilistic forecasting:** full predictive distributions (quantiles, ensembles) instead of point forecasts — proper scoring rules (CRPS, log score) evaluate them; decisions under uncertainty need distributions, not points.

## Practical workflow

### 1. Explore and decompose

```python
from statsmodels.tsa.seasonal import STL
res = STL(series, period=12, robust=True).fit()
res.plot()  # trend, seasonal, resid — inspect each before modeling
```

1. Plot the raw series; look for trend, seasonality, outliers, changepoints, and variance changes (log-transform if variance scales with level).
2. STL decomposition with robust=True; examine the remainder for leftover structure (autocorrelation = unmodeled signal).
3. Test stationarity (ADF + KPSS); difference until stationary, but don't over-difference (it injects MA unit roots).

### 2. Identify and fit

1. Use ACF/PACF plus information criteria (AICc) for order selection — or auto_arima; keep models small.
2. Fit and run diagnostics: Ljung–Box on residuals (should be white noise), residual ACF plots, and stability of parameters across subsamples.
3. For multiple seasonalities or regressors (holidays, temperature): dynamic regression or state-space models with exogenous variables.

### 3. Forecast with discipline

1. **Backtest:** rolling-origin evaluation — fit on history, forecast h steps, roll forward; never evaluate on data used for fitting or tuning.
2. Report accuracy at each horizon (MAE/RMSE and scaled errors like MASE for comparability); always beat naive baselines (naive, seasonal naive) before claiming value.
3. Produce prediction intervals (analytical or bootstrap/simulation) — and check their empirical coverage on the backtest.

### 4. Handle the real world

1. **Changepoints:** test for structural breaks; a model fit across a regime change forecasts neither regime well.
2. **Missing data:** state-space/Kalman handles gaps natively; interpolation before ARIMA biases autocorrelation — avoid it.
3. **Exogenous shocks:** known interventions (policy changes, outages) need intervention variables or regime models, not hoping the AR terms absorb them.

### 5. Set up a forecast-monitoring system

1. Track forecast vs actuals continuously with a dashboard: bias (mean error), accuracy (MAE/MAPE), and interval coverage — degradation is gradual and invisible without monitoring.
2. Define retraining triggers: performance thresholds, data-drift detection, or calendar schedules — whichever comes first.
3. Keep a champion–challenger setup: the production model vs a candidate — promote only on backtested, out-of-sample superiority, not on in-sample fit.

### 6. Quick-reference checklist

- [ ] Series plotted and STL-decomposed before modeling
- [ ] Stationarity tested (ADF + KPSS); differencing justified
- [ ] Model orders selected by information criteria, kept parsimonious
- [ ] Residuals checked (white noise, no leftover structure)
- [ ] Backtested with rolling origin; no lookahead leakage
- [ ] Naive baselines beaten before claiming value
- [ ] Prediction intervals produced and coverage checked
- [ ] Evaluation horizon matched to the decision lead time

## Common pitfalls

- **Forecasting non-stationary series raw:** trends extrapolated forever — difference or model the trend explicitly.
- **In-sample fit as forecast skill:** fit quality on training data says nothing about forecasting — backtest out-of-sample.
- **Lookahead leakage:** using full-sample decomposition/deseasonalization before splitting — the future leaks into the "past" features.
- **Ignoring prediction intervals:** point forecasts without uncertainty are unusable for decisions — and usually wrong.
- **Overfitting with ML:** deep models on short series memorize noise — classical methods win on small data; ML needs scale and careful validation.
- **Seasonal naive unbeaten:** if a sophisticated model can't beat last-year-this-week, simplify — complexity must earn its keep.
- **Forecasting with a broken horizon:** evaluating 1-step-ahead accuracy when decisions need 12-step-ahead — match the evaluation horizon to the decision lead time.
- **Ignoring forecast value-added analysis:** complex models that barely beat naive baselines add maintenance cost without benefit — quantify the improvement or simplify.
