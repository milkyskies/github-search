import { useTranslations } from "next-intl"
import type { GithubError } from "@/services/github.errors"

type ErrorMessageKey = "rateLimited" | "network" | "invalidQuery" | "generic"

function toMessageKey(error: GithubError): ErrorMessageKey {
	switch (error.kind) {
		case "rateLimited":
			return "rateLimited"
		case "network":
		case "timeout":
			return "network"
		case "invalidQuery":
			return "invalidQuery"
		case "notFound":
		case "parse":
		case "unexpected":
			return "generic"
		default: {
			const _exhaustive: never = error

			return _exhaustive
		}
	}
}

interface SearchErrorProps {
	error: GithubError
}

export function SearchError(props: SearchErrorProps) {
	const t = useTranslations("search.error")

	const messageKey = toMessageKey(props.error)

	return (
		<p role="alert" className="py-12 text-center text-destructive">
			{t(messageKey)}
		</p>
	)
}
