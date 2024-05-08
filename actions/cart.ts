'use server'
// pages/api/cart/[cartId]/items.ts
import prisma from '@/lib/db/client'
import { cartValidationSchema } from '@/lib/db/validation'
import { Variant } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export async function getCart(userId: string) {
	const cart = await prisma.cart.findUnique({
		where: { userId },
		include: { items: true },
	})

	if (!cart) {
		throw new Error('Cart not found')
	}
	revalidatePath('/products', 'page')

	return cart
}

export async function addItem(userId: string, variant: Variant) {
	//	CHECK VALIDATION
	const validatedBody = cartValidationSchema.safeParse(variant)
	if (!validatedBody.success) {
		throw new Error(validatedBody.error.errors[0].message)
	}

	if (!variant) {
		throw new Error('Invalid product in cart')
	}

	// FIND EXISTING CART
	let cart = await prisma.cart.findUnique({
		where: { userId },
		include: { items: true },
	})

	if (!cart) {
		cart = await prisma.cart.create({
			data: {
				userId,
				items: { create: [] },
				subTotal: 0,
				itemsTotal: 0,
			},
			include: {
				items: { include: { variant: true } },
			},
		})
	}

	// FIND EXISTING CART ITEM
	const existingCartItem = cart.items.find(
		item => item.variantId === variant.id
	)

	// UPDATE CART ITEM
	let cartItem
	if (existingCartItem) {
		cartItem = await prisma.cartItem.update({
			where: { id: existingCartItem.id },
			data: { quantity: { increment: 1 } },
		})
	} else {
		cartItem = await prisma.cartItem.create({
			data: {
				name: variant.name,
				volume: variant.volume,
				image: variant.image,
				article: variant.article,
				original_price: variant.original_price,
				discount_price: variant.discount_price,
				productId: variant.productId,
				variantId: variant.id,
				quantity: 1,
				cartId: cart.id,
			},
		})
	}

	// FIND NEW CART
	const newCart = await prisma.cart.findUnique({
		where: { userId },
		include: { items: true },
	})

	// RECALCULATE TOTALS
	const totalPrice = newCart?.items.reduce((acc, item) => {
		const price =
			item.discount_price !== 0 ? item.discount_price : item.original_price
		return acc + price * item.quantity
	}, 0)

	const totalItems = newCart?.items.reduce(
		(acc, item) => acc + item.quantity,
		0
	)

	// UPDATE CART
	await prisma.cart.update({
		where: { userId },
		data: { subTotal: totalPrice, itemsTotal: totalItems },
	})
}
