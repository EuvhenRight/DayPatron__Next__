'use server'

import { createCart, getCart } from '@/prisma/cart'
import { revalidatePath } from 'next/cache'

export async function incrementProductQuantity(productId: string) {
	const cart = (await getCart()) ?? (await createCart())

	const addedItem = cart.items.find(item => item.product.id === productId)

	if (addedItem) {
		await prisma?.cartItem.update({
			where: {
				id: addedItem.id,
			},
			data: {
				quantity: { increment: 1 },
			},
		})
	} else {
		await prisma?.cartItem.create({
			data: {
				cartId: cart.id,
				productId,
				quantity: 1,
			},
		})
		revalidatePath('/api/products/[id]')
	}
}
