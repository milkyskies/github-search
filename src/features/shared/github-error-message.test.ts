import { describe, expect, it } from "vitest"
import type { GithubError } from "@/services/github/github.errors"
import { type GithubErrorMessageKey, githubErrorMessageKey } from "./github-error-message"

const cases: ReadonlyArray<{ error: GithubError; key: GithubErrorMessageKey }> = [
	{ error: { kind: "rateLimited", resetAt: undefined }, key: "rateLimited" },
	{ error: { kind: "network" }, key: "network" },
	{ error: { kind: "timeout" }, key: "network" },
	{ error: { kind: "invalidQuery", message: "Invalid" }, key: "invalidQuery" },
	{ error: { kind: "notFound" }, key: "generic" },
	{ error: { kind: "parse" }, key: "generic" },
	{ error: { kind: "unexpected", status: 500 }, key: "generic" },
]

describe("githubErrorMessageKey", () => {
	it.each(cases)("$error.kind を $key メッセージキーに対応させる", ({ error, key }) => {
		expect(githubErrorMessageKey(error)).toBe(key)
	})
})
