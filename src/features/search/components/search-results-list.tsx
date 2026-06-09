import { useTranslations } from "next-intl"
import type { RepositorySummary } from "@/models/repository"
import { RepoCard } from "./repo-card"

interface SearchResultsListProps {
	totalCount: number
	items: readonly RepositorySummary[]
}

export function SearchResultsList(props: SearchResultsListProps) {
	const t = useTranslations("search")

	return (
		<section className="flex flex-col gap-3">
			<p className="text-muted-foreground text-sm">{t("results", { count: props.totalCount })}</p>

			<ul className="flex flex-col gap-2">
				{props.items.map((repository) => (
					<li key={repository.id}>
						<RepoCard repository={repository} />
					</li>
				))}
			</ul>
		</section>
	)
}
