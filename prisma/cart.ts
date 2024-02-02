import prisma from '@/prisma/client'
import { Prisma } from '@prisma/client'
import { cookies } from 'next/headers'

export type CartWithProducts = Prisma.CartGetPayload<{
	include: { items: { include: { product: true } } }
}>

export type ShoppingCard = CartWithProducts & {
	size: number
	subTotal: number
}

export async function getCart(): Promise<ShoppingCard | null> {
	const localCardId = cookies().get('localCartId')?.value
	const cart = localCardId
		? await prisma.cart.findUnique({
				where: {
					id: localCardId,
				},
				include: { items: { include: { product: true } } },
		  })
		: null

	if (!cart) {
		return null
	}

	return {
		...cart,
		size: cart.items.reduce((acc, item) => acc + item.quantity, 0),
		subTotal: cart.items.reduce(
			(acc, item) => acc + item.quantity * item.product.price!,
			0
		),
	}
}
export async function createCart(): Promise<ShoppingCard> {
	const newCart = await prisma.cart.create({
		data: {},
	})

	cookies().set('localCartId', newCart.id)

	return {
		...newCart,
		items: [],
		size: 0,
		subTotal: 0,
	}
}
