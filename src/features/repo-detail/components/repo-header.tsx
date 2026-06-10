import Image from "next/image"
import type { RepositoryDetail } from "@/models/repository"

interface RepoHeaderProps {
	repository: RepositoryDetail
}

export function RepoHeader(props: RepoHeaderProps) {
	const { repository } = props

	return (
		<header className="flex items-center gap-4">
			<Image
				src={repository.owner.avatarUrl}
				alt=""
				width={64}
				height={64}
				className="size-16 shrink-0 rounded-full"
			/>

			<div className="min-w-0">
				<h1 className="truncate font-semibold text-2xl">{repository.fullName}</h1>

				{repository.language ? (
					<p className="text-muted-foreground text-sm">{repository.language}</p>
				) : null}
			</div>
		</header>
	)
}
