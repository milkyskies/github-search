import { screen } from "@testing-library/react"
import { renderWithProviders } from "@tests/test-utils"
import { describe, expect, it, vi } from "vitest"
import type { GithubError } from "@/services/github/github.errors"
import { SearchError } from "./search-error"

vi.mock("@/features/shared/retry-action", () => ({ retryGithubFetch: vi.fn() }))

describe("SearchError", () => {
	it("一時的なエラーには再試行コントロールを表示する", () => {
		const error: GithubError = { kind: "rateLimited", resetAt: undefined }

		renderWithProviders(<SearchError error={error} />)

		expect(screen.getByRole("button", { name: "Try again" })).toBeInTheDocument()
	})

	it("一時的でない parse エラーには再試行を表示しない", () => {
		const error: GithubError = { kind: "parse" }

		renderWithProviders(<SearchError error={error} />)

		expect(screen.getByRole("alert")).toBeInTheDocument()
		expect(screen.queryByRole("button")).not.toBeInTheDocument()
	})

	it("不正なクエリには再試行を表示しない", () => {
		const error: GithubError = { kind: "invalidQuery", message: "Validation Failed" }

		renderWithProviders(<SearchError error={error} />)

		expect(screen.getByRole("alert")).toBeInTheDocument()
		expect(screen.queryByRole("button")).not.toBeInTheDocument()
	})
})
