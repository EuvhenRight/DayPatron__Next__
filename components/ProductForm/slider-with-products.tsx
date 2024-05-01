'use client'
import { ProductsWithVariants } from '@/lib/types/types'
import Image from 'next/image'
import { useCallback, useRef } from 'react'
import { AiOutlineLeft } from 'react-icons/ai'

interface Props {
	product: ProductsWithVariants
	imageIndex: number | null
	setImageIndex: React.Dispatch<React.SetStateAction<number | null>>
	setAnimate: React.Dispatch<React.SetStateAction<boolean>>
	animate: boolean
}
export const SliderWithProducts = ({
	product,
	imageIndex,
	setImageIndex,
	setAnimate,
	animate,
}: Props) => {
	// ON/OFF ANIMATION
	const countImages = product.image.length
	// REF TO IMAGE LIST
	const imagesRef = useRef<HTMLUListElement>(null)
	const handleNextClick = useCallback(() => {
		// CHECK IF CURRENT IMAGE IS NOT NULL OR UNDEFINED AND NOT ALREADY AT THE LAST IMAGE
		if (typeof imageIndex === 'number' && imageIndex < countImages - 1) {
			// INCREMENT CURRENT IMAGE TO MOVE TO THE NEXT IMAGE
			setImageIndex(imageIndex + 1)
			setAnimate(true)
			if (imagesRef.current) {
				const children = imagesRef.current
					.children as HTMLCollectionOf<HTMLLIElement>
				// SET FOCUS TO THE NEXT IMAGE
				children[imageIndex + 1].focus()
			}
		}
	}, [imageIndex, countImages, setAnimate, setImageIndex])

	const handlePrevClick = useCallback(() => {
		// CHECK IF CURRENT IMAGE IS NOT NULL OR UNDEFINED AND NOT ALREADY AT THE FIRST IMAGE
		if (typeof imageIndex === 'number' && imageIndex > 0) {
			// DECREMENT CURRENT IMAGE TO MOVE TO THE PREVIOUS IMAGE
			setImageIndex(imageIndex - 1)
			setAnimate(true)
			if (imagesRef.current) {
				const children = imagesRef.current
					.children as HTMLCollectionOf<HTMLLIElement>
				// SET FOCUS TO THE PREVIOUS IMAGE
				children[imageIndex - 1].focus()
			}
		}
	}, [imageIndex, setAnimate, setImageIndex])
	// TOGGLE IMAGE
	const toggleImage = useCallback(
		(index: number) => {
			setAnimate(true)
			setImageIndex(index)
		},
		[setAnimate, setImageIndex]
	)

	return (
		<div className='flex xl:flex-row items-center'>
			<div className='flex items-center flex-col w-24 z-10'>
				{/* ALWAYS RENDER ARROW TOP */}
				<div className={`${imageIndex! === 0 ? 'opacity-0' : ''}`}>
					<button
						className='hover:-translate-y-1 transition-transform'
						onClick={() => handlePrevClick()}
						aria-label='Prev'
						disabled={imageIndex === 0}
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
				<div className={`${imageIndex! < countImages - 1 ? '' : 'opacity-0'}`}>
					<button
						className='hover:translate-y-1 transition-transform'
						onClick={handleNextClick}
						aria-label='Next'
						disabled={imageIndex === countImages - 1}
					>
						<AiOutlineLeft className='-rotate-90' />
					</button>
				</div>
			</div>
		</div>
	)
}
