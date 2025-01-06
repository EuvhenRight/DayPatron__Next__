'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Dispatch } from 'react'

interface Props {
	setGift: Dispatch<React.SetStateAction<boolean>>
	setShowBanner: Dispatch<React.SetStateAction<boolean>>
}

export const GiftPresents = ({ setGift, setShowBanner }: Props) => {
	const handleOpen = () => {
		setGift(false)
		setShowBanner(true)
	}
	return (
		<motion.div
			initial={{ opacity: 0, scale: 0 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0 }}
			className='fixed left-0 bottom-0 md:left-5 md:bottom-5 z-50 cursor-pointer'
			onClick={handleOpen}
		>
			<Image
				src='/icons/gift.svg'
				width={100}
				height={100}
				alt='gift'
				className='w-12 h-12 md:w-28 md:h-28'
			/>
		</motion.div>
	)
}
