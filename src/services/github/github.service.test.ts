import { server } from "@tests/msw/server"
import { HttpResponse, http } from "msw"
import { afterEach, describe, expect, it, vi } from "vitest"
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
	it("成功時はパース済みのリポジトリを返す", async () => {
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

	it("null 許容フィールドを undefined に変換する", async () => {
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

	it("残り quota が無い 403 を rateLimited に変換する", async () => {
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

	it("セカンダリレート制限 (403 + Retry-After) を rateLimited に変換する", async () => {
		server.use(
			http.get(
				endpoint,
				() => new HttpResponse(null, { status: 403, headers: { "retry-after": "60" } }),
			),
		)

		const result = await GithubService.searchRepositories("react")

		expect(result.kind === "error" && result.error.kind).toBe("rateLimited")
	})

	it("quota が残っている 403 はレート制限ではなく unexpected として扱う", async () => {
		server.use(
			http.get(
				endpoint,
				() => new HttpResponse(null, { status: 403, headers: { "x-ratelimit-remaining": "42" } }),
			),
		)

		const result = await GithubService.searchRepositories("react")

		expect(result.kind === "error" && result.error.kind).toBe("unexpected")
	})

	it("429 を rateLimited に変換する", async () => {
		server.use(http.get(endpoint, () => new HttpResponse(null, { status: 429 })))

		const result = await GithubService.searchRepositories("react")

		expect(result.kind === "error" && result.error.kind).toBe("rateLimited")
	})

	it("5xx を unexpected に変換する", async () => {
		server.use(http.get(endpoint, () => new HttpResponse(null, { status: 503 })))

		const result = await GithubService.searchRepositories("react")

		expect(result.kind === "error" && result.error.kind).toBe("unexpected")
	})

	it("422 を invalidQuery に変換する", async () => {
		server.use(http.get(endpoint, () => new HttpResponse(null, { status: 422 })))

		const result = await GithubService.searchRepositories("")

		expect(result.kind === "error" && result.error.kind).toBe("invalidQuery")
	})

	it("不正な形式のレスポンスを parse に変換する", async () => {
		server.use(http.get(endpoint, () => HttpResponse.json({ total_count: "lots", items: [] })))

		const result = await GithubService.searchRepositories("react")

		expect(result.kind === "error" && result.error.kind).toBe("parse")
	})

	it("未認証で動作する — トークン未設定時は Authorization ヘッダーを付けない", async () => {
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

	it("GITHUB_TOKEN 設定時は Bearer トークンを送る", async () => {
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

const detailEndpoint = "https://api.github.com/repos/facebook/react"

const repoDetail = {
	id: 10270250,
	full_name: "facebook/react",
	description: "The library for web and native user interfaces",
	language: "JavaScript",
	stargazers_count: 220000,
	watchers_count: 220000,
	subscribers_count: 6700,
	forks_count: 45000,
	open_issues_count: 1000,
	html_url: "https://github.com/facebook/react",
	owner: { login: "facebook", avatar_url: "https://avatars.githubusercontent.com/u/69631" },
}

describe("GithubService.getRepository", () => {
	it("パース済みの詳細を返し、watchers をスター数にエイリアスされた watchers_count ではなく subscribers_count から読む", async () => {
		server.use(http.get(detailEndpoint, () => HttpResponse.json(repoDetail)))

		const result = await GithubService.getRepository("facebook", "react")

		expect(result.kind).toBe("ok")
		if (result.kind === "ok") {
			expect(result.data).toMatchObject({
				fullName: "facebook/react",
				stars: 220000,
				watchers: 6700,
				forks: 45000,
				openIssues: 1000,
			})
		}
	})
})
