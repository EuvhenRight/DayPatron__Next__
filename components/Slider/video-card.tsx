'use client'
import { YouTubeEmbed } from '@next/third-parties/google'
import { motion } from 'framer-motion'
interface Props {
	videoId: string
	title: string
	description: string
}

export const VideoCard = ({ videoId, title, description }: Props) => {
	const animateVariants = {
		offscreen: {
			y: 200,
			opacity: 0,
			scale: 0,
		},
		onscreen: {
			y: 0,
			opacity: 1,
			scale: 1,
		},
	}
	return (
		<div className='flex flex-col items-center p-4 w-full  lg:w-[500px]'>
			<h3 className='text-xl font-extrabold py-8 text-center'>{title}</h3>
			<motion.div
				initial='offscreen'
				whileInView='onscreen'
				variants={animateVariants}
				viewport={{ once: true, amount: 0.15 }}
				className='w-full'
			>
				<YouTubeEmbed
					videoid={videoId}
					params='controls=1'
					playlabel='Play'
					style='border-radius: 20px; border: 1px solid #ccc; box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1); display: block; margin: 0 auto; max-width: 100%;'
				/>
			</motion.div>
			<p className='text-sm text-justify pt-4'>{description}</p>
		</div>
	)
}
