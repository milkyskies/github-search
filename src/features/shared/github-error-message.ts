import type { GithubError } from "@/services/github/github.errors"

export type GithubErrorMessageKey = "rateLimited" | "network" | "invalidQuery" | "generic"

export function githubErrorMessageKey(error: GithubError): GithubErrorMessageKey {
	switch (error.kind) {
		case "rateLimited":
			return "rateLimited"
		case "network":
		case "timeout":
			return "network"
		case "invalidQuery":
			return "invalidQuery"
		case "notFound":
		case "parse":
		case "unexpected":
			return "generic"
		default: {
			const _exhaustive: never = error

			return _exhaustive
		}
	}
}
