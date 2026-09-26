---
name: python-pro
description: Idiomatic Python: project layout, packaging, type hints, testing, async, and performance. Use when writing, reviewing, or structuring Python projects.
category: development
---

# Python Pro

## Overview

Python rewards **readability and the standard library**: the best Python code looks obvious after
you read it and leans on batteries-included modules before reaching for dependencies. This skill
covers professional Python — project layout that scales, packaging without pain, type hints as
documentation, testing culture, async done right, and performance work that respects how CPython
actually executes.

The through-line: write Python like Python, not like Java or C wearing a Python costume.

## When to use

- Starting or restructuring a Python project (layout, packaging, tooling).
- Writing or reviewing Python for idiom, correctness, or performance.
- Choosing between sync/async, packaging tools, or test frameworks.
- Debugging packaging issues, import problems, or slow code.
- Adding type hints or linting to an existing codebase.

## Core concepts

- **Project layout (src layout).** `src/mypackage/` with `pyproject.toml` at root; tests in
  `tests/` mirroring the package. Src layout prevents the classic bug of tests importing the local
  directory instead of the installed package. One `pyproject.toml` declares metadata, dependencies,
  and tool config — `setup.py` is legacy for most projects.
- **Virtual environments, always.** One venv per project (`python -m venv .venv`), dependencies
  pinned via lock file (`uv.lock`, `poetry.lock`, or `requirements.txt` with hashes for deploys).
  Never `pip install` into the system Python.
- **Type hints as documentation.** Annotate public APIs (`def fetch(url: str) -> Response`); run
  `mypy`/`pyright` in strict-ish mode on new code. Hints catch a class of bugs tests miss and make
  IDE support dramatically better. `dataclasses` (or `attrs`/`pydantic` at boundaries) over dicts
  for structured data.
- **The stdlib is deep.** `pathlib` over `os.path`, `dataclasses`, `functools`, `itertools`,
  `collections`, `datetime` with timezones (`zoneinfo`), `argparse`, `logging`, `sqlite3`,
  `http.server` for quick needs. Reach for PyPI only after checking the stdlib.
- **Async is for I/O concurrency.** `asyncio` shines when awaiting many network/disk operations;
  it doesn't speed up CPU work (GIL). Don't mix sync blocking calls into async code (use
  `run_in_executor` for blocking libs); don't make everything async "just in case" — async is
  viral and must be justified by actual concurrency needs.
- **Testing culture.** `pytest` with fixtures and `parametrize`; test behavior, not internals;
  `coverage` to find untested *areas*, not to chase a number. Doctests for documentation examples.

## Practical workflow

1. **Scaffold:** `src/` layout, `pyproject.toml` (build-system, project metadata, tool configs),
   `.venv`, lock file, `ruff` (lint+format — fast, one tool), `mypy` or `pyright`.
2. **Write code Pythonically:** context managers for resources, comprehensions where readable,
   generators for large/streaming data, `pathlib.Path` for paths, f-strings for formatting,
   exceptions for exceptional cases (EAFP) with specific except clauses.
3. **Type the boundaries.** Public functions fully annotated; internal code annotated where it
   clarifies. Run the type checker in CI — gradually, ratcheting strictness.
4. **Test in layers:** fast unit tests (pure functions), integration tests with real local
   services where feasible (testcontainers for Postgres/Redis), and a few end-to-end tests.
   `pytest -x -q` locally; full suite in CI.
5. **Profile before optimizing.** `cProfile`/`py-spy` to find hotspots; common wins: algorithmic
   fixes first, then reduce per-item overhead (avoid repeated attribute lookups in loops), use
   `__slots__` for millions of small objects, push inner loops to numpy/C extensions, or parallelize
   CPU work with multiprocessing.
6. **Package for distribution:** version in one place, build with `python -m build`, publish to an
   internal index or PyPI; CLIs via entry points (`[project.scripts]`).

Standard layout:

```text
mypackage/
├── pyproject.toml          # metadata, deps, tool config
├── src/mypackage/
│   ├── __init__.py         # minimal; don't import heavy deps here
│   ├── core.py
│   └── cli.py
├── tests/
│   ├── test_core.py
│   └── conftest.py         # shared fixtures
└── README.md
```

## Common pitfalls

- **Mutable default arguments.** `def f(items=[])` shares one list across calls — the classic
  Python gotcha. Use `None` + initialize inside.
- **Bare `except:` / swallowing exceptions.** Hides bugs and `KeyboardInterrupt`. Catch specific
  exceptions; log with context; let unexpected ones propagate.
- **Importing the wrong package.** Running tests/scripts from the repo root importing local code
  instead of the installed package — src layout + installed venv fixes this whole class of bug.
- **Timezone-naive datetimes.** `datetime.now()` without tz bites in serialization, scheduling,
  and DST. Use timezone-aware datetimes everywhere (`datetime.now(timezone.utc)`).
- **String concatenation in loops / quadratic joins.** Build lists and `''.join()`; use
  generators for streaming; don't load a 2GB file into memory to process it line by line —
  iterate the file object.
- **`pip freeze` chaos.** Unpinned or transitively-bloated requirements cause "works on my machine."
  Lock files, regenerated deliberately, committed to the repo.
- **Over-engineering with classes.** A module of functions beats a class with one method and no
  state. Python is multi-paradigm — reach for classes when there's genuine state + behavior.
