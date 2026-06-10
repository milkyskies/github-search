import { IBM_Plex_Sans_JP, JetBrains_Mono } from "next/font/google"
import { getLocale } from "next-intl/server"
import type { ReactNode } from "react"
import { ThemeProvider } from "@/features/shared/components/theme-provider"
import "./globals.css"

const ibmPlexSansJp = IBM_Plex_Sans_JP({
	variable: "--font-ibm-plex-sans-jp",
	subsets: ["latin"],
	weight: ["400", "500", "600"],
})

const jetbrainsMono = JetBrains_Mono({
	variable: "--font-jetbrains-mono",
	subsets: ["latin"],
})

export default async function RootLayout(props: { children: ReactNode }) {
	const locale = await getLocale()

	return (
		<html
			lang={locale}
			suppressHydrationWarning
			className={`${ibmPlexSansJp.variable} ${jetbrainsMono.variable} h-full antialiased`}
		>
			<body className="flex min-h-full flex-col">
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					{props.children}
				</ThemeProvider>
			</body>
		</html>
	)
}
