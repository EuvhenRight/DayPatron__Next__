'use client'
import { Product } from '@prisma/client'
import Link from 'next/link'
import { memo } from 'react'
import PriceTag from '../PriceTag'

interface ProductCardProps {
	product: Product
}
const Card: React.FC<ProductCardProps> = memo(({ product }) => {
	return (
		<Link href={`/products/${product.id}/details`}>
			<div className='group relative cursor-pointer w-80 h-[600px]'>
				{product.NEW && (
					<div className='animate-pulse absolute top-20 right-10 bg-announcement text-white py-2 px-1'>
						NEW
					</div>
				)}
				{product.HIT && (
					<div className='animate-pulse absolute top-20 right-10 bg-btnPrimary text-white py-2 px-1'>
						HIT
					</div>
				)}
				<div className='flex flex-col items-center'>
					<img className='w-56' src={`/images/${product.variants[1].image}`} />
					<button className='group-hover:opacity-100 group-hover:-translate-y-2 opacity-0 w-full bg-btnPrimary text-white py-2 px-1 transition ease-in delay-150 mt-2'>
						View Details
					</button>
					<div className='text-center px-5 pb-5'>
						<h2 className='text-lg uppercase -tracking-2'>{product.name}</h2>
						<h3 className='text-md -tracking-0 mt-1 uppercase opacity-65'>
							{product.UTP}
						</h3>
						{<PriceTag price={product.min_price!} />}
					</div>
				</div>
			</div>
		</Link>
	)
})

export default Card
