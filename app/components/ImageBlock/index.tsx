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
	console.log(currentImage)
	const toggleImage = (index: number) => {
		setCurrentImage(index)
	}

	return (
		<div className='flex flex-col lg:flex-row'>
			<div className='flex flex-col items-center justify-between'>
				{/* ARROW TOP */}
				<button className='hover:-translate-y-1 transition-transform'>
					<AiOutlineLeft className='rotate-90' />
				</button>
				{/* IMAGES CAROUSEL */}
				{product.variants.map((item, index) => {
					return (
						<div
							onClick={() => toggleImage(index)}
							className='w-28 h-auto focus:ring-2 focus:ring-black focus:outline-none'
							key={index}
							tabIndex={0}
						>
							<img src={`/images/${item.image}`} alt='item.url' />
						</div>
					)
				})}
				{/* ARROW BOTTOM */}
				<button className='hover:translate-y-1 transition-transform'>
					<AiOutlineLeft className='-rotate-90' />
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
					className='w-1/2 h-auto object-cover'
					alt={product.name}
				/>
			</div>
		</div>
	)
}

export default ImageBlock
