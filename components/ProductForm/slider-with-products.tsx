'use client'
import { ProductsWithVariants } from '@/lib/types/types'
import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { AiOutlineLeft, AiOutlineRight } from 'react-icons/ai'
import { GoDotFill } from 'react-icons/go'
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
			setImageIndex(arrowToggle + 1)
			setAnimate(true)
			if (imagesRef.current) {
				const children = imagesRef.current
					.children as HTMLCollectionOf<HTMLLIElement>
				// SET FOCUS TO THE NEXT IMAGE
				children[arrowToggle + 1].focus()
			}
		}
	}, [arrowToggle, countImages, setAnimate, setArrowToggle, setImageIndex])

	const handlePrevClick = useCallback(() => {
		// CHECK IF CURRENT IMAGE IS NOT NULL OR UNDEFINED AND NOT ALREADY AT THE FIRST IMAGE
		if (typeof arrowToggle === 'number' && arrowToggle > 0) {
			// DECREMENT CURRENT IMAGE TO MOVE TO THE PREVIOUS IMAGE
			setArrowToggle(arrowToggle - 1)
			setImageIndex(arrowToggle - 1)
			setAnimate(true)
			if (imagesRef.current) {
				const children = imagesRef.current
					.children as HTMLCollectionOf<HTMLLIElement>
				// SET FOCUS TO THE PREVIOUS IMAGE
				children[arrowToggle - 1].focus()
			}
		}
	}, [arrowToggle, setAnimate, setArrowToggle, setImageIndex])
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
		<div className='flex lg:flex-row flex-col-reverse lg:sticky lg:top-5 lg:mt-3 items-center'>
			<div className='lg:w-24 z-10 lg:flex lg:justify-center lg:items-center lg:flex-col'>
				{/* ALWAYS RENDER ARROW TOP */}
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
				{/* IMAGES CAROUSEL */}
				<ul
					className='px-1 flex lg:block mt-2 lg:mt-0 lg:overflow-y-scroll xl:h-[650px]'
					ref={imagesRef}
				>
					{product.image.map((item, index) => {
						return (
							<li
								tabIndex={0}
								onClick={() => toggleImage(index)}
								className='focus:outline-none lg:border rounded-md lg:border-gray-600 lg:focus:ring-2 lg:focus:ring-current lg:focus:ring-inset m-1 lg:m-2 lg:gap-2 cursor-pointer focus:text-red-500 lg:focus:text-black text-gray-500'
								key={index}
							>
								<Image
									src={`${process.env.PUBLIC_IMAGE_URL}/${item.url}`}
									alt={item.url}
									width={100}
									height={100}
									className='lg:h-auto hidden lg:block w-auto'
								/>
								<GoDotFill className='lg:hidden' />
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
			<div className='flex items-center justify-between lg:block max-w-[550px]'>
				<button
					onClick={handlePrevClick}
					aria-label='Prev'
					className='lg:hidden'
				>
					<AiOutlineLeft />
				</button>
				<div className='w-1/2 lg:w-full lg:h-auto'>
					<Zoom>
						<Image
							src={imageUrl || '/images/DayLogo.svg'}
							priority={true}
							className={`cursor-zoom-in w-auto h-auto lg:px-24 lg:max-h-[500px] xl:max-h-[650px] object-contain ${
								// APPLY ANIMATION CLASS
								animate ? 'animate-slide-right' : ''
							}`}
							alt={product.name}
							width={650}
							height={355}
							onAnimationEnd={() => {
								// RESET ANIMATION CLASS
								setAnimate(false)
							}}
						/>
					</Zoom>
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
