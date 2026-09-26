---
name: documentation-pro
description: Write documentation developers actually use: READMEs, API docs, ADRs, runbooks, and docs-as-code workflows. Use when writing or improving technical documentation.
category: development
---

# Documentation Pro

## Overview

Good documentation — **accurate, findable, and maintained** — is a force multiplier; bad
documentation (missing, wrong, or rotting) is worse than none because it actively misleads. This
skill covers writing docs developers actually use: READMEs that onboard, API docs that answer
questions, ADRs that preserve decisions, runbooks that work at 3am, and the docs-as-code workflows
that keep everything from rotting.

The through-line: docs are a product with users — write for their tasks, keep them next to the code.

## When to use

- Writing a README for a new project or library.
- Documenting APIs, architectures, or operational procedures.
- Fixing documentation that's outdated, missing, or unused.
- Setting up docs-as-code workflows (linting, testing, publishing).
- Reviewing docs for clarity and accuracy.

## Core concepts

- **Docs for tasks, not topics.** Organize by what users *do*: tutorials (learning), how-to guides
  (doing), reference (looking up), explanation (understanding) — the Diátaxis model. A README that's
  all reference and no quickstart fails new users; all tutorial and no reference fails experienced ones.
- **README anatomy.** What it is (one paragraph) → quickstart (copy-paste working in 5 minutes) →
  installation → basic usage → configuration → contributing → license. The quickstart is the whole
  game — if it doesn't work in 5 minutes, nothing else matters.
- **API docs answer questions.** For every endpoint/function: what it does, parameters (types,
  required, defaults, constraints), return shape, errors, and a *working example*. Generate reference
  from code (OpenAPI, JSDoc/TSDoc, rustdoc) so it can't drift; hand-write the guides and concepts.
- **ADRs preserve decisions.** Architecture Decision Records: context, options, decision,
  consequences, revisit triggers — one page, in the repo, next to the code. Future maintainers need
  the *why*, and "we discussed it in a meeting" is not preserved.
- **Runbooks for 3am.** Symptom → diagnosis steps → fix → verification → escalation. Tested
  (game days), linked from alerts, and written for a stressed, half-awake reader: commands
  copy-pasteable, no assumed context.
- **Docs-as-code.** Docs in version control, reviewed like code, built and published by CI,
  with linters (vale/proselint for prose, link checkers for rot) and *tested* examples (doctests,
  executable snippets). Docs that aren't built and checked rot silently.

## Practical workflow

1. **Identify the user and their task.** New joiner onboarding? API consumer integrating?
   On-call diagnosing? Write *for that task* — one doc per task, not one doc per topic.
2. **Start with the quickstart.** Before comprehensive docs, make the 5-minute path work and
   document it. Test it from a clean environment — actually clean, not "clean except my setup."
3. **Layer the docs.** README (orient + quickstart) → guides (how-tos for common tasks) →
   reference (generated from code) → explanations/ADRs (concepts + decisions). Link between layers.
4. **Write clearly.** Short sentences, active voice, concrete examples over abstract description,
   prerequisites stated up front, and every code sample *tested* (CI runs them or they're lies
   waiting to happen).
5. **Keep docs next to code.** READMEs in the repo, API docs generated from annotations, ADRs in
   `docs/adr/`, runbooks in `docs/runbooks/` linked from dashboards. Distance from code = rate of rot.
6. **Maintain deliberately.** Docs checklist in PR templates ("docs updated?"), link checking in CI,
   periodic audits (quarterly: is the quickstart still quick? are runbooks still accurate?),
   and delete docs that lie — wrong docs are worse than missing docs.

README template:

```markdown
# Project Name
One-paragraph: what it does, who it's for.

## Quickstart
\`\`\`bash
# copy-paste, works in 5 minutes from clean machine
\`\`\`

## Installation
## Usage (common tasks with examples)
## Configuration
## API Reference (link to generated docs)
## Contributing
## License
```

## Common pitfalls

- **README as a novel.** 500 lines before the first runnable command. Quickstart first, always —
  respect the reader's time.
- **Untested examples.** Code samples that don't run (drifted APIs, missing imports). Test every
  sample in CI or delete it — a broken example destroys trust instantly.
- **Missing the why.** Reference docs listing parameters without explaining when/why to use the
  thing. Concepts and guides carry the why; reference alone is a dictionary without definitions.
- **Docs far from code.** Wiki pages describing v2 while the code is on v4. Colocate, generate,
  and review docs with the code changes they describe.
- **No onboarding path.** Docs assume tribal knowledge ("just deploy it like usual"). Write for
  the new joiner — they're the documentation's most important user.
- **Runbooks that don't run.** Prose descriptions without copy-pasteable commands, untested since
  written. Game-day them: follow the runbook literally during a drill.
- **Documenting everything equally.** Exhaustive docs for trivial utils, nothing for the complex
  core. Document where confusion and cost concentrate: onboarding, tricky domains, operations.
