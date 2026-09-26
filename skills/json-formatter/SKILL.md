---
name: json-formatter
description: Format, validate, query, and transform JSON with pretty-printing, schema checks, and jq-style workflows.
category: utilities
---

## Overview

JSON is the lingua franca of APIs, configs, and data exchange — and raw JSON is unreadable. This
skill covers the practical JSON toolkit: pretty-printing, validation, querying nested structures,
transforming shapes, diffing, and handling the format's sharp edges (comments, trailing commas, big
numbers, duplicate keys).

## When to use

- Pretty-printing or minifying JSON

- Validating JSON syntax and structure

- Querying/extracting values from large JSON documents

- Transforming JSON shapes (flattening, restructuring)

- Debugging API responses and config files

## Core concepts

- - **Strict JSON vs the real world.** True JSON: double quotes only, no comments, no trailing
  commas. Many "JSON" configs (JSONC, JSON5) allow comments and trailing commas — know which you're
  dealing with before validating.
- - **Pretty-print options.** Indentation (2 vs 4 spaces), key sorting (alphabetical for diffing,
  insertion order for readability), and ASCII vs unicode output. For version-controlled configs,
  sorted keys + consistent indent = clean diffs.
- - **Validation layers.** Syntax (does it parse?) → schema (does it match the expected shape? JSON
  Schema) → semantics (are the values sensible?). Most "valid JSON" bugs are layer 2 or 3.
- - **Querying nested data.** `jq` (command line) and JSONPath are the SQL of JSON: `.users[] |
  select(.active) | .email`. Learn 10 jq filters and you can dissect any API response.
- - **Numbers and precision.** JSON numbers are double-precision floats — large integers (>2^53)
  lose precision in JavaScript. IDs as numbers in JSON are a latent bug; strings are safer for
  identifiers.
- - **Duplicate keys.** Technically allowed by the grammar, behavior undefined — most parsers take
  the last. If your data has duplicate keys, the producer is broken; fix it there.

## Practical workflow

1. 1. **Validate first.** Parse it: `python3 -m json.tool file.json` pretty-prints and validates in
   one step (errors point at the exact line). For JSONC, strip comments first or use a tolerant
   parser.
2. 2. **Pretty-print for humans.** Consistent indent (2 spaces is the modern default), sorted keys
   when the file is version-controlled. Minify only for wire transfer — never for storage or
   debugging.
3. **Query with jq.** Essential filters:

   - Pretty print: `jq . file.json`

   - Extract: `jq '.data.users[0].email'`

   - Filter arrays: `jq '.items[] | select(.price > 100) | {name, price}'`

   - Transform: `jq '[.items[] | {id, name}]'`

   - Keys: `jq 'keys'`, count: `jq '.items | length'`

4. 4. **Transform shapes.** Flatten nested structures, rename keys, or pivot arrays→objects with jq
   or a short Python script. For one-off reshapes, jq; for complex logic, Python's `json` module.
5. 5. **Diff JSON.** Normalize first (sorted keys, consistent indent), then diff. `diff <(jq -S .
   a.json) <(jq -S . b.json)` — sorted output makes semantic diffs readable.
6. 6. **Handle big files.** For multi-GB JSON: streaming parsers (`jq --stream`, Python `ijson`)
   instead of loading everything. Pretty-printing a 2GB file will OOM — stream it.

**Python quick patterns:**
```python
import json
# Load, transform, save with sorted keys + 2-space indent
data = json.load(open("in.json"))
json.dump(data, open("out.json", "w"), indent=2, sort_keys=True, ensure_ascii=False)
# Safe parse with clear errors
try:
    data = json.loads(raw)
except json.JSONDecodeError as e:
    print(f"Invalid JSON at line {e.lineno}, col {e.colno}: {e.msg}")
```

## Common pitfalls

- - **Trailing commas and comments.** Valid in JavaScript, invalid in JSON. The #1 "but it works in
  my editor" parse failure.
- **Single quotes.** `{'key': 'value'}` is not JSON. Double quotes only — always.

- - **NaN and Infinity.** Python's `json` module emits them by default (invalid JSON). Use
  `allow_nan=False` to catch these at serialization time.
- - **Large integer IDs.** IDs > 2^53 silently corrupt in JavaScript consumers. Serialize IDs as
  strings.
- - **BOM and encoding.** Files saved with UTF-8 BOM or wrong encodings fail strict parsers. Ensure
  UTF-8 without BOM.
- - **Pretty-printing secrets.** Formatting API responses for debugging and pasting tokens into
  chats/tickets. Redact before sharing — formatted JSON is still sensitive JSON.
