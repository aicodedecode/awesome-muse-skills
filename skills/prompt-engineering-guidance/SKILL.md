---
name: prompt-engineering-guidance
description: Team-level guidance for prompt engineering — standards, review processes, prompt libraries, versioning, and rollout practices. Use when standardizing how an organization writes and maintains prompts.
category: ai-research
---

# Prompt Engineering Guidance (Team Practice)

Individual prompt skill doesn't scale; teams need shared standards. This skill covers the 
organizational side: conventions, review, libraries, versioning, and rollout — so prompts become 
maintained assets instead of tribal knowledge.

## Overview

Treat prompts like code: they live in version control, go through review, have tests, and follow 
style conventions. A prompt library gives teams reusable, vetted components (classifiers, 
extractors, summarizers) instead of everyone reinventing them. Rollout practices — staging, 
canary, rollback — apply because prompt changes are behavior changes. The goal is a team where 
anyone can find, understand, and safely modify any prompt.

## When to use

- Multiple people or teams writing prompts for production systems.
- Prompts scattered across codebases, notebooks, and chat logs with no ownership.
- Inconsistent quality: some prompts tested, others written once and forgotten.
- Preparing to scale LLM features: you need process before volume.

## Core concepts

- **Prompt standards**: conventions for structure (role/task/format sections), naming, and 
documentation headers. Consistency makes prompts reviewable.
- **Review process**: prompt changes reviewed like code — for clarity, test coverage, cost 
impact, and safety. A second pair of eyes catches what the author can't.
- **Prompt library**: versioned, tested, reusable prompts for common jobs. Each entry has a purpose 
statement, test set, and owner.
- **Versioning and changelog**: prompts versioned alongside the code that calls them; changes 
logged with rationale and measured impact.
- **Staged rollout**: new prompts go to shadow/staging first, then a canary slice of traffic, then 
full rollout — with rollback ready.
- **Ownership**: every production prompt has an owner responsible for its tests, performance, and 
periodic re-validation.

## Practical workflow

1. Audit current state: inventory all production prompts, their owners (or lack thereof), and test 
coverage.
2. Establish the standard: structure template, documentation header, and review checklist. Keep it 
to one page.
3. Migrate the highest-traffic prompts first: add tests, assign owners, version them.
4. Build the library incrementally: extract reusable prompts as they're proven, with their test 
sets.
5. Institute staged rollouts for prompt changes: shadow → canary → full, with success metrics 
defined up front.
6. Schedule re-validation: prompts re-tested on model updates and quarterly; owners accountable.

```text
Prompt header template:
# <name> v<version> — owner: <person>
# Purpose: <one line>
# Inputs: <variables>   Outputs: <format/schema>
# Tests: <link to test set>   Last validated: <date> on <model>
# Changelog: <version>: <what changed, why>
```

## Common pitfalls

- **Process without adoption**: a beautiful standard nobody follows. Start with the highest-impact 
prompts and prove value.
- **Over-standardization**: rigid templates that don't fit creative tasks. Standards for structure 
and testing, freedom for content.
- **No ownership**: "everyone owns it" means nobody maintains it. Name an owner per prompt.
- **Skipping staging**: pushing prompt changes straight to production. Prompt changes are behavior 
changes — roll them out like one.
- **Library rot**: a prompt library nobody updates becomes a museum. Tie library entries to 
re-validation schedules.
- **Review theater**: rubber-stamping. Reviewers need the test set and before/after outputs, not 
just the prompt text.
