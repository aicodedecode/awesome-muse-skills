---
name: echarts-pro
description: Build rich visualizations with Apache ECharts: option config, dataset transforms, large-data performance, and custom rendering. Use for complex dashboards and big datasets.
category: development
---

# ECharts Pro

A practical guide to Apache ECharts: the declarative, canvas/SVG-rendered charting library that scales from simple bars to million-point visualizations — option configuration, datasets, visual mapping, large-data strategies, and custom series.

## Overview

ECharts is **declarative**: you describe the chart as a JSON-ish `option` object (`{ xAxis, yAxis, series }`) and call `chart.setOption(option)`. This makes charts serializable, diffable, and easy to generate from data pipelines. Its strengths: enormous chart-type coverage (including geo, graph, sankey, candlestick, heatmap), built-in data transforms, and serious large-dataset performance (incremental rendering, sampling).

## When to use

- Complex dashboards: mixed chart types, rich interactions (brush, dataZoom, toolbox).
- Large datasets (100k+ points) needing sampling/incremental render.
- Geo visualizations, network graphs, sankeys, Gantt-like timelines.
- When charts are generated from data (option objects serialize cleanly).
- Needing SVG output (accessibility/print) vs canvas (performance).

## Core concepts

- **Option.** The single config object. `setOption(option)` renders; `setOption(option, { notMerge: true })` replaces; default merges — understand merge semantics or updates surprise you.
- **Series.** `series: [{ type: 'line'|'bar'|'pie'|'scatter'|'candlestick'|'graph'|'heatmap'|'sankey'|..., data, encode }]`. Multiple series share axes.
- **Dataset + encode.** `dataset: { source: [[...rows]] }` + `encode: { x: 'date', y: 'value' }` — separates data from mapping; multiple series can share one dataset.
- **Transforms.** `dataset: [{ source }, { transform: { type: 'filter', config: {...} } }]` — filter/sort/aggregate declaratively before rendering.
- **Visual mapping.** `visualMap` (continuous/piecewise) maps data values → color/size/opacity. Choropleths and heatmaps depend on it.
- **Components.** `dataZoom` (inside/slider zoom), `toolbox` (save-as-image, data view), `brush` (selection), `timeline` (animated time playback), `graphic` (custom overlays).
- **Renderer.** Canvas (default, fast) vs SVG (`{ renderer: 'svg' }` — crisper, accessible DOM, slower for huge data).
- **Large data.** `series-large` strategies: `sampling: 'lttb'`, `progressive` rendering, `dataZoom` windowing. ECharts handles millions of points with the right settings.

## Practical workflow

**1. Setup.**
```js
import * as echarts from 'echarts/core';
import { LineChart, BarChart } from 'echarts/charts';
import { GridComponent, TooltipComponent, DataZoomComponent, DatasetComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
echarts.use([LineChart, BarChart, GridComponent, TooltipComponent, DataZoomComponent, DatasetComponent, CanvasRenderer]);
```
(Tree-shaken imports like Chart.js; or `import * as echarts from 'echarts'` for everything.)

**2. Dataset-driven chart.**
```js
chart.setOption({
  dataset: { source: [
    ['date', 'revenue', 'costs'],
    ['2026-01', 120, 80], ['2026-02', 150, 90], ...
  ]},
  xAxis: { type: 'category' }, yAxis: {},
  tooltip: { trigger: 'axis' },
  dataZoom: [{ type: 'inside' }, { type: 'slider' }],
  series: [
    { type: 'line', encode: { x: 'date', y: 'revenue' }, smooth: true, sampling: 'lttb' },
    { type: 'bar', encode: { x: 'date', y: 'costs' } },
  ],
});
```

**3. Updates.** `setOption` with changed data merges by default — efficient. For full replacement (new series set), pass `{ notMerge: true }`.

**4. Events.** `chart.on('click', params => ...)` — drill-downs, cross-chart filtering (dispatch actions to other charts: `chart.dispatchAction({ type: 'highlight', ... })`).

**5. Responsive.** `chart.resize()` on container resize (ResizeObserver); `media` queries in option for breakpoint-specific configs.

**6. Dispose.** `chart.dispose()` on unmount — ECharts holds DOM listeners and timers.

## Common pitfalls

- **Merge vs replace confusion.** `setOption` merges by default — stale series linger when data shape changes. Use `{ notMerge: true }` when the structure changes, merge for data updates.
- **Forgetting dispose.** Leaked charts accumulate listeners/timers in SPAs. Dispose in cleanup.
- **Huge data without sampling.** Default rendering of 1M points will hang. `sampling: 'lttb'`, `progressive`, or server-side aggregation + dataZoom.
- **Category axis with massive categories.** 10k categories on an axis = unreadable. Aggregate, or use value/time axes.
- **Tooltip trigger mismatch.** `trigger: 'axis'` for multi-series comparison; `trigger: 'item'` for pies/scatter. Wrong trigger = confusing tooltips.
- **No resize handling.** Charts don't auto-resize with containers. ResizeObserver → `chart.resize()`.
- **Over-customizing via graphic.** The `graphic` component is powerful but imperative-ish; prefer declarative series/components first.
- **Accessibility afterthought.** Canvas charts need `aria-label` on the container + a data table/summary alternative. Consider SVG renderer for screen-reader-navigable charts.
- **Timezone bugs.** Time axes with mixed UTC/local data shift points. Normalize to one zone (usually UTC) before feeding ECharts.
