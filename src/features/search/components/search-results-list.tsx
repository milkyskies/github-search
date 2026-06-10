"use client"

import { useTranslations } from "next-intl"
import { Button } from "@/features/shared/components/button"
import type { RepositorySummary } from "@/models/repository"
import { useInfiniteSearch } from "../use-infinite-search"
import { RepoCard } from "./repo-card"

interface SearchResultsListProps {
	query: string
	totalCount: number
	initialItems: readonly RepositorySummary[]
}

export function SearchResultsList(props: SearchResultsListProps) {
	const t = useTranslations("search")
	const { items, hasMore, isPending, loadMore, sentinelRef } = useInfiniteSearch(
		props.query,
		props.initialItems,
		props.totalCount,
	)

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
