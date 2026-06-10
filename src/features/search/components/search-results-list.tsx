"use client"

import { useTranslations } from "next-intl"
import { useCallback, useEffect, useRef, useState, useTransition } from "react"
import { Button } from "@/features/shared/components/button"
import type { RepositorySummary } from "@/models/repository"
import { hasMoreResults } from "../pagination"
import { searchMore } from "../search-actions"
import { RepoCard } from "./repo-card"

interface SearchResultsListProps {
	query: string
	totalCount: number
	initialItems: readonly RepositorySummary[]
}

export function SearchResultsList(props: SearchResultsListProps) {
	const t = useTranslations("search")
	const [items, setItems] = useState<readonly RepositorySummary[]>(props.initialItems)
	const [reachedEnd, setReachedEnd] = useState(false)
	const [isPending, startTransition] = useTransition()
	const pageRef = useRef(1)
	const loadingRef = useRef(false)
	const sentinelRef = useRef<HTMLDivElement>(null)

	const hasMore = !reachedEnd && hasMoreResults(items.length, props.totalCount)

	const loadMore = useCallback(() => {
		if (loadingRef.current) return

		loadingRef.current = true
		const nextPage = pageRef.current + 1

		startTransition(async () => {
			const result = await searchMore(props.query, nextPage)

			if (result.kind === "ok" && result.data.items.length > 0) {
				pageRef.current = nextPage
				setItems((previous) => [...previous, ...result.data.items])
			} else {
				setReachedEnd(true)
			}

			loadingRef.current = false
		})
	}, [props.query])

	useEffect(() => {
		const sentinel = sentinelRef.current

		if (!hasMore || !sentinel) return

		const observer = new IntersectionObserver((entries) => {
			if (entries.some((entry) => entry.isIntersecting)) loadMore()
		})

		observer.observe(sentinel)

		return () => observer.disconnect()
	}, [hasMore, loadMore])

	return (
		<section className="flex flex-col gap-3">
			<p className="text-muted-foreground text-sm">{t("results", { count: props.totalCount })}</p>

			<ul className="flex flex-col gap-2">
				{items.map((repository) => (
					<li key={repository.id}>
						<RepoCard repository={repository} />
					</li>
				))}
			</ul>

			{hasMore ? (
				<div className="flex flex-col items-center gap-2">
					<div ref={sentinelRef} aria-hidden="true" className="h-px w-full" />

					<Button type="button" onClick={loadMore} disabled={isPending}>
						{isPending ? t("loading") : t("loadMore")}
					</Button>
				</div>
			) : null}
		</section>
	)
}
