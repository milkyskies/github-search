import { describe, expect, it } from "vitest"
import { hasMoreResults, SEARCH_RESULT_CAP } from "./pagination"

describe("hasMoreResults", () => {
	it("is true while fewer than the total are loaded", () => {
		expect(hasMoreResults(20, 100)).toBe(true)
	})

	it("is false once every result is loaded", () => {
		expect(hasMoreResults(100, 100)).toBe(false)
	})

	it("stops at GitHub's 1000-result cap even when the total is larger", () => {
		expect(hasMoreResults(980, 5000)).toBe(true)
		expect(hasMoreResults(SEARCH_RESULT_CAP, 5000)).toBe(false)
	})
})
