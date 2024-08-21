'use client'
import { ProductsWithVariants } from '@/lib/types/types'
import { AnimatePresence, motion, wrap } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'

interface Props {
	product: ProductsWithVariants
	imageUrl: string
	imageIndex: number
}

export const Test = ({ product, imageUrl, imageIndex }: Props) => {
	const pictures = product.image

	const variants = {
		enter: (direction: number) => {
			return {
				x: direction > 0 ? 1000 : -1000,
				opacity: 1,
			}
		},
		center: {
			zIndex: 1,
			x: 0,
			opacity: 1,
		},
		exit: (direction: number) => {
			return {
				zIndex: 0,
				x: direction < 0 ? 1000 : -1000,
				opacity: 1,
			}
		},
	}
	const swipeConfidenceThreshold = 10000
	const swipePower = (offset: number, velocity: number) => {
		return Math.abs(offset) * velocity
	}

	const [[page, direction], setPage] = useState([0, 0])
	const currentImage = wrap(0, pictures.length, page)
	console.log(currentImage)
	const paginate = (newDirection: number) => {
		setPage([page + newDirection, newDirection])
	}
	return (
		<>
			<div className='flex items-center justify-between w-full'>
				<div className='prev' onClick={() => paginate(-1)}>
					<ChevronLeft />
				</div>
				<AnimatePresence initial={false} custom={direction}>
					<motion.img
						key={page}
						src={`${imageUrl}`}
						custom={direction}
						variants={variants}
						width={250}
						height={250}
						initial='enter'
						animate='center'
						exit='exit'
						transition={{
							x: { type: 'spring', stiffness: 500, damping: 50 },
							opacity: { duration: 0.2 },
						}}
						drag='x'
						dragConstraints={{ left: 0, right: 0 }}
						dragElastic={1}
						onDragEnd={(e, { offset, velocity }) => {
							const swipe = swipePower(offset.x, velocity.x)

							if (swipe < -swipeConfidenceThreshold) {
								paginate(1)
							} else if (swipe > swipeConfidenceThreshold) {
								paginate(-1)
							}
						}}
					/>
				</AnimatePresence>
				<div className='next' onClick={() => paginate(1)}>
					<ChevronRight />
				</div>
			</div>
		</>
	)
}
