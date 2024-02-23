'use client'
import type { Product } from '@/app/lib/types/types'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import React from 'react'
import Carousel from '../Slider/Carousel'
import Flowbite from '../Slider/Flowbite'

interface CardListProps {
	productsData: Product[]
}

const CardList: React.FC<CardListProps> = ({ productsData }: CardListProps) => {
	const [parent, enable] = useAutoAnimate({ duration: 200 })
	return (
		<>
			<ul ref={parent}>
				<Flowbite productsData={productsData} />
			</ul>
			<Carousel productsData={productsData} />
		</>
	)
}

export default CardList
