import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { SearchPrompt } from "./search-prompt"

const meta = {
	title: "search/SearchPrompt",
	component: SearchPrompt,
	parameters: { layout: "padded" },
	tags: ["autodocs"],
} satisfies Meta<typeof SearchPrompt>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
