import type { ReactNode } from "react"

// The real <html>/<body> live in app/[locale]/layout.tsx because the lang
// attribute depends on the locale, which is only known inside the [locale]
// segment. next-intl's i18n routing requires this root layout to exist, so it
// just passes children through.
export default function RootLayout(props: { children: ReactNode }) {
	return props.children
}
