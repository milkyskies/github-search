import { getTranslations } from "next-intl/server"
import { Suspense } from "react"
import { SearchBar } from "@/features/search/components/search-bar"
import { SearchPrompt } from "@/features/search/components/search-prompt"
import { SearchResults } from "@/features/search/components/search-results"
import { SearchResultsSkeleton } from "@/features/search/components/search-results-list"
import { CONTAINER } from "@/lib/container"

export default async function SearchPage(props: { searchParams: Promise<{ q?: string }> }) {
	const { q } = await props.searchParams
	const query = q?.trim() ?? ""

	const t = await getTranslations("app")

	return (
		<main className={`${CONTAINER} flex flex-col gap-6 py-6 sm:py-8`}>
			<h1 className="sr-only">{t("title")}</h1>

			<SearchBar initialQuery={query} />

			{query ? (
				<Suspense key={query} fallback={<SearchResultsSkeleton />}>
					<SearchResults query={query} />
				</Suspense>
			) : (
				<SearchPrompt />
			)}
		</main>
	)
}
