---
name: ruby-pro
description: Idiomatic Ruby: OOP design, blocks/enumerables, Rails conventions, RSpec testing, and performance awareness. Use when writing, reviewing, or structuring Ruby applications.
category: development
---

# Ruby Pro

## Overview

Ruby rewards **expressiveness and convention**: code should read like a description of intent,
and the ecosystem's conventions (Rails especially) encode decades of collective judgment. Professional
Ruby means embracing blocks and enumerables, designing small objects with clear messages, following
Rails conventions instead of fighting them, and testing behavior with RSpec.

The through-line: optimize for developer happiness *and* maintainability — expressive code that's
still obvious to the next reader.

## When to use

- Writing or reviewing Ruby code for idiom and design.
- Structuring Rails applications (models, services, jobs).
- Choosing between Ruby idioms (blocks, enumerables, metaprogramming).
- Setting up RSpec testing, linting (RuboCop), and CI.
- Debugging performance or memory issues in Ruby.

## Core concepts

- **Everything is an object; messages over mechanics.** Design small objects that respond to clear
  messages. Prefer telling objects what to do over asking for their data (`order.ship!` not
  `if order.status == :paid then ship(order)`). Duck typing: depend on behavior, not class.
- **Blocks and Enumerables are the language.** `map`, `select`, `reduce`, `each_with_object`,
  `group_by` — reach for these before `while`/`for` loops. Custom iteration via `yield` and
  `Enumerator` for lazy/streaming data. If you're writing a `for` loop in Ruby, stop.
- **Rails conventions are load-bearing.** Fat-model→skinny evolution: start with models, extract
  service objects/form objects/query objects when models bloat. RESTful routes, strong parameters,
  ActiveRecord scopes for reusable queries, background jobs (Sidekiq) for slow work.
- **Metaprogramming: powerful, rarely needed.** `define_method`, `method_missing`, DSLs — the
  magic that makes Rails beautiful and debugging hell. Rule: metaprogramming must make call-site
  code *clearer*, and it must be tested and documented. Clever `method_missing` without tests is
  a landmine.
- **Testing with RSpec.** Describe behavior, not implementation: `describe`/`context`/`it` with
  clear language; `let`/`subject` for setup; factories (FactoryBot) over fixtures; test the public
  interface. Fast unit specs for POROs, request specs for endpoints, system specs sparingly for
  critical journeys.
- **Performance pragmatism.** Ruby is not the fastest runtime — so: avoid N+1 (eager load),
  memoize expensive computations (`@x ||= …` with care for false/nil), use `find_each` for large
  collections, push heavy work to background jobs, and profile (`rack-mini-profiler`, `rbspy`)
  before optimizing.

## Practical workflow

1. **Scaffold with conventions.** Rails: standard layout; plain Ruby: `lib/` + `spec/`, gemspec or
   Gemfile, RuboCop with a sensible config from day one.
2. **Write expressive, small methods.** One level of abstraction per method; early returns over
   nested conditionals; predicate methods (`paid?`, `shippable?`) that read like English.
3. **Keep models/services focused.** When a model exceeds ~150 lines or a method needs "and" to
   describe, extract: service objects for workflows, query objects for complex finds, value objects
   for domain concepts (Money, Email).
4. **Test behavior.** Unit-test POROs and service objects fast; request-spec the API surface;
   keep system specs to the critical journeys. Run the fast suite constantly, full suite in CI.
5. **Harden data access.** Strong params at the boundary, database constraints (not just model
   validations — validations race), transactions for multi-write operations, indexes for query
   patterns.
6. **Review for Ruby smells:** `for` loops, `then` chains, methods over ~10 lines, classes over
   ~150 lines, `method_missing` without `respond_to_missing?`, N+1 queries, logic in views.

Idiomatic snippets:

```ruby
# Enumerables over loops; predicate methods; safe navigation
def overdue_invoices(customers)
  customers.flat_map(&:invoices)
           .select(&:overdue?)
           .sort_by(&:due_date)
end

# Service object: one public method, clear contract
class ChargeCustomer
  def self.call(order, payment_method)
    new(order, payment_method).call
  end

  def call
    validate! && gateway.charge(amount_cents, payment_method) && order.mark_paid!
  end
  # ...
end
```

## Common pitfalls

- **Monkey-patching core classes.** Reopening `String`/`Array` with custom methods pollutes every
  dependency. Use refinements or plain modules instead — or don't.
- **Metaprogramming without tests.** Dynamic methods that fail mysteriously and can't be grepped.
  If you can't find it with search, it needs exceptional documentation and tests.
- **N+1 queries.** The eternal Rails performance bug. Eager load (`includes`), counter caches for
  counts, and watch the log in development.
- **Logic in views/helpers.** Business rules in ERB are untestable and unfindable. Views display;
  presenters/decorators shape; models/services decide.
- **God models.** `User` with 80 methods because "it's the domain." Extract by responsibility —
  the model should answer "what is a user," not "how does the entire business run."
- **Ignoring RuboCop.** Style debates in PRs waste everyone's time; automate the style, argue about
  design. But don't blindly obey every cop — disable with justification when the cop is wrong.
- **Rescuing `Exception` / bare `rescue`.** Catches `NoMemoryError`, `SignalException`, and bugs
  you need to see. Rescue specific errors; let the rest crash loudly.
