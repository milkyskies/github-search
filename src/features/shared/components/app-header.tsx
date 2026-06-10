import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { PageContainer } from "./page-container"

export function AppHeader() {
	const t = useTranslations("app")

	return (
		<header className="sticky top-0 z-10 border-border border-b bg-background/80 backdrop-blur">
			<PageContainer className="flex items-center py-4">
				<Link
					href="/"
					className="rounded-sm font-semibold text-lg transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
				>
					{t("title")}
				</Link>
			</PageContainer>
		</header>
	)
}
