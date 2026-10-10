# Connectors

## How tool references work

Plugin files use `~~category` as a placeholder for whatever tool the user connects in that category. For example, `~~HRIS` might mean Workday, BambooHR, or any other HRIS with a connector.

Plugins are **tool-agnostic** — they describe workflows in terms of categories (HRIS, ATS, email, etc.) rather than specific products. The `connector config` pre-configures specific connectors, but any connector in that category works.

## Connectors for this plugin

| Category | Placeholder | Included servers | Other options |
|----------|-------------|-----------------|---------------|
| ATS | `~~ATS` | — | Greenhouse, Lever, Ashby, Workable |
| Calendar | `~~calendar` | Google Calendar | Microsoft 365 |
| Chat | `~~chat` | Slack | Microsoft Teams |
| Email | `~~email` | Gmail, Microsoft 365 | — |
| HRIS | `~~HRIS` | — | Workday, BambooHR, Rippling, Gusto |
| Knowledge base | `~~knowledge base` | Notion, Atlassian (Confluence) | Guru, Coda |
| Compensation data | `~~compensation data` | — | Pave, Radford, Levels.fyi |
