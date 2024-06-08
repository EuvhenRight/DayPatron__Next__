import { auth } from '@/auth'
import { Order } from '@prisma/client'
import { OrderWithItems } from '../types/types'
import prisma from './client'

export async function getOrder(): Promise<OrderWithItems | null> {
	const session = await auth()

	let order: OrderWithItems | null = null

	if (session) {
		order = await prisma.order.findFirst({
			where: { userId: session.user.id },
			include: { item: true },
		})
	} else {
		return null
	}

	return order
}

export async function createOrder(): Promise<OrderWithItems | null> {
	const session = await auth()

	let order: Order | null = null

	if (session) {
		order = await prisma.order.create({
			data: {
				item: { create: [] },
				userId: session.user.id,
				itemsTotal: 0,
				subTotal: 0,
			},
			include: { item: true },
		})
	} else {
		return null
	}

	return { ...order, item: [] }
}
