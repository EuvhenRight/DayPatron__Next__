import { auth } from '@/auth'
import prisma from '@/lib/db/client'
import { CartWithVariants } from '@/lib/types/types'
import { Cart } from '@prisma/client'
import { cookies } from 'next/headers'

export async function getCart(): Promise<CartWithVariants | null> {
	const session = await auth()

	let cart: CartWithVariants | null = null

	if (session) {
		cart = await prisma.cart.findFirst({
			where: { userId: session.user.id },
			include: { items: { include: { variant: true } } },
		})
	} else {
		// COOKIES FOR LOCAL CART
		const localCartId = cookies().get('localCartId')?.value
		cart = localCartId
			? await prisma.cart.findUnique({
					where: { id: localCartId },
					include: { items: { include: { variant: true } } },
			  })
			: null
	}

	if (!cart) {
		return null
	}

	return { ...cart }
}

export async function createCart(): Promise<CartWithVariants> {
	const session = await auth()

	let cart: Cart | null = null

	if (session) {
		cart = await prisma.cart.create({
			data: {
				items: { create: [] },
				userId: session.user.id,
				itemsTotal: 0,
				subTotal: 0,
				discountTotal: 0,
			},
			include: { items: true },
		})
	} else {
		cart = await prisma.cart.create({
			data: {
				items: { create: [] },
				itemsTotal: 0,
				subTotal: 0,
				discountTotal: 0,
			},
			include: { items: true },
		})

		cookies().set('localCartId', cart.id)
	}

	return { ...cart, items: [] }
}
