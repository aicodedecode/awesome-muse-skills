---
name: purple-team
description: Run collaborative purple-team exercises where offense and defense work together to validate and improve detection coverage.
category: security
---

## Overview

Purple team is not a third team — it is a **collaboration model**: red (offense) and blue (defense) working together in the open to test whether specific adversary techniques are detected, and fixing the gaps on the spot. Instead of a stealthy red-team op followed by a painful debrief, purple exercises are transparent, iterative, and fast: execute a technique, check the telemetry, tune the detection, repeat.

This skill covers planning and running purple-team exercises that measurably improve detection coverage per MITRE ATT&CK technique.

Purple-team exercises are the fastest known way to convert 'we think we are covered' into 'we proved we are covered' — the tight execute-observe-tune loop compresses months of detection-engineering guesswork into an afternoon. The cultural effect matters too: red and blue building together replaces the adversarial blame dynamic with shared ownership of detection quality.

## When to use

- Validating detection coverage for high-priority techniques (credential access, lateral movement, exfiltration).
- After deploying a new EDR/SIEM/log source — prove it actually detects what you bought it for.
- Building a detection backlog grounded in tested reality instead of assumptions.
- Training junior analysts and detection engineers on adversary behavior hands-on.
- Complementing (not replacing) blind red-team assessments.

## Core concepts

- **Technique-scoped, not objective-scoped:** each exercise targets specific ATT&CK techniques (e.g., T1003 credential dumping, T1021 remote services), not a crown-jewel heist.
- **Transparency is the point:** blue knows what red will do and when. The question is never "were we surprised" but "did the telemetry and detection fire correctly."
- **Execute → observe → tune loop:** run the technique safely, check which logs/detections fired, fix or write the detection, re-run to confirm. Same session, same day.
- **Safe execution:** use lab or isolated segments first; in production only with written approval, during agreed windows, with abort procedures and synthetic/test accounts where possible.
- **Coverage heatmap:** track every tested technique as detected / partially detected / not detected with evidence. This becomes your detection roadmap.
- **Blameless by design:** missed detections are system gaps, not analyst failures. Celebrate the gap found, because now it can be fixed.

- **Pre-staged telemetry verification.** Confirm every expected log source is flowing before the session starts — discovering a broken forwarder mid-exercise wastes the whole window.
- **Difficulty progression.** Start sessions with techniques you expect to detect (calibration), then move to gaps. Early wins build momentum for the hard tuning work.
- **Cross-training by design.** Rotate who plays red and blue across sessions — analysts who have executed a technique write better detections for it.

## Practical workflow

1. **Pick the techniques:** 3–5 ATT&CK techniques per session, prioritized by threat intel relevance and current coverage gaps. Define success criteria per technique (which log sources should see it, what alert should fire).
2. **Prepare the range:** lab environment mirroring prod telemetry, or a tightly scoped prod segment with approval. Confirm log sources are flowing *before* the exercise.
3. **Brief both sides:** walk through the planned techniques, expected telemetry, and safety boundaries. Agree on the abort signal.
4. **Run the loop per technique:**
   a. Red executes the technique (documented, timestamped).
   b. Blue checks: which telemetry captured it? Did the detection fire? How fast?
   c. Together: write or tune the detection, add the runbook step.
   d. Re-run to confirm the improved detection fires.
5. **Score and record:** update the coverage heatmap with evidence links (queries, alert IDs). File detection-engineering tickets for anything not fixed in-session.
6. **Report the delta:** leadership gets before/after coverage, detections added, and remaining gaps with planned dates — a story of measurable improvement.

### Session template

- **Techniques:** Txxxx (name), Tyyyy (name)
- **Expected telemetry:** EDR process events, Windows Security log 4624/4672, firewall logs...
- **Success criteria:** alert fires within N minutes with correct severity and runbook link
- **Safety:** environment, window, abort procedure, accounts used
- **Results:** per technique — detected? latency? evidence? follow-up ticket?

### Sustaining the practice

- Cadence: monthly or quarterly sessions beat annual mega-exercises
- Maintain the heatmap as a living artifact linked to detection tickets
- Re-test fixed techniques after 90 days to catch regressions
- Share anonymized results with peer organizations or ISACs where appropriate

### Metrics that prove it works

- Techniques tested per quarter and coverage heatmap trend
- Detection-rate delta before/after each session
- % of gaps fixed in-session vs ticketed for later
- Repeat-test pass rate on previously fixed techniques

## Common pitfalls

- **Turning it into a stealth red team.** The moment blue does not know what is coming, you have lost the collaborative speed advantage. Save stealth for real assessments.
- **Too many techniques per session.** Depth beats breadth — 3 techniques fully tuned beats 10 executed and forgotten.
- **No lab parity.** If the lab's telemetry differs from prod, "detections" validated there may not fire where it counts. Verify log-source parity.
- **Skipping the re-run.** Tuning without re-testing is hope. Confirm the fix in the same session.
- **Heatmap without follow-through.** Tested-but-unfixed gaps tracked nowhere will still be gaps next quarter. Ticket everything.
- **Only testing what you already detect.** Prioritize red/yellow coverage areas and threat-intel-driven techniques, not comfort-zone wins.
- **Purple without real red skill.** Weak, unrealistic emulation produces false confidence. The red side must credibly execute the technique or the validation is meaningless.
- **No executive readout.** The heatmap delta is your funding story. If leadership never sees measurable improvement, the program starves.
- **Exercising only in the lab.** Lab-validated detections must be confirmed against production telemetry — forwarders, filters, and sampling differ.
- **Letting sessions become demos.** If red narrates instead of executing, blue learns theater. Real execution, real timestamps, real queries.
