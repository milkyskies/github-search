import "server-only"

export class MissingEnvError extends Error {
	readonly kind = "MissingEnvError"

	constructor(public readonly key: string) {
		super(`Missing required environment variable: ${key}`)
		this.name = "MissingEnvError"
	}
}

export function getEnv(key: string, options: { required: true }): string
export function getEnv(key: string, options?: { required?: boolean }): string | undefined
export function getEnv(key: string, options?: { required?: boolean }): string | undefined {
	const value = process.env[key]?.trim() || undefined

	if (!value && options?.required) {
		throw new MissingEnvError(key)
	}

	return value
}
