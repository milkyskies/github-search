import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { makeRepositoryDetail } from "@/models/repository.fixture"
import { RepoHeader } from "./repo-header"

const meta = {
	title: "repo-detail/RepoHeader",
	component: RepoHeader,
	parameters: { layout: "padded" },
	tags: ["autodocs"],
	args: { repository: makeRepositoryDetail() },
} satisfies Meta<typeof RepoHeader>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const NoLanguage: Story = {
	args: { repository: makeRepositoryDetail({ language: undefined }) },
}
