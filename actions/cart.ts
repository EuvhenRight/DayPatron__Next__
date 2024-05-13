'use server'
// pages/api/cart/[cartId]/items.ts
import { createCart, getCart } from '@/lib/db/cart'
import prisma from '@/lib/db/client'
import { revalidatePath } from 'next/cache'

export async function addItem(variantId: string) {
	// FIND EXISTING CART
	const cart = (await getCart()) ?? (await createCart())

	// FIND EXISTING CART ITEM
	const findItem = cart.items.find(item => item.variantId === variantId)

	// UPDATE CART ITEM
	if (findItem) {
		await prisma.cartItem.update({
			where: { id: findItem.id },
			data: { quantity: { increment: 1 } },
		})
	} else {
		await prisma.cartItem.create({
			data: {
				variantId,
				quantity: 1,
				cartId: cart.id,
			},
		})
	}
	// Re-fetch the cart to get the updated version
	const updatedCart = await getCart()

	// RECALCULATE TOTALS
	const totalPrice = updatedCart?.items.reduce((acc, item) => {
		const price =
			item.variant.discount_price !== 0
				? item.variant.discount_price
				: item.variant.original_price
		return acc + price * item.quantity
	}, 0)

	const original = updatedCart?.items.reduce((acc, item) => {
		const price = item.variant.original_price
		return acc + price * item.quantity
	}, 0)

	// TOTAL DISCOUNT
	const total_discount = original! - totalPrice!

	const totalItems = updatedCart?.items.reduce(
		(acc, item) => acc + item.quantity,
		0
	)

	// UPDATE CART
	await prisma.cart.update({
		where: { id: cart.id },
		data: {
			subTotal: totalPrice,
			itemsTotal: totalItems,
			discountTotal: total_discount,
		},
	})

	revalidatePath('/products')

	return { ...cart }
}

// DELETE CART ITEM
export async function deleteItem(itemId: string) {
	const cart = await getCart()

	if (!cart) {
		throw new Error('Cart not found')
	}

	const findItem = cart.items.find(item => item.variantId === itemId)

	if (!findItem) {
		throw new Error('Cart item not found')
	}

	await prisma.cartItem.delete({
		where: { id: findItem.id },
	})

	// Re-fetch the cart to get the updated version
	const updatedCart = await getCart()

	const totalPrice = updatedCart?.items.reduce((acc, item) => {
		const price =
			item.variant.discount_price !== 0
				? item.variant.discount_price
				: item.variant.original_price
		return acc + price * item.quantity
	}, 0)

	const totalItems = updatedCart?.items.reduce(
		(acc, item) => acc + item.quantity,
		0
	)

	// RECALCULATE TOTALS
	const original = updatedCart?.items.reduce((acc, item) => {
		const price = item.variant.original_price
		return acc + price * item.quantity
	}, 0)

	// TOTAL DISCOUNT
	const total_discount = original! - totalPrice!

	await prisma.cart.update({
		where: { id: cart.id },
		data: {
			subTotal: totalPrice,
			itemsTotal: totalItems,
			discountTotal: total_discount,
		},
	})

	revalidatePath('/products')

	return { ...cart }
}
// EDIT CART ITEM
export async function editItem(itemId: string, quantity: number) {
	const cart = await getCart()

	if (!cart) {
		throw new Error('Cart not found')
	}

	const findItem = cart.items.find(item => item.variantId === itemId)

	if (!findItem) {
		throw new Error('Cart item not found')
	}

	if (quantity <= 0 || quantity >= 99) {
		// UPDATE CART IF QUANTITY IS 0
		await prisma.cartItem.delete({
			where: { id: findItem.id },
		})
	} else {
		// UPDATE CART ITEM
		await prisma.cartItem.update({
			where: { id: findItem.id },
			data: { quantity: quantity },
		})
	}

	// Re-fetch the cart to get the updated version
	const updatedCart = await getCart()

	const totalPrice = updatedCart?.items.reduce((acc, item) => {
		const price =
			item.variant.discount_price !== 0
				? item.variant.discount_price
				: item.variant.original_price
		return acc + price * item.quantity
	}, 0)
	console.log(totalPrice, 'total price')

	const totalItems = updatedCart?.items.reduce(
		(acc, item) => acc + item.quantity,
		0
	)

	// RECALCULATE TOTALS
	const original = updatedCart?.items.reduce((acc, item) => {
		const price = item.variant.original_price
		return acc + price * item.quantity
	}, 0)
	console.log(original, 'original price')
	// TOTAL DISCOUNT
	const total_discount = original! - totalPrice!
	console.log(total_discount, 'total discount')
	// UPDATE CART TOTAL
	await prisma.cart.update({
		where: { id: cart.id },
		data: {
			subTotal: totalPrice,
			itemsTotal: totalItems,
			discountTotal: total_discount,
		},
	})

	revalidatePath('/products')

	return { ...cart }
}
