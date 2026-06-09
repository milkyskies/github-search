import { useTranslations } from "next-intl"

interface SearchEmptyProps {
	query: string
}

export function SearchEmpty(props: SearchEmptyProps) {
	const t = useTranslations("search")

	return (
		<p className="py-12 text-center text-muted-foreground">{t("empty", { query: props.query })}</p>
	)
}
