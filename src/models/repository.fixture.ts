import type { RepositoryDetail, RepositorySummary } from "./repository"

export function makeRepositorySummary(overrides?: Partial<RepositorySummary>): RepositorySummary {
	return {
		id: 10270250,
		fullName: "facebook/react",
		description: "The library for web and native user interfaces.",
		language: "JavaScript",
		stars: 228000,
		htmlUrl: "https://github.com/facebook/react",
		owner: { login: "facebook", avatarUrl: "https://avatars.githubusercontent.com/u/69631?v=4" },
		...overrides,
	}
}

export function makeRepositoryDetail(overrides?: Partial<RepositoryDetail>): RepositoryDetail {
	return {
		id: 10270250,
		fullName: "facebook/react",
		description: "The library for web and native user interfaces.",
		language: "JavaScript",
		stars: 228000,
		watchers: 6700,
		forks: 46500,
		openIssues: 980,
		htmlUrl: "https://github.com/facebook/react",
		owner: { login: "facebook", avatarUrl: "https://avatars.githubusercontent.com/u/69631?v=4" },
		...overrides,
	}
}
