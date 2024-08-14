'use client'
import { FeaturedCard } from '@/components/FeaturedOn/featured-card'
import data from '@/lib/db/content.json'
import { partners } from '@/lib/services/partners'
import { motion, useAnimation, useInView } from 'framer-motion'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
export const FeaturedOn = () => {
	const { FiguredOn, Partners } = data
	const controls = useAnimation()
	const ref = useRef(null)
	const isInView = useInView(ref)
	const path = usePathname()

	useEffect(() => {
		if (isInView) {
			controls.start('visible')
		}
	}, [controls, isInView])

	const containerVariants = {
		hidden: { opacity: 0 },
		visible: {
			opacity: 1,
			transition: {
				staggerChildren: 0.2, // Delay between each child animation
			},
		},
	}

	const itemVariants = {
		hidden: { opacity: 0, y: 50 },
		visible: { opacity: 1, y: 0 },
	}

	return (
		<div className='w-full flex flex-col items-center justify-center'>
			{/* DIFFERENCE TITLE */}
			{path === '/' ? (
				<h1 className='text-3xl font-black py-14 text-center  uppercase '>
					{FiguredOn}
				</h1>
			) : (
				<h1 className='text-3xl font-black py-14 text-center  uppercase '>
					{Partners}
				</h1>
			)}
			<motion.div
				className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 items-center justify-items-center'
				ref={ref}
				variants={containerVariants}
				initial='hidden'
				animate={controls}
			>
				{partners.map((item, index) => (
					<motion.div key={index}>
						<FeaturedCard item={item} variants={itemVariants} />
					</motion.div>
				))}
			</motion.div>
		</div>
	)
}
