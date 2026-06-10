import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { RepoDetailError } from "./repo-detail-error"

const meta = {
	title: "repo-detail/RepoDetailError",
	component: RepoDetailError,
	parameters: { layout: "padded" },
	tags: ["autodocs"],
} satisfies Meta<typeof RepoDetailError>

export default meta

type Story = StoryObj<typeof meta>

export const RateLimited: Story = {
	args: { error: { kind: "rateLimited", resetAt: undefined } },
}

export const Network: Story = {
	args: { error: { kind: "network" } },
}

export const Unexpected: Story = {
	args: { error: { kind: "unexpected", status: 500 } },
}
