import { PriceTag } from '@/components/PriceTag'
import { CartWithVariants } from '@/lib/types/types'
import { Button } from '../ui/button'
import { PrivacyPolicyInfo } from '../ui/privacy-policy'
import { BonusForm } from './bonus-form'

interface Props {
	cart?: CartWithVariants | null
}
export const InvoiceForm = ({ cart }: Props) => {
	console.log(cart, 'cart')
	return (
		<>
			{/* SECOND PART CHECKOUT */}
			<div className='relative'>
				{/* SUBTOTAL AND DISCOUNT */}
				<div className='flex flex-col p-4 mb-4 bg-zinc-100 rounded-md shadow-lg'>
					<div className='flex justify-between pb-4'>
						<h2>Сума замовлення</h2>
						<h2 className={cart?.discountTotal! > 0 ? 'line-through' : ''}>
							<PriceTag price={cart?.originalTotal!} />
						</h2>
					</div>
					<div className='flex justify-between'>
						<h2>Знижка</h2>
						<h2 className='text-green-500'>
							-{<PriceTag price={cart?.discountTotal!} />}
						</h2>
					</div>
					<div className='flex justify-between py-2 font-bold'>
						<h2>До оплати без доставки:</h2>
						<h2>{<PriceTag price={cart?.subTotal!} />}</h2>
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
