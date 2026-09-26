---
name: bug-bounty-hunter
description: Run an effective bug bounty program — scope design, triage, researcher relations, and remediation workflows.
category: security
---

## Overview

A bug bounty program pays independent researchers for responsibly disclosed vulnerabilities in your systems. Done well, it is continuous, adversarial testing at a scale no internal team can match. Done badly, it is a flood of duplicates, out-of-scope reports, and burned researcher goodwill.

This skill is written for **program owners** (defenders running the program) — scoping, triage, payouts, and turning reports into fixes. It covers only authorized, in-scope testing methodology at the standard published level: recon, testing within the published scope, and quality reporting. No exploit code.

A bounty program is a marketplace: researchers sell attention and skill, you buy findings with money, responsiveness, and respect. Programs that thrive treat researchers as an extension of the security team — fast triage, fair pay, technical feedback, and public credit where wanted. Programs that treat them as ticket-generators get what they pay for.

## When to use

- Launching a private or public bounty program (start private, invite-only).
- Triaging incoming reports quickly and fairly.
- Setting bounty tables, safe harbor language, and scope that attracts good researchers.
- Integrating bounty findings into your SDLC so reports become fixes, not backlog.
- Deciding whether your org is mature enough for bounty (you need vuln-management first).

## Core concepts

- **Safe harbor:** an explicit commitment not to pursue legal action for good-faith, in-scope research. Without it, good researchers stay away.
- **Scope is the product:** clear in-scope assets, explicit out-of-scope items, and testing rules. Vague scope produces vague reports and disputes.
- **Private before public:** start with a small vetted researcher pool, tune triage, then open up. Public launch with broken triage is reputational damage.
- **Triage SLA:** acknowledge in 1–2 days, first assessment in under a week. Slow triage kills researcher motivation faster than low payouts.
- **Duplicates are data:** high duplicate rates on an asset mean your vuln-management is behind, not that researchers are sloppy. Fix the root cause.
- **The report is the deliverable:** severity, reproduction steps, impact in your context, suggested fix. Reward quality reports, not just criticals.

- **Signal over volume.** Ten high-quality researchers outperform a thousand drive-by submitters. Invest in relationships with proven researchers: private scopes, bonuses, early access.
- **Root-cause bounties.** Consider bonus multipliers for reports that identify systemic issues or come with suggested fixes — it shifts incentives from bugs to classes.
- **Disclosure policy.** A clear coordinated-disclosure policy with timelines builds researcher trust and turns fixes into positive publicity.

## Practical workflow

1. **Readiness check:** do you have asset inventory, a vuln-management process with SLAs, and someone to own triage? If not, fix that first — bounty amplifies process gaps.
2. **Design the program:** define scope (start narrow: one app or API), rules of engagement, out-of-scope list, safe harbor text, bounty table by severity, and response SLAs. Publish it all.
3. **Launch private:** invite 20–50 researchers, run 4–8 weeks, tune scope and triage on real volume.
4. **Triage pipeline:** intake → deduplicate → validate (reproduce in-house) → severity using your rubric → route to the owning team with a fix SLA → verify the fix → pay → disclose (if policy allows).
5. **Researcher relations:** communicate decisions with reasons, pay promptly, give feedback on report quality, invite strong researchers to private scopes. Reputation compounds.
6. **Close the loop:** track bounty findings in the same system as pentest/scanner findings; measure time-to-fix and recurrence. Feed common bug classes into secure-coding training and SAST rules.
7. **Go public when ready:** triage holding up, fix SLAs holding up, scope stable. Announce with a clear brief and realistic expectations.

### Bounty brief essentials

- In-scope assets (exact domains, apps, APIs, mobile builds)
- Out-of-scope (third-party services, DoS, spam, social engineering unless invited)
- Rules: no data exfiltration beyond proof, no degrading service, stop at PII
- Safe harbor statement
- Severity rubric and payout table
- Response and payout SLAs

### Sustaining the practice

- Review the bounty table annually against market rates and program data
- Publish anonymized program stats to attract quality researchers
- Rotate fresh private scopes to retain top researchers
- Audit triage quality by sampling closed reports quarterly

### Metrics that prove it works

- Median time to first triage response and to severity decision
- Time from validation to fix, by severity
- Valid-report rate (signal quality of the program)
- Researcher retention: % of top researchers still active after 6 months

## Common pitfalls

- **Launching public on day one.** You will drown. Private first, always.
- **Scope ambiguity.** "Our main site" is not scope. Enumerate assets explicitly.
- **Slow or silent triage.** Researchers talk. A program known for ghosting gets low-effort reports.
- **Paying late or disputing fairly-earned bounties.** Nothing kills a program faster.
- **Treating bounty as your vuln-management.** It is a complement to scanning, pentests, and code review — not a replacement.
- **Ignoring duplicates as signal.** Ten duplicate IDOR reports = your access-control testing is broken. Fix the class.
- **No fix verification.** Paying without verifying the fix teaches researchers (and your team) that closure does not matter.
- **Scope that excludes everything interesting.** Researchers invest where scope rewards them. Overly narrow scope gets low-effort reports on the allowed sliver.
- **Inconsistent severity calls.** Publish your rubric with worked examples. Nothing erodes trust like two identical bugs paid differently.
- **Scope creep by researcher pressure.** Expanding scope reactively to appease complaints creates inconsistency. Change scope deliberately, announce clearly.
- **Ignoring the long tail of low-severity reports.** Individually minor, in aggregate they map your attack surface. Mine them for patterns quarterly.
