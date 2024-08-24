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
import { useEffect, useRef } from 'react'

const specifications = [
	{
		image: {
			src: '/images/container-250ml.png',
			alt: 'specification',
			width: 200,
			height: 200,
		},
		details: [
			{
				icon: Droplet,
				size: 20,
				label: '250 мл',
				className: 'ml-2 font-light',
			},
			{
				icon: MoveVertical,
				size: 20,
				label: '131 мм',
				className: 'ml-2 font-light',
			},
			{
				icon: MoveHorizontal,
				size: 20,
				label: '70 мм',
				className: 'ml-2 font-light',
			},
			{
				containerClass:
					'border border-gray-500 rounded-lg *:flex *:items-center *:my-2 flex-col',
				items: [
					{
						icon: Box,
						size: 20,
						label: '6 шт',
						className: 'ml-2 font-light',
					},
					{
						icon: Dumbbell,
						size: 20,
						label: '1.6 кг',
						className: 'ml-2 font-light',
					},
				],
			},
		],
	},
]

export const SpecificationCard = () => {
	const controls = useAnimation()
	const ref = useRef(null)
	const isInView = useInView(ref)

	useEffect(() => {
		if (isInView) {
			controls.start('visible')
		}
	}, [controls, isInView])

	const containerVariants = {
		hidden: { opacity: 0, y: 150 },
		visible: {
			opacity: 1,
			y: 0,
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
		<div className='w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-center justify-items-center gap-4 lg:gap-0'>
			{/* SPECIFICATION 100ml */}
			<motion.div
				variants={containerVariants}
				className='flex items-center justify-center bg-slate-100 p-4 rounded-lg'
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
					variants={containerVariants}
					initial='hidden'
					animate={controls}
				>
					<motion.div variants={itemVariants}>
						<Droplet size={20} />
						<span className={cn(rubikGlitch.className, 'ml-2 font-light')}>
							100 мл
						</span>
					</motion.div>
					<motion.div variants={itemVariants}>
						<MoveVertical size={20} />
						<span className='ml-2 font-light'>86 мм</span>
					</motion.div>
					<motion.div variants={itemVariants}>
						<MoveHorizontal size={20} />
						<span className='ml-2 font-light'>50 мм</span>
					</motion.div>
					<motion.div
						variants={itemVariants}
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
				variants={containerVariants}
				className='flex items-center justify-center bg-slate-100 p-4 rounded-lg'
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
					variants={containerVariants}
					initial='hidden'
					animate={controls}
				>
					<motion.div variants={itemVariants}>
						<Droplet size={20} />
						<span className={cn(rubikGlitch.className, 'ml-2 font-light')}>
							250 мл
						</span>
					</motion.div>
					<motion.div variants={itemVariants}>
						<MoveVertical size={20} />
						<span className='ml-2 font-light'>131 мм</span>
					</motion.div>
					<motion.div variants={itemVariants}>
						<MoveHorizontal size={20} />
						<span className='ml-2 font-light'>70 мм</span>
					</motion.div>
					<motion.div
						variants={itemVariants}
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
				variants={containerVariants}
				className='flex items-center justify-center bg-slate-100 p-4 rounded-lg'
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
					variants={containerVariants}
					initial='hidden'
					animate={controls}
				>
					<motion.div variants={itemVariants}>
						<Droplet size={20} />
						<span className={cn(rubikGlitch.className, 'ml-2 font-light')}>
							500 мл
						</span>
					</motion.div>
					<motion.div variants={itemVariants}>
						<MoveVertical size={20} />
						<span className='ml-2 font-light'>154 мм</span>
					</motion.div>
					<motion.div variants={itemVariants}>
						<MoveHorizontal size={20} />
						<span className='ml-2 font-light'>86 мм</span>
					</motion.div>
					<motion.div
						variants={itemVariants}
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
