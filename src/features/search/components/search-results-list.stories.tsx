import type { Meta, StoryObj } from "@storybook/nextjs-vite"
import type { RepositorySummary } from "@/models/repository"
import { SearchResultsList } from "./search-results-list"

const react: RepositorySummary = {
	id: 10270250,
	fullName: "facebook/react",
	description: "The library for web and native user interfaces.",
	language: "JavaScript",
	stars: 228000,
	htmlUrl: "https://github.com/facebook/react",
	owner: { login: "facebook", avatarUrl: "https://avatars.githubusercontent.com/u/69631?v=4" },
}

const vue: RepositorySummary = {
	id: 137078487,
	fullName: "vuejs/core",
	description: "Vue.js is a progressive, incrementally-adoptable JavaScript framework.",
	language: "TypeScript",
	stars: 48000,
	htmlUrl: "https://github.com/vuejs/core",
	owner: { login: "vuejs", avatarUrl: "https://avatars.githubusercontent.com/u/6128107?v=4" },
}

const svelte: RepositorySummary = {
	id: 74293321,
	fullName: "sveltejs/svelte",
	description: undefined,
	language: undefined,
	stars: 79000,
	htmlUrl: "https://github.com/sveltejs/svelte",
	owner: { login: "sveltejs", avatarUrl: "https://avatars.githubusercontent.com/u/23617963?v=4" },
}

const meta = {
	title: "search/SearchResultsList",
	component: SearchResultsList,
	parameters: { layout: "padded" },
	tags: ["autodocs"],
	args: { totalCount: 12483, items: [react, vue, svelte] },
} satisfies Meta<typeof SearchResultsList>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const SingleResult: Story = {
	args: { totalCount: 1, items: [react] },
}
