import { describe, expect, it } from "vitest"
import { hasMoreResults, SEARCH_RESULT_CAP } from "./pagination"

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
