import prisma from '@/lib/prisma'
import { CartWithVariants } from '@/lib/types/types'
import { Cart } from '@prisma/client'
import { cookies } from 'next/headers'
import { cache } from 'react'
import { getCurrentUser } from './user'

export const getCart = cache(async (): Promise<CartWithVariants | null> => {
	const user = await getCurrentUser()

	let cart: CartWithVariants | null = null

	if (user) {
		cart = await prisma.cart.findFirst({
			where: { userId: user?.id },
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
})

export async function createCart(): Promise<CartWithVariants> {
	const user = await getCurrentUser()

	let cart: Cart | null = null

	if (user) {
		cart = await prisma.cart.create({
			data: {
				items: { create: [] },
				userId: user?.id,
				itemsTotal: 0,
				originalTotal: 0,
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
				originalTotal: 0,
				discountTotal: 0,
			},
			include: { items: true },
		})

		cookies().set('localCartId', cart.id)
	}

	return { ...cart, items: [] }
}
