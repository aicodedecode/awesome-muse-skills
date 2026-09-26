---
name: sast-dast-pro
description: Run static and dynamic application security testing — tool selection, tuning, triage, and developer integration.
category: security
---

## Overview

SAST (static analysis — examining code without running it) and DAST (dynamic analysis — testing the running application) are complementary: SAST finds code-level flaws early and cheaply across the whole codebase; DAST finds runtime issues — auth flaws, misconfigurations, injection in context — that static analysis cannot see. Mature programs run both, tuned, with developers in the loop.

This skill covers operating both well: tool selection, rule tuning, triage workflows, and integration into development without destroying velocity.

Tune for the developer's trust, not the scanner's ego: a SAST rule that fires 500 false positives will get the whole tool ignored, including the 5 true positives. Ruthlessly disable noisy rules, write custom rules for your frameworks' dangerous patterns, and measure precision like your program depends on it — because it does.

## When to use

- Selecting and deploying SAST/DAST tooling for the first time.
- Tuning noisy tools that developers have started ignoring.
- Building triage workflows (security review of findings, developer fix loop).
- Adding custom rules for framework-specific dangerous patterns.
- Meeting compliance requirements for application security testing.

## Core concepts

- **SAST strengths and limits.** Great at: injection sinks, hardcoded secrets, weak crypto, dangerous APIs — across the whole codebase, pre-merge. Weak at: auth logic, business-logic flaws, anything requiring runtime context. High false-positive potential without tuning.
- **DAST strengths and limits.** Great at: runtime injection, misconfigurations, auth/session issues, exposed debug endpoints — from the attacker's perspective. Weak at: code coverage (only tests what the crawler reaches), authenticated areas without good session handling, and APIs without specs.
- **Rule tuning is the job.** Out-of-the-box rulesets are generic. Disable noisy rules, tune severity, and write custom rules for your stack's dangerous patterns (your ORM's raw-query API, your template engine's unsafe constructs).
- **Triage workflow.** Automated deduplication and baseline (new findings only on PRs), security-team review of highs, developer ownership of fixes with SLA, and a documented false-positive process that feeds back into tuning.
- **Baseline, don't boil the ocean.** On legacy codebases, baseline existing findings and gate only on *new* issues — otherwise teams drown on day one and the program dies.
- **Authenticated DAST.** Crawling as an authenticated user (and ideally as multiple roles) multiplies DAST value — most interesting vulnerabilities live behind login. Invest in reliable session handling.
- **API-focused testing.** For API-heavy apps, DAST driven by OpenAPI specs with auth tokens beats browser crawling. Include business-logic abuse cases in scope.
- **IAST as a complement.** Interactive testing (instrumented runtime) combines code context with runtime reality — strong signal where SAST/DAST both struggle, at the cost of deployment complexity.

- **Secrets detection in SAST scope.** Hardcoded credentials are among the highest-value SAST findings — run secret scanning on every commit with immediate rotation workflows for hits.
- **Crawler seed quality for DAST.** DAST coverage depends on crawl seeds: sitemaps, recorded user journeys, and API specs. Invest in seeds and authenticated coverage follows.

## Practical workflow

1. **Select tools for your stack:** language coverage, framework awareness, CI integration quality, and rule-customization matter more than finding counts in demos. Pilot on a real repo, not a demo app.
2. **Tune before rollout:** run on representative code, measure precision per rule, disable the noisy ones, write 3–5 custom rules for your most dangerous patterns. Aim for developer trust on day one.
3. **Integrate at PR time:** SAST on pull requests showing only new findings with fix guidance; block merges only on high-confidence highs. Speed matters — keep PR checks under minutes.
4. **Run DAST on schedule:** authenticated scans of staging/production on cadence (and on major releases); triage with the same SLA discipline as SAST; feed confirmed issues to developers with reproduction steps.
5. **Triage and track:** security reviews highs/criticals, developers fix within SLA, false positives feed tuning, and everything tracks in the same backlog as other vulnerabilities.
6. **Measure and improve:** precision per rule, fix rate and MTTR by severity, developer satisfaction with the tooling, and coverage (repos scanned, apps DASTed, authenticated coverage %).

### Quick wins

- Disable the 10 noisiest SAST rules this week and measure developer sentiment change
- Write 3 custom rules for your stack's most dangerous patterns
- Run one authenticated DAST scan and compare coverage to the unauthenticated baseline

### Sustaining the practice

- Review rule precision quarterly; disable or fix rules below the trust threshold
- Expand custom rules as new dangerous patterns emerge in code review
- Re-baseline legacy findings annually — old accepted risks need re-examination
- Benchmark tools periodically; the market and your stack both evolve

### Metrics that prove it works

- SAST precision (true positives / total findings) per rule category
- % of findings fixed within SLA, by severity
- DAST authenticated coverage % of the application
- Developer block-rate on false positives (target: near zero)

## Common pitfalls

- **Deploying untuned and gating immediately.** The classic program-killer: 2,000 findings on day one, developers revolt, tool gets bypassed. Tune, baseline, then gate.
- **Treating scanner output as the backlog.** Raw findings without triage, deduplication, and severity validation waste developer time and security credibility.
- **No custom rules.** Generic rules miss your framework's specific dangers. The highest-value rules are the 5 you write yourself.
- **Unauthenticated-only DAST.** Crawling the login page and marketing site while the app sits behind auth. Authenticate, with multiple roles.
- **Ignoring the fix loop.** Finding without fixing is measurement, not security. Track fix rates and chase aging findings like any SLA.
- **SAST as the only testing.** Static analysis cannot find broken access control or business-logic flaws. Pair with DAST, manual testing, and threat modeling.
- **Tool sprawl.** Three overlapping SAST tools with three backlogs and no ownership. Consolidate on one per language family, integrate deeply.
- **Forgetting IaC and secrets.** Application security testing should include infrastructure-as-code scanning and secret detection — misconfigured cloud and leaked keys are appsec issues too.
- **Scanning generated code.** SAST on generated/vendored code produces noise and unactionable findings. Exclude generated code; scan its generators and inputs instead.
- **DAST against production without coordination.** Active scanning can corrupt data and trigger fraud controls. Prefer staging; coordinate production tests explicitly.
