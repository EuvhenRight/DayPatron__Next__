'use client'
import { geologica } from '@/lib/utils/font'
import { advantageLibrary } from '@/lib/utils/partners-library'
import { cn } from '@/lib/utils/utils'
import { motion, Variants } from 'framer-motion'
import Image from 'next/image'

interface Props {
	category: string
}

export const Advantages = ({ category }: Props) => {
	// FIND PROPERTIES
	const properties = (category: string) => {
		return advantageLibrary.find(advantage => advantage.category === category)
	}
	// DESTRUCTURE PROPERTIES
	const { image, items, color } = properties(category)!

	if (!properties) {
		console.error(`Properties not found for category: ${category}`)
		return null
	}

	// ANIMATION
	const cardVariants: Variants = {
		offscreen: {
			y: 300,
			opacity: 0,
		},
		onscreen: {
			y: 0,
			opacity: 1,
			transition: {
				type: 'spring',
				bounce: 0.4,
				duration: 0.8,
			},
		},
	}

	return (
		<div className='text-white flex flex-col lg:flex-row w-full sm:w-1/2 lg:w-full justify-around items-center'>
			<div className='rounded-full bg-white shadow-xl'>
				<Image
					src={image}
					alt={category}
					width={200}
					height={200}
					className='lg:w-40 lg:h-40 w-20 h-20'
				/>
			</div>
			{items.map((item, index) => (
				<div key={index} className='flex gap-10 pt-6 lg:pt-0'>
					<motion.div
						initial='offscreen'
						whileInView='onscreen'
						variants={cardVariants}
						viewport={{ once: true, amount: 0.15 }}
						whileHover={{ scale: 1.1 }}
						className='flex flex-col items-center lg:w-[280px] sm:w-140 w-full text-center'
					>
						<Image
							src={item.icon}
							alt={item.title}
							width={150}
							height={150}
							className='mr-2 lg:w-36 lg:h-36 w-28 h-28'
							priority
						/>
						<div>
							<h2
								className={cn(
									geologica.className,
									`${color} text-lg lg:text-2xl uppercase font-extrabold py-4`
								)}
							>
								{item.title}
							</h2>
							<p className='font-light text-lg'>{item.text}</p>
						</div>
					</motion.div>
				</div>
			))}
		</div>
	)
}
