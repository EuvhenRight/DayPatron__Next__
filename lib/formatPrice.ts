export function formatCurrency(amount: number) {
	const locale = 'uk-UA'
	const formatter = new Intl.NumberFormat(locale, {
		style: 'currency',
		currency: 'UAH',
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	})
	return formatter.format(amount / 100)
}
