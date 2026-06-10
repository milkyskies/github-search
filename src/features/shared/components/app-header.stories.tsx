import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { AppHeader } from "./app-header"

const meta = {
	title: "shared/AppHeader",
	component: AppHeader,
	parameters: { layout: "fullscreen" },
	tags: ["autodocs"],
} satisfies Meta<typeof AppHeader>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
