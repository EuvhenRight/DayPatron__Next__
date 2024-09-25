import { PriceTag } from '@/components/PriceTag'
import { CartWithVariants } from '@/lib/types/types'
import { PrivacyPolicyInfo } from '../FeedbackForm/privacy-policy'
import { Button } from '../ui/button'
import { BonusForm } from './bonus-form'

interface Props {
	cart?: CartWithVariants | null
}
export const InvoiceForm = ({ cart }: Props) => {
	return (
		<>
			{/* SECOND PART CHECKOUT */}
			<div className='relative'>
				{/* SUBTOTAL AND DISCOUNT */}
				<div className='flex flex-col p-4 mb-4 bg-zinc-100 rounded-md shadow-lg'>
					<div className='flex justify-between'>
						<h2>До оплати без доставки:</h2>
						<h2>{<PriceTag price={cart?.subTotal!} />}</h2>
					</div>
					<div className='flex justify-between'>
						<h2>Знижка:</h2>
						<h2 className='text-green-500'>
							-{<PriceTag price={cart?.discountTotal!} />}
						</h2>
					</div>
				</div>
				<div className='flex flex-col p-2 mb-4 bg-zinc-100 rounded-md shadow-lg'>
					<BonusForm cart={cart} />
				</div>
				<Button className='w-full shadow-lg' variant='office'>
					Оформити замовлення
				</Button>
				<PrivacyPolicyInfo label='Оформити замовлення' />
			</div>
		</>
	)
}
