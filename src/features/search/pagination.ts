export const SEARCH_RESULT_CAP = 1000

export function hasMoreResults(loadedCount: number, totalCount: number): boolean {
	return loadedCount < Math.min(totalCount, SEARCH_RESULT_CAP)
}
