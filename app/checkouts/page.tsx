import { getCurrentUser } from '@/actions/user'
import { CheckoutForm } from '@/components/CheckoutForm/checkout-form'
import { getCart } from '@/lib/services/cart'
import { getDelivery } from '@/lib/services/delivery'
import { getManyOrders, getOrder } from '@/lib/services/order'
export default async function Checkouts() {
	const [currentDelivery, cart, currentUser, order, orders] = await Promise.all(
		[getDelivery(), getCart(), getCurrentUser(), getOrder(), getManyOrders()]
	)

	// Ensure you are not trying to access any headers or dynamic server features here

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
