import type { RepositorySummary } from "@/models/repository"

export const SEARCH_RESULT_CAP = 1000

export function hasMoreResults(loadedCount: number, totalCount: number): boolean {
	return loadedCount < Math.min(totalCount, SEARCH_RESULT_CAP)
}

export function appendUnique(
	previous: readonly RepositorySummary[],
	next: readonly RepositorySummary[],
): readonly RepositorySummary[] {
	const seen = new Set(previous.map((repository) => repository.id))

	return [...previous, ...next.filter((repository) => !seen.has(repository.id))]
}
