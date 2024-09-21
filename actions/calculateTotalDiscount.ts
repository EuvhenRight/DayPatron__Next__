'use server'
import prisma from '@/lib/db/client'
import { CartWithVariants } from '@/lib/types/types'

export async function calculateTotalDiscount(cart: CartWithVariants | null) {
	if (!cart) {
		return 'No cart found'
	}

	const validBonusCode = await prisma.bonusCode.findUnique({
		where: { id: cart.bonusCodeId! },
	})

	const discountValue = validBonusCode?.discountValue

	// Calculate the discount amount based on percentage
	const discountAmount = (cart.subTotal * discountValue!) / 100
	const totalAfterDiscount = discountAmount

	// Ensure total doesn't go negative
	const finalTotal = totalAfterDiscount < 0 ? 0 : totalAfterDiscount

	// Update the cart with the new discount total and bonus code
	await prisma.cart.update({
		where: { id: cart.id },
		data: {
			discountTotal: finalTotal,
		},
	})

	return { ...cart }
}
