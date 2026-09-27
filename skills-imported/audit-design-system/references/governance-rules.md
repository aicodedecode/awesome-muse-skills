# Governance Rules

Use this reference when the user asks how to maintain, version, approve, or evolve the design system.

## Change types

Classify changes as:

- Patch: typo, documentation clarification, non-breaking variable description.
- Minor: new component, new variant, new semantic token, additive documentation.
- Major: renamed token, removed token, changed semantic meaning, removed component, changed component behavior.

## Approval rules

Require review for:

- New semantic or component tokens.
- New public component variants.
- Any change that affects accessibility.
- Any change that affects product screens across multiple flows.
- Deprecation or migration proposals.

## Component lifecycle

Use statuses:

```txt
proposed
experimental
ready
stable
deprecated
removed
```

## Token lifecycle

Use statuses:

```txt
proposed
active
deprecated
removed
```

Every deprecated token must include:

- Replacement token
- Affected components or screens
- Migration deadline or priority
- Reason for deprecation

## Before a new component exists at all

A request for a new component is answered by this gate, in order, and a "yes" anywhere above stops
the process:

1. **Can the existing feature be changed** so it satisfies the new requirement *and* still satisfies
   the old ones? Then change it — there is no new component.
2. **Can the existing component be extended** — a variant, a property — so it meets the new
   requirement while continuing to meet the current ones? Then extend it.
3. **Is the need supported by evidence** — research, usage data, a repeated request — rather than by
   one screen's convenience? Without evidence, the answer is not yet.
4. **Can the new component be made general enough to be used everywhere** it would apply? A
   component that fits exactly one screen is that screen's local layout, not a system component.
5. **Will it stay general** as the product grows, or does it encode a decision that is about to
   change?

Recording which question stopped a request is as useful as the answer: it is the evidence the next
person needs when they ask for the same thing.

## Contribution workflow

1. Identify need from product work.
2. Check existing components, patterns, and tokens.
3. Document evidence and usage count.
4. Propose addition or change.
5. Review with design-system owner and implementation stakeholders.
6. Add documentation and examples.
7. Publish change with changelog.
8. Track adoption and migration.

## Changelog format

```md
## Version x.y.z - YYYY-MM-DD

### Added
- New tokens/components/patterns.

### Changed
- Updated rules, variants, or values.

### Deprecated
- Items that should no longer be used and replacements.

### Removed
- Removed items.

### Migration notes
- Required updates to existing files or screens.
```
