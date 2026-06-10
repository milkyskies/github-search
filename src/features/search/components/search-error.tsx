import { useTranslations } from "next-intl"
import { githubErrorMessageKey } from "@/features/shared/github-error-message"
import type { GithubError } from "@/services/github/github.errors"

interface SearchErrorProps {
	error: GithubError
}

export function SearchError(props: SearchErrorProps) {
	const t = useTranslations("search.error")

	const messageKey = githubErrorMessageKey(props.error)

	return (
		<p role="alert" className="py-12 text-center text-destructive">
			{t(messageKey)}
		</p>
	)
}
