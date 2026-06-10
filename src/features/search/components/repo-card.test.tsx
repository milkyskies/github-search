import { screen } from "@testing-library/react"
import { renderWithProviders } from "@tests/test-utils"
import { describe, expect, it } from "vitest"
import { makeRepositorySummary } from "@/models/repository.fixture"
import { RepoCard } from "./repo-card"

const repository = makeRepositorySummary()

describe("RepoCard", () => {
	it("リポジトリ名を表示し詳細ページへリンクする", () => {
		renderWithProviders(<RepoCard repository={repository} />)

		expect(screen.getByText("facebook/react")).toBeInTheDocument()
		expect(screen.getByRole("link").getAttribute("href")).toContain("/repos/facebook/react")
	})

	it("スター数を簡潔な表記でフォーマットする", () => {
		renderWithProviders(<RepoCard repository={repository} />)

		expect(screen.getByText("228K")).toBeInTheDocument()
	})

	it("言語が無い場合は表示しない", () => {
		renderWithProviders(<RepoCard repository={{ ...repository, language: undefined }} />)

		expect(screen.queryByText("JavaScript")).not.toBeInTheDocument()
	})
})
