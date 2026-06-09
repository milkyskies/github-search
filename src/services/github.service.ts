import { GithubClient } from "./github.client"
import type { GithubResult } from "./github.errors"
import { type SearchResult, searchResponseSchema } from "./github.schema"

const PER_PAGE = 20

export const GithubService = {
	searchRepositories(query: string, page = 1): Promise<GithubResult<SearchResult>> {
		const params = new URLSearchParams({
			q: query,
			per_page: String(PER_PAGE),
			page: String(page),
		})

		return GithubClient.request(`/search/repositories?${params}`, searchResponseSchema)
	},
}
