import type { z } from "zod"

const DEFAULT_TIMEOUT_MS = 10_000

export type HttpError =
	| { kind: "network"; message: string }
	| { kind: "timeout" }
	| { kind: "status"; status: number; headers: Headers }
	| { kind: "invalidBody" }
	| { kind: "parse"; error: z.ZodError }

export type HttpResult<T> =
	| { kind: "ok"; data: T; headers: Headers }
	| { kind: "error"; error: HttpError }

export interface FetchJsonOptions {
	init?: RequestInit
	timeoutMs?: number
}

export async function fetchJson<T>(
	url: string,
	schema: z.ZodType<T>,
	options?: FetchJsonOptions,
): Promise<HttpResult<T>> {
	const timeoutMs = options?.timeoutMs ?? DEFAULT_TIMEOUT_MS

	let response: Response

	try {
		response = await fetch(url, {
			...options?.init,
			signal: AbortSignal.timeout(timeoutMs),
		})
	} catch (error) {
		const name = error instanceof Error ? error.name : ""

		if (name === "TimeoutError" || name === "AbortError") {
			return { kind: "error", error: { kind: "timeout" } }
		}

		return {
			kind: "error",
			error: { kind: "network", message: error instanceof Error ? error.message : "network error" },
		}
	}

	if (!response.ok) {
		return {
			kind: "error",
			error: { kind: "status", status: response.status, headers: response.headers },
		}
	}

	let json: unknown

	try {
		json = await response.json()
	} catch {
		return { kind: "error", error: { kind: "invalidBody" } }
	}

	const parsed = schema.safeParse(json)

	if (!parsed.success) {
		return { kind: "error", error: { kind: "parse", error: parsed.error } }
	}

	return { kind: "ok", data: parsed.data, headers: response.headers }
}
