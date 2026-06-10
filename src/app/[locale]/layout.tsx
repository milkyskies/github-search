import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { hasLocale, NextIntlClientProvider } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"
import type { ReactNode } from "react"
import { AppHeader } from "@/features/shared/components/app-header"
import { routing } from "@/i18n/routing"

export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata(props: {
	params: Promise<{ locale: string }>
}): Promise<Metadata> {
	const { locale } = await props.params

	if (!hasLocale(routing.locales, locale)) {
		notFound()
	}

	const t = await getTranslations({ locale, namespace: "app" })

	return {
		title: t("title"),
		description: t("description"),
	}
}

export default async function LocaleLayout(props: {
	children: ReactNode
	params: Promise<{ locale: string }>
}) {
	const { locale } = await props.params

	if (!hasLocale(routing.locales, locale)) {
		notFound()
	}

	setRequestLocale(locale)

	return (
		<NextIntlClientProvider>
			<AppHeader />

			{props.children}
		</NextIntlClientProvider>
	)
}
