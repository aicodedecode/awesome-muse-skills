---
name: audit-design-system
description: Analyze, audit, inventory, and document an existing Figma design system through the Figma MCP server — components, variables, tokens, patterns, design debt, usage rules, causal relationships — and create design-system documentation pages in Figma on request. Use when the user asks to audit, inventory, map, document, or find debt in a Figma file, page, frame, component set, or selection. Read-only by default; modify Figma only when the user explicitly asks. Not for designing or building screens — that is design-screens; not for repairing broken variable bindings — that is figma-fix-variable-bindings.
---
> Adapted for Muse from [schudarin/chudarin-design-skills](https://github.com/schudarin/chudarin-design-skills) (MIT) — plain-markdown portable unit. Claude Code-isms neutralized; any Figma MCP / write steps are kept as read-only reference knowledge.


# Figma Audit Design System

Use this skill to analyze real Figma files and help build a tokenized design system grounded in actual layouts, components, variables, and product flows.

## Operating mode

Work read-only by default.

You may inspect Figma files, pages, frames, components, instances, variables, screenshots, libraries, styles, layout structure, and usage patterns.

Do not create, edit, delete, rename, move, or reorganize Figma content unless the user explicitly asks to do so.

If the user asks to analyze, audit, find, compare, document, propose, or recommend, stay read-only.

If the user asks to create, add, insert, update, modify, rename, organize, or publish in Figma, you may use write-capable Figma MCP tools, but do not modify source product screens unless the user specifically asks.

Do not analyze codebase or Code Connect mappings in this version.

## Primary objective

Build design-system knowledge from evidence, not assumptions.

For every important finding, connect:

1. Product scenario
2. User intent
3. Interface decision
4. Component or pattern
5. Token dependency
6. Design-system rule
7. Evidence from Figma
8. Confidence level

## MCP workflow

When the user provides a Figma URL or selection:

Load `references/analysis-framework.md` at the start of any file audit — it carries the scope map, the file-map table, the inventory method and the P0–P3 prioritisation.

1. Determine the scope: file, page, frame, selection, component set, or flow.
2. Use Figma MCP tools to inspect metadata, design context, screenshots, variables, libraries, and existing components.
3. Build a file map.
4. Build a component inventory.
5. Build a token inventory.
6. Build a pattern inventory.
7. Detect repeated UI decisions and infer causal relationships.
8. Separate components, variants, states, patterns, templates, local exceptions, and design debt.
9. Recommend tokenization only when a value has repeatable semantic meaning.
10. Produce the requested output or prepare Figma documentation pages.

Use tools in this order when applicable:

1. `get_metadata`
2. `get_design_context`
3. `get_screenshot`
4. `get_variable_defs`
5. `get_libraries`
6. `search_design_system`
7. `use_figma` only after explicit write instruction — and only with your tool's own Figma API instructions (`figma-use`, or the MCP resource `skill://figma/figma-use/SKILL.md`) plus `figma-plugin-api-rules` loaded first

If a listed tool is unavailable in the current MCP server, use the closest available Figma MCP tool and state which expected data could not be inspected.

## Evidence rules

Do not make unsupported claims.

For each important conclusion, include:

- Figma page or frame
- Node or component name when available
- Observed value or variable
- Repeated usage count when available
- Screenshot reference when useful
- Confidence: high, medium, or low

Use confidence levels:

- High: three or more examples, plus component or variable evidence.
- Medium: two or three examples, with partial structure.
- Low: one example or insufficient MCP structure.

Label recommendations clearly. Do not present recommendations as existing facts.

## Classification rules

Classify every repeated UI element as one of:

- Primitive token
- Semantic token
- Component token
- Component
- Component variant
- Component state
- Pattern
- Template
- Local exception
- Design debt

A component candidate should be recommended only when it meets at least one condition:

- Appears in three or more places
- Has multiple states
- Has multiple variants
- Supports a critical product flow
- Is used across multiple product areas
- Has accessibility implications
- Should be governed centrally

## Component analysis

For each component or component candidate, document:

- Purpose
- Product scenarios
- User intent
- Anatomy
- Variants
- States
- Properties
- Token dependencies
- Accessibility requirements
- Usage rules
- Do and don't examples
- Examples from Figma
- Design debt
- Recommendations

Load `references/component-checklist.md` when documenting or auditing components — the spec structure, the required checks per interactive component, and the order to audit component families in.

Check states for all interactive components:

- default
- hover
- pressed
- focused
- disabled
- loading
- selected
- error
- success
- warning
- empty
- skeleton/loading where applicable

## Pattern analysis

Separate components from patterns and templates.

Use this distinction:

- Component: reusable UI unit with properties, variants, and states.
- Pattern: reusable solution to a user or product problem, often composed of several components.
- Template: page or layout structure for a type of screen.

Example:

- Input = component
- Search with filters = pattern
- Catalog page = template

Load `references/pattern-checklist.md` when the user asks for pattern analysis, product-flow analysis, or template recommendations.

## Tokenization methodology

Use three token layers:

1. Primitive tokens
2. Semantic tokens
3. Component tokens

Primitive tokens represent raw values.

Examples:

- `color.blue.500`
- `color.gray.900`
- `space.4`
- `space.8`
- `radius.md`
- `font.size.16`
- `shadow.1`
- `motion.duration.fast`

Semantic tokens represent interface roles.

Examples:

- `color.bg.canvas`
- `color.bg.surface`
- `color.text.primary`
- `color.text.secondary`
- `color.border.default`
- `color.border.focus`
- `color.action.primary.bg.default`
- `color.action.primary.bg.hover`
- `color.feedback.danger.bg`

Component tokens represent component-specific decisions.

Examples:

- `component.button.container.bg.primary.default`
- `component.button.container.bg.primary.hover`
- `component.button.label.color.primary.default`
- `component.input.border.color.error`
- `component.card.container.radius.default`

Do not create a semantic token only because a raw value repeats.

Create a semantic token when the value:

- Has a repeatable role
- Needs centralized governance
- Appears across multiple components or patterns
- Needs mode, theme, or brand switching
- Has accessibility implications
- Is likely to change as a design decision

Create component tokens only when the component needs independent control over variants, states, modes, or theming.

Avoid token names based on appearance:

- `blueButton`
- `grayText`
- `primaryBlue`
- `lightGray2`

Prefer role-based names:

- `color.action.primary.bg.default`
- `color.text.secondary`
- `color.border.focus`

Load `references/token-taxonomy.md` for detailed naming, variable structure, mode mapping, and token-decision rules.

## Figma Variables structure

When proposing Figma Variables, use this collection structure unless the user provides another standard:

- Primitive
- Semantic
- Component
- Typography
- Motion

Use modes when needed:

- Light
- Dark
- High contrast, if required

Use slash-style Figma variable names when appropriate:

- `color/bg/canvas`
- `color/text/primary`
- `color/action/primary/bg/default`
- `component/button/container/bg/primary/default`

## Causal relationship format

For repeated elements, produce this structure:

```md
## Element
Name of component, pattern, or token.

## Observed in
Pages, frames, flows, or nodes.

## Product scenario
What user or product context causes this element to appear.

## User intent
What the user is trying to accomplish.

## Interface decision
Why this UI solution is used.

## System implication
Whether this should become a component, variant, state, token, pattern, template, rule, or migration task.

## Tokens
Current and proposed tokens.

## Rule
The design-system rule to document.

## Evidence
Figma references and observed values.

## Confidence
High, medium, or low.
```

Load `references/causal-map-template.md` when the user asks why elements are used, how components relate to scenarios, or which rule should be documented.

## Figma documentation pages

When the user asks to create design-system documentation in Figma, create or propose this page structure:

- `00 Cover`
- `01 Principles`
- `02 Foundations`
- `03 Tokens`
- `04 Components`
- `05 Patterns`
- `06 Templates`
- `07 Accessibility`
- `08 Governance`
- `09 Migration Backlog`
- `99 Archive`

Do not modify product screens unless the user explicitly asks.

For documentation frames, use clear headings, tables, examples, and source references.

When the file already has documentation boards, they set the look of every new or rebuilt one. A
board shows itself by its make-up: a header with a title, text blocks next to component samples,
labelled rows of states or widths, a name or a page that marks it as documentation. Take their
header, text styles, colours, spacing and board width in full. A reference library the user points
to lends only the way of showing: which sections a board has, how states and widths sit side by
side, where the grid is drawn. Its styling is never copied over boards the file already has; one
board that looks different from its neighbours is a defect.

Load `references/figma-documentation-structure.md` before creating documentation pages in Figma.

## Default output

If the user does not specify a format, return:

1. Short summary
2. File map
3. Component inventory
4. Token inventory
5. Pattern inventory
6. Causal map
7. Design debt
8. Recommended Figma documentation structure
9. Prioritized next actions

If the user explicitly asks to create documentation in Figma, create Figma pages and frames instead of only responding in chat.

## Quality gates

Before finalizing recommendations, check:

- Similar elements use the same tokens.
- Component variants are not duplicates.
- States are complete for interactive components.
- Naming is consistent.
- Raw values are not used where semantic tokens are needed.
- Primitive, semantic, and component tokens are not mixed.
- Accessibility states are documented.
- Design debt is separated from intentional exceptions.
- Every major conclusion has evidence and confidence.

Load `references/accessibility-checklist.md` when the user asks for component specs, interactive states, or accessibility review.

Load `references/governance-rules.md` when the user asks how to maintain, version, approve, or evolve the design system.

## Do not

- Do not modify Figma unless explicitly asked.
- Do not analyze codebase or Code Connect in this version.
- Do not invent components without labeling them as recommendations.
- Do not treat every repeated value as a token.
- Do not create components from one-off layout details.
- Do not ignore existing variables, styles, libraries, or components.
- Do not present guesses as facts.
- Do not overwrite or restructure product screens without explicit permission.
