---
name: pandas-pro
description: pandas guidance — data wrangling, groupby, merging, time series, performance optimization, and memory management.
category: development
---

## Overview

pandas is the lingua franca of tabular data in Python: DataFrames for wrangling, groupby for aggregation, merges for combining, and time-series tooling that handles most real-world messiness. It's also easy to write slow, memory-hungry pandas — the difference between fluent and naive usage is often 100x.

This skill covers idiomatic pandas: vectorized operations, the split-apply-combine pattern, correct merging, time-series handling, and the performance/memory practices that keep big DataFrames tractable.

## When to use

- Wrangling and cleaning tabular data.
- Aggregating with groupby.
- Merging/joining DataFrames.
- Working with time series.
- Speeding up slow pandas code.
- Reducing pandas memory usage.

## Core concepts

- **Vectorization.** Operate on whole columns, never loop rows: `df['c'] = df['a'] + df['b']`, not `iterrows()`. Row loops are 100-1000x slower — if you're writing `for` over a DataFrame, there's almost always a vectorized way.
- **Indexing.** `.loc` (labels), `.iloc` (positions), boolean masks — `df.loc[df['x'] > 0, 'y']`. Chained indexing (`df[a][b]`) risks SettingWithCopyWarning; use single `.loc` calls. Copy-on-Write (default in 3.0) changes mutation semantics — know it.
- **groupby (split-apply-combine).** `df.groupby('key').agg(...)` — the core aggregation pattern; `transform` for group-aligned results (z-scores within groups), `apply` as the flexible-but-slow escape hatch. Named aggregations for readable multi-output.
- **Merges and joins.** `merge` (SQL-style: inner/left/right/outer on keys), `join` (index-based), `concat` (stacking). Validate with `validate=` ('one_to_one', 'many_to_one') — catching unexpected duplicates at merge time. Understand merge cardinality before merging.
- **Reshaping.** `pivot`/`pivot_table` (long→wide), `melt` (wide→long), `stack`/`unstack` — tidy data (one observation per row) makes everything downstream easier.
- **Missing data.** `isna`/`notna`, `fillna` (with method/limit awareness — forward-fill across gaps lies), `dropna` (with `subset`/`thresh`), `interpolate` for time series. Missingness is information — understand why values are missing before filling.
- **Dtypes.** `int64`→`int32`, `float64`→`float32`, `object`→`category` for low-cardinality strings, nullable `Int64`/`boolean` for missing-aware integers, `string` dtype. Correct dtypes halve memory and speed operations.
- **Time series.** `DatetimeIndex`, `resample` (downsampling), `asfreq`/`reindex` (regularizing), `rolling`/`ewm` (windows), timezone-aware (`tz_localize`/`tz_convert`) — DST and timezone bugs are perennial; be explicit.
- **String methods.** `.str` accessor (contains, extract, split) — vectorized string ops; regex via `extract` with named groups. Faster than `.apply` with Python string functions.
- **Categorical.** `astype('category')` for repeated strings (statuses, codes) — massive memory savings and faster groupbys; ordered categoricals for meaningful sorting.
- **Method chaining.** `df.pipe(clean).query("x > 0").assign(z=lambda d: d.x * 2)` — readable pipelines without intermediate variables; `assign`/`query` keep chains fluent.
- **Memory.** `memory_usage(deep=True)`, downcasting numerics, categoricals for strings, chunked reading (`chunksize`) for files bigger than RAM, `pyarrow` dtypes/backend for large data.
- **I/O.** `read_csv` with `dtype`, `parse_dates`, `usecols` (read only what you need); Parquet (`read_parquet`) for analytics — faster and typed; `to_parquet` for intermediates instead of CSV.
- **MultiIndex.** Hierarchical indexes for panel data — powerful but complexity-heavy; `reset_index` when simplicity wins. Know `xs` and `loc` with tuples for selection.

## Practical workflow

1. **Profile first.** `df.info()`, `df.memory_usage(deep=True)`, `df.describe()` — know shape, dtypes, and memory before touching anything.
2. **Fix dtypes early.** Downcast numerics, categorize low-cardinality strings, parse dates at read time:
   ```python
   df = pd.read_csv("data.csv", usecols=["id", "ts", "status", "amount"],
                    parse_dates=["ts"],
                    dtype={"status": "category", "amount": "float32"})
   ```
3. **Clean vectorized.** Boolean masks, `.str` methods, `fillna` with intent — no row loops:
   ```python
   clean = (df.dropna(subset=["id"])
              .query("amount >= 0")
              .assign(amount_usd=lambda d: d["amount"] * rate,
                      status=lambda d: d["status"].str.lower().str.strip()))
   ```
4. **Aggregate with groupby.** Named aggregations for clarity; `transform` for within-group features:
   ```python
   summary = df.groupby("customer").agg(
       orders=("id", "count"),
       total=("amount_usd", "sum"),
       avg=("amount_usd", "mean"))
   df["z"] = df.groupby("customer")["amount_usd"].transform(
       lambda s: (s - s.mean()) / s.std())
   ```
5. **Merge carefully.** Check key uniqueness first; use `validate=`; inspect `_merge` indicator for unexpected non-matches:
   ```python
   merged = orders.merge(customers, on="customer_id", how="left",
                         validate="many_to_one", indicator=True)
   ```
6. **Handle time properly.** Timezone-aware indexes, `resample` for aggregation, `rolling` for windows; explicit about gaps vs missing.
7. **Optimize hot paths.** Replace `.apply` with vectorized ops; categoricals for groupby keys; `numba`/`eval` for extreme cases; chunked processing when RAM-bound.
8. **Persist as Parquet.** Intermediates and outputs in Parquet (typed, compressed, fast) — CSV only at system boundaries.

## Common pitfalls

- **Row loops** — `iterrows`/`itertuples` for transforms; vectorize instead (100x+).
- **Chained assignment** — `df[a][b] = v` silently failing; single `.loc` calls.
- **Object dtype everywhere** — strings as objects eating memory; categoricals + proper dtypes.
- **Merging on duplicates** — cartesian explosions; `validate=` and key checks first.
- **Timezone-naive datetimes** — DST bugs; explicit tz handling.
- **Forward-fill across gaps** — `ffill` inventing data; limit-aware filling.
- **`.apply` as default** — Python-level loops in disguise; vectorized alternatives first.
- **Reading whole files** — `usecols`, `dtype`, `chunksize`, Parquet for big data.
- **Ignoring SettingWithCopyWarning** — it signals real bugs; fix the indexing.
- **Groupby-apply slowness** — `apply` where `agg`/`transform` suffice; restructure.
- **CSV for intermediates** — slow, untyped, big; Parquet.
- **Memory blowups** — no dtype attention; profile with `memory_usage(deep=True)`.
- **MultiIndex overuse** — complexity for simple problems; flat + reset_index often wins.
