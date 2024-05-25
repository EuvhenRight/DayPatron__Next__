'use server'
import prisma from '@/lib/db/client'
import { createDelivery, getDelivery } from '@/lib/db/delivery'
import { DeliveryItem } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export async function addItemDelivery(dataDelivery: DeliveryItem) {
	console.log('dataDelivery', dataDelivery)
	// FIND EXISTING CART
	const delivery = (await getDelivery()) ?? (await createDelivery())

	// FIND EXISTING CART ITEM
	const findItem = delivery.items.find(
		item => item.deliveryId === dataDelivery.id
	)

	// UPDATE CART ITEM
	if (findItem) {
		await prisma.deliveryItem.update({
			where: { id: findItem.id },
			data: { ...dataDelivery },
		})
	} else {
		await prisma.deliveryItem.create({
			data: {
				...dataDelivery,
				deliveryId: delivery.id,
			},
		})
	}

	revalidatePath('/dashboard/profile')

	return { ...delivery }
}

// export async function editItemDelivery(
// 	deliveryId: string,
// 	dataDelivery: DeliveryItem
// ) {
// 	// FIND EXISTING CART
// 	const delivery = (await getDelivery()) ?? (await createDelivery())

// 	// FIND EXISTING CART ITEM
// 	const findItem = delivery.items.find(item => item.deliveryId === deliveryId)

// 	// UPDATE CART ITEM
// 	if (findItem) {
// 		await prisma.deliveryItem.update({
// 			where: { id: findItem.id },
// 			data: { ...dataDelivery },
// 		})
// 	} else {
// 		await prisma.deliveryItem.create({
// 			data: {
// 				typeOfDelivery: ['У відділення', "Кур'єром"],
// 				deliveryId: delivery.id,
// 			},
// 		})
// 	}

// 	revalidatePath('/dashboard/profile')

// 	return { ...delivery }
// }
