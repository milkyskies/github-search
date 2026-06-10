import { useTranslations } from "next-intl"
import { githubErrorMessageKey } from "@/features/shared/github-error-message"
import { type GithubError, isTransientGithubError } from "@/services/github/github.errors"
import { RetryButton } from "./retry-button"

interface GithubErrorDisplayProps {
	error: GithubError
	namespace: "search.error" | "detail.error"
}

export function GithubErrorDisplay(props: GithubErrorDisplayProps) {
	const t = useTranslations(props.namespace)

	const messageKey = githubErrorMessageKey(props.error)

	return (
		<div className="flex flex-col items-center gap-4 py-12 text-center">
			<p role="alert" className="text-destructive">
				{t(messageKey)}
			</p>

			{isTransientGithubError(props.error) ? <RetryButton label={t("retry")} /> : null}
		</div>
	)
}
