import type { RepositoryDetail } from "@/models/repository"
import { GithubClient } from "./github.client"
import type { GithubResult } from "./github.errors"
import { repositoryDetailSchema, type SearchResult, searchResponseSchema } from "./github.schema"

const PER_PAGE = 20
const SEARCH_REVALIDATE_SECONDS = 60
const DETAIL_REVALIDATE_SECONDS = 300

export const GithubService = {
	searchRepositories(query: string, page = 1): Promise<GithubResult<SearchResult>> {
		const params = new URLSearchParams({
			q: query,
			per_page: String(PER_PAGE),
			page: String(page),
		})

		return GithubClient.request(`/search/repositories?${params}`, searchResponseSchema, {
			revalidate: SEARCH_REVALIDATE_SECONDS,
		})
	},

	getRepository(owner: string, repo: string): Promise<GithubResult<RepositoryDetail>> {
		const path = `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`

		return GithubClient.request(path, repositoryDetailSchema, {
			revalidate: DETAIL_REVALIDATE_SECONDS,
		})
	},
}
