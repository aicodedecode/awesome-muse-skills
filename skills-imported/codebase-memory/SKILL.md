---
name: codebase-memory
description: Structural code intelligence — query a tree-sitter knowledge graph of a codebase instead of grepping file-by-file. Use for who-calls-what (trace_path), change blast radius (detect_changes), architecture overviews (get_architecture), dead code, and Cypher queries over code structure. Binary at ~/workspace/tools/codebase-memory-mcp/codebase-memory-mcp, CLI mode only.
---

# codebase-memory (DeusData/codebase-memory-mcp)

Code-intelligence engine: indexes a repo into a persistent knowledge graph
(functions, classes, call chains, HTTP routes) via vendored tree-sitter
grammars, queryable with 17 tools. MIT licensed. 100% local — no API key, no
hosted service, no LLM inside.

Installed 2026-09-30 as **v0.11.0** (release SHA-256 verified against the
published checksums.txt). The project's own installer was deliberately NOT
run: it auto-configures 45 agent client surfaces and writes lifecycle hooks
into agent configs — none of which exist in this runtime, and it violates the
no-installers rule. Binary-only install at:

```
~/workspace/tools/codebase-memory-mcp/codebase-memory-mcp
```

Use **CLI mode only** (`cli <tool> --flags`). Do NOT start the coordination
daemon or the graph UI — both assume a persistent machine; this VM gets
replaced. Do NOT run `install` (see above).

## Indexed projects

| Project | Nodes | Edges | Mode | Indexed |
|---|---|---|---|---|
| raahupsc (`~/workspace/raahupsc`) | 79,666 | 88,310 | fast | 2026-09-30 |

Reindex after large refactors: `cli index_repository --repo-path <path>
--name <name> --mode fast`. (`fast` = structural only; `full` adds local
semantic embeddings — slower, use only if semantic search is needed.)

## Recipes

```bash
CBM=~/workspace/tools/codebase-memory-mcp/codebase-memory-mcp

# Who calls a function (and what it calls) — depth 1-5
$CBM cli --quiet trace_path --function-name findDailyCaInWindow \
  --project raahupsc --direction inbound --depth 2

# Blast radius of the working-tree diff
$CBM cli --quiet detect_changes --project raahupsc

# Codebase overview: languages, routes, hotspots, clusters
$CBM cli --quiet get_architecture --project raahupsc

# Structural / text / semantic search
$CBM cli --quiet search_graph --project raahupsc --label Function \
  --query "publish article"

# Read-only Cypher over the graph (get_graph_schema first)
$CBM cli --quiet get_graph_schema --project raahupsc

# Read a function's source by qualified name
$CBM cli --quiet get_code_snippet --project raahupsc \
  --qualified-name "raahupsc.src.lib.content.getDailyByDateKey"

# Is a path/scope actually indexed and fresh?
$CBM cli --quiet check_index_coverage --project raahupsc --paths '["src/lib/content.ts"]'
```

## Standing cautions

- **Verify against source.** The project's own docs say `check_index_coverage`
  is "not proof of completeness" and to fall back to source for flagged gaps.
  Treat graph answers as leads: confirm in the file before editing.
- **Marketing vs observed:** "average repo in milliseconds" — raahupsc took
  ~60s wall (fast mode). Still one cheap indexing run vs many grep cycles.
- **Right tool for the question:** grep/`muse.read` for text search and small
  files; the graph for *structural* questions (call chains, impact analysis,
  "what breaks if I change X", architecture). Don't reach for it otherwise.
- **Verified 2026-09-30:** `trace_path` on `findDailyCaInWindow` (inbound,
  depth 2) correctly returned 7 callers across page components and wrapper
  functions (`getDailiesInRange`, `getDailyByDateKey`) — where a naive
  `grep -l` surfaced only the definition file. Genuinely better than grep
  for call-chain questions.
- Binary is 299MB (tree-sitter grammars vendored in). Keep it under
  `~/workspace/tools/`; do not copy per-project.

---
## Provenance (system note, 2026-09-30)

- Source: https://github.com/DeusData/codebase-memory-mcp, v0.11.0,
  tag 2026-09-15. License: MIT. Author publishes SLSA-3 provenance,
  OpenSSF Scorecard, and per-release VirusTotal scans; this install
  verified the tarball SHA-256 against release checksums.txt only.
- Chosen over MCP-server registration: this runtime has no MCP client
  surface, so CLI mode is the integration.
