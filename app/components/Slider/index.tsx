'use client'
import type { ReactNode } from 'react'
import React, { useEffect } from 'react'
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai'

interface SliderProps {
	children: ReactNode[]
}

const Slider: React.FC<SliderProps> = ({ children }: SliderProps) => {
	const max = children.length
	const transitionDuration = 500
	const [active, setActive] = React.useState(0)
	const [autoplay, setAutoplay] = React.useState(0)

	const intervalBetweenSlides = () =>
		setActive(active === max - 1 ? 0 : active + 1)

	useEffect(() => {
		console.log('work')
	}, [active]) // Trigger the effect whenever active changes

	const nextOne = () => active < max - 1 && setActive(active + 1)

	const prevOne = () => active > 0 && setActive(active - 1)

	const setSliderStyles = () => {
		console.log('work')
		const transition = active * -100

		return {
			width: children.length * 100 + 'vw',
			transform: 'translateX(' + transition + 'vw)',
		}
	}

	return (
		<div className='relative px-10'>
			<div className='overflow-hidden'>
				<div style={setSliderStyles()} className='will-change-transform'>
					{children.map((slide, index) => (
						<div key={index} className=''>
							{slide}
						</div>
					))}
				</div>
			</div>
			<button
				className='absolute left-0 top-1/2 -translate-y-1/2 ml-10'
				onClick={() => prevOne()}
			>
				<AiOutlineLeft className='absolute left-0 m-auto text-5xl inset-y-1/2 cursor-pointer text-nav z-20 bg-white rounded' />
			</button>
			<button
				className='absolute right-0 top-1/2 -translate-y-1/2 mr-10'
				onClick={() => nextOne()}
			>
				<AiOutlineRight className='absolute right-0 m-auto text-5xl inset-y-1/2 cursor-pointer text-nav z-20 bg-white rounded' />
			</button>
		</div>
	)
}
export default Slider
