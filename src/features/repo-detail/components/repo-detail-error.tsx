import { useTranslations } from "next-intl"
import { githubErrorMessageKey } from "@/features/shared/github-error-message"
import type { GithubError } from "@/services/github/github.errors"

interface RepoDetailErrorProps {
	error: GithubError
}

export function RepoDetailError(props: RepoDetailErrorProps) {
	const t = useTranslations("detail.error")

	const messageKey = githubErrorMessageKey(props.error)

	return (
		<p role="alert" className="py-12 text-center text-destructive">
			{t(messageKey)}
		</p>
	)
}
