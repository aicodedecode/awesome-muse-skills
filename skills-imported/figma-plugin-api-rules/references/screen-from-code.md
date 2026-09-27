---
name: figma-plugin-api-rules/screen-from-code
description: Read when building/rebuilding a Figma screen from application code (React etc.) — role mapping, semantic grouping, the three-build-actions rule, grep-as-discovery, Mode Discovery / Build.
---

# screen-from-code — figma-plugin-api-rules

A code→Figma methodology: how to read an implemented screen and rebuild it in Figma without inventing components.

### role-mapping-not-pattern-matching
**Principle:** Map an element's ROLE to a DS component, not the DOM structure: the React tree ≠ the DS structure; "similar" markup can be a different component.
**Symptom:** the screen is assembled "by markup"; review finds components used off-purpose.

### semantic-grouping-before-lookup
**Principle:** First group the screen's elements into semantic blocks (header, entity card, actions), then look for DS components for the groups — not the other way round.

### three-build-actions-only
**Principle:** For every element exactly three permitted actions: instance-override / ds-update / new-component. A "native frame that looks similar" is a forbidden fourth category; if none of the three fits → stop and escalate to the user.

### grep-as-discovery-all-usages
**Principle:** Before mapping a component, collect a grep matrix of ALL its usages across the codebase (all states) — a mapping from one usage covers one state.

### mode-discovery-vs-mode-build
**Principle:** Separate Mode Discovery (inventory, no writes) and Mode Build (assembly) with explicit user checkpoints between them; don't mix them into one pass.

### code-layout-facts-not-just-slot-names
**Principle:** If the brief names a specific code file as the source of a region ("the header is a shared component with slots title/badgeSlot/action" etc.) — that's not only a list of named slots to fill; it's also layout facts that must be READ before assembly: flex-direction, `alignItems`/`justifyContent` (who is visually grouped with whom, who is aligned independently), `max-width`/truncation on text, gap/spacing, icon usage on buttons. A slot list without these facts is enough to know WHAT to assemble, but not HOW it should look.
**Symptom:** the assembly is structurally correct (all slots filled with the right content, no component violated) and yet visually diverges from the code in several places at once — not per node but per class of decisions (alignment, width, icon visibility) — because each of those decisions was taken from the EXISTING structure of the Figma master (which may have been designed for a different composition/count of children), not from the code.
**Pattern:** before assembly — read the JSX/CSS file itself (or the styled-component / CSS module behind it) for: (1) how many nesting levels the flex structure has and what is grouped with what (not one flat row if the code nests); (2) whether there's `max-width`/`overflow: hidden`/`text-overflow: ellipsis` on text; (3) which icons (import names) really render on buttons. The slot list from the brief is WHAT to assemble; these facts are HOW. Both are needed before the first write; the facts aren't gathered after the fact from a screenshot discrepancy.
