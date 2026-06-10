import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import { makeRepositorySummary } from "@/models/repository.fixture"
import { SearchResultsList } from "./search-results-list"

const react = makeRepositorySummary()

const vue = makeRepositorySummary({
	id: 137078487,
	fullName: "vuejs/core",
	description: "Vue.js is a progressive, incrementally-adoptable JavaScript framework.",
	language: "TypeScript",
	stars: 48000,
	htmlUrl: "https://github.com/vuejs/core",
	owner: { login: "vuejs", avatarUrl: "https://avatars.githubusercontent.com/u/6128107?v=4" },
})

const svelte = makeRepositorySummary({
	id: 74293321,
	fullName: "sveltejs/svelte",
	description: undefined,
	language: undefined,
	stars: 79000,
	htmlUrl: "https://github.com/sveltejs/svelte",
	owner: { login: "sveltejs", avatarUrl: "https://avatars.githubusercontent.com/u/23617963?v=4" },
})

const meta = {
	title: "search/SearchResultsList",
	component: SearchResultsList,
	parameters: { layout: "padded" },
	tags: ["autodocs"],
	args: { query: "react", totalCount: 3, initialItems: [react, vue, svelte] },
} satisfies Meta<typeof SearchResultsList>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const SingleResult: Story = {
	args: { totalCount: 1, initialItems: [react] },
}

export const Loadable: Story = {
	args: { totalCount: 12483 },
}
