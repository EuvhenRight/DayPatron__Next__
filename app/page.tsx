import { FeaturedOn } from '@/components/FeaturedOn/featured-on'
import { MissionInfo } from '@/components/Mission-Info/mission'
import { ProductsCard } from '@/components/Slider/products-card'
import { getAllProducts } from '@/lib/services/products'
import { Product } from '@prisma/client'

export default async function Home() {
	const dataProducts: Product[] = await getAllProducts()
	//  FILTER PRODUCTS
	const matchingProducts = dataProducts.filter(
		product => product.category === 'CPL' || product.category === 'Liquidator'
	)
	//  GET FIRST TWO PRODUCTS
	const firstTwoProducts = matchingProducts.slice(0, 2)
	return (
		<>
			<div>
				<video
					src={`${process.env.PUBLIC_VIDEO_URL}/video2.mp4`} // PUBLIC URL NEXT FETCHERS
					autoPlay
					loop
					muted
					playsInline
					className='top-0 left-0 h-full w-full aspect-video object-cover'
				/>
			</div>
			<section className='container'>
				<div>
					<MissionInfo />
				</div>
				<div>
					<FeaturedOn />
				</div>
			</section>
			<section className='container'>
				<ul className='grid grid-cols-1 md:grid-cols-2 gap-2 justify-items-center'>
					{firstTwoProducts.map(product => (
						<li key={product.id}>
							<ProductsCard product={product} />
						</li>
					))}
				</ul>
			</section>
		</>
	)
}
