'use client'
import type { Product } from '@/app/lib/types/types'
import React from 'react'
import Carousel from '../Slider/Carousel'

interface CardListProps {
	productsData: Product[]
}

const CardList: React.FC<CardListProps> = ({ productsData }: CardListProps) => {
	// const [parent, enable] = useAutoAnimate({ duration: 200 })
	return (
		<>
			<Carousel productsData={productsData} />
		</>
	)
}

export default CardList
