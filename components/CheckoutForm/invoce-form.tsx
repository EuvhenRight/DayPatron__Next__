import { CartItemComponent } from '@/components/Cart-item/CartItem'
import { PriceTag } from '@/components/PriceTag'
import { CartWithVariants } from '@/lib/types/types'

interface Props {
	cart?: CartWithVariants | null
}
export const InvoiceForm = ({ cart }: Props) => {
	return (
		<>
			<div className='bg-zinc-100 rounded-md p-4'>
				{cart?.items.map((item, index) => (
					<CartItemComponent key={index} item={item} />
				))}
			</div>
			{/* SECOND PART CHECKOUT */}
			<div className='relative'>
				{/* SUBTOTAL AND DISCOUNT */}
				<div className='flex flex-col py-4 mb-4'>
					<div className='flex justify-between'>
						<h2>СУМА</h2>
						<h2>{<PriceTag price={cart?.subTotal!} />}</h2>
					</div>
					<div className='flex justify-between'>
						<h2>ЗНИЖКА</h2>
						<h2 className='text-green-500'>
							-{<PriceTag price={cart?.discountTotal!} />}
						</h2>
					</div>
				</div>
			</div>
		</>
	)
}
