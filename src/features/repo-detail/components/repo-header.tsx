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
				width={56}
				height={56}
				className="size-14 shrink-0 rounded-full"
			/>

			<div className="min-w-0">
				<h1 className="break-all font-mono font-semibold text-xl tracking-tight sm:text-2xl">
					{repository.fullName}
				</h1>

				{repository.language ? (
					<p className="mt-1 flex items-center gap-1.5 font-mono text-muted-foreground text-sm">
						<span className="size-2 rounded-full bg-primary/70" aria-hidden="true" />
						{repository.language}
					</p>
				) : null}
			</div>
		</header>
	)
}
