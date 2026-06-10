"use client"

import { Loader2, Search } from "lucide-react"
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

		startTransition(() => {
			router.replace(query ? `${pathname}?q=${encodeURIComponent(query)}` : pathname)
		})
	}

	return (
		<form method="GET" onSubmit={handleSubmit} aria-busy={isPending} className="flex gap-2">
			<div className="relative flex-1">
				<Search
					className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-3 size-4 text-muted-foreground"
					aria-hidden="true"
				/>

				<TextField
					name="q"
					type="search"
					defaultValue={props.initialQuery}
					placeholder={t("placeholder")}
					aria-label={t("placeholder")}
					className="pl-9"
				/>
			</div>

			<Button type="submit" disabled={isPending} className="shrink-0 sm:w-24">
				{isPending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : t("button")}
			</Button>
		</form>
	)
}
