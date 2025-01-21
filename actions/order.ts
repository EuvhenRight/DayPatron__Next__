'use server'
import { orderItemScheme } from '@/lib/db/validation'
import prisma from '@/lib/prisma'
import { createEmailHtml } from '@/lib/services/e-mail-order'
import getSession from '@/lib/services/getSession'
import { createOrder } from '@/lib/services/order'
import { OrderForm } from '@/lib/types/types'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

export async function addOrderItem(data: z.infer<typeof orderItemScheme>) {
	try {
		// FIND EXISTING ORDER
		const order = await createOrder(data)
		const user = await getSession()

		if (!order) {
			return new Error('Error creating order')
		}

		await prisma.$transaction(async tx => {
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

			const cart = await tx.cart.findUnique({
				where: {
					id: data.cartId,
				},
			})

			const bonus = cart?.bonusCodeId
				? await tx.bonusCode.findUnique({
						where: { id: cart.bonusCodeId },
				  })
				: null

			await tx.cartItem.deleteMany({
				where: {
					cartId: data.cartId,
				},
			})

			await tx.cart.delete({
				where: { id: data.cartId },
			})

			revalidatePath('/checkouts')

			const orderEvent = await tx.orderEvent.create({
				data: {
					orderId: order.id,
				},
			})

			// UPDATE CART
			await tx.order.update({
				where: { id: order.id },
				data: {
					bonus: bonus?.code || '',
					subTotal: cart?.subTotal,
					itemsTotal: cart?.itemsTotal,
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

			const lastOrder = await tx.order.findFirst({
				where: { id: order.id },
				include: {
					item: {
						include: {
							variant: true,
						},
					},
					status: true,
					user: true,
					address: true,
				},
			})

			await createEmailHtml(user?.user.email as string, lastOrder as OrderForm)
		})
		return order
	} catch (error) {
		console.error('Error editing item in cart:', error)
		throw new Error(
			'Помилка створення замовлення, зверніться до адміністратора'
		)
	}
}
