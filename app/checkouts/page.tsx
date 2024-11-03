import { CheckoutForm } from '@/components/CheckoutForm/checkout-form'
import { getCart } from '@/lib/services/cart'
import { getDelivery } from '@/lib/services/delivery'
import { getManyOrders, getOrder } from '@/lib/services/order'
import { getCurrentUser } from '@/lib/services/user'

// Ensure dynamic rendering
export const dynamic = 'force-dynamic'

export default async function Checkouts() {
	const [currentDelivery, cart, currentUser] = await Promise.all([
		getDelivery(),
		getCart(),
		getCurrentUser(),
		getOrder(),
		getManyOrders(),
	])

	return (
		<div>
			<CheckoutForm
				currentDelivery={currentDelivery}
				cart={cart}
				currentUser={currentUser!}
			/>
		</div>
	)
}
