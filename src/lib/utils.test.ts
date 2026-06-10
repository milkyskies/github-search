import { describe, expect, it } from "vitest"
import { cn } from "./utils"

describe("cn", () => {
	it("クラス名を結合し falsy な値を除外する", () => {
		expect(cn("px-2", false && "hidden", undefined, "py-2")).toBe("px-2 py-2")
	})

	it("競合する Tailwind クラスは後勝ちで解決する", () => {
		expect(cn("px-2", "px-4")).toBe("px-4")
	})
})
