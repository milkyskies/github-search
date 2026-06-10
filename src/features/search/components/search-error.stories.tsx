import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { SearchError } from "./search-error"

const meta = {
	title: "search/SearchError",
	component: SearchError,
	parameters: { layout: "padded" },
	tags: ["autodocs"],
} satisfies Meta<typeof SearchError>

export default meta

type Story = StoryObj<typeof meta>

export const RateLimited: Story = {
	args: { error: { kind: "rateLimited", resetAt: undefined } },
}

export const Network: Story = {
	args: { error: { kind: "network" } },
}

export const InvalidQuery: Story = {
	args: { error: { kind: "invalidQuery", message: "Validation Failed" } },
}

export const Unexpected: Story = {
	args: { error: { kind: "unexpected", status: 500 } },
}
