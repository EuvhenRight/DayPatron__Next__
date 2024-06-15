import { getCurrentUser } from '@/actions/user'
import { CheckoutForm } from '@/components/CheckoutForm/checkout-form'
import { getCart } from '@/lib/db/cart'
import { getDelivery } from '@/lib/db/delivery'
import { getManyOrders, getOrder } from '@/lib/db/order'

export default async function Checkouts() {
	const [currentDelivery, cart, currentUser, order, orders] = await Promise.all(
		[getDelivery(), getCart(), getCurrentUser(), getOrder(), getManyOrders()]
	)

	return (
		<div>
			<CheckoutForm
				currentDelivery={currentDelivery}
				cart={cart}
				currentUser={currentUser}
				order={order}
				orders={orders}
			/>
		</div>
	)
}
