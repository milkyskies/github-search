import { ExternalLink } from "lucide-react"
import { useTranslations } from "next-intl"
import { Skeleton } from "@/features/shared/components/skeleton"
import type { RepositoryDetail } from "@/models/repository"
import { RepoHeader } from "./repo-header"
import { StatGrid, StatGridShell } from "./stat-grid"
import { StatTileShell } from "./stat-tile"

const STAT_SKELETON_KEYS = ["stars", "watchers", "forks", "issues"]

interface RepoDetailProps {
	repository: RepositoryDetail
}

export function RepoDetail(props: RepoDetailProps) {
	const t = useTranslations("detail")
	const { repository } = props

	return (
		<article className="flex flex-col gap-6">
			<RepoHeader repository={repository} />

			{repository.description ? (
				<p className="text-muted-foreground">{repository.description}</p>
			) : null}

			<StatGrid repository={repository} />

			<a
				href={repository.htmlUrl}
				target="_blank"
				rel="noreferrer noopener"
				className="inline-flex items-center gap-2 self-start text-primary text-sm hover:underline"
			>
				<ExternalLink className="size-4" aria-hidden="true" />
				{t("viewOnGithub")}
			</a>
		</article>
	)
}

export function RepoDetailSkeleton() {
	return (
		<div className="flex flex-col gap-6">
			<div className="flex items-center gap-4">
				<Skeleton className="size-14 shrink-0 rounded-full bg-card" />

				<div className="space-y-2">
					<Skeleton className="h-7 w-48 bg-card" />
					<Skeleton className="h-4 w-24 bg-card" />
				</div>
			</div>

			<div className="space-y-2">
				<Skeleton className="h-4 w-full bg-card" />
				<Skeleton className="h-4 w-2/3 bg-card" />
			</div>

			<StatGridShell>
				{STAT_SKELETON_KEYS.map((key) => (
					<StatTileShell key={key}>
						<Skeleton className="h-3 w-16" />
						<Skeleton className="h-7 w-12" />
					</StatTileShell>
				))}
			</StatGridShell>

			<Skeleton className="h-4 w-32 self-start bg-card" />
		</div>
	)
}
