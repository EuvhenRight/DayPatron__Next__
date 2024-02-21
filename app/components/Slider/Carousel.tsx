import { Product } from '@/app/lib/types/types'
import { Arrow } from '@egjs/flicking-plugins'
import '@egjs/flicking-plugins/dist/arrow.css'
import '@egjs/flicking/dist/flicking.css'
import Flicking from '@egjs/react-flicking'
import React from 'react'
import Card from '../Card'

interface CarouselProps {
	productsData: Product[]
}

const Carousel: React.FC<CarouselProps> = ({ productsData }) => {
	const plugins = [new Arrow()]

	return (
		<>
			<Flicking
				circular={true}
				plugins={plugins}
				horizontal={true}
				moveType={['strict', { count: 1 }]}
				easing={x => x * (3 - x)}
				iOSEdgeSwipeThreshold={30}
				gap={10}
			>
				{productsData.map(product => (
					<div key={product.id}>
						<Card product={product} />
					</div>
				))}
			</Flicking>
			{/* Previous Arrow */}
			<button className='flickingArrowPrev'>Prev</button>
			{/* Next Arrow */}
			<button className='flickingArrowNext'>Next</button>
		</>
	)
}

export default Carousel
