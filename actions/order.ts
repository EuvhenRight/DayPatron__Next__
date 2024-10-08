'use server'
import prisma from '@/lib/db/client'
import { orderItemScheme } from '@/lib/db/validation'
import { createEmailHtml } from '@/lib/services/e-mail-order'
import getSession from '@/lib/services/getSession'
import { sendEmail } from '@/lib/services/mail-password'
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

			await sendEmail({
				to: ['eu@gembird.nl', `${user?.user.email}`],
				subject: 'Замовлення від DayPatron',
				text: `© 2023 DayPatron Inc. Усі права захищені`,
				html: createEmailHtml(lastOrder as OrderForm),
			})
		})
		return order
	} catch (error) {
		console.error('Error editing item in cart:', error)
		throw new Error(
			'Помилка створення замовлення, зверніться до адміністратора'
		)
	}
}
