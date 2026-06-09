import type { RepositorySummary } from "@/models/repository"
import type { GithubError, GithubResult } from "@/services/github.errors"
import type { SearchResult } from "@/services/github.schema"

export type SearchViewState =
	| { kind: "error"; error: GithubError }
	| { kind: "empty" }
	| { kind: "results"; totalCount: number; items: readonly RepositorySummary[] }

export function toSearchViewState(result: GithubResult<SearchResult>): SearchViewState {
	if (result.kind === "error") return { kind: "error", error: result.error }

	const { items, totalCount } = result.data

	if (totalCount === 0) return { kind: "empty" }

	return { kind: "results", totalCount, items }
}
