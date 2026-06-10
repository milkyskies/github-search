import { BackButton } from "@/features/repo-detail/components/back-button"
import { RepoDetailSkeleton } from "@/features/repo-detail/components/repo-detail"
import { CONTAINER } from "@/lib/container"

export default function Loading() {
	return (
		<main className={`${CONTAINER} flex flex-col gap-6 py-6 sm:py-8`}>
			<BackButton />

			<RepoDetailSkeleton />
		</main>
	)
}
