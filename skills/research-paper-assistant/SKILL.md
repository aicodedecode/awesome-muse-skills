---
name: research-paper-assistant
description: Work with academic papers — find them, read efficiently, extract claims and methods, compare across papers, and track what matters. Use when doing literature-driven research with AI assistance.
category: ai-research
---

# Research Paper Assistant

Papers are dense, numerous, and unevenly important. The assistant's job is triage and extraction: 
find the right papers, read them at the right depth, pull out claims/evidence/methods, and 
synthesize across papers — so you spend time on insight, not on skimming.

## Overview

Work in layers. Survey: map the landscape — what are the key papers, who cites whom, where's the 
frontier. Deep read: for the few papers that matter, extract the claim, method, evidence, and 
limitations precisely. Synthesize: compare claims across papers, note agreements and 
contradictions, identify gaps. Throughout, track provenance — every extracted fact points back to 
its paper and page — because synthesis without sources is fiction.

## When to use

- Starting research in a new area: mapping what exists.
- Deep-diving a specific paper: understanding exactly what it claims and shows.
- Comparing methods or results across multiple papers.
- Preparing a literature review or related-work section.

## Core concepts

- **Three-pass reading**: pass 1 — title, abstract, figures, conclusions (5 min, is it 
relevant?); pass 2 — full read minus proofs/details (understand the contribution); pass 3 — 
deep read of methods and experiments (verify the claims).
- **Claim extraction**: for each paper, the central claims stated precisely, each paired with the 
evidence offered. Claims without evidence get flagged, not trusted.
- **Method cards**: a structured summary per paper — problem, approach, key technique, datasets, 
baselines, results, limitations. Comparable across papers.
- **Citation tracing**: following references backward (what it builds on) and citations forward 
(who built on it, who critiqued it). Forward citations reveal whether claims held up.
- **Contradiction tracking**: when papers disagree, record exactly what differs — setup, data, 
metric, or conclusion. Disagreements are where the interesting questions live.
- **Gap analysis**: after mapping claims, ask what's untested, uncompared, or assumed. Gaps are 
research opportunities.

## Practical workflow

1. Define the question narrowly; broad questions produce unmanageable paper piles.
2. Survey: gather candidate papers via keyword search + citation snowballing (backward and 
forward). Triage with pass-1 reads.
3. For the shortlist, do pass-2 reads and write method cards. File by subtopic.
4. Deep-read (pass 3) only the papers your argument will rest on; verify their key claims against 
their evidence.
5. Synthesize: build a comparison table — claims, methods, results, limitations — and mark 
agreements, contradictions, and gaps.
6. Keep the paper library organized with notes; future you will need to re-find everything.

```text
Method card template:
PAPER:    <title, authors, year, venue>
PROBLEM:  <what question does it answer>
APPROACH: <key technique in 2-3 lines>
EVIDENCE: <datasets, baselines, headline results>
LIMITS:   <what it doesn't show; assumptions>
CITES:    <builds on X; critiqued by Y>
RELEVANCE:<why it matters for your question>
```

## Common pitfalls

- **Reading everything deeply**: pass-3 reading a paper that deserved pass-1. Triage ruthlessly.
- **Trusting abstracts**: abstracts are advertisements. Claims get verified against methods and 
results.
- **No provenance**: "I read somewhere that..." Keep every extracted fact linked to its source.
- **Ignoring limitations sections**: where the authors tell you what they didn't prove. Read them; 
they're the most honest part.
- **Citation bias**: only reading papers that agree with your hypothesis. Actively seek critiques 
and negative results.
- **Synthesis without structure**: a pile of summaries isn't a synthesis. The comparison table 
forces the analysis.
