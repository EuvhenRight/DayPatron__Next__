import { createOrder, getOrder } from '@/lib/db/order'
import { OrderItem } from '@prisma/client'

export async function addOrderItem(data: OrderItem) {
	// FIND EXISTING ORDER
	const order = (await getOrder()) ?? (await createOrder())

	const findItem = order?.item.find(item => item.id === order.id)

	// UPDATE ORDER ITEM
	if (findItem) {
		await prisma?.orderItem.update({
			where: { id: findItem.id },
			data: { ...data },
		})
	} else {
		await prisma?.orderItem.create({
			data: {
				...data,
				orderId: order?.id!,
				cartId: data.cartId,
				deliveryId: data.deliveryId,
				payment: data.payment,
			},
		})
	}
}
