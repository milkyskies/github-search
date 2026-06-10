import { useTranslations } from "next-intl"
import { PageContainer } from "@/features/shared/components/page-container"
import { Link } from "@/i18n/navigation"

export default function RepoNotFound() {
	const t = useTranslations("detail")

	return (
		<PageContainer as="main" className="flex flex-col items-center gap-4 py-16 text-center">
			<h1 className="font-semibold text-2xl">{t("notFound.title")}</h1>

			<p className="text-muted-foreground">{t("notFound.message")}</p>

			<Link href="/" className="text-primary text-sm hover:underline">
				{t("backToSearch")}
			</Link>
		</PageContainer>
	)
}
