import { delay, HttpResponse, http } from "msw"
import { describe, expect, it } from "vitest"
import { z } from "zod"
import { server } from "../../tests/msw/server"
import { fetchJson } from "./http"

const url = "https://example.test/data"
const schema = z.object({ name: z.string() })

describe("fetchJson", () => {
	it("parses a valid response", async () => {
		server.use(http.get(url, () => HttpResponse.json({ name: "ok" })))

		const result = await fetchJson(url, schema)

		expect(result.kind).toBe("ok")
		if (result.kind === "ok") {
			expect(result.data).toEqual({ name: "ok" })
			expect(result.headers).toBeInstanceOf(Headers)
		}
	})

	it("returns a status error on a non-2xx response", async () => {
		server.use(http.get(url, () => new HttpResponse(null, { status: 404 })))

		const result = await fetchJson(url, schema)

		expect(result.kind).toBe("error")
		if (result.kind === "error" && result.error.kind === "status") {
			expect(result.error.status).toBe(404)
		}
	})

	it("returns a parse error on an unexpected shape", async () => {
		server.use(http.get(url, () => HttpResponse.json({ wrong: 1 })))

		const result = await fetchJson(url, schema)

		expect(result.kind === "error" && result.error.kind).toBe("parse")
	})

	it("returns a network error when the request fails", async () => {
		server.use(http.get(url, () => HttpResponse.error()))

		const result = await fetchJson(url, schema)

		expect(result.kind === "error" && result.error.kind).toBe("network")
	})

	it("returns a timeout error when the request is too slow", async () => {
		server.use(
			http.get(url, async () => {
				await delay(50)

				return HttpResponse.json({ name: "late" })
			}),
		)

		const result = await fetchJson(url, schema, { timeoutMs: 10 })

		expect(result.kind === "error" && result.error.kind).toBe("timeout")
	})

	it("returns an invalidBody error when the response is not JSON", async () => {
		server.use(http.get(url, () => new HttpResponse("<html>not json</html>", { status: 200 })))

		const result = await fetchJson(url, schema)

		expect(result.kind === "error" && result.error.kind).toBe("invalidBody")
	})
})
