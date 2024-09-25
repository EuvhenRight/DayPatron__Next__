// components/CartItem.tsx
'use client'
import { CartItemWithVariants } from '@/lib/types/types'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { PriceTag } from '../PriceTag'

interface Props {
	item: CartItemWithVariants
}

export const PaymentItem = ({
	item: { variant: product, quantity },
}: Props) => {
	const path = usePathname()

	return (
		<div
			className={`flex flex-row ${
				path === '/checkouts' ? 'text-black' : 'text-white'
			} py-2 w-full justify-between border-b-2 border-black`}
		>
			{/* CLICK TO PRODUCT DETAILS */}
			<Image
				onClick={() => {}}
				className='w-16'
				width={80}
				height={80}
				src={`/images/${product.image}`}
				alt={product.image}
			/>
			<div className='w-full flex flex-col justify-between ml-4'>
				<div className='flex justify-between items-center'>
					<h2 className='text-md'>{product.name}</h2>
					{/* REMOVE ONE CART ITEM FROM CART */}
				</div>
				{/* SIZE */}
				<div className='flex gap-2'>
					<h4>Об&apos;єм:</h4>
					<h4>{product.volume}</h4>
				</div>
				<div className='flex justify-between'>
					<div className={`flex  text-md`}>
						<h4 className='p-1'>Кількість: {quantity} шт.</h4>
					</div>
					{/* PRICE */}
					{/* DISCOUNT ON/OFF */}
					{product.discount_price! > 0 ? (
						<p className='font-bold gap-2 text-green-500'>
							<span className='line-through pr-4 text-neutral-600'>
								{<PriceTag price={product.original_price} />}
							</span>
							{<PriceTag price={product.discount_price!} />}
						</p>
					) : (
						<h4>{<PriceTag price={product.original_price} />}</h4>
					)}
				</div>
			</div>
		</div>
	)
}
