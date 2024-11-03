import { orderItemScheme } from '@/lib/db/validation'
import prisma from '@/lib/prisma'
import { OrderWithItems, OrderWithItemsWithVariants } from '@/lib/types/types'
import { User } from '@prisma/client'
import { cache } from 'react'
import { z } from 'zod'
import { getCurrentUser } from './user'

export const getOrder = cache(
	async (): Promise<OrderWithItemsWithVariants | null> => {
		const user = await getCurrentUser()

		if (!user) {
			console.warn('No user found.')
			return null
		}

		const order = await prisma.order.findFirst({
			where: { userId: user?.id },
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
		const user = await getCurrentUser()

		if (!user) {
			console.warn('No user found.')
			return null
		}

		const orders = await prisma.order.findMany({
			where: { userId: user?.id },
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
): Promise<OrderWithItemsWithVariants | null> {
	const user = (await getCurrentUser()) as User

	if (!user) {
		console.warn('No user found.')
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

	if (!deliveryItem) {
		console.warn('No delivery item found.')
		return null
	}

	if (!order) {
		order = await prisma.order.create({
			data: {
				item: { create: [] },
				userId: user.id,
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
