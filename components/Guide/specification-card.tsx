'use client'
import { rubikGlitch } from '@/lib/utils/font'
import { cn } from '@/lib/utils/utils'
import { motion, useAnimation, useInView } from 'framer-motion'
import {
	Box,
	Droplet,
	Dumbbell,
	MoveHorizontal,
	MoveVertical,
} from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

export const SpecificationCard = () => {
	const [isMobile, setIsMobile] = useState(false)
	const controls = useAnimation()
	const ref = useRef(null)
	const isInView = useInView(ref)

	// Update screen size state on window resize TODO: fix animation
	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth <= 768)
		}

		// Set initial screen size
		handleResize()

		// Add event listener for resize
		window.addEventListener('resize', handleResize)

		// Cleanup event listener on component unmount
		return () => window.removeEventListener('resize', handleResize)
	}, [])

	// ANIMATION VARIANTS
	useEffect(() => {
		if (isInView) {
			controls.start('visible')
		}
	}, [controls, isInView])

	const containerVariants = {
		hidden: { opacity: 0, y: 50 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				staggerChildren: 0.2, // Delay between each child animation
			},
		},
		mobile: {
			hidden: { opacity: 1, y: 0 },
			visible: {
				opacity: 1,
				y: 0,
				transition: {
					staggerChildren: 0.2, // Delay between each child animation
				},
			},
		},
	}

	const itemVariants = {
		hidden: { opacity: 0, y: 50 },
		visible: { opacity: 1, y: 0 },
		mobile: {
			hidden: { opacity: 1, y: 50 },
			visible: { opacity: 1, y: 0 },
		},
	}

	// Use the appropriate variants based on screen size
	const containerVariant = isMobile
		? containerVariants.mobile
		: containerVariants
	const itemVariant = isMobile ? itemVariants.mobile : itemVariants

	return (
		<div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center justify-items-center gap-4 lg:gap-0'>
			{/* SPECIFICATION 100ml */}
			<motion.div
				variants={containerVariant}
				className='flex items-center justify-center bg-slate-100 p-8 rounded-lg'
			>
				<Image
					src='/images/container-100ml.png'
					alt='specification'
					width={200}
					height={200}
				/>
				<motion.div
					className='*:flex *:items-center *:my-4'
					ref={ref}
					variants={containerVariant}
					initial='hidden'
					animate={controls}
				>
					<motion.div variants={itemVariant}>
						<Droplet size={20} />
						<span className={cn(rubikGlitch.className, 'ml-2 font-light')}>
							100 мл
						</span>
					</motion.div>
					<motion.div variants={itemVariant}>
						<MoveVertical size={20} />
						<span className='ml-2 font-light'>86 мм</span>
					</motion.div>
					<motion.div variants={itemVariant}>
						<MoveHorizontal size={20} />
						<span className='ml-2 font-light'>50 мм</span>
					</motion.div>
					<motion.div
						variants={itemVariant}
						className='border border-gray-500 rounded-lg *:flex *:items-center *:my-2 flex-col'
					>
						<div>
							<Box size={20} />
							<span className='ml-2 font-light'>12 шт</span>
						</div>
						<div>
							<Dumbbell size={20} />
							<span className='ml-2 font-light'>1.3 кг</span>
						</div>
					</motion.div>
				</motion.div>
			</motion.div>
			{/* SPECIFICATION 250ml */}
			<motion.div
				variants={containerVariant}
				className='flex items-center justify-center bg-slate-100 p-8 rounded-lg'
			>
				<Image
					src='/images/container-250ml.png'
					alt='specification'
					width={200}
					height={200}
				/>
				<motion.div
					className='*:flex *:items-center *:my-4'
					ref={ref}
					variants={containerVariant}
					initial='hidden'
					animate={controls}
				>
					<motion.div variants={itemVariant}>
						<Droplet size={20} />
						<span className={cn(rubikGlitch.className, 'ml-2 font-light')}>
							250 мл
						</span>
					</motion.div>
					<motion.div variants={itemVariant}>
						<MoveVertical size={20} />
						<span className='ml-2 font-light'>131 мм</span>
					</motion.div>
					<motion.div variants={itemVariant}>
						<MoveHorizontal size={20} />
						<span className='ml-2 font-light'>70 мм</span>
					</motion.div>
					<motion.div
						variants={itemVariant}
						className='border border-gray-500 rounded-lg *:flex *:items-center *:my-2 flex-col'
					>
						<div>
							<Box size={20} />
							<span className='ml-2 font-light'>6 шт</span>
						</div>
						<div>
							<Dumbbell size={20} />
							<span className='ml-2 font-light'>1.6 кг</span>
						</div>
					</motion.div>
				</motion.div>
			</motion.div>
			{/* SPECIFICATION 500ml */}
			<motion.div
				variants={containerVariant}
				className='flex items-center justify-center bg-slate-100 p-8 rounded-lg'
			>
				<Image
					src='/images/container-500ml.png'
					alt='specification'
					width={200}
					height={200}
				/>
				<motion.div
					className='*:flex *:items-center *:my-4'
					ref={ref}
					variants={containerVariant}
					initial='hidden'
					animate={controls}
				>
					<motion.div variants={itemVariant}>
						<Droplet size={20} />
						<span className={cn(rubikGlitch.className, 'ml-2 font-light')}>
							500 мл
						</span>
					</motion.div>
					<motion.div variants={itemVariant}>
						<MoveVertical size={20} />
						<span className='ml-2 font-light'>154 мм</span>
					</motion.div>
					<motion.div variants={itemVariant}>
						<MoveHorizontal size={20} />
						<span className='ml-2 font-light'>86 мм</span>
					</motion.div>
					<motion.div
						variants={itemVariant}
						className='border border-gray-500 rounded-lg *:flex *:items-center *:my-2 flex-col'
					>
						<div>
							<Box size={20} />
							<span className='ml-2 font-light'>4 шт</span>
						</div>
						<div>
							<Dumbbell size={20} />
							<span className='ml-2 font-light'>2.1 кг</span>
						</div>
					</motion.div>
				</motion.div>
			</motion.div>
		</div>
	)
}
