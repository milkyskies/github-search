import { createServer, type ServerResponse } from "node:http"

const PORT = Number(process.env.MOCK_GITHUB_PORT ?? 4000)
const RATE_LIMIT_QUERY = "__ratelimit__"
const FAIL_MORE_QUERY = "__failmore__"
const EMPTY_QUERY = "__empty__"
const NOT_FOUND_OWNER = "ghost"
const RATE_LIMIT_OWNER = "ratelimit"
const SEARCH_TOTAL_COUNT = 1000
const AVATAR_URL = "https://avatars.githubusercontent.com/u/9919?v=4"

interface RepoSummaryWire {
	id: number
	full_name: string
	description: string | null
	language: string | null
	stargazers_count: number
	html_url: string
	owner: { login: string; avatar_url: string }
}

function repoSummaryWire(owner: string, name: string, index: number): RepoSummaryWire {
	return {
		id: 1_000_000 + index,
		full_name: `${owner}/${name}`,
		description: `Mock repository for ${owner}/${name}.`,
		language: "TypeScript",
		stargazers_count: Math.max(1000, 250_000 - index * 137),
		html_url: `https://github.com/${owner}/${name}`,
		owner: { login: owner, avatar_url: AVATAR_URL },
	}
}

const FEATURED: RepoSummaryWire[] = [
	repoSummaryWire("facebook", "react", 0),
	repoSummaryWire("vuejs", "core", 1),
	repoSummaryWire("sveltejs", "svelte", 2),
	repoSummaryWire("vercel", "next.js", 3),
	repoSummaryWire("withastro", "astro", 4),
]

function searchResponse(perPage: number, page: number) {
	const start = (page - 1) * perPage
	const available = Math.max(0, Math.min(perPage, SEARCH_TOTAL_COUNT - start))

	const items: RepoSummaryWire[] = []

	for (let offset = 0; offset < available; offset++) {
		const index = start + offset

		if (index < FEATURED.length) {
			items.push(FEATURED[index])
		} else {
			items.push(repoSummaryWire(`mock-owner-${index}`, `mock-repo-${index}`, index))
		}
	}

	return { total_count: SEARCH_TOTAL_COUNT, items }
}

function repoDetailWire(owner: string, name: string) {
	return {
		id: 10270250,
		full_name: `${owner}/${name}`,
		description: `Mock repository for ${owner}/${name}.`,
		language: "TypeScript",
		stargazers_count: 220000,
		watchers_count: 220000,
		subscribers_count: 6700,
		forks_count: 46500,
		open_issues_count: 980,
		html_url: `https://github.com/${owner}/${name}`,
		owner: { login: owner, avatar_url: AVATAR_URL },
	}
}

function sendJson(
	res: ServerResponse,
	status: number,
	body: unknown,
	headers: Record<string, string> = {},
) {
	res.writeHead(status, { "content-type": "application/json", ...headers })
	res.end(JSON.stringify(body))
}

const server = createServer((req, res) => {
	const requestUrl = new URL(req.url ?? "/", `http://localhost:${PORT}`)
	const path = requestUrl.pathname

	if (path === "/search/repositories") {
		const query = requestUrl.searchParams.get("q") ?? ""
		const perPage = Number(requestUrl.searchParams.get("per_page") ?? 20)
		const page = Number(requestUrl.searchParams.get("page") ?? 1)

		if (query.includes(RATE_LIMIT_QUERY)) {
			sendJson(
				res,
				403,
				{ message: "API rate limit exceeded" },
				{ "x-ratelimit-remaining": "0", "x-ratelimit-reset": "9999999999" },
			)
			return
		}

		if (query.includes(FAIL_MORE_QUERY) && page > 1) {
			sendJson(
				res,
				403,
				{ message: "API rate limit exceeded" },
				{ "x-ratelimit-remaining": "0", "x-ratelimit-reset": "9999999999" },
			)
			return
		}

		if (query.includes(EMPTY_QUERY)) {
			sendJson(res, 200, { total_count: 0, items: [] })
			return
		}

		sendJson(res, 200, searchResponse(perPage, page))
		return
	}

	const repoMatch = path.match(/^\/repos\/([^/]+)\/([^/]+)$/)

	if (repoMatch) {
		const owner = decodeURIComponent(repoMatch[1])
		const name = decodeURIComponent(repoMatch[2])

		if (owner === NOT_FOUND_OWNER) {
			sendJson(res, 404, { message: "Not Found" })
			return
		}

		if (owner === RATE_LIMIT_OWNER) {
			sendJson(
				res,
				403,
				{ message: "API rate limit exceeded" },
				{ "x-ratelimit-remaining": "0", "x-ratelimit-reset": "9999999999" },
			)
			return
		}

		sendJson(res, 200, repoDetailWire(owner, name))
		return
	}

	sendJson(res, 404, { message: `Unhandled mock route: ${path}` })
})

server.listen(PORT)
