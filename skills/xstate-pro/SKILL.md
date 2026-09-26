---
name: xstate-pro
description: Model state with XState state machines: actors, guards, actions, hierarchical and parallel states. Use for complex UI flows, workflows, and anywhere boolean flags multiply.
category: development
---

# XState Pro

A practical guide to XState (v5): modeling application logic as **state machines and statecharts** — explicit states, events, transitions, guards, and actions — plus the actor model for communicating machines. For anywhere boolean flags (`isLoading`, `isError`, `isOpen`...) multiply into impossible combinations.

## Overview

Most UI bugs are **impossible states**: `isLoading && isError`, a form that's both submitting and editable, a player that's playing and paused. State machines eliminate them by construction: the machine is in exactly one state, and only declared transitions move it. XState adds hierarchy (nested states), parallelism (orthogonal regions), guards (conditional transitions), and actions (side effects) — the full statechart formalism — with TypeScript inference over states and events.

## When to use

- Multi-step flows: wizards, checkout, onboarding, auth (idle → loading → success/error).
- Complex components: data fetching with retry, media players, editors with modes.
- Workflows and sagas: order processing, background jobs with states.
- Replacing sprawling `useReducer` or flag-soup `useState`.
- Visualizing/debugging logic (machines can be diagrammed and model-tested).

## Core concepts

- **Machine.** `setup({ types, actions, guards }).createMachine({ id, initial, context, states })` — states, `on: { EVENT: target }` transitions, `context` (extended state: data, not control state).
- **Events.** `{ type: 'SUBMIT' }` (+ payload). Everything that happens is an event — user actions, timers, promise resolutions. Never mutate; send events.
- **Transitions.** `on: { RETRY: 'loading' }`, guarded: `SUBMIT: { guard: 'isValid', target: 'submitting' }`, with actions: `actions: 'notifyUser'`.
- **Actions.** `assign` (update context), `sendTo`/spawning actors, custom actions. Actions are declarative descriptions — testable without running effects.
- **Guards.** `guard: ({ context, event }) => ...` — conditions on transitions. Keep pure.
- **Hierarchical states.** `editing: { initial: 'idle', states: { idle: {}, saving: {} } }` — nested machines with inherited transitions.
- **Parallel states.** `type: 'parallel'` regions for orthogonal concerns (e.g., `ui: {...}` + `data: {...}` simultaneously).
- **Actors.** `createActor(machine)` — running instances; actors communicate via messages. `useActor`/`useMachine` in React.
- **Invoked services.** `invoke: { src: 'fetchUser', onDone: ..., onError: ... }` — promises/observables as states, not `useEffect` chains.

## Practical workflow

**1. Model before coding.** Draw states on paper: what are the modes? What events move between them? What's impossible? The diagram is the design review.

**2. Define the machine.**
```ts
import { setup, assign } from 'xstate';

const formMachine = setup({
  types: { context: {} as { error?: string }, events: {} as { type: 'SUBMIT' } | { type: 'RETRY' } },
  guards: { isValid: ({ event }) => validate(event) },
}).createMachine({
  id: 'form',
  initial: 'editing',
  states: {
    editing: { on: { SUBMIT: { guard: 'isValid', target: 'submitting' } } },
    submitting: {
      invoke: { src: 'saveForm', onDone: 'success', onError: { target: 'editing', actions: assign({ error: ({ event }) => event.error.message }) } },
    },
    success: { type: 'final' },
  },
});
```

**3. Use in React.**
```tsx
import { useMachine } from '@xstate/react';
const [state, send] = useMachine(formMachine, { input: {...} });
state.matches('submitting'); // explicit, no flag soup
<button onClick={() => send({ type: 'SUBMIT' })} disabled={!state.can({ type: 'SUBMIT' })}>
```

**4. Test the logic.** Machines are pure data — assert transitions without rendering: `actor.send({type:'SUBMIT'}); expect(actor.getSnapshot().value).toBe('submitting')`. Model-based testing can even generate paths.

**5. Visualize.** Paste into the Stately visualizer during design reviews — stakeholders understand diagrams better than code.

## Common pitfalls

- **Context as control state.** `context: { mode: 'loading' }` duplicates what states express. States = control flow; context = data. If you're branching on context values, you probably need states.
- **Missing transitions.** Unhandled events are silently ignored — usually correct, occasionally a bug. During dev, log unhandled events to catch typos.
- **Actions with side effects inline.** `assign` and pure actions are testable; stuffing fetch calls into actions makes machines untestable. Side effects → invoked services or actors.
- **Over-modeling.** A two-state toggle doesn't need a machine. Reach for XState when states × events gets beyond what you can hold in your head (~4+ states or tricky transitions).
- **Guard impurity.** Guards reading mutable externals make transitions unpredictable. Guards see `(context, event)` — keep them pure.
- **Forgetting `input`.** v5 machines take `input` for initialization; stuffing init data into context defaults couples machine to one use.
- **Parallel region explosion.** Parallel states multiply combinations — use for genuinely orthogonal concerns, not as a grouping convenience.
- **Not using `state.can()`.** Disabling buttons via ad-hoc flags reintroduces the flag soup. `state.can(event)` is the machine answering "is this allowed now?"
