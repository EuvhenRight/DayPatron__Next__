import { FeaturedOn } from '@/components/FeaturedOn/featured-on'
import { MissionInfo } from '@/components/Mission-Info/mission'
import { ProductsCard } from '@/components/Slider/products-card'
import { getAllProducts } from '@/lib/services/products'
import { rubikGlitch } from '@/lib/utils/font'
import { cn } from '@/lib/utils/utils'
import { Product } from '@prisma/client'
import Link from 'next/link'

export default async function Home() {
	const dataProducts: Product[] = await getAllProducts()
	//  FILTER PRODUCTS
	const matchingProducts = dataProducts.filter(
		product => product.category === 'CPL' || product.category === 'Liquidator'
	)
	//  GET BEST TWO PRODUCTS
	const bestSellers = matchingProducts.slice(0, 2)
	return (
		<>
			<video
				src={`${process.env.PUBLIC_VIDEO_URL}/video2.mp4`}
				autoPlay
				loop
				muted
				playsInline
				className='top-0 left-0 h-full w-full aspect-video object-cover'
			/>
			<section className='container'>
				<FeaturedOn />
				<MissionInfo />
			</section>
			{/* BEST SELLERS */}
			<section className='container'>
				<h1
					className={cn(
						rubikGlitch.className,
						'text-4xl uppercase text-neutral-800 text-center my-10'
					)}
				>
					Лідери продажів
				</h1>
				<ul className='grid grid-cols-1 md:grid-cols-2 gap-2 justify-items-center'>
					{bestSellers.map(product => (
						<li key={product.id}>
							<ProductsCard product={product} />
						</li>
					))}
				</ul>
				<div className='flex justify-center mb-14 mt-6'>
					<Link
						href='/products'
						className='border border-zinc-700 text-zinc-700 py-2 px-4 rounded-md hover:scale-110 ease-out transition-all'
					>
						Переглянути всі товари
					</Link>
				</div>
			</section>
		</>
	)
}
