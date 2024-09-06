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
					width={0}
					height={0}
					alt='clean'
					className='w-[500px] h-auto'
				/>
			</motion.span>
			<motion.span
				initial={{ x: 200, scale: 0 }} // Start off-screen to the right
				animate={controlsTriangle}
				className='absolute'
			>
				<Image
					src={`${process.env.PUBLIC_IMAGE_URL}/protect.svg`}
					width={0}
					height={0}
					alt='protect'
					className='w-[500px] h-auto'
				/>
			</motion.span>
			<motion.span
				initial={{ y: 200, scale: 0 }} // Start off-screen to the bottom
				animate={controlsTriangle}
			>
				<Image
					src={`${process.env.PUBLIC_IMAGE_URL}/lube.svg`}
					width={0}
					height={0}
					alt='lube'
					className='w-[500px] h-auto'
				/>
			</motion.span>
			<motion.div
				animate={controlsBoll}
				initial={{ scale: 0.1 }}
				className={cn(
					rubikGlitch.className,
					// base screen styling
					`text-lg font-bold absolute top-[20%] left-[29%] 
					rounded-full hover:scale-105 transition-all ease-in-out duration-300 w-36 h-36 text-center items-center justify-center flex text-white bg-neutral-800 p-2`,
					// mobile screen styling
					`min-[412px]:left-[29%] min-[412px]:top-[20%] min-[412px]:w-40 min-[412px]:h-40`,
					// mobile screen styling
					`min-[475px]:left-[31%] min-[475px]:top-[22%] min-[475px]:w-44 min-[475px]:h-44`,
					`min-[600px]:left-[33%] min-[600px]:top-[22%] min-[600px]:w-48 min-[600px]:h-48`,
					// small screen styling
					`sm:top-[22%] sm:left-[35%]`,
					// medium screen styling
					`md:top-[22%] md:text-2xl md:left-[39%]`,
					// manual screen styling
					`min-[925px]:left-[39%] min-[925px]:top-[23%] min-[925px]:w-48 min-[925px]:h-48`,
					// large screen styling
					`lg:top-[22%] lg:left-[41%]`,
					// extra large screen styling
					`xl:top-[22%] xl:left-[43%] xl:text-white xl:hover:text-neutral-800 xl:hover:bg-white xl:hover:border-[10px] xl:hover:border-neutral-800 xl:hover:scale-105 xl:hover:shadow-neutral-800`
				)}
			>
				<Link href='/guide'>Як це працює?</Link>
			</motion.div>
		</div>
	)
}
