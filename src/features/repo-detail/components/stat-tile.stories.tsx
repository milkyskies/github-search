import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Star } from "lucide-react"
import { StatTile } from "./stat-tile"

const meta = {
	title: "repo-detail/StatTile",
	component: StatTile,
	parameters: { layout: "padded" },
	tags: ["autodocs"],
	args: { icon: Star, label: "Stars", value: 228000 },
} satisfies Meta<typeof StatTile>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
