import type { LucideIcon } from "lucide-react"
import { formatNumber } from "@/lib/format"

interface StatTileProps {
	icon: LucideIcon
	label: string
	value: number
}

export function StatTile(props: StatTileProps) {
	const Icon = props.icon

	return (
		<div className="flex flex-col gap-2 bg-card p-4">
			<dt className="flex items-center gap-1.5 font-mono text-[0.65rem] text-muted-foreground uppercase tracking-[0.15em]">
				<Icon className="size-3.5" aria-hidden="true" />
				{props.label}
			</dt>

			<dd className="font-mono font-semibold text-2xl tabular-nums tracking-tight sm:text-3xl">
				{formatNumber(props.value)}
			</dd>
		</div>
	)
}
