'use client'
import type { Product } from '@/app/lib/types/types'
import React from 'react'
import Card from '../Card'
import Slider from '../Slider'

interface CardListProps {
	productsData: Product[]
}

const CardList: React.FC<CardListProps> = ({ productsData }: CardListProps) => {
	return (
		<>
			<Slider>
				{productsData.map(product => (
					<div key={product.id}>
						<Card product={product} />
					</div>
				))}
			</Slider>
		</>
	)
}

export default CardList
