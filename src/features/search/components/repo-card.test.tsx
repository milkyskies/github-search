import { screen } from "@testing-library/react"
import { renderWithProviders } from "@tests/test-utils"
import { describe, expect, it } from "vitest"
import { makeRepositorySummary } from "@/models/repository.fixture"
import { RepoCard } from "./repo-card"

const repository = makeRepositorySummary()

describe("RepoCard", () => {
	it("renders the full name and links to the detail page", () => {
		renderWithProviders(<RepoCard repository={repository} />)

		expect(screen.getByText("facebook/react")).toBeInTheDocument()
		expect(screen.getByRole("link").getAttribute("href")).toContain("/repos/facebook/react")
	})

	it("formats the star count compactly", () => {
		renderWithProviders(<RepoCard repository={repository} />)

		expect(screen.getByText("228K")).toBeInTheDocument()
	})

	it("omits language when absent", () => {
		renderWithProviders(<RepoCard repository={{ ...repository, language: undefined }} />)

		expect(screen.queryByText("JavaScript")).not.toBeInTheDocument()
	})
})
