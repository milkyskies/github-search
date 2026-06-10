import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { SearchEmpty } from "./search-empty"

const meta = {
	title: "search/SearchEmpty",
	component: SearchEmpty,
	parameters: { layout: "padded" },
	tags: ["autodocs"],
	args: { query: "asdfqwerzxcv" },
} satisfies Meta<typeof SearchEmpty>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
