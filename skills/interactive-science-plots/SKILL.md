---
name: interactive-science-plots
description: Building interactive scientific visualizations — Plotly/Bokeh dashboards, linked views, and exploratory data apps.
category: scientific
---

## Overview

Static figures present conclusions; interactive plots enable exploration —
zooming into regions, hovering for values, toggling series, brushing
linked views. This skill covers building interactive scientific
visualizations with Plotly and Bokeh (plus lightweight dashboarding),
designing interactions that answer real questions, and the performance
and reproducibility practices interactive work demands.

## When to use

- Exploring a large or high-dimensional dataset before committing to static figures
- Sharing results with collaborators who need to interrogate the data themselves
- Building a dashboard for monitoring experiments, instruments, or model runs
- Presenting complex data (spectra, maps, time series) in talks or supplements
- Deciding what deserves interactivity vs what should stay a static figure

## Core concepts

- **Interaction vocabulary:** hover (inspect values), zoom/pan (focus), brush/select (subset), toggle (compare series), linked views (selection in one plot highlights in others) — each serves a question; gratuitous widgets are clutter.
- **The exploration–explanation split:** interactive tools are for exploration and collaborator interrogation; papers still need static figures — design the interactive view to support the same conclusions, not to replace the argument.
- **Data volume vs browser:** browsers choke beyond ~10⁵–10⁶ points — downsample (datashader), aggregate, or use WebGL traces; never ship a 50 MB HTML file.
- **State and reproducibility:** an interactive session's conclusions should be capturable — exportable selections, URL parameters, or logged filter states — otherwise findings evaporate when the tab closes.
- **Linked views:** the most powerful pattern — brushing a region in a scatter plot highlights corresponding rows in a table, map, and time series; implement with shared data sources (Bokeh ColumnDataSource, Plotly selections).
- **Progressive disclosure:** overview first, zoom/filter, details on demand (Shneiderman's mantra) — don't dump all dimensions at once.

- **Brushing and linking:** selecting in one view highlights the same records in all others — the core interaction for multidimensional data; implement with shared data sources, not duplicated state.
- **Level of detail:** show aggregates at overview zoom, individual points on zoom-in — datashader-style dynamic rendering keeps million-point datasets explorable without browser meltdown.
- **Provenance of interactions:** log the filter/selection state that produced an insight (URL parameters, exported subsets) — otherwise discoveries made by dragging sliders evaporate when the tab closes.

## Practical workflow

### 1. Choose the stack

```python
import plotly.express as px
# Plotly: fastest path to rich interactivity, exports to self-contained HTML
fig = px.scatter(df, x="x", y="y", color="group", hover_data=["id", "value"],
                 marginal_x="histogram")
fig.write_html("explore.html", include_plotlyjs="cdn")
```

1. **Plotly:** best default — expressive, good docs, self-contained HTML export; Plotly Express for speed, graph_objects for control.
2. **Bokeh:** better for streaming data and custom linked dashboards; steeper learning curve.
3. **Panel/Streamlit/Dash:** when you need a real app (controls, layouts, callbacks) rather than a plot — Streamlit for fastest prototyping, Dash for production.
4. **Datashader + HoloViews:** for genuinely big data (10⁷+ points) — rasterize server-side, interact client-side.

### 2. Design the interactions

1. Start from questions: "which points are outliers?", "how does this region behave over time?", "do groups separate?" — one interaction per question.
2. Implement linked views for multidimensional data: select in the scatter, see the spectra/map/time series update.
3. Add hover templates with the identifiers and values a scientist actually needs (sample ID, coordinates, uncertainty) — default hovers waste the opportunity.

### 3. Handle scale

1. Downsample intelligently for display (stratified or density-preserving), but keep full data behind selections where feasible.
2. Use WebGL rendering (scattergl) for 10⁴–10⁶ points; datashader beyond that.
3. Lazy-load: don't embed multi-MB datasets in HTML when a data server (or parquet + range queries) will do.

### 4. Share and preserve

1. Export self-contained HTML for collaborators (note the Plotly.js CDN vs inline trade-off: inline works offline, CDN keeps files small).
2. For dashboards: pin dependency versions, document the data source and refresh logic — a dashboard showing stale data silently is worse than none.
3. Capture conclusions: "export selection" buttons, snapshot URLs, or companion notebooks that regenerate the key static figures from the same data.

### 5. Build a linked-view explorer

1. Choose 2–4 complementary views (scatter, histogram, map, time series) sharing one data source — each view answers a different question about the same records.
2. Implement cross-filtering: brushing the scatter filters the histogram and highlights map points — test that selections propagate in all directions.
3. Add an "export selection" button writing the current subset to CSV with the filter parameters in the header — this closes the exploration-to-analysis loop.

## Common pitfalls

- **Interactivity as a substitute for a conclusion:** an explorer that lets users "see for themselves" still needs the author's interpretation stated.
- **Browser meltdown:** dumping 10⁷ raw points into a DOM-based plot — downsample or rasterize.
- **Unreproducible exploration:** findings discovered by dragging sliders, with no record of the state — log or export the view parameters.
- **Stale dashboards:** live-looking dashboards on dead data pipelines — monitor freshness and display the last-update time prominently.
- **Hover-only information:** critical values available only on hover are invisible in screenshots and print — keep key numbers in the static layer too.
- **Over-widgeting:** twelve dropdowns where two would do — every control must earn its place by answering a real question.
- **Unshared state bugs:** views drifting out of sync because each holds its own copy of the data — single source of truth, always.
- **Performance cliff at scale:** DOM-based rendering dies past ~10⁵ points — switch to canvas/WebGL or server-side rasterization before users discover the cliff.
