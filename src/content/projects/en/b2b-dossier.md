---
title: SmartInfo
summary: Nineteen sources folded into one report in thirty seconds instead of an hour of manual work. Heavy pages, analytical reports, an in-house design system.
teaser: Nineteen sources folded into one report in thirty seconds. Bundle down 62% after leaving MUI.
lead: "A lawyer used to walk nineteen registries by hand, forty-five minutes on a good day. We brought that down to thirty seconds, and rewrote the whole frontend along the way: UI stack, store and architecture."
kind: product
aside: 2022–24
period: 2022–2024
order: 3
role:
  - { text: frontend developer, accent: blue }
  - { text: owner of the frontend architecture, accent: rust }
team:
  - 2 frontend
  - 2 backend
  - QA
  - team lead
stack:
  - Next.js 13.5
  - React 18.2
  - TypeScript 5.3
  - Redux Toolkit 1.9
  - RTK Query
  - axios 1.3
  - axios-cache-interceptor
  - Tailwind 3.3
  - Radix UI
  - class-variance-authority
  - tailwind-merge
  - react-hook-form 7.44
  - react-intersection-observer
  - immer 10
  - nanoid 4
  - js-cookie 3
  - react-toastify 9
  - Jest
  - React Testing Library
  - Storybook
  - ESLint
  - Prettier
  - Husky
  - Docker
  - GitHub Actions
highlights:
  - { label: −62% bundle, accent: rust }
  - { label: 19 sources, accent: gray }
---
## the project

The service vets an individual counterparty across nineteen open sources: state registries and legally available databases, from the federal bankruptcy registry and tax service data to the self-employment registry and public verification lists. The same class of problem that SPARK or Casebook solve, shaped for a lawyer's workflow. Before it, every registry was opened by hand and one report cost forty-five to ninety minutes. By the end of the period the system served around forty client companies with a hundred and twenty branches, two hundred and fifty active users, at roughly a thousand reports a day.

## what I did

**One contract for all sources.** Fixed a single response shape with the backend and built a set of renderers on top: sections, field groups, tables, error states. A new source is wired up by extending a type, a failing one renders locally: fully failed reports dropped from 18% to under 1%.

**Leaving MUI.** Moved the key sections onto Tailwind and removed MUI entirely, covering accessibility with Radix primitives. The bundle fell from 480 to 180 KB gzipped: FCP 2.4 → 1.1 s, LCP 3.8 → 1.6 s, TTI 5.2 → 2.3 s.

**Our own UI base.** Built 33 components in `shared/ui` on top of Radix and Tailwind, variants through `class-variance-authority`, 57 Storybook stories. A new developer reached their first merged PR in three to five days.

**Feature-Sliced Design.** Laid the project out in layers: every source became an entity module with its own types, model and UI, and heavy aggregators moved into `pages-composite`. Refactored module by module without pausing product work and pinned the dependency rules in the linter config.

**Dynamic Redux modules.** Wrote a `ReducerManager` and a `DynamicModuleLoader`: reducers register on page mount and drop on unmount, removal is deferred. Seven modules left the global store and permanently active state shrank by 30%.

**Two-level API caching.** Cached GET requests at the axios level with a 60-second TTL and put RTK Query with tag-based invalidation on top, keeping reference data longer via `keepUnusedDataFor`. Redundant GET traffic on hot endpoints dropped by about 55%.

**The extended request settings form.** Cascaded the fields from the report type down to the customer's branches. One component covers both creating a request and editing a submitted task from history; switching the report type does not wipe what was entered, the data is filtered at submit.

**The analytical report.** Built four grouping modes with their own totals: flat list, days, months and a two-level month → day. Moved aggregation into memoised `reselect` selectors and render the heavy table body through `useDeferredValue`.

**Project infrastructure.** Set up ESLint and Prettier with shared rules, Husky on pre-commit, Jest, Storybook and Docker. Code style and failing tests stopped being a topic for review.
