'use server'
import prisma from '@/lib/db/client'
import { DeliveryAddress, DeliveryBranch } from '@/lib/db/validation'
import { createDelivery, getDelivery } from '@/lib/services/delivery'
import { DeliveryWithItems } from '@/lib/types/types'
import { revalidatePath } from 'next/cache'

export async function addItemDelivery(
	data: DeliveryAddress | DeliveryBranch
): Promise<DeliveryWithItems> {
	try {
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
	} catch (error) {
		console.error('Error editing item in cart:', error)
		throw new Error('Помилка додавання елемента, зверніться до адміністратора')
	}
}

export async function editItemDelivery(
	itemId: string,
	data: DeliveryAddress | DeliveryBranch
): Promise<DeliveryWithItems> {
	try {
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
	} catch (error) {
		console.error('Error editing item in cart:', error)
		throw new Error(
			'Помилка редагування елемента, зверніться до адміністратора'
		)
	}
}

export async function deleteItemDelivery(itemId: string) {
	try {
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
	} catch (error) {
		console.error('Error editing item in cart:', error)
		throw new Error('Помилка видалення елемента, зверніться до адміністратора')
	}
}
