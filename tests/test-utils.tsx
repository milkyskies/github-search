import { type RenderOptions, render } from "@testing-library/react"
import { NextIntlClientProvider } from "next-intl"
import type { ReactElement, ReactNode } from "react"
import messages from "../messages/en.json"

function Providers(props: { children: ReactNode }) {
	return (
		<NextIntlClientProvider locale="en" messages={messages}>
			{props.children}
		</NextIntlClientProvider>
	)
}

export function renderWithProviders(ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) {
	return render(ui, { wrapper: Providers, ...options })
}
