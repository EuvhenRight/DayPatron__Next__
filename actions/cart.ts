'use server'
// pages/api/cart/[cartId]/items.ts
import { calculateTotalDiscount } from '@/actions/calculateTotalDiscount'
import prisma from '@/lib/prisma'
import { createCart, getCart } from '@/lib/services/cart'
import { revalidatePath } from 'next/cache'

export async function addItem(variantId: string) {
	try {
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

		const totalItems = updatedCart?.items.reduce(
			(acc, item) => acc + item.quantity,
			0
		)

		// RECALCULATE TOTALS
		const originalPrice = updatedCart?.items.reduce((acc, item) => {
			const price = item.variant.original_price
			return acc + price * item.quantity
		}, 0)

		// RECALCULATE TOTALS
		const totalCartPrice = updatedCart?.items.reduce((acc, item) => {
			const price =
				item.variant.discount_price !== 0
					? item.variant.discount_price
					: item.variant.original_price
			return acc + price * item.quantity
		}, 0)

		// TOTAL DISCOUNT
		const total_discount = originalPrice! - totalCartPrice!

		await prisma.cart.update({
			where: { id: cart.id },
			data: {
				subTotal: totalCartPrice,
				originalTotal: originalPrice,
				itemsTotal: totalItems,
				discountTotal: total_discount,
			},
		})

		revalidatePath('/products')
		// RECALCULATE TOTALS WITH BONUS CODE
		if (cart?.bonusCodeId) {
			// GET UPDATED CART
			const updatedCart = await getCart()
			// CALCULATE BONUS CODE
			const cartWithBonusDiscount = await calculateTotalDiscount(updatedCart)
			return cartWithBonusDiscount
		} else {
			// GET NOT UPDATED CART
			return { ...cart }
		}
	} catch (error) {
		console.error('Error editing item in cart:', error)
		throw new Error('Помилка додавання елемента в кошик')
	}
}

// DELETE CART ITEM
export async function deleteItem(itemId: string) {
	try {
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

		const totalItems = updatedCart?.items.reduce(
			(acc, item) => acc + item.quantity,
			0
		)
		// RECALCULATE TOTALS
		const originalPrice = updatedCart?.items.reduce((acc, item) => {
			const price = item.variant.original_price
			return acc + price * item.quantity
		}, 0)

		// RECALCULATE TOTALS
		const totalCartPrice = updatedCart?.items.reduce((acc, item) => {
			const price =
				item.variant.discount_price !== 0
					? item.variant.discount_price
					: item.variant.original_price
			return acc + price * item.quantity
		}, 0)

		// TOTAL DISCOUNT
		const total_discount = originalPrice! - totalCartPrice!

		await prisma.cart.update({
			where: { id: cart.id },
			data: {
				subTotal: totalCartPrice,
				originalTotal: originalPrice,
				itemsTotal: totalItems,
				discountTotal: total_discount,
			},
		})

		revalidatePath('/products')
		// RECALCULATE TOTALS WITH BONUS CODE
		if (cart?.bonusCodeId) {
			// GET UPDATED CART
			const updatedCart = await getCart()
			// CALCULATE BONUS CODE
			const cartWithBonusDiscount = await calculateTotalDiscount(updatedCart)
			return cartWithBonusDiscount
		} else {
			// GET NOT UPDATED CART
			return { ...cart }
		}
	} catch (error) {
		console.error('Error editing item in cart:', error)
		throw new Error('Помилка видалення елемента в кошик')
	}
}
// EDIT CART ITEM
export async function editItem(itemId: string, quantity: number) {
	try {
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

		const totalItems = updatedCart?.items.reduce(
			(acc, item) => acc + item.quantity,
			0
		)
		// RECALCULATE TOTALS
		const originalPrice = updatedCart?.items.reduce((acc, item) => {
			const price = item.variant.original_price
			return acc + price * item.quantity
		}, 0)
		// RECALCULATE TOTALS
		const totalCartPrice = updatedCart?.items.reduce((acc, item) => {
			const price =
				item.variant.discount_price !== 0
					? item.variant.discount_price
					: item.variant.original_price
			return acc + price * item.quantity
		}, 0)
		// TOTAL DISCOUNT
		const total_discount = originalPrice! - totalCartPrice!

		await prisma.cart.update({
			where: { id: cart.id },
			data: {
				subTotal: totalCartPrice,
				originalTotal: originalPrice,
				itemsTotal: totalItems,
				discountTotal: total_discount,
			},
		})
		revalidatePath('/products')
		// RECALCULATE TOTALS WITH BONUS CODE
		if (cart?.bonusCodeId) {
			// GET UPDATED CART
			const updatedCart = await getCart()
			// CALCULATE BONUS CODE
			const cartWithBonusDiscount = await calculateTotalDiscount(updatedCart)
			return cartWithBonusDiscount
		} else {
			// GET NOT UPDATED CART
			return { ...cart }
		}
	} catch (error) {
		console.error('Error editing item in cart:', error)
		throw new Error('Помилка редагування елемента в кошик')
	}
}
