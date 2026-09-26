---
name: open-banking
description: Understand open banking — AIS/PIS flows, consent management, PSD2 concepts, and secure bank-data integration.
category: open-banking-io
---

## Overview

Open banking lets consumers share their financial data with third parties — and initiate payments — through secure, standardized APIs, with explicit consent. This skill is a knowledge guide to the concepts: account information services (AIS), payment initiation services (PIS), consent flows, strong customer authentication (SCA), and the regulatory frameworks (notably PSD2 in Europe, plus equivalents elsewhere) that make it work.

This is conceptual and architectural guidance, not implementation docs for any specific provider.


Open banking lets consumers share their financial data with third parties — and initiate payments — through secure, consent-driven APIs. Built on regulations like PSD2 in Europe and similar frameworks emerging globally, it underpins account aggregation, affordability checks, and pay-by-bank flows. The skill is designing products around consented data access: useful enough to earn trust, careful enough to keep it.
## When to use

- Learning how open banking works
- Designing products that use bank data (budgeting, lending, accounting)
- Understanding AIS vs. PIS use cases
- Planning consent and authentication UX
- Evaluating open banking vs. screen scraping
- Navigating PSD2-style regulatory concepts

- Building account aggregation or personal finance features
- Implementing affordability or income verification
- Offering pay-by-bank as a checkout option
- Building lending or credit products on bank data
- Implementing recurring payments via open banking
- Expanding to new geographic markets
## Core concepts

**The parties.** PSU (payment service user — the consumer), ASPSP (the bank holding the account), TPP (third-party provider — your app), and the roles: AISP (account information — read data), PISP (payment initiation — move money), plus PIISP (card-based payment instruments, in some frameworks).

**AIS (Account Information Services).** Read-only access to account data: balances, transactions, account details. Use cases: personal finance management, affordability/credit checks, accounting reconciliation, subscription detection. Data scope is limited to what's necessary and consented.

**PIS (Payment Initiation Services).** Initiating payments directly from the user's bank account (bank-to-bank transfers), without card networks. Use cases: checkout payments (lower fees than cards), bill pay, account funding, invoicing. The TPP never sees credentials — authentication happens at the bank.

**Consent.** The cornerstone: explicit, informed, specific consent for data access or payments. Consent covers: what data, for what purpose, for how long. Users can revoke anytime; TPPs must re-confirm periodically (e.g., every 90 days for AIS under PSD2). Consent UX must be clear — no dark patterns.

**Strong Customer Authentication (SCA).** Multi-factor authentication (two of: knowledge, possession, inherence) required for payments and sensitive actions. In open banking flows, SCA typically happens via redirect to the bank's own authentication (app or web) — the TPP never handles credentials.

**PSD2 concepts.** The EU's Second Payment Services Directive: mandates banks provide API access to licensed TPPs, bans screen scraping as the primary method (with transition provisions), requires SCA, defines liability allocation, and prohibits surcharging differences. Other regions have equivalents (UK Open Banking Standard, Australia's CDR, Brazil's Open Finance) — principles rhyme, details differ.


**AIS vs. PIS.** Account Information Services (read transaction data with consent) vs. Payment Initiation Services (initiate transfers). Different licenses, different risk profiles, different user expectations. Most products start with AIS (lower friction, clearer value) and add PIS where the payment use case justifies the extra trust burden.

**Consent as UX.** Open banking consent flows redirect to the bank — a jarring handoff that kills conversion if mishandled. Best practice: pre-frame what will happen ("you'll log in to your bank securely — we never see your credentials"), explain exactly what data you access and why, and deep-link back smoothly. Consent renewal (typically every 90 days) needs its own re-engagement design.

**Data quality reality.** Transaction categorization is messy: bank descriptions are cryptic, pending transactions shift, and categorization models err. Build confidence indicators, let users correct categories (and learn from corrections), and never present inferred data as fact in high-stakes contexts like lending decisions.

**Variable recurring payments (VRP).** Next-generation open banking: sweeping (me-to-me transfers) and non-sweeping (payments to third parties) recurring payments without card rails.
VRPs enable subscription and bill-payment use cases that AIS/PIS alone cannot serve well.
Regulatory availability varies by market — design for graceful degradation where VRPs are unavailable.
**Strong customer authentication (SCA).** Regulatory requirement for payment initiation: two-factor authentication via the bank.
SCA adds friction by design — optimize everything around it (clear pre-framing, minimal steps, excellent error handling).
Exemptions exist for low-risk transactions; understand and use them where allowed.
**Ecosystem roles.** ASPSPs (banks exposing APIs) → TPPs (third-party providers: AISPs and PISPs) → open banking entities (standards bodies) → regulators.
Know which role you play and its licensing requirements — operating without proper authorization risks enforcement.
Partnerships with licensed TPPs can shortcut your path to market.
## Practical workflow

1. **Define the use case.** AIS (read data: which accounts, what history depth, refresh frequency) or PIS (which payment types, amounts, destinations). Scope determines licensing and UX requirements.
2. **Understand licensing.** TPPs typically need regulatory authorization (AISP/PISP licenses or exemptions) varying by jurisdiction. Factor licensing timelines (months) into planning. Partnering with a licensed provider is a common shortcut.
3. **Design the consent journey.** Explain in plain language: what data, why, for how long. Show the bank redirect clearly ("you'll authenticate securely with your bank — we never see your login"). Handle consent expiry/renewal gracefully.
4. **Design for the redirect flow.** User selects bank → redirected to bank → authenticates (SCA) → approves consent/payment → returns to your app. Handle: user abandonment, bank downtime, errors at each step, and deep-linking back to mobile apps.
5. **Handle data responsibly.** Store minimal data, encrypt at rest, define retention, honor revocation immediately (stop accessing, delete per policy), and never use data beyond consented purposes.
6. **Plan for variance.** Bank API quality varies wildly: different data formats, downtime, inconsistent transaction categorization. Build normalization layers, monitor per-bank reliability, and degrade gracefully.

**Consent UX checklist:** plain-language purpose, specific data scope, duration stated, easy revocation path, renewal reminders before expiry, no pre-ticked boxes, bank authentication clearly attributed to the bank.


**Pay-by-bank checkout design:** offer alongside cards (not instead of) → pre-frame the bank redirect → show the exact amount and payee before handoff → handle the return states (success, cancelled, failed, expired) with clear messaging → reconcile via webhooks, not polling. Conversion trails cards initially — win on lower fees and instant settlement, and optimize the handoff relentlessly.

**Affordability check flow:** request minimum necessary data (explain why: "we check 3 months of transactions to verify affordability") → run categorization → present the decision with reasons → provide a human review path for edge cases. Transparency in automated financial decisions is both regulatory expectation and trust strategy.

**Integration checklist:** choose aggregation provider(s) (coverage vs. cost trade-off) → implement OAuth consent flows → build transaction categorization → design consent renewal UX → implement webhooks for data updates → test across top 10 banks in your market → monitor per-bank success rates → plan fallback for bank downtime.
Multi-provider strategies hedge coverage gaps but multiply complexity — start with one, add second for critical gaps.
**Go-to-market for pay-by-bank:** target use cases where cards are expensive or fail (high-value transfers, bill pay, top-ups) → price below card processing → emphasize instant settlement to merchants → optimize the bank-selection UX relentlessly.
Adoption follows economics — lead with the cost saving, not the technology.
## Common pitfalls

- **Confusing UX.** Users not understanding they're sharing bank data or why. Clarity builds conversion; confusion builds abandonment.
- **Ignoring consent expiry.** Access silently breaking at 90 days. Proactive renewal flows.
- **Over-requesting data.** Asking for all accounts when one suffices. Minimal scope converts better and complies better.
- **Screen scraping.** Still used where APIs are poor, but fragile, less secure, and increasingly restricted. Prefer official APIs.
- **Underestimating bank variance.** Assuming all bank APIs behave alike. Test per bank; build abstraction layers.
- **Weak error handling.** Bank downtimes and redirect failures are common. Design fallbacks and clear messaging.
- **Scope creep on data use.** Using consented data for unconsented purposes. Legal and trust catastrophe — purpose-bind strictly.
- **Over-requesting data.** Asking for 12 months of transactions when 3 suffice. Data minimization is a regulatory principle and a conversion lever — ask for less, convert more.
- **Ignoring consent expiry.** Data access lapsing silently, then features breaking. Proactive renewal prompts (with value reminders) beat error states.
- **Treating all banks equally.** API quality, uptime, and data richness vary enormously between institutions. Monitor per-bank success rates and design fallbacks.
- **Underestimating bank variability.** Assuming all bank APIs work equally. They do not — test extensively, monitor continuously, design fallbacks.
- **Poor error handling.** Bank downtimes and auth failures are routine. Graceful errors with retry paths retain users; cryptic failures lose them permanently.
