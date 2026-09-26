---
name: aeo-geo
description: Optimize content for AI answer engines (AEO/GEO): citation-friendly structure, factual precision, and measuring AI visibility. Use when AI search drives discovery.
category: web-development
---

# AEO / GEO

A practical guide to Answer Engine Optimization (AEO) and Generative Engine Optimization (GEO): making content the source AI systems cite — structure, factual precision, and measurement — as AI answers become a discovery channel alongside classic search.

## Overview

When users ask AI systems questions, the systems synthesize answers and **cite sources**. AEO/GEO is the practice of becoming a cited source: content structured so machines can extract confident answers, facts precise enough to quote, and authority signals strong enough to trust. It overlaps with SEO (crawlability, speed) but optimizes for a different output: **being quoted in a generated answer**, not ranking ten blue links.

Terminology: AEO (answer engines) and GEO (generative engines) describe the same shift; this skill uses both interchangeably.

## When to use

- Content strategy for the AI-search era (docs, blogs, knowledge bases).
- Making product documentation the cited answer for "how do I..." queries.
- Measuring whether AI systems reference your content.
- Deciding how much to invest vs classic SEO.

## Core concepts

- **Extractive-friendly structure.** Clear H2/H3 questions as headings, direct answers in the first 1–2 sentences under each, then elaboration. Machines (and skimmers) extract the lead.
- **Factual density.** Concrete numbers, dates, definitions, steps — quotable units. Vague marketing copy is never cited.
- **Definition blocks.** "X is..." sentences for key terms. Direct definitions are the most-cited content type.
- **Comparison tables.** Feature/pricing/alternative comparisons in real HTML tables — AI systems love structured comparisons and cite them.
- **Freshness signals.** `datePublished`/`dateModified`, visible "updated" dates, current-version references. AI systems weight recency for time-sensitive topics.
- **Authority signals.** Author bylines with credentials, citations to primary sources, original data/research. E-E-A-T applies doubly when a machine judges trustworthiness.
- **Structured data.** FAQPage, HowTo, Article schema — explicit question/answer/step markup removes extraction guesswork.
- **Brand entity clarity.** Consistent naming, a clear "about" page, Wikidata/knowledge-graph presence — so the system knows *who you are* when citing.

## Practical workflow

**1. Pick target questions.** The actual questions users ask AI about your domain ("how do I reset X", "X vs Y pricing", "is X safe for..."). Support tickets, sales calls, and "people also ask" are goldmines.

**2. Write answer-first pages.**
```html
<h2>How do I reset the widget?</h2>
<p>Press and hold the reset button for 5 seconds until the LED blinks amber. The widget restarts with factory defaults in about 30 seconds.</p>
<!-- then: elaboration, caveats, related steps -->
```
Direct answer first, context after. One question per section.

**3. Add structure.**
- FAQPage JSON-LD for Q&A content; HowTo for procedures (with steps, tools, time).
- Comparison tables for "vs" content.
- TL;DR summary boxes at the top of long guides.

**4. Cite and be citable.** Link claims to primary sources; publish original data (benchmarks, surveys) — original research earns citations disproportionately.

**5. Technical base.** Everything from seo-site-auditor still applies: crawlable, fast, no JS-required content. Add `llms.txt`-style conventions where they emerge (a concise machine-readable site summary), but don't bet the strategy on unstandardized formats.

**6. Measure.** Track: brand mentions in AI answers (manual sampling with fixed prompt sets, weekly), referral traffic from AI sources (analytics referrers), citation in "sources" panels. Build a 20–50 prompt benchmark set and re-run monthly.

## Common pitfalls

- **Abandoning SEO.** AI answers are built substantially from search-indexed content. AEO without crawlability/indexation is a castle on sand.
- **Answering without evidence.** AI systems penalize (by not citing) content that asserts without sources. Every claim earns its citation.
- **Burying the answer.** 2000 words before the direct answer = extraction failure. Lead with the answer.
- **Chasing every new format.** `llms.txt` and similar are nascent. Implement cheaply, but the durable wins are structure + facts + authority.
- **Thin content at scale.** 500 AI-generated FAQ pages with shallow answers = low-quality signal. Fewer, deeper, sourced pages win.
- **Ignoring the human reader.** Optimizing purely for extraction produces robotic content humans bounce from — and engagement signals still matter.
- **No measurement.** "We do GEO" without a prompt benchmark is vibes. Sample fixed prompts, record citations, track over time.
- **Forgetting freshness.** A 2022-dated page answering a 2026 question won't be cited. Review and re-date high-value pages on a schedule.
