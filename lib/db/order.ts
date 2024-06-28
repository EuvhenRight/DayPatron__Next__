import { auth } from '@/auth'
import { OrderFormInputs, OrderWithItems } from '../types/types'
import prisma from './client'

export async function getOrder(): Promise<OrderWithItems | null> {
	const session = await auth()

	let order: OrderWithItems | null = null

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

export async function getManyOrders(): Promise<OrderWithItems[] | null> {
	const session = await auth()

	let orders: OrderWithItems[] | null = null

	if (session) {
		orders = await prisma.order.findMany({
			where: { userId: session.user.id },
			include: {
				item: true,
				status: true,
				user: true,
				address: true,
			},
		})
	}

	return orders
}

export async function createOrder(
	data: OrderFormInputs
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
				address: {
					connect: { id: deliveryItem?.id },
				},
				itemsTotal: 0,
				subTotal: 0,
				payment: 'PAIMENTBYCARD' || 'PAIMENTBYCASH',
				comment: data.comment || null,
				bonus: '' || null,
				extra_user: extraUser || null,
			},

			include: { item: true, address: true, status: true },
		})
	} else {
		return null
	}

	return { ...order, item: [] }
}
