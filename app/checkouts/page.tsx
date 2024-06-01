import { getCurrentUser } from '@/actions/user'
import { CheckoutForm } from '@/components/CheckoutForm/checkout-form'
import { getCart } from '@/lib/db/cart'
import { getDelivery } from '@/lib/db/delivery'

export default async function Home() {
	const [currentUser, currentDelivery, cart] = await Promise.all([
		getCurrentUser(),
		getDelivery(),
		getCart(),
	])

	return (
		<div>
			<CheckoutForm
				currentUser={currentUser}
				currentDelivery={currentDelivery}
				cart={cart}
			/>
		</div>
	)
}
