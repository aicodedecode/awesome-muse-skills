---
name: scikit-learn-pro
description: scikit-learn guidance — pipelines, model selection, cross-validation, preprocessing, and production deployment.
category: development
---

## Overview

scikit-learn is the workhorse of classical machine learning: consistent `fit`/`predict`/`transform` APIs across dozens of estimators, excellent preprocessing and model-selection tooling, and the `Pipeline` abstraction that prevents the most common ML bug (data leakage). For tabular data and problems that don't need deep learning, it's usually the right tool.

This skill covers the sklearn workflow done properly: pipelines, correct cross-validation, preprocessing, hyperparameter search, and the path from experiment to a deployed model.

## When to use

- Building classical ML models (classification, regression, clustering).
- Preventing data leakage with pipelines.
- Tuning hyperparameters (grid/random search).
- Preprocessing (scaling, encoding, imputation).
- Evaluating models correctly (cross-validation, metrics).
- Deploying sklearn models to production.

## Core concepts

- **The estimator API.** `fit(X, y)`, `predict(X)`, `transform(X)`, `score(X, y)` — uniform across the library. Learn the contract once, apply everywhere. `get_params`/`set_params` enable search and cloning.
- **Pipelines.** `Pipeline([('scale', StandardScaler()), ('clf', LogisticRegression())])` — preprocessing + model as one object that cross-validates and deploys correctly. The #1 leakage prevention: transformers fit only on training folds inside CV.
- **ColumnTransformer.** Different preprocessing per column type (scale numerics, one-hot categoricals, passthrough the rest) — the real-world pipeline that handles messy DataFrames.
- **Train/test split.** `train_test_split` with `stratify=y` for classification, `random_state` for reproducibility. The test set is touched once — for final evaluation, never for decisions.
- **Cross-validation.** `cross_val_score` / `cross_validate` with `StratifiedKFold` (classification), `GroupKFold` (grouped data — patients, users), `TimeSeriesSplit` (temporal data — no shuffling the future into the past). CV strategy must match the data structure.
- **Data leakage.** Fitting preprocessors on full data before splitting; target-derived features; future information in time series. Pipelines + correct CV eliminate most leakage; constant vigilance handles the rest.
- **Metrics.** Accuracy is rarely the right metric: precision/recall/F1, ROC-AUC, PR-AUC for classification; RMSE/MAE/R² for regression. Choose the metric that matches the business cost of errors; optimize and report it consistently.
- **Imbalanced data.** `class_weight='balanced'`, resampling (SMOTE etc.), threshold tuning on PR curves — accuracy lies on imbalanced data; PR-AUC and business-weighted metrics tell the truth.
- **Hyperparameter search.** `GridSearchCV` (small spaces), `RandomizedSearchCV` (larger spaces, better value), successive halving for expensive fits. Search inside nested CV for unbiased performance estimates; search on the pipeline, not the bare estimator.
- **Preprocessing.** `StandardScaler` (regularized linear models, SVMs, kNN), `OneHotEncoder(handle_unknown='ignore')` (categoricals — the `handle_unknown` is production-critical), `SimpleImputer` (missing values — fit on train only), text (`TfidfVectorizer`).
- **Feature selection/engineering.** `SelectKBest`, RFECV, or model-based selection — inside the pipeline. Polynomial features for linear models; domain features beat algorithm tuning.
- **Calibration.** `CalibratedClassifierCV` — when you need trustworthy probabilities (risk scoring, expected-value decisions), not just rankings.
- **Model persistence.** `joblib.dump` of the whole pipeline (preprocessing included!) — deploying the estimator without its preprocessing is a classic production bug. Version the artifact with its training metadata.
- **Inspection.** `permutation_importance`, partial dependence, coefficients for linear models — understand what the model learned before trusting it.
- **Baselines first.** DummyClassifier/DummyRegressor and a simple logistic regression — if a fancy model barely beats the baseline, the features (not the algorithm) need work.

## Practical workflow

1. **Start with baselines.** Dummy + logistic regression; record the metric. Every subsequent improvement is measured against this.
2. **Build the pipeline.** Preprocessing + estimator as one object from the start — never fit transformers outside it:
   ```python
   from sklearn.compose import ColumnTransformer
   from sklearn.pipeline import Pipeline
   from sklearn.preprocessing import OneHotEncoder, StandardScaler
   from sklearn.impute import SimpleImputer
   from sklearn.ensemble import HistGradientBoostingClassifier

   numeric = Pipeline([("impute", SimpleImputer(strategy="median")),
                       ("scale", StandardScaler())])
   categorical = Pipeline([("impute", SimpleImputer(strategy="most_frequent")),
                           ("onehot", OneHotEncoder(handle_unknown="ignore"))])
   pre = ColumnTransformer([("num", numeric, num_cols), ("cat", categorical, cat_cols)])
   pipe = Pipeline([("pre", pre), ("clf", HistGradientBoostingClassifier())])
   ```
3. **Validate correctly.** Stratified/grouped/time-series CV matching the data; the metric matching the business cost:
   ```python
   from sklearn.model_selection import cross_validate, StratifiedKFold
   cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
   scores = cross_validate(pipe, X, y, cv=cv,
                           scoring=["roc_auc", "average_precision"])
   ```
4. **Tune inside the pipeline.** `RandomizedSearchCV` on pipeline params (`clf__learning_rate`); nested CV if you need unbiased estimates of the tuned model.
5. **Inspect.** Permutation importance, confusion matrix, calibration curve — does the model learn sensible things?
6. **Evaluate once on held-out test.** A single final number; if you iterate on it, it's validation data now.
7. **Persist the pipeline.** `joblib.dump(pipe, "model-v3.joblib")` — preprocessing included; log training data version, code commit, and metrics alongside.
8. **Deploy with monitoring.** Batch or API serving; monitor input distributions and prediction drift; retrain on schedule or trigger.

## Common pitfalls

- **Leakage via preprocessing** — scaling/imputing before splitting; pipelines fit inside CV folds.
- **Wrong CV strategy** — shuffling time series, ignoring groups; match CV to data structure.
- **Accuracy on imbalanced data** — 99% accuracy, useless model; PR-AUC, F1, business metrics.
- **Tuning on the test set** — test-set overfitting by repeated peeking; test touched once.
- **Deploying estimator without preprocessing** — training pipeline ≠ serving pipeline; persist the whole Pipeline.
- **`OneHotEncoder` without `handle_unknown='ignore'`** — new categories crashing production; always set it.
- **No baselines** — complex model, unknown value; dummy + linear first.
- **Unscaled features for distance models** — kNN/SVM dominated by large-scale features; scale.
- **Ignoring calibration** — uncalibrated probabilities driving decisions; calibrate when probabilities matter.
- **Grid search over tiny spaces** — wasting compute on 3x3 grids; randomized search over wide ranges.
- **Target leakage in features** — features derived from the target; audit feature definitions.
- **No random_state** — unreproducible results; seed everything.
- **Metric/decision mismatch** — optimizing AUC while the business needs precision@k; align metric to decision.
