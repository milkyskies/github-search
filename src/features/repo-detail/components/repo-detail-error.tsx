import { useTranslations } from "next-intl"
import type { GithubError } from "@/services/github/github.errors"

type ErrorMessageKey = "rateLimited" | "network" | "generic"

function toMessageKey(error: GithubError): ErrorMessageKey {
	switch (error.kind) {
		case "rateLimited":
			return "rateLimited"
		case "network":
		case "timeout":
			return "network"
		case "notFound":
		case "invalidQuery":
		case "parse":
		case "unexpected":
			return "generic"
		default: {
			const _exhaustive: never = error

			return _exhaustive
		}
	}
}

interface RepoDetailErrorProps {
	error: GithubError
}

export function RepoDetailError(props: RepoDetailErrorProps) {
	const t = useTranslations("detail.error")

	const messageKey = toMessageKey(props.error)

	return (
		<p role="alert" className="py-12 text-center text-destructive">
			{t(messageKey)}
		</p>
	)
}
