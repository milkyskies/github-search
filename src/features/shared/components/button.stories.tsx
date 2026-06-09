import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Button } from "./button"

const meta = {
	title: "shared/Button",
	component: Button,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	args: { children: "Search" },
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

export const Primary: Story = {
	args: { variant: "primary" },
}

export const Outline: Story = {
	args: { variant: "outline" },
}

export const Ghost: Story = {
	args: { variant: "ghost" },
}

export const Sizes: Story = {
	render: () => (
		<div className="flex items-center gap-3">
			<Button size="sm">Small</Button>
			<Button size="md">Medium</Button>
			<Button size="lg">Large</Button>
		</div>
	),
}
