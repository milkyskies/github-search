# 1d-kadai — GitHub Repository Search

Search GitHub repositories, browse the results, and open a repository's detail page (owner, language, stars, watchers, forks, issues). Built with Next.js 16 (App Router).

This repository ships the **same app in two editions** — see [Two editions](#two-editions).

## Stack

- **Next.js 16** (App Router, Turbopack, React Server Components)
- **TypeScript**, **Tailwind CSS v4**, **Base UI** (unstyled primitives)
- **next-intl** — routed `ja` / `en` internationalization
- **next-themes** — light / dark / system
- **Biome** (lint + format), **Vitest** + Testing Library + MSW (unit), **Playwright** (e2e), **Storybook** (component workshop)
- **pnpm**

## Getting started

### Prerequisites

- Node 24+ and pnpm 11+ (or [`mise`](https://mise.jdx.dev) — `mise install` reads `mise.toml`)

### Install

```bash
pnpm install
```

### Environment (optional)

```bash
cp .env.example .env
```

`GITHUB_TOKEN` is optional — the app runs unauthenticated, just at lower GitHub API rate limits. See `.env.example`.

### Run

```bash
pnpm dev
```

Open <http://localhost:3000> — you're redirected to `/ja` or `/en` based on your browser language.

## Scripts

| Command | What it does |
|---|---|
| `pnpm dev` | Dev server |
| `pnpm build` / `pnpm start` | Production build / serve |
| `pnpm lint` / `pnpm fmt` | Biome check / write |
| `pnpm typecheck` | Route types + `tsc --noEmit` |
| `pnpm test` / `pnpm test:watch` | Vitest |
| `pnpm test:e2e` | Playwright |
| `pnpm storybook` | Component workshop on `:6006` |

## Two editions

The same product, built twice to contrast two architectural philosophies. Only the **data layer** differs; the UI and behavior are identical.

| | **Standard** | **Opinionated** |
|---|---|---|
| Branch | `main` | `opinionated` |
| Style | Idiomatic Next.js + functional TypeScript | Effect-TS (clean architecture) |
| Errors | Discriminated-union tagged types | `Data.TaggedError` |
| Parsing | zod | `@effect/schema` |

Both fetch from the GitHub **REST** API in Server Components (the token never reaches the client). The full rationale for each choice will live in `docs/introduction.md`.

## Project structure

```
src/
├── app/[locale]/        Routes (thin shells); root layout is a passthrough
├── features/            UI by domain (search, repo-detail, shared)
├── services/github/     GitHub REST client (Standard edition)
├── models/              Domain types
├── config/              Env access (server-only)
├── i18n/                next-intl routing + request config
└── lib/                 Generic utilities (cn, formatters)
```

## Internationalization

Routed locales (`/ja`, `/en`) with type-safe message keys (a compile error on a missing/typo'd key) and a test asserting `ja` / `en` catalog parity.

## AI usage

Built with [Claude Code](https://claude.com/claude-code), working against the conventions in `.claude/rules/`. The collaboration was deliberately **human-steered and commit-by-commit**: the author made every architectural decision (the two editions, REST over GraphQL, the Effect/Standard split, i18n, error handling), and the agent implemented and verified each chunk — every commit reviewed before it landed. A fuller report (workflow, where the agent excelled, where it needed correcting) is expanded in `docs/introduction.md` at completion.
