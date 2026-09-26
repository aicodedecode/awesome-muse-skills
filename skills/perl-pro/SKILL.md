---
name: perl-pro
description: Idiomatic modern Perl: strict/warnings, CPAN, references, regex mastery, and maintainable scripting. Use when writing, reviewing, or maintaining Perl code.
category: development
---

# Perl Pro

## Overview

Perl's reputation for write-only code is earned by *bad* Perl — modern, disciplined Perl
(**`strict`, `warnings`, signatures, CPAN modules, and testing**) is a superb text-processing and
glue language. Professional Perl means using the modern toolchain (perl 5.36+, `use v5.36` enabling
strict/warnings/signatures), writing readable rather than golfed code, and leaning on CPAN instead
of reinventing.

The through-line: Perl rewards the disciplined — strictures on, warnings heeded, golf left on the course.

## When to use

- Writing or reviewing Perl scripts and modules.
- Modernizing legacy Perl (adding strict, tests, structure).
- Text processing, log analysis, and system glue tasks.
- Choosing CPAN modules or structuring distributions.
- Debugging regex, reference, or context issues.

## Core concepts

- **`use v5.36;` (or strict + warnings + signatures).** Modern version bundles enable strict,
  warnings, and subroutine signatures — the three features that prevent most Perl footguns.
  `use warnings FATAL => 'all'` in new code turns warnings into loud failures during development.
- **Context is the language.** Scalar vs list context changes what expressions *mean*
  (`my $n = @arr` gives count; `my @c = @arr` copies). Master `wantarray`, and be deliberate —
  context bugs are Perl's unique sharp edge.
- **References for complex data.** Arrays of hashes via references (`$orders->[0]{total}`);
  dereference deliberately (`@{ $ref }`, `%{ $ref }`); autovivification is convenient until it
  silently creates deep structures from typos — check existence with `exists` before deep access
  in critical code.
- **Regex as a precision tool.** Perl regexes are the best in the business — use `/x` for readable
  multiline patterns with comments, named captures (`(?<year>\d{4})`), and non-greedy quantifiers
  deliberately. Compile once (`qr//`) for repeated use; never build regexes from untrusted input
  without `\Q...\E` quoting.
- **CPAN, not NIH.** `cpanm` for installation; prefer well-maintained modules (Mojolicious for web,
  DBI for databases, Path::Tiny for files, Try::Tiny or builtin `try` for exceptions). Check
  maintenance status — abandoned CPAN modules are a liability.
- **Testing with Test::More/Test2.** `prove` runs the suite; test modules, not just scripts;
  `Test::Exception`/`Test::Warn` for failure modes. Perl's testing culture is one of its best
  features — use it.

## Practical workflow

1. **Start every file:** `use v5.36; use warnings;` — non-negotiable. Add `use utf8;` and
   `use open ':std', ':encoding(UTF-8)';` for text work.
2. **Structure:** scripts for one-offs (`script/`), modules in `lib/` with proper packages
   (`package Orders::Processor;`), distributions via `Dist::Zilla` or `Minilla` for anything shared.
3. **Write readable Perl.** Named variables over `$_` in complex code, signatures over `@_`
   shifting, early returns, small subs. Golf is for fun, not production.
4. **Handle errors explicitly.** `die` with context for programmer errors; `Try::Tiny`/`try`-`catch`
   or eval-blocks for recoverable failures; check system call returns (`open … or die "…: $!"` —
   always include `$!`).
5. **Test as you go.** `t/*.t` with Test2; run with `prove -l`. Mock external systems at the
   boundary; test the parsing/transform logic heavily — that's where Perl earns its keep.
6. **Mind the encoding.** Perl's Unicode handling is powerful but opt-in: decode inputs, encode
   outputs, and test with non-ASCII data early. Mojibake discovered in production is a rite of
   passage nobody needs.

Idiomatic snippets:

```perl
use v5.36;

# Signatures + named captures + /x readability
sub parse_log_line ($line) {
    return unless $line =~ m{
        ^(?<ts>\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}:\d{2})
        \s+ \[(?<level>\w+)\]
        \s+ (?<msg>.*)
    }x;
    return { ts => $+{ts}, level => $+{level}, msg => $+{msg} };
}

# Safe file handling with Path::Tiny
use Path::Tiny;
my $content = path($file)->slurp_utf8;
```

## Common pitfalls

- **No strict/warnings.** The original sin — typos become new variables, and warnings that would
  have caught bugs scroll by unheeded.
- **Golf in production.** `$_`, `$a`, nested map/grep one-liners that take ten minutes to parse.
  Write for the maintainer, not the leaderboard.
- **Context bugs.** A sub returning a list assigned to scalar (or vice versa) — silent wrong
  behavior. Be explicit: document return context, or return references.
- **Autovivification surprises.** `$config->{db}{host}` creating intermediate hashes from a typo'd
  key. Use `exists`/defined checks or `no autovivification` in strict code paths.
- **Bareword and indirect-object pitfalls.** `new Class` vs `Class->new` — indirect object syntax
  has parsing gotchas; always use `->`.
- **Regex injection.** Interpolating user input into regexes without `\Q...\E`. And catastrophic
  backtracking in nested quantifiers — test regexes against adversarial input.
- **Ignoring CPAN maintenance.** Depending on a module untouched since 2009. Check reverse
  dependencies, recent releases, and open issues before committing.
