---
name: dependency-scanner
description: Manage software composition analysis — SBOMs, vulnerability triage, and remediation of third-party dependencies.
category: security
---

## Overview

Modern applications are mostly third-party code: direct and transitive dependencies that carry their own vulnerabilities. Software Composition Analysis (SCA) inventories those dependencies, flags known CVEs, and — done right — drives a remediation program. Done wrong, it is a weekly email of 300 CVEs nobody acts on.

This skill covers the dependency-security lifecycle: inventory via SBOMs, risk-based triage, upgrade/remediation workflows, and policy that prevents the worst cases automatically.

Prioritize by reachability and exploitability, not CVE count: a critical CVE in a dependency your code never calls is less urgent than a medium CVE in the function handling user input. Reachability analysis and CISA KEV membership should drive your queue — raw CVSS sorting is how teams burn out fixing theoretical risk.

## When to use

- Standing up SCA scanning across repositories.
- Triaging the backlog of dependency vulnerabilities.
- Generating SBOMs for customers, regulators, or incident response.
- Responding to a critical library CVE (Log4Shell-style) across the estate.
- Setting dependency-update policy (Renovate/Dependabot with security rules).

## Core concepts

- **SBOM as inventory.** Software Bill of Materials (SPDX or CycloneDX) per build — the ingredient list that makes incident response ("where do we use log4j?") answerable in minutes instead of weeks. Generate at build time, store centrally.
- **Direct vs transitive.** You choose direct dependencies; transitive ones arrive implicitly. Both need scanning, but remediation differs — transitive issues often fix via direct-dependency upgrades or overrides.
- **Reachability analysis.** Does your code actually call the vulnerable function? Reachability-filtered results cut noise dramatically and focus effort where exploitation is plausible.
- **Exploitability signals.** CISA KEV, public exploits, and EPSS scores separate "patch now" from "patch on cadence." A CVE with no exploit path and no KEV listing is rarely the week's priority.
- **Upgrade strategy.** Automated dependency updates (grouped, tested) for routine bumps; security fast-lane for criticals; major-version upgrades as planned projects with testing. Pin versions for reproducibility; update deliberately.
- **License risk rides along.** SCA tools flag licenses too — coordinate with the license-auditor practice so one scan serves both programs.
- **Private registries and proxies.** Proxy public registries through an internal mirror — it gives you a control point for blocking malicious packages and a buffer during upstream incidents.
- **Malicious packages.** Typosquatting and compromised maintainers are a real vector — monitor for unexpected new dependencies, lockfiles should be reviewed, and anomaly alerts on package metadata changes beat CVE feeds here.

- **Lockfile integrity.** Commit lockfiles and verify hashes in CI — a lockfile that CI ignores is documentation, not a control.
- **End-of-life component tracking.** Dependencies on EOL runtimes and frameworks accumulate silently; track EOL dates as a distinct risk category with migration plans.

## Practical workflow

1. **Inventory everything:** enable SCA on all repos; generate SBOMs at build; centralize the data so "where is package X?" is one query across the estate.
2. **Triage risk-based:** filter by reachability + KEV/exploitability + asset criticality. Publish the short real-priority list weekly; track the rest on standard cadence.
3. **Automate routine updates:** grouped, auto-tested dependency PRs for non-breaking updates; security-labeled fast lane that pages on criticals with fixes.
4. **Handle the hard upgrades:** major-version bumps and unmaintained dependencies get planned projects with owners and dates — not permanent backlog entries.
5. **Respond to zero-days:** SBOM query → affected services list → patched-version rollout → verification. Time-box each step; this is the workflow the SBOM investment pays for.
6. **Govern new dependencies:** lightweight approval or review for new direct dependencies (maintenance status, license, known issues) — cheaper than remediating a bad choice later.

### Quick wins

- Generate SBOMs for your top 5 services this week; store them centrally
- Enable automated security update PRs with a fast-lane label and SLA
- Query your estate for the latest critical library CVE as a fire drill

### Sustaining the practice

- Review scanner coverage monthly — new repos and languages get onboarded, not discovered
- Audit the automated-update pipeline: are security PRs actually merging?
- Re-assess unmaintained dependencies quarterly; plan replacements
- Exercise the zero-day response workflow with a tabletop annually

### Metrics that prove it works

- Mean time from fix-available to deployed, for critical/high CVEs
- % of dependencies on supported versions; unmaintained-dependency count
- Reachability-filtered critical count (the number that actually matters)
- Zero-day response time: query-to-patched in the last real event

## Common pitfalls

- **CVSS-sorted firefighting.** Fixing 9.8s in unreachable test dependencies while reachable 7.5s on prod wait. Triage by reachability × exploitability × exposure.
- **No SBOM, no incident response.** Discovering during Log4Shell that nobody knows where the library is used. Generate SBOMs before you need them.
- **Automated updates without tests.** Auto-merging dependency PRs with no test suite ships breakage. Gate automation on meaningful CI.
- **Ignoring transitive dependencies.** "We didn't choose it" does not reduce the risk. Scan and remediate transitives via upgrades and overrides.
- **Pinning without updating.** Pinned versions for reproducibility are good; pinned-and-forgotten for three years is vulnerability accumulation. Pin and keep current.
- **Malicious-package blindness.** CVE scanning does not catch typosquats or compromised maintainers. Monitor dependency changes and use lockfiles diligently.
- **Scanner per repo, no estate view.** Per-repo findings without central aggregation make enterprise-wide response impossible. Centralize the data.
- **License and security silos.** Running separate SCA scans for vulns and licenses wastes effort. One inventory, two lenses.
- **Dev-only dependency blindness.** Build-time dependencies with CVEs still matter — compromised build tools poison artifacts. Scan all scopes, triage by reachability.
- **Ignoring the fix-available signal.** CVEs without fixes need compensating controls or risk acceptance, not indefinite backlog aging. Decide explicitly.
