'use client'
import type { ReactNode } from 'react'
import React, { useEffect, useState } from 'react'
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai'

interface SliderProps {
	children: ReactNode[]
}

const Slider: React.FC<SliderProps> = ({ children }: SliderProps) => {
	const [currentPage, setCurrentPage] = useState(0)
	const numSlides = children.length
	const transitionDuration = 500 // Adjust as needed

	// Duplicate slides for infinite looping
	useEffect(() => {
		const transitionEndListener = () => {
			// Reset transition after animation completes
			const timeout = setTimeout(() => {
				document
					.querySelector('.carousel-container')
					?.classList.remove('transitioning')
				clearTimeout(timeout)
			}, transitionDuration)
		}

		document
			.querySelector('.carousel-container')
			?.addEventListener('transitionend', transitionEndListener)

		return () => {
			document
				.querySelector('.carousel-container')
				?.removeEventListener('transitionend', transitionEndListener)
		}
	}, [transitionDuration])
	// Logic to handle infinite looping without going back to the beginning
	const nextSlide = () => {
		setCurrentPage(prevPage => (prevPage + 1) % numSlides)
	}

	const prevSlide = () => {
		setCurrentPage(prevPage => (prevPage - 1 + numSlides) % numSlides)
	}
	return (
		<div className='relative px-10'>
			<div className='overflow-hidden w-full'>
				<div
					className={`flex gap-5 carousel-container transitioning`}
					style={{
						transform: `translateX(-${currentPage * (100 / (numSlides + 4))}%)`,
						transitionDuration: `${transitionDuration}ms`,
					}}
				>
					{children.map((slide, index) => (
						<div key={index} className='w-full'>
							{slide}
						</div>
					))}
				</div>
			</div>
			<button
				className='absolute left-0 top-1/2 -translate-y-1/2 ml-10'
				onClick={prevSlide}
			>
				<AiOutlineLeft className='absolute left-0 m-auto text-5xl inset-y-1/2 cursor-pointer text-nav z-20 bg-white rounded' />
			</button>
			<button
				className='absolute right-0 top-1/2 -translate-y-1/2 mr-10'
				onClick={nextSlide}
			>
				<AiOutlineRight className='absolute right-0 m-auto text-5xl inset-y-1/2 cursor-pointer text-nav z-20 bg-white rounded' />
			</button>
		</div>
	)
}
export default Slider
