import prisma from '@/lib/db/client'
import { cache } from 'react'

export const getCartQuery = cache(async (userId: string) => {
	const cart = await prisma.cart.findUnique({
		where: { userId },
		include: { items: true },
	})

	if (!cart) {
		throw new Error('Cart not found')
	}

	return cart
})
