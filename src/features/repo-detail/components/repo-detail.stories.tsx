import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { makeRepositoryDetail } from "@/models/repository.fixture"
import { RepoDetail, RepoDetailSkeleton } from "./repo-detail"

const meta = {
	title: "repo-detail/RepoDetail",
	component: RepoDetail,
	parameters: { layout: "padded" },
	tags: ["autodocs"],
	args: { repository: makeRepositoryDetail() },
} satisfies Meta<typeof RepoDetail>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const NoDescriptionOrLanguage: Story = {
	args: { repository: makeRepositoryDetail({ description: undefined, language: undefined }) },
}

export const Skeleton: Story = {
	render: () => <RepoDetailSkeleton />,
}
