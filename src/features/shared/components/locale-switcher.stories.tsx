import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { LocaleSwitcher } from "./locale-switcher"

const meta = {
	title: "shared/LocaleSwitcher",
	component: LocaleSwitcher,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
} satisfies Meta<typeof LocaleSwitcher>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
