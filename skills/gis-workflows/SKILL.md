---
name: gis-workflows
description: Geographic information systems in practice — projections, spatial joins, raster analysis, and publication-quality maps.
category: scientific
---

## Overview

GIS turns coordinates into insight: where things are, what overlaps what,
and how patterns change across space. This skill covers the practical
core — coordinate reference systems, vector/raster data models, spatial
joins and overlays, terrain analysis, and producing maps that communicate
honestly — using QGIS and Python (geopandas, rasterio).

## When to use

- Mapping field samples, survey results, or sensor locations
- Overlaying geology, land use, hydrology, or hazard layers for site selection
- Computing areas, distances, densities, and accessibility on real terrain
- Building terrain products: slope, aspect, watersheds from a DEM
- Producing a map figure for a paper, report, or presentation

## Core concepts

- **CRS is everything:** coordinates are meaningless without a coordinate reference system; mixing WGS84 (degrees) with UTM (meters) silently corrupts distances and areas. Project to an appropriate local CRS before measuring.
- **Vector vs raster:** vectors (points/lines/polygons) for discrete features; rasters (grids) for continuous fields (elevation, temperature). Convert thoughtfully — rasterization loses precision, vectorization invents boundaries.
- **Spatial joins and overlays:** point-in-polygon, intersection, buffer, dissolve — the verbs of spatial analysis. Mind predicate choice (intersects vs within vs contains).
- **Topology and validity:** self-intersecting polygons and sliver gaps break overlays; validate and repair geometries before analysis.
- **Scale and MAUP:** results depend on aggregation units (modifiable areal unit problem) — a "hotspot" may be an artifact of the zoning, not the phenomenon.
- **Uncertainty propagates spatially:** GPS error, digitizing error, and raster resolution all blur the final product — report the effective spatial accuracy.

- **Spatial autocorrelation:** nearby things are more similar (Tobler's law) — it violates independence assumptions in statistics; test with Moran's I and use spatial regression or block cross-validation where it matters.
- **Network analysis:** distances along roads/rivers, not Euclidean — service areas, evacuation routes, and pollution transport need network topology, not straight lines.
- **Raster algebra discipline:** map algebra (local, focal, zonal operations) is powerful but silently propagates NoData and resolution mismatches — check cell alignment and mask handling in every operation.

## Practical workflow

### 1. Set up the project correctly

```python
import geopandas as gpd
# Always check CRS first; reproject to a local equal-area/metric CRS for analysis
gdf = gpd.read_file("samples.geojson")
print(gdf.crs)
gdf = gdf.to_crs(epsg=32644)  # UTM zone appropriate to the study area
```

1. Choose one project CRS (metric, suited to the region) and reproject all layers to it.
2. Validate geometries (`is_valid`); fix or drop invalid ones and document the choice.
3. Set the spatial extent and snap rasters to a common grid (same resolution, origin, CRS) before raster math.

### 2. Analyze

1. **Overlay:** intersect/union layers to find co-locations (e.g., wells within flood zones); use spatial indexes for speed on large data.
2. **Proximity:** buffers and distance rasters for setback analysis, accessibility, contamination plumes.
3. **Terrain:** from a DEM derive slope, aspect, curvature, flow accumulation, and watershed delineation (fill sinks first; check against mapped streams).
4. **Density and interpolation:** kernel density for point patterns; kriging/IDW for continuous surfaces — with cross-validation, not defaults.

### 3. Quality-check spatially

1. Plot every intermediate — misprojected layers, flipped lat/lon, and datum shifts are instantly visible on a map and invisible in tables.
2. Ground-truth a sample of derived features against imagery or field checks.
3. Test sensitivity to key parameters (buffer distance, cell size, interpolation method).

### 4. Make the map

1. One map, one message: choose the classification (equal interval, quantile, natural breaks) deliberately — it changes the story.
2. Include scale bar, north arrow, CRS note, data sources, and date — a map without these is a illustration, not evidence.
3. Design for the medium: colorblind-safe palettes, legible at print size, no 3D effects or rainbow gradients.

### 5. Run a site-suitability analysis properly

1. Define criteria from the decision (not from available data): constraints (exclusions: floodplains, protected areas) vs factors (scored: slope, distance to roads).
2. Standardize factors to a common scale transparently; document weighting (AHP, rank-sum) — weights are judgments, so sensitivity-test them.
3. Validate against known good/bad sites and present the sensitivity analysis — a suitability map that flips under reasonable weight changes is not decision-ready.

## Common pitfalls

- **Measuring in degrees:** distances/areas computed on unprojected WGS84 are wrong — project first.
- **Lat/lon flips:** the classic silent error — always plot points on a basemap immediately after import.
- **Overlaying misaligned rasters:** different origins/resolutions shift cells; align grids before math.
- **Choropleth of raw counts:** map rates or densities, not counts, unless the polygons are equal-area — otherwise big polygons dominate visually.
- **Ignoring the MAUP:** conclusions drawn at one aggregation level may reverse at another — test multiple zonings for policy-relevant claims.
- **Pretty but dishonest symbology:** truncated legends, cherry-picked class breaks, and missing "no data" categories mislead as surely as bad statistics.
- **False precision from overlay:** intersecting five ±100 m-accuracy layers yields boundaries precise to the centimeter and accurate to nowhere — propagate the coarsest accuracy.
- **Datum shifts:** NAD27 vs NAD83/WGS84 differ by tens of meters — legacy data on old datums misaligns silently; transform, don't just reproject.
