import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { hasLocale } from "next-intl"
import { setRequestLocale } from "next-intl/server"
import { BackButton } from "@/features/repo-detail/components/back-button"
import { RepoDetail } from "@/features/repo-detail/components/repo-detail"
import { RepoDetailError } from "@/features/repo-detail/components/repo-detail-error"
import { PageContainer } from "@/features/shared/components/page-container"
import { routing } from "@/i18n/routing"
import { GithubService } from "@/services/github/github.service"

interface RepoDetailPageProps {
	params: Promise<{ locale: string; owner: string; repo: string }>
}

export async function generateMetadata(props: RepoDetailPageProps): Promise<Metadata> {
	const { owner, repo } = await props.params

	const result = await GithubService.getRepository(owner, repo)

	if (result.kind === "error") return {}

	return { title: result.data.fullName }
}

export default async function RepoDetailPage(props: RepoDetailPageProps) {
	const { locale, owner, repo } = await props.params

	if (!hasLocale(routing.locales, locale)) notFound()

	setRequestLocale(locale)

	const result = await GithubService.getRepository(owner, repo)

	if (result.kind === "error" && result.error.kind === "notFound") notFound()

	return (
		<PageContainer as="main" className="flex flex-col gap-6 py-6 sm:py-8">
			<BackButton />

			{result.kind === "error" ? (
				<RepoDetailError error={result.error} />
			) : (
				<RepoDetail repository={result.data} />
			)}
		</PageContainer>
	)
}
