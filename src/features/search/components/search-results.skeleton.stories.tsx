import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { SearchResultsSkeleton } from "./search-results.skeleton"

const meta = {
	title: "search/SearchResultsSkeleton",
	component: SearchResultsSkeleton,
	parameters: { layout: "padded" },
	tags: ["autodocs"],
} satisfies Meta<typeof SearchResultsSkeleton>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
