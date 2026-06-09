import type { StorybookConfig } from "@storybook/nextjs-vite"

const config: StorybookConfig = {
	stories: ["../src/**/*.stories.@(ts|tsx)", "../src/**/*.mdx"],
	addons: ["@storybook/addon-a11y", "@storybook/addon-docs", "@storybook/addon-themes"],
	framework: "@storybook/nextjs-vite",
	staticDirs: ["../public"],
}

export default config
