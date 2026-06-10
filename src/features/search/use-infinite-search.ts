import { useCallback, useEffect, useRef, useState, useTransition } from "react"
import type { RepositorySummary } from "@/models/repository"
import type { GithubError } from "@/services/github/github.errors"
import { appendUnique, hasMoreResults } from "./pagination"
import { searchMore } from "./search-actions"

const PREFETCH_ROOT_MARGIN = "800px"

export function useInfiniteSearch(
	query: string,
	initialItems: readonly RepositorySummary[],
	totalCount: number,
) {
	const [items, setItems] = useState<readonly RepositorySummary[]>(initialItems)
	const [reachedEnd, setReachedEnd] = useState(false)
	const [loadError, setLoadError] = useState<GithubError | undefined>(undefined)
	const [isPending, startTransition] = useTransition()
	const pageRef = useRef(1)
	const loadingRef = useRef(false)
	const sentinelRef = useRef<HTMLDivElement>(null)
	const scrollRef = useRef<HTMLDivElement>(null)

	const hasMore = !reachedEnd && !loadError && hasMoreResults(items.length, totalCount)

	const loadMore = useCallback(() => {
		// Guard on a synchronous ref, not `isPending`: the IntersectionObserver can fire twice before React commits the transition, and `isPending` would still read false on the second call, double-fetching the next page.
		if (loadingRef.current) return

		loadingRef.current = true
		setLoadError(undefined)
		const nextPage = pageRef.current + 1

		startTransition(async () => {
			const result = await searchMore(query, nextPage)

			if (result.kind === "error") {
				setLoadError(result.error)
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

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries.some((entry) => entry.isIntersecting)) loadMore()
			},
			{ root: scrollRef.current, rootMargin: PREFETCH_ROOT_MARGIN },
		)

		observer.observe(sentinel)

		return () => observer.disconnect()
	}, [hasMore, loadMore])

	return { items, hasMore, isPending, loadError, loadMore, sentinelRef, scrollRef }
}
