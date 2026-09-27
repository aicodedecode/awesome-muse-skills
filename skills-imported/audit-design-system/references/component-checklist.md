# Component Checklist

Use this reference when documenting or auditing components.

## Component qualification

Recommend a component when at least one condition is true:

- Appears in three or more places.
- Has multiple states.
- Has multiple variants.
- Supports a critical product flow.
- Is used across multiple product areas.
- Has accessibility implications.
- Needs centralized governance.

## Component spec structure

```md
# Component: Name

## Purpose
What task this component solves.

## Product scenarios
Where and why it appears.

## User intent
What the user is trying to do.

## Anatomy
Parts and slots.

## Variants
Visual or behavioral variants.

## States
Default, hover, pressed, focused, disabled, loading, selected, error, success, warning, empty.

## Properties
Figma component properties and recommended API-like properties.

## Tokens
Primitive, semantic, and component token dependencies.

## Accessibility
Keyboard behavior, focus, contrast, target size, screen-reader notes.

## Usage rules
When to use and when not to use.

## Examples from Figma
Pages, frames, nodes, screenshots.

## Design debt
Duplicates, missing states, inconsistent values, detached instances.

## Migration notes
What existing layouts need to change.
```

## Required checks for interactive components

- Default state exists.
- Hover state exists for pointer platforms.
- Pressed/active state exists.
- Focus-visible state exists.
- Disabled state exists and remains legible.
- Loading state exists if action can take time.
- Error/success/warning states exist when relevant.
- Touch target is appropriate for the platform.
- Label is not replaced by icon alone unless accessible name is documented.

## Common component families

Audit these first:

- Button
- Icon button
- Link
- Input
- Textarea
- Select
- Checkbox
- Radio
- Switch
- Tabs
- Navigation item
- Card
- Modal/dialog
- Drawer
- Tooltip
- Popover
- Alert/toast
- Badge/tag
- Table
- Pagination
- Search
- Filter controls
- Date/time controls
- Empty state
- Skeleton/loading
