export type GithubError =
	| { kind: "rateLimited"; resetAt: Date | undefined }
	| { kind: "notFound" }
	| { kind: "invalidQuery"; message: string }
	| { kind: "network" }
	| { kind: "timeout" }
	| { kind: "parse" }
	| { kind: "unexpected"; status: number }

export type GithubResult<T> = { kind: "ok"; data: T } | { kind: "error"; error: GithubError }
