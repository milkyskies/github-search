import { useCallback, useEffect, useRef, useState, useTransition } from "react"
import type { RepositorySummary } from "@/models/repository"
import { hasMoreResults } from "./pagination"
import { searchMore } from "./search-actions"

function appendUnique(
	previous: readonly RepositorySummary[],
	next: readonly RepositorySummary[],
): readonly RepositorySummary[] {
	const seen = new Set(previous.map((repository) => repository.id))

	return [...previous, ...next.filter((repository) => !seen.has(repository.id))]
}

export function useInfiniteSearch(
	query: string,
	initialItems: readonly RepositorySummary[],
	totalCount: number,
) {
	const [items, setItems] = useState<readonly RepositorySummary[]>(initialItems)
	const [reachedEnd, setReachedEnd] = useState(false)
	const [failed, setFailed] = useState(false)
	const [isPending, startTransition] = useTransition()
	const pageRef = useRef(1)
	const loadingRef = useRef(false)
	const sentinelRef = useRef<HTMLDivElement>(null)

	const hasMore = !reachedEnd && !failed && hasMoreResults(items.length, totalCount)

	const loadMore = useCallback(() => {
		if (loadingRef.current) return

		loadingRef.current = true
		setFailed(false)
		const nextPage = pageRef.current + 1

		startTransition(async () => {
			const result = await searchMore(query, nextPage)

			if (result.kind === "error") {
				setFailed(true)
			} else if (result.data.items.length === 0) {
				setReachedEnd(true)
			} else {
				pageRef.current = nextPage
				setItems((previous) => appendUnique(previous, result.data.items))
			}

			loadingRef.current = false
		})
	}, [query])

	useEffect(() => {
		const sentinel = sentinelRef.current

		if (!hasMore || !sentinel) return

		const observer = new IntersectionObserver((entries) => {
			if (entries.some((entry) => entry.isIntersecting)) loadMore()
		})

		observer.observe(sentinel)

		return () => observer.disconnect()
	}, [hasMore, loadMore])

	return { items, hasMore, isPending, failed, loadMore, sentinelRef }
}
