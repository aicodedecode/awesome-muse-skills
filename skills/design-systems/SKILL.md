---
name: design-systems
description: Build and govern scalable design systems with tokens, components, documentation, and adoption strategy.
category: creative-design
---

## Overview

A design system is a product serving products: a shared language of tokens, components, and patterns
that lets teams ship consistent interfaces faster. But most design systems fail not on craft but on
adoption — they're built as monuments instead of tools. This skill covers building systems people
actually use: tokens, component architecture, documentation, and governance.

## When to use

- Starting a design system for a product or organization

- Auditing and consolidating inconsistent UI across products

- Defining design tokens (color, spacing, typography, elevation)

- Writing component documentation and usage guidelines

- Planning design system governance and adoption

## Core concepts

- - **Tokens are the contract.** Design tokens (color, spacing, type, radius, shadow) in a
  tool-agnostic format are the single source of truth that design tools and code both consume. Name
  semantically (action/primary/hover), not literally (blue-500).
- - **Components: build for the 80%.** A component should solve the common case beautifully and
  offer escape hatches (slots, props) for the rest. Over-abstracted components that try to cover
  everything become unusable.
- - **Documentation is the product.** A component without usage guidance, do/don't examples, and
  accessibility notes won't be adopted correctly. Write docs for the consumer (product
  designer/dev), not for yourself.
- - **Adoption beats completeness.** A system with 15 well-adopted components beats one with 80
  nobody uses. Ship the highest-traffic components first; expand based on real demand.
- - **Governance prevents entropy.** Who can add components? What's the contribution process? How
  are breaking changes handled? Without answers, the system forks into team-specific variants within
  a year.
- - **Measure what matters.** Adoption rate (% of screens using system components), contribution
  velocity, time-to-design/ship, and design-dev consistency issues. Report these to leadership —
  systems need ongoing investment.

## Practical workflow

1. 1. **Audit the current state.** Inventory existing UI: screenshot common patterns, catalog
   inconsistencies, count button variants in the wild. The audit justifies the investment and scopes
   the work.
2. 2. **Define tokens first.** Color (semantic roles + scales), spacing (4/8pt base scale),
   typography (scale + roles), radius, elevation, motion. Document naming conventions before
   building anything.
3. 3. **Prioritize the component backlog.** Rank by usage frequency × inconsistency pain. Buttons,
   inputs, and navigation almost always come first. Build in small, shippable batches.
4. 4. **Build components properly.** Each gets: all states (default, hover, focus, disabled, error,
   loading), sizes, theming via tokens, accessibility baked in (focus rings, ARIA roles, contrast),
   and responsive behavior.
5. 5. **Write the docs.** For each component: when to use / when not to, anatomy, variants, content
   guidelines, accessibility notes, and code + design usage. Include live examples, not just
   pictures.
6. 6. **Set up governance.** Contribution model (who proposes, who reviews, who approves),
   versioning and changelog discipline, deprecation policy, and a regular system review cadence.
7. 7. **Drive adoption.** Migrate high-traffic surfaces first, provide codemods or migration guides,
   run office hours, celebrate contributors. Track adoption metrics and report wins.

## Common pitfalls

- - **Building the cathedral.** Spending a year perfecting 100 components before anyone uses them.
  Ship early, iterate with consumers.
- - **No dedicated ownership.** A design system as everyone's side project becomes nobody's
  priority. It needs named owners with real time allocated.
- - **Pixel-perfect, adoption-zero.** Craft without distribution. If designers find it easier to
  draw custom buttons, the system has failed regardless of its quality.
- - **Breaking changes without migration paths.** Renaming tokens or restructuring components
  without codemods and warnings destroys trust. Version carefully; deprecate gracefully.
- - **Documentation as an afterthought.** Undocumented components get misused, which erodes the
  consistency the system exists to create.
- - **One system to rule them all (prematurely).** Forcing a single system across wildly different
  products (marketing site + complex app) creates components that serve nobody well. Sometimes two
  systems with shared tokens is right.
