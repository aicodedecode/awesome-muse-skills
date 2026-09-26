---
name: social-scraper
description: Scrape public social content ethically — robots.txt, rate limits, terms of service, and API-first data collection patterns.
category: marketing
---

## Overview

Collecting public social media data for research, monitoring, or analysis requires navigating technical, legal, and ethical constraints. This skill covers the ethical approach: respecting robots.txt, honoring rate limits, reading terms of service, preferring official APIs, handling personal data responsibly, and building scrapers that don't harm platforms or users.

This skill is about lawful, ethical collection of public data. It does not cover bypassing authentication, circumventing access controls, or violating terms of service.


Social listening at scale starts with data collection done right: respecting platform rules, managing rate limits, and building pipelines that survive API changes. This skill covers the legitimate patterns for gathering public social data — through official APIs first, with robust engineering around them — for brand monitoring, trend analysis, and audience research.
## When to use

- Planning social listening or brand monitoring
- Collecting public posts for research or analysis
- Deciding between APIs vs. scraping
- Reviewing the legality of a data collection plan
- Building respectful crawlers
- Handling personal data from social sources

- Building brand-mention monitoring dashboards
- Researching audience language for messaging
- Tracking share of voice vs. competitors
- Academic research on social trends
- Competitive intelligence gathering
- Training data collection for ML models
## Core concepts

**API-first.** Official APIs are the right starting point: they're stable, legal, and designed for the purpose. Only consider scraping when APIs don't provide needed public data — and even then, check the platform's terms first.

**Terms of service.** Most major platforms prohibit automated scraping in their ToS. Violating ToS can mean IP bans, legal action (CFAA in the US is contested territory — case law evolves), and blocked accounts. Read the ToS for every platform you touch; get legal review for commercial projects.

**robots.txt and rate limits.** Respect robots.txt directives. Rate-limit aggressively: delays between requests, exponential backoff on errors, no parallel hammering. Your scraper should be indistinguishable from light human browsing in load terms.

**Public vs. personal data.** "Publicly visible" doesn't mean "free to use however you want." Privacy regulations (GDPR, CCPA) apply to personal data regardless of source. Minimize collection, anonymize where possible, honor deletion requests, and never publish identifiable data without consent.

**Ethical guidelines.** Collect only what you need, don't disrupt the service, don't republish full copyrighted content, attribute sources, and consider the subjects — would they reasonably expect this use of their posts?

**Defensive scraping patterns.** Identify your bot honestly (user agent), cache aggressively to avoid re-fetching, respect Retry-After headers, randomize timing within limits, and monitor for blocks as a signal to stop — not to evade.


**API-first hierarchy.** Official APIs (X API, Meta Graph, YouTube Data, TikTok Research API, Reddit API) → licensed data providers (Brandwatch, Sprinklr, Meltwater) → public datasets → HTML scraping (last resort). Each step down increases legal risk, fragility, and maintenance cost. Budget for API access as a cost of doing serious listening — free scraping is the most expensive option long-term.

**Rate limit engineering.** Design collectors around limits from day one: token buckets, exponential backoff with jitter, request prioritization (high-value accounts first), caching (never re-fetch unchanged data), and graceful degradation (partial data beats crashed collectors). Monitor quota consumption as a first-class metric with alerts at 70% and 90%.

**Legal landscape.** Terms of service (contractual restrictions), CFAA (unauthorized access — evolving interpretation), copyright (scraped content rights), privacy regulations (GDPR, CCPA for personal data), and platform-specific rules.
This is not legal advice — consult counsel for your jurisdiction and use case.
When in doubt, use official APIs.
**Ethical scraping principles.** Respect robots.txt → rate-limit generously → scrape only public data → minimize personal data collection → honor opt-outs → attribute sources.
Ethical scraping is sustainable scraping — aggressive scraping gets blocked and sued.
**Data quality.** Deduplication, bot filtering, language detection, and timestamp normalization.
Raw scraped data is messy — budget 50% of project time for cleaning.
Validate against known sources before drawing conclusions.
## Practical workflow

1. **Define the need.** What data, for what purpose, at what scale? Narrow scope reduces legal and ethical exposure. Document the purpose — it matters for privacy compliance.
2. **Check APIs first.** Official APIs, academic/research access programs, data partnerships, and licensed data providers. Exhaust these before considering scraping.
3. **Review legal constraints.** Platform ToS, applicable privacy laws (GDPR, CCPA, local regulations), copyright considerations for republication. Get legal counsel for anything commercial or at scale.
4. **Design respectfully.** robots.txt compliance, conservative rate limits (start at 1 request per several seconds), honest user agents, caching, backoff on errors, and kill switches on blocks or ToS changes.
5. **Handle data responsibly.** Minimize PII collection, store securely, define retention periods, support deletion requests, anonymize for analysis where possible, and never expose raw personal data in outputs.
6. **Monitor and maintain.** Watch for ToS changes, platform layout/API changes, block signals (treat as stop signs), and periodically re-validate that the collection is still justified and compliant.

**Pre-collection checklist:** purpose documented → API options exhausted → ToS reviewed → legal consulted (commercial/scale) → rate limits designed → PII minimization planned → retention/deletion policy set → monitoring in place.


**Listening pipeline:** define queries (brand terms, competitors, category keywords — include misspellings) → collect via APIs on schedule → normalize (dedupe, language detect, spam filter) → enrich (sentiment, entity extraction, author influence scoring) → store (append-only raw + processed tables) → surface (dashboards, alerts for spikes) → act (response playbooks for crises, insights for strategy). Alert thresholds: 3x baseline mention velocity triggers human review.

**Compliance checklist:** review each platform's ToS for data use restrictions → honor robots.txt where applicable → respect user privacy (aggregate; never expose non-public personal data) → data retention limits (delete per policy) → document legal basis for collection. When in doubt, consult counsel — social data law varies by jurisdiction.

**Responsible collection checklist:** legal review → robots.txt check → rate limits set (conservative) → user-agent identified → only public endpoints → personal data minimized → storage secured → retention policy defined.
Document every step — accountability requires records.
**Pipeline architecture:** scheduler → fetcher (with backoff) → parser → validator → deduplicator → enricher → storage → monitor.
Build idempotent pipelines — re-runs should not duplicate data.
Alert on: rate limit hits, schema changes, volume anomalies.
## Common pitfalls

- **Ignoring ToS.** "Everyone scrapes" isn't a legal defense. Read the terms; respect them.
- **Aggressive crawling.** Hammering servers gets you blocked and harms the service. Be gentle or don't do it.
- **Treating blocks as challenges.** Getting blocked and rotating IPs to evade is circumvention, not persistence. Stop and reassess.
- **Over-collecting PII.** Grabbing everything "just in case" maximizes privacy liability. Collect the minimum.
- **Republishing content.** Scraped posts republished verbatim raise copyright issues. Analyze and summarize; don't redistribute.
- **No retention policy.** Hoarding data indefinitely. Define and enforce deletion timelines.
- **Skipping legal review.** Assuming research or small scale makes it fine. Privacy law applies broadly; get advice.
- **Scraping against ToS.** Building on access methods platforms prohibit. Accounts get banned, IPs blocked, and legal exposure follows. Use official channels.
- **Noisy queries.** Collecting everything mentioning a common word. Precision in query design (exclusions, phrase matching, language filters) determines whether the data is signal or noise.
- **Analysis without action.** Dashboards nobody acts on. Tie every listening stream to a decision owner and a response playbook.
- **Ignoring cease-and-desists.** Continuing after platforms object. Legal escalation follows — respect boundaries early.
- **Storing personal data carelessly.** Scraped PII in unsecured databases. Minimize collection; encrypt what you keep; delete on schedule.
