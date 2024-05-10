import prisma from '@/lib/db/client'
import { cache } from 'react'

export const getCartCC = cache(async (userId: string) => {
	const cart = await prisma.cart.findUnique({
		where: { userId },
		include: { items: true },
	})

	if (!cart) {
		throw new Error('Cart not found')
	}
	return cart
})

export const deleteItem = cache(async (userId: string, itemId: string) => {
	try {
		const res = await fetch(`http://localhost:3000/api/cart/${userId}/delete`, {
			method: 'DELETE',
			body: JSON.stringify({ itemId }),
		})

		if (!res.ok) {
			throw new Error('Failed to delete item')
		}
		return res.statusText === 'success'
	} catch (error) {
		console.error('Error deleting item:', error)
		throw new Error('Error deleting item')
	}
})
