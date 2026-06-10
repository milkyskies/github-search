"use client"

import { useTranslations } from "next-intl"
import { Button } from "@/features/shared/components/button"
import { CONTAINER } from "@/lib/container"

interface RepoDetailErrorBoundaryProps {
	reset: () => void
}

export default function RepoDetailErrorBoundary(props: RepoDetailErrorBoundaryProps) {
	const t = useTranslations("detail.error")

	return (
		<main className={`${CONTAINER} flex flex-col items-center gap-4 py-16 text-center`}>
			<p role="alert" className="text-destructive">
				{t("generic")}
			</p>

			<Button onClick={props.reset}>{t("retry")}</Button>
		</main>
	)
}
