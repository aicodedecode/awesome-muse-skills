# Connectors

## How tool references work

Plugin files use `~~category` as a placeholder for whatever tool the user connects in that category. For example, `~~literature` might mean PubMed, bioRxiv, or any other literature source with a connector.

Plugins are **tool-agnostic** — they describe workflows in terms of categories (literature, clinical trials, chemical database, etc.) rather than specific products. The `connector config` pre-configures specific connectors, but any connector in that category works.

## Connectors for this plugin

| Category | Placeholder | Included servers | Other options |
|----------|-------------|-----------------|---------------|
| Literature | `~~literature` | PubMed, bioRxiv, Consensus | Google Scholar, Semantic Scholar |
| Scientific illustration | `~~scientific illustration` | BioRender | — |
| Clinical trials | `~~clinical trials` | ClinicalTrials.gov | EU Clinical Trials Register |
| Chemical database | `~~chemical database` | ChEMBL | PubChem, DrugBank |
| Drug targets | `~~drug targets` | Open Targets | UniProt, STRING |
| Data repository | `~~data repository` | Synapse | Zenodo, Dryad, Figshare |
| Journal access | `~~journal access` | Wiley Scholar Gateway | Elsevier, Springer Nature |
| AI research | `~~AI research` | Owkin | — |
| Lab platform | `~~lab platform` | Benchling\* | — |

\* Placeholder — connector URL not yet configured
