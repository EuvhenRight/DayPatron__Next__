'use client'
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from '@/components/ui/carousel'
import { Product } from '@prisma/client'
import { ProductsCard } from './products-card/products-card'

interface CarouselProps {
	dataProducts: Product[]
}

export const CarouselMixCards = ({ dataProducts }: CarouselProps) => {
	return (
		<Carousel
			opts={{
				align: 'start',
			}}
			className='w-full flex justify-center items-center'
		>
			<CarouselPrevious />
			<CarouselContent>
				{dataProducts.map((product, index) => (
					<CarouselItem
						key={index}
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
