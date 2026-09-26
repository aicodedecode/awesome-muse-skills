---
name: jailbreak-analysis
description: Analyze LLM jailbreak techniques defensively — how bypasses work, detection signals, and hardening strategies. Use for safety research and building more robust guardrails. Taxonomy and defense only; no bypass instructions.
category: ai-research
---

# Jailbreak Analysis (Defensive)

Jailbreaks are techniques that bypass a model's safety guardrails. Understanding how they work — 
structurally, not as recipes — is essential for building defenses, evaluating robustness, and 
doing safety research. This skill covers the taxonomy and the defense; it does not provide working 
bypasses.

## Overview

Jailbreaks exploit the gap between a model's capabilities and its guardrails: roleplay framing 
("pretend you're…"), instruction smuggling (hiding requests in encoded or translated text), 
multi-turn erosion (gradually shifting context), and automated search (algorithms that discover 
bypassing prompts). Defenses work at multiple levels: training (better alignment), input/output 
filtering, monitoring, and limiting what a jailbroken model can actually do. Analyze to defend — 
every technique below maps to a detection or hardening strategy.

## When to use

- Safety research: understanding the threat landscape for LLM deployments.
- Evaluating your system's robustness: testing whether guardrails hold.
- Building detection: recognizing jailbreak attempts in logs and inputs.
- Designing layered defenses for production LLM features.

## Core concepts

- **Technique taxonomy**: persona/roleplay framing, hypothetical scenarios, encoding/obfuscation 
(base64, translation, leetspeak), prefix forcing (making the model start compliantly), multi-turn 
context erosion, automated adversarial search. Know the shapes to recognize them.
- **Why they work**: guardrails are pattern-sensitive; jailbreaks shift the input distribution away 
from the patterns the guardrails learned. Capability generalizes better than refusal — that's the 
fundamental asymmetry.
- **Detection signals**: sudden persona shifts, encoded content, refusal-suppression phrases, 
multi-turn drift toward sensitive topics, repeated rephrasing after refusals. Log these; they're 
your early warning.
- **Defense layers**: aligned training (strongest, hardest to change), input classifiers, output 
monitors, and — critically — capability limitation (a jailbroken model with no dangerous tools 
is a contained problem).
- **Evaluation**: adversarial test suites measuring attack success rate per technique family. Track 
over model updates; new models need re-testing.
- **Responsible handling**: findings about specific bypasses go to the model provider through 
proper channels, not into public artifacts. Analyze privately; disclose responsibly.

## Practical workflow

1. Build an adversarial test suite organized by technique family — your own red-team cases, kept 
private.
2. Measure baseline: attack success rate per family against your system.
3. Harden in layers: input detection, output monitoring, and capability/tool limitations for the 
highest-risk actions.
4. Re-test after every model or system change; track success rates over time.
5. Monitor production: flag detection signals, review samples, feed findings back into the test 
suite.
6. Disclose new bypasses to providers responsibly; never publish working bypass techniques.

```text
Robustness review template:
SYSTEM:    <model + version + guardrails>
TESTED:    <technique families, N cases each>
RESULTS:   <attack success rate per family>
WEAKEST:   <highest-success family → harden first>
LAYERS:    <training / input / output / capability limits>
DISCLOSED: <provider notified of novel findings: Y/N>
```

## Common pitfalls

- **Publishing bypasses**: sharing working jailbreak techniques publicly. This is the bright line 
— analyze, don't arm.
- **Single-eval confidence**: testing once and declaring robustness. Jailbreaks evolve; testing 
must be continuous.
- **Filter-only defense**: relying on input/output filters while the model retains dangerous 
capabilities. Limit capabilities too.
- **Ignoring multi-turn**: testing single prompts while attacks erode over conversations. Test full 
dialogues.
- **No provider disclosure**: sitting on a novel bypass. Responsible disclosure protects everyone 
downstream.
- **Confusing capability with safety**: a model that refuses benchmarks but complies under framing 
isn't safe — it's untested.
