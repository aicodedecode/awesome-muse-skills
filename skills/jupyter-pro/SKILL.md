---
name: jupyter-pro
description: Jupyter guidance — notebook best practices, kernels, nbconvert, widgets, reproducibility, and JupyterLab workflows.
category: development
---

## Overview

Jupyter notebooks are the interactive medium of data science: code, output, and narrative in one document, perfect for exploration and communication. They're also notorious for hidden-state bugs, unreproducible results, and version-control pain. The difference is discipline — notebooks are great when treated as documents with standards, terrible as unreviewed scratchpads.

This skill covers professional notebook practice: reproducibility, clean structure, kernels and environments, nbconvert for sharing, widgets for interactivity, and JupyterLab workflows.

## When to use

- Writing maintainable notebooks.
- Fixing hidden-state / out-of-order execution bugs.
- Setting up kernels and environments.
- Converting notebooks (HTML, PDF, scripts, slides).
- Building interactive widgets.
- Reviewing notebooks in version control.
- Choosing JupyterLab vs VS Code notebooks.

## Core concepts

- **Hidden state.** Cells executed out of order create state invisible in the document — the #1 notebook bug. Defense: Restart & Run All before sharing; linear execution discipline during development.
- **Kernel.** The separate Python process running code — per-environment kernels (`ipykernel` installed in each venv/conda env, registered with `--name`). The kernel defines the environment; the notebook server is just the UI.
- **Environments.** One kernel per project environment; `pip install ipykernel` + `python -m ipykernel install --user --name myproject`. Never run project notebooks on the base kernel.
- **Cell discipline.** One logical step per cell; imports at top; functions defined before use; no 200-line cells. A notebook should read top-to-bottom like an essay.
- **Markdown narrative.** Headings, explanation, conclusions — a notebook without markdown is a script with extra steps. Write for the reader who opens it in six months.
- **Magic commands.** `%matplotlib inline`, `%load_ext autoreload` (+ `%autoreload 2` — pick up edited modules without kernel restart), `%%time`/`%%timeit`, `%debug` post-mortem. Autoreload is essential when developing imported modules alongside.
- **nbconvert.** Export to HTML (sharing), PDF (reports, via LaTeX), Python scripts (productionizing), slides (RISE). `jupyter nbconvert --to html --execute` for executed reports — CI-generated notebooks as artifacts.
- **Execute parameters (papermill).** Parameterize notebooks and execute programmatically — the bridge from exploration to scheduled reports. Parameters cell tagged, values injected at runtime.
- **Widgets (ipywidgets).** Sliders, dropdowns, interactive plots — turn analysis into tools others can use without reading code. `interact()` for instant interactivity.
- **Version control.** Strip outputs before committing (nbstripout) — diffs become readable, repos stay small. Review the code, not the rendered outputs. Alternatively, pair with `.py` percent-format (jupytext) for real diffs.
- **Reproducibility.** Pinned environments (`requirements.txt`/lockfile recorded in the notebook), seeds set, data versions noted, Restart & Run All verified. A notebook that only runs on your laptop is a liability.
- **JupyterLab.** The full IDE: file browser, terminals, debugger, extensions, multiple views. The debugger (breakpoints in cells!) changes notebook development significantly.
- **Big data awareness.** Notebooks hold data in memory — sample for exploration, scale with chunked/dask/spark for production. Don't `read_csv` a 50GB file into a notebook kernel.
- **Security.** Never commit notebooks with secrets, tokens, or credentials in cells/outputs — they persist in JSON. Use environment variables; scrub before sharing.
- **JupyterHub.** Multi-user servers for teams and classrooms — authentication, per-user servers, shared environments; the deployment story for organizations.
- **Notebook testing.** nbclient/testbook execute notebooks in CI and assert on outputs — notebooks as tested artifacts, not just documents.

## Practical workflow

1. **Set up the kernel.** Dedicated environment per project, registered kernel, verified:
   ```bash
   python -m venv .venv && source .venv/bin/activate
   pip install ipykernel pandas matplotlib
   python -m ipykernel install --user --name shop-analysis
   # in Jupyter: Kernel > Change kernel > shop-analysis
   ```
2. **Structure the notebook.** Title + goal → imports → config/seeds → load data → explore → analyze → conclusions. Markdown between every code section explaining the why.
3. **Develop with autoreload.** `%load_ext autoreload`, `%autoreload 2` — iterate on `.py` modules without restarting; keep reusable logic in modules, narrative in the notebook.
4. **Guard against hidden state.** Develop top-to-bottom; periodically Restart & Run All; before sharing, fresh kernel + Run All + verify outputs.
5. **Strip outputs for git.** nbstripout as a git filter — clean diffs, small repos:
   ```bash
   pip install nbstripout && nbstripout --install  # per-repo git filter
   ```
6. **Parameterize reports.** Papermill for scheduled execution with injected parameters; nbconvert to HTML as the distributed artifact.
   ```bash
   papermill input.ipynb output-2026-09-26.ipynb -p region EU -p date 2026-09-26
   jupyter nbconvert --to html --no-input output-2026-09-26.ipynb
   ```

7. **Add interactivity where it pays.** Widgets for stakeholder-facing notebooks (parameter exploration); static exports for reports nobody will re-run.
8. **Productionize deliberately.** Refactor proven logic into `.py` modules/scripts (nbconvert `--to script` as a starting point, then clean up); notebooks remain the narrative, not the deployment artifact.

## Common pitfalls

- **Hidden state** — out-of-order execution; Restart & Run All before trusting/sharing.
- **Wrong kernel** — base env instead of project env; verify kernel per notebook.
- **Committed outputs** — huge diffs, merge conflicts; nbstripout or jupytext.
- **Secrets in cells** — credentials in committed JSON; env vars + scrubbing.
- **Monster cells** — 200-line cells; one logical step per cell.
- **No narrative** — code-only notebooks; markdown explaining why.
- **Unpinned environments** — "works on my machine"; lockfiles + recorded versions.
- **Notebooks as production** — scheduled `.ipynb` as the pipeline; extract to scripts/modules.
- **Memory blowups** — full datasets in kernel; sample for exploration.
- **No seeds** — unreproducible randomness; seed numpy/random/sklearn.
- **Ignoring the debugger** — print-debugging in cells; JupyterLab breakpoints.
- **Stale autoreload confusion** — edited module not picked up; autoreload config + occasional restart.
- **Over-widgeting** — interactive complexity for a one-off analysis; match effort to audience.
