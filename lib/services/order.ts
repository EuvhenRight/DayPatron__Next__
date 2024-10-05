import { auth } from '@/auth'
import prisma from '@/lib/db/client'
import { OrderWithItemsWithVariants } from '@/lib/types/types'
import { cache } from 'react'
import { z } from 'zod'
import { orderItemScheme } from '../db/validation'
import { OrderWithItems } from '../types/types'

export const getOrder = cache(
	async (): Promise<OrderWithItemsWithVariants | null> => {
		const session = await auth()

		let order: OrderWithItemsWithVariants | null = null

		if (session) {
			order = await prisma.order.findFirst({
				where: { userId: session.user.id },
				include: {
					address: true,
					user: true,
					item: {
						include: {
							variant: true,
						},
					},
				},
			})
		} else {
			return null
		}

		return order
	}
)

export const getManyOrders = cache(
	async (): Promise<OrderWithItemsWithVariants[] | null> => {
		const session = await auth()

		let orders: OrderWithItemsWithVariants[] | null = null

		if (session) {
			orders = await prisma.order.findMany({
				where: { userId: session.user.id },
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
				orderBy: {
					createdAt: 'desc',
				},
			})
		}

		return orders
	}
)

export async function createOrder(
	data: z.infer<typeof orderItemScheme>
): Promise<OrderWithItems | null> {
	const session = await auth()

	if (!session || !session.user?.id) {
		return null
	}

	let order: OrderWithItems | null = null

	const extraUser = {
		firstName: data.extra_user?.firstName || '',
		lastName: data.extra_user?.lastName || '',
		email: data.extra_user?.email || '',
		phone: data.extra_user?.phone || '',
	}

	const deliveryItem = await prisma.deliveryItem.findFirst({
		where: { id: data.address },
	})

	if (session) {
		order = await prisma.order.create({
			data: {
				item: { create: [] },
				userId: session.user.id,
				cartId: data.cartId,
				deliveryItemId: deliveryItem?.id!,
				itemsTotal: 0,
				subTotal: 0,
				payment: data.payment,
				comment: data.comment || null,
				bonus: '',
				extra_user: extraUser || null,
			},

			include: { item: true, address: true, status: true },
		})
	} else {
		return null
	}

	return { ...order, item: [] }
}
// FIND EXISTING PRODUCTS IN ORDERS
export const findProductsInOrderItems = cache(
	async (
		userId: string,
		productId: string
	): Promise<OrderWithItemsWithVariants[] | null> => {
		const verifiedOrders = await prisma?.order.findMany({
			where: {
				userId: userId,
				item: {
					some: {
						variant: {
							productId: productId,
						},
					},
				},
			},
			include: {
				item: {
					include: {
						variant: true,
					},
				},
			},
		})

		return verifiedOrders
	}
)
