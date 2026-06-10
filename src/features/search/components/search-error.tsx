import { GithubErrorDisplay } from "@/features/shared/components/github-error-display"
import type { GithubError } from "@/services/github/github.errors"

interface SearchErrorProps {
	error: GithubError
}

export function SearchError(props: SearchErrorProps) {
	return <GithubErrorDisplay error={props.error} namespace="search.error" />
}
