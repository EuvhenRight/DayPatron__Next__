'use client'
import { ContentData } from '@/lib/types/contentTypes'
import { rubikDirt } from '@/lib/utils/font'
import { cn } from '@/lib/utils/utils'
import { motion, useAnimation, useInView } from 'framer-motion'
import { Move3D } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef } from 'react'
interface Props {
	data: ContentData
	year: number
}
export const AboutBlockContent = ({ data, year }: Props) => {
	const ref = useRef(null)
	const isInView = useInView(ref, { once: true, amount: 0.35 })
	// ANIMATION
	const controlAbout = useAnimation()

	useEffect(() => {
		if (isInView) {
			controlAbout.start({
				x: 0, // MOVE TO CENTER
				y: 0, // MOVE TO CENTER
				scale: 1, // SCALE TO 100%
				transition: {
					type: 'spring',
					stiffness: 50,
					damping: 10,
					duration: 0.8,
					delay: 0.5,
				},
			})
		}
	}, [controlAbout, isInView])
	return (
		<div ref={ref}>
			{/* 2024 */}
			<div className='w-full flex flex-row justify-between items-center my-7'>
				<div className='w-2 h-12 mr-4 bg-red-500'></div>
				<h1 className={cn(rubikDirt.className, 'text-3xl font-black')}>
					{year}
				</h1>
				<div className='bg-gray-400 max-w-full w-full ml-4 h-[1px]'></div>
			</div>
			<div className='grid grid-cols-1 md:grid-cols-3 gap-4 justify-items-center '>
				{year === 2024 && (
					<>
						<div className='border shadow-lg p-4 border-spacing-1 rounded-md italic'>
							{data[2024].AboutFirstBlock.text}
						</div>
						<div className='border shadow-lg p-4 border-spacing-1 rounded-md'>
							{data[2024].AboutSecondBlock.textSecond}
						</div>
						<motion.div
							initial={{ x: '100vw', scale: 0 }}
							animate={controlAbout}
							className='flex flex-col items-center justify-around relative'
						>
							<Image
								src={data[2024].AboutImageBlock.image}
								alt='2024'
								width={250}
								height={250}
								className='rounded-full m-5'
							/>
							<p className='absolute left-0 bottom-0'>
								<Move3D size={100} />
							</p>
						</motion.div>
					</>
				)}
				{/* 2023 */}
				{year === 2023 && (
					<>
						<motion.div
							initial={{ x: '-100vw', scale: 0 }}
							animate={controlAbout}
							className='flex flex-col items-center justify-around'
						>
							<Image
								src={data[2023].AboutImageBlock.image}
								alt='2023'
								width={200}
								height={200}
							/>
							<h2 className='text-xl font-extrabold text-center'>
								{data[2023].AboutImageBlock.titleH1?.toUpperCase()}
							</h2>
							<p className='text-center font-bold pt-2'>
								{data[2023].AboutImageBlock.title}
							</p>
						</motion.div>
						<div className='border shadow-lg p-4 border-spacing-1 rounded-md italic'>
							{data[2023].AboutFirstBlock.text}
						</div>
						<div className='border shadow-lg p-4 border-spacing-1 rounded-md'>
							{data[2023].AboutSecondBlock.textSecond}
						</div>
					</>
				)}
				{/* 2022 */}
				{year === 2022 && (
					<>
						<div className='border shadow-lg p-4 border-spacing-1 rounded-md italic'>
							{data[2022].AboutFirstBlock.text}
						</div>
						<motion.div
							initial={{ y: '100vw', scale: 0 }}
							animate={controlAbout}
							className='flex flex-col items-center justify-around'
						>
							<h2 className='text-3xl font-black text-center my-3'>
								{data[2022].AboutImageBlock.titleH1?.toUpperCase()}
							</h2>
							<Image
								src={data[2022].AboutImageBlock.image}
								alt='2022'
								width={400}
								height={200}
							/>
						</motion.div>
						<div className='border shadow-lg p-4 border-spacing-1 rounded-md'>
							{data[2022].AboutSecondBlock.textSecond}
						</div>
					</>
				)}
			</div>
		</div>
	)
}
