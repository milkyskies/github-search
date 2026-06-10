import { GithubService } from "@/services/github/github.service"
import { toSearchViewState } from "../search-view-state"
import { SearchEmpty } from "./search-empty"
import { SearchError } from "./search-error"
import { SearchResultsList } from "./search-results-list"

interface SearchResultsProps {
	query: string
}

export async function SearchResults(props: SearchResultsProps) {
	const result = await GithubService.searchRepositories(props.query)
	const state = toSearchViewState(result)

	switch (state.kind) {
		case "error":
			return <SearchError error={state.error} />
		case "empty":
			return <SearchEmpty query={props.query} />
		case "results":
			return (
				<SearchResultsList
					key={props.query}
					query={props.query}
					totalCount={state.totalCount}
					initialItems={state.items}
				/>
			)
		default: {
			const _exhaustive: never = state

			return _exhaustive
		}
	}
}
