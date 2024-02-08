'use client'
import type { Product } from '@/app/lib/types/types'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import React from 'react'
import Card from '../Card'
import Slider from '../Slider'

interface CardListProps {
	productsData: Product[]
}

const CardList: React.FC<CardListProps> = ({ productsData }: CardListProps) => {
	const [parent, enable] = useAutoAnimate({ duration: 200 })
	return (
		<ul ref={parent}>
			<Slider>
				{productsData.map(product => (
					<li key={product.id}>
						<Card product={product} />
					</li>
				))}
			</Slider>
		</ul>
	)
}

export default CardList
