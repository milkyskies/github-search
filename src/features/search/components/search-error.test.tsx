import { screen } from "@testing-library/react"
import { renderWithProviders } from "@tests/test-utils"
import { describe, expect, it, vi } from "vitest"
import type { GithubError } from "@/services/github/github.errors"
import { SearchError } from "./search-error"

vi.mock("@/features/shared/retry-action", () => ({ retryGithubFetch: vi.fn() }))

describe("SearchError", () => {
	it("offers a retry control for a transient error", () => {
		const error: GithubError = { kind: "rateLimited", resetAt: undefined }

		renderWithProviders(<SearchError error={error} />)

		expect(screen.getByRole("button", { name: "Try again" })).toBeInTheDocument()
	})

	it("omits retry for a non-transient parse error", () => {
		const error: GithubError = { kind: "parse" }

		renderWithProviders(<SearchError error={error} />)

		expect(screen.getByRole("alert")).toBeInTheDocument()
		expect(screen.queryByRole("button")).not.toBeInTheDocument()
	})
})
