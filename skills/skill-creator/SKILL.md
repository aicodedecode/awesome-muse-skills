---
name: skill-creator
description: Design and author high-quality agent skills: scoping, frontmatter, structure, safety review, and validation. Use when creating a new reusable skill from scratch or refining a draft into publishable form.
category: development
---

# Skill Creator

## Overview

A good skill is a **reusable playbook**: the distilled judgment of an expert, written so an agent
(or a person) can apply it without reinventing the approach each time. Bad skills are vague advice
("write clean code"); good skills are specific, triggerable, and safe — they say what to do, when
to do it, how to do it, and what to avoid.

This skill is a meta-skill: the discipline of turning expertise into a well-formed, validated,
publishable skill document.

## When to use

- Turning a repeated workflow into a reusable skill.
- Drafting a new skill for a team or community catalog.
- Reviewing someone else's skill draft for quality and safety.
- Splitting an overgrown skill into focused, composable ones.
- Writing the description/frontmatter that makes a skill actually get triggered.

## Core concepts

- **Trigger-first design.** A skill that never fires is dead weight. Start from the trigger: what
  would the user say, or what situation would arise, that should invoke this? Write the description
  as "does X; use when Y" — it is the routing mechanism, not marketing copy.
- **Specificity over generality.** "API design principles" is a book; "designing idempotent webhook
  receivers for payment providers" is a skill. Narrow scope, deep guidance, concrete examples.
- **Structure that survives skimming.** Overview (why this exists), When to use (triggers), Core
  concepts (the mental models), Practical workflow (numbered steps with commands), Common pitfalls
  (what goes wrong). A reader should get value from any single section.
- **Examples are the skill.** Abstract advice without a concrete example is forgettable. Every major
  concept earns at least one: a command, a config snippet, a checklist, a template.
- **Safety by construction.** Skills must not exfiltrate data, harvest credentials, run installers,
  embed prompt-injection, or take destructive actions. Review every example command as if a stranger
  will run it blindly — because they will.
- **Composable, not monolithic.** One skill, one job. If a section keeps growing into its own
  discipline, it's a second skill. Reference related skills by name instead of absorbing them.

## Practical workflow

1. **Name it.** Lowercase, hyphenated, descriptive of the outcome (`postgres-migration-guide`, not
   `db-stuff`). The name is the file path and the frontmatter `name:` — they must match exactly.
2. **Write the description first.** One line: what it does + when to use it. Test it: would this
   description make the skill fire for the right requests and stay quiet for others?
3. **Draft the workflow section next.** The numbered steps are the skill's spine — if you can't
   write 5–8 concrete steps, the scope is wrong (too vague or too trivial for a skill).
4. **Fill concepts and pitfalls from experience.** Concepts = the mental models that prevent
   mistakes; pitfalls = the mistakes themselves, each with the *why* and the fix.
5. **Add examples.** Real commands, real configs, real checklists — tested, not imagined. If an
   example references a tool version, pin it or note it.
6. **Safety-review.** Walk every step asking: does this send data anywhere? read secrets? download
   and execute anything? delete anything? Could an instruction here be abused? Fix or cut.
7. **Validate mechanically.** Frontmatter parses, name matches directory, line count within limits,
   no broken internal references. Then have someone unfamiliar try to *use* it — confusion is a bug.

Skill quality checklist:

```text
[ ] Description states what + when (would route correctly)
[ ] Scope narrow enough to be actionable, broad enough to reuse
[ ] Workflow has concrete steps with examples, not just advice
[ ] Every concept has at least one concrete example
[ ] Pitfalls explain why, not just what
[ ] No exfiltration, credential access, installers, or destructive steps
[ ] A stranger could follow it without asking the author questions
```

## Common pitfalls

- **Advice, not procedure.** "Ensure high quality" is not a step. "Run `pytest -x -q` and fix
  failures before committing" is a step. Convert every platitude into an action.
- **Trigger vagueness.** A description like "helps with development tasks" fires everywhere and
  helps nowhere. Name the situations precisely.
- **Kitchen-sink scope.** A skill covering "everything about testing" will be skimmed and ignored.
  Split by decision point: unit vs e2e vs load are different skills.
- **Untested examples.** Example commands that don't actually run erode trust instantly. Run
  everything you print.
- **Hidden prerequisites.** Assuming tools, access, or knowledge the reader may not have. State
  prerequisites up front ("requires Docker and a Postgres 15+ instance").
- **Copying others' work.** Community catalogs live on original, attributed content. Write from
  your own knowledge; if adapting, credit the source and respect its license.
- **Set-and-forget.** Skills rot as tools change. Note the date or tool versions the skill was
  written against, and revisit when the ecosystem moves.
