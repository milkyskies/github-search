import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { notFound } from "next/navigation"
import { hasLocale, NextIntlClientProvider } from "next-intl"
import { getTranslations, setRequestLocale } from "next-intl/server"
import type { ReactNode } from "react"
import { AppHeader } from "@/features/shared/components/app-header"
import { ThemeProvider } from "@/features/shared/components/theme-provider"
import { routing } from "@/i18n/routing"
import "../globals.css"

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
})

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
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
			className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
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
