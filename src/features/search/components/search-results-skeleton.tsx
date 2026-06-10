const SKELETON_KEYS = ["a", "b", "c", "d", "e"]

export function SearchResultsSkeleton() {
	return (
		<ul className="flex flex-col gap-2">
			{SKELETON_KEYS.map((key) => (
				<li key={key} className="h-[72px] animate-pulse rounded-lg border border-border bg-card" />
			))}
		</ul>
	)
}
