# Project notes

Working notes for 1d-kadai — the conventions ("kodawari"), decisions, and follow-ups. Kept in-repo so context survives across sessions.

## Conventions / kodawari

These are non-negotiable for this project (and reflect milky-kit, which is the author's codified taste — follow kit conventions rigorously).

### Code style

- **Near-zero comments.** Default is *no comment*. Don't narrate code, don't explain standard idioms, don't add "valid WHY" comments. Only keep a comment if removing it would cause a genuine, non-obvious mistake. Prefer naming/structure.
- **Functional.** Free functions over class methods; no classes for data; **objects-of-closures over classes** ("classes introduce unneeded stuff — keep it simple"). Immutable `readonly` data, no mutation. Discriminated unions + `switch (x.kind)` with `never` exhaustiveness. `map`/`filter`/`reduce` over imperative loops.
- **Defined errors everywhere.** Never throw bare `Error`/strings; never let a library error leak (no raw `ZodError`, no thrown fetch). Standard edition: discriminated-union tagged types (`{ kind: "rateLimited" | ... }`). Opinionated edition: `Data.TaggedError`. Wrap library failures into a defined error *at the boundary*.
- **Named constants.** Magic numbers/strings → `UPPER_SNAKE_CASE` consts at the **top of the file** (e.g. `DEFAULT_TIMEOUT_MS`, `PER_PAGE`, `ACCEPT_HEADER`). Derived/computed module values (e.g. `baseUrl = getEnv(...) ?? DEFAULT_BASE_URL`) stay camelCase.
- **PascalCase namespace objects.** The object grouping a resource's functions is PascalCase: `export const Github = { searchRepositories }`, `export const Post = { make, fromApi }`. **Blank line between methods.** Filename stays lowercase-kebab.
- **Blank lines (kaigyou).** Separate the phases of a function (setup → validate → work → return). Blank line before `return`, around blocks, after early-return guards.

### Files

- **All-lowercase kebab-case**, with **dots for sub-typing**: `repo-card.tsx`, `repo-card.stories.tsx`, `repo-card.test.tsx`, `github.service.ts`, `github.schema.ts`.
- **Verbose, self-describing, search-findable filenames.** Include the resource/context in the name — `github.service.ts`, NOT a bare `service.ts` in a `github/` folder. Reason: navigation is by **fuzzy search (Cmd+P), not folder browsing**, so the filename must be unique on its own. Prefer flat-ish + prefixed over deep folders + short names.
- **No `index.ts` barrel files.** One canonical path per thing; grep/search resolves to the real file.
- Exceptions: Next framework-contract files keep their mandated names (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`, `route.ts`, `middleware.ts`, `instrumentation.ts`, `next.config.ts`).

### Models & boundaries

- Domain models are **pure types** (`models/repository.ts` = just the `RepositorySummary` interface, `readonly`, `null`→`undefined`).
- The **wire schema + transform** (the zod `fromApi`) lives at the **boundary** (`github.schema.ts`), not in the model file.
- **null at the wire, undefined in the domain** — convert at the boundary.

### Theming

- Semantic **CSS-variable tokens in oklch**: `--background`, `--card`, `--muted`, `--border`, `--primary`, `--star`…; separate `:root` (light) + `.dark` sets; mapped through Tailwind v4 `@theme inline` to utilities (`bg-card`, `text-muted-foreground`, `fill-star`). Components reference **roles, never raw colors**.
- **Aesthetic = "technical editorial."** Warm paper/ink palette, **flat — borders only, no shadows**. Hairline grids via the `gap-px bg-border` trick (1px gaps reveal the border color between cells). Star fill is the amber `--star` token, not a hardcoded yellow.
- **No gratuitous motion or texture.** We deliberately removed a grain/noise overlay and a staggered fade-in reveal — the reveal made fast-scroll feel unstable ("it doesn't stop me"). Calm by default; motion only when it communicates state (e.g. the load spinner).

### Typography

- **Two typefaces, split by meaning**: **JetBrains Mono = machine values** (repo slugs/identifiers, counts, star numbers, stat figures — always with `tabular-nums` so digits don't jitter); **IBM Plex Sans JP = human-reading prose** (descriptions, prompts, errors, button labels). The contrast *is* the aesthetic — mono reads as "data from GitHub," sans as "words for you."
- **JA-primary ⇒ the sans must cover Japanese.** This rules out Latin-only display fonts (a JP fallback would clash). IBM Plex Sans JP covers Latin + JA in one face and pairs with the mono.
- **Load only the weights you use.** `subsets: ["latin"]` (JA glyphs fetch on demand — preloading the CJK block would tank first paint); weight list trimmed to what actually renders (`400/500/600`, no `700`).

### Dependencies

- **Native `fetch` over axios/Octokit/ky**; **minimize dependencies** to shrink supply-chain attack surface. But build a *good reusable wrapper* (`lib/http.ts`) rather than scattering raw fetch.

## Architecture decisions

- **Two editions of the same app.** `main` = **Standard** (idiomatic Next + functional plain TS, zod). `opinionated` branch = **Opinionated** (Effect-TS: `Schema`, `Data.TaggedError`, `Match`, layered). Build Standard fully first, then cut `opinionated` from it and translate. UI/features identical across editions — only the data layer differs.
- **GitHub REST API** (not GraphQL — the brief names `search/repositories`). Watchers = **`subscribers_count`** (from the detail endpoint; REST's `watchers_count` is aliased to stars).
- **Server-Components-first** — fetch server-side so `GITHUB_TOKEN` never reaches the client. Token is **optional** (app works unauthenticated, lower rate limits).
- **Parsing:** zod on Standard, `@effect/schema` on Opinionated.
- **i18n:** next-intl, **routed** `/ja` `/en`, **type-safe** keys (AppConfig augmentation) + ja/en **key-parity test**. Switcher = Base UI `Select` dropdown.
- **Theme:** next-themes, default **system**, 3-way switcher (Light/System/Dark). Currently `.dark` class; switching to `data-theme` is tracked (glb #7).
- **Search UX:** **submit-based** (Enter / Search button), NOT auto-search-as-you-type — better for a remote API (no flicker, kinder to rate limits, matches the wireframe button).
- **Components:** Base UI + Tailwind; `cn` + `cva`; lucide icons; Storybook stories per visual component; mobile-first responsive; dark mode.
- **Search layout:** search bar lives at **page level, not in the header** (header = title + theme + locale only). Results render in an **internally scrollable bordered panel** (mono count-label strip on top), so the page doesn't grow unbounded.
- **Infinite scroll = Instagram-seamless.** Eager prefetch (`IntersectionObserver` with `rootMargin: PREFETCH_ROOT_MARGIN` = `800px`, scoped to the scroll container via `root`); a spinner appears **only when the user outruns the prefetch**. `overscroll-contain` on the scroll box so a fast flick **stops firmly at the spinner** instead of rubber-banding or scroll-chaining to the page. No reveal animation.
- **Subtle invariant — the re-entry guard is a *synchronous* `loadingRef`, not `isPending`.** `useTransition`'s `isPending` is async React state and stays stale within a single burst of observer callbacks, so guarding on it would double-fetch. The `useRef` flag flips synchronously and is the load-bearing guard; `isPending` is for the UI only.

## Decisions & rationale (the things we deliberated)

These are choices we reasoned through — kept so the *why* isn't lost.

- **Two editions.** `main` is the graded deliverable, so it's the *safe, conventional* one (a reviewer shouldn't trip over Effect in a search app). The `opinionated` branch shows depth. Build Standard first (solve the GitHub/domain quirks in plain TS), then *translate* to Effect — "simplify down from Effect" is a myth, it's a rewrite either way.
- **REST, not GraphQL.** The brief literally names `search/repositories`; follow it. (GraphQL would've been a nice flex but deviating from a stated requirement isn't worth it.) The GitHub-uses-GraphQL fact lives in the README rationale.
- **Native `fetch`, not Octokit/ky/axios.** Measured Octokit = **16 packages / 7.3 MB** → against the minimize-deps/supply-chain rule. It also *throws* (we want errors-as-values), gives no runtime validation (we want zod), and doesn't fit the Effect edition. Our ~80-line wrapper is "Octokit minus the deps, minus the throwing, plus zod + a `Result` union." The use-site is already clean: `GithubService.searchRepositories("react")`.
- **`GithubClient` (transport) + `GithubService` (operations).** Splitting them puts the schema on the *generic client* (`request(path, schema)` — where a schema belongs) and keeps `GithubService` a clean domain API. Cohesive objects, not "naked functions." Objects-of-closures, not a class.
- **Hand-written zod schema, not orval/generated.** GitHub *does* publish an OpenAPI spec (and `@octokit/openapi-types`), and orval is the usual tool — but the spec covers the *entire* API (megabytes) for our 2 endpoints/7 fields. A focused hand-written schema is leaner *and* resilient (validates only fields we use; unknown keys are stripped). **Document this choice in the README.**
- **zod on Standard, `@effect/schema` on Opinionated.** Using Schema on Standard would pull `effect` into the "plain TS" edition and blur the two-edition contrast. Schema's power is precisely the Opinionated edition's selling point.
- **`fetchJson` is combined (fetch + parse), with `headers` on the `ok` result.** Ergonomic single call, parse errors unified into one `HttpResult` union — and `headers` on success so we can read `X-RateLimit-*` even on a 200. Full request/decode separation wasn't worth the per-call boilerplate for always-JSON endpoints.
- **Terminology.** What we have is a *schema* (a zod validator+transform), not a passive *DTO* → `github.schema.ts`. "Repository" = the GitHub *entity* (GitHub's noun); the data-access layer is a *service* (`services/`), not a repository (the repository *pattern* is for DB persistence, and we have no DB).
- **Submit-based search, not auto-search.** Auto-as-you-type is for *filtering a local list*; this is *querying a remote API* → submit avoids flicker, half-typed queries, and rate-limit errors mid-typing. Matches the wireframe's button.
- **CSP allows `unsafe-eval` in dev only.** React's dev tooling (Fast Refresh, source maps, error stacks) needs `eval()`; production never does. Next ships no CSP by default and won't silently weaken ours, so we relax it for dev ourselves.
- **Locale handling in the layout, not per page.** `[locale]/layout.tsx` validates the locale; pages just use `getTranslations()` (reads the request locale). Dropped the per-page `hasLocale`/`setRequestLocale` ceremony.
- **next-themes / next-intl chosen for the hard part each solves.** next-themes = the no-flash blocking script (can't be done with CSS/`useEffect`). next-intl routed = the `[locale]` + middleware machinery, plus type-safe keys.

## Testing strategy

- **Unit (Vitest + Testing Library + MSW)** — stub the boundary, test the logic: pure fns, the data layer with MSW-mocked HTTP, component rendering with `renderWithProviders`.
- **E2E (Playwright)** — real prod build, real browser: locale detection, search interaction. Search-with-results runs against a **mock GitHub server** for determinism. The mock exposes deterministic edge-case knobs by query: `__empty__` (0 results), `__ratelimit__` (403 rate-limit), `__failmore__` (page 1 ok, page ≥2 → 403, for the load-more retry path), and the `ghost` owner → 404.
- **Playwright gotcha — free `:3000` before running the e2e gate.** The config has `reuseExistingServer: !CI`, so a running `pnpm dev` on `:3000` gets **reused with the real GitHub backend** instead of the mock. Symptom: `react` tests pass but every `__mock__` query fails (real GitHub doesn't know them). Stop the dev server first; Playwright then builds its own mock-pointed prod server.
- **Stories (Storybook)** — visual workshop.
- **Types as tests** — `switch`/`never` exhaustiveness, type-safe i18n keys, defined-error unions catch whole classes of bugs at compile time.
- **Boundary testing is surgical** — only where there's a real threshold in *our* logic that changes behavior (e.g. the rate-limit classifier at `remaining === 0`). NOT for library passthrough or type-enforced dispatch.
- **Test logic, not plumbing.** Colocate `*.test.ts` next to source; shared infra + e2e in `tests/`.
- Test-case spec docs live in `docs/test/<feature>.md` (Gherkin-ish, with stable `<FEATURE>-NNN` codes + `Automated:` links).

## Process

- Full milky-kit flow: `glb` issues, feature branch + PR per issue, CI gates. Standard edition is the active build (one issue/branch/PR at a time); Opinionated edition comes after.
- **Commit-by-commit review** — author reviews each chunk before every commit.
- CI = lint/typecheck/test/build + e2e; Security = OSV-Scanner + zizmor + Dependabot + npm cooldown. Branch protection unavailable (private Free repo).

## Open follow-ups (glb)

- **#7** — switch dark mode from `.dark` class to `data-theme` attribute (cleaner semantics, scales to N themes). Touches `globals.css` `@custom-variant`, `[locale]/layout` `ThemeProvider attribute`, storybook `withThemeByDataAttribute`.
- `docs/introduction.md` (the "why I chose X" narrative + full AI-usage report) — written at Finalize.

**Done since:** #8 (mock GitHub server, with the edge-case query knobs above), #10 / #16 (infinite scroll, shipped with the Instagram-seamless UX above).
