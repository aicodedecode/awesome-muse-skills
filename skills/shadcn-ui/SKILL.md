---
name: shadcn-ui
description: Build with shadcn/ui: component copying, theming, customization, and composition patterns. Use when using shadcn-style accessible components in React.
category: web-development
---

# shadcn/ui

A practical guide to shadcn/ui: the copy-paste component collection built on Radix primitives and Tailwind — installation, theming, customization, and composition patterns for accessible React interfaces.

## Overview

shadcn/ui isn't a package you install — it's **components you copy into your project** (`components/ui/button.tsx`) and own. Built on Radix UI primitives (accessible behaviors: focus management, keyboard nav, ARIA) styled with Tailwind and class-variance-authority (CVA) variants. The model: vendor the code, customize freely, no dependency updates breaking your components.

## When to use

- React apps needing accessible, customizable primitives (dialogs, dropdowns, forms, tables).
- Design systems bootstrapped from solid defaults.
- Teams that want ownership over component code (not a black-box library).
- Pairing with Tailwind CSS projects.

## Core concepts

- **Copy, don't install.** The CLI (`npx shadcn@latest add button`) copies source into your repo. You own it — edit freely, no version churn from upstream.
- **Radix primitives.** Unstyled accessible behaviors (Dialog, Popover, Select, Tabs...). shadcn adds the styling layer; Radix handles the hard a11y parts. Don't strip Radix out.
- **CVA variants.** `cva('base classes', { variants: { variant: { default: '...', destructive: '...' }, size: {...} }, defaultVariants })` — typed variant API per component.
- **`cn()` utility.** `clsx` + `tailwind-merge`: `cn('px-4', className)` merges conflicting Tailwind classes intelligently (later wins). Always accept and merge `className`.
- **Theming.** CSS variables in `globals.css` (`--background`, `--primary`, ...) + `tailwind.config` mapping. Swap the variable set for a new theme; dark mode via `.dark` class variables.
- **`components.json`.** CLI config: paths, aliases (`@/components`), style, RSC/Tailwind version flags. Commit it.

## Practical workflow

**1. Init.**
```bash
npx shadcn@latest init   # sets up components.json, cn(), globals.css theme
npx shadcn@latest add button dialog input form table
```

**2. Use with variants.**
```tsx
import { Button } from '@/components/ui/button';

<Button variant="destructive" size="sm" onClick={...}>Delete</Button>
```

**3. Compose, don't fork.** Extend via `className` and composition:
```tsx
// Good: compose
<Dialog>
  <DialogTrigger asChild><Button>Open</Button></DialogTrigger>
  <DialogContent><MyForm /></DialogContent>
</Dialog>

// Avoid: copying button.tsx into button2.tsx for one tweak — use variants/className
```

**4. Forms with React Hook Form.** The `form` component wires RHF + Zod: `<FormField control name render={({ field }) => <FormItem><FormLabel/><FormControl><Input {...field}/></FormControl><FormMessage/>}</FormItem>} />`.

**5. Theme.** Adjust CSS variables for brand colors; verify light + dark; keep contrast AA. Add new semantic variables (e.g., `--success`) following the existing pattern.

**6. Own the code.** Read the copied components — they're short. Customize deliberately; when upstream improves, port what you need manually (there's no auto-update, by design).

## Common pitfalls

- **Treating it as a dependency.** Trying to `npm update` shadcn — there's nothing to update. You own the files; upstream is a reference.
- **Stripping Radix.** Replacing primitives with divs "for simplicity" deletes keyboard nav, focus trapping, and ARIA. Keep Radix; style around it.
- **Not merging className.** Components that ignore the `className` prop can't be customized at usage sites. Always `cn(base, className)`.
- **Variant explosion.** Adding a variant per one-off usage. Variants are for the design system; one-offs use `className`.
- **Copy-paste drift.** 30 customized copies of button.tsx across features = forked design system. One canonical copy; extend via props.
- **Ignoring the CSS variables.** Hardcoding colors in components instead of theme variables breaks theming/dark mode. Use the tokens.
- **Missing CLI config.** `components.json` paths/aliases wrong → imports break. Verify aliases match tsconfig.
- **Form component misuse.** The shadcn `form` pieces assume RHF context — using `FormField` outside `<Form>` errors. Keep the nesting right.
