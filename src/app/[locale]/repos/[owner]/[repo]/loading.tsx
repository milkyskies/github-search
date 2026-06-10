import { BackButton } from "@/features/repo-detail/components/back-button"
import { RepoDetailSkeleton } from "@/features/repo-detail/components/repo-detail"
import { PageContainer } from "@/features/shared/components/page-container"

export default function Loading() {
	return (
		<PageContainer as="main" className="flex flex-col gap-6 py-6 sm:py-8">
			<BackButton />

			<RepoDetailSkeleton />
		</PageContainer>
	)
}
