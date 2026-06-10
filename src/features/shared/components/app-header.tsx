import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { LocaleSwitcher } from "./locale-switcher"
import { PageContainer } from "./page-container"
import { ThemeToggle } from "./theme-toggle"

export function AppHeader() {
	const t = useTranslations("app")

	return (
		<header className="sticky top-0 z-10 border-border border-b bg-background/80 backdrop-blur">
			<PageContainer className="flex items-center justify-between gap-4 py-4">
				<Link
					href="/"
					className="truncate rounded-sm font-semibold text-lg transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
				>
					{t("title")}
				</Link>

				<div className="flex shrink-0 items-center gap-2">
					<ThemeToggle />

					<LocaleSwitcher />
				</div>
			</PageContainer>
		</header>
	)
}
