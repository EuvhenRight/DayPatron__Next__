'use client'

import { ProductsWithVariants } from '@/lib/types/types'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai'
import { GoDotFill } from 'react-icons/go'

interface Props {
	product: ProductsWithVariants
	imageIndex: number | null
	setImageIndex: React.Dispatch<React.SetStateAction<number | null>>
	setAnimate: React.Dispatch<React.SetStateAction<boolean>>
	animate: boolean
	imageUrl: string
	setImageUrl: React.Dispatch<React.SetStateAction<string>>
	setCurrentIndex: React.Dispatch<React.SetStateAction<number | null>>
	currentIndex: number | null
}

export const SliderWithProducts = ({
	product,
	imageIndex,
	setImageIndex,
	setAnimate,
	animate,
	imageUrl,
	setImageUrl,
	setCurrentIndex,
	currentIndex,
}: Props) => {
	const [arrowToggle, setArrowToggle] = useState<number>(1)
	const [slideDirection, setSlideDirection] = useState<'left' | 'right'>(
		'right'
	)
	const countImages = product.image.length
	const imagesRef = useRef<HTMLUListElement>(null)

	const handleNextClick = useCallback(() => {
		if (arrowToggle < countImages - 1) {
			setArrowToggle(arrowToggle + 1)
			setImageIndex(arrowToggle + 1)
			setAnimate(true)
			setSlideDirection('left')
		}
	}, [arrowToggle, countImages, setAnimate, setArrowToggle, setImageIndex])

	const handlePrevClick = useCallback(() => {
		if (arrowToggle > 0) {
			setArrowToggle(arrowToggle - 1)
			setImageIndex(arrowToggle - 1)
			setAnimate(true)
			setSlideDirection('right')
		}
	}, [arrowToggle, setAnimate, setArrowToggle, setImageIndex])

	const toggleImage = useCallback(
		(index: number) => {
			setAnimate(true)
			setImageIndex(index)
			setArrowToggle(index)
			setSlideDirection(index > arrowToggle ? 'left' : 'right')
		},
		[setAnimate, setImageIndex, setArrowToggle, setSlideDirection, arrowToggle]
	)

	useEffect(() => {
		if (imageIndex !== null) {
			setImageUrl(`/images/${product.image[imageIndex].url}`)
			setCurrentIndex(null)
			setImageIndex(null)
		} else if (currentIndex !== null) {
			setImageIndex(null)
			setImageUrl(`/images/${product.variant[currentIndex].image}`)
		}
	}, [
		imageIndex,
		currentIndex,
		setImageIndex,
		product,
		setCurrentIndex,
		setImageUrl,
	])

	const [touchStartX, setTouchStartX] = useState<number | null>(null)
	const [touchEndX, setTouchEndX] = useState<number | null>(null)

	const handleTouchStart = (e: React.TouchEvent) => {
		setTouchStartX(e.targetTouches[0].clientX)
	}

	const handleTouchMove = (e: React.TouchEvent) => {
		setTouchEndX(e.targetTouches[0].clientX)
	}

	const handleTouchEnd = () => {
		if (!touchStartX || !touchEndX) return

		const swipeDistance = touchStartX - touchEndX
		const swipeThreshold = 50 // Minimum distance to consider a swipe

		if (swipeDistance > swipeThreshold) {
			handleNextClick()
		} else if (swipeDistance < -swipeThreshold) {
			handlePrevClick()
		}

		setTouchStartX(null)
		setTouchEndX(null)
	}

	return (
		<div className='flex lg:flex-row flex-col-reverse lg:sticky lg:top-5 lg:mt-3 items-center'>
			<div className='lg:w-24 z-10 lg:flex lg:justify-center lg:items-center lg:flex-col'>
				{/* Arrow Up (Previous) */}
				<div
					className={`${arrowToggle === 0 ? 'opacity-0' : ''} hidden lg:block`}
				>
					<button
						className='hover:-translate-y-1 transition-transform'
						onClick={handlePrevClick}
						aria-label='Prev'
						disabled={arrowToggle === 0}
					>
						<AiOutlineLeft className='rotate-90' />
					</button>
				</div>
				{/* Image Carousel */}
				<ul
					className='px-1 flex lg:block mt-2 lg:mt-0 lg:overflow-y-scroll xl:h-[650px]'
					ref={imagesRef}
				>
					{product.image.map((item, index) => (
						<li
							tabIndex={0}
							onClick={() => toggleImage(index)}
							className={`focus:outline-none lg:border rounded-md lg:border-gray-600 m-1 lg:m-2 lg:gap-2 cursor-pointer text-gray-500 ${
								arrowToggle === index ? 'border-red-500 text-red-500' : ''
							}`}
							key={index}
						>
							<Image
								src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/${item.url}`}
								alt={item.url}
								width={100}
								height={100}
								className='lg:h-auto hidden lg:block w-auto'
								loading='lazy'
							/>
							<GoDotFill className='lg:hidden' />
						</li>
					))}
				</ul>
				{/* Arrow Down (Next) */}
				<div
					className={`${
						arrowToggle! < countImages - 1 ? '' : 'opacity-0'
					} hidden lg:block`}
				>
					<button
						className='hover:translate-y-1 transition-transform'
						onClick={handleNextClick}
						aria-label='Next'
						disabled={arrowToggle === countImages - 1}
					>
						<AiOutlineLeft className='-rotate-90' />
					</button>
				</div>
			</div>
			{/* Main Image */}
			<div className='flex items-center justify-between lg:block max-w-[550px]'>
				<button
					onClick={handlePrevClick}
					aria-label='Prev'
					className='lg:hidden'
				>
					<AiOutlineLeft />
				</button>
				<div
					className='w-1/2 lg:w-full lg:h-auto'
					onTouchStart={handleTouchStart}
					onTouchMove={handleTouchMove}
					onTouchEnd={handleTouchEnd}
				>
					<Image
						src={imageUrl || '/images/DayLogo.svg'}
						loading='lazy'
						className={`cursor-zoom-in w-auto h-auto lg:px-24 lg:max-h-[550px] xl:max-h-[550px] object-contain ${
							animate
								? slideDirection === 'left'
									? 'animate-slide-left'
									: 'animate-slide-right'
								: ''
						}`}
						alt={product.name}
						width={355}
						height={650}
						onAnimationEnd={() => setAnimate(false)}
					/>
				</div>
				<button
					onClick={handleNextClick}
					aria-label='Next'
					className='lg:hidden'
				>
					<AiOutlineRight />
				</button>
			</div>
		</div>
	)
}
