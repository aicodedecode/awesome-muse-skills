---
name: regex-pro
description: Write, test, and debug regular expressions with pattern recipes, engine quirks, and performance safety.
category: utilities
---

## Overview

Regular expressions are a precision instrument most people wield like a hammer. This skill covers
writing correct, readable, safe regex: the core syntax, pattern recipes for common tasks, testing
methodology, engine differences, and catastrophic backtracking — the performance trap that turns a
bad pattern into a denial of service.

## When to use

- Writing patterns for validation, extraction, or search-and-replace

- Debugging a regex that doesn't match (or matches too much)

- Choosing between regex and simpler string methods

- Reviewing regex for performance and safety

- Learning regex systematically rather than by Stack Overflow

## Core concepts

- - **The essential syntax.** Literals, `.` (any), `\d \w \s` (digit/word/space) and negations `\D
  \W \S`, quantifiers `* + ? {n,m}`, anchors `^ $ \b`, groups `()` with alternation `|`, character
  classes `[]` with ranges and negation `[^]`. This covers 90% of real patterns.
- - **Greedy vs lazy.** `.*` grabs as much as possible (greedy); `.*?` grabs as little as possible
  (lazy). `<.*>` on `<b>hi</b>` matches the whole string; `<.*?>` matches `<b>`. Default greed
  causes most "it matched too much" bugs.
- - **Groups and backreferences.** `(...)` captures; `(?:...)` groups without capturing (prefer for
  performance and clarity); `\1` refers back to group 1. Named groups `(?P<name>...)` (Python) make
  complex patterns readable.
- - **Anchors change everything.** `^\d+$` validates the entire string is digits; `\d+` without
  anchors finds digits anywhere. Validation without anchors isn't validation — it's searching.
- - **Engine differences.** PCRE, JavaScript, Python `re`, Go, Java — lookbehind support, named
  group syntax, and Unicode handling vary. Test in the target engine, not just a generic tester.
- - **Catastrophic backtracking.** Nested quantifiers like `(a+)+$` on non-matching input cause
  exponential blowup — a 30-character string can hang for hours. This is a security issue in
  servers. Recognize the shape: quantified group containing quantifiers, especially with overlapping
  character classes.

## Practical workflow

1. 1. **Define the language precisely.** What exactly should match? Write 5 positive and 5 negative
   examples before writing the pattern. Vague requirements produce vague patterns.
2. 2. **Build incrementally.** Start with the simplest core, test, then add one element at a time.
   `^\d{4}` → `^\d{4}-\d{2}` → `^\d{4}-\d{2}-\d{2}$`. Each step verified before the next.
3. 3. **Test both sides.** Every pattern gets positive tests (must match) and negative tests (must
   not match) — including adversarial inputs: empty strings, unicode, newlines, very long strings.
4. 4. **Prefer clarity.** Named groups, comments (`(?x)` verbose mode in Python), and breaking
   complex patterns into multiple simpler checks. A regex nobody can read is a bug waiting to
   happen.
5. 5. **Consider alternatives.** Email validation via regex is a famous tarpit — use a
   parser/library. HTML parsing with regex is a classic mistake — use a parser. Regex excels at:
   delimited formats, log lines, simple tokens, search/replace.
6. 6. **Performance-check risky patterns.** Test with pathological inputs (long non-matching
   strings). If it hangs, rewrite: possessive quantifiers where supported, atomic groups, or
   restructure to avoid nested quantifiers.

**Common recipes:**
- Email (pragmatic, not RFC-perfect): `^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$`

- URL-ish: `https?://[^\s/$.?#].[^\s]*`

- ISO date: `^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$`

- Whitespace trim: `^\s+|\s+$` (replace with empty)

- Quoted string (simple): `"([^"\\]|\\.)*"` (handles escapes, avoids catastrophic backtracking)

## Common pitfalls

- - **Unanchored validation.** `/\d+/` "validates" `abc123` as numeric. Anchor both ends for
  validation.
- - **Greedy dot.** `".*"` matching across multiple quoted strings. Use lazy `.*?` or negated
  classes `[^"]*`.
- - **Forgetting to escape.** `.` `(` `[` `+` `*` `?` in literals. In most languages, prefer raw
  strings (`r"\d+\.\d+"`) to avoid backslash-escaping hell.
- - **Catastrophic backtracking.** `(x+x+)+y` style patterns on user input. Audit any regex that
  processes untrusted input — it's a ReDoS vector.
- - **Over-engineering.** A 200-character email regex that's still wrong. Match the requirement's
  actual strictness; use libraries for genuinely complex grammars.
- - **Not testing the engine.** A pattern tested on regex101 with PCRE flavor failing in JavaScript
  (no lookbehind in older JS) or Go (no backreferences). Always verify in the deployment engine.
