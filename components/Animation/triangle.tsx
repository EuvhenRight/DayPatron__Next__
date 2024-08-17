import { rubikGlitch } from '@/lib/utils/font'
import { cn } from '@/lib/utils/utils'
import { motion, useAnimation, useInView } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef } from 'react'

export const TriangleAnimation = () => {
	const ref = useRef(null)
	const controlsBoll = useAnimation()
	const controlsTriangle = useAnimation()
	const isInView = useInView(ref, { once: true, amount: 0.35 })

	useEffect(() => {
		if (isInView) {
			controlsTriangle.start({
				x: 0, // Move to center
				y: 0, // Move to center
				scale: 1, // Scale to 100%
				transition: {
					type: 'spring',
					stiffness: 75,
					damping: 20,
					delay: 0.5,
				},
			})
			controlsBoll.start({
				scale: [1, 1.2, 1], // Scaling sequence: initial (100%), then 120%, then back to 100%
				transition: {
					duration: 1.5, // Total duration for the entire sequence
					times: [0, 0.5, 1], // When each step should occur (in % of duration)
					ease: 'easeInOut', // Smooth easing
					delay: 0.5,
					type: 'spring',
					stiffness: 50,
					damping: 50,
				},
			})
		}
	}, [controlsTriangle, controlsBoll, isInView])
	return (
		<div ref={ref} className='grid justify-items-center relative my-14 w-full'>
			<motion.span
				initial={{ x: -200, scale: 0 }} // Start off-screen to the left
				animate={controlsTriangle}
				className='absolute'
			>
				<Image
					src={`${process.env.PUBLIC_IMAGE_URL}/clean.svg`}
					width={500}
					height={500}
					alt='mission'
				/>
			</motion.span>
			<motion.span
				initial={{ x: 200, scale: 0 }} // Start off-screen to the right
				animate={controlsTriangle}
				className='absolute'
			>
				<Image
					src={`${process.env.PUBLIC_IMAGE_URL}/protect.svg`}
					width={500}
					height={500}
					alt='mission'
				/>
			</motion.span>
			<motion.span
				initial={{ y: 200, scale: 0 }} // Start off-screen to the bottom
				animate={controlsTriangle}
			>
				<Image
					src={`${process.env.PUBLIC_IMAGE_URL}/lube.svg`}
					width={500}
					height={500}
					alt='mission'
				/>
			</motion.span>
			<motion.div
				animate={controlsBoll}
				initial={{ scale: 0.1 }}
				className={cn(
					rubikGlitch.className,
					'text-2xl font-bold absolute top-[23%] left-[43%] rounded-full border-[20px] border-neutral-800  text-neutral-800 hover:text-white hover:bg-neutral-800 hover:scale-105 transition-all ease-in-out duration-300 w-48 h-48 flex text-center items-center'
				)}
			>
				<Link href='/guide'>Як це працює?</Link>
			</motion.div>
		</div>
	)
}
