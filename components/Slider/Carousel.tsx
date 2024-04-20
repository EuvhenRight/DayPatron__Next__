'use client'
import { Product } from '@/lib/types/types'
// ALL THE PLUGINS
import '@egjs/flicking-plugins/dist/flicking-plugins.css'
import '@egjs/flicking/dist/flicking.css'
import React, { memo } from 'react'

interface CarouselProps {
	productsData: Product[]
}

const Carousel: React.FC<CarouselProps> = memo(({ productsData }) => {
	return <div>Carusel</div>
})

export default Carousel
