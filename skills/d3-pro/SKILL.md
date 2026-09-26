---
name: d3-pro
description: Build custom data visualizations with D3: selections, scales, axes, transitions, and reusable chart patterns. Use when off-the-shelf charts aren't enough.
category: development
---

# D3 Pro

A practical guide to D3.js: the low-level visualization toolkit — selections and the data join, scales, axes, shapes, transitions, and building reusable, responsive custom charts.

## Overview

D3 is not a chart library; it's a **visualization toolkit**. You bind data to DOM/SVG elements and describe how data maps to visuals. That means total control (any chart ever invented, plus new ones) at the cost of writing more code. Use D3 when the design is custom; use a chart library when it's standard.

The core pattern: **select elements → join data → enter/update/exit → map data through scales → transition changes.**

## When to use

- Custom/bespoke chart designs not covered by chart libraries.
- Interactive visualizations: brushing, zooming, linked views, animations.
- Geographic maps (d3-geo + TopoJSON), hierarchies (treemap, sunburst), networks (force layout).
- Learning the concepts that underpin all data viz (scales, joins).

## Core concepts

- **Selections.** `d3.select('svg').selectAll('circle')` — D3's jQuery-like DOM API with data binding.
- **Data join.** `.data(data, keyFn).join(enter => ..., update => ..., exit => ...)` — the heart of D3. Key functions keep element identity stable across updates (no key = index-based, which scrambles on reorder).
- **Scales.** `scaleLinear`, `scaleTime`, `scaleBand`, `scaleOrdinal`, `scaleLog` — map data domain → visual range. `scaleBand` for bars (with padding), `scaleTime` handles dates/irregular intervals.
- **Axes.** `axisBottom(scale)` renders ticks; customize with `tickFormat`, `ticks(n)`. Style via CSS, not attributes, for maintainability.
- **Shapes & layouts.** `line()`, `area()`, `arc()` (pies/donuts/gauges); layouts: `pie()`, `stack()`, `hierarchy()` + `treemap()`/`pack()`, `forceSimulation()` for networks.
- **Transitions.** `.transition().duration(750).attr(...)` — interpolates attributes; interrupt-safe. Animate data changes, not just entrances.
- **Zoom/brush.** `d3.zoom()` (pan/zoom with rescaled axes), `d3.brush()` (range selection) — the building blocks of interactive exploration.
- **Modules.** D3 is modular — import only what you need (`d3-scale`, `d3-selection`) to keep bundles small.

## Practical workflow

**1. Scaffold (margin convention).**
```js
const margin = { top: 20, right: 20, bottom: 40, left: 50 };
const width = 640 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

const svg = d3.select('#chart').append('svg')
  .attr('viewBox', `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
  .attr('role', 'img').attr('aria-label', 'Monthly revenue bar chart');
const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
```
`viewBox` (not fixed width/height) = responsive for free.

**2. Scales + axes.**
```js
const x = d3.scaleBand().domain(data.map(d => d.month)).range([0, width]).padding(0.2);
const y = d3.scaleLinear().domain([0, d3.max(data, d => d.revenue)]).nice().range([height, 0]);
g.append('g').attr('transform', `translate(0,${height})`).call(d3.axisBottom(x));
g.append('g').call(d3.axisLeft(y).tickFormat(d => `$${d / 1000}k`));
```

**3. Join + transitions.**
```js
g.selectAll('rect').data(data, d => d.month)
  .join(
    enter => enter.append('rect').attr('y', height).attr('height', 0),
    update => update,
    exit => exit.transition().duration(300).attr('height', 0).attr('y', height).remove()
  )
  .transition().duration(750)
  .attr('x', d => x(d.month)).attr('width', x.bandwidth())
  .attr('y', d => y(d.revenue)).attr('height', d => height - y(d.revenue));
```

**4. Interactivity.** Tooltips via a positioned HTML div (easier to style than SVG text); brush/zoom for exploration; keyboard-accessible alternatives for critical data.

**5. Reusable pattern.** Wrap in a function taking `(selection, data, options)`; keep scales/axes inside; expose update by re-calling with new data.

## Common pitfalls

- **Missing key function.** `.data(data)` without keys → index join → bars morph into wrong categories on update. Always key by stable ID.
- **Fixed pixel dimensions.** Hard-coded width/height breaks responsiveness. `viewBox` + CSS `width: 100%`.
- **Y domain not starting at zero (bars).** Truncated bar axes lie visually. Bars → zero baseline; lines → can zoom (but say so).
- **Too many ticks.** Default tick counts overlap on small charts. Set `.ticks(n)` responsively.
- **No accessible alternative.** SVG charts are invisible to screen readers. Add `role="img"` + `aria-label`, plus a data table or textual summary for key insights.
- **Transition pileup.** Rapid data updates queue transitions; use `.interrupt()` or keyed joins to keep them coherent.
- **Importing all of d3.** `import * as d3 from 'dbl'` bloats bundles. Import modules: `import { scaleLinear } from 'd3-scale'`.
- **Force layout without bounds.** Unconstrained simulations fling nodes off-canvas; add centering/collision forces and tick limits.
- **Ignoring update/exit.** Enter-only code works for static charts but breaks the moment data changes. Write the full join from the start.
