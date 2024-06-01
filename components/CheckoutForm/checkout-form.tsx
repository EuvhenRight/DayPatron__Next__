import { CartWithVariants, DeliveryWithItems } from '@/lib/types/types'
import { User } from '@prisma/client'

interface Props {
	currentUser?: User
	cart?: CartWithVariants | null
	currentDelivery?: DeliveryWithItems | null
}

export const CheckoutForm = ({ currentUser, cart, currentDelivery }: Props) => {
	return (
		<div>
			<h1>{JSON.stringify(currentUser)}</h1>
			<h1>{JSON.stringify(cart)}</h1>
			<h1>{JSON.stringify(currentDelivery)}</h1>
		</div>
	)
}
