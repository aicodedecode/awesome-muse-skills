---
name: support-agent-writer
description: Write customer support content — help center articles, macros, chatbot scripts, and troubleshooting guides.
category: business-marketing
---

## Overview

Great support content deflects tickets, resolves issues faster, and turns frustrated customers into loyal ones. This skill covers writing help center articles, support macros (canned responses), chatbot conversation scripts, troubleshooting guides, and status/known-issue communications — all in a clear, empathetic, customer-first voice.

## When to use

- Building or overhauling a help center / knowledge base
- Writing macros for common support scenarios
- Scripting chatbot flows
- Creating troubleshooting guides for technical issues
- Reducing ticket volume on repeat questions
- Improving CSAT scores

- Localizing support content for new markets
- Creating video tutorials to complement written articles
- Writing release-communication templates for support teams
- Creating onboarding documentation for support teams
- Writing API documentation for developers
- Developing troubleshooting decision trees
## Core concepts

**Answer-first structure.** Lead with the solution, then the steps, then the explanation. Customers in trouble don't want background first — they want the fix. Use: "Here's how to fix it" → numbered steps → "why this happens" (optional).

**Task-based titles.** Title articles as the customer's goal: "Reset your password" not "Password functionality overview." Match the words customers actually search for — check support ticket language and search logs.

**Empathy + clarity.** Acknowledge the frustration ("I understand how disruptive this is"), then be direct. No jargon, no blame, no corporate padding. Short sentences. One action per step.

**Macros with personality.** Canned responses should sound human, not robotic. Build macros with placeholders for personalization and leave room for the agent to add a human line. Review macros quarterly — stale macros with wrong links are worse than none.

**Chatbot scripting.** Design for the happy path plus the three most common detours. Always offer a human escape hatch. Confirm understanding before acting ("Just to confirm, you want to..."). Never trap users in loops — two failed attempts → offer an agent.

**Troubleshooting guides.** Symptom → likely causes (ordered by probability) → diagnostic steps → fixes → when to escalate. Include what info to collect before escalating so the next tier doesn't start over.


**Deflection measurement.** True deflection = customers who solved their issue via self-service and did not create a ticket. Measure via: article-to-ticket ratios, search-success rates, and post-article surveys ("did this solve your problem?"). Vanity pageviews without resolution data prove nothing.

**Content layering.** Quick answer (2 sentences) → step-by-step guide → deep-dive explanation → video walkthrough. Different customers need different depths; layering serves all without overwhelming anyone.

**Decision trees.** Branching troubleshooting: symptom → diagnostic questions → solutions by branch.
Trees handle complexity that linear articles cannot.
Keep branches shallow (3–4 levels); deep trees confuse.
Test trees with real agents before publishing.
**API documentation.** Endpoints, authentication, request/response examples, error codes, rate limits, and SDKs.
Developers judge products by docs — great docs are a growth lever.
Interactive examples (try-it-now) dramatically improve adoption.
**Tone and voice.** Empathetic, clear, jargon-free — even for technical topics.
Read every article aloud; awkward phrasing reveals itself.
Match tone to situation: billing issues need warmth, outages need clarity.
## Practical workflow

1. **Mine ticket data.** Pull the top 20 ticket drivers by volume. These are your first articles/macros — highest deflection ROI.
2. **Write answer-first articles.** Template: title (task-based) → 2-sentence answer summary → prerequisites → numbered steps (with screenshots) → troubleshooting ("if this doesn't work") → related articles. Keep each article to one task.
3. **Build the macro library.** One macro per common scenario: greeting, status update, resolution, escalation, follow-up, apology/service recovery. Include personalization tokens and a human-touch line slot.
4. **Script chatbot flows.** Map intents → flows. Write concise bot messages (under 40 words each), quick-reply buttons for common choices, fallback handling, and smooth handoff summaries for agents.
5. **Organize the knowledge base.** Categories matching customer mental models (not org charts). Strong search (synonyms, typo tolerance). Every article: reviewed date, owner, feedback widget.
6. **Measure and maintain.** Track: deflection rate, article helpfulness votes, CSAT, handle time, ticket volume per topic. Update articles when the product changes — assign owners and review dates.

**Article quality checklist:** task-based title, answer in first 2 sentences, steps a beginner can follow, screenshots current, links work, reviewed within 6 months, feedback enabled.


**Macro QA process:** monthly review of top 20 macros — are links current? Is the tone right? Do agents actually use them? Retire unused macros and rewrite the ones agents heavily edit (heavy editing signals the macro misses the mark).

**Documentation sprint:** audit existing content → identify gaps (top ticket themes without articles) → prioritize by volume × deflection potential → write → technical review → user test (5 users) → publish → measure deflection.
Sprints keep docs current; ad-hoc writing lets gaps accumulate.
**Style guide:** terminology (consistent product names), formatting (headers, lists, screenshots), voice examples, and localization notes.
Consistency builds trust; inconsistency signals sloppiness.
## Common pitfalls

- **Feature documentation disguised as help.** Describing what buttons do instead of solving customer problems. Write for tasks, not features.
- **Burying the answer.** Three paragraphs of context before the fix. Lead with the solution.
- **Jargon and internal terms.** Using product-team names customers never see. Mirror customer language.
- **Stale articles.** Screenshots from three versions ago destroy trust. Assign owners and review cycles.
- **Chatbot dead ends.** Bots that can't answer and won't escalate. Always provide a human path.
- **No feedback loop.** Publishing articles without helpfulness voting or ticket-linkage analysis. Measure deflection or you're guessing.
- **Tone-deaf macros.** Overly formal or cheerful responses to angry customers. Match the emotional register, then resolve.
- **Writing for agents, not customers.** Internal shorthand and ticket-speak leaking into customer-facing content. Every article gets a customer-language review.
- **No search optimization.** Articles that do not match customer search terms. Mine ticket subjects and search logs for real language.
- **Screenshots rot.** UI changes make screenshots obsolete. Prefer text descriptions where possible; audit screenshots quarterly.
- **No feedback loop.** Articles without "was this helpful?" ratings. Feedback identifies what to fix — implement everywhere.
