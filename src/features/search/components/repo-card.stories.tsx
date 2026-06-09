import type { Meta, StoryObj } from "@storybook/nextjs-vite"
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

const meta = {
	title: "search/RepoCard",
	component: RepoCard,
	parameters: { layout: "padded" },
	tags: ["autodocs"],
	args: { repository },
} satisfies Meta<typeof RepoCard>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const NoDescription: Story = {
	args: { repository: { ...repository, description: undefined } },
}

export const NoLanguage: Story = {
	args: { repository: { ...repository, language: undefined } },
}
