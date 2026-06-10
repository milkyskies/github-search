import type { Metadata } from "next"
import { IBM_Plex_Sans_JP, JetBrains_Mono } from "next/font/google"
import { notFound } from "next/navigation"
import { hasLocale, NextIntlClientProvider } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"
import type { ReactNode } from "react"
import { AppHeader } from "@/features/shared/components/app-header"
import { ThemeProvider } from "@/features/shared/components/theme-provider"
import { routing } from "@/i18n/routing"
import "../globals.css"

const ibmPlexSansJp = IBM_Plex_Sans_JP({
	variable: "--font-ibm-plex-sans-jp",
	subsets: ["latin"],
	weight: ["400", "500", "600"],
})

const jetbrainsMono = JetBrains_Mono({
	variable: "--font-jetbrains-mono",
	subsets: ["latin"],
})

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
		<html
			lang={locale}
			suppressHydrationWarning
			className={`${ibmPlexSansJp.variable} ${jetbrainsMono.variable} h-full antialiased`}
		>
			<body className="flex min-h-full flex-col">
				<NextIntlClientProvider>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						<AppHeader />

						{props.children}
					</ThemeProvider>
				</NextIntlClientProvider>
			</body>
		</html>
	)
}
