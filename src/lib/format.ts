const compactNumberFormat = new Intl.NumberFormat("en", {
	notation: "compact",
	maximumFractionDigits: 1,
})

const groupedNumberFormat = new Intl.NumberFormat("en")

export function formatCompact(value: number): string {
	return compactNumberFormat.format(value)
}

export function formatNumber(value: number): string {
	return groupedNumberFormat.format(value)
}
