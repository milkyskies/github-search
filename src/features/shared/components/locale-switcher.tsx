"use client"

import { Select } from "@base-ui/react/select"
import { Check, ChevronsUpDown } from "lucide-react"
import { hasLocale, useLocale, useTranslations } from "next-intl"
import { usePathname, useRouter } from "@/i18n/navigation"
import { routing } from "@/i18n/routing"

const LOCALE_ITEMS = [
	{ value: "ja", label: "日本語" },
	{ value: "en", label: "English" },
]

export function LocaleSwitcher() {
	const t = useTranslations("header")
	const locale = useLocale()
	const router = useRouter()
	const pathname = usePathname()

	return (
		<Select.Root
			items={LOCALE_ITEMS}
			value={locale}
			onValueChange={(value) => {
				if (!hasLocale(routing.locales, value)) return

				router.replace(`${pathname}${window.location.search}`, { locale: value })
			}}
		>
			<Select.Trigger
				aria-label={t("language")}
				className="flex items-center gap-1 rounded-md border border-border px-2 py-1.5 text-sm transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
			>
				<Select.Value />
				<Select.Icon>
					<ChevronsUpDown className="size-4 text-muted-foreground" aria-hidden="true" />
				</Select.Icon>
			</Select.Trigger>

			<Select.Portal>
				<Select.Positioner sideOffset={6} className="z-50">
					<Select.Popup className="min-w-[8rem] rounded-md border border-border bg-card p-1 text-sm outline-none">
						{LOCALE_ITEMS.map((item) => (
							<Select.Item
								key={item.value}
								value={item.value}
								className="flex cursor-default items-center gap-2 rounded px-2 py-1.5 outline-none data-[highlighted]:bg-accent"
							>
								<span className="flex size-4 items-center justify-center">
									<Select.ItemIndicator>
										<Check className="size-4" aria-hidden="true" />
									</Select.ItemIndicator>
								</span>

								<Select.ItemText>{item.label}</Select.ItemText>
							</Select.Item>
						))}
					</Select.Popup>
				</Select.Positioner>
			</Select.Portal>
		</Select.Root>
	)
}
