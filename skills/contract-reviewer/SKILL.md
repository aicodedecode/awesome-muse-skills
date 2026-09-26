---
name: contract-reviewer
description: Systematic contract review assistance — clause extraction, risk flagging, and comparison — use when analyzing agreements.
category: document-processing
---

## Overview

Contract review is pattern recognition over dense text: find the clauses that
matter (liability, termination, IP, payment), flag deviations from your
standard positions, and compare versions. This skill covers a systematic review
workflow — what to extract, what to flag, and how to stay in the proper lane
between assistance and legal advice.

## When to use

- Reviewing vendor agreements, MSAs, NDAs, or employment contracts
- Extracting key terms (dates, amounts, obligations) into structured summaries
- Comparing contract versions (redlines) clause by clause
- Building a clause library / standard positions for your organization
- Triaging a stack of contracts by risk level

## Core concepts

**Review against a playbook, not from scratch.** Define your standard positions
once (acceptable liability caps, payment terms, termination rights, governing
law preferences) — then every review is "compare to playbook, flag deviations".
Without a playbook, reviews are inconsistent and slow.

**The high-risk clause checklist.** Liability/limitation of liability,
indemnification, termination (for convenience? notice period?), IP ownership
and licensing, confidentiality scope and duration, payment terms and late
fees, warranties and disclaimers, governing law and dispute resolution,
auto-renewal, assignment/change-of-control, data protection/security
obligations. Every contract gets checked against this list — missing clauses
are as important as bad ones.

**Extract, then analyze.** First pass: pull structured facts (parties,
effective date, term, renewal, key amounts, notice addresses). Second pass:
clause-by-clause risk assessment. Structured extraction makes the analysis
comparable across contracts and auditable later.

**Redlines need three-way awareness.** Comparing v1 → v2 shows what changed;
but you also need v2 → playbook (does the change fix or worsen the deviation?).
Track both deltas, and never review a redline without the clean current draft
for context.

**Assistance, not advice.** Automated review accelerates issue-spotting; it
doesn't replace legal judgment. Flag uncertainty explicitly, route
high-risk deviations to counsel, and never present machine output as a legal
conclusion.

## Practical workflow

1. **Normalize the input:** convert to clean text/Markdown preserving clause
   numbering and structure (see pdf-to-markdown, docx-pro); confirm nothing
   was lost in conversion.
2. **Extract key terms** into a structured summary: parties, dates, term &
   renewal, financials, governing law, notice provisions.
3. **Walk the clause checklist** section by section; for each, record: present/
   absent, matches playbook / deviates (how), risk level.
4. **Flag the critical few:** unlimited liability, one-sided indemnification,
   IP assignment of your work product, auto-renewal without notice,
   termination without cause denied to you — these get escalated, not just
   noted.
5. **For redlines:** produce a clause-level diff summary (what changed, in
   whose favor, playbook impact) — not just a raw diff dump.
6. **Output a review memo:** summary of terms, issues by severity with clause
   references, suggested fallback language from the playbook, and open
   questions for counsel.

## Common pitfalls

- **Reviewing without the playbook** — every review becomes a fresh opinion;
  build the standard positions first.
- **Missing what's absent** — no limitation of liability, no termination
  clause, no data processing terms: absence is a finding, not a neutral.
- **Trusting conversion blindly** — clause numbers shifted by bad PDF
  extraction make references wrong; verify structure before analysis.
- **Over-flagging trivia** — a 40-item "issues" list where 35 are stylistic
  trains people to ignore the review; severity-rank ruthlessly.
- **Presenting analysis as legal advice** — label outputs as review assistance,
  keep counsel in the loop for decisions, know your jurisdiction's rules about
  unauthorized practice of law, and never present machine output as a legal
  conclusion.
- **No version discipline** — reviewing "the contract" without confirming
  which draft/version; always anchor to a specific document version.
