import { ExternalLink } from "lucide-react"
import { useTranslations } from "next-intl"
import type { RepositoryDetail } from "@/models/repository"
import { RepoHeader } from "./repo-header"
import { StatGrid } from "./stat-grid"

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
				<div className="size-16 shrink-0 animate-pulse rounded-full bg-card" />
				<div className="h-7 w-48 animate-pulse rounded bg-card" />
			</div>

			<dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
				{STAT_SKELETON_KEYS.map((key) => (
					<div
						key={key}
						className="h-[88px] animate-pulse rounded-lg border border-border bg-card"
					/>
				))}
			</dl>
		</div>
	)
}
