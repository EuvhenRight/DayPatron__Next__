'use server'
import prisma from '@/lib/db/client'
import { createOrder } from '@/lib/db/order'
import { OrderFormInputs } from '@/lib/types/types'
import { revalidatePath } from 'next/cache'

export async function addOrderItem(data: OrderFormInputs) {
	// FIND EXISTING ORDER
	const order = await createOrder(data)

	prisma.$transaction(async tx => {
		const orderItem = await tx.cartItem.findMany({
			where: {
				cartId: data.cartId,
			},
			include: {
				variant: true,
			},
		})
		if (orderItem.length === 0) {
			return new Error('Cart is empty')
		}

		const totalPrice = orderItem.reduce((acc, item) => {
			const price =
				item.variant.discount_price !== 0
					? item.variant.discount_price
					: item.variant.original_price
			return acc + price * item.quantity
		}, 0)

		const totalItems = orderItem.reduce((acc, item) => acc + item.quantity, 0)

		await tx.cartItem.deleteMany({
			where: {
				cartId: data.cartId,
			},
		})

		await tx.cart.delete({
			where: { id: data.cartId },
		})

		const orderEvent = await tx.orderEvent.create({
			data: {
				orderId: order?.id!,
			},
		})

		// UPDATE CART
		await tx.order.update({
			where: { id: order?.id },
			data: {
				subTotal: totalPrice,
				itemsTotal: totalItems,
				status: {
					connect: {
						id: orderEvent.id,
					},
				},
				item: {
					create: orderItem.map(item => ({
						quantity: item.quantity,
						variantId: item.variantId,
					})),
				},
			},
		})

		revalidatePath('/checkout')
		return order
	})
}
