import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { makeRepositoryDetail } from "@/models/repository.fixture"
import { StatGrid } from "./stat-grid"

const meta = {
	title: "repo-detail/StatGrid",
	component: StatGrid,
	parameters: { layout: "padded" },
	tags: ["autodocs"],
	args: { repository: makeRepositoryDetail() },
} satisfies Meta<typeof StatGrid>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
