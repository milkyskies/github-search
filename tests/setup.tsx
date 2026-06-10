import "@testing-library/jest-dom/vitest"
import { cleanup } from "@testing-library/react"
import type { ComponentProps } from "react"
import { afterAll, afterEach, beforeAll, vi } from "vitest"
import { server } from "./msw/server"

vi.mock("@/i18n/navigation", () => ({
	Link: (props: ComponentProps<"a">) => <a {...props} />,
	usePathname: () => "/",
	useRouter: () => ({ replace: vi.fn(), push: vi.fn(), prefetch: vi.fn(), refresh: vi.fn() }),
	redirect: vi.fn(),
	getPathname: () => "/",
}))

beforeAll(() => {
	server.listen({ onUnhandledRequest: "error" })
})

afterEach(() => {
	cleanup()
	server.resetHandlers()
})

afterAll(() => {
	server.close()
})
