import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { makeRepositorySummary } from "@/models/repository.fixture"
import { RepoCard } from "./repo-card"

const repository = makeRepositorySummary()

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
