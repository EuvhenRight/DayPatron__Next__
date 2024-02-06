import { PriceTag } from '@/app/components/priceTag'
import { Product } from '@prisma/client'
import Link from 'next/link'

interface ProductCardProps {
	product: Product
}
export function Card({ product }: ProductCardProps) {
	return (
		<Link href={`/products/${product.id}`}>
			<div className='group relative bg-white border shadow-md border-slate-100 cursor-pointer w-80'>
				<div className='flex flex-col items-center'>
					<img src={`/images/${product.variants[0].image}`} />
					<button className='group-hover:opacity-100 group-hover:-translate-y-1 opacity-0 w-full bg-[--colorBtnPrimary] text-white py-2 px-1 transition ease-in-out delay-150'>
						View Details
					</button>
					<div className='text-center px-5 pb-5'>
						<h2 className='text-lg text-[--color-body-text] uppercase -tracking-2'>
							{product.name}
						</h2>
						<h3 className='text-md -tracking-0 mt-1 uppercase opacity-65 text-[--color-body-text]'>
							{product.UTP}
						</h3>
						<PriceTag price={product.min_price!} />
					</div>
				</div>
			</div>
		</Link>
	)
}
