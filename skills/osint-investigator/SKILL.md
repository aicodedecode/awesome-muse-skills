---
name: osint-investigator
description: Conduct ethical open-source intelligence investigations using public data — for due diligence, incident enrichment, and brand protection.
category: security
---

## Overview

OSINT (open-source intelligence) is the collection and analysis of **publicly available** information: DNS and certificate records, public code repos, social media, breach datasets, company filings, and more. Defenders use it for incident enrichment, executive due diligence, brand/typosquat monitoring, and third-party risk — all without touching anyone's private systems.

This skill covers ethical OSINT methodology: passive collection, source verification, and documentation. It explicitly excludes accessing non-public data, pretexting, or any technique that crosses into unauthorized access.

OSINT is a tradecraft of patience: the answer is usually public, but buried under noise, misdirection, and stale data. Professionals distinguish themselves through source criticism — asking of every find who published this, when, why, and what would disprove it — and through disciplined documentation that lets others verify the trail.

## When to use

- Enriching an incident: is this domain/IP known-malicious? Who registered it?
- Executive and vendor due diligence from public records.
- Brand protection: typosquat domains, fake social profiles, leaked credentials.
- Attack-surface discovery on your *own* assets (cert transparency, exposed repos, public buckets).
- Background research for hiring, partnerships, or journalism — within legal bounds.

## Core concepts

- **Passive first:** OSINT should not alert or touch the subject. Use cached/historical sources (certificate transparency logs, DNS history, archives) before any direct interaction.
- **Public means public:** if it requires credentials you do not legitimately hold, bypassing access controls, or deception to obtain — it is not OSINT, it is unauthorized access.
- **Verify across sources:** single-source "facts" are rumors. Corroborate identities, dates, and relationships across independent sources before acting on them.
- **Document everything:** URLs, timestamps, screenshots, and search queries. OSINT findings need provenance to be trustworthy and defensible.
- **Know your jurisdiction:** privacy laws (GDPR and equivalents), terms of service, and sector regulations constrain even public-data collection. When in doubt, legal review.
- **Operational hygiene:** separate research identities and browsers from personal ones; be aware that your queries can be logged by the services you use.

- **Historical sources beat live ones.** Archives, certificate history, and DNS history reveal what the subject tried to erase — always check the past, not just the present.
- **Pivot systematically.** One identifier (domain, email, handle) leads to infrastructure, which leads to related entities. Map the graph; do not just collect points.
- **Research-identity hygiene.** If your work requires viewing restricted-but-public content, use dedicated research accounts separated from personal identity — and never to deceive.

## Practical workflow

1. **Define the question:** "Is domain X malicious?" beats "research X." Scope the questions, the subject, and what is off-limits — in writing.
2. **Start with infrastructure:** for domains/IPs — WHOIS history, passive DNS, certificate transparency, ASN and hosting reputation, threat-intel reputation checks.
3. **Check exposure:** certificate transparency for rogue subdomains; public code search for leaked secrets tied to your org; breach datasets for executive/vendor emails (via legitimate lookup services).
4. **Public profile review:** company registries, press, social profiles *as publicly visible* — no connection-request pretexting, no fake accounts to bypass privacy settings.
5. **Corroborate and assess:** cross-check key claims across sources; grade confidence (confirmed / likely / uncorroborated); note what you could *not* verify.
6. **Report with provenance:** findings, confidence levels, source list with access dates, and recommended defensive actions (takedown requests, monitoring, credential resets).

### Defensive OSINT checklist (your own org, quarterly)

- [ ] Certificate transparency: unknown subdomains or certs
- [ ] Typosquat/lookalike domain registrations near your brands
- [ ] Public code and paste sites for leaked secrets/keys
- [ ] Executive names in breach datasets (credential-reset prompts)
- [ ] Fake social profiles impersonating brand or executives
- [ ] Exposed cloud storage and public repos under org accounts

### Sustaining the practice

- Maintain watchlists for brand, executive, and infrastructure indicators
- Refresh key investigations quarterly — public data changes
- Build a trusted source list per investigation type to speed future work
- Debrief false leads: what misled you, and what check would have caught it?

### Metrics that prove it works

- Turnaround per investigation question
- Source corroboration rate (multi-source confirmed vs single-source)
- False-lead rate (findings later disproven)
- Defensive action rate (takedowns filed, exposures remediated)

## Common pitfalls

- **Crossing into unauthorized access.** "It was on the internet" does not make bypassing logins or exploiting an exposed endpoint acceptable. If it is not public, stop.
- **Pretexting and fake personas.** Creating false identities to extract information is deception, not research — and often illegal.
- **Single-source conclusions.** Acting on one unverified post or record. Corroborate or label confidence honestly.
- **Doxxing-adjacent behavior.** Publishing or circulating personal data about individuals, even if public, can violate policy and law. Keep a strict need-to-know.
- **No documentation.** "I saw it somewhere" is useless in an incident review or legal matter. Capture provenance as you go.
- **Ignoring ToS and local law.** Scraping in violation of terms or collecting personal data unlawfully creates liability for the investigator and the org.
- **Attribution overconfidence.** OSINT suggests; it rarely proves. Grade confidence honestly — "likely" is not "confirmed," especially when actions depend on it.
- **Collecting beyond the question.** Scope creep into personal data creates legal exposure and noise. Answer the defined questions, document, stop.
- **Confusing data volume with insight.** A 200-page dump of unanalyzed records is not intelligence. Analyze, assess confidence, and answer the question asked.
- **Neglecting your own exposure.** Investigators get investigated. Practice good OPSEC on your research infrastructure and identities.
