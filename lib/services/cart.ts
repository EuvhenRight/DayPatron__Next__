import prisma from '@/lib/prisma'
import { CartItemWithVariants, CartWithVariants } from '@/lib/types/types'
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
export async function mergeAnonymousCartWithUserCart(userId: string) {
	// Fetch the local cart ID from cookies
	const localCartId = cookies().get('localCartId')?.value

	if (!localCartId) return

	// Fetch the local cart from the database
	const localCart = await prisma.cart.findUnique({
		where: { id: localCartId },
		include: { items: { include: { variant: true } } },
	})

	if (!localCart) return

	// Fetch the user's cart
	const userCart = await prisma.cart.findFirst({
		where: { userId: userId },
		include: { items: { include: { variant: true } } },
	})

	await prisma.$transaction(async tx => {
		if (userCart) {
			// Merge cart items
			const mergedCartItems = await mergeCartItems(
				localCart.items,
				userCart.items
			)

			// Delete existing items in the user's cart
			await tx.cartItem.deleteMany({ where: { cartId: userCart.id } })

			// Insert the merged items into the user's cart
			await tx.cartItem.createMany({
				data: mergedCartItems.map(item => ({
					cartId: userCart.id,
					variantId: item.variantId,
					quantity: item.quantity,
				})),
			})

			// Recalculate cart totals
			const { originalPrice, totalCartPrice, totalDiscount, totalItems } =
				calculateCartTotals(mergedCartItems)

			await tx.cart.update({
				where: { id: userCart.id },
				data: {
					subTotal: totalCartPrice,
					originalTotal: originalPrice,
					itemsTotal: totalItems,
					discountTotal: totalDiscount,
				},
			})
		} else {
			// Create a new cart for the user with the local cart's items
			await tx.cart.create({
				data: {
					userId: userId,
					items: {
						createMany: {
							data: localCart.items.map(item => ({
								variantId: item.variantId,
								quantity: item.quantity,
							})),
						},
					},
					subTotal: localCart.subTotal,
					originalTotal: localCart.originalTotal,
					itemsTotal: localCart.itemsTotal,
					discountTotal: localCart.discountTotal,
				},
			})
		}

		// Delete the local cart
		await tx.cart.delete({ where: { id: localCart.id } })
	})

	// Clear the local cart ID cookie
	cookies().set('localCartId', '')
}

// Helper function to merge cart items
export async function mergeCartItems(...cartItems: CartItemWithVariants[][]) {
	return cartItems.reduce((acc, items) => {
		items.forEach(cartItem => {
			const existingItem = acc.find(
				item => item.variantId === cartItem.variantId
			)
			if (existingItem) {
				existingItem.quantity += cartItem.quantity
			} else {
				acc.push(cartItem)
			}
		})
		return acc
	}, [] as CartItemWithVariants[])
}

// Helper function to calculate cart totals
function calculateCartTotals(items: CartItemWithVariants[]) {
	const originalPrice = items.reduce((acc, item) => {
		return acc + item.variant.original_price * item.quantity
	}, 0)

	const totalCartPrice = items.reduce((acc, item) => {
		const price = item.variant.discount_price || item.variant.original_price
		return acc + price * item.quantity
	}, 0)

	const totalDiscount = originalPrice - totalCartPrice

	const totalItems = items.reduce((acc, item) => acc + item.quantity, 0)

	return { originalPrice, totalCartPrice, totalDiscount, totalItems }
}
