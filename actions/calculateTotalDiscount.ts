'use server'
import prisma from '@/lib/prisma'
import { CartWithVariants } from '@/lib/types/types'

export async function calculateTotalDiscount(cart: CartWithVariants | null) {
	try {
		if (!cart) {
			return 'No cart found'
		}

		const validBonusCode = await prisma.bonusCode.findUnique({
			where: { id: cart.bonusCodeId! },
		})

		if (!validBonusCode) {
			return 'Не знайдено дійсного бонусного коду'
		}

		const discountValue = validBonusCode?.discountValue

		// Calculate the discount amount based on percentage
		const discountAmount = (cart.subTotal * discountValue!) / 100
		const totalAfterDiscount = discountAmount

		// Ensure total doesn't go negative
		const finalTotal = totalAfterDiscount < 0 ? 0 : totalAfterDiscount

		const originalPrice = cart?.items.reduce((acc, item) => {
			const price = item.variant.original_price
			return acc + price * item.quantity
		}, 0)

		const totalPrice = originalPrice - finalTotal

		// Update the cart with the new discount total and bonus code
		await prisma.cart.update({
			where: { id: cart.id },
			data: {
				subTotal: totalPrice,
				originalTotal: originalPrice,
				discountTotal: finalTotal,
			},
		})

		return cart
	} catch (error) {
		console.error('Error applying bonus code:', error)
		return { success: false, message: 'Щось пішло не так, спробуйте ще раз.' }
	}
}
