import { getCurrentUser } from '@/actions/user'
import { CheckoutForm } from '@/components/CheckoutForm/checkout-form'
import { getCart } from '@/lib/db/cart'
import { getDelivery } from '@/lib/db/delivery'

export default async function Checkouts() {
	const [currentDelivery, cart, currentUser] = await Promise.all([
		getDelivery(),
		getCart(),
		getCurrentUser(),
	])

	return (
		<div>
			<CheckoutForm
				currentDelivery={currentDelivery}
				cart={cart}
				currentUser={currentUser}
			/>
		</div>
	)
}
