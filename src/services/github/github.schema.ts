import { z } from "zod"
import type { RepositoryDetail, RepositorySummary } from "@/models/repository"

const ownerSchema = z.object({
	login: z.string(),
	avatar_url: z.string(),
})

const repositoryBaseSchema = z.object({
	id: z.number(),
	full_name: z.string(),
	description: z.string().nullable(),
	language: z.string().nullable(),
	stargazers_count: z.number(),
	html_url: z.string(),
	owner: ownerSchema,
})

function toRepositorySummary(raw: z.infer<typeof repositoryBaseSchema>): RepositorySummary {
	return {
		id: raw.id,
		fullName: raw.full_name,
		description: raw.description ?? undefined,
		language: raw.language ?? undefined,
		stars: raw.stargazers_count,
		htmlUrl: raw.html_url,
		owner: { login: raw.owner.login, avatarUrl: raw.owner.avatar_url },
	}
}

export const repositorySummarySchema = repositoryBaseSchema.transform(toRepositorySummary)

export const searchResponseSchema = z
	.object({
		total_count: z.number(),
		items: z.array(repositorySummarySchema),
	})
	.transform((raw) => ({ totalCount: raw.total_count, items: raw.items }))

export type SearchResult = z.infer<typeof searchResponseSchema>

export const repositoryDetailSchema = repositoryBaseSchema
	.extend({
		subscribers_count: z.number(),
		forks_count: z.number(),
		open_issues_count: z.number(),
	})
	.transform(
		(raw): RepositoryDetail => ({
			...toRepositorySummary(raw),
			watchers: raw.subscribers_count,
			forks: raw.forks_count,
			openIssues: raw.open_issues_count,
		}),
	)
