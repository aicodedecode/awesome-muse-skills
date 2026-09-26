---
name: forensics-pro
description: Conduct digital forensics investigations — evidence acquisition, timeline analysis, and court-ready documentation.
category: security
---

## Overview

Digital forensics is the science of reconstructing what happened on systems: what the attacker did, when, and what data was affected. It serves incident response, legal proceedings, and HR investigations. The work lives or dies on **method**: forensically sound acquisition, chain of custody, and timeline analysis that turns scattered artifacts into a coherent story.

This skill covers the end-to-end methodology — acquisition, analysis, timeline building, and reporting — for practitioners supporting incidents and investigations.

Forensics is the discipline of being right when it matters most — under legal scrutiny, executive pressure, and incomplete data. The methodology exists because memory is fallible and tools have opinions: hash everything, document every step, corroborate across artifacts, and state uncertainty plainly. 'We could not determine X because Y' is a professional answer; guessing is not.

## When to use

- Supporting an active incident: which hosts were touched, what data left.
- HR/legal investigations: policy violations, data theft, insider activity.
- Building a defensible timeline for breach notification or litigation.
- Validating scope before eradication and recovery decisions.

## Core concepts

- **Order of volatility (RFC 3227):** registers/cache → memory → network state → running processes → disk → logs → backups. Collect volatile evidence first; it disappears on reboot.
- **Forensically sound acquisition:** bit-for-bit copies via write blockers or trusted agents; hash (SHA-256) the source and the image and record both. Never analyze the original.
- **Chain of custody:** who collected what, when, how, where it is stored, who accessed it. Breaks in custody undermine legal admissibility.
- **Timeline analysis:** fuse filesystem timestamps, event logs, registry, browser history, and network logs into one super-timeline. Attacker actions emerge from the sequence.
- **Know normal:** OS artifacts (prefetch, shimcache, amcache, shellbags, event logs) have known meanings — learn the artifact, not just the tool output.
- **Scope before depth:** quickly determine *which* systems matter, then go deep on those. Imaging the entire fleet wastes the golden hours.

- **Timeline-first triage.** Build the super-timeline early even from partial data — it focuses all subsequent deep analysis on the right hosts and windows.
- **Artifact redundancy.** No single artifact tells the truth alone; registry, event logs, filesystem, and network each have blind spots the others cover. Corroborate or qualify.
- **Anti-forensics awareness.** Timestomping, log deletion, and artifact wiping are themselves evidence — their presence tells you about attacker sophistication and what they wanted hidden.

## Practical workflow

1. **Scope and legal check:** define the investigation's questions and boundaries. For HR/legal matters, involve counsel *before* collection — privacy and employment law constraints vary by jurisdiction.
2. **Preserve:** isolate or snapshot affected systems without destroying volatile state where possible. Record system times and time zones (clock skew ruins timelines).
3. **Acquire:** memory capture first, then disk images via write-blocked or agent-based acquisition. Hash everything; document custody from the first touch.
4. **Triage quickly:** build an initial timeline from high-value artifacts (auth logs, EDR telemetry, firewall/proxy logs) to bound the incident window and identify key hosts.
5. **Analyze deeply:** on priority hosts, examine persistence mechanisms, executed programs, lateral-movement traces, staging directories, and exfiltration indicators. Correlate across hosts into one master timeline.
6. **Report:** executive summary (what happened, impact), detailed timeline with evidence references, findings per investigation question, and gaps (what could not be determined and why). Preserve images and notes per retention policy.

### Artifact quick reference

- **Windows:** Security/System event logs, Prefetch, Shimcache, Amcache, Registry (SAM/SYSTEM/SECURITY, NTUSER), SRUM, browser history, $MFT/$UsnJrnl, LNK files
- **Linux:** auth/syslog, bash history, cron/at jobs, systemd journals, auditd logs, /tmp and hidden dirs, package-manager logs
- **macOS:** Unified Logs, Spotlight metadata, TCC database, quarantine events
- **Network:** DHCP, DNS, proxy, firewall, VPN, and cloud audit logs

### Sustaining the practice

- Maintain a lab with current tools and reference VMs for each OS you support
- Keep an artifact reference library — what each artifact proves and its caveats
- Peer-review timelines and conclusions before final reporting
- Exercise the collection workflow annually so it works under incident pressure

### Metrics that prove it works

- Time from engagement to preliminary timeline
- Evidence integrity rate (hash verifications passing, custody gaps: zero)
- Report turnaround vs agreed deadline
- % of investigation questions answered vs marked "could not determine"

## Common pitfalls

- **Rebooting or "cleaning" before capture.** The most common evidence-destroying mistake. Contain without powering off when forensics matters.
- **Analyzing originals.** Always work on copies. One accidental write timestamp change can taint findings.
- **Clock confusion.** Mixed time zones and skewed clocks produce impossible timelines. Normalize to UTC and note offsets.
- **Tool-output reporting.** "Tool X said Y" is not analysis. Interpret artifacts, corroborate across sources, and explain reasoning.
- **Scope creep in HR cases.** Collect only what the investigation's written scope authorizes. Over-collection creates legal exposure.
- **No custody documentation.** Great analysis with no chain of custody is inadmissible and untrustworthy. Document from first touch.
- **Imaging everything.** Full-disk images of the whole fleet burn the golden hours. Triage with timelines and targeted artifacts first, image what matters.
- **Timelines without clock validation.** Unverified time zones and skewed clocks produce impossible sequences that collapse under scrutiny. Normalize and document.
- **Over-collecting in HR investigations.** Imaging personal devices or mailboxes beyond the written scope creates legal exposure. Scope discipline is a professional requirement.
- **Presenting tool output as conclusions.** 'The tool flagged X' is not analysis. Interpret, corroborate, and explain your reasoning in the report.
