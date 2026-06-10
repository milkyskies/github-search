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
		<div className="flex flex-col gap-1 rounded-lg border border-border bg-card p-4">
			<dt className="flex items-center gap-2 text-muted-foreground text-sm">
				<Icon className="size-4" aria-hidden="true" />
				{props.label}
			</dt>

			<dd className="font-semibold text-2xl tabular-nums">{formatNumber(props.value)}</dd>
		</div>
	)
}
