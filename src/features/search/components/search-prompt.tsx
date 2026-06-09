import { useTranslations } from "next-intl"

export function SearchPrompt() {
	const t = useTranslations("search")

	return <p className="py-12 text-center text-muted-foreground">{t("prompt")}</p>
}
