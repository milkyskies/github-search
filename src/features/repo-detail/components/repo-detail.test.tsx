import { screen } from "@testing-library/react"
import { renderWithProviders } from "@tests/test-utils"
import { describe, expect, it } from "vitest"
import { makeRepositoryDetail } from "@/models/repository.fixture"
import { RepoDetail } from "./repo-detail"

describe("RepoDetail", () => {
	it("リポジトリ名と 4 つの統計値を表示する", () => {
		renderWithProviders(<RepoDetail repository={makeRepositoryDetail()} />)

		expect(screen.getByRole("heading", { name: "facebook/react" })).toBeInTheDocument()
		expect(screen.getByText("228,000")).toBeInTheDocument()
		expect(screen.getByText("6,700")).toBeInTheDocument()
		expect(screen.getByText("46,500")).toBeInTheDocument()
		expect(screen.getByText("980")).toBeInTheDocument()
	})

	it("言語が無い場合は表示しない", () => {
		renderWithProviders(<RepoDetail repository={makeRepositoryDetail({ language: undefined })} />)

		expect(screen.queryByText("JavaScript")).not.toBeInTheDocument()
	})
})
