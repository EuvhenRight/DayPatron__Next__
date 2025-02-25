'use client'
import { ProductsCard } from '@/components/Slider/products-card'
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from '@/components/ui/carousel'
import { ProductsWithVariants } from '@/lib/types/types'

interface Props {
	dataProducts: ProductsWithVariants[]
}

export const CarouselMixCards = ({ dataProducts }: Props) => {
	return (
		<Carousel
			opts={{
				align: 'start',
				loop: true,
			}}
			className='w-full flex justify-center items-center'
		>
			<CarouselPrevious />
			<CarouselContent>
				{dataProducts.map(product => (
					<CarouselItem
						key={product.id}
						className='md:basis-1/2 lg:basis-1/3 xl:basis-1/4'
					>
						<div className='p-1'>
							<ProductsCard product={product} />
						</div>
					</CarouselItem>
				))}
			</CarouselContent>
			<CarouselNext />
		</Carousel>
	)
}
