'use client'
import { Product } from '@prisma/client'
import { useState } from 'react'
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

	const next = () => {
		if (currentImage) {
			setCurrentImage(currentImage === countImages - 1 ? 0 : currentImage + 1)
		}
	}

	const toggleImage = (index: number) => {
		setAnimate(true)
		setCurrentImage(index)
	}

	return (
		<div className='flex flex-col lg:flex-row'>
			<div className='w-96 flex flex-col justify-between items-center'>
				{/* ARROW TOP */}
				<button className='hover:-translate-y-1 transition-transform'>
					<AiOutlineLeft className='rotate-90' />
				</button>
				<div className='flex flex-col items-center justify-between snap-y h-full translate-x-2'>
					{/* IMAGES CAROUSEL */}
					{product.variants.map((item, index) => {
						return (
							<div
								onClick={() => toggleImage(index)}
								className=' focus:ring-2 focus:ring-black focus:outline-none snap-center'
								key={index}
								tabIndex={0}
							>
								<img src={`/images/${item.image}`} alt='item.url' />
							</div>
						)
					})}
				</div>
				{/* ARROW BOTTOM */}
				<button className='hover:translate-y-1 transition-transform'>
					<AiOutlineLeft onClick={next} className='-rotate-90' />
				</button>
			</div>
			{/* MAIN IMAGE */}
			<div>
				<img
					src={
						currentImage !== null
							? `/images/${product.variants[currentImage].image}`
							: `/images/${product.image[0].url}`
					}
					className={`cursor-zoom-in object-cover w-96 ${
						animate ? 'animate-rotate-vert-center' : '' // Apply animation class conditionally
					}`}
					alt={product.name}
					onAnimationEnd={() => setAnimate(false)} // Reset animate state after animation ends
				/>
			</div>
		</div>
	)
}

export default ImageBlock
