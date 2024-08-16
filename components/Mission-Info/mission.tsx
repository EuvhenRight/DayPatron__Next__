'use client'
import { Button } from '@/components/ui/button'
import { rubikGlitch } from '@/lib/utils/font'
import { cn } from '@/lib/utils/utils'
import { motion, useAnimation, useInView } from 'framer-motion'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'

export const MissionInfo = () => {
	const router = useRouter()

	const ref = useRef(null)
	const controlsRoundBrackets = useAnimation()
	const controlsTriangle = useAnimation()
	const isInView = useInView(ref, { once: true, amount: 0.1 })

	useEffect(() => {
		if (isInView) {
			controlsRoundBrackets.start({
				x: 0,
				transition: {
					type: 'spring', // Smooth spring animation
					stiffness: 75,
					damping: 20,
				},
			})
			controlsTriangle.start({
				x: 0, // Move to center
				y: 0, // Move to center
				transition: {
					type: 'spring',
					stiffness: 75,
					damping: 20,
					delay: 0.5,
				},
			})
		}
	}, [controlsTriangle, controlsRoundBrackets, isInView])
	const toggleButton = () => {
		router.push('/about')
	}
	return (
		<div className='w-full flex flex-col items-center justify-center my-28'>
			<div>
				<h1
					ref={ref}
					className={cn(
						rubikGlitch.className,
						'text-6xl px-4 text-start text-neutral-800 flex items-center justify-start my-10'
					)}
				>
					<motion.span
						className='text-red-600'
						initial={{ x: -200 }} // Start off-screen to the left
						animate={controlsRoundBrackets}
					>
						[{' '}
					</motion.span>
					<span className='mx-2'>Наша місія</span>
					<motion.span
						className='text-red-600'
						initial={{ x: 200 }} // Start off-screen to the right
						animate={controlsRoundBrackets}
					>
						]{' '}
					</motion.span>
				</h1>
				<div
					ref={ref}
					className='bg-slate-500 grid justify-items-center relative w-full'
				>
					<motion.span
						initial={{ x: -200 }} // Start off-screen to the right
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
						initial={{ x: 200 }} // Start off-screen to the right
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
						initial={{ y: 200 }} // Start off-screen to the right
						animate={controlsTriangle}
					>
						<Image
							src={`${process.env.PUBLIC_IMAGE_URL}/lube.svg`}
							width={500}
							height={500}
							alt='mission'
						/>
					</motion.span>
				</div>
			</div>
			<Button
				variant={'destructive'}
				size={'lg'}
				className='m-5 p-2 text-white hover:scale-110 transition-all ease-in-out duration-300'
				onClick={toggleButton}
			>
				Дізнатися більше
			</Button>
		</div>
	)
}
