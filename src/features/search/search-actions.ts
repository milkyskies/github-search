"use server"

import type { GithubResult } from "@/services/github/github.errors"
import type { SearchResult } from "@/services/github/github.schema"
import { GithubService } from "@/services/github/github.service"

export async function searchMore(query: string, page: number): Promise<GithubResult<SearchResult>> {
	return GithubService.searchRepositories(query, page)
}
