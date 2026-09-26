---
name: resume-parser
description: Extracting structured data from resumes — fields, skills, and normalization — use when building hiring pipelines.
category: document-processing
---

## Overview

Resumes arrive as PDFs and Word docs in infinite layouts; hiring pipelines need
structured data (contact info, experience, education, skills). This skill
covers the extraction pipeline: from document to normalized candidate record,
with the validation and fairness considerations the domain demands.

## When to use

- Building applicant tracking or sourcing pipelines
- Extracting structured fields (work history, education, skills, contact)
- Normalizing job titles, skills, and dates across resumes
- Deduplicating candidates and detecting overlapping applications
- Designing human review steps for automated screening

## Core concepts

**Resumes are semi-structured, not structured.** Section headers vary
("Experience" vs "Work History" vs "Professional Background"), dates come in
dozens of formats, and layouts range from single-column to creative
multi-column designs. The parser must be tolerant: header synonyms, fuzzy
section detection, and graceful degradation when structure is unclear.

**Field extraction hierarchy.** Contact info (email/phone regex — high
precision), then sections (header classification), then within experience:
company, title, dates, bullets. Skills: match against a controlled skill
taxonomy rather than free-text extraction — "React.js", "ReactJS", and "React"
should normalize to one skill.

**Normalization is where value lives.** Raw extraction of "Sr. SWE" vs
"Senior Software Engineer" vs "Software Engineer III" is noise; mapping to a
canonical title taxonomy makes data comparable. Same for dates ("Spring 2020"
→ 2020-03?), locations, and degree names. Decide normalization rules up front
and document the inevitable judgment calls.

**Dates need careful handling.** "2019–Present", "Jan 2020 – Mar 2022",
overlapping roles, gaps — parse to structured ranges, flag ambiguities
("present" as of when?), and compute tenure explicitly rather than trusting
implied durations.

**Bias and fairness are engineering requirements.** Automated screening can
amplify bias (name-based, gap-penalizing, pedigree-preferring). Design
accordingly: strip or down-weight proxies you don't want deciding outcomes,
audit selection rates across groups, keep humans deciding, and comply with
applicable hiring regulations (which increasingly govern automated employment
decision tools specifically).

## Practical workflow

1. **Convert to structured text** preserving reading order and section breaks
   (see pdf-to-markdown, docx-pro); route image-only resumes through OCR.
2. **Segment into sections** via header detection (style + synonym matching);
   assign unclassified content to the nearest section or an "other" bucket
   rather than dropping it.
3. **Extract fields per section:** contact via patterns; experience entries via
   date-anchored blocks (dates are the most reliable entry delimiters);
   education and skills via taxonomy matching.
4. **Normalize:** titles, skills, dates, locations → canonical forms; compute
   derived fields (total tenure, current title, highest degree).
5. **Validate and score confidence:** required fields present? dates
   consistent? overlapping roles flagged? Route low-confidence parses to
   human review with the source resume attached.
6. **Deduplicate** on email/phone + name fuzzy matching before creating new
   candidate records.

## Common pitfalls

- **Creative layouts breaking reading order** — multi-column and graphic
  resumes extract as interleaved gibberish; detect and flag rather than
  silently misparsing.
- **Overconfident skill extraction** — "managed a team using Jira" ≠ Jira
  skill; distinguish mention from proficiency claims, and prefer taxonomy
  matching over keyword soup.
- **Date ambiguity silently resolved** — "05/06/2020" (May 6 vs June 5),
  "present" freezing at parse time; make assumptions explicit and visible.
- **Dropping content that doesn't fit the schema** — unusual sections
  (publications, patents, open source) carry signal; preserve unmapped
  content for human review.
- **No fairness auditing** — deploying screening without measuring disparate
  impact; monitor outcomes by group and keep a human in the decision loop.
- **Storing PII without a retention policy** — resumes contain sensitive
  personal data; define retention, access controls, and deletion up front.
