import type { ElementType, ReactNode } from "react"
import { cn } from "@/lib/utils"

interface PageContainerProps {
	as?: ElementType
	className?: string
	children: ReactNode
}

export function PageContainer({ as: Component = "div", className, children }: PageContainerProps) {
	return (
		<Component className={cn("mx-auto w-full max-w-3xl px-4 sm:px-6", className)}>
			{children}
		</Component>
	)
}
