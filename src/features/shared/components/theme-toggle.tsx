"use client"

import { Toggle } from "@base-ui/react/toggle"
import { ToggleGroup } from "@base-ui/react/toggle-group"
import { Monitor, Moon, Sun } from "lucide-react"
import { useTranslations } from "next-intl"
import { useTheme } from "next-themes"

const THEMES = [
	{ value: "light", Icon: Sun },
	{ value: "system", Icon: Monitor },
	{ value: "dark", Icon: Moon },
] as const

export function ThemeToggle() {
	const t = useTranslations("header.theme")
	const { theme, setTheme } = useTheme()

	return (
		<ToggleGroup
			value={[theme ?? "system"]}
			onValueChange={(value) => {
				const next = value[0]

				if (next) setTheme(next)
			}}
			aria-label={t("label")}
			className="flex items-center gap-0.5 rounded-md border border-border p-0.5"
		>
			{THEMES.map(({ value, Icon }) => (
				<Toggle
					key={value}
					value={value}
					aria-label={t(value)}
					className="flex size-7 items-center justify-center rounded text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring data-[pressed]:bg-accent data-[pressed]:text-foreground"
				>
					<Icon className="size-4" aria-hidden="true" />
				</Toggle>
			))}
		</ToggleGroup>
	)
}
