'use client'
import { Button } from '@/components/ui/button'
import { rubikGlitch } from '@/lib/utils/font'
import { cn } from '@/lib/utils/utils'
import { motion, useAnimation, useInView } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'

export const MissionInfo = () => {
	const router = useRouter()

	const ref = useRef(null)
	const controls = useAnimation()
	const isInView = useInView(ref, { once: true, amount: 0.1 })

	useEffect(() => {
		if (isInView) {
			controls.start({
				x: 0, // Move to center
				transition: {
					type: 'spring', // Smooth spring animation
					stiffness: 100,
					damping: 20,
				},
			})
		}
	}, [controls, isInView])
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
						'text-6xl',
						'px-4',
						'text-start',
						'text-neutral-800',
						'flex',
						'items-center',
						'justify-start',
						'my-10'
					)}
				>
					<motion.span
						className='text-red-600'
						initial={{ x: -200 }} // Start off-screen to the left
						animate={controls}
					>
						[{' '}
					</motion.span>
					<span className='mx-2'>Наша місія</span>
					<motion.span
						className='text-red-600'
						initial={{ x: 200 }} // Start off-screen to the right
						animate={controls}
					>
						]{' '}
					</motion.span>
				</h1>
				<p className='text-center text-lg rounded-b-lg bg-neutral-700 sm:rounded-r-lg  p-4 text-white'>
					DAY Patron – ідеальний супутник для тих, хто цінує бездоганність та
					догляд за своєю зброєю. Ми віримо, що кожен заслуговує використовувати
					продукти вищого класу, і наша ціль – зробити це доступним для всіх.
				</p>
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
