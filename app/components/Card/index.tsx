'use client'
import { Product } from '@prisma/client'
import Link from 'next/link'

interface ProductCardProps {
	product: Product
}
const Card: React.FC<ProductCardProps> = ({ product }: ProductCardProps) => {
	return (
		<Link href={`/products/${product.id}`}>
			<div className='group relative cursor-pointer w-80 h-[600px]'>
				<div className='flex flex-col items-center'>
					<img className='w-56' src={`/images/${product.variants[0].image}`} />
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
						500
					</div>
				</div>
			</div>
		</Link>
	)
}

export default Card
