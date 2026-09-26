---
name: business-analyst
description: Perform business analysis — requirements gathering, process mapping, gap analysis, and stakeholder-ready documentation.
category: business-marketing
---

## Overview

Business analysts bridge business needs and solutions: eliciting requirements, mapping processes, analyzing gaps, and documenting specifications that teams can build from. This skill covers the BA toolkit — stakeholder analysis, requirements elicitation, process modeling, and the documentation standards that prevent expensive misunderstandings.

## When to use

- Gathering requirements for a new system or feature
- Mapping and improving a business process
- Writing BRDs, FRDs, or user stories with acceptance criteria
- Analyzing gaps between current and desired state
- Evaluating build-vs-buy or vendor options
- Preparing stakeholder presentations on findings

- Evaluating build-vs-buy decisions
- Documenting as-is processes before automation
- Facilitating prioritization across competing stakeholders
## Core concepts

**Stakeholder analysis.** Map stakeholders by influence and interest. High-influence stakeholders need active management; high-interest ones need information. Missing a key stakeholder early guarantees rework later.

**Requirements elicitation.** Interviews, workshops, observation, document analysis, surveys. The 5 Whys get past stated wants to real needs. Distinguish business requirements (why), stakeholder requirements (what), and solution requirements (how, functional + non-functional).

**SMART requirements.** Specific, Measurable, Achievable, Relevant, Time-bound — or at minimum: unambiguous, testable, and traceable. "The system should be fast" is not a requirement; "95th percentile response under 2 seconds at 100 concurrent users" is.

**Process modeling.** As-is vs. to-be flows (swimlane diagrams showing handoffs between roles), pain points marked on the as-is, improvements designed into the to-be. Every handoff is a failure point — minimize them.

**Gap analysis.** Current state → desired state → the gap → options to close it → recommendation with costs/benefits/risks. Structured, comparable, decision-ready.

**Traceability.** Every requirement traces to a business need and forward to a test case. Untraceable requirements are how scope creep and untested features happen.


**RACI for requirements.** For each requirement or deliverable, define who is Responsible, Accountable, Consulted, and Informed. Requirement disputes usually trace to unclear accountability — RACI assigned at elicitation time prevents the "I thought you were handling that" failure mode.

**Non-functional requirements (NFRs).** Performance, security, scalability, usability, accessibility, compliance, and maintainability. NFRs are where projects silently fail: the system works but is too slow, insecure, or unusable. Elicit NFRs with the same rigor as functional ones, and quantify every one.

**MoSCoW prioritization.** Must have (non-negotiable for go-live) → Should have (important, not critical) → Could have (nice if time) → Won't have (explicitly out of scope).
The power is in the Won't list — explicit exclusion prevents scope creep disguised as clarification.
Revisit MoSCoW at each phase gate; priorities legitimately shift as learning happens.
**Traceability.** Link every requirement to its source (stakeholder, regulation, business goal) and to its test.
When requirements change — and they will — traceability shows exactly what else is affected.
Tools help, but even a simple matrix beats tribal memory.
**Gap analysis.** Current state → future state → the gap between them, itemized as changes required (process, people, technology).
Most failed transformations skipped honest gap analysis and discovered the gaps mid-implementation.
## Practical workflow

1. **Define scope and stakeholders.** What's in/out, who's affected, who decides. Get scope sign-off in writing before elicitation.
2. **Elicit requirements.** Run structured interviews and workshops. Ask about the current process, pain points, and what "good" looks like — not just feature requests. Observe the work being done; people omit steps they do unconsciously.
3. **Model the processes.** Draw as-is swimlanes. Validate with the people who do the work. Design to-be with pain points addressed. Get sign-off on both.
4. **Document specifications.** BRD (business need, scope, success criteria), functional requirements (numbered, testable), non-functional requirements (performance, security, usability, compliance), user stories with acceptance criteria for agile teams.
5. **Validate and prioritize.** Walk through requirements with stakeholders. Prioritize with MoSCoW (Must/Should/Could/Won't). Get formal sign-off — this is your change-control baseline.
6. **Support delivery.** Answer builder questions, manage change requests (impact-assess every change), verify delivered work against acceptance criteria.

**User story format:** As a [role], I want [capability], so that [benefit]. Acceptance criteria in Given/When/Then. Each story independently testable and sized for one sprint.


**Workshop facilitation format (90 minutes):** 10 min framing and ground rules → 20 min current-state painstorm (silent writing, then share) → 25 min future-state vision (what does good look like?) → 20 min prioritization (dot voting on improvements) → 15 min next steps and owners. Send pre-reads; capture decisions live on a shared screen.

**Requirements document structure:** background and objectives → scope (in and out) → stakeholders → functional requirements (numbered, testable) → non-functional requirements (quantified) → assumptions and constraints → acceptance criteria → glossary.
Number every requirement (REQ-001) — unnumbered requirements cannot be tracked, tested, or changed systematically.
**Sign-off ritual:** walk stakeholders through requirements → capture objections live → revise → get explicit written sign-off.
Verbal agreement evaporates; written sign-off (even an email) anchors accountability.
## Common pitfalls

- **Solutioneering.** Jumping to solutions before understanding the problem. Elicit needs, not features.
- **Missing stakeholders.** The person who wasn't consulted becomes the person who blocks go-live.
- **Vague requirements.** "User-friendly", "robust", "flexible" — untestable words that cause disputes. Quantify everything.
- **No scope baseline.** Without signed-off scope, every new request feels reasonable and the project never ends.
- **Skipping the as-is.** Designing to-be without understanding current reality produces elegant solutions to wrong problems.
- **Documentation nobody reads.** 200-page BRDs gather dust. Right-size docs for the audience; visual models beat paragraphs.
- **Weak change control.** "Small" changes accumulate into scope explosions. Impact-assess and approve every change.
- **Accepting the first stated requirement.** Stakeholders describe solutions ("we need a dashboard") not needs ("we need to spot at-risk accounts weekly"). Keep asking why until you reach the real need.
- **No definition of done.** Requirements without acceptance criteria are never truly finished. Every requirement ships with testable criteria.
- **Gold-plating.** Adding nice-to-have requirements nobody asked for. Every requirement traces to a stakeholder need or it gets cut.
- **Analysis paralysis.** Perfecting documentation while the project stalls. Timebox analysis; ship the 80% version and iterate.
