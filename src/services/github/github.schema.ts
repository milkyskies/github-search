import { z } from "zod"
import type { RepositorySummary } from "@/models/repository"

export const repositorySummarySchema = z
	.object({
		id: z.number(),
		full_name: z.string(),
		description: z.string().nullable(),
		language: z.string().nullable(),
		stargazers_count: z.number(),
		html_url: z.string(),
		owner: z.object({
			login: z.string(),
			avatar_url: z.string(),
		}),
	})
	.transform(
		(raw): RepositorySummary => ({
			id: raw.id,
			fullName: raw.full_name,
			description: raw.description ?? undefined,
			language: raw.language ?? undefined,
			stars: raw.stargazers_count,
			htmlUrl: raw.html_url,
			owner: { login: raw.owner.login, avatarUrl: raw.owner.avatar_url },
		}),
	)

export const searchResponseSchema = z
	.object({
		total_count: z.number(),
		items: z.array(repositorySummarySchema),
	})
	.transform((raw) => ({ totalCount: raw.total_count, items: raw.items }))

export type SearchResult = z.infer<typeof searchResponseSchema>
