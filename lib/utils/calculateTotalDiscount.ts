import { CartWithVariants } from '../types/types'

export function calculateTotalDiscount(cart: CartWithVariants | null) {
	const original = cart?.items.reduce((acc, item) => {
		const price = item.variant.original_price
		return acc + price * item.quantity
	}, 0)

	const totalPrice = cart?.items.reduce((acc, item) => {
		const price =
			item.variant.discount_price !== 0
				? item.variant.discount_price
				: item.variant.original_price
		return acc + price * item.quantity
	}, 0)

	return original! - totalPrice!
}

// utils/calculateTotalPrice.ts
export function calculateTotalPrice(cart: CartWithVariants | null) {
	return cart?.items.reduce((acc, item) => {
		const price =
			item.variant.discount_price !== 0
				? item.variant.discount_price
				: item.variant.original_price
		return acc + price * item.quantity
	}, 0)
}

// utils/calculateTotalItems.ts
export function calculateTotalItems(cart: CartWithVariants | null) {
	return cart?.items.reduce((acc, item) => acc + item.quantity, 0)
}
