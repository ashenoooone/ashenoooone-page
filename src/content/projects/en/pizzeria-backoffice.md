---
title: Pizzeria chain back office
summary: "React/Vite modules of the promo domain inside a legacy PHP monolith: coupons, personal offers, a step-by-step campaign launch, RBAC with data scope, realtime statuses."
teaser: "Coupons, personal offers and a step-by-step campaign launch: React/Vite modules inside a legacy PHP monolith."
lead: "The internal OMS of a federal chain: a marketer launches a promotion, an operator handles orders, a franchisee sees only their own restaurants. New modules went in as React inside a live PHP monolith, without taking it down."
kind: product
aside: 2024 →
period: since 2024
order: 2
role:
  - { text: senior frontend developer, accent: blue }
  - { text: owner of the promo-domain frontend, accent: green }
team:
  - 3 frontend
  - 4 backend
  - 2 QA
  - designer
  - product manager
  - 2 team leads
stack:
  - React 18
  - TypeScript
  - Vite
  - React Router
  - TanStack Router
  - TanStack Query
  - Zustand
  - React Hook Form
  - Axios
  - GraphQL
  - WebSocket
  - React Window
  - Radix UI
  - Tailwind CSS
  - SCSS Modules
  - Playwright
  - Vitest
  - Jest
  - React Testing Library
  - MSW
  - PHP
  - jQuery
  - Backbone
highlights:
  - { label: SPA inside a PHP monolith, accent: gold }
  - { label: permissions and data scope, accent: green }
---
## the project

The back office is the internal OMS of a federal pizza chain: catalogue, prices, promotions, coupons, delivery settings, customers, support tickets, reports. Its users are internal and very different: marketers, operators, support, administrators, analysts and franchisees. The more an employee can do on their own, the fewer tasks land on engineering.

Technically it is a legacy monorepo of PHP and JavaScript: old PHP templates, jQuery and Backbone screens, and newer React/Vite modules side by side. Rewriting the monolith outright was off the table: it worked and it earned. New promo-domain modules had to live inside it, with an architecture of their own but on the monolith's authentication, config and layout.

## what I did

**React modules inside the monolith.** Went with an island approach: PHP serves the root element, React mounts and runs as a standalone SPA with its own routing. The config is read from runtime page variables, authentication runs end to end through an interceptor. The approach became the default for new promo-domain modules.

**A coupon module from scratch.** Built a separate React/Vite SPA: a list with filtering, pagination, bulk selection and filters synced to the URL, step-by-step coupon creation, CSV export, and a Staff API integration. Loading, empty, error and no-permission states were treated as first-class.

**A personal offers module from scratch.** Collapsed audience calculation, campaign launch and settings into one module with statuses, filters, bulk actions and modal launch flows. Launching a promotion got 2–3× faster.

**A step-by-step launch with cross-step validation.** Moved the cross-step rules into a layer of their own and re-run them when a dependent field changes rather than on submit. Server errors map onto the specific field of the specific step, and one machine covers both promotions and coupon campaigns.

**RBAC with data scope.** Built one permission layer: a typed permission dictionary, a `can(...)` helper, a `Can` component and access checks on routes. Data scope is derived from the profile and mixed into request parameters automatically, so a franchisee only ever sees their own restaurants.

**Realtime statuses without losing UI state.** Moved the WebSocket client into the shared layer, validate incoming payloads with type guards and update the TanStack Query cache pointwise by `id`. Filters, search, selected rows and open modals survive an update, and polling takes over if WebSocket is unavailable.

**Virtualising the product tree.** Flattened the catalogue tree into a list of visible rows on React Window, recomputed on expand, search and selection changes, preserving nesting, order and the current interface state.

**Integrating an external GraphQL employee service.** Built a select with cursor-based loading and server-side search inside the cache key, plus a batch resolve of unique `employee_id`s for lists. GraphQL errors arrive with HTTP 200 in an `errors` field, so I turn them into exceptions explicitly.

**Shared packages for the promo domain.** Built `@promo/shared` (a UI kit on Radix UI and Tailwind, around 25 components, shared hooks, axios instances, a config layer, style tokens) plus separate `@promo/eslint-config` and `@promo/tsconfig`. A fix in a shared component reaches every module at once.

**Inventory: recalculating discrepancies.** Normalised the "warehouse → category → item" tree into a flat `byId` structure with indexes, moved the calculation into memoised selectors and added a "discrepancies only" filter with a total row. Typing on thousands of items stopped lagging.

**E2E and mocks.** Described MSW handlers with different data states (`empty`, `error`, `access denied`, working statuses) and set up Playwright on top: filters, audience calculation, launching promotions, permissions. Realtime is checked with a WebSocket stub and cross-user sync with several browser contexts.

**A formalised architecture and a module template.** Collapsed the requirements for back-office frontend modules into one skeleton: an agreed stack, a layer structure, a linter and a type check. New submodules and refactors start from a ready template, structural violations are caught by CI. The template lives in [its own repository](/en/projects/frontend-module-template).

**An AI-assisted development flow.** Described the rules for agents inside the repositories: context files with the architecture and conventions, skills and subagents for recurring tasks. Development speed grew by roughly 20% in story points per sprint.
