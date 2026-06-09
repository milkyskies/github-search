# Search

Search GitHub repositories by keyword and browse the results. Scenarios below carry stable `SEARCH-NNN` codes. `[x]` = an automated test exists; `Automated:` links to it.

## Search interaction (e2e)

- [x] **[SEARCH-001]** Enter submits the query
  - Given: the search page
  - When: the user types `react` and presses Enter
  - Then: the URL becomes `…?q=react`
  - Automated: `tests/e2e/search.spec.ts`

- [x] **[SEARCH-002]** The Search button submits the query
  - Given: the search page
  - When: the user types `vue` and clicks Search
  - Then: the URL becomes `…?q=vue`
  - Automated: `tests/e2e/search.spec.ts`

- [x] **[SEARCH-003]** Clearing the box removes the query
  - Given: the page at `?q=react`
  - When: the user empties the box and submits
  - Then: the query is removed from the URL
  - Automated: `tests/e2e/search.spec.ts`

## Search service (unit, MSW-mocked GitHub)

- [x] **[SEARCH-010]** Success returns parsed repositories — `Automated: src/services/github.service.test.ts`
- [x] **[SEARCH-011]** Nullable wire fields (`description`/`language`) map to `undefined` — `Automated: src/services/github.service.test.ts`
- [x] **[SEARCH-012]** Primary rate limit (`403` + `x-ratelimit-remaining: 0`) → `rateLimited` — `Automated: src/services/github.service.test.ts`
- [x] **[SEARCH-013]** Secondary rate limit (`403` + `Retry-After`) → `rateLimited` — `Automated: src/services/github.service.test.ts`
- [x] **[SEARCH-014]** `403` with remaining quota → `unexpected` (boundary) — `Automated: src/services/github.service.test.ts`
- [x] **[SEARCH-015]** `429` → `rateLimited` — `Automated: src/services/github.service.test.ts`
- [x] **[SEARCH-016]** `5xx` → `unexpected` — `Automated: src/services/github.service.test.ts`
- [x] **[SEARCH-017]** `422` → `invalidQuery` — `Automated: src/services/github.service.test.ts`
- [x] **[SEARCH-018]** Malformed response → `parse` — `Automated: src/services/github.service.test.ts`
- [x] **[SEARCH-019]** Works unauthenticated (no `Authorization` header without a token) — `Automated: src/services/github.service.test.ts`
- [x] **[SEARCH-020]** Sends `Authorization: Bearer …` when `GITHUB_TOKEN` is set — `Automated: src/services/github.service.test.ts`

## HTTP wrapper (unit, MSW-mocked)

- [x] **[SEARCH-021]** Valid response parses to `ok{data,headers}` — `Automated: src/lib/http.test.ts`
- [x] **[SEARCH-022]** Non-2xx → `status` error with headers — `Automated: src/lib/http.test.ts`
- [x] **[SEARCH-023]** Unexpected shape → `parse` error — `Automated: src/lib/http.test.ts`
- [x] **[SEARCH-024]** Request failure → `network` error — `Automated: src/lib/http.test.ts`
- [x] **[SEARCH-025]** Slow response → `timeout` error — `Automated: src/lib/http.test.ts`
- [x] **[SEARCH-026]** Non-JSON body → `invalidBody` error — `Automated: src/lib/http.test.ts`

## Result card (unit)

- [x] **[SEARCH-030]** Renders the full name and links to the detail page — `Automated: src/features/search/components/repo-card.test.tsx`
- [x] **[SEARCH-031]** Formats the star count compactly (`228000 → 228K`) — `Automated: src/features/search/components/repo-card.test.tsx`
- [x] **[SEARCH-032]** Omits language when absent — `Automated: src/features/search/components/repo-card.test.tsx`

## Pending (UI — needs `SearchResults` + the mock GitHub server, glb #8)

- [ ] **[SEARCH-040]** A query renders a list of result cards
- [ ] **[SEARCH-041]** Zero results shows the empty state
- [ ] **[SEARCH-042]** A rate-limit error shows the rate-limit state (with reset time)
- [ ] **[SEARCH-043]** Infinite scroll loads the next page (and stops at GitHub's 1000-result cap)
