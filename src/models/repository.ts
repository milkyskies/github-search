export interface RepositorySummary {
	readonly id: number
	readonly fullName: string
	readonly description: string | undefined
	readonly language: string | undefined
	readonly stars: number
	readonly htmlUrl: string
	readonly owner: {
		readonly login: string
		readonly avatarUrl: string
	}
}

export interface RepositoryDetail extends RepositorySummary {
	readonly watchers: number
	readonly forks: number
	readonly openIssues: number
}
