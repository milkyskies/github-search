import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { Skeleton } from "./skeleton"

const meta = {
	title: "shared/Skeleton",
	component: Skeleton,
	parameters: { layout: "centered" },
	tags: ["autodocs"],
} satisfies Meta<typeof Skeleton>

export default meta

type Story = StoryObj<typeof meta>

export const Line: Story = {
	args: { className: "h-3.5 w-48" },
}

export const Circle: Story = {
	args: { className: "size-12 rounded-full" },
}

export const Card: Story = {
	render: () => (
		<div className="flex w-72 items-center gap-4">
			<Skeleton className="size-12 shrink-0 rounded-full" />

			<div className="flex-1 space-y-2">
				<Skeleton className="h-3.5 w-2/5" />
				<Skeleton className="h-3 w-3/4" />
			</div>
		</div>
	),
}
