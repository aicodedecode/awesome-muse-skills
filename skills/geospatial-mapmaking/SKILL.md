---
name: geospatial-mapmaking
description: Making honest, publication-ready maps — projections, symbology, hillshading, and cartographic integrity.
category: scientific
---

## Overview

Maps are the spatial equivalent of figures: they make claims about the
world that readers trust implicitly, which makes dishonest maps
especially dangerous. This skill covers choosing projections,
symbolizing data without distortion, terrain representation
(hillshading, hypsometry), and the cartographic elements (scale, legend,
attribution) that make a map evidence rather than illustration.

## When to use

- Producing a location/study-area map for a paper
- Mapping a spatial variable: concentrations, densities, hazards, model output
- Choosing a projection for analysis vs display
- Building terrain visualizations from DEMs
- Reviewing a map for cartographic honesty before publication

## Core concepts

- **Projection choice:** no flat map preserves everything — equal-area (Mollweide, Albers) for densities and comparisons, conformal (Mercator, UTM) for navigation and local shape, compromise (Robinson, Natural Earth) for general reference. Web Mercator inflates high latitudes grotesquely — never use it for area comparisons.
- **Symbolization:** choropleths (rates/densities per polygon — never raw counts on unequal areas), graduated symbols (magnitudes at points), dot density, isarithmic/contour (continuous fields) — each implies something; mismatching method and data type misleads.
- **Classification:** equal interval, quantile, natural breaks (Jenks), standard deviation — the breaks change the story; choose deliberately and consider showing the histogram of the classification.
- **Terrain:** hillshading (azimuth/altitude choices change perception — NW light is conventional), hypsometric tinting, and vertical exaggeration (state it; exaggeration invents drama) — combine shaded relief with transparent color overlays for data-on-terrain.
- **Generalization:** scale-appropriate detail — coastlines and boundaries simplified to the display scale; showing 1:10k detail at 1:5M creates false precision.
- **Uncertainty on maps:** hatch, transparency, or bivariate legends for uncertain areas — a crisp boundary implies crisp knowledge; most boundaries are fuzzy.

- **Relief representation:** hillshading (with conventional NW illumination), hypsometric tinting, and contour layering each suit different purposes — shaded relief for intuition, contours for measurement; combining all three usually muddies.
- **Label placement:** labels are the most time-consuming cartographic task — prioritize features, use halos/masks over busy backgrounds, and never let labels obscure the data they describe.
- **Inset maps:** locators (where is this study area?), magnifiers (detail of a dense region), and extent indicators — each earns its space by orienting the reader; decorative insets are clutter.

## Practical workflow

### 1. Set up the map

```python
import matplotlib.pyplot as plt
import cartopy.crs as ccrs
# Equal-area for density comparisons; state the projection in the caption
ax = plt.axes(projection=ccrs.Mollweide())
ax.set_global()
ax.coastlines(resolution="110m")  # resolution matched to the map scale
```

1. Choose projection for the message (equal-area for distributions); note it in the caption.
2. Set the extent deliberately — global insets for regional maps orient readers; excessive ocean/empty space dilutes the message.
3. Match data resolution to display scale; resample thoughtfully, not by default.

### 2. Symbolize honestly

1. **Choropleth:** normalize (per capita, per km²), use a sequential or diverging palette (see colormap-theory), and include the class breaks in the legend.
2. **Point data:** scale symbols by value with area (not radius) proportional — and consider whether a heatmap/KDE serves better than overlapping dots.
3. **Continuous fields:** contours with labeled intervals or raster with a proper colormap and colorbar — not both competing.
4. Show "no data" explicitly — blank areas read as zero.

### 3. Terrain and context

1. Hillshade DEMs with conventional NW illumination (315° azimuth, 45° altitude) unless you have a reason; blend with hypsometric tints at low opacity.
2. Add context minimally: coastlines, major rivers/roads, place labels for orientation — every element must earn its ink.
3. For 3D/oblique views: state the vertical exaggeration and viewing angle — they're part of the claim.

### 4. Finish cartographically

1. Required elements: scale bar (not just a ratio — ratios die on resizing), north arrow (unless the projection makes it meaningless, then say so), legend, data sources with dates, projection note.
2. Check at final size: label legibility, color distinguishability, no overlapping text.
3. Accessibility: colorblind-safe palettes, and patterns/labels redundant with color for critical classes.

### 5. Make a study-area map

1. Show the region at a scale where its relationship to known geography is clear — include a locator inset if the audience may not know the area.
2. Plot sample/site locations with legible symbols; label key places; add scale bar, north arrow, and coordinate graticule or ticks.
3. Keep base data minimal (coastlines, borders, major rivers/roads) — the study area and sites are the message; everything else is context at low visual weight.

## Common pitfalls

- **Web Mercator for thematic maps:** area distortion makes Russia look twice Africa's size — use equal-area for any comparison.
- **Raw-count choropleths:** big polygons dominate — normalize.
- **Cherry-picked class breaks:** breaks chosen to make a pattern appear — show the data histogram and justify the scheme.
- **False precision:** high-resolution boundaries on coarse data — generalize to the data's real resolution.
- **Missing scale/projection metadata:** a map without scale, projection, and source is an illustration, not evidence.
- **Label overload:** every town labeled, nothing readable — label for orientation, not completeness.
- **Over-detailed basemaps:** a 1:10k basemap behind 1:1M data implies precision the data doesn't have — generalize base layers to the map's scale.
- **Missing projection metadata:** no projection named, no datum stated — the map can't be reproduced or properly reused; always document both.
