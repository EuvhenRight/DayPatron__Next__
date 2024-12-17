import { motion } from 'framer-motion'
import { Handshake } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export const Marquee: React.FC = () => {
	// TEXT PHRASE
	const phrase = 'БАЖАЄШ СТАТИ НАШИМ ПАРТНЕРОМ?'

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
				duration: 18,
				ease: 'easeInOut',
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
				<Link className='text-white' href='/contacts'>
					{phrase}
				</Link>
				<div className='m-2'>
					<Handshake size={24} className='text-white' />
				</div>
			</motion.div>
		</div>
	)
}
