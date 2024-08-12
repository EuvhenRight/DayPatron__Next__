import { FeaturedOn } from '@/components/FeaturedOn/featured-on'
import { MissionInfo } from '@/components/Mission-Info/mission'
import { CarouselMixCards } from '@/components/Slider/carousel'
import { getAllProducts } from '@/lib/services/products'

export default async function Home() {
	const dataProducts = await getAllProducts()
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
			<section>
				<CarouselMixCards dataProducts={dataProducts} />
			</section>
		</>
	)
}
