---
name: clinical-notes-nlp
description: NLP on clinical text — de-identification, concept extraction, phenotyping from notes, and LLM safety guardrails.
category: scientific
---

## Overview

clinical-notes-nlp covers natural language processing of clinical documentation: discharge
summaries, progress notes, radiology reports, nursing notes. It spans de-identification,
medical concept extraction (UMLS/cTAKES/MedCAT), note-based phenotyping, and the special
caution required when applying large language models to clinical text — where hallucinations
can become chart entries.

Clinical notes are the richest and messiest EHR data: telegraphic, abbreviation-dense,
copy-pasted, and full of implicit context. Standard NLP pipelines underperform until adapted.

## When to use

- De-identifying clinical text for research (HIPAA Safe Harbor, surrogate replacement).
- Extracting concepts: diagnoses, medications, procedures, symptoms with negation/temporality.
- Note-based phenotyping: combining notes with structured data for case definitions.
- Information extraction: tumor staging from pathology reports, ejection fraction from echo
  reports, social determinants from notes.
- Evaluating LLMs for summarization or documentation assistance with safety guardrails.
- Measuring documentation quality: copy-paste detection, note bloat.

## Core concepts

- **De-identification.** HIPAA Safe Harbor: remove 18 identifier categories (names, dates
  except year, locations, contact info, MRNs...). Automated tools (Philter, de-identification
  modules) miss edge cases — validate on samples, especially dates in narrative text and
  clinician names in signatures. Surrogate replacement (realistic fake names/dates) preserves
  readability better than redaction tags.
- **Clinical sublanguage.** Notes use heavy abbreviation ("pt c/o SOB, r/o PE"), telegraphic
  syntax, and institution-specific shorthand. Off-the-shelf NLP models trained on news/wikipedia
  fail; use clinical models (ClinicalBERT, GatorTron) or rule-based clinical pipelines, and
  build an abbreviation dictionary per site.
- **Negation and uncertainty.** "No evidence of pneumonia," "possible PE," "family history of
  MI" — concept extraction without negation/temporality/subject detection (NegEx/ConText
  algorithms) produces garbage phenotypes. Every extracted concept needs: negated? historical?
  about the patient or family? uncertain?
- **Concept normalization.** Map mentions to standard vocabularies (UMLS CUIs, SNOMED CT, RxNorm
  for meds). Tools: cTAKES, MetaMap, MedCAT (which learns site-specific embeddings). Ambiguity
  ("cold" = temperature vs viral illness) needs context-aware disambiguation.
- **Copy-paste and note bloat.** Cloned text propagates errors and inflates concept counts.
  Detect duplication (text similarity across notes); for phenotyping, deduplicate or down-weight
  repeated content — otherwise one copied problem list counts ten times.
- **Phenotyping from notes.** Notes capture what codes miss (symptoms, severity, social
  context). Best practice: combine structured + NLP features, validate against chart review,
  report PPV/sensitivity. Note-only phenotypes inherit documentation bias (what clinicians
  bother to write).
- **LLMs on clinical text.** Useful for summarization and first-draft documentation, dangerous
  as autonomous extractors. Guardrails: human-in-the-loop for anything entering the chart,
  grounded extraction (every claim traceable to source text spans), hallucination testing on
  adversarial cases, and no PHI in prompts to external APIs without a BAA. An LLM summarizing a
  chart must never invent allergies, doses, or code statuses.
- **Evaluation.** Intrinsic (precision/recall/F1 on annotated spans — annotate with dual
  reviewers and adjudication, report inter-annotator agreement) and extrinsic (does the
  phenotype predict what it should?). Report both.

## Practical workflow

1. **Governance.** IRB, de-identification plan, BAA for any external compute. Notes are the most
   sensitive EHR data — treat them accordingly.
2. **Corpus.** Define note types and time windows; sample representatively; de-identify with
   validated tooling.
3. **Annotate.** Guidelines, dual annotation, adjudication, IAA reporting (F1 or kappa on spans).
   Budget more time than expected — clinical annotation is slow.
4. **Extract.** Pipeline: section detection → sentence splitting → concept extraction →
   negation/temporality/subject → normalization. Validate each stage.
5. **Phenotype.** Combine with structured data; validate against chart review; report PPV,
   sensitivity, and failure modes.
6. **LLM use (if any).** Grounded prompts, human review of outputs, hallucination audits, PHI
   controls. Document the human-in-the-loop design.
7. **Monitor.** Documentation practices drift (new templates, scribes, ambient AI); revalidate
   periodically.

Example (Python sketch):
```python
from medcat import CAT
cat = CAT.load_model_pack("umls_model_pack.zip")
doc = cat(doc_text)  # entities with CUIs, negation, temporality metadata
```

## Common pitfalls

- Off-the-shelf NLP without clinical adaptation (abbreviation soup defeats it).
- Concept extraction without negation detection ("no MI" counted as MI).
- Copy-pasted text inflating phenotype counts.
- De-identification validated on easy cases, failing on narrative dates/names.
- LLM hallucinations entering clinical documentation or research phenotypes unchecked.
- PHI sent to external LLM APIs without authorization.
- Single-annotator "gold standards" with no agreement reporting.
