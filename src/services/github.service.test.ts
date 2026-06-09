import { HttpResponse, http } from "msw"
import { afterEach, describe, expect, it, vi } from "vitest"
import { server } from "../../tests/msw/server"
import { GithubService } from "./github.service"

afterEach(() => {
	vi.unstubAllEnvs()
})

const endpoint = "https://api.github.com/search/repositories"

const repoItem = {
	id: 1,
	full_name: "facebook/react",
	description: "The library for web and native user interfaces",
	language: "JavaScript",
	stargazers_count: 220000,
	html_url: "https://github.com/facebook/react",
	owner: { login: "facebook", avatar_url: "https://avatars.githubusercontent.com/u/69631" },
}

describe("GithubService.searchRepositories", () => {
	it("returns parsed repositories on success", async () => {
		server.use(http.get(endpoint, () => HttpResponse.json({ total_count: 1, items: [repoItem] })))

		const result = await GithubService.searchRepositories("react")

		expect(result.kind).toBe("ok")
		if (result.kind === "ok") {
			expect(result.data.totalCount).toBe(1)
			expect(result.data.items[0]).toMatchObject({
				fullName: "facebook/react",
				stars: 220000,
				language: "JavaScript",
				owner: { login: "facebook", avatarUrl: "https://avatars.githubusercontent.com/u/69631" },
			})
		}
	})

	it("maps nullable fields to undefined", async () => {
		server.use(
			http.get(endpoint, () =>
				HttpResponse.json({
					total_count: 1,
					items: [{ ...repoItem, description: null, language: null }],
				}),
			),
		)

		const result = await GithubService.searchRepositories("react")

		if (result.kind === "ok") {
			expect(result.data.items[0]?.description).toBeUndefined()
			expect(result.data.items[0]?.language).toBeUndefined()
		}
	})

	it("maps 403 with no remaining quota to rateLimited", async () => {
		server.use(
			http.get(
				endpoint,
				() =>
					new HttpResponse(null, {
						status: 403,
						headers: { "x-ratelimit-remaining": "0", "x-ratelimit-reset": "1700000000" },
					}),
			),
		)

		const result = await GithubService.searchRepositories("react")

		expect(result.kind === "error" && result.error.kind).toBe("rateLimited")
	})

	it("maps a secondary rate limit (403 + Retry-After) to rateLimited", async () => {
		server.use(
			http.get(
				endpoint,
				() => new HttpResponse(null, { status: 403, headers: { "retry-after": "60" } }),
			),
		)

		const result = await GithubService.searchRepositories("react")

		expect(result.kind === "error" && result.error.kind).toBe("rateLimited")
	})

	it("treats a 403 with remaining quota as unexpected, not rate-limited", async () => {
		server.use(
			http.get(
				endpoint,
				() => new HttpResponse(null, { status: 403, headers: { "x-ratelimit-remaining": "42" } }),
			),
		)

		const result = await GithubService.searchRepositories("react")

		expect(result.kind === "error" && result.error.kind).toBe("unexpected")
	})

	it("maps a 429 to rateLimited", async () => {
		server.use(http.get(endpoint, () => new HttpResponse(null, { status: 429 })))

		const result = await GithubService.searchRepositories("react")

		expect(result.kind === "error" && result.error.kind).toBe("rateLimited")
	})

	it("maps a 5xx to unexpected", async () => {
		server.use(http.get(endpoint, () => new HttpResponse(null, { status: 503 })))

		const result = await GithubService.searchRepositories("react")

		expect(result.kind === "error" && result.error.kind).toBe("unexpected")
	})

	it("maps 422 to invalidQuery", async () => {
		server.use(http.get(endpoint, () => new HttpResponse(null, { status: 422 })))

		const result = await GithubService.searchRepositories("")

		expect(result.kind === "error" && result.error.kind).toBe("invalidQuery")
	})

	it("maps a malformed response to parse", async () => {
		server.use(http.get(endpoint, () => HttpResponse.json({ total_count: "lots", items: [] })))

		const result = await GithubService.searchRepositories("react")

		expect(result.kind === "error" && result.error.kind).toBe("parse")
	})

	it("works unauthenticated — no Authorization header when no token is set", async () => {
		let authHeader: string | null = "unset"
		server.use(
			http.get(endpoint, ({ request }) => {
				authHeader = request.headers.get("authorization")

				return HttpResponse.json({ total_count: 0, items: [] })
			}),
		)

		await GithubService.searchRepositories("react")

		expect(authHeader).toBeNull()
	})

	it("sends a Bearer token when GITHUB_TOKEN is set", async () => {
		vi.stubEnv("GITHUB_TOKEN", "secret-token")
		let authHeader: string | null = null
		server.use(
			http.get(endpoint, ({ request }) => {
				authHeader = request.headers.get("authorization")

				return HttpResponse.json({ total_count: 0, items: [] })
			}),
		)

		await GithubService.searchRepositories("react")

		expect(authHeader).toBe("Bearer secret-token")
	})
})
