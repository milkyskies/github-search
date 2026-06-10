import type { NextRequest } from "next/server"
import createMiddleware from "next-intl/middleware"
import { routing } from "@/i18n/routing"

const IS_DEV = process.env.NODE_ENV !== "production"

const CONTENT_SECURITY_POLICY = [
	"default-src 'self'",
	"base-uri 'self'",
	"object-src 'none'",
	"frame-ancestors 'none'",
	"form-action 'self'",
	"img-src 'self' https://avatars.githubusercontent.com data:",
	"font-src 'self' data:",
	"style-src 'self' 'unsafe-inline'",
	`script-src 'self' 'unsafe-inline'${IS_DEV ? " 'unsafe-eval'" : ""}`,
	"connect-src 'self' https://api.github.com",
].join("; ")

const intlMiddleware = createMiddleware(routing)

export function proxy(request: NextRequest) {
	const response = intlMiddleware(request)

	response.headers.set("Content-Security-Policy", CONTENT_SECURITY_POLICY)

	return response
}

export const config = {
	matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
}
