import type { z } from "zod"
import { getEnv } from "@/config/env"
import { fetchJson, type HttpError, type HttpResult } from "@/lib/http"
import type { GithubError, GithubResult } from "./github.errors"

const DEFAULT_BASE_URL = "https://api.github.com"
const ACCEPT_HEADER = "application/vnd.github+json"
const API_VERSION = "2022-11-28"

export const GITHUB_CACHE_TAG = "github"

const baseUrl = getEnv("GITHUB_API_BASE_URL") ?? DEFAULT_BASE_URL

interface RequestOptions {
	revalidate?: number
}

export const GithubClient = {
	async request<T>(
		path: string,
		schema: z.ZodType<T>,
		options?: RequestOptions,
	): Promise<GithubResult<T>> {
		const result = await fetchJson(`${baseUrl}${path}`, schema, {
			init: {
				headers: requestHeaders(),
				next: { revalidate: options?.revalidate, tags: [GITHUB_CACHE_TAG] },
			},
		})

		return toGithubResult(result)
	},
}

function requestHeaders(): HeadersInit {
	const token = getEnv("GITHUB_TOKEN")

	return {
		Accept: ACCEPT_HEADER,
		"X-GitHub-Api-Version": API_VERSION,
		...(token ? { Authorization: `Bearer ${token}` } : {}),
	}
}

function toGithubResult<T>(result: HttpResult<T>): GithubResult<T> {
	if (result.kind === "ok") {
		return { kind: "ok", data: result.data }
	}

	return { kind: "error", error: toGithubError(result.error) }
}

function toGithubError(error: HttpError): GithubError {
	switch (error.kind) {
		case "network":
			return { kind: "network" }
		case "timeout":
			return { kind: "timeout" }
		case "invalidBody":
		case "parse":
			return { kind: "parse" }
		case "status":
			return fromStatus(error.status, error.headers)
		default: {
			const _exhaustive: never = error

			return _exhaustive
		}
	}
}

function fromStatus(status: number, headers: Headers): GithubError {
	if (status === 404) return { kind: "notFound" }

	if (status === 422) return { kind: "invalidQuery", message: "Invalid search query" }

	const remaining = headers.get("x-ratelimit-remaining")
	const retryAfter = headers.get("retry-after")

	if (status === 429 || (status === 403 && (remaining === "0" || retryAfter))) {
		return { kind: "rateLimited", resetAt: rateLimitResetAt(headers) }
	}

	return { kind: "unexpected", status }
}

function rateLimitResetAt(headers: Headers): Date | undefined {
	const reset = headers.get("x-ratelimit-reset")

	if (reset) return new Date(Number(reset) * 1000)

	const retryAfter = headers.get("retry-after")

	if (retryAfter) return new Date(Date.now() + Number(retryAfter) * 1000)

	return undefined
}
