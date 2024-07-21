'use client'
import { advantageProps } from '@/lib/db/advantages'
import { motion, Variants } from 'framer-motion'
import Image from 'next/image'

interface Props {
	category: string
}

export const Advantages = ({ category }: Props) => {
	// FIND PROPERTIES
	const properties = (category: string) => {
		return advantageProps.find(advantage => advantage.category === category)
	}
	// DESTRUCTURE PROPERTIES
	const { image, items, color } = properties(category)!

	if (!properties) {
		console.error(`Properties not found for category: ${category}`)
		return null
	}

	const colorVariants = {
		oil: 'text-amber-600',
		copper: 'text-sky-500',
		clp: 'text-lime-500',
		protect: 'text-yellow-500',
		carbon: 'text-sky-500',
		liquidator: 'text-gray-100',
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
		<div className='text-white flex flex-col md:flex-row justify-around items-center'>
			<div className='lg:w-40 lg:h-40 w-20 h-20 rounded-full bg-white shadow-xl'>
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
						className='flex flex-col items-center w-[140px] lg:w-[280px] text-center'
					>
						<Image
							src={item.icon}
							alt={item.title}
							width={150}
							height={150}
							className='mr-2 lg:w-36 lg:h-36 w-16 h-16'
						/>
						<div>
							<h2
								className={`${color} text-sm lg:text-xl uppercase font-bold py-4`}
							>
								{item.title}
							</h2>
							<p className='font-light text-sm lg:text-lg'>{item.text}</p>
						</div>
					</motion.div>
				</div>
			))}
		</div>
	)
}
