'use client'
import { advantageProps } from '@/lib/db/advantages'
import { motion, Variants } from 'framer-motion'
import Image from 'next/image'
interface AdvantageItem {
	icon: string
	title: string
	text: string
}

interface AdvantageProps {
	category: string
	color: string
	image: string
	items: AdvantageItem[]
}

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
	console.log(color)
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
		<div className='text-white flex justify-around items-center'>
			<div className='w-20 h-20 md:w-64 md:h-64 rounded-full bg-white shadow-xl'>
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					whileHover={{ scale: 1.1 }}
				>
					<Image
						src={image}
						alt={category}
						width={200}
						height={200}
						className='md:w-64 md:h-64 w-20 h-20'
					/>
				</motion.div>
			</div>
			{items.map((item, index) => (
				<div key={index} className='flex gap-10'>
					<motion.div
						initial='offscreen'
						whileInView='onscreen'
						variants={cardVariants}
						viewport={{ once: true, amount: 0.15 }}
						whileHover={{ scale: 1.1 }}
						className='flex flex-col items-center w-[300px] text-center'
					>
						<Image
							src={item.icon}
							alt={item.title}
							width={150}
							height={150}
							className='mr-2'
						/>
						<div>
							<h2 className={`text-xl uppercase font-bold text${color} py-4`}>
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
