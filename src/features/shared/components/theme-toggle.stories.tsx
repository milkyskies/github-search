import type { Decorator, Meta, StoryObj } from "@storybook/nextjs-vite"
import { ThemeProvider } from "./theme-provider"
import { ThemeToggle } from "./theme-toggle"

const withTheme: Decorator = (Story) => (
	<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
		<Story />
	</ThemeProvider>
)

const meta = {
	title: "shared/ThemeToggle",
	component: ThemeToggle,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
	decorators: [withTheme],
} satisfies Meta<typeof ThemeToggle>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}
