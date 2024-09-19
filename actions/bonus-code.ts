'use server'
import prisma from '@/lib/db/client'
import { CartWithVariants } from '@/lib/types/types'
import { revalidatePath } from 'next/cache'

export async function applyBonusCode(bonusCode: string, cartId: string) {
	// Check if the bonus code is valid
	const validBonusCode = await prisma.bonusCode.findUnique({
		where: { code: bonusCode },
	})

	if (!validBonusCode) {
		return { success: false, message: 'Invalid bonus code' }
	}

	// Check if the bonus code has already been used
	if (validBonusCode.used) {
		return {
			success: false,
			message: `Bonus code has already been used. Used at: ${validBonusCode.usedAt}`,
		}
	}

	// Find the cart
	const cart = (await prisma.cart.findUnique({
		where: { id: cartId },
	})) as CartWithVariants

	if (!cart) {
		return { success: false, message: 'Cart not found' }
	}
	// Assume discountValue can be a percentage (e.g., 20 for 20%)
	const discountValue = validBonusCode.discountValue // This is expected to be a percentage

	// Calculate the discount amount based on percentage
	const discountAmount = (cart.subTotal * discountValue) / 100
	const totalAfterDiscount = cart.subTotal - discountAmount

	// Ensure total doesn't go negative
	const finalTotal = totalAfterDiscount < 0 ? 0 : totalAfterDiscount

	// Update the cart with the new discount total and bonus code
	await prisma.cart.update({
		where: { id: cart.id },
		data: {
			discountTotal: finalTotal,
			bonusCodeId: validBonusCode.id, // Link the bonus code to the cart
		},
	})

	await prisma.bonusCode.update({
		where: { id: validBonusCode.id },
		data: {
			used: true,
			usedAt: new Date(),
		},
	})

	revalidatePath('/products')

	return {
		success: true,
		...cart,
		message: 'Bonus code applied successfully!',
	}
}
