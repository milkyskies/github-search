import { screen } from "@testing-library/react"
import { renderWithProviders } from "@tests/test-utils"
import { describe, expect, it } from "vitest"
import type { RepositorySummary } from "@/models/repository"
import { RepoCard } from "./repo-card"

const repository: RepositorySummary = {
	id: 10270250,
	fullName: "facebook/react",
	description: "The library for web and native user interfaces.",
	language: "JavaScript",
	stars: 228000,
	htmlUrl: "https://github.com/facebook/react",
	owner: { login: "facebook", avatarUrl: "https://avatars.githubusercontent.com/u/69631?v=4" },
}

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
