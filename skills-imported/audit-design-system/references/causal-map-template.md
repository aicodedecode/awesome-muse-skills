# Causal Map Template

Use this when the user asks why an element is used, how an element supports a product scenario, or what rule should be documented.

## Template

```md
# Causal Relationship

## Element
Name of component, pattern, token, variant, or state.

## Observed in
Pages, frames, flows, or nodes.

## Product scenario
What product context causes this element to appear.

## User intent
What the user is trying to accomplish.

## Interface decision
Why this UI solution is used instead of an alternative.

## Component or pattern implication
Whether this should become a component, variant, state, pattern, template, or local exception.

## Token implication
Current and proposed primitive, semantic, and component tokens.

## Design-system rule
The rule that should be documented.

## Evidence
Figma references and observed values.

## Confidence
High / medium / low.
```

## Example

```md
# Causal Relationship

## Element
Button / Primary

## Observed in
- Onboarding / Step 1
- Checkout / Payment
- Settings / Save changes

## Product scenario
The user is completing the main action in a decision area.

## User intent
Confirm the action and move forward.

## Interface decision
Primary CTA is visually dominant to reduce ambiguity and guide completion.

## Component or pattern implication
Create or normalize `Button / Primary` with default, hover, pressed, focus, disabled, and loading states.

## Token implication
- color.action.primary.bg.default
- color.action.primary.bg.hover
- color.action.primary.text
- component.button.container.radius.md
- component.button.container.padding.x.md

## Design-system rule
Use only one primary CTA per decision area. Secondary actions must have lower visual weight.

## Evidence
- Page: Checkout
- Frame: Payment / Desktop
- Node: Button / Primary
- Repeated usage: 12 instances

## Confidence
High
```
