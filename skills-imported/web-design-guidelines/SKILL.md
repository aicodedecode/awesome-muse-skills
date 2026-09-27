---
name: web-design-guidelines
description: Review UI code for Web Interface Guidelines compliance. Use when asked to "review my UI", "check accessibility", "audit design", "review UX", or "check my site against best practices".
metadata:
  author: vercel
  version: "1.0.0"
  argument-hint: <file-or-pattern>
---

# Web Interface Guidelines

Review files for compliance with Web Interface Guidelines.

> **Muse adaptation note:** The upstream skill fetches the latest rules live from
> `https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`
> on every run. Muse instead reviews against a vendored snapshot (`guidelines.md`,
> snapshotted 2026-09-26) so reviews run against a known, audited copy. To refresh,
> fetch the URL above and replace `guidelines.md` after a quick scan.

## How It Works

1. Read the vendored guidelines in `guidelines.md` (same directory as this file)
2. Read the specified files (or prompt user for files/pattern)
3. Check against all rules in the vendored guidelines
4. Output findings in the terse `file:line` format

## Guidelines Source

Vendored from:
`https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md`
(snapshot 2026-09-26).

## Usage

When a user provides a file or pattern argument:
1. Read the guidelines from `guidelines.md`
2. Read the specified files
3. Apply all rules from the guidelines
4. Output findings using the format specified in the guidelines

If no files specified, ask the user which files to review.
