import { auth } from '@/auth'
import prisma from '@/lib/db/client'
import { Delivery } from '@prisma/client'
import { DeliveryWithItems } from './../types/types'

export async function getDelivery(): Promise<DeliveryWithItems | null> {
	const session = await auth()

	let delivery: DeliveryWithItems | null = null

	if (session) {
		delivery = await prisma.delivery.findFirst({
			where: { userId: session.user.id },
			include: { items: true },
		})
	} else {
		return null
	}

	if (!delivery) {
		return null
	}

	return delivery
}
export async function createDelivery(): Promise<DeliveryWithItems> {
	const session = await auth()

	let delivery: Delivery | null = null

	if (session) {
		delivery = await prisma.delivery.create({
			data: {
				items: { create: [] },
				userId: session.user.id,
			},
			include: { items: true },
		})
	} else {
		delivery = await prisma.delivery.create({
			data: {
				items: { create: [] },
			},
			include: { items: true },
		})
	}

	return { ...delivery, items: [] }
}
