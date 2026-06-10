"use client"

import { useTranslations } from "next-intl"
import { type FormEvent, useTransition } from "react"
import { Button } from "@/features/shared/components/button"
import { TextField } from "@/features/shared/components/text-field"
import { usePathname, useRouter } from "@/i18n/navigation"

interface SearchBarProps {
	initialQuery: string
}

export function SearchBar(props: SearchBarProps) {
	const t = useTranslations("search")
	const router = useRouter()
	const pathname = usePathname()
	const [isPending, startTransition] = useTransition()

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()

		const value = new FormData(event.currentTarget).get("q")
		const query = typeof value === "string" ? value.trim() : ""
		const target = query ? `${pathname}?q=${encodeURIComponent(query)}` : pathname

		startTransition(() => {
			router.replace(target)
		})
	}

	return (
		<form
			method="GET"
			onSubmit={handleSubmit}
			aria-busy={isPending}
			className="flex flex-col gap-2 sm:flex-row"
		>
			<TextField
				name="q"
				type="search"
				defaultValue={props.initialQuery}
				placeholder={t("placeholder")}
				aria-label={t("placeholder")}
				className="flex-1"
			/>

			<Button type="submit">{t("button")}</Button>
		</form>
	)
}
