'use client'
import { Product } from '@prisma/client'
import Image from 'next/image'
import { useCallback, useRef } from 'react'
import { AiOutlineLeft } from 'react-icons/ai'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

interface Props {
	product: Product
	setCurrentIndex: React.Dispatch<React.SetStateAction<number>>
	currentIndex: number
	animate: boolean
	setAnimate: React.Dispatch<React.SetStateAction<boolean>>
}
const ImageBlock = ({
	product,
	currentIndex,
	setCurrentIndex,
	animate,
	setAnimate,
}: Props) => {
	// ON/OFF ANIMATION
	const countImages = product.image.length

	// REF TO IMAGE LIST
	const imagesRef = useRef<HTMLUListElement>(null)
	const handleNextClick = useCallback(() => {
		// CHECK IF CURRENT IMAGE IS NOT NULL OR UNDEFINED AND NOT ALREADY AT THE LAST IMAGE
		if (typeof currentIndex === 'number' && currentIndex < countImages - 1) {
			// INCREMENT CURRENT IMAGE TO MOVE TO THE NEXT IMAGE
			setCurrentIndex(currentIndex + 1)
			setAnimate(true)
			if (imagesRef.current) {
				const children = imagesRef.current
					.children as HTMLCollectionOf<HTMLLIElement>
				// SET FOCUS TO THE NEXT IMAGE
				children[currentIndex + 1].focus()
			}
		}
	}, [currentIndex, countImages])

	const handlePrevClick = useCallback(() => {
		// CHECK IF CURRENT IMAGE IS NOT NULL OR UNDEFINED AND NOT ALREADY AT THE FIRST IMAGE
		if (typeof currentIndex === 'number' && currentIndex > 0) {
			// DECREMENT CURRENT IMAGE TO MOVE TO THE PREVIOUS IMAGE
			setCurrentIndex(currentIndex - 1)
			setAnimate(true)
			if (imagesRef.current) {
				const children = imagesRef.current
					.children as HTMLCollectionOf<HTMLLIElement>
				// SET FOCUS TO THE PREVIOUS IMAGE
				children[currentIndex - 1].focus()
			}
		}
	}, [currentIndex])
	// TOGGLE IMAGE
	const toggleImage = useCallback(
		(index: number) => {
			if (index !== currentIndex) {
				setAnimate(true)
				setCurrentIndex(index)
			}
		},
		[currentIndex, setAnimate, setCurrentIndex]
	)
	return (
		<div className=' xl:container xl:mx-auto sticky top-0'>
			<div className='flex xl:flex-row items-center'>
				<div className='flex items-center flex-col w-24 z-10'>
					{/* ALWAYS RENDER ARROW TOP */}
					<div className={`${currentIndex === 0 ? 'opacity-0' : ''}`}>
						<button
							className='hover:-translate-y-1 transition-transform'
							onClick={() => handlePrevClick()}
							aria-label='Prev'
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
						className={`${currentIndex < countImages - 1 ? '' : 'opacity-0'}`}
					>
						<button
							className='hover:translate-y-1 transition-transform'
							onClick={handleNextClick}
							aria-label='Next'
						>
							<AiOutlineLeft className='-rotate-90' />
						</button>
					</div>
				</div>
				{/* MAIN IMAGE */}
				<div className='relative'>
					<Zoom>
						<Image
							src={
								currentIndex !== null
									? `/images/${product.image[currentIndex].url}`
									: `/images/${product.image[0].url}`
							}
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
		</div>
	)
}

export default ImageBlock
