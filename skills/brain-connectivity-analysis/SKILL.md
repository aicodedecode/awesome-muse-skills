---
name: brain-connectivity-analysis
description: Structural and functional brain connectivity — tractography, functional networks, and graph-theoretic analysis.
category: scientific
---

## Overview

brain-connectivity-analysis covers how brain regions connect and communicate: structural
connectivity from diffusion MRI tractography, functional connectivity from correlated activity
(fMRI, EEG/MEG), effective connectivity (causal modeling), and the graph-theory toolkit used to
describe networks. The emphasis is on what each method can and cannot claim — connectivity
neuroscience is full of measures that sound causal but aren't.

## When to use

- Diffusion MRI: tensor/fODF modeling, tractography, along-tract statistics.
- Functional connectivity: seed-based correlation, ICA networks, parcellation-based connectomes.
- Graph theory: degree, clustering, efficiency, modularity, hubs, rich clubs.
- Effective connectivity: DCM, Granger causality, transfer entropy — when direction matters.
- Comparing networks across groups or conditions with proper statistics (NBS, permutation).
- Multimodal integration: constraining functional claims with structural connectivity.

## Core concepts

- **Structural connectivity (dMRI).** Diffusion measures water displacement; fiber orientation
  distributions (constrained spherical deconvolution) resolve crossing fibers where the tensor
  model fails. Tractography reconstructs streamlines — probabilistic tracking quantifies
  uncertainty. Streamline count is not fiber count; treat it as a connectivity index, not anatomy.
- **Tractography pitfalls.** False positives are rampant (crossing/kissing fibers, gyral bias).
  Anatomically constrained tractography (ACT) and SIFT/SIFT2 filtering reduce but don't eliminate
  them. Validate major findings against known anatomy.
- **Functional connectivity.** Correlation of time series between regions. It measures statistical
  dependence, not communication — two regions can correlate via a common third input. Always
  state this limitation; never write "region A communicated with region B" from correlation alone.
- **Parcellation choice.** Connectome results depend heavily on the atlas (Schaefer, Glasser,
  AAL). Finer parcellations increase multiple comparisons; coarser ones blur boundaries. Report
  the atlas and test robustness to an alternative.
- **Confounds.** Head motion inflates short-range and attenuates long-range connectivity;
  global signal regression removes widespread noise but introduces negative correlations and can
  distort group differences. There is no neutral choice — report both or justify one.
- **Graph metrics.** Degree/hubs (influential nodes), clustering coefficient (local segregation),
  path length/efficiency (integration), modularity (community structure), rich club (hub
  interconnectivity). Normalize against random null networks — raw values are meaningless without
  comparison.
- **Effective connectivity.** DCM tests specific mechanistic hypotheses about directed influence
  (model comparison, not exploratory search); Granger/transfer entropy give directed functional
  measures but assume stationarity and are confounded by hemodynamic variability in fMRI.
- **Network-based statistics (NBS).** For group comparisons of connectomes: permutation-based,
  controls family-wise error over edges, more powerful than edge-wise FDR for connected effects.

## Practical workflow

1. **Preprocess carefully.** Connectivity amplifies preprocessing choices — motion, GSR, and
   parcellation decisions change results more than in activation studies.
2. **Build connectomes.** Structural: tractography + SIFT2 → streamline-weighted matrices.
   Functional: parcellate → extract time series → correlation (Fisher-z) → threshold or keep
   weighted.
3. **QC.** Check motion-connectivity correlations (QC-FC); verify tractography against anatomy;
   confirm networks replicate across sessions (test-retest reliability is often modest — report it).
4. **Describe.** Graph metrics vs null models; community detection; hub identification.
5. **Compare.** NBS or permutation-based edge/group tests with proper correction. Preregister the
   metric of interest — the graph-metric garden of forking paths is large.
6. **Interpret conservatively.** Correlation ≠ communication; streamline count ≠ axon count;
   group differences in connectivity need motion and demographic matching to be believable.

Example (Python sketch):
```python
from nilearn.connectome import ConnectivityMeasure
corr = ConnectivityMeasure(kind="correlation").fit_transform([time_series])[0]
# graph metrics
import bct
deg = bct.degrees_und((corr > 0.3).astype(int))
```

## Common pitfalls

- Causal language for correlational connectivity.
- Global signal regression applied (or skipped) without acknowledging the trade-off.
- Motion artifacts presented as network differences between groups.
- Uncorrected edge-wise tests across thousands of connections.
- Treating streamline counts as quantitative anatomy.
- Parcellation shopping until the network "looks right."
- Ignoring test-retest reliability — many connectivity metrics are noisy.
