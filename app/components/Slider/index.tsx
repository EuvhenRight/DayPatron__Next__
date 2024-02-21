'use client'
import type { ReactNode } from 'react'
import React, { useState } from 'react'
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai'

interface SliderProps {
	children: ReactNode[]
}

const Slider: React.FC<SliderProps> = ({ children }: SliderProps) => {
	const numSlides = children.length
	const transitionDuration = 500
	const [moveClass, setMoveClass] = useState('')
	const [currentPage, setCurrentPage] = useState(0)
	const [carouselItems, setCarouselItems] = useState<ReactNode[]>(children)
	const nextSlide = () => {
		setCurrentPage(prevPage => (prevPage + 1) % numSlides)
	}

	const prevSlide = () => {
		setCurrentPage(prevPage => (prevPage - 1 + numSlides) % numSlides)
	}

	const handleAnimationEnd = () => {
		if (moveClass === 'prev') {
			shiftNext([...carouselItems])
		} else if (moveClass === 'next') {
			shiftPrev([...carouselItems])
		}
		setMoveClass('')
	}

	const shiftPrev = (copy: ReactNode[]) => {
		let lastcard = copy.pop()
		copy.splice(0, 0, lastcard)
		console.log('prev', copy)
		setCarouselItems(copy)
	}

	const shiftNext = (copy: ReactNode[]) => {
		let firstcard = copy.shift()
		copy.splice(copy.length, 0, firstcard)
		console.log('next', copy)
		setCarouselItems(copy)
	}

	return (
		<div className='relative px-10'>
			<div className='overflow-hidden w-full'>
				<div
					className={`flex gap-5 transitioning ${moveClass}`}
					onAnimationEnd={handleAnimationEnd}
					style={{
						transform: `translateX(-${currentPage * (100 / numSlides)}%)`,
						transitionDuration: `${transitionDuration}ms`,
						width: `${numSlides * 100}%`, // Set the width based on number of slides
					}}
				>
					{carouselItems.map((slide, index) => (
						<div key={index} className='w-full'>
							{slide}
						</div>
					))}
				</div>
			</div>
			<button
				className='absolute left-0 top-1/2 -translate-y-1/2 ml-10'
				onClick={() => setMoveClass('prev')}
			>
				<AiOutlineLeft className='absolute left-0 m-auto text-5xl inset-y-1/2 cursor-pointer text-nav z-20 bg-white rounded' />
			</button>
			<button
				className='absolute right-0 top-1/2 -translate-y-1/2 mr-10'
				onClick={() => setMoveClass('next')}
			>
				<AiOutlineRight className='absolute right-0 m-auto text-5xl inset-y-1/2 cursor-pointer text-nav z-20 bg-white rounded' />
			</button>
		</div>
	)
}
export default Slider
