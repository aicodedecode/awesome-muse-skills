---
name: enrich-lead
description: "Instant lead enrichment. Drop a name, company, LinkedIn URL, or email and get the full contact card with email, phone, title, company intel, and next actions."
user-invocable: true
argument-hint: "[name, company, LinkedIn URL, or email]"
---

<!-- Provenance: adapted from anthropics/knowledge-work-plugins (Apache-2.0, (c) Anthropic).
Original skill: https://github.com/anthropics/knowledge-work-plugins/tree/main/partner-built/apollo/skills/enrich-lead. Changes for Muse AI: Claude/Cowork product refs -> Muse AI; MCP -> connector; CLAUDE.md -> MUSE.md; ${CLAUDE_PLUGIN_ROOT} -> this skill's directory; /plugin:command refs -> skill refs. -->


# Enrich Lead

Turn any identifier into a full contact dossier. The user provides identifying info via "$ARGUMENTS".

## Examples

- `the "enrich-lead" skill Tim Zheng at Apollo`
- `the "enrich-lead" skill https://www.linkedin.com/in/timzheng`
- `the "enrich-lead" skill sarah@stripe.com`
- `the "enrich-lead" skill Jane Smith, VP Engineering, Notion`
- `the "enrich-lead" skill CEO of Figma`

## Step 1 — Parse Input

From "$ARGUMENTS", extract every identifier available:
- First name, last name
- Company name or domain
- LinkedIn URL
- Email address
- Job title (use as a matching hint)

If the input is ambiguous (e.g. just "CEO of Figma"), first use `mcp__claude_ai_Apollo_MCP__apollo_mixed_people_api_search` with relevant title and domain filters to identify the person, then proceed to enrichment.

## Step 2 — Enrich the Person

> **Credit warning**: Tell the user enrichment consumes 1 Apollo credit before calling.

Use `mcp__claude_ai_Apollo_MCP__apollo_people_match` with all available identifiers:
- `first_name`, `last_name` if name is known
- `domain` or `organization_name` if company is known
- `linkedin_url` if LinkedIn is provided
- `email` if email is provided
- Set `reveal_personal_emails` to `true`

If the match fails, try `mcp__claude_ai_Apollo_MCP__apollo_mixed_people_api_search` with looser filters and present the top 3 candidates. Ask the user to pick one, then re-enrich.

## Step 3 — Enrich Their Company

Use `mcp__claude_ai_Apollo_MCP__apollo_organizations_enrich` with the person's company domain to pull firmographic context.

## Step 4 — Present the Contact Card

Format the output exactly like this:

---

**[Full Name]** | [Title]
[Company Name] · [Industry] · [Employee Count] employees

| Field | Detail |
|---|---|
| Email (work) | ... |
| Email (personal) | ... (if revealed) |
| Phone (direct) | ... |
| Phone (mobile) | ... |
| Phone (corporate) | ... |
| Location | City, State, Country |
| LinkedIn | URL |
| Company Domain | ... |
| Company Revenue | Range |
| Company Funding | Total raised |
| Company HQ | Location |

---

## Step 5 — Offer Next Actions

Ask the user which action to take:

1. **Save to Apollo** — Create this person as a contact via `mcp__claude_ai_Apollo_MCP__apollo_contacts_create` with `run_dedupe: true`
2. **Add to a sequence** — Ask which sequence, then run the sequence-load flow
3. **Find colleagues** — Search for more people at the same company using `mcp__claude_ai_Apollo_MCP__apollo_mixed_people_api_search` with `q_organization_domains_list` set to this company
4. **Find similar people** — Search for people with the same title/seniority at other companies
