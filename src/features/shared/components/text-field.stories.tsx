import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { TextField } from "./text-field"

const meta = {
	title: "shared/TextField",
	component: TextField,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	args: { placeholder: "Search repositories" },
} satisfies Meta<typeof TextField>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithValue: Story = {
	args: { defaultValue: "react" },
}

export const Disabled: Story = {
	args: { disabled: true },
}
