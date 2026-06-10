import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { BackButton } from "./back-button"

const meta = {
	title: "repo-detail/BackButton",
	component: BackButton,
	parameters: { layout: "padded" },
	tags: ["autodocs"],
} satisfies Meta<typeof BackButton>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
