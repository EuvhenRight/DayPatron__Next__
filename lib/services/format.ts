export function formatPrice(price: number) {
	return (price / 100).toLocaleString('en-US', {
		style: 'currency',
		currency: 'USD',
	})
}

export function formatPriceUa(price: number) {
	const formattedPrice = (price / 100).toLocaleString('uk-UA', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	})

	return `${formattedPrice} грн`
}
