import { describe, expect, it } from "vitest"
import { makeRepositorySummary } from "@/models/repository.fixture"
import { appendUnique, hasMoreResults, SEARCH_RESULT_CAP } from "./pagination"

const withId = (id: number) => makeRepositorySummary({ id })

describe("hasMoreResults", () => {
	it("読み込み済みが総数より少ない間は true を返す", () => {
		expect(hasMoreResults(20, 100)).toBe(true)
	})

	it("すべて読み込み終えたら false を返す", () => {
		expect(hasMoreResults(100, 100)).toBe(false)
	})

	it("総数がより大きくても GitHub の 1000 件上限で停止する", () => {
		expect(hasMoreResults(980, 5000)).toBe(true)
		expect(hasMoreResults(SEARCH_RESULT_CAP, 5000)).toBe(false)
	})
})

describe("appendUnique", () => {
	it("重複しない次ページはすべて末尾に追加する", () => {
		const merged = appendUnique([withId(1), withId(2)], [withId(3), withId(4)])

		expect(merged.map((repository) => repository.id)).toEqual([1, 2, 3, 4])
	})

	it("既に読み込んだ id を除外し、順序を保つ", () => {
		const merged = appendUnique([withId(1), withId(2)], [withId(2), withId(3)])

		expect(merged.map((repository) => repository.id)).toEqual([1, 2, 3])
	})

	it("次ページが空なら元の配列をそのまま返す", () => {
		const merged = appendUnique([withId(1), withId(2)], [])

		expect(merged.map((repository) => repository.id)).toEqual([1, 2])
	})
})
