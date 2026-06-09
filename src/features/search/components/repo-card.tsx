import { Star } from "lucide-react"
import Image from "next/image"
import { Link } from "@/i18n/navigation"
import { formatCompact } from "@/lib/format"
import type { RepositorySummary } from "@/models/repository"

interface RepoCardProps {
	repository: RepositorySummary
}

export function RepoCard(props: RepoCardProps) {
	const { repository } = props

	return (
		<Link
			href={`/repos/${repository.fullName}`}
			className="flex items-center gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
		>
			<Image
				src={repository.owner.avatarUrl}
				alt=""
				width={40}
				height={40}
				className="size-10 shrink-0 rounded-full"
			/>

			<div className="min-w-0 flex-1">
				<p className="truncate font-medium">{repository.fullName}</p>

				{repository.description ? (
					<p className="truncate text-muted-foreground text-sm">{repository.description}</p>
				) : null}
			</div>

			<div className="flex shrink-0 items-center gap-3 text-muted-foreground text-sm">
				{repository.language ? <span>{repository.language}</span> : null}

				<span className="flex items-center gap-1">
					<Star className="size-4" aria-hidden="true" />
					{formatCompact(repository.stars)}
				</span>
			</div>
		</Link>
	)
}
