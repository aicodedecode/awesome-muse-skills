---
name: web-components-pro
description: Build framework-agnostic Web Components: custom elements, shadow DOM, templates, and design-system distribution. Use for shareable components across frameworks.
category: web-development
---

# Web Components Pro

A practical guide to Web Components: the browser-native component model — custom elements, shadow DOM, templates/slots — for building framework-agnostic components and design systems that work everywhere.

## Overview

Web Components are **platform primitives**: `customElements.define` registers a tag, shadow DOM encapsulates styles/markup, `<slot>` enables composition, and observed attributes drive reactivity. No framework needed; works in React, Vue, Angular, or plain HTML. The value proposition: **write once, use in any stack** — ideal for design systems serving multiple frameworks, or embeddable widgets.

The trade-off: the platform gives you components, not a framework — no built-in reactivity, templating, or state management. Libraries (Lit) fill the gaps ergonomically.

## When to use

- Design systems consumed by multiple frameworks.
- Embeddable widgets (chat bubbles, review widgets) for third-party sites.
- Framework-independent component libraries.
- Micro-frontend integration points (custom elements as the contract).

## Core concepts

- **Custom elements.** `class MyCard extends HTMLElement` + `customElements.define('my-card', MyCard)`. Lifecycle: `constructor`, `connectedCallback`, `disconnectedCallback`, `attributeChangedCallback` (+ `observedAttributes`).
- **Shadow DOM.** `this.attachShadow({ mode: 'open' })` — encapsulated DOM + styles. `mode: 'closed'` hides internals (rarely worth it; breaks testing/devtools).
- **Templates & slots.** `<template>` for clonable markup; `<slot>` for light-DOM composition (`<slot name="header">` + `<span slot="header">`). Shadow DOM styles don't leak; light DOM styles don't pierce (except CSS custom properties and `::part`).
- **Styling contract.** Custom properties (`--my-card-bg`) pierce shadow DOM — the theming API. `::part()` exposes named internals for deeper styling. Document both.
- **Attributes vs properties.** Attributes are strings (HTML-facing); properties can be anything (JS-facing). Reflect key state to attributes for CSS selectors (`:host([disabled])`) and declarative use.
- **Form association.** `ElementInternals` + `static formAssociated = true` — custom inputs participating in `<form>` (value, validation, disabled). Essential for form components.
- **Lit.** The pragmatic choice: `LitElement` adds reactive properties, efficient templating (`html\`\``), and declarative event handling over the raw APIs. Most production web components use Lit.

## Practical workflow

**1. With Lit (recommended).**
```ts
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('my-button')
export class MyButton extends LitElement {
  static styles = css`
    :host { display: inline-block; }
    button { background: var(--my-button-bg, #4f46e5); color: white;
             border-radius: var(--radius, 8px); padding: 0.5rem 1rem; }
    :host([disabled]) button { opacity: 0.5; }
  `;

  @property({ type: Boolean, reflect: true }) disabled = false;

  render() {
    return html`<button ?disabled=${this.disabled} @click=${this._onClick}>
      <slot></slot></button>`;
  }
  private _onClick(e: Event) {
    this.dispatchEvent(new CustomEvent('my-press', { bubbles: true, composed: true }));
  }
}
```
Note `composed: true` — events must opt in to cross shadow DOM boundaries.

**2. Framework interop.**
- React: custom elements work as tags; properties set via refs (React 19 improves this); events via `addEventListener` (lowercase) or wrappers.
- Vue/Angular: native support via config (`isCustomElement` / `CUSTOM_ELEMENTS_SCHEMA`).
- Test in each target framework — interop has edge cases (boolean attributes, event casing).

**3. Distribution.** Bundle as ES modules; publish per-component or barrel entry; document attributes/properties/events/slots/CSS parts like an API.

**4. Accessibility.** You're building raw elements — you own all semantics. Use `delegatesFocus`, proper roles, keyboard handling, and `ElementInternals` ARIA reflection. Or compose native elements inside shadow DOM (a `<button>` in shadow root is still a button).

## Common pitfalls

- **Rebuilding a framework.** Hand-rolling reactivity/diffing on raw custom elements = pain. Use Lit (or similar) unless the component is trivial.
- **Events not crossing shadow DOM.** Forgetting `composed: true` → parent never hears the event. Always set bubbles+composed for component events.
- **Styling black box.** No documented CSS custom properties/parts = consumers can't theme. Design the styling contract deliberately.
- **Attribute/property desync.** Setting property doesn't update attribute (unless reflected) and vice versa. Reflect stateful attributes; document the JS property API.
- **SSR gaps.** Shadow DOM + SSR needs declarative shadow DOM (`<template shadowrootmode>`); without it, components flash unstyled/upgraded. Plan SSR if SEO/first-paint matters.
- **Global registry collisions.** `customElements.define` throws on duplicate names. Prefix tags (`acme-button`); coordinate in micro-frontend settings.
- **Ignoring form participation.** Custom inputs that don't use form association break native form behavior (submit, validation, reset). Use `ElementInternals`.
- **A11y from scratch.** Native `<button>` gives keyboard/focus/role free; a div-in-shadow gives nothing. Compose native elements or implement the full pattern.
- **Bundle per component.** Each component importing Lit separately = duplication. Share the Lit dependency (external) across your component set.
