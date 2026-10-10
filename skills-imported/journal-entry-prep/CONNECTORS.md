# Connectors

## How tool references work

Plugin files use `~~category` as a placeholder for whatever tool the user connects in that category. For example, `~~data warehouse` might mean Snowflake, BigQuery, or any other warehouse with a connector.

Plugins are **tool-agnostic** — they describe workflows in terms of categories (data warehouse, chat, project tracker, etc.) rather than specific products. The `connector config` pre-configures specific connectors, but any connector in that category works.

## Connectors for this plugin

| Category | Placeholder | Included servers | Other options |
|----------|-------------|-----------------|---------------|
| Data warehouse | `~~data warehouse` | Snowflake\*, Databricks\*, BigQuery | Redshift, PostgreSQL |
| Email | `~~email` | Microsoft 365 | — |
| Office suite | `~~office suite` | Microsoft 365 | — |
| Chat | `~~chat` | Slack | Microsoft Teams |
| ERP / Accounting | `~~erp` | — (no supported connectors yet) | NetSuite, SAP, QuickBooks, Xero |
| Analytics / BI | `~~analytics` | — (no supported connectors yet) | Tableau, Looker, Power BI |

\* Placeholder — connector URL not yet configured
