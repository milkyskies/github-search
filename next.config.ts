import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

const isDev = process.env.NODE_ENV !== "production"

const AVATAR_CACHE_TTL_SECONDS = 60 * 60 * 24 * 31

const contentSecurityPolicy = [
	"default-src 'self'",
	"base-uri 'self'",
	"object-src 'none'",
	"frame-ancestors 'none'",
	"form-action 'self'",
	"img-src 'self' https://avatars.githubusercontent.com data:",
	"font-src 'self' data:",
	"style-src 'self' 'unsafe-inline'",
	`script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
	"connect-src 'self' https://api.github.com",
].join("; ")

const securityHeaders = [
	{ key: "Content-Security-Policy", value: contentSecurityPolicy },
	{ key: "X-Content-Type-Options", value: "nosniff" },
	{ key: "X-Frame-Options", value: "DENY" },
	{ key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
	{ key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
	{ key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
]

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [{ protocol: "https", hostname: "avatars.githubusercontent.com" }],
		minimumCacheTTL: AVATAR_CACHE_TTL_SECONDS,
	},
	async headers() {
		return [{ source: "/:path*", headers: securityHeaders }]
	},
}

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts")

export default withNextIntl(nextConfig)
