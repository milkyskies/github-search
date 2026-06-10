import { CircleDot, Eye, GitFork, Star } from "lucide-react"
import { useTranslations } from "next-intl"
import type { ReactNode } from "react"
import type { RepositoryDetail } from "@/models/repository"
import { StatTile } from "./stat-tile"

export function StatGridShell(props: { children: ReactNode }) {
	return (
		<dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-4">
			{props.children}
		</dl>
	)
}

interface StatGridProps {
	repository: RepositoryDetail
}

export function StatGrid(props: StatGridProps) {
	const t = useTranslations("detail.stats")
	const { repository } = props

	return (
		<StatGridShell>
			<StatTile icon={Star} label={t("stars")} value={repository.stars} />
			<StatTile icon={Eye} label={t("watchers")} value={repository.watchers} />
			<StatTile icon={GitFork} label={t("forks")} value={repository.forks} />
			<StatTile icon={CircleDot} label={t("issues")} value={repository.openIssues} />
		</StatGridShell>
	)
}
