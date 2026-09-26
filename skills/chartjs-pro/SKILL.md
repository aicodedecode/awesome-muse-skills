---
name: chartjs-pro
description: Build charts with Chart.js: configuration, plugins, custom tooltips, real-time updates, and dashboard patterns. Use for standard charts in web apps.
category: development
---

# Chart.js Pro

A practical guide to Chart.js: the batteries-included charting library — configuration, scales, plugins, custom tooltips, real-time streaming data, and the dashboard patterns that keep charts fast and readable.

## Overview

Chart.js renders common chart types (line, bar, pie/doughnut, radar, scatter, bubble) on canvas with sensible defaults, animations, and interactivity out of the box. It's the right choice when the design is a **standard chart done well** — reach for D3 when the design is custom. v3+ is tree-shakeable (register only what you use) and ESM-friendly.

## When to use

- Dashboards: KPI trends, category breakdowns, distributions.
- Standard charts with good defaults and minimal code.
- Real-time/streaming data displays.
- When bundle size matters (register only needed controllers/scales).

## Core concepts

- **Registration.** `import { Chart, LineController, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend } from 'chart.js'; Chart.register(...)` — tree-shaking requires explicit registration; the `chart.js/auto` bundle registers everything (simpler, bigger).
- **Config shape.** `{ type: 'line', data: { labels, datasets: [{ label, data, borderColor, ... }] }, options: { responsive, plugins, scales } }`.
- **Scales.** `x`/`y`: `linear`, `logarithmic`, `time` (needs date adapter), `category`. `stacked: true` for stacked bars; `beginAtZero` for bars.
- **Plugins.** Built-in: legend, tooltip, title, subtitle. Custom plugins via `{ id, beforeDraw, afterDatasetsDraw, ... }` hooks — for watermarks, annotations, custom overlays.
- **Tooltips.** `options.plugins.tooltip.callbacks` customize label/title/footer; `external` for fully custom HTML tooltips (better styling control).
- **Updates.** `chart.data.datasets[0].data.push(x); chart.update('none')` — mutate + update, don't recreate the chart. `'none'`/`'active'` modes control animation on update.
- **Decimation.** `parsing: false` + decimation plugin for large datasets (10k+ points) — renders a representative subset.

## Practical workflow

**1. Setup (tree-shaken).**
```js
import { Chart, LineController, LineElement, PointElement, LinearScale, TimeScale, Tooltip, Legend, Filler } from 'chart.js';
import 'chartjs-adapter-date-fns';
Chart.register(LineController, LineElement, PointElement, LinearScale, TimeScale, Tooltip, Legend, Filler);
```

**2. Time-series line chart.**
```js
new Chart(ctx, {
  type: 'line',
  data: { datasets: [{ label: 'Signups', data: [{ x: '2026-01-01', y: 42 }, ...],
    borderColor: '#2563eb', backgroundColor: 'rgba(37,99,235,0.1)', fill: true, tension: 0.3, pointRadius: 0 }] },
  options: {
    responsive: true, maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: { legend: { display: false }, tooltip: { callbacks: { label: c => `${c.parsed.y} signups` } } },
    scales: { x: { type: 'time', time: { unit: 'day' } }, y: { beginAtZero: true } },
  },
});
```

**3. Real-time streaming.**
```js
// push new points, shift old ones, update without animation
chart.data.datasets[0].data.push({ x: Date.now(), y: value });
if (chart.data.datasets[0].data.length > 120) chart.data.datasets[0].data.shift();
chart.update('none');
```

**4. Custom HTML tooltip (external).** Render a div positioned from `context.tooltip.caretX/caretY` — full CSS control, accessible markup.

**5. Dashboard discipline.** One chart instance per canvas; `chart.destroy()` on unmount (React `useEffect` cleanup); shared color palette; consistent number formatting.

## Common pitfalls

- **Recreating charts on data change.** `new Chart` per update leaks canvases and restarts animations. Mutate data + `chart.update()`.
- **Missing destroy.** SPA navigation without `chart.destroy()` leaks memory and event listeners. Cleanup in effect returns.
- **Forgetting registration.** "Controller not registered" errors = tree-shaken build missing a `Chart.register`. Register everything you use.
- **Time scale without adapter.** `type: 'time'` needs `chartjs-adapter-date-fns` (or luxon/moment). Without it, cryptic errors.
- **Animation on streaming updates.** Default animations on every pushed point = jank. `update('none')` for real-time.
- **Huge datasets un-decimated.** 50k points without decimation/parsing:false = frozen tab. Decimate or aggregate server-side.
- **Unreadable defaults.** Tiny fonts, colliding labels, rainbow palettes. Set `Chart.defaults.font`, limit ticks (`maxTicksLimit`), use a deliberate palette.
- **Canvas sizing.** Chart.js is responsive via parent container — the canvas needs a sized parent (`position: relative; height: 300px`), not fixed canvas attributes.
- **No empty/error states.** Charts with no data render as blank confusion. Handle loading/empty/error explicitly around the canvas.
