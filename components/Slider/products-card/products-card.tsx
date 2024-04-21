'use client'
import PriceTag from '@/components/PriceTag'
import { Product } from '@prisma/client'
import Image from 'next/image'
import Link from 'next/link'

interface ProductsCardProps {
	product: Product
}

export const ProductsCard: React.FC<ProductsCardProps> = ({ product }) => {
	return (
		<Link href={`/products/${product.id}/details`}>
			<div className='group relative cursor-pointer w-80 h-[600px]'>
				{product.NEW && (
					<div className='animate-pulse absolute top-20 right-10 bg-green-800 text-white py-2 px-1'>
						NEW
					</div>
				)}
				{product.HIT && (
					<div className='animate-pulse absolute top-20 right-10 bg-red-500 text-white py-2 px-1'>
						HIT
					</div>
				)}
				<div className='flex flex-col items-center'>
					<Image
						className='w-56'
						src={`/images/${product.image[0].url}`}
						width={1000}
						height={1000}
						alt={product.name}
					/>
					<button className='group-hover:opacity-100 group-hover:-translate-y-2 opacity-100 w-full bg-red-800 text-white py-2 px-1 transition ease-in delay-150 mt-2 sm:opacity-0 sm:-translate-y-0'>
						View Details
					</button>
					<div className='text-center px-5 pb-5'>
						<h2 className='text-lg uppercase -tracking-2'>{product.name}</h2>
						<h3 className='text-md -tracking-0 mt-1 uppercase opacity-65'>
							{product.UTP}
						</h3>
						{/* @ts-ignore */}
						{<PriceTag price={product.variant[0].original_price!} />}
					</div>
				</div>
			</div>
		</Link>
	)
}
