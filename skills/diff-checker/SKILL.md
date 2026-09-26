---
name: diff-checker
description: Compare files, text, and data effectively with diff strategies, semantic comparison, and review workflows.
category: utilities
---

## Overview

Diffing is how we understand change: code reviews, config audits, data validation, plagiarism
checks. But raw diffs lie by omission — whitespace noise, reordered keys, semantically identical
reformatting. This skill covers choosing the right diff strategy: textual, semantic, and structural
comparison, plus review workflows that surface real changes.

## When to use

- Reviewing code or config changes

- Comparing document versions

- Validating data migrations or transformations

- Finding differences between environments

- Choosing diff tools and strategies

## Core concepts

- - **Textual vs semantic diff.** Textual diff (line-based: `diff`, git diff) shows character
  changes. Semantic diff understands structure: JSON key reordering isn't a change, reformatted code
  with identical AST isn't a change. Use semantic diff when formatting noise drowns signal.
- - **Normalize before comparing.** Sort JSON keys, standardize line endings (CRLF vs LF), strip
  trailing whitespace, normalize timestamps. Most "everything changed" diffs are normalization
  failures, not real changes.
- - **Word diff for prose.** Line-based diff is terrible for paragraphs — one changed word repaints
  the whole paragraph. Use word-level diff (`git diff --word-diff`, or `--color-words`) for docs,
  copy, and articles.
- - **The three-way view.** Comparing A and B is often insufficient — you need the base (what both
  changed from). Three-way diff/merge shows: base → A, base → B, revealing whether changes conflict
  or compose.
- - **Ignore patterns.** Whitespace (`-w`, `-b`), case (`-i`), blank lines (`-B`). Know what you're
  ignoring and why — ignoring whitespace hides nothing important; ignoring case in passwords would
  be catastrophic.
- - **Diff as review workflow.** The goal isn't spotting every changed character — it's
  understanding intent. Good reviews: read the diff, reconstruct what changed and why, then verify
  against tests and requirements.

## Practical workflow

1. 1. **Choose the tool.** Text files → `diff -u` / `git diff`. Word-level for prose → `git diff
   --word-diff`. Directories → `diff -r` / `git diff --no-index`. JSON → normalize with `jq -S`
   first. Binary → `cmp` (byte-identical?) then format-aware tools.
2. 2. **Normalize first.** Line endings (`dos2unix` or `sed`), trailing whitespace, sorted keys for
   JSON/YAML. Re-run the diff — if 90% of noise vanishes, it was normalization.
3. 3. **Read structurally.** Start with the stat summary (`git diff --stat`): which files, how much
   churn. Then read file by file. For large diffs, review by logical change (feature commits help
   enormously — atomic commits are a diffing strategy).
4. 4. **Verify semantics.** For refactors: does the behavior actually match? Run tests. For data:
   compare row counts, checksums, and sample records — not just "the diff looks small."
5. 5. **Use the right granularity.** Config change → exact diff matters (one character can break
   everything). Prose edit → word diff. Generated files → don't diff the artifact, diff the source.
6. 6. **Document the comparison.** For audits and migrations: what was compared, normalization
   applied, what differed, and the verdict. "Diffed prod vs staging configs after normalization;
   only expected differences in hostnames" — that's a reviewable artifact.

**Handy commands:**
```bash
diff -u old.txt new.txt              # unified text diff
diff -u -w old.txt new.txt           # ignore whitespace
git diff --word-diff doc.md          # word-level for prose
git diff --stat                      # change summary
diff <(jq -S . a.json) <(jq -S . b.json)   # semantic JSON diff
diff -r dir1 dir2 --brief            # which files differ
cmp -l a.bin b.bin | head            # byte-level binary diff
```

## Common pitfalls

- - **Unnormalized comparison.** Diffing JSON with different key orders or files with mixed line
  endings produces noise mistaken for signal. Normalize first, always.
- - **Diffing generated artifacts.** Reviewing compiled output, lockfile churn, or built assets
  instead of the source change. Diff the source; spot-check the artifact.
- - **Whitespace-only commits.** Reformatting mixed with logic changes makes review impossible.
  Separate formatting commits from functional ones — enforce via tooling.
- - **Huge diffs.** 5,000-line diffs don't get reviewed; they get rubber-stamped. Break changes into
  reviewable chunks (<400 lines is the research-backed sweet spot).
- - **Ignoring binary diffs.** "Binary files differ" with no further investigation. Use format-aware
  tools (or at least `cmp` + context) — a changed binary in a PR deserves scrutiny.
- - **Trusting the diff alone.** A clean-looking diff with no test run is hope, not verification.
  Diff shows what changed; tests show what broke.
