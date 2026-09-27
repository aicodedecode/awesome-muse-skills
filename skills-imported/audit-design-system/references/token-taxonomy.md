# Token Taxonomy

Use this reference for token audits, token proposals, and Figma Variables planning.

## Token layers

### Primitive tokens

Primitive tokens are raw, brand-neutral or brand-specific values. They do not describe UI intent.

Examples:

```txt
color.blue.50
color.blue.500
color.gray.900
space.4
radius.md
font.size.16
font.weight.600
shadow.1
motion.duration.fast
```

Use primitives as the source of truth for base values. Do not attach product semantics to primitive names.

### Semantic tokens

Semantic tokens describe interface roles and user-facing meaning.

Examples:

```txt
color.bg.canvas
color.bg.surface
color.text.primary
color.text.secondary
color.text.disabled
color.border.default
color.border.focus
color.action.primary.bg.default
color.action.primary.bg.hover
color.feedback.danger.bg
```

Semantic tokens should answer: what role does this value serve?

### Component tokens

Component tokens describe component-specific decisions when a component needs independent control.

Examples:

```txt
component.button.container.bg.primary.default
component.button.container.bg.primary.hover
component.button.label.color.primary.default
component.input.border.color.error
component.card.container.radius.default
```

Create component tokens only when semantic tokens are not enough for stable theming, variants, modes, or state control.

## Figma Variables collections

Default collections:

```txt
Primitive
Semantic
Component
Typography
Motion
```

Default modes:

```txt
Light
Dark
High contrast, if required
```

Use slash naming in Figma when it improves navigation:

```txt
color/bg/canvas
color/text/primary
color/action/primary/bg/default
component/button/container/bg/primary/default
```

Use dot naming in documentation, JSON, and exported token references:

```txt
color.bg.canvas
color.text.primary
component.button.container.bg.primary.default
```

## Token decision rules

Create a token when the value:

- Repeats with the same role.
- Must be governed centrally.
- Appears in multiple components or patterns.
- Needs light/dark, brand, platform, or high-contrast modes.
- Has accessibility implications.
- Is likely to change as a design decision.

Do not create a token when the value:

- Is a one-off exception.
- Has no repeatable semantic meaning.
- Exists only because a layer was manually styled once.
- Would create a misleading semantic name.

## A token names where it may be used

A semantic token carries a permitted surface set, not just a role. "Interactive object" means
buttons and controls — and explicitly *not* icons, body text or page backgrounds, even though the
colour would technically work there. Scope in Figma (`variable.scopes`) is where this is enforced;
the taxonomy is where it is decided.

Contrast makes the same point sharper: specific steps of a ramp can be forbidden on specific
surfaces. Where a mid-ramp step fails contrast on white, the token documentation says "use the next
step down on light surfaces" rather than leaving each designer to discover it. A rule of that kind
belongs next to the token, not in someone's memory.

| Token | Permitted surfaces | Forbidden |
|---|---|---|
| `color.action.primary.bg` | buttons, interactive containers | icons, body text, page background |
| `color.feedback.success.*-500` | filled indicators on neutral surfaces | text or icons on white — use the darker step |

## Anti-patterns

Avoid:

```txt
blueButton
grayText
primaryBlue
lightGray2
buttonColor1
```

Prefer:

```txt
color.action.primary.bg.default
color.text.secondary
color.border.focus
color.feedback.danger.text
```

## Token proposal table

Use this format:

| Raw value | Current style/variable | Proposed token | Layer | Role | Evidence | Confidence |
|---|---|---|---|---|---|---|
| #0057ff | Blue/500 | color.action.primary.bg.default | Semantic | Primary CTA background | Checkout, Onboarding | High |
