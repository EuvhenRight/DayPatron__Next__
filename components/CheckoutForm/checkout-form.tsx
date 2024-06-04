import { CartWithVariants, DeliveryWithItems } from '@/lib/types/types'
import { User } from '@prisma/client'
import { DeliveryForm } from '../UserNavigation/delivery-form'
import { ProfileForm } from '../UserNavigation/profile-form'
import { CommentForm } from './comment-form'
import { PaymentForm } from './payment-form'

interface Props {
	cart?: CartWithVariants | null
	currentDelivery?: DeliveryWithItems | null
	currentUser?: User | null
}

export const CheckoutForm = ({ cart, currentDelivery, currentUser }: Props) => {
	return (
		<section className='xl:container xl:mx-auto lg:pt-5 relative px-2 flex'>
			<div className='w-2/3 p-2'>
				<div>
					<p>Контактні дані</p>
					<ProfileForm currentUser={currentUser!} />
				</div>
				<div>
					<p>Доставка</p>
					<DeliveryForm currentDelivery={currentDelivery!} />
				</div>
				<div>
					<p>Оплата</p>
					<PaymentForm />
				</div>
				<div>
					<p>Коментар до замовлення</p>
					<CommentForm />
				</div>
			</div>
			<div className='w-1/3 p-2'>{JSON.stringify(cart)} cart</div>
		</section>
	)
}
