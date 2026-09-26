---
name: publication-figures
description: Designing publication-quality scientific figures — layout, typography, data-ink, and journal-ready export.
category: scientific
---

## Overview

A figure is an argument, not decoration: it should make one point
instantly and survive scrutiny. This skill covers figure design for
papers — choosing the right plot type, layout for single/double-column
formats, typography and labeling, honest axis handling, and exporting
vector graphics that meet journal requirements.

## When to use

- Designing figures for a paper, thesis, or report
- Choosing between plot types for a dataset (and knowing when a table wins)
- Fixing common figure flaws: clutter, tiny fonts, misleading axes
- Preparing multi-panel figures with consistent style
- Exporting print-ready vector files (PDF/EPS/SVG) at the right size

## Core concepts

- **Data-ink ratio (Tufte):** maximize ink devoted to data, minimize chartjunk — gridlines, 3D effects, and heavy borders are guilty until proven useful.
- **One figure, one message:** each figure makes a single claim, stated in its caption; if you need two sentences to explain what a panel shows, split it.
- **Preattentive attributes:** position, length, and color pop out instantly; angle, area, and volume don't — encode the important variable in position/length.
- **Honest axes:** truncated y-axes exaggerate differences — sometimes justified (with clear breaks/annotations), usually deceptive; log scales for multiplicative phenomena, labeled as such.
- **Typography:** one sans or serif family, ≥7–8 pt at final print size, consistent across panels; never let matplotlib defaults decide your fonts.
- **Color with purpose:** color encodes a variable or highlights the finding — decorative color is noise; ensure grayscale/print readability.

- **Small multiples:** the same plot type repeated across conditions — the most powerful comparative layout; shared axes make differences pop without any 3D or animation.
- **Aspect ratio and banking:** the perceived slope of a line depends on aspect ratio — bank to ~45° (Cleveland) so rates of change are judged accurately, not exaggerated or flattened.
- **Annotation layering:** direct labels, reference lines (theory predictions, thresholds), and shaded regions (excluded/interesting zones) turn a plot into an argument — annotate the conclusion onto the figure.

## Practical workflow

### 1. Plan before plotting

1. Write the one-sentence message of the figure first; choose the plot type that shows it most directly (comparison → bars/dots; trend → lines; distribution → violins/histograms/ECDFs; relationship → scatter).
2. Sketch the panel layout on paper: reading order left-to-right, top-to-bottom; shared axes where comparable.
3. Decide what's data, what's annotation, what's caption — move explanations to the caption, keep the figure clean.

### 2. Build with a style system

```python
import matplotlib.pyplot as plt
plt.rcParams.update({
    "figure.dpi": 150, "savefig.dpi": 300,
    "font.size": 9, "axes.linewidth": 0.8,
    "xtick.direction": "in", "ytick.direction": "in",
})
# Design at final size: single column ~3.5 in, double ~7 in
fig, axes = plt.subplots(1, 2, figsize=(7, 2.8), sharey=True)
```

1. Set figure size to the journal's column width — design at final size, not scaled down later.
2. Use a consistent style dictionary across all figures in the paper (fonts, line widths, palette, tick direction).
3. Label directly on the plot (legend near the data, annotations with arrows) rather than forcing readers to decode a legend.

### 3. Show uncertainty and data

1. Plot the raw data (or a faithful summary) alongside model fits — never the fit alone.
2. Show uncertainty: error bars, confidence bands, or posterior draws — with the interval type stated in the caption.
3. For small-n data, show every point (strip/swarm plots beat bar charts with error bars — "dynamite plots" hide distributions).

### 4. Export and check

1. Export vector (PDF/SVG) for line art; raster (PNG/TIFF ≥300 dpi) only for images/photos; embed fonts or convert to outlines.
2. Check at 100% print size: are all labels legible? Do colors survive grayscale conversion? Is anything clipped?
3. Verify against journal specs: file format, resolution, color mode (RGB vs CMYK), maximum file size.

### 5. Build a multi-panel figure

1. Lay out panels in reading order with a clear narrative: setup → key result → controls/validation → implication.
2. Share axes where quantities are comparable; label panels (a), (b), (c) and reference them in order in text and caption.
3. Enforce visual consistency: same variable = same color/marker in every panel; same scale where comparison matters — inconsistency forces readers to relearn each panel.

## Common pitfalls

- **Dynamite plots:** bar + error bar hides the distribution — show the data.
- **Dual y-axes:** two scales on one plot invite false comparisons — use two panels or normalize.
- **Truncated axes without warning:** exaggerates effects — if you must truncate, show the break explicitly and justify it.
- **Rainbow/jet colormaps:** perceptually non-uniform — see colormap-theory.
- **Tiny fonts:** 6 pt labels that were legible on a 13-inch screen vanish in a 3.5-inch column — design at final size.
- **Figure–caption divorce:** the figure should be interpretable with its caption alone; undefined abbreviations, missing units, and mystery symbols fail this test.
- **Inconsistent encoding across panels:** the same condition in different colors per panel — readers misattribute; fix with a single style dictionary.
- **Panels that don't earn their space:** supplementary-quality controls promoted to main figures dilute the message — main figures argue; supplements document.
