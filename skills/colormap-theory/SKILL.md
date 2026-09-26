---
name: colormap-theory
description: Choosing colormaps scientifically — perceptual uniformity, color-vision deficiency, and matching map to data type.
category: scientific
---

## Overview

A colormap is a visual encoding function: data value → color. Bad ones
(rainbow/jet) create false structure and hide real structure; good ones
are perceptually uniform and readable by everyone. This skill covers
matching colormap type to data (sequential, diverging, cyclic,
qualitative), perceptual uniformity, color-vision-deficiency safety, and
practical selection in matplotlib, Plotly, and beyond.

## When to use

- Choosing a colormap for a heatmap, contour plot, or 3D surface
- Fixing a figure that uses rainbow/jet
- Encoding signed data (anomalies, differences) with a diverging map
- Making figures readable for colorblind viewers and in grayscale
- Designing a custom colormap for a specific variable

## Core concepts

- **Perceptual uniformity:** equal data steps should look like equal color steps — measured in CIELAB space; viridis, cividis, batlow, and ColorBrewer maps qualify; jet/rainbow emphatically don't (their sharp yellow/cyan bands invent boundaries).
- **Map types:** sequential (low→high, one hue ramp: viridis, plasma, Blues), diverging (two ramps around a meaningful center: RdBu, Vik, coolwarm — center must be meaningful, e.g., zero anomaly), cyclic (phase/angle: twilight, hsv — ends must match), qualitative/categorical (distinct hues: Tab10, Set2 — never a continuous map for categories).
- **Lightness carries the information:** the human visual system reads data primarily through lightness variation — a good sequential map is monotonic in lightness; test by converting to grayscale.
- **Color-vision deficiency:** ~8% of men have red–green deficiency — avoid red–green encodings for critical distinctions; cividis was designed for maximal CVD safety; simulate with CVD simulators before publishing.
- **Background matters:** dark-background figures need different map tuning than white-background ones; transparency/alpha encodings interact with the background color.
- **The data's dynamic range:** skewed data need nonlinear normalization (log, power-law, asinh) more than they need a fancy map — fix the mapping before blaming the colors.

- **CIELAB and perceptual distance:** professional colormap design happens in perceptually uniform spaces (CIELAB, CIECAM02) — equal steps in data become equal ΔE steps in color; RGB interpolation is not perceptually uniform.
- **The rainbow's specific sins:** non-monotonic lightness (bright yellow/cyan bands), false contours at hue boundaries, and high-frequency name boundaries — each creates structure the data doesn't have.
- **Bivariate colormaps:** encoding two variables in one map (e.g., value + uncertainty) — powerful but hard to read; use only with a clear legend and when the joint distribution is the message.

## Practical workflow

### 1. Classify your data, then choose

| Data | Map type | Examples |
|---|---|---|
| Sequential, zero-based | Sequential | viridis, plasma, batlow, Blues |
| Diverging around meaningful center | Diverging | RdBu_r, Vik, coolwarm |
| Phase / orientation | Cyclic | twilight, phase |
| Categories | Qualitative | Tab10, Set2, Okabe-Ito |

### 2. Apply correctly

```python
import matplotlib.pyplot as plt
from matplotlib.colors import CenteredNorm, LogNorm, PowerNorm
# Diverging data around zero: center the map explicitly
plt.imshow(anomaly, cmap="RdBu_r", norm=CenteredNorm(vcenter=0))
# Skewed positive data: log or power-law normalization
plt.imshow(counts, cmap="viridis", norm=LogNorm())
```

1. Set vmin/vmax (or norm) deliberately — autoscaling to outliers wastes the dynamic range; consider robust limits (percentiles) with out-of-range marking.
2. For diverging maps, center exactly on the meaningful midpoint — an off-center "diverging" map lies.
3. Always include a colorbar with labeled ticks and units — a heatmap without a scale is decoration.

### 3. Test accessibility

1. Convert to grayscale: is the structure still visible? (If not, the map fails its primary job.)
2. Simulate deuteranopia/protanopia/tritanopia — check that critical distinctions survive.
3. Print in black and white if the venue might — many readers still do.

### 4. Go beyond defaults when needed

1. For publication series, define one palette per variable and reuse it — consistency builds reader intuition.
2. Build custom maps with perceptually uniform interpolation (viscm, cmaputil) rather than hand-picking RGB stops.
3. Document the colormap and normalization in the caption or methods — reproducibility includes the visual encoding.

### 5. Design a custom colormap

1. Define the data mapping first (sequential/diverging/cyclic, normalization, center) — the map serves the mapping, not vice versa.
2. Build in a perceptual colorspace: interpolate in CIELAB between chosen control colors, enforcing monotonic lightness for sequential maps.
3. Test with viscm-style diagnostics: perceptual-delta plots should be flat (uniform), and test images (sine waves, wedges) should show no false banding — iterate until clean.

## Common pitfalls

- **Rainbow/jet:** non-uniform, creates false contours, CVD-hostile — the single most common visualization error in science; replace on sight.
- **Diverging map without a meaningful center:** a diverging map centered at an arbitrary value implies structure that isn't there.
- **Continuous map for categories:** implies ordering and interpolation between classes that don't exist.
- **Autoscale to outliers:** one hot pixel flattens everything else — use robust limits.
- **Missing colorbar:** no scale, no units, no interpretation — always label.
- **3D surface + bad map:** perspective distortion plus non-uniform color is double deception — prefer 2D heatmaps with good maps for quantitative reading.
- **Alpha as a second encoding:** transparency interacts with background color unpredictably — overlapping transparent marks create false dark spots read as data.
- **Colormap applied to already-encoded data:** double-encoding (e.g., contour lines + colormap of the same variable) adds ink without information — pick one encoding per variable.
