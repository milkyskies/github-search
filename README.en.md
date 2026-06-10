English | [日本語](README.md)

# GitHub Repository Search

Search GitHub repositories, browse the results, and open any repository's detail page (owner, language, stars, watchers, forks, issues). Built with Next.js 16.

Live demo: <https://github-search-theta-one.vercel.app>

> A take-home built with a production mindset. This README focuses on the engineering decisions; visual design was out of scope, but readability and ease of use were not.

## Features

- Keyword search against the GitHub REST API (`GET /search/repositories`), shown as a results list with infinite scroll.
- Detail page (a real route, not a modal) for any result: repository name, owner avatar, language, and Star / Watcher / Fork / Issue counts.
- Routed `ja` / `en` localization and light / dark / system theming.

## Stack

- Next.js 16 (App Router, Turbopack, React Server Components)
- TypeScript, Tailwind CSS v4, Base UI (unstyled primitives)
- next-intl: routed `ja` / `en` internationalization
- next-themes: light / dark / system
- Biome (lint + format), Vitest + Testing Library + MSW (unit), Playwright (e2e), Storybook (component workshop)
- pnpm

## Getting started

### Prerequisites

- Node 24+ and pnpm 11+ (or [`mise`](https://mise.jdx.dev); `mise install` reads `mise.toml`)

### Install

```bash
pnpm install
```

### Environment (optional)

```bash
cp .env.example .env
```

`GITHUB_TOKEN` is optional: the app runs unauthenticated, just at lower GitHub API rate limits. See `.env.example`.

### Run

```bash
pnpm dev
```

Open <http://localhost:3000> and you'll be redirected to `/ja` or `/en` based on your browser language.

### Tests & Storybook

```bash
pnpm test          # unit tests (Vitest + MSW); use pnpm test:watch for watch mode
pnpm test:e2e      # Playwright e2e: builds the app, runs it against a mock GitHub server
pnpm storybook     # component workshop at http://localhost:6006
```

The e2e suite starts its own servers on `:3000` / `:4000`, so stop any running `pnpm dev` first; otherwise Playwright reuses your dev server (which hits the real GitHub API) instead of its mock-backed build.

## Scripts

| Command                         | What it does                  |
| ------------------------------- | ----------------------------- |
| `pnpm dev`                      | Dev server                    |
| `pnpm build` / `pnpm start`     | Production build / serve      |
| `pnpm lint` / `pnpm fmt`        | Biome check / write           |
| `pnpm typecheck`                | Route types + `tsc --noEmit`  |
| `pnpm test` / `pnpm test:watch` | Vitest                        |
| `pnpm test:e2e`                 | Playwright                    |
| `pnpm storybook`                | Component workshop on `:6006` |

## Design decisions

The points I focused on, aiming for a production-ready implementation.

### Architecture

- Data is fetched in Server Components, so `GITHUB_TOKEN` never reaches the client; the app also works unauthenticated, just at lower rate limits.
- I use the native `fetch` rather than a client library like Octokit or axios. It pulls in no extra dependencies (Octokit alone is 16 packages / 7.3 MB; axios is one more package to trust, audit, and patch), and, importantly in Next.js, the framework augments the global `fetch` with the Data Cache, `revalidate`, and cache tags, which an axios or Octokit call would bypass entirely. Neither library gives the runtime validation I want anyway, so I wrap `fetch` in a small client that parses with zod and returns typed results.
- The data layer is split into a generic transport (`GithubClient.request(path, schema)`) and a domain API (`GithubService.searchRepositories(...)`), so the HTTP and parsing mechanics live in one place and call sites read as plain domain operations.
- The wire is validated by a hand-written zod schema rather than a generated one (orval / `@octokit/openapi-types`): the official OpenAPI spec is megabytes for the two endpoints and seven fields I actually use, so a focused schema is both leaner and more resilient, validating only what I read and stripping everything else.
- The app uses the GitHub REST API as the brief specifies, which surfaces a subtle trap: REST's `watchers_count` is aliased to the star count, so the Watcher count is read from `subscribers_count` on the detail endpoint; the obvious field would be wrong.

### Use of Next.js

- Server Components keep the data layer entirely server-side, with zero client JS for fetching.
- Server Actions (`"use server"`) drive both the infinite-scroll pagination and the cache-busting retry.
- Streaming with `<Suspense>` shows a skeleton while results load, and keeps the previous results on screen during a new search instead of flashing back to a skeleton.
- The Data Cache (`revalidate`) plus cache tags and `updateTag` (Next 16) give the retry read-your-own-writes freshness.
- `generateMetadata` and `generateStaticParams` provide per-locale titles/SEO over statically known locales.
- `error.tsx` / `not-found.tsx` route conventions handle failure states, `next/image` optimizes avatars, and `next/font` self-hosts fonts with no layout shift.
- Middleware handles locale routing, `React.cache()` dedupes per-request fetches, and the build runs on Turbopack.

### Code style

- No classes for data: functions are grouped as objects-of-closures (a resource's API is one PascalCase namespace object), and mutation is avoided.
- Strict typing throughout: no `as` casts outside trusted boundaries (JSON, env), no non-null `!`, no `any`; the absent case is always narrowed or handled explicitly.
- Domain states are discriminated unions consumed with an exhaustive `switch` on the tag plus a `never` default, so an unhandled case is a compile error, my stand-in for pattern matching.
- The GitHub data layer returns failures as a typed `Result` union: rate-limit, network, timeout, and parse errors are values, not thrown exceptions, and no library error (`ZodError`, a fetch throw) leaks past that boundary.
- Domain models are pure `readonly` types; the zod schema and its transform live at the boundary (`github.schema.ts`), not on the model, and that boundary is where wire `null` becomes domain `undefined`, so the domain never juggles two kinds of "absent."
- i18n message keys are type-safe (a missing or mistyped key is a compile error), backed by a `ja` / `en` catalog-parity test; together these make the types themselves a test that catches whole classes of bugs before runtime.
- Functions read in phases (setup → validate → work → return) separated by blank lines, magic values are named `UPPER_SNAKE_CASE` constants, and filenames are verbose kebab-case with no barrel (`index.ts`) files, giving one canonical, greppable path per symbol.

### Caching

- GitHub responses are cached in the server Data Cache (`revalidate`), and the retry busts that cache via a tag + `updateTag` so it genuinely re-fetches instead of re-serving the stale error.
- Avatars are cached aggressively: their URLs are content-versioned (`?v=N`), so I set `minimumCacheTTL` to 31 days and let the URL act as the cache-buster.

### Usability

- Infinite scroll prefetches eagerly so browsing feels seamless, showing a spinner only when you out-scroll the prefetch, with `overscroll-contain` so a fast flick stops cleanly at the end.
- Transient errors (rate-limit, network) show the actual cause plus a retry button, instead of a dead-end message.
- The layout is responsive and mobile-first: the results panel and the four-up stat grid adapt down to small screens.

### Security

Supply-chain attacks on npm and GitHub Actions have become routine (compromised maintainer accounts publishing malicious releases, action tags silently re-pointed at hostile code), so the dependency and CI posture is treated as a production concern, not an afterthought.

- A minimal dependency surface is the first line of defense: preferring the platform (`fetch`, `Intl`, `Headers`) over libraries means fewer packages, and fewer packages means fewer ways in.
- Dependabot runs with a cooldown, so a freshly published release is not pulled in for a day, enough time for a compromised version to surface before it ever reaches the lockfile.
- GitHub Actions are pinned to commit SHAs rather than moving tags, so a re-pointed tag (the tj-actions class of attack) cannot swap malicious code into CI.
- Every PR is scanned: OSV-Scanner for known-vulnerable dependencies and zizmor for insecure workflow patterns.
- At the app level: a strict Content-Security-Policy plus the full security-header set (HSTS, X-Frame-Options, Referrer-Policy, Permissions-Policy, X-Content-Type-Options), and the GitHub token stays server-only, never in the client bundle.

### Testing & CI

- Tests run in two tiers: unit tests for the logic (with the HTTP boundary mocked via MSW) and Playwright e2e against a real production build that talks to a mock GitHub server with deterministic knobs (`__ratelimit__`, `__empty__`, `__failmore__`).
- The tests target real logic (the error classifier, the result dedupe, the view-state mapping) rather than library passthrough or framework glue.
- User-facing behavior is documented as Gherkin-style spec docs in [`docs/test/`](docs/test/) ([search](docs/test/search.md) and [detail](docs/test/detail.md)) with stable `SEARCH-NNN` / `DETAIL-NNN` codes linked to the tests that automate them.
- Visual components have Storybook stories, test descriptions are written in Japanese to match the product, and CI gates every PR (lint · typecheck · test · build · e2e) alongside security scans (OSV-Scanner, zizmor).

## Project structure

```
src/
├── app/[locale]/        Routes (thin shells); root layout is a passthrough
├── features/            UI by domain (search, repo-detail, shared)
├── services/github/     GitHub REST client (transport + operations)
├── models/              Domain types
├── config/              Env access (server-only)
├── i18n/                next-intl routing + request config
├── proxy.ts             Locale-routing middleware (Next 16)
└── lib/                 Generic utilities (cn, formatters)
```

## AI usage

This project was built with Claude Code, working against the conventions in `.claude/rules/`. The collaboration was deliberately human-steered and commit-by-commit: I made the architectural calls and reviewed every change before it landed.

My conventions are codified, not re-explained each session. I maintain a reusable rule set in `.claude/rules/` that I carry across all my projects: coding style (no classes, exhaustive `switch`/`never`, errors-as-values, naming, blank-line phasing), the testing strategy, the commit / branch / PR workflow, and config & security conventions. The agent works against these, so its output matches my standards rather than generic defaults, and reviewing is mostly checking adherence instead of re-teaching taste.

How I used it. Work was tracked as GitHub issues (via [ghlobes](https://github.com/milkyskies/ghlobes)), one feature per branch with a PR and CI per issue. The agent implemented each chunk (components, the GitHub client, the test suites) and ran the quality gates; I reviewed each commit, ran `/simplify` and `/code-review` passes on the larger changes, and only merged once green.
