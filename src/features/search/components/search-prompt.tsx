import { Search } from "lucide-react"
import { useTranslations } from "next-intl"

export function SearchPrompt() {
	const t = useTranslations("search")

	return (
		<div className="flex flex-col items-center gap-4 py-24 text-center">
			<div className="flex size-12 items-center justify-center rounded-full border border-border text-muted-foreground">
				<Search className="size-5" aria-hidden="true" />
			</div>

			<p className="max-w-xs text-balance text-muted-foreground">{t("prompt")}</p>
		</div>
	)
}
