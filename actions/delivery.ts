'use server'
import prisma from '@/lib/db/client'
import { createDelivery, getDelivery } from '@/lib/services/delivery'
import { DeliveryWithItems } from '@/lib/types/types'
import { DeliveryItem } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export async function addItemDelivery(
	data: DeliveryItem
): Promise<DeliveryWithItems> {
	// FIND EXISTING CART
	const delivery = (await getDelivery()) ?? (await createDelivery())

	// FIND EXISTING CART ITEM
	const findItem = delivery?.items.find(item => item.id === delivery.id)

	// UPDATE CART ITEM
	if (findItem) {
		await prisma.deliveryItem.update({
			where: { id: findItem.id },
			data: { ...data },
		})
	} else {
		await prisma.deliveryItem.create({
			data: {
				...data,
				deliveryId: delivery.id,
			},
		})
	}

	revalidatePath('/dashboard/profile')

	return { ...delivery }
}

export async function editItemDelivery(
	itemId: string,
	data: DeliveryItem
): Promise<DeliveryWithItems> {
	// FIND EXISTING CART
	const delivery = await getDelivery()

	// FIND EXISTING CART ITEM
	const findItem = delivery?.items.find(item => item.id === itemId)

	// UPDATE CART ITEM
	if (findItem) {
		await prisma.deliveryItem.update({
			where: { id: findItem.id },
			data: { ...data },
		})
	}

	revalidatePath('/dashboard/profile')

	// Construct and return the response object with default values
	return {
		id: delivery?.id!,
		createdAt: delivery?.createdAt!,
		updatedAt: delivery?.updatedAt!,
		userId: delivery?.userId!,
		items: delivery?.items ?? [], // Ensure items is always an array
	}
}

export async function deleteItemDelivery(itemId: string) {
	const delivery = await getDelivery()
	// FIND EXISTING CART ITEM
	const findItem = delivery?.items.find(item => item.id === itemId)

	if (findItem) {
		await prisma.deliveryItem.delete({
			where: { id: findItem.id },
		})
	}

	revalidatePath('/dashboard/profile')

	return { ...delivery }
}
