import react from "@vitejs/plugin-react"
import tsconfigPaths from "vite-tsconfig-paths"
import { configDefaults, defineConfig } from "vitest/config"

export default defineConfig({
	plugins: [tsconfigPaths(), react()],
	test: {
		environment: "jsdom",
		setupFiles: ["./tests/setup.ts"],
		// Playwright owns tests/e2e; keep Vitest out so the two runners do not collide.
		exclude: [...configDefaults.exclude, "tests/e2e/**"],
	},
})
