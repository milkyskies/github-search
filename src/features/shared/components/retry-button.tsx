"use client"

import { Loader2 } from "lucide-react"
import { useTransition } from "react"
import { retryGithubFetch } from "@/features/shared/retry-action"
import { useRouter } from "@/i18n/navigation"
import { Button } from "./button"

interface RetryButtonProps {
	label: string
}

export function RetryButton(props: RetryButtonProps) {
	const router = useRouter()
	const [isPending, startTransition] = useTransition()

	function retry() {
		startTransition(async () => {
			await retryGithubFetch()
			router.refresh()
		})
	}

	return (
		<Button type="button" onClick={retry} disabled={isPending}>
			{isPending ? <Loader2 className="size-4 animate-spin" aria-hidden="true" /> : props.label}
		</Button>
	)
}
