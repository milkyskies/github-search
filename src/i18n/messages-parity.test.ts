import { describe, expect, it } from "vitest"
import en from "../../messages/en.json"
import ja from "../../messages/ja.json"

function flattenKeys(value: unknown, prefix = ""): string[] {
	if (value === null || typeof value !== "object") {
		return [prefix]
	}

	return Object.entries(value).flatMap(([key, child]) => {
		const path = prefix ? `${prefix}.${key}` : key

		return flattenKeys(child, path)
	})
}

describe("message catalogs", () => {
	it("ja and en expose an identical set of keys", () => {
		const enKeys = flattenKeys(en).sort()
		const jaKeys = flattenKeys(ja).sort()

		expect(jaKeys).toEqual(enKeys)
	})
})
