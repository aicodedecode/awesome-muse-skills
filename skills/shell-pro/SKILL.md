---
name: shell-pro
description: Professional shell scripting: safe Bash patterns, quoting, error handling, and maintainable CLI tools. Use when writing or reviewing shell scripts.
category: development
---

# Shell Pro

## Overview

Shell scripts are **the glue of operations** — and the source of legendary 3am failures when
written casually. Professional shell scripting means defensive defaults (`set -euo pipefail`),
obsessive quoting, explicit error handling, and knowing when the script has outgrown shell
(rewrite in Python/Go at ~200 lines or when you need real data structures).

The through-line: assume every command can fail, every variable can be empty, and every filename
can contain spaces.

## When to use

- Writing or reviewing Bash/POSIX shell scripts.
- Building CLI wrappers, deploy scripts, or CI helpers.
- Debugging scripts that "work on my machine" but fail in CI.
- Deciding between shell and a "real" language.
- Hardening existing scripts (quoting, error handling, idempotency).

## Core concepts

- **Strict mode first.** `set -euo pipefail` — exit on error, error on undefined variables, and
  fail pipelines when any stage fails. Add `IFS=$'\n\t'` deliberately when word-splitting behavior
  matters. This one line prevents entire bug classes.
- **Quote everything.** `"$var"`, `"$(cmd)"`, `"$@"` — always. Unquoted expansions split on
  whitespace and glob — the source of "works until a filename has a space." The only unquoted
  things should be intentionally-split lists.
- **Errors are explicit.** Check exit codes where they matter; `cmd || die "context"` patterns;
  `trap` for cleanup (temp files, locks) on exit. A script that fails silently is worse than one
  that crashes loudly.
- **Functions for structure.** Small named functions with `local` variables; `main "$@"` at the
  bottom; usage/help text. A 300-line flat script is unmaintainable — structure it like code,
  because it is.
- **Idempotency and safety.** Scripts that run twice shouldn't break things; destructive operations
  get `--dry-run` modes and confirmation prompts; `rm -rf "$dir/"` with an empty `$dir` is how
  legends are born — guard it (`: "${dir:?dir must be set}"`).
- **Know when to stop.** Complex JSON parsing (use `jq`, or switch languages), data structures
  beyond arrays/associative arrays, heavy logic — these are signs to rewrite in Python. Shell is
  for orchestration, not computation.

## Practical workflow

1. **Start every script with the template:**
   ```bash
   #!/usr/bin/env bash
   set -euo pipefail
   die() { echo "ERROR: $*" >&2; exit 1; }
   usage() { echo "Usage: $(basename "$0") [options] <arg>"; }
   ```
2. **Parse arguments properly.** `getopts` for short flags; explicit `--long` handling or a tiny
   parser for long options. Validate required args and fail with usage on misuse.
3. **Write functions, keep main thin.** Each function does one thing; `local` all function
   variables; return codes meaningful (0 = ok).
4. **Handle temp files and cleanup.** `tmpdir=$(mktemp -d)` + `trap 'rm -rf "$tmpdir"' EXIT` —
   always. Lock files for scripts that must not run concurrently (`flock`).
5. **Test the failure modes.** Run with `bash -x` to trace; test with empty vars, missing files,
   spaces in names, and non-zero exits from dependencies. ShellCheck in CI — non-negotiable.
6. **Document the contract.** Header comment: purpose, usage, required tools/env vars, exit codes.
   The next person running this at 3am thanks you.

Robust script skeleton:

```bash
#!/usr/bin/env bash
set -euo pipefail

die() { echo "ERROR: $*" >&2; exit 1; }
log() { echo "[$(date -u +%FT%TZ)] $*"; }

main() {
  local src="${1:?Usage: $0 <src-dir>}"
  [[ -d "$src" ]] || die "not a directory: $src"
  local tmp; tmp=$(mktemp -d)
  trap 'rm -rf "$tmp"' EXIT
  log "processing $src ..."
  # ... work, quoting everything ...
  log "done"
}

main "$@"
```

## Common pitfalls

- **Unquoted variables.** The #1 shell bug. `rm -rf $dir` with empty `$dir` tries to delete
  everything. Quote. Everything.
- **No `set -euo pipefail`.** Scripts that barrel past failures, then report success. Or the
  subtler: pipelines masking failures (`false | true` succeeds without pipefail).
- **`set -e` surprises.** It doesn't trigger in all contexts (conditions, `&&`/`||` chains).
  Know its semantics or check critical commands explicitly.
- **Parsing `ls` output.** Filenames with newlines/spaces break it. Use globs or `find -print0 |
  while IFS= read -r -d ''`.
- **curl/wget without failure flags.** `curl -o file url` succeeding with an error page saved as
  "success." Use `curl -fsSL` (fail, silent, show errors, follow redirects).
- **Assuming GNU tools.** BSD vs GNU `sed`/`date`/`grep` differences break scripts across macOS
  and Linux. Test on both or document the requirement.
- **Scripts that grow forever.** The 800-line Bash deployment script nobody dares touch. Refactor
  into functions early; rewrite in a real language when structure demands it.
