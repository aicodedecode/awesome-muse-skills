---
name: reverse-engineer
description: Reverse-engineer binaries and protocols for defensive purposes — vulnerability research, malware understanding, and interoperability.
category: security
---

## Overview

Reverse engineering is the disciplined study of how software *actually* works by examining its compiled form: disassembly, decompilation, and behavioral observation. Defenders use it to understand malware, find vulnerabilities in software they must protect, verify vendor claims, and build interoperable tools. It is slow, methodical work — and one of the highest-leverage defensive skills.

This skill covers the defensive methodology: legal boundaries, lab setup, static/dynamic techniques, and turning findings into protections. It stays at the standard published methodology level — no exploit development, no circumvention of DRM or access controls.

Reverse engineering rewards patience and punishes ego — the binary does not care how clever you are, only how carefully you observe. The analysts who excel build systems: consistent naming conventions, structured notes, hypothesis logs, and verification discipline. Speed comes from method, not from staring harder at disassembly.

## When to use

- Understanding malware or a suspicious binary's true behavior (with malware-analyst).
- Vulnerability research on software you are authorized to assess (your products, bounty scope, contracted assessments).
- Verifying what a third-party agent, driver, or firmware actually does before deployment.
- Interoperability work: documenting a protocol or file format you must integrate with.
- Confirming a patch actually fixed the vulnerable code path.

## Core concepts

- **Legal scope first:** reverse engineering is restricted by license terms and law in many jurisdictions. Work only on software you own, have licensed rights to analyze, or are explicitly authorized to assess (contract, bounty scope). When unsure, get legal review.
- **Static vs dynamic:** static (disassembly/decompilation, control-flow graphs) shows all possible paths; dynamic (debugger, instrumentation, tracing) shows what actually executes. Use static to target, dynamic to confirm.
- **Start from behavior:** observe the binary's inputs/outputs, network traffic, and system interactions first. Behavior narrows the code you need to read from millions of instructions to hundreds.
- **Identify the interesting code:** crypto routines, parsers (attack surface), auth checks, network handlers, and update mechanisms. Parsers of untrusted input are where memory-safety bugs live.
- **Document as you go:** function names, data structures, protocol fields. A reversed binary without notes is work you will redo.
- **Findings → defenses:** the output is a vulnerability report with root cause, or detection logic, or a hardening recommendation — not just "I understand it now."

- **Library identification first.** Signature matching lets you skip thousands of library functions and focus on the author's actual code.
- **Cross-references are the map.** Who calls this function, who writes this memory, where does this string get used — follow xrefs before reading linearly.
- **Version diffing.** When analyzing patches, diff the vulnerable version against the fixed one — the patch points directly at the vulnerability.

## Practical workflow

1. **Establish authorization and scope:** confirm in writing what you may analyze and what the output will be used for. Set up the isolated lab (VM, snapshots, no prod network).
2. **Recon the binary:** file type, architecture, compiler/packer identification, hashes, embedded strings, imported/exported functions. Check for known versions and published CVEs first — do not reverse what is already documented.
3. **Behavioral baseline:** run it (safely, in the lab), capture file/registry/network activity and API traces. Note trust-boundary crossings: network input, file parsing, IPC.
4. **Targeted static analysis:** load into a disassembler/decompiler; rename functions, recover structures, and trace data flow from untrusted inputs to dangerous sinks (memory copies, format strings, deserialization, command execution).
5. **Dynamic confirmation:** set breakpoints, trace execution, and verify hypotheses about the vulnerable or interesting path. Confirm with concrete evidence, not code-reading alone.
6. **Report defensively:** for vuln research — affected versions, root cause, trigger conditions, impact, and remediation (patch guidance, mitigations, detection). For malware — capabilities and IOCs. For interop — documented format/protocol spec.

### Analysis notes template

- Binary identity: name, version, hash, source
- Authorization reference
- Behavioral summary (what it does at a high level)
- Key functions/structures recovered (with addresses/offsets)
- Trust boundaries and untrusted-input entry points
- Findings: description, evidence, severity, recommended action

### Sustaining the practice

- Build a personal knowledge base of reversed protocols, formats, and techniques
- Contribute sanitized findings to team runbooks and detection logic
- Keep tooling and scripts versioned — your RE toolkit is infrastructure
- Re-verify old conclusions when new versions or samples appear

### Metrics that prove it works

- Analysis turnaround per target, by complexity class
- % of findings delivered with confirmed root cause (not just crash location)
- Vulnerability confirmation rate (hypotheses that held up under dynamic testing)
- Documentation completeness (could another analyst pick up your notes?)

## Common pitfalls

- **Skipping authorization.** License and legal constraints are real. Get clearance first, especially for commercial software.
- **Boiling the ocean.** Reversing an entire binary instead of targeting the parser/auth/network code wastes weeks. Behavior-first targeting is the discipline.
- **Trusting the decompiler blindly.** Decompilers approximate; verify critical logic against disassembly and dynamic traces.
- **No notes.** Reverse engineering without documentation is write-only work.
- **Findings without remediation.** A crash PoC with no root-cause analysis or fix guidance is half a deliverable. Defenders need the *why* and the *fix*.
- **Leaking analysis artifacts.** Reversed code, keys, or protocol details may be sensitive — handle outputs under the same authorization as the input.
- **Reversing without a question.** "Understand this binary" is unbounded. Define the decision the analysis informs (patch? block? interop?) and scope to it.
- **Misidentifying the toolchain.** Wrong compiler/packer assumptions waste days. Verify packer/compiler identification before deep static work.
- **Falling in love with the first hypothesis.** Confirmation bias is the RE killer. Actively seek disconfirming evidence for your theory of the code.
- **Skipping the strings and imports.** Ten minutes of strings review often answers what ten hours of disassembly would — always start there.
