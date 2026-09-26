---
name: ecommerce-pro
description: Build e-commerce storefronts: product catalog, cart, checkout, payments, and post-purchase flows. Use for online stores and marketplaces.
category: web-development
---

# Ecommerce Pro

A practical guide to building e-commerce storefronts: product catalog and search, cart state, checkout flows, payment integration, and the post-purchase experience — plus the reliability details (inventory, taxes, fraud) that make or break stores.

## Overview

Ecommerce = **catalog → cart → checkout → payment → fulfillment**, with trust at every step. The frontend patterns are well-established; the differentiators are speed (every 100ms costs conversion), checkout friction (every field costs conversion), and correctness (inventory, pricing, taxes must be right). Build on proven commerce platforms/APIs for payments, tax, and shipping rather than hand-rolling.

## When to use

- Online stores (DTC, retail) and marketplaces.
- Headless commerce frontends (composable: CMS + commerce API + custom UI).
- Checkout optimization and payment integration.
- Subscriptions and digital products.

## Core concepts

- **Catalog.** Product types, variants (size/color matrices), SKUs, inventory levels, pricing (list/sale, currency, rounding). Search + filtering is the primary navigation — invest in it.
- **Cart.** Client state (fast, optimistic) reconciled with server truth (pricing, inventory, promotions). Persist across sessions; merge anonymous → authenticated carts on login.
- **Checkout.** Fewest steps possible: contact → shipping → payment → review. Guest checkout default; address autocomplete; saved payment methods for returning users.
- **Payments.** Stripe/PayPal/etc. via their SDKs: Payment Intents (SCA/3D Secure handled), webhooks for confirmation (never trust the client redirect alone), idempotency keys on charges.
- **Tax & shipping.** Tax providers (auto-calculate by jurisdiction); shipping rates by zone/weight; display early — surprise costs at checkout are the #1 abandonment cause.
- **Inventory.** Reserve on checkout start (with expiry), decrement on payment success, release on abandon. Overselling is worse than a slightly conservative reservation.
- **Post-purchase.** Order confirmation, email/SMS updates, tracking, returns portal. The experience after payment drives repeat purchase.

## Practical workflow

**1. Architecture.** Headless: commerce backend (platform or API) for products/orders/payments; your frontend for experience; webhooks syncing order state. Don't build your own payment processing.

**2. Product pages.**
- Fast images (multiple angles, zoom), variant selector updating price/availability instantly, stock indicators ("Only 3 left" when true), reviews, clear shipping/returns info.
- Structured data (Product schema with price/availability) for rich search results.

**3. Cart.**
```ts
// optimistic client cart, server-validated
async function addToCart(sku, qty) {
  optimisticAdd(sku, qty);                    // instant UI
  const cart = await api.cart.add(sku, qty);  // server truth: price, stock, promos
  reconcile(cart);                            // fix discrepancies, show notices
}
```

**4. Checkout.**
- Single page or 3-step max; progress indicator; inline validation; error recovery (don't wipe the form on failure).
- Payment: Stripe Elements / Payment Element → confirm on client → **webhook confirms on server** → fulfill. Handle 3D Secure redirects.
- Idempotency: retry-safe order creation (idempotency key per checkout session).

**5. Post-payment.** Webhook handler: verify signature → mark paid → decrement inventory → trigger fulfillment → send confirmation. Handle webhook retries (idempotent processing).

**6. Measure.** Funnel: product view → add to cart → checkout start → payment → success. Instrument each step; the biggest drop is your roadmap.

## Common pitfalls

- **Trusting client-side payment confirmation.** Redirects can be faked. Webhooks + signature verification are the source of truth for "paid".
- **No idempotency.** Double-clicks and retries creating duplicate charges/orders. Idempotency keys on every mutating commerce call.
- **Surprise costs.** Shipping/tax revealed at the last step = abandonment. Show estimates early (even approximate).
- **Inventory races.** Two buyers, one item. Reserve with expiry; handle oversell gracefully (backorder option, not silent cancellation).
- **Forced account creation.** Guest checkout first; offer account creation *after* purchase (one click, prefilled).
- **Slow product pages.** Image-heavy PDPs are conversion killers when slow. Optimize images, lazy-load below-fold, keep LCP tight.
- **Promo/discount bugs.** Stacking, expired codes, rounding errors — test the promotion matrix; it's where money leaks.
- **Ignoring mobile checkout.** Majority of traffic, highest friction. Thumb-friendly, autofill-friendly, wallet payments (Apple/Google Pay) prominent.
- **No failed-payment recovery.** Declined cards need clear messaging + easy retry (save the cart, don't restart checkout).
- **Tax nexus ignorance.** Selling across jurisdictions without tax calculation = compliance liability. Use a tax provider; don't guess.
