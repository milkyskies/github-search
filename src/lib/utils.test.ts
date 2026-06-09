import { describe, expect, it } from "vitest"
import { cn } from "./utils"

describe("cn", () => {
	it("joins class names and drops falsy values", () => {
		expect(cn("px-2", false && "hidden", undefined, "py-2")).toBe("px-2 py-2")
	})

	it("resolves conflicting tailwind classes so the last one wins", () => {
		expect(cn("px-2", "px-4")).toBe("px-4")
	})
})
