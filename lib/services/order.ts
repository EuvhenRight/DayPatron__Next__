import { auth } from '@/auth'
import { orderItemScheme } from '@/lib/db/validation'
import prisma from '@/lib/prisma'
import { OrderWithItems, OrderWithItemsWithVariants } from '@/lib/types/types'
import { cache } from 'react'
import { z } from 'zod'

export const getOrder = cache(
	async (): Promise<OrderWithItemsWithVariants | null> => {
		const session = await auth()

		if (!session) {
			console.warn('No session found.')
			return null
		}

		const order = await prisma.order.findFirst({
			where: { userId: session.user.id },
			include: {
				address: true,
				item: {
					include: {
						variant: true,
					},
				},
			},
		})

		if (!order) {
			return null
		}

		return order
	}
)

export const getManyOrders = cache(
	async (): Promise<OrderWithItemsWithVariants[] | null> => {
		const session = await auth()

		if (!session) {
			console.warn('No session found.')
			return null
		}

		const orders = await prisma.order.findMany({
			where: { userId: session.user.id },
			include: {
				item: {
					include: {
						variant: true,
					},
				},
				status: true,
				address: true,
			},
			orderBy: {
				createdAt: 'desc',
			},
		})

		if (!orders) {
			return null
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
