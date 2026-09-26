---
name: prompt-injection-defense
description: Defend LLM systems against prompt injection — attack taxonomy, input handling, output validation, and layered mitigations. Use when building LLM features that process untrusted input. Defensive only.
category: ai-research
---

# Prompt Injection Defense

Prompt injection: malicious instructions hidden in data the model processes — webpages, 
documents, tool outputs, user messages — that hijack the model's behavior. This skill is 
defensive: understand the attack shapes so you can build systems that resist them.

## Overview

The core vulnerability: models can't reliably distinguish instructions from data — everything is 
text. Attacks exploit this: direct injection (malicious user input), indirect injection (poisoned 
webpages, documents, or tool outputs the model reads), and multi-step variants (instructions split 
across turns or sources). Defense is layered because no single layer is reliable: structure inputs, 
validate outputs, limit authority, and monitor.

## When to use

- Building any LLM feature that processes untrusted content: webpages, uploads, emails, tool 
outputs.
- Agents with tool access: injection + tools = the highest-risk combination.
- Reviewing the security of an existing LLM integration.
- Designing system prompts and data pipelines with adversarial robustness in mind.

## Core concepts

- **Attack taxonomy**: direct (user input contains instructions), indirect (third-party content 
contains instructions the model acts on), delimiter smuggling (fake system tags), multi-turn (setup 
across conversation), tool-output poisoning (a tool returns instructions).
- **Instruction/data separation**: delimit untrusted content explicitly (tags, quoting); instruct 
the model to treat delimited regions as data only. Helps against naive attacks; not foolproof.
- **Least privilege**: the model and its tools get minimal authority — read-only where possible, 
confirmation gates for writes, no access to secrets it doesn't need. Injection without authority is 
just weird text.
- **Output validation**: check the model's planned actions against policy before executing — 
allowlisted operations, schema validation, human confirmation for consequential steps. Don't trust; 
verify.
- **Detection**: classifiers and heuristics flagging suspicious inputs (instruction-like language 
in data fields); logging for post-hoc review. Imperfect but useful as one layer.
- **Defense in depth**: no layer is sufficient alone. Combine: separation + least privilege + 
validation + monitoring. Assume bypass; limit blast radius.

## Practical workflow

1. Map the threat surface: every untrusted input the model sees — user text, retrieved docs, 
webpages, tool outputs, file uploads.
2. Apply least privilege first: what can the model/tools do if fully hijacked? Shrink that to the 
minimum.
3. Structure inputs: delimit untrusted content; keep system instructions separate and minimal.
4. Validate outputs: schema-check tool calls, allowlist actions, require confirmation for 
irreversible operations.
5. Add monitoring: log inputs/outputs (redacted), alert on anomalous tool use or policy violations.
6. Test adversarially: try the attacks yourself (or via red-teaming) before attackers do — then 
fix what breaks.

```text
Defense layers (apply all):
1. LEAST PRIVILEGE — minimal tools, scoped data, no secrets in reach
2. SEPARATION — untrusted content delimited as data
3. VALIDATION — outputs checked against policy before action
4. CONFIRMATION — human gates on irreversible operations
5. MONITORING — logs + alerts on anomalous behavior
```

## Common pitfalls

- **"The system prompt says not to"**: instructions alone don't stop injection. Attackers read your 
defenses as suggestions.
- **Single-layer defense**: delimiters without least privilege, or detection without validation. 
Layer everything.
- **Over-privileged tools**: giving the agent delete/send/admin tools "for convenience." 
Convenience is the attack surface.
- **Trusting tool outputs**: treating retrieved content as safe. Tool outputs are the prime 
indirect-injection vector.
- **No monitoring**: attacks discovered by users, not by you. Log and alert from day one.
- **Assuming the model will "know"**: models follow injected instructions fluently and confidently. 
Never rely on model judgment as a security boundary.
