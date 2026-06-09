import { getTranslations } from "next-intl/server"
import { SearchBar } from "@/features/search/components/search-bar"

export default async function SearchPage(props: { searchParams: Promise<{ q?: string }> }) {
	const { q } = await props.searchParams
	const query = q?.trim() ?? ""

	const t = await getTranslations("app")

	return (
		<main className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-4 sm:p-8">
			<h1 className="font-semibold text-xl">{t("title")}</h1>

			<SearchBar initialQuery={query} />
		</main>
	)
}
