'use client'
import { Product } from '@prisma/client'
import { useRef, useState } from 'react'
import { AiOutlineLeft } from 'react-icons/ai'

interface ImageBlockProps {
	product: Product
}
const ImageBlock: React.FC<ImageBlockProps> = ({
	product,
}: ImageBlockProps) => {
	const [currentImage, setCurrentImage] = useState<number | null>(null)
	const [animate, setAnimate] = useState(false)
	const countImages = product.variants.length
	const imagesRef = useRef<HTMLUListElement>(null)

	const handleNextClick = () => {
		// Check if currentImage is not null or undefined and not already at the last image
		if (typeof currentImage === 'number' && currentImage < countImages - 1) {
			setCurrentImage(currentImage + 1) // Increment currentImage to move to the next image
		}
		if (imagesRef.current) {
			imagesRef.current.focus()
			console.log('work')
		}
		setAnimate(true)
	}

	const handlePrevClick = () => {
		// Check if currentImage is not null or undefined and not already at the first image
		if (typeof currentImage === 'number' && currentImage > 0) {
			setCurrentImage(currentImage - 1) // Decrement currentImage to move to the previous image
		}
		if (imagesRef.current) {
			imagesRef.current.focus()
			console.log('work 2')
		}
		setAnimate(true)
	}

	const toggleImage = (index: number) => {
		if (index !== currentImage) {
			setAnimate(true)
			setCurrentImage(index)
		}
	}

	return (
		<div className='relative xl:container xl:mx-auto'>
			<div className='flex xl:flex-row items-center'>
				<div className='flex items-center flex-col max-h-96 w-24 z-10'>
					{/* ARROW TOP */}
					{currentImage! > 0 && (
						<button
							className='hover:-translate-y-1 transition-transform'
							onClick={() => handlePrevClick()}
							aria-label='Prev'
						>
							<AiOutlineLeft className='rotate-90' />
						</button>
					)}
					{/* IMAGES CAROUSEL */}
					<ul className='px-1' ref={imagesRef} tabIndex={0}>
						{product.variants.map((item, index) => {
							return (
								<li
									tabIndex={0}
									onClick={() => toggleImage(index)}
									className='focus:ring-2 focus:ring-black focus:outline-none snap-center m-2 gap-2 cursor-pointer'
									key={index}
								>
									<img src={`/images/${item.image}`} alt='item.url' />
								</li>
							)
						})}
					</ul>
					{/* ARROW BOTTOM */}
					{currentImage! < countImages - 1 && (
						<button
							className='hover:translate-y-1 transition-transform'
							onClick={handleNextClick}
							aria-label='Next'
						>
							<AiOutlineLeft className='-rotate-90' />
						</button>
					)}
				</div>
				{/* MAIN IMAGE */}
				<img
					src={
						currentImage !== null
							? `/images/${product.variants[currentImage].image}`
							: `/images/${product.image[0].url}`
					}
					className={`cursor-zoom-in w-auto max-h-[600px] ${
						animate ? 'animate-slide-right' : '' // Apply animation class conditionally
					}`}
					alt={product.name}
					onAnimationEnd={() => {
						setAnimate(false)
					}} // Reset animate state after animation ends
				/>
			</div>
		</div>
	)
}

export default ImageBlock
