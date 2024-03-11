'use client'
import { Product } from '@prisma/client'
import { memo, useCallback, useRef } from 'react'
import { AiOutlineClose, AiOutlineLeft } from 'react-icons/ai'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

interface ImageBlockProps {
	product: Product
	setCurrentIndex: React.Dispatch<React.SetStateAction<number>>
	currentIndex: number
	animate: boolean
	setAnimate: React.Dispatch<React.SetStateAction<boolean>>
}
const ImageBlock: React.FC<ImageBlockProps> = memo(
	({
		product,
		currentIndex,
		setCurrentIndex,
		animate,
		setAnimate,
	}: ImageBlockProps) => {
		// ON/OFF ANIMATION
		const countImages = product.variants.length
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
					<div className='flex items-center flex-col max-h-96 w-24 z-10'>
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
						<ul className='px-1' ref={imagesRef}>
							{product.variants.map((item, index) => {
								return (
									<li
										tabIndex={0}
										onClick={() => toggleImage(index)}
										className='focus:ring-black focus:outline-none dark:focus:ring-2 dark:focus:ring-gray-200 focus:snap-center m-2 gap-2 cursor-pointer'
										key={index}
									>
										<img src={`/images/${item.image}`} alt='item.url' />
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
						<Zoom IconUnzoom={AiOutlineClose}>
							<img
								src={
									currentIndex !== null
										? `/images/${product.variants[currentIndex].image}`
										: `/images/${product.image[0].url}`
								}
								className={`cursor-zoom-in w-auto px-24 max-h-[650px] ${
									// APPLY ANIMATION CLASS
									animate ? 'animate-slide-right' : ''
								}`}
								style={{ width: '100%', height: 'auto', objectFit: 'contain' }} // Ensure the image fits within the container
								alt={product.name}
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
)

export default ImageBlock
