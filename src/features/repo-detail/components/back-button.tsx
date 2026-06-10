"use client"

import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import type { MouseEventHandler } from "react"
import { Link } from "@/i18n/navigation"

export function BackButton() {
	const t = useTranslations("detail")
	const router = useRouter()

	const onClick: MouseEventHandler<HTMLAnchorElement> = (event) => {
		if (window.history.length > 1) {
			event.preventDefault()
			router.back()
		}
	}

	return (
		<Link
			href="/"
			onClick={onClick}
			className="inline-flex items-center gap-1 self-start rounded-sm text-muted-foreground text-sm transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
		>
			<ArrowLeft className="size-4" aria-hidden="true" />
			{t("backToSearch")}
		</Link>
	)
}
