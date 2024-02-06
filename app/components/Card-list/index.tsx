'use client'
import { Card } from '@/app/components/Card'
import type { Product } from '@/app/lib/types/types'

interface CardListProps {
	productsData: Product[]
}

function CardList({ productsData }: CardListProps) {
	// const slideLeft = () => {
	// 	let slider = document.getElementById('slider')
	// 	if (slider) {
	// 		slider.scrollLeft = slider.scrollLeft - 235
	// 	}
	// }

	// const slideRight = () => {
	// 	let slider = document.getElementById('slider')
	// 	if (slider) {
	// 		slider.scrollLeft = slider.scrollLeft + 235
	// 	}
	// }

	return (
		<div>
			<div>
				<div>
					{/* <button title='scroll left' onClick={slideLeft}>
						<IoIosArrowBack />
					</button>
					<button title='scroll right' onClick={slideRight}>
						<IoIosArrowForward />
					</button> */}
				</div>
			</div>
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
				{productsData?.map(product => (
					<Card key={product.id} product={product} />
				))}
			</div>
		</div>
	)
}

export default CardList
