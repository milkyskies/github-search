import { defineConfig, devices } from "@playwright/test"

const baseURL = "http://localhost:3000"
const mockGithubUrl = "http://localhost:4000"

export default defineConfig({
	testDir: "./tests/e2e",
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	reporter: "html",
	use: {
		baseURL,
		trace: "on-first-retry",
	},
	projects: [
		{
			name: "chromium",
			use: { ...devices["Desktop Chrome"] },
		},
	],
	webServer: [
		{
			command: "node tests/mock-github/server.ts",
			url: `${mockGithubUrl}/search/repositories?q=healthcheck`,
			reuseExistingServer: !process.env.CI,
			timeout: 30_000,
		},
		{
			command: `pnpm build && GITHUB_API_BASE_URL=${mockGithubUrl} pnpm start`,
			url: baseURL,
			reuseExistingServer: !process.env.CI,
			timeout: 120_000,
		},
	],
})
