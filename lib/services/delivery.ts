import { auth } from '@/auth'
import prisma from '@/lib/prisma'
import { DeliveryWithItems } from '@/lib/types/types'
import { Delivery } from '@prisma/client'
import { cache } from 'react'
import { getCurrentUser } from './user'

export const getDelivery = cache(
	async (): Promise<DeliveryWithItems | null> => {
		const session = await auth()
		const user = await getCurrentUser()
		let delivery: DeliveryWithItems | null = null

		if (session) {
			delivery = await prisma.delivery.findFirst({
				where: { userId: user?.id },
				include: {
					items: {
						orderBy: {
							updatedAt: 'desc',
						},
					},
				},
			})
		} else {
			return null
		}
		if (!delivery) {
			return null
		}
		return delivery
	}
)

export async function createDelivery(): Promise<DeliveryWithItems> {
	const session = await auth()
	const user = await getCurrentUser()

	let delivery: Delivery | null = null

	if (session) {
		delivery = await prisma.delivery.create({
			data: {
				items: { create: [] },
				userId: user?.id,
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
