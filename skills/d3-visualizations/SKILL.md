---
name: d3-visualizations
description: Design data visualizations with D3 for the web: dashboards, interactive explorers, maps, and storytelling pieces. Use for data-viz products and features.
category: web-development
---

# D3 Visualizations

A product-focused companion to D3 mechanics: designing visualizations for web products — dashboard charts, interactive explorers, geographic maps, scrollytelling pieces — with the design judgment and engineering patterns that make them effective.

## Overview

Knowing D3's API (see d3-pro) is half the skill; the other half is **visualization design**: choosing the right encoding, handling real-world data messiness, building for interaction, and integrating charts into product UI. This skill covers the product layer: chart selection, dashboard architecture, maps, and narrative visualization.

## When to use

- Choosing chart types for a dashboard or report feature.
- Building interactive data explorers (filter, brush, drill-down).
- Geographic visualizations (choropleths, bubble maps).
- Scrollytelling / narrative data pieces.
- Making visualizations accessible and responsive in products.

## Core concepts

- **Chart selection.** Comparison → bars; trend → line; part-of-whole → stacked bars (pies only for 2–3 parts); distribution → histogram/box; correlation → scatter; geography → map; flow → sankey. Match encoding to question, not to novelty.
- **Dashboard architecture.** One `Visualization` component per chart type wrapping a D3 render function; data via props; interactions via callbacks up to a dashboard state (cross-filtering). Keep D3 inside the render function, React outside it.
- **Scales as design decisions.** Domain choices (zero baseline for bars), tick formatting (human units: $1.2M not 1200000), color scales (sequential/diverging with colorblind-safe palettes like viridis; never rainbow).
- **Interaction vocabulary.** Hover tooltips (details on demand), brush (range select), zoom (inspect), click drill-down, linked highlighting across charts. Pick 1–2 per visualization — more is clutter.
- **Maps.** TopoJSON (small) over GeoJSON; `d3.geoMercator`/`geoAlbersUsa` projections; `topojson-client` to convert. Choropleth = fill by value via threshold/quantize scale; bubble map = circles sized by value.
- **Narrative structure.** Scrollytelling: sticky chart + stepping narrative; annotate directly on the chart (labels beat legends); reveal data progressively to build the argument.

## Practical workflow

**1. Start from the question.** "What decision does this chart support?" Write it down. Every encoding choice serves it.

**2. React + D3 integration pattern.**
```tsx
function BarChart({ data, onSelect }: Props) {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    renderBarChart(d3.select(ref.current), data, { onSelect }); // D3 lives here
    return () => { d3.select(ref.current).selectAll('*').remove(); };
  }, [data]);
  return <svg ref={ref} role="img" aria-label="..." />;
}
```
D3 owns the SVG internals; React owns mounting, data flow, and cleanup.

**3. Dashboard cross-filtering.** Dashboard holds filter state; each chart receives filtered data + emits selections; selections update the shared filter. Debounce rapid brush events.

**4. Maps.**
```js
const projection = d3.geoMercator().fitSize([width, height], topojson.feature(topology, topology.objects.countries));
const path = d3.geoPath(projection);
const color = d3.scaleQuantize().domain(d3.extent(values)).range(d3.schemeBlues[7]);
```

**5. Accessibility.** Every chart: `role="img"` + descriptive `aria-label`; accompanying data table (visually-hidden or toggleable); keyboard-operable controls for filters; don't encode critical info in color alone (add labels/patterns).

**6. Responsive.** `viewBox` scaling; re-render on significant breakpoint changes (rotate axis labels on narrow); hide decorative elements on small screens, keep the data.

## Common pitfalls

- **Chart junk.** 3D effects, heavy gradients, decorative icons — ink that isn't data. Maximize data-ink ratio.
- **Wrong chart for the question.** Pie with 12 slices, line chart for categories, truncated bar axes — the classic lies. Choose by the comparison type.
- **Rainbow color scales.** Perceptually non-uniform and colorblind-hostile. Sequential → single-hue; diverging → two-hue; categorical → distinct hues (≤8 categories, then group "other").
- **Missing data honesty.** Gaps, uncertainty, and sample sizes hidden. Show missing data as gaps (not zero), indicate uncertainty where it matters.
- **Interaction without purpose.** Zoom/brush on a 12-point chart. Add interaction where exploration adds insight, not as decoration.
- **D3 fighting React.** D3 mutating DOM that React manages = reconciliation bugs. Boundary rule: D3 owns inside the SVG; React owns everything else.
- **No numbers on the chart.** Forcing users to estimate from axes. Label key values directly (latest value, max, annotated points).
- **Performance with big data.** Rendering 100k SVG nodes kills the browser. Aggregate, sample, or switch to canvas for large datasets.
- **Inaccessible by default.** A canvas/SVG chart with no text alternative excludes screen-reader users. Budget the accessible version from the start.
