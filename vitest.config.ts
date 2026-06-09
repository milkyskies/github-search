import { fileURLToPath } from "node:url"
import react from "@vitejs/plugin-react"
import tsconfigPaths from "vite-tsconfig-paths"
import { configDefaults, defineConfig } from "vitest/config"

export default defineConfig({
	plugins: [tsconfigPaths(), react()],
	resolve: {
		alias: {
			"server-only": fileURLToPath(new URL("./tests/server-only.ts", import.meta.url)),
		},
	},
	test: {
		environment: "jsdom",
		setupFiles: ["./tests/setup.ts"],
		exclude: [...configDefaults.exclude, "tests/e2e/**"],
	},
})
