# Monetize with Stripe — go from app to charging money

The last mile of "idea → app that makes money": take the running VPS app and let
it charge for a subscription. This is the exact flow, hardened, with two ways to
run it.

## Requirement: an *activated* Stripe account

You need a Stripe account that has **completed activation** (business details +
bank account submitted and approved) so it can accept live charges. A brand-new
unactivated account can only use **test mode** — fine for building, but it can't
take real money. Check: Stripe Dashboard shows no "Activate your account" /
"Complete your profile" banner, and the **live**-mode toggle is available.

If the account isn't activated yet, you can build and fully test everything in
**test mode** now, and only the final go-live steps wait on activation.

### One legal entity, many products? Use a separate account per product

If this VPS app is one of several products you'll run under a single company,
**give each product its own Stripe account** under one **Organization** (Stripe
Dashboard → create an Organization, then add accounts to it) — *not* Stripe
Connect. Connect is for marketplaces paying out third parties; you just want clean
separation. Separate accounts mean each product has its own branding, payout
schedule, dispute history, and Radar rules, and **the customer never sees the
parent company name at checkout** — they see the product. One account shared
across many products entangles all of that and leaks the umbrella name onto every
receipt.

## Pick the mode (ask the user)

> **Do you want to hand me your Stripe secret key so I create the product,
> prices, and webhook myself — or do you want to click through the Stripe
> dashboard while I tell you exactly what to do and verify each step?**

| | **Full-auto (agent does it)** | **Manual (you click, agent verifies)** |
|---|---|---|
| Who creates objects | the agent, via `scripts/setup-stripe.sh` | you, in the dashboard |
| What the agent holds | your live secret key `sk_live_…` (powerful) | nothing — read-only checks only |
| Speed | one script call | a few minutes of clicking |
| Best for | you trust the agent + want it fast | you'd rather not expose `sk_live_` |

Both end in the same place: five values in `/etc/<app>/env` and a verified live
purchase. The **only** difference is who does the clicking and whether the agent
ever holds `sk_live_`. A live secret key can move money and read customer data —
if the user chooses full-auto they've accepted that; still never print it, never
put it in the repo, never leave it in shell history (the script reads it from a
mode-`0600` file, see below).

> **CLI key caveat.** The Stripe CLI's *live* key is often a **restricted** key
> (`rk_live_…`) that can read but not create. Full-auto object creation needs a
> full-access `sk_live_…` passed explicitly (`--api-key`). Reads (verifying a
> price, listing a webhook) work with the restricted key.

## What you're building (both modes)

1. **One product** (e.g. `<App> Pro`) with **two prices**: monthly and annual.
   Annual as the default cadence is kinder to the user (cheaper) and to your cash
   flow.
2. **One webhook endpoint** at `https://<domain>/api/stripe/webhook` listening to
   six events.
3. **Five env values** the app reads from `/etc/<app>/env`.
4. **An entitlement gate** in the app that unlocks paid features only while the
   subscription is paid-through.

### The five env values

```dotenv
STRIPE_SECRET_KEY=sk_live_…          # live secret key (Developers → API keys)
STRIPE_WEBHOOK_SECRET=whsec_…        # the webhook's signing secret
STRIPE_PRICE_MONTHLY_ID=price_…      # the $X/mo price
STRIPE_PRICE_ANNUAL_ID=price_…       # the $Y/yr price
AUTH_URL=https://<domain>            # used to build checkout return URLs
```

They live **only** in `/etc/<app>/env` (mode `0640`, `root:deploy`) — same rule as
every other secret in this skill. Never in the repo.

### The six webhook events

`checkout.session.completed`, `invoice.paid`, `invoice.payment_failed`,
`customer.subscription.created`, `customer.subscription.updated`,
`customer.subscription.deleted`.

Set the endpoint's **payload style = Snapshot** (the full event object your code
reads via `event.data.object`), not Thin.

## Full-auto mode

1. Have the user create a full-access **live** secret key (Dashboard → Developers
   → API keys → *Create secret key*, or reveal the default) and put it in a temp
   file **themselves** so it never passes through a tool call:
   ```bash
   ! umask 077; cat > /tmp/sk.txt   # paste sk_live_…, then Ctrl-D
   ```
2. Edit the `CONFIG` block in `scripts/setup-stripe.sh` (`PRODUCT_NAME`,
   `MONTHLY_CENTS`, `ANNUAL_CENTS`, `DOMAIN`) and run it. It creates the product,
   both prices, and the webhook endpoint, then prints the two `price_…` IDs and
   the webhook `whsec_…`.
3. `shred -u /tmp/sk.txt` when done.
4. Put the five values into `/etc/<app>/env` on the box (out-of-band, per the
   skill's Secrets rules), then deploy.

## Manual mode (you click, agent verifies)

Walk the user through the dashboard; the agent checks each result read-only.

1. **Product + prices** (Product catalog → Add product): name it `<App> Pro`, add
   a **$X/mo** recurring flat price and a **$Y/yr** recurring flat price under the
   one product. Category "General - Electronically Supplied Service" for SaaS tax.
   → Agent verifies: `stripe prices retrieve <id> --live` shows the right
   `unit_amount`, `interval`, and `livemode: true`.
2. **Webhook** (Developers → Webhooks → Add endpoint, **Live**): scope *Your
   account*, URL `https://<domain>/api/stripe/webhook`, the six events, payload
   style **Snapshot**. Reveal the **Signing secret** → `whsec_…`.
3. **Keys** (Developers → API keys): reveal the live **Secret key** → `sk_live_…`.
4. Map the results into the five env values (agent confirms which `price_…` is
   monthly vs annual from step 1), put them in `/etc/<app>/env`, deploy.

## The entitlement gate (app code — the part that actually locks features)

Two ideas do all the work: (1) a **webhook** that writes the customer's current
subscription state into SQLite, and (2) a pure **`isPaid()`** check the app calls
before serving paid features. Keep the webhook idempotent by *re-listing* the
customer's subscriptions on every event rather than trusting one event's payload —
replays and out-of-order delivery then converge on Stripe's truth.

```ts
// isPaid: single source of truth for "can this user use paid features?"
const GRACE_MS = 24 * 60 * 60 * 1000 // tolerate clock skew / retry lag
export function isPaid(status: string | null, paidThrough: Date | null, now = new Date()) {
  const ok = status === "active" || status === "trialing" || status === "past_due"
  return ok && !!paidThrough && paidThrough.getTime() + GRACE_MS > now.getTime()
}
```

```ts
// webhook: verify signature, re-list, persist current state. A tampered body 400s.
const event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET!)
const subs = await stripe.subscriptions.list({ customer: customerId, status: "all", limit: 100 })
const current = pickBestByStatus(subs.data)          // active > trialing > past_due > …
await db.update(users).set({
  stripeSubscriptionStatus: current?.status ?? "canceled",
  // only advance paidThrough on events that prove payment: invoice.paid,
  // checkout.session.completed (paid), or a trialing sub
  ...(advancesPaidThrough ? { stripePaidThrough: currentPeriodEnd(current) } : {}),
}).where(eq(users.stripeCustomerId, customerId))
```

**Checkout** creates (or reuses) a Stripe customer for the logged-in user, opens a
hosted Checkout Session for the chosen price, and returns to `AUTH_URL`. Use an
idempotency key on customer creation so a double-click doesn't make two customers.

### Grandfathering (do this BEFORE you ship the paywall)

If the app already has users, shipping a paywall **locks them all out** unless you
exempt them. Add a boolean and gate on it:

```sql
ALTER TABLE `user` ADD `grandfathered` integer DEFAULT false NOT NULL;
UPDATE `user` SET `grandfathered` = true;  -- everyone who exists at launch is free
```

```ts
const canUse = grandfathered || isPaid(status, paidThrough)
```

New signups keep the `false` default and must subscribe. Run the `UPDATE` in the
same migration that ships the paywall so there's no window where existing users
are locked out.

## Verify before real money

1. **Test-mode smoke** (test keys/prices in a local `.env`): sign up → buy with
   card `4242 4242 4242 4242` → confirm the account flips to paid and `invoice.paid`
   fires → cancel → confirm it flips back to locked. This proves the whole loop
   without touching money.
2. **Pin/watch the API version.** Note the API version your webhook is delivered on
   (shown on the endpoint). Snapshot payloads are rendered at that version; a big
   version jump can change field shapes.
3. **Live smoke:** after go-live, buy the real subscription once with a real card,
   confirm unlock, then **cancel/refund yourself** from the dashboard. Costs you
   pennies of processing and proves live works.
4. **Customer portal** (Settings → Billing): enable cancel-at-period-end and
   invoice history so users can manage their own subscription; link your
   `/terms`, `/privacy`, `/refunds` pages.

## Deploy note

The webhook route and entitlement code ship with the app via the skill's normal
deploy (`scripts/deploy.sh` for Path A, or in-place on the box for Path B). Only
the **five env values** are configured server-side in `/etc/<app>/env`. Add them,
then restart the service so the app picks them up.
