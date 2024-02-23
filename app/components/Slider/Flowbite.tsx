'use client'
import { Product } from '@/app/lib/types/types'
import { Carousel } from 'flowbite-react'
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai'
import Card from '../Card'
interface FlowbiteProps {
	productsData: Product[]
}
const Flowbite: React.FC<FlowbiteProps> = ({ productsData }) => {
	return (
		<div className='h-full w-full sm:h-64 xl:h-80 2xl:h-96'>
			<Carousel
				slideInterval={5000}
				slide={true}
				leftControl={<AiOutlineLeft className='text-5xl' />}
				rightControl={<AiOutlineRight className='text-5xl' />}
			>
				{productsData.map(product => (
					<div key={product.id}>
						<Card product={product} />
					</div>
				))}
			</Carousel>
		</div>
	)
}

export default Flowbite
