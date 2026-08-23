---
title: Food delivery web platform
summary: Next.js 15, the catalogue moved from SSR to ISR with a shared Redis cache, an in-house map for the whole geo funnel, live courier tracking, WebView for iOS, Android and Telegram.
teaser: Catalogue on ISR with a shared Redis cache, an in-house map for the whole geo funnel, live courier tracking, three WebViews.
lead: "The customer-facing site of a foodtech chain: catalogue, builders, checkout and courier tracking in one codebase: the browser, desktop and three WebViews."
kind: product
aside: 2024 →
period: since 2024
order: 1
role:
  - { text: frontend developer, accent: blue }
  - { text: owner of rendering and the geo module, accent: green }
team:
  - 3 frontend
  - 4 backend
  - 2 QA
  - designer
  - product manager
  - 2 team leads
stack:
  - Next.js 15
  - React 19
  - TypeScript
  - Redux Toolkit
  - Effector
  - WebSocket
  - Axios
  - Redis
  - Leaflet
  - React-Leaflet
  - SCSS Modules
  - Sass
  - PostCSS
  - Framer Motion
  - Embla Carousel
  - React Window
  - date-fns
  - Sentry
  - Webpack
  - Babel
  - Jest
  - React Testing Library
highlights:
  - { label: −45% TTFB, accent: rust }
  - { label: 3 WebView platforms, accent: blue }
---
## the project

The customer-facing site of a federal pizza chain is one of the main revenue channels: you pick a city, put an order together, choose delivery or pickup and then watch the courier. Anything that slows that path down shows up in the conversion rate immediately.

The project was already in production, but there was a fair amount of legacy inside. The catalogue was rendered with SSR, and every visit fired a heavy request for the full catalogue, and under peak traffic Node.js stopped keeping up. Dropping server rendering was not an option either: a noticeable share of orders comes from organic search. The second half of the problem was one application for four environments: the browser, desktop, WebView on iOS and Android, and Telegram.

## what I did

**Catalogue from SSR to ISR.** Moved the catalogue to ISR with revalidation and separate versions per delivery area and order type, and put the shared cache into Redis. TTFB dropped by 45%, LCP by 21%, FCP by 20%, and the stalls under peak traffic went away.

**Bundle of the key pages.** Moved rarely used pages and components into dynamic imports and set tree shaking up properly. The JS of the key pages shrank by 20–50%, up to 800 KB on some routes: −400 ms of TBT and −1–1.2 s of LCP.

**A map for the whole geo funnel.** Built the module as "core plus controls": a `Map` core over react-leaflet plus independent controls mounted per scenario. Address selection works by the centre of the map, and tiles come from our own server. One module covers delivery, pickup, restaurant selection and the courier route.

**Live courier tracking.** Hid WebSocket, WebView push and fallback polling behind one interface for updating the order and the route, with the backend choosing the channel. Updates merge into the store with a timestamp check so a stale event cannot overwrite a fresh one.

**Mobile and desktop in one codebase.** Split the platforms in Next.js `middleware`: the device type comes from the `user-agent`, pages are split file-based, business logic stays shared. Desktop shipped as a routing branch, with no second project and no separate release cycle.

**A bridge between web and native.** Collected scattered `window` access into one innersource package: a `NativeFacade`, environment auto-detection, adapters for iOS, Android, Telegram and the browser, and two-way events. QR scanning and authentication got browser fallbacks.

**Pizza and combo builders.** Moved restrictions, ingredient availability and price recalculation into a layer of pure functions, kept state in Redux Toolkit and drew the result on a canvas. Upselling became possible inside the card itself.

**A shared package for auth, the account area and promos.** Extracted the shared logic into a headless npm package: behaviour in the package, state, routing and UI composition on the host. The in-restaurant menu stopped lagging the site by six sprints, personal offers usage grew 2.5×, and OAuth via Yandex and VK came along with it.

**An architecture the linter enforces.** Moved layer and import rules into a separate npm package of custom lint rules and wired the checks into CI. A violation fails the pipeline and blocks the merge request.

**Tests where the money is.** Covered cart calculation, promo application and delivery conditions with unit tests, and walked the checkout steps end to end with integration tests through React Testing Library. Manual regression shrank and covered modules became safe to refactor.

**Mentoring and review.** I walk newcomers and colleagues from neighbouring teams through the architecture and unpack decisions in code review: people reach independent work sooner.
