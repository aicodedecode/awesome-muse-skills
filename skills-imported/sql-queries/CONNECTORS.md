# Connectors

## How tool references work

Plugin files use `~~category` as a placeholder for whatever tool the user connects in that category. For example, `~~data warehouse` might mean Snowflake, BigQuery, or any other warehouse with a connector.

Plugins are **tool-agnostic** — they describe workflows in terms of categories (data warehouse, notebook, product analytics, etc.) rather than specific products. The `connector config` pre-configures specific connectors, but any connector in that category works.

## Connectors for this plugin

| Category | Placeholder | Included servers | Other options |
|----------|-------------|-----------------|---------------|
| Data warehouse | `~~data warehouse` | Snowflake\*, Databricks\*, BigQuery, Definite | Redshift, PostgreSQL, MySQL |
| Notebook | `~~notebook` | Hex | Jupyter, Deepnote, Observable |
| Product analytics | `~~product analytics` | Amplitude | Mixpanel, Heap |
| Project tracker | `~~project tracker` | Atlassian (Jira/Confluence) | Linear, Asana |

\* Placeholder — connector URL not yet configured
