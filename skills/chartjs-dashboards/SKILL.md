---
name: chartjs-dashboards
description: Build dashboards with Chart.js: layout, KPI cards, cross-chart filtering, theming, and real-time panels. Use for operational and analytics dashboards.
category: web-development
---

# Chart.js Dashboards

A dashboard-focused companion to Chart.js mechanics: layout patterns, KPI cards, coordinated charts, theming, real-time panels, and the operational discipline (loading states, refresh, exports) dashboards need.

## Overview

A dashboard is a **decision surface**, not a chart gallery. This skill covers composing Chart.js charts into dashboards that answer questions fast: KPI-first layout, consistent visual language, cross-chart filtering, live data handling, and the unglamorous reliability work (timezones, refresh, empty states) that separates production dashboards from demos.

## When to use

- Analytics, operational, or admin dashboards.
- KPI cards + trend charts + breakdown tables.
- Real-time monitoring panels.
- Theming dashboards (light/dark, brand).
- Adding exports, date-range selection, and filters.

## Core concepts

- **KPI-first layout.** Top row: KPI cards (value, delta vs previous period, sparkline). Below: trend charts (time series). Then breakdowns (bars, doughnuts). Detail tables last. Eye path: status → trend → cause.
- **One visual language.** Single palette (categorical colors assigned consistently across charts), shared number/date formatting, consistent axis styling via `Chart.defaults`.
- **Coordinated charts.** Clicking a segment in one chart filters others: chart click → update dashboard filter state → `chart.update()` on dependents (or re-set data). Keep a single filter state object.
- **Date ranges.** Presets (24h, 7d, 30d) + custom; all charts share the range; show the active range explicitly. Timezone: normalize to one zone (UTC or the business's zone) and label it.
- **Refresh strategy.** Manual refresh button + auto-refresh interval (with visible "updated Xs ago"); pause auto-refresh when tab hidden (`visibilitychange`); stagger chart updates to avoid UI jank.
- **Sparklines.** Tiny charts in KPI cards: `options: { plugins: { legend: { display: false }, tooltip: { enabled: false } }, scales: { x: { display: false }, y: { display: false } }, elements: { point: { radius: 0 } } }`.

## Practical workflow

**1. Set global defaults.**
```js
Chart.defaults.font.family = 'Inter, system-ui, sans-serif';
Chart.defaults.font.size = 12;
Chart.defaults.color = '#64748b';
Chart.defaults.borderColor = 'rgba(100,116,139,0.15)';
```

**2. Dashboard state.**
```js
const dashboard = {
  range: { from, to },
  filters: { region: 'all', segment: 'all' },
  async refresh() {
    const data = await api.getDashboard(this.range, this.filters);
    updateKpis(data.kpis);
    trendChart.data = transformTrend(data.trend); trendChart.update();
    // ... each chart
    setUpdatedNow();
  }
};
```

**3. Cross-filtering.**
```js
breakdownChart.options.onClick = (evt, elements) => {
  if (!elements.length) return;
  const segment = breakdownChart.data.labels[elements[0].index];
  dashboard.filters.segment = segment;
  dashboard.refresh();
};
```
Show active filters as removable chips; "reset" restores all.

**4. Real-time panel.** WebSocket/polling → push points → `update('none')`; cap series length; show connection status (live/paused/error) prominently.

**5. Loading/empty/error.** Skeleton cards while loading; empty state ("No data for this range") when zero; error state with retry. Never a blank chart.

**6. Exports.** CSV export of underlying data (not just PNG) — users want the numbers. `chart.toBase64Image()` for PNG snapshots where needed.

## Common pitfalls

- **Chart sprawl.** 20 charts answering nothing. Every chart needs a question it answers; cut the rest.
- **Inconsistent scales/colors.** Same metric, different colors/scales across charts = mistrust. Centralize formatting and palette.
- **Timezone chaos.** Mixing UTC and local timestamps shifts data by hours. Pick one, label it ("All times UTC"), convert at the boundary.
- **No updated timestamp.** Users can't tell if they're looking at live or stale data. Always show "Updated Xs ago" + refresh control.
- **Auto-refresh storms.** 10 charts polling independently = thundering herd. One refresh cycle, staggered updates, pause when hidden.
- **Vanity metrics.** Big numbers that drive no action. Pair every KPI with its delta and a path to the underlying detail.
- **Ignoring mobile.** Dashboards designed at 1440px wide collapse into mush on phones. Stack vertically, keep KPIs first, consider a simplified mobile view.
- **Filter state chaos.** Filters in five places disagreeing. Single source of truth for range + filters; every chart derives from it.
- **No deep-linking.** "Look at this spike" should be a URL. Encode range/filters in query params so dashboards are shareable.
