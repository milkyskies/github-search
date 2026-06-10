import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { LocaleSwitcher } from "./locale-switcher"
import { PageContainer } from "./page-container"
import { ThemeToggle } from "./theme-toggle"

export function AppHeader() {
	const t = useTranslations("app")

	return (
		<header className="sticky top-0 z-20 border-border border-b bg-background/80 backdrop-blur">
			<PageContainer className="flex h-16 items-center justify-between gap-4">
				<Link
					href="/"
					className="shrink-0 rounded-sm font-mono font-semibold text-base tracking-tight transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
