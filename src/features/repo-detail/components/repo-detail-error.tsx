import { GithubErrorDisplay } from "@/features/shared/components/github-error-display"
import type { GithubError } from "@/services/github/github.errors"

interface RepoDetailErrorProps {
	error: GithubError
}

export function RepoDetailError(props: RepoDetailErrorProps) {
	return <GithubErrorDisplay error={props.error} namespace="detail.error" />
}
