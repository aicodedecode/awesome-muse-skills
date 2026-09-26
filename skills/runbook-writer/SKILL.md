---
name: runbook-writer
description: Writing runbooks that work at 3am — structure, diagnostics, and safe procedures — use when documenting operational response.
category: operations
---

## Overview

A runbook is the difference between a 10-minute mitigation and a 2-hour
adventure: the exact steps to diagnose and fix a known failure mode, written
for a tired human under pressure. This skill covers structuring runbooks,
writing procedures that are safe to follow half-asleep, and keeping them
alive as systems change.

## When to use

- Writing a runbook for a new alert or known failure mode
- Turning tribal knowledge into documented procedures
- Reviewing runbooks for clarity, safety, and freshness
- Linking runbooks to alerts so on-call can act immediately
- Auditing runbook coverage across services

## Core concepts

**Write for the 3am reader.** Short sentences, numbered steps, no assumed
context, exact commands to copy-paste (with placeholders clearly marked like
`<POD_NAME>`). The reader is tired, stressed, and possibly unfamiliar with
this service — clarity beats elegance.

**Structure: symptom → diagnose → mitigate → verify → escalate.** Every
runbook opens with how to recognize the problem (alert name, dashboard link,
symptoms), then diagnostic steps to confirm, then the fix, then how to verify
it's fixed, then when to give up and escalate. This shape is scannable under
pressure.

**Commands must be copy-paste safe.** Provide full commands, not fragments;
mark destructive commands explicitly (`⚠️ destructive: deletes data`);
prefer reversible actions first. Include expected output so the reader can
confirm each step worked — "you should see X" prevents blind continuation
past a failed step.

**One runbook per alert.** The alert fires → the runbook link is right there
→ the responder follows it. Orphan alerts with no runbook, and runbooks with
no alert, both rot. Maintain the 1:1 mapping as alerts change.

**Runbooks are code-adjacent: version and test them.** Keep runbooks in
version control next to the service; review them in PRs that change the
system; and test them — game days and incident simulations are runbook tests.
An untested runbook is a hypothesis.

## Practical workflow

1. **Template every runbook:** title, owner, last-verified date, alert link,
   severity, symptoms, diagnosis steps, mitigation steps, verification,
   escalation contacts, related links.
2. **Write the diagnosis section** as a decision tree: check A → if X do
   step 3, if Y jump to step 5. Branching beats linear guessing.
3. **Write mitigation as numbered copy-paste commands** with expected outputs
   and rollback steps for each destructive action.
4. **Define "done":** exact verification (metric back under threshold for
   10 min, error rate < 0.1%, synthetic check green) — not "looks okay".
5. **Define "escalate":** conditions for stopping (step failed twice,
   symptoms don't match, 30 minutes without progress) and who to call —
   escalation is a procedure, not a failure.
6. **Maintain:** every incident that used (or should have used) a runbook
   updates it; quarterly review of stale ones; delete runbooks for
   decommissioned alerts.

## Common pitfalls

- **Wall-of-text runbooks** — paragraphs of background before the first
  actionable step; put actions first, context in an appendix.
- **Missing expected outputs** — the reader can't tell if a step worked;
  show what success looks like at each step.
- **Untested commands** — flags changed, CLIs updated, paths moved; verify
  commands actually run in the current environment.
- **No escalation path** — runbooks that assume the fix always works leave
  responders stranded; always define the exit.
- **Tribal knowledge never written down** — "ask Priya, she knows" is not a
  runbook; capture it before Priya's vacation.
- **Stale runbooks** — referencing decommissioned dashboards, old hostnames,
  or removed flags; the last-verified date and post-incident updates prevent
  rot.
