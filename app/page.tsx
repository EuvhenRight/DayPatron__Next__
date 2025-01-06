import { FeaturedOn } from '@/components/FeaturedOn/featured-on'
import { MissionInfo } from '@/components/Mission-Info/mission'
import { ProductsCard } from '@/components/Slider/products-card'
import { getAllProducts } from '@/lib/services/products'
import { ProductsWithVariants } from '@/lib/types/types'
import { rubikDirt } from '@/lib/utils/font'
import { cn } from '@/lib/utils/utils'
import { ButtonBack } from './button-back'

export default async function Home() {
	const dataProducts: ProductsWithVariants[] = await getAllProducts()
	//  FILTER PRODUCTS
	const matchingProducts = dataProducts.filter(
		product => product.category === 'CLP' || product.category === 'Liquidator'
	)
	//  GET BEST TWO PRODUCT
	const bestSellers = matchingProducts.slice(0, 2)
	return (
		<div className='relative flex flex-col justify-center items-center'>
			{/* MOBILE */}
			<video
				src={`${process.env.NEXT_PUBLIC_VIDEO_URL}/video-mobile.mp4`}
				autoPlay
				loop
				muted
				playsInline
				className='h-screen w-full lg:h-full aspect-video object-cover -mt-20 block lg:hidden'
			/>
			{/* LAPTOP */}
			<video
				src={`${process.env.NEXT_PUBLIC_VIDEO_URL}/video.mp4`}
				autoPlay
				loop
				muted
				playsInline
				className='h-screen w-full max-w-[1536px] lg:h-full aspect-video object-cover lg:-mt-32 lg:block hidden '
			/>
			<div className='relative z-10'>
				<section className='container'>
					<FeaturedOn />
					<MissionInfo />
				</section>
				{/* BEST SELLERS */}
				<section className='container'>
					<h1
						className={cn(
							rubikDirt.className,
							'text-4xl uppercase text-neutral-800 text-center mb-4 md:my-10'
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
					<ButtonBack text='Переглянути всі товари' />
				</section>
			</div>
		</div>
	)
}
