import { notFound } from "next/navigation"
import { hasLocale } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"
import { routing } from "@/i18n/routing"

export default async function HomePage(props: { params: Promise<{ locale: string }> }) {
	const { locale } = await props.params

	if (!hasLocale(routing.locales, locale)) {
		notFound()
	}

	setRequestLocale(locale)

	const t = await getTranslations("app")

	return (
		<main className="mx-auto flex w-full max-w-2xl flex-col gap-3 p-8">
			<h1 className="text-2xl font-semibold">{t("title")}</h1>
			<p className="text-muted-foreground">{t("description")}</p>
		</main>
	)
}
