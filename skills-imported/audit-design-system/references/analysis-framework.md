# Analysis Framework

Use this framework for any Figma audit or design-system extraction task.

## 1. Scope map

Identify:

- File, page, frame, section, selection, flow, or component set.
- Product area and user journey represented by the selection.
- Existing local components, component sets, instances, variables, and libraries.
- Whether the user requested read-only analysis or explicit write-to-Figma action.

## 2. File map output

Return or create a compact map:

| Area | Figma source | Contents | Notes |
|---|---|---|---|
| Product flows | Page/frame names | Key screens | Main scenarios |
| Components | Component sets | Instances/variants | Missing states |
| Variables | Collections/modes | Color/type/space/radius | Token maturity |
| Design debt | Locations | Raw values/detached layers | Priority |

## 3. Inventory method

For each repeated element:

1. Capture source: page, frame, node/component name.
2. Count usage when possible.
3. Identify whether it is an instance, detached component, local layer group, or library component.
4. Record variables/styles used and raw values where visible.
5. Identify variants and states.
6. Classify as component, pattern, template, token, exception, or debt.
7. Add evidence and confidence.

## 4. Finding format

Use this format for important findings:

```md
## Finding
Short name.

## Evidence
- Page:
- Frame:
- Node/component:
- Observed value/variable:
- Usage count:

## Interpretation
What this means for the design system.

## Recommendation
What should be created, merged, renamed, tokenized, or documented.

## Confidence
High / medium / low.
```

## 5. Prioritization

Prioritize findings by:

1. User impact.
2. Frequency of use.
3. Accessibility risk.
4. Cross-product reuse.
5. Implementation effort.
6. Risk of breaking existing screens.

Use priority labels: `P0 critical`, `P1 high`, `P2 medium`, `P3 low`.
