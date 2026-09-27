# Accessibility Checklist

Use this checklist for component specs, interactive states, and design-system quality gates — that
is, for auditing a file that already exists.

**The design-time twin** is `design-screens/references/ux/accessibility.md`: the same ground
stated as rules to follow while a screen is being drawn. When a rule changes there, change the
question here too.

## Core checks

- Text contrast is sufficient for normal and large text.
- Non-text UI indicators such as borders, icons, focus rings, and selected states have sufficient contrast.
- Focus-visible state is present and not hidden by custom styling.
- Keyboard order follows visual and logical order.
- Interactive targets are large enough for the platform.
- Color is not the only way to communicate meaning.
- Error states include text or structural indicators, not color alone.
- Disabled content remains understandable where needed.
- Motion is avoidable or reducible for users with reduced-motion preferences.
- Icon-only controls have accessible names documented.

## Component-specific prompts

For buttons:

- Is there exactly one primary action per decision area?
- Are destructive actions visually distinct and separated from safe actions?
- Is loading state announced or represented clearly?

For inputs:

- Is there a persistent label or documented accessible label?
- Are error, helper, and required states clear?
- Does focus state remain visible?

For modals/dialogs:

- Is focus trapped inside the dialog?
- Is there a clear close action?
- Is the title programmatically identifiable?

For alerts/toasts:

- Is severity communicated by text/icon as well as color?
- Are critical messages persistent enough to read?

## Documentation requirement

Every interactive component spec should include:

- Keyboard behavior
- Focus behavior
- Contrast requirements
- Target size guidance
- Screen-reader notes if relevant
