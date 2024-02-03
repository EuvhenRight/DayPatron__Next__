export function formatCurrency(amount: number) {
	const locale = 'uk-UA'

	const formattedCurrency = (amount / 100).toLocaleString(locale, {
		style: 'currency',
		currency: 'UAH',
	})

	return formattedCurrency
}
