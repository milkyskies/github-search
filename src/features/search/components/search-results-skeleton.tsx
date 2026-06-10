const SKELETON_KEYS = ["a", "b", "c", "d", "e", "f"]

export function SearchResultsSkeleton() {
	return (
		<div className="overflow-hidden rounded-lg border border-border">
			<div className="border-border border-b bg-muted/50 px-4 py-2.5">
				<div className="h-3 w-28 animate-pulse rounded bg-border" />
			</div>

			<ul className="divide-y divide-border">
				{SKELETON_KEYS.map((key) => (
					<li key={key} className="flex items-center gap-4 py-4 pr-2 pl-4">
						<div className="size-9 shrink-0 animate-pulse rounded-full bg-muted" />

						<div className="flex-1 space-y-2">
							<div className="h-3.5 w-2/5 animate-pulse rounded bg-muted" />
							<div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
						</div>
					</li>
				))}
			</ul>
		</div>
	)
}
