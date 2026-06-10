import { Skeleton } from "@/features/shared/components/skeleton"

const SKELETON_KEYS = ["a", "b", "c", "d", "e", "f"]

export function SearchResultsSkeleton() {
	return (
		<div className="overflow-hidden rounded-lg border border-border">
			<div className="border-border border-b bg-muted/50 px-4 py-2.5">
				<Skeleton className="h-3 w-28 bg-border" />
			</div>

			<ul className="divide-y divide-border">
				{SKELETON_KEYS.map((key) => (
					<li
						key={key}
						className="flex items-center gap-4 border-l-2 border-transparent py-4 pr-2 pl-4"
					>
						<Skeleton className="size-9 shrink-0 rounded-full" />

						<div className="min-w-0 flex-1 space-y-2">
							<Skeleton className="h-3.5 w-2/5" />
							<Skeleton className="h-3 w-3/4" />
						</div>

						<div className="flex shrink-0 items-center gap-4">
							<Skeleton className="hidden h-3 w-16 sm:block" />
							<Skeleton className="h-3 w-10" />
						</div>
					</li>
				))}
			</ul>
		</div>
	)
}
