import { Product } from '@/app/lib/types/types'
import { Arrow } from '@egjs/flicking-plugins'
import '@egjs/flicking-plugins/dist/flicking-plugins.css'
import '@egjs/flicking/dist/flicking.css'
import Flicking, { ViewportSlot } from '@egjs/react-flicking'
import React, { useEffect, useState } from 'react'
import Card from '../Card'

interface CarouselProps {
	productsData: Product[]
}

const Carousel: React.FC<CarouselProps> = ({ productsData }) => {
	const plugins = [new Arrow()]
	const [panelsPerView, setPanelsPerView] = useState<number>()

	useEffect(() => {
		const handleResize = () => {
			// Adjust the number of panels per view based on screen width
			if (window.innerWidth < 450) {
				setPanelsPerView(1)
			} else if (window.innerWidth < 955) {
				setPanelsPerView(2)
			} else if (window.innerWidth < 1024) {
				setPanelsPerView(3)
			} else if (window.innerWidth < 1280) {
				setPanelsPerView(3)
			} else if (window.innerWidth < 1536) {
				setPanelsPerView(4)
			} else {
				setPanelsPerView(5)
			}
		}

		// Add event listener for window resize
		window.addEventListener('resize', handleResize)

		// Initial call to set the initial number of panels per view
		handleResize()

		// Cleanup on component unmount
		return () => {
			window.removeEventListener('resize', handleResize)
		}
	}, [])

	return (
		<>
			<Flicking
				circular={true}
				panelsPerView={panelsPerView}
				plugins={plugins}
				horizontal={true}
				adaptive={true}
				autoResize={true}
				useResizeObserver={true}
				moveType={['strict', { count: 1 }]}
				easing={x => x * (3 - x)}
				iOSEdgeSwipeThreshold={30}
				align={'prev'}
				firstPanelSize='200px'
				className='xl:container xl:mx-auto'
			>
				{productsData.map(product => (
					<div
						key={product.id}
						className='h-full w-full flex align-center items-center flex-col justify-center'
					>
						<Card product={product} />
					</div>
				))}
				<ViewportSlot>
					<span className='flicking-arrow-prev'></span>
					<span className='flicking-arrow-next'></span>
				</ViewportSlot>
			</Flicking>
		</>
	)
}

export default Carousel
