"use client"

import { Loader2 } from "lucide-react"
import { useTranslations } from "next-intl"
import { Button } from "@/features/shared/components/button"
import { githubErrorMessageKey } from "@/features/shared/github-error-message"
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
	const { items, hasMore, isPending, loadError, loadMore, sentinelRef, scrollRef } =
		useInfiniteSearch(props.query, props.initialItems, props.totalCount)

	return (
		<section className="overflow-hidden rounded-lg border border-border">
			<p className="border-border border-b bg-muted/50 px-4 py-2.5 font-mono text-[0.7rem] text-muted-foreground uppercase tracking-[0.18em] tabular-nums">
				{t("results", { count: props.totalCount })}
			</p>

			<div
				ref={scrollRef}
				className="max-h-[calc(100dvh_-_15rem)] min-h-64 overflow-y-auto overscroll-contain"
			>
				<ul className="divide-y divide-border">
					{items.map((repository) => (
						<li key={repository.id}>
							<RepoCard repository={repository} />
						</li>
					))}
				</ul>

				{loadError ? (
					<div className="flex flex-col items-center gap-2 border-border border-t p-4">
						<p role="alert" className="text-destructive text-sm">
							{t(`error.${githubErrorMessageKey(loadError)}`)}
						</p>

						<Button type="button" onClick={loadMore} disabled={isPending}>
							{isPending ? t("loading") : t("retry")}
						</Button>
					</div>
				) : hasMore ? (
					<div ref={sentinelRef} className="flex items-center justify-center py-6" role="status">
						{isPending ? (
							<Loader2 className="size-5 animate-spin text-muted-foreground" aria-hidden="true" />
						) : null}

						<span className="sr-only">{t("loading")}</span>
					</div>
				) : null}
			</div>
		</section>
	)
}
