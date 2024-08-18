import { motion } from 'framer-motion'
import Image from 'next/image'
import { useEffect, useState } from 'react'

export const Marquee: React.FC = () => {
	// TEXT PHRASE
	const phrase = 'Зроблено з гордістю в Україні'

	// State to hold the screen width
	const [isMobile, setIsMobile] = useState(false)

	// Effect to update isMobile based on screen size
	useEffect(() => {
		const updateMedia = () => {
			setIsMobile(window.innerWidth < 640) // Assuming 768px as the breakpoint for mobile
		}

		updateMedia()
		window.addEventListener('resize', updateMedia)
		return () => window.removeEventListener('resize', updateMedia)
	}, [])

	// ANIMATION VARIANTS
	const marqueeVariants = {
		animate: {
			x: isMobile
				? ['100vw', '10vw', '10vw', '-100vw']
				: ['100vw', '40vw', '40vw', '-100vw'],
			transition: {
				duration: 8,
				ease: 'linear',
				repeat: Infinity,
				times: [0, 0.2, 0.5, 1],
			},
		},
	}

	return (
		<div className='overflow-hidden whitespace-nowrap'>
			<motion.div
				className='flex items-center'
				variants={marqueeVariants}
				initial='initial'
				animate='animate'
				exit='exit'
			>
				<span className='mx-4 text-white'>{phrase}</span>
				<Image
					src='/images/ukraine.svg'
					priority={true}
					alt='Marquee'
					width={75}
					height={50}
					className='mx-4 h-8 aspect-auto'
				/>
			</motion.div>
		</div>
	)
}
