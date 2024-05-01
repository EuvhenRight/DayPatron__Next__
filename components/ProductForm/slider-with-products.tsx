'use client'
import { ProductsWithVariants } from '@/lib/types/types'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { AiOutlineLeft } from 'react-icons/ai'
import Zoom from 'react-medium-image-zoom'

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
	// ON/OFF ANIMATION
	const countImages = product.image.length
	// REF TO IMAGE LIST
	const imagesRef = useRef<HTMLUListElement>(null)
	const handleNextClick = useCallback(() => {
		// CHECK IF CURRENT IMAGE IS NOT NULL OR UNDEFINED AND NOT ALREADY AT THE LAST IMAGE
		if (typeof arrowToggle === 'number' && arrowToggle < countImages - 1) {
			// INCREMENT CURRENT IMAGE TO MOVE TO THE NEXT IMAGE
			setArrowToggle(arrowToggle + 1)
			setAnimate(true)
			if (imagesRef.current) {
				const children = imagesRef.current
					.children as HTMLCollectionOf<HTMLLIElement>
				// SET FOCUS TO THE NEXT IMAGE
				children[arrowToggle + 1].focus()
			}
		}
	}, [arrowToggle, countImages, setAnimate, setArrowToggle])

	const handlePrevClick = useCallback(() => {
		// CHECK IF CURRENT IMAGE IS NOT NULL OR UNDEFINED AND NOT ALREADY AT THE FIRST IMAGE
		if (typeof arrowToggle === 'number' && arrowToggle > 0) {
			// DECREMENT CURRENT IMAGE TO MOVE TO THE PREVIOUS IMAGE
			setArrowToggle(arrowToggle - 1)
			setAnimate(true)
			if (imagesRef.current) {
				const children = imagesRef.current
					.children as HTMLCollectionOf<HTMLLIElement>
				// SET FOCUS TO THE PREVIOUS IMAGE
				children[arrowToggle - 1].focus()
			}
		}
	}, [arrowToggle, setAnimate, setArrowToggle])
	// TOGGLE IMAGE
	const toggleImage = useCallback(
		(index: number) => {
			setAnimate(true)
			setImageIndex(index)
			setArrowToggle(index)
		},
		[setAnimate, setImageIndex, setArrowToggle]
	)

	// SET CURRENT IMAGE
	useEffect(() => {
		if (imageIndex !== null) {
			setImageUrl(`/images/${product.image[imageIndex!].url}`)
			setCurrentIndex(null)
			setImageIndex(null)
		} else if (currentIndex === 2) {
			setImageIndex(null)
			setImageUrl(`/images/${product.variant[currentIndex].image}`)
		} else if (currentIndex === 1) {
			setImageIndex(null)
			setImageUrl(`/images/${product.variant[currentIndex].image}`)
		} else if (currentIndex === 0) {
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

	return (
		<div className='flex xl:flex-row lg:sticky top-5 mt-3'>
			<div className='flex items-center flex-col w-24 z-10'>
				{/* ALWAYS RENDER ARROW TOP */}
				<div
					className={`${arrowToggle === 0 ? 'opacity-0' : ''} hidden lg:block`}
				>
					<button
						className='hover:-translate-y-1 transition-transform'
						onClick={() => handlePrevClick()}
						aria-label='Prev'
						disabled={arrowToggle === 0}
					>
						<AiOutlineLeft className='rotate-90' />
					</button>
				</div>
				{/* IMAGES CAROUSEL */}
				<ul className='px-1 overflow-y-scroll max-h-[650px]' ref={imagesRef}>
					{product.image.map((item, index) => {
						return (
							<li
								tabIndex={0}
								onClick={() => toggleImage(index)}
								className='focus:outline-none border border-gray-600 focus:ring-2 focus:ring-current focus:ring-inset m-2 gap-2 cursor-pointer'
								key={index}
							>
								<Image
									src={`/images/${item.url}`}
									alt='item.url'
									width={100}
									height={100}
								/>
							</li>
						)
					})}
				</ul>
				{/* ALWAYS RENDER ARROW BOTTOM */}
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
			{/* MAIN IMAGE */}
			<div className='w-full'>
				<Zoom>
					<Image
						src={imageUrl}
						className={`cursor-zoom-in w-auto px-24 max-h-[650px] ${
							// APPLY ANIMATION CLASS
							animate ? 'animate-slide-right' : ''
						}`}
						style={{ objectFit: 'contain' }} // Ensure the image fits within the container
						alt={product.name}
						width={1000}
						height={650}
						onAnimationEnd={() => {
							// RESET ANIMATION CLASS
							setAnimate(false)
						}}
					/>
				</Zoom>
			</div>
		</div>
	)
}
