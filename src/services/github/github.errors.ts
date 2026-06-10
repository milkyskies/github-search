export type GithubError =
	| { kind: "rateLimited"; resetAt: Date | undefined }
	| { kind: "notFound" }
	| { kind: "invalidQuery"; message: string }
	| { kind: "network" }
	| { kind: "timeout" }
	| { kind: "parse" }
	| { kind: "unexpected"; status: number }

export type GithubResult<T> = { kind: "ok"; data: T } | { kind: "error"; error: GithubError }

export function isTransientGithubError(error: GithubError): boolean {
	switch (error.kind) {
		case "rateLimited":
		case "network":
		case "timeout":
		case "unexpected":
			return true
		case "notFound":
		case "invalidQuery":
		case "parse":
			return false
		default: {
			const _exhaustive: never = error

			return _exhaustive
		}
	}
}
