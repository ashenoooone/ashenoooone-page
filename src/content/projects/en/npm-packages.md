---
title: Auth and promo npm packages
summary: Internal libraries used by four teams. Versioning, migrations, backward compatibility.
lead: Two internal libraries that four products stand on. The real work here is not the code but the promise that an upgrade breaks nothing.
kind: library
aside: maintaining
period: since 2023
order: 4
role:
  - { text: author and maintainer, accent: green }
team:
  - 4 consumer teams
stack:
  - TypeScript
  - React 19
  - Node.js
highlights:
  - { label: 4 consumer teams, accent: green }
  - { label: semver and codemods, accent: gold }
---

## the problem

Authentication and promo mechanics repeated in every product, slightly differently each time. Identical bugs were fixed four times over, and every new integration started by copying somebody else's code.

## what I did

Extracted the shared parts into two packages with explicit public interfaces: exactly what the teams need is exported, everything else is closed. Versioning follows semver, and changes go through a changelog people actually read.

Every major version ships with codemods and a migration guide. An upgrade takes an evening rather than a sprint, and it does not block product releases.

## what turned out to be hard

Backward compatibility is expensive. The urge to "just fix the signature" has to be suppressed constantly: any convenience for the author is paid for with the time of four teams.
