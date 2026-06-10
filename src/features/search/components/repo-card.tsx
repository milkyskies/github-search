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
			className="flex items-center gap-4 border-primary/0 border-l-2 py-4 pr-2 pl-4 transition-colors hover:border-primary hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
		>
			<Image
				src={repository.owner.avatarUrl}
				alt=""
				width={36}
				height={36}
				className="size-9 shrink-0 rounded-full"
			/>

			<div className="min-w-0 flex-1">
				<p className="truncate font-medium font-mono text-sm">{repository.fullName}</p>

				{repository.description ? (
					<p className="truncate text-muted-foreground text-sm">{repository.description}</p>
				) : null}
			</div>

			<div className="flex shrink-0 items-center gap-4 font-mono text-muted-foreground text-xs">
				{repository.language ? (
					<span className="hidden items-center gap-1.5 sm:flex">
						<span className="size-2 rounded-full bg-primary/70" aria-hidden="true" />
						{repository.language}
					</span>
				) : null}

				<span className="flex items-center gap-1 tabular-nums">
					<Star className="size-3.5 fill-star text-star" aria-hidden="true" />
					{formatCompact(repository.stars)}
				</span>
			</div>
		</Link>
	)
}
