---
name: threat-modeler
description: Run structured threat-modeling sessions (STRIDE, attack trees, DREAD) to find design-level flaws before code is written.
category: security
---

## Overview

Threat modeling is a structured way to ask "what can go wrong?" during design, when fixes are cheapest. You map what you are building, identify threats against it, and decide mitigations — before a line of code exists. It is the single highest-leverage security activity for catching *insecure design* flaws that scanners cannot find.

This skill gives you repeatable methods (STRIDE, attack trees, risk ranking) and facilitation patterns for running threat-model sessions with engineering teams.

A threat model is a decision record as much as a diagram: it captures what the team worried about, what they decided, and why. Months later, when someone asks why the reset token expires so fast, the model should answer. Treat it as living architecture documentation, not a security ritual.

## When to use

- Designing a new feature, API, auth flow, or data pipeline.
- Adopting a new architecture (microservices, event-driven, multi-tenant SaaS).
- Before major changes to trust boundaries: SSO integration, third-party data sharing, new admin roles.
- After an incident: threat-model the failed control to find sibling weaknesses.
- When "the design feels fine" is the only security argument anyone has.

## Core concepts

- **The four questions (Shostack):** What are we building? What can go wrong? What are we going to do about it? Did we do a good job?
- **Trust boundaries:** where data crosses from one trust level to another (browser → API, API → DB, service → third party). Threats concentrate at boundaries.
- **STRIDE:** Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege. Apply per data-flow element; it is a prompt list, not a religion.
- **Attack trees:** goal at the root, attack paths as branches. Reveals which mitigations block the most paths (highest leverage).
- **Risk ranking:** impact × likelihood, or DREAD (Damage, Reproducibility, Exploitability, Affected users, Discoverability). Use consistently so sessions are comparable.
- **Abuse cases:** write attacker user stories ("As an attacker, I replay the password-reset token...") next to functional stories.

- **Elevation of privilege deserves extra weight.** In STRIDE, the 'E' often carries the highest blast radius — a tampering issue in one tenant becoming cross-tenant access changes the whole risk picture.
- **Model the operational plane too.** Admin interfaces, support tooling, and data pipelines are part of the system and frequently the weakest-modeled part.
- **Capture assumptions explicitly.** 'We assume the IdP enforces MFA' is a load-bearing assumption — write it down so its violation gets noticed.

## Practical workflow

1. **Scope the session:** one data flow or feature, 60–90 minutes, with the engineers who will build it plus one security-minded facilitator. Circulate a one-page architecture sketch beforehand.
2. **Draw the diagram:** data-flow diagram with trust boundaries, data stores, and external entities. Keep it to one page — detail kills momentum.
3. **Enumerate threats:** walk each element and flow through STRIDE. Ask "what can go wrong here?" For each threat, note the attacker, the precondition, and the impact.
4. **Rank:** score impact × likelihood (1–3 each is fine). Focus discussion on highs; park lows in a register.
5. **Decide mitigations:** for each high/medium threat choose: fix in design, add a control, accept (with owner and expiry), or transfer. Record the decision and owner.
6. **Turn mitigations into work:** file tickets with acceptance criteria ("reset tokens single-use, 15-min expiry, logged on use"). Threat models without tickets are fiction.
7. **Review on change:** revisit when the design changes, not on a calendar. Store the model next to the architecture docs.

### Facilitation prompts that work

- "Who is the attacker here, and what do they want?"
- "What happens if this token leaks / is replayed / never expires?"
- "Where does this data live at rest, and who can read it?"
- "How would we detect this happening?"
- "What is the blast radius if this component is compromised?"

### Sustaining the practice

- Store threat models next to architecture docs, in version control
- Revisit on every design change to the modeled flow, not on a calendar
- Review mitigation tickets in sprint planning until closed
- Sample past models quarterly: did the predicted threats materialize elsewhere?

### Metrics that prove it works

- % of new features threat-modeled before implementation
- Mitigation ticket completion rate within the agreed sprint window
- Design flaws caught pre-code vs found post-release (the ratio is the ROI story)
- Time from session to filed tickets (should be days, not weeks)

## Common pitfalls

- **Threat modeling the whole system.** Scope to one flow. Whole-system sessions balloon and die.
- **No engineers in the room.** Security-only sessions produce models nobody builds to. The builders must own the mitigations.
- **Treating it as a one-time document.** Designs drift; the model must be re-checked when flows change.
- **Ranking everything "high."** If everything is critical, nothing is. Force the ranking conversation.
- **Skipping "did we do a good job?"** Validate mitigations in testing (pentest the modeled flows) or the model is unverified optimism.
- **Tool-first thinking.** Whiteboard and STRIDE beat an expensive tool nobody opens. Add tooling only after the habit exists.
- **Modeling from imagination.** If the data-flow diagram does not match the actual architecture, the threats found are fiction. Validate the diagram with builders first.
- **Ranking by loudest voice.** Use silent individual scoring before discussion, or seniority decides risk instead of evidence.
- **Facilitator as scribe-only.** A passive facilitator lets the session drift into architecture review. Drive the STRIDE prompts actively and time-box each element.
- **Mitigations assigned to 'the team.'** Unowned mitigations do not happen. Every mitigation gets a named owner and a ticket before the session ends.
