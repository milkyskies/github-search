import { describe, expect, it } from "vitest"
import { type GithubError, isTransientGithubError } from "./github.errors"

const cases: ReadonlyArray<{ error: GithubError; transient: boolean }> = [
	{ error: { kind: "rateLimited", resetAt: undefined }, transient: true },
	{ error: { kind: "network" }, transient: true },
	{ error: { kind: "timeout" }, transient: true },
	{ error: { kind: "unexpected", status: 503 }, transient: true },
	{ error: { kind: "notFound" }, transient: false },
	{ error: { kind: "invalidQuery", message: "Invalid" }, transient: false },
	{ error: { kind: "parse" }, transient: false },
]

describe("isTransientGithubError", () => {
	it.each(cases)("$error.kind を transient=$transient と判定する", ({ error, transient }) => {
		expect(isTransientGithubError(error)).toBe(transient)
	})
})
