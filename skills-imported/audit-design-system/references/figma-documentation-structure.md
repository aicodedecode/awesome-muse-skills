# Figma Documentation Structure

Use this reference before creating or proposing design-system documentation pages in Figma.

## Page structure

Create or propose these pages:

```txt
00 Cover
01 Principles
02 Foundations
03 Tokens
04 Components
05 Patterns
06 Templates
07 Accessibility
08 Governance
09 Migration Backlog
99 Archive
```

Do not modify source product screens unless the user explicitly asks.

## 00 Cover

Include:

- Design-system name
- Version
- Date
- Scope analyzed
- Source pages/flows
- Status: draft, review, approved

## 01 Principles

Include:

- Product principles
- Visual principles
- Interaction principles
- Accessibility principles
- Naming principles
- Tokenization principles

## 02 Foundations

Include:

- Color system
- Typography
- Spacing
- Grid/layout
- Radius
- Elevation/shadow
- Iconography
- Motion

## 03 Tokens

Include three tables:

| Primitive token | Value | Type | Notes |
|---|---|---|---|

| Semantic token | References | Role | Modes |
|---|---|---|---|

| Component token | References | Component | State |
|---|---|---|---|

## 04 Components

For each component create sections:

- Purpose
- Anatomy
- Variants
- States
- Properties
- Tokens
- Usage
- Do / Don't
- Accessibility
- Examples from real Figma frames

## 05 Patterns

For each pattern include:

- Scenario
- User intent
- Components used
- Layout rules
- Interaction rules
- Examples
- Anti-patterns

## 06 Templates

Include:

- Page templates
- Layout zones
- Responsive behavior
- Composition rules

## 07 Accessibility

Include:

- Focus states
- Keyboard behavior
- Contrast
- Target size
- Error handling
- Motion reduction
- Non-color-only meaning

## 08 Governance

Include:

- How to add a component
- How to change a token
- How to add a variant
- How to deprecate a component
- Review/approval rules
- Versioning
- Changelog

## 09 Migration Backlog

Use table:

| Priority | Finding | Source | Recommendation | Effort | Impact |
|---|---|---|---|---|---|

## Write-to-Figma protocol

Before writing, ensure the user explicitly asked to create or modify Figma content.

Allowed write actions after explicit request:

- Create documentation pages.
- Create documentation frames.
- Add analysis tables and text blocks.
- Add source references.

Do not alter product screens unless the user explicitly asks.
