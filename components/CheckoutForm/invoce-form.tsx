import { PriceTag } from '@/components/PriceTag'
import { CartWithVariants } from '@/lib/types/types'
import BonusForm from './bonus-form'
import { PaymentItem } from './payment-item'

interface Props {
	cart?: CartWithVariants | null
}
export const InvoiceForm = ({ cart }: Props) => {
	return (
		<>
			<div className='bg-zinc-100 rounded-md p-4 overflow-auto max-h-[400px] sm:max-h-[500px]'>
				{cart?.items.map((item, index) => (
					<PaymentItem key={index} item={item} />
				))}
			</div>
			{/* SECOND PART CHECKOUT */}
			<div className='relative'>
				{/* SUBTOTAL AND DISCOUNT */}
				<div className='flex flex-col p-4 my-4 bg-zinc-100 rounded-md'>
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
				<div className='flex flex-col p-2 mb-4 bg-zinc-100 rounded-md'>
					<BonusForm />
				</div>
			</div>
		</>
	)
}
