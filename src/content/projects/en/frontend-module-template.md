---
title: Frontend module template
summary: "A starter repository: linters, tests, CI, module boundaries and agent rules out of the box."
lead: The starter repository every new frontend module begins from. All the boring parts are already configured, agent rules included.
kind: library
aside: maintaining
period: since 2025
order: 5
role:
  - { text: author, accent: green }
stack:
  - TypeScript
  - React 19
highlights:
  - { label: linters, tests, CI, accent: green }
  - { label: agent rules, accent: gold }
---

## the problem

Every new module started the same way: a week of configs, linters, tests and CI, and every time the result was a little different. Different rule versions meant review behaved differently in different repositories.

## what I did

Built a template where types, linters, formatting, tests and the pipeline are already set up. Module boundaries are enforced by import rules rather than by verbal agreement.

Added a rules file for AI agents: where the layers live, what may be touched, which command checks the result. An agent starting work in such a repository does not reinvent the structure.

## what turned out to be hard

A template ages quietly. We had to schedule a regular review, otherwise, six months in, it hands out stale practices with exactly the confidence of current ones.
