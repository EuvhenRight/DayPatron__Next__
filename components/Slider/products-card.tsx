'use client'
import { PriceTag } from '@/components/PriceTag'
import { ProductsWithVariants } from '@/lib/types/types'
import { rubikGlitch } from '@/lib/utils/font'
import { cn } from '@/lib/utils/utils'
import Image from 'next/image'
import Link from 'next/link'

interface Props {
	product: ProductsWithVariants
}

export const ProductsCard = ({ product }: Props) => {
	return (
		<Link href={`/products/${product.id}/details`}>
			<div className='group relative cursor-pointer xl:w-80 h-[600px] hover:transform hover:scale-105 transition-all'>
				{product.NEW && (
					<div className='animate-pulse absolute rounded-md top-20 right-10 bg-green-800 text-white py-2 px-1'>
						НОВИНКА
					</div>
				)}
				{product.HIT && (
					<div className='animate-pulse absolute rounded-md top-20 right-10 bg-red-500 text-white py-2 px-1'>
						ХИТ
					</div>
				)}
				<div className='flex flex-col items-center'>
					<Image
						className='w-56'
						src={`/images/${product.image[3].url}`}
						width={1000}
						height={1000}
						alt={product.name}
					/>
					<button className='group-hover:opacity-100 group-hover:-translate-y-3 opacity-100 rounded-md w-full bg-red-600 text-white py-2 px-1 transition ease-in delay-150 mt-2 xl:opacity-0 xl:-translate-y-0'>
						Докладніше
					</button>
					<div className='text-center px-5 pb-5'>
						<h2 className='text-lg font-bold uppercase -tracking-2 my-3'>
							{product.name}
						</h2>
						<h3
							className={cn(
								rubikGlitch.className,
								'text-base tracking-tight mt-1 uppercase opacity-65'
							)}
						>
							{product.UTP}
						</h3>
						<p className={cn(rubikGlitch.className, 'my-3 text-xl')}>
							від
							<span className='ml-2'>
								{<PriceTag price={product.variant[0].original_price!} />}
							</span>
						</p>
					</div>
				</div>
			</div>
		</Link>
	)
}
