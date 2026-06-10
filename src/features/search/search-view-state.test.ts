import { describe, expect, it } from "vitest"
import type { RepositorySummary } from "@/models/repository"
import { toSearchViewState } from "./search-view-state"

const repository: RepositorySummary = {
	id: 1,
	fullName: "facebook/react",
	description: "The library for web and native user interfaces",
	language: "JavaScript",
	stars: 220000,
	htmlUrl: "https://github.com/facebook/react",
	owner: { login: "facebook", avatarUrl: "https://avatars.githubusercontent.com/u/69631" },
}

describe("toSearchViewState", () => {
	it("エラー結果を error ステートに変換する", () => {
		const state = toSearchViewState({ kind: "error", error: { kind: "network" } })

		expect(state).toEqual({ kind: "error", error: { kind: "network" } })
	})

	it("0 件の結果を empty ステートに変換する", () => {
		const state = toSearchViewState({ kind: "ok", data: { totalCount: 0, items: [] } })

		expect(state).toEqual({ kind: "empty" })
	})

	it("結果ありを results ステートに変換する", () => {
		const state = toSearchViewState({ kind: "ok", data: { totalCount: 1, items: [repository] } })

		expect(state).toEqual({ kind: "results", totalCount: 1, items: [repository] })
	})
})
