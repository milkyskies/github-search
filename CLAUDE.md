# 1d-kadai

A GitHub repository search app, built as **two editions of the same product**:

- **Standard** (`main`) — idiomatic Next.js 16 + functional plain TypeScript.
- **Opinionated** (`opinionated` branch) — the same app re-architected with Effect-TS (clean architecture, `Schema`, tagged errors, `Match`).

Stack: Next.js 16 (App Router, Turbopack) · TypeScript · Tailwind v4 · Base UI · pnpm · Biome. Data comes from the GitHub REST API, fetched server-side.

@AGENTS.md

Coding rules load automatically from `.claude/rules/` — follow them. Process uses the milky-kit flow (`glb` issues, worktree + PR per feature issue).

## Project-specific

### Filenames and modules

- Every file we author is **lowercase kebab-case**, with dots for sub-typing: `repo-card.tsx`, `repo-card.stories.tsx`, `repo-card.test.tsx`.
- **No `index.ts` barrel files** — one canonical path per thing; grep resolves to the real file, no re-export indirection.
- Exceptions — Next.js framework-contract files keep their mandated names: `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`, `route.ts`, `middleware.ts`, `instrumentation.ts`, `next.config.ts`.

### Architecture

- **Standard** (`main`): `app/` (thin route shell) + `features/{search,repo-detail,shared}/` + `services/github/` + `models/` + `lib/` + `config/`. Functional throughout — free functions over class methods, no classes for data, discriminated-union result types with `switch` + `never` exhaustiveness, no mutation.
- **Opinionated** (`opinionated`): `app/` (presentation adapter — pages run use cases) + `domain/` + `application/use-case/` + `infrastructure/`. Follows `effect.md` (added on that branch; it supersedes the plain-TS style rules there).
- Both editions keep an **identical `features/` UI tree** — only the data layer differs, so the branch diff reads as "same app, two philosophies."

### Data

- GitHub **REST** API: `GET /search/repositories` (search) and `GET /repos/{owner}/{repo}` (detail).
- **"Watcher数" uses `subscribers_count`** from the detail endpoint — REST's `watchers_count` is aliased to the star count and would be wrong.
- Fetched in **Server Components** so the `GITHUB_TOKEN` never reaches the client. Caching: `revalidate` on Standard, `cacheComponents` + `use cache` on Opinionated.

### i18n and theming

- **next-intl**, routed (`/ja`, `/en`), **type-safe** via the `declare module "next-intl"` `AppConfig` augmentation plus a `ja`/`en` key-parity test. Language switcher is a Base UI `Select` **dropdown**.
- Dark mode via **next-themes** (class-based, no-flash, toggle).
