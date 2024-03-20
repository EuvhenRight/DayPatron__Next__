import { Product } from '@/lib/types/types'
import { Arrow } from '@egjs/flicking-plugins'
// ALL THE PLUGINS
import '@egjs/flicking-plugins/dist/flicking-plugins.css'
import '@egjs/flicking/dist/flicking.css'
import Flicking, { ViewportSlot } from '@egjs/react-flicking'
import React, { memo, useEffect, useState } from 'react'
import Card from '../Card'

interface CarouselProps {
	productsData: Product[]
}

const Carousel: React.FC<CarouselProps> = memo(({ productsData }) => {
	const plugins = [new Arrow()]
	const [panelsPerView, setPanelsPerView] = useState<number>()

	//RESPONSIVE DESIGN
	useEffect(() => {
		const handleResize = () => {
			// SET PANELS PER VIEW
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

		// ADD EVENT LISTENER
		window.addEventListener('resize', handleResize)

		// CALL HANDLE RESIZE FUNCTION
		handleResize()

		// REMOVE EVENT LISTENER
		return () => {
			window.removeEventListener('resize', handleResize)
		}
	}, [])

	return (
		<>
			<Flicking
				//CIRCULAR LOOP CAROUSEL
				circular={true}
				// SET PANELS PER VIEW
				panelsPerView={panelsPerView}
				// PLUGINS
				plugins={plugins}
				// HORIZONTAL CAROUSEL
				horizontal={true}
				// SET AUTO RESIZE
				adaptive={true}
				autoResize={true}
				useResizeObserver={true}
				// MOVE TYPE
				moveType={['strict', { count: 1 }]}
				// ANIMATION
				easing={x => x * (3 - x)}
				// SWIPE THRESHOLD
				iOSEdgeSwipeThreshold={30}
				// ALIGN
				align={'prev'}
				// FIRST PANEL
				firstpanelsize='200px'
				className='xl:container xl:mx-auto'
			>
				{productsData.map(product => (
					<div
						key={product.id}
						// STYLE FOR CAROUSEL CENTER POSITION
						className='h-full w-full flex align-center items-center flex-col justify-center'
					>
						<Card product={product} />
					</div>
				))}
				{/* TODO: CHANGE ARROW COLOR */}
				<ViewportSlot>
					<span className='flicking-arrow-prev'></span>
					<span className='flicking-arrow-next'></span>
				</ViewportSlot>
			</Flicking>
		</>
	)
})

export default Carousel
